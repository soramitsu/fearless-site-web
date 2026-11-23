#!/usr/bin/env node
// Copies the Fearless x Yatagarasu brand kit's files into the site and records
// where each one came from. The kit itself is not committed anywhere: the
// site keeps the copies plus docs/brand-asset-provenance.json.
//
//   node scripts/brand/sync-brand-assets.mjs --kit <brand kit dir> --tools <dir>
//   node scripts/brand/sync-brand-assets.mjs --check
//
// --ffmpeg names the ffmpeg binary (default: ffmpeg on PATH); it encodes the
// launch clip for the web.
// --tools is a folder whose node_modules has opentype.js and wawoff2 (they
// turn the kit's Figtree TTFs into WOFF2 and the share image's words into
// outlines). They are authoring tools only; the site does not depend on them.
// --check needs neither: it verifies that the committed files still match the
// recorded hashes.
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const provenancePath = join(root, 'docs/brand-asset-provenance.json')
const sha256 = buffer => createHash('sha256').update(buffer).digest('hex')

const args = process.argv.slice(2)
const option = name => {
  const index = args.indexOf(name)
  return index === -1 ? undefined : args[index + 1]
}

if (args.includes('--check')) {
  const provenance = JSON.parse(readFileSync(provenancePath, 'utf8'))
  let failed = false
  for (const { path, sha256: expected } of provenance.files) {
    const file = join(root, path)
    const actual = existsSync(file) ? sha256(readFileSync(file)) : 'missing'
    if (actual !== expected) {
      console.error(`${path}: expected ${expected}, found ${actual}`)
      failed = true
    }
  }
  if (failed) process.exit(1)
  console.log(`Brand assets match the recorded kit (${provenance.kit.manifestSha256.slice(0, 12)}…): ${provenance.files.length} files.`)
  process.exit(0)
}

const kit = option('--kit')
const tools = option('--tools')
if (!kit || !tools) {
  console.error('Usage: sync-brand-assets.mjs --kit <brand kit dir> --tools <dir with node_modules> | --check')
  process.exit(2)
}

const manifestBytes = readFileSync(join(kit, 'manifest.json'))
const manifest = JSON.parse(manifestBytes)
const kitHashes = new Map(manifest.files.map(file => [file.path, file.sha256]))
const records = []

const readKit = path => {
  const bytes = readFileSync(join(kit, path))
  const expected = kitHashes.get(path)
  if (!expected) throw new Error(`${path} is not in the kit manifest`)
  if (sha256(bytes) !== expected) throw new Error(`${path} does not match the kit manifest`)
  return bytes
}

const write = (path, bytes, source) => {
  const file = join(root, path)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, bytes)
  records.push({ path, sha256: sha256(bytes), bytes: bytes.length, ...source })
}

const copy = (from, to) => write(to, readKit(from), { from, kitSha256: kitHashes.get(from), how: 'copied byte for byte' })

// Marks: vector masters, never redrawn.
copy('masters/fearless-lockup-horizontal.svg', 'src/public/logo.svg')
copy('masters/fearless-lockup-horizontal.svg', 'src/public/brand/lockup-horizontal.svg')
copy('masters/fearless-lockup-stacked.svg', 'src/public/brand/lockup-stacked.svg')
copy('masters/fearless-crest.svg', 'src/public/brand/crest.svg')
copy('masters/fearless-crest-small.svg', 'src/public/brand/crest-small.svg')
copy('masters/fearless-crest-gold.svg', 'src/public/brand/crest-gold.svg')
copy('masters/fearless-wordmark.svg', 'src/public/brand/wordmark.svg')
copy('svg/crest-badge.svg', 'src/public/brand/crest-badge.svg')
copy('svg/crest-badge-small.svg', 'src/public/brand/crest-badge-small.svg')
copy('svg/solar-geometry.svg', 'src/public/brand/solar-geometry.svg')
copy('svg/shikiban.svg', 'src/public/brand/shikiban.svg')

// Icons.
copy('web/favicon.ico', 'src/public/favicon.ico')
copy('web/logo-256.png', 'src/public/icon.png')
copy('png/app-icon/app-icon-180.png', 'src/public/apple-touch-icon.png')
copy('png/app-icon/app-icon-180.png', 'src/public/apple-touch-icon-precomposed.png')
copy('png/app-icon/app-icon-512.png', 'src/public/icon-512.png')
// The browser tab icon as a vector: the app icon with the small crest, which
// the kit uses below 64 px, so it stays legible at 16 px.
copy('masters/fearless-app-icon-small.svg', 'src/public/icon.svg')
copy('png/app-icon/app-icon-192.png', 'src/public/icon-192.png')

// The crow: the extension popup's framing fits a web hero.
copy('hero/popup-idle.webm', 'src/public/brand/crow-idle.webm')
copy('hero/popup-idle.mp4', 'src/public/brand/crow-idle.mp4')
copy('hero/popup-caw.webm', 'src/public/brand/crow-caw.webm')
copy('hero/popup-caw.mp4', 'src/public/brand/crow-caw.mp4')
// The launch clip plays once, at most about 760 px wide, and must start within
// seconds on a slow connection: a 640 px encode of the kit's master is a
// third of the size and looks the same there (SSIM 0.94 to 0.97 against the
// master). Single-threaded and bit-exact, so a rebuild gives the same bytes.
const ffmpeg = option('--ffmpeg') || 'ffmpeg'
const encode = (from, to, codecArgs) => {
  const source = join(kit, from)
  readKit(from)
  const temporary = join(root, `.${to.split('/').pop()}.tmp`)
  // bitexact: no encoder version or random container IDs in the output.
  const result = spawnSync(ffmpeg, ['-v', 'error', '-y', '-i', source, '-vf', 'scale=640:-2:flags=lanczos', '-an', '-threads', '1', '-map_metadata', '-1', '-fflags', '+bitexact', '-flags:v', '+bitexact', ...codecArgs, temporary], { encoding: 'utf8' })
  if (result.status !== 0) throw new Error(`ffmpeg failed for ${to}: ${result.stderr}`)
  const bytes = readFileSync(temporary)
  spawnSync('rm', ['-f', temporary])
  const version = spawnSync(ffmpeg, ['-version'], { encoding: 'utf8' }).stdout.split('\n')[0]
  write(to, bytes, { from, kitSha256: kitHashes.get(from), how: `${version}: 640 px, ${codecArgs.join(' ')}` })
}
encode('hero/popup-launch-ignite.mp4', 'src/public/brand/crow-launch.webm', ['-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '38', '-deadline', 'good', '-cpu-used', '2', '-pix_fmt', 'yuv420p', '-f', 'webm'])
encode('hero/popup-launch-ignite.mp4', 'src/public/brand/crow-launch.mp4', ['-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-f', 'mp4'])
copy('hero/popup-poster.webp', 'src/public/brand/crow-poster.webp')
copy('hero/popup-launch-ignite-hold.webp', 'src/public/brand/crow-launch-hold.webp')
copy('hero/bust.webp', 'src/public/brand/crow-bust.webp')
copy('png/sky/sky-card.webp', 'src/public/brand/sky.webp')
copy('png/sky/sky-card.jpg', 'src/public/brand/sky.jpg')

// Fonts: Sora is the display face, Figtree the interface face.
copy('fonts/sora.woff2', 'src/public/fonts/sora.woff2')
copy('fonts/Sora-LICENSE.txt', 'src/public/fonts/Sora-LICENSE.txt')
copy('fonts/Figtree-LICENSE.txt', 'src/public/fonts/Figtree-LICENSE.txt')

const requireTool = createRequire(join(resolve(tools), 'package.json'))
const wawoff2 = requireTool('wawoff2')
for (const weight of [400, 600, 700]) {
  const from = `fonts/figtree-${weight}.ttf`
  const woff2 = Buffer.from(await wawoff2.compress(readKit(from)))
  write(`src/public/fonts/figtree-${weight}.woff2`, woff2, {
    from,
    kitSha256: kitHashes.get(from),
    how: 'the same font re-wrapped as WOFF2 (wawoff2 2.0.1)',
  })
}

// Share image, 1200x630: the open-winged crow, the lockup and the line the
// apps greet people with.
const requireSite = createRequire(join(root, 'package.json'))
const sharp = requireSite('sharp')
const opentype = requireTool('opentype.js')
const figtree = weight => {
  const bytes = readKit(`fonts/figtree-${weight}.ttf`)
  return opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))
}
const outline = (font, text, x, y, size) => font.getPath(text, x, y, size).toPathData(2)
const lockup = readKit('masters/fearless-lockup-horizontal.svg').toString('utf8')
const lockupBody = lockup.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
const ogWidth = 1200
const ogHeight = 630
const crow = await sharp(readKit('hero/popup-launch-ignite-hold.png'))
  .resize({ width: 700 })
  .extract({ left: 0, top: 30, width: 700, height: ogHeight })
  .toBuffer()
const sky = await sharp(readKit('png/sky/sky-card.jpg')).resize(ogWidth, ogHeight, { fit: 'cover' }).toBuffer()
const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${ogWidth}" height="${ogHeight}">
<defs>
<linearGradient id="shade" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#120A2E" stop-opacity="0.96"/><stop offset="0.46" stop-color="#120A2E" stop-opacity="0.9"/><stop offset="0.62" stop-color="#120A2E" stop-opacity="0"/></linearGradient>
<linearGradient id="floor" x1="0" x2="0" y1="0" y2="1"><stop offset="0.7" stop-color="#120A2E" stop-opacity="0"/><stop offset="1" stop-color="#120A2E" stop-opacity="0.85"/></linearGradient>
</defs>
<rect width="${ogWidth}" height="${ogHeight}" fill="url(#shade)"/>
<rect width="${ogWidth}" height="${ogHeight}" fill="url(#floor)"/>
<g transform="translate(72 150) scale(0.62)">${lockupBody}</g>
<path fill="#FAF6FF" d="${outline(figtree(700), 'Your keys. Every chain.', 72, 356, 54)}"/>
<path fill="#CFC4E6" d="${outline(figtree(400), 'Open-source self-custody wallet for', 72, 420, 28)}"/>
<path fill="#CFC4E6" d="${outline(figtree(400), 'browser, iOS and Android', 72, 458, 28)}"/>
<path fill="#FFC24A" d="${outline(figtree(600), 'fearlesswallet.io', 72, 548, 26)}"/>
</svg>`)
const og = await sharp(sky)
  .composite([
    { input: crow, left: ogWidth - 700, top: 0 },
    { input: overlay, left: 0, top: 0 },
  ])
  .jpeg({ quality: 84, mozjpeg: true })
  .toBuffer()
write('src/public/og.jpg', og, {
  from: ['hero/popup-launch-ignite-hold.png', 'png/sky/sky-card.jpg', 'masters/fearless-lockup-horizontal.svg', 'fonts/figtree-400.ttf', 'fonts/figtree-600.ttf', 'fonts/figtree-700.ttf'],
  how: 'composed with sharp; the words are Figtree outlines',
})

// The kit's geometry tokens, as the shapes and numbers the site's components
// draw and time their motion with.
const round = value => Number(value.toFixed(5))
const solar = JSON.parse(readKit('tokens/solar-geometry.json'))
const shikiban = JSON.parse(readKit('tokens/shikiban.json'))
const strokePath = stroke => {
  // Circles start at 12 o'clock and run anticlockwise (y is down).
  if (stroke.type === 'circle') {
    const { cx, cy, r } = stroke
    return `M${round(cx)} ${round(cy - r)}A${r} ${r} 0 1 0 ${round(cx)} ${round(cy + r)}A${r} ${r} 0 1 0 ${round(cx)} ${round(cy - r)}`
  }
  if (stroke.type === 'line') return `M${stroke.x1} ${stroke.y1}L${stroke.x2} ${stroke.y2}`
  throw new Error(`Unknown solar stroke type: ${stroke.type}`)
}
const point = (arc, angle) => `${round(arc.cx + arc.r * Math.cos(angle))} ${round(arc.cy + arc.r * Math.sin(angle))}`
const mirrorRim = shikiban.mirror.rim
  .map((arc, index) => `${index ? 'L' : 'M'}${point(arc, arc.from)}A${arc.r} ${arc.r} 0 0 1 ${point(arc, arc.to)}`)
  .join('') + 'Z'
const bezier = values => `cubic-bezier(${values.join(', ')})`
const geometry = {
  durationsMs: shikiban.durationsMs,
  easing: Object.fromEntries(Object.entries(shikiban.easing).map(([name, values]) => [name, bezier(values)])),
  colors: shikiban.colors,
  perspective: shikiban.depth.perspective,
  solar: {
    stroke: solar.stroke,
    strokes: solar.strokes.map(stroke => ({
      d: strokePath(stroke),
      group: stroke.group,
      weight: stroke.weight,
      from: stroke.reveal[0],
      to: stroke.reveal[1],
    })),
    stars: solar.stars,
    ticks: solar.ticks,
  },
  mirror: { rim: mirrorRim, cusp: shikiban.mirror.cusp },
  gates: shikiban.gates.map(gate => ({ figure: gate.figure, diamond: Boolean(gate.diamond), depth: gate.depth })),
  flight: {
    durationMs: shikiban.flight.durationMs,
    irisAtMs: shikiban.flight.irisAtMs,
    irisOpenMs: shikiban.flight.irisOpenMs,
    coronaMs: shikiban.flight.coronaMs,
    baseRadius: shikiban.flight.baseRadius,
    passScale: shikiban.flight.passScale,
    travel: shikiban.flight.travel,
    gateFadeIn: shikiban.flight.gateFadeIn,
    irisInset: shikiban.flight.irisInset,
    tierLag: shikiban.flight.tierLag,
    tierStaggerMs: shikiban.flight.tierStaggerMs,
    tierFadeMs: shikiban.flight.tierFadeMs,
    rest: shikiban.flight.rest,
    landingMs: shikiban.flight.landingMs,
    landingFrom: shikiban.flight.landingFrom,
    corona: shikiban.flight.corona,
    // Each gate's strength, sampled evenly over the flight.
    gateAlpha: shikiban.flight.samples.gateAlpha,
  },
  dial: shikiban.dial,
  loader: shikiban.loader,
}
write('src/lib/brand/geometry.ts', Buffer.from(`// Generated by scripts/brand/sync-brand-assets.mjs from the brand kit's
// tokens/solar-geometry.json and tokens/shikiban.json. Do not edit by hand.
// Figures have outer radius 1, the origin at the centre and y down.
export const geometry = ${JSON.stringify(geometry, null, 2)} as const
`), {
  from: ['tokens/solar-geometry.json', 'tokens/shikiban.json'],
  how: 'generated: stroke paths, reveal windows, the mirror rim, gate depths, durations and easings',
})

// Asanoha lattice tile, one cell 26 px wide.
const cell = 26
const tileHeight = round(shikiban.asanoha.height * cell)
const lattice = shikiban.asanoha.lines
  .map(([x1, y1, x2, y2]) => `M${round(x1 * cell)} ${round(y1 * cell)}L${round(x2 * cell)} ${round(y2 * cell)}`)
  .join('')
write('src/public/brand/asanoha.svg', Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cell}" height="${tileHeight}" viewBox="0 0 ${cell} ${tileHeight}"><path d="${lattice}" fill="none" stroke="#FFC24A" stroke-width="0.6"/></svg>\n`), {
  from: 'tokens/shikiban.json',
  how: 'generated: the asanoha tile at a 26 px cell',
})

writeFileSync(provenancePath, `${JSON.stringify({
  kit: {
    name: 'Fearless x Yatagarasu brand kit',
    manifestSha256: sha256(manifestBytes),
    note: 'The kit is not committed anywhere. Vector marks are copied byte for byte; never redraw, warp or re-serialise the crest or the wordmark.',
  },
  rebuild: 'node scripts/brand/sync-brand-assets.mjs --kit <brand kit dir> --tools <dir with opentype.js and wawoff2>',
  check: 'node scripts/brand/sync-brand-assets.mjs --check',
  files: records,
}, null, 2)}\n`)
console.log(`Wrote ${records.length} brand files from kit ${sha256(manifestBytes).slice(0, 12)}….`)
