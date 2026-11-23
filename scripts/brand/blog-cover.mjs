#!/usr/bin/env node
// Draws a blog post's cover (1280x720) and share image (1200x630) in the
// Yatagarasu brand: the kit's sky, the crow's bust facing into the words, the
// horizontal lockup, a gold kicker and the headline as Figtree outlines.
//
//   node scripts/brand/blog-cover.mjs --kit <brand kit dir> --tools <dir> \
//     --slug <post slug> --kicker "November 2026" --title "First line|Second line"
//
// --tools is a folder whose node_modules has opentype.js (an authoring tool;
// the site does not depend on it). Kit files are checked against the kit's
// manifest before use. Output: src/public/blog/<slug>/{cover,og}.jpg.
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const args = process.argv.slice(2)
const option = name => {
  const index = args.indexOf(name)
  return index === -1 ? undefined : args[index + 1]
}
const kit = option('--kit')
const tools = option('--tools')
const slug = option('--slug')
const kicker = option('--kicker')
const title = option('--title')
if (!kit || !tools || !slug || !kicker || !title || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('Usage: blog-cover.mjs --kit <dir> --tools <dir> --slug <slug> --kicker <text> --title "<line>|<line>"')
  process.exit(2)
}

const sha256 = buffer => createHash('sha256').update(buffer).digest('hex')
const manifest = JSON.parse(readFileSync(join(kit, 'manifest.json')))
const kitHashes = new Map(manifest.files.map(file => [file.path, file.sha256]))
const readKit = path => {
  const bytes = readFileSync(join(kit, path))
  if (kitHashes.get(path) !== sha256(bytes)) throw new Error(`${path} does not match the kit manifest`)
  return bytes
}

const sharp = createRequire(join(root, 'package.json'))('sharp')
const opentype = createRequire(join(resolve(tools), 'package.json'))('opentype.js')
const figtree = weight => {
  const bytes = readKit(`fonts/figtree-${weight}.ttf`)
  return opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))
}
const bold = figtree(700)
const semibold = figtree(600)
const outline = (font, text, x, y, size) => font.getPath(text, x, y, size).toPathData(2)
const lockupBody = readKit('masters/fearless-lockup-horizontal.svg').toString('utf8')
  .replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')

// Laid out once at 1280x720; the share image is the same picture scaled to
// 1200 wide with its top and bottom trimmed, so every word keeps 60 px clear.
const width = 1280
const height = 720
const lines = title.split('|')
const titleSize = 66
const titleLead = 78
const titleTop = 300
for (const line of lines) {
  const advance = bold.getAdvanceWidth(line, titleSize)
  if (advance > 600) throw new Error(`Headline line is ${Math.round(advance)} px wide (at most 600): ${line}`)
}
if (titleTop + titleLead * (lines.length - 1) > 600) throw new Error('Headline has too many lines')

const sky = await sharp(readKit('png/sky/sky-card.jpg')).resize(width, height, { fit: 'cover' }).toBuffer()
const bust = await sharp(readKit('hero/bust.png'))
  .resize({ width: 760 })
  .extract({ left: 0, top: 20, width: 680, height: height })
  .toBuffer()
const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
<defs>
<linearGradient id="shade" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#120A2E" stop-opacity="0.95"/><stop offset="0.5" stop-color="#120A2E" stop-opacity="0.86"/><stop offset="0.66" stop-color="#120A2E" stop-opacity="0"/></linearGradient>
<linearGradient id="floor" x1="0" x2="0" y1="0" y2="1"><stop offset="0.72" stop-color="#120A2E" stop-opacity="0"/><stop offset="1" stop-color="#120A2E" stop-opacity="0.8"/></linearGradient>
</defs>
<rect width="${width}" height="${height}" fill="url(#shade)"/>
<rect width="${width}" height="${height}" fill="url(#floor)"/>
<g transform="translate(84 96) scale(0.5)">${lockupBody}</g>
<path fill="#FFC24A" d="${outline(semibold, kicker.toUpperCase(), 84, 232, 26)}"/>
${lines.map((line, index) => `<path fill="#FAF6FF" d="${outline(bold, line, 84, titleTop + titleLead * index, titleSize)}"/>`).join('\n')}
</svg>`)
const cover = await sharp(sky)
  .composite([
    { input: bust, left: width - 680, top: 0 },
    { input: overlay, left: 0, top: 0 },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toBuffer()
const og = await sharp(cover)
  .resize({ width: 1200 })
  .extract({ left: 0, top: Math.round((675 - 630) / 2), width: 1200, height: 630 })
  .jpeg({ quality: 82, mozjpeg: true })
  .toBuffer()

const folder = join(root, 'src/public/blog', slug)
mkdirSync(folder, { recursive: true })
writeFileSync(join(folder, 'cover.jpg'), cover)
writeFileSync(join(folder, 'og.jpg'), og)
console.log(`src/public/blog/${slug}/cover.jpg ${cover.length} bytes ${sha256(cover)}`)
console.log(`src/public/blog/${slug}/og.jpg ${og.length} bytes ${sha256(og)}`)
