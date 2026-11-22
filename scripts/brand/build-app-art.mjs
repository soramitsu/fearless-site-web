import {createHash} from 'node:crypto'
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import {resolve,join,dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
import {parseArgs} from 'node:util'
import {canvas} from './art.mjs'
import {home} from './home.mjs'
import {feature} from './features.mjs'
import {animatedIcon,iconNames} from './icons.mjs'

const {values}=parseArgs({options:{kit:{type:'string'},tools:{type:'string'},check:{type:'boolean'}}})
if(!values.kit)throw Error('Usage: node scripts/brand/build-app-art.mjs --kit DIR [--tools DIR] [--check]')
const kitDir=resolve(values.kit),root=resolve(dirname(fileURLToPath(import.meta.url)),'../..'),sha=bytes=>createHash('sha256').update(bytes).digest('hex')
const inputs=new Map(),outputs=new Map(),read=key=>{const bytes=readFileSync(join(kitDir,key));inputs.set(key,sha(bytes));return bytes},source=key=>read(key).toString(),json=key=>JSON.parse(source(key))
const tools=createRequire(join(resolve(values.tools||kitDir),'package.json')), opentype=tools('opentype.js')
const fonts={},parseFont=bytes=>opentype.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength))
for(const weight of [500,600,700])fonts[weight]=parseFont(read(`fonts/figtree-${weight}.ttf`))
const displayFile='../../fearless-iOS/fearless/Fonts/sora-Bold.otf'
const sourceFont=process.env.SORA_BOLD_OTF||join(kitDir,displayFile)
const display=readFileSync(sourceFont);fonts.display=parseFont(display)
const badges={};for(const variant of ['','-small']){
  const badge=source(`svg/crest-badge${variant}.svg`),master=source(`masters/fearless-crest${variant}.svg`)
  const paths=markup=>Array.from(markup.matchAll(/ d="([^"]+)"/g),match=>match[1]);if(!paths(master).length||JSON.stringify(paths(master))!==JSON.stringify(paths(badge)))throw Error('Badge diverges from crest master')
  badges[variant?'small':'full']=badge.slice(badge.indexOf('>')+1,badge.lastIndexOf('</svg>'))
}
const kit={sh:json('tokens/shikiban.json'),solar:json('tokens/solar-geometry.json'),colors:json('tokens/colors.json').colors,badges,fonts}
for(const file of ['manifest.json','SPEC.md','svg/shikiban.svg','svg/solar-geometry.svg','tools/shikiban.mjs','tools/shikiban-draw.mjs'])if(existsSync(join(kitDir,file)))read(file)
for(const [folder,names,draw,limit] of [['hero',['back','screen','card','actions','row-eth','row-sol','row-dot','row-xor','toast'],home,45000],['features',['networks','send','scam-warning','swap','stake'],feature,110000],['icons/animated',iconNames,animatedIcon,12000]])for(const name of names){
  const svg=draw(canvas(folder==='icons/animated'?`icon-${name}`:name,kit),name),file=`src/public/${folder}/${name}.svg`,bytes=Buffer.byteLength(svg)
  if(bytes>limit)throw Error(`${file}: ${bytes} > ${limit}`);outputs.set(file,svg)
}
const table=items=>[...items].map(([key,hash])=>`${hash}  ${key}`).join('\n')
const sourceFiles=['art.mjs','figures.mjs','home.mjs','features.mjs','icons.mjs','build-app-art.mjs'].map(file=>`scripts/brand/${file}`)
const guide=`# Wallet screen artwork\n\nThese standalone wallet illustrations use fictitious balances, not live chain data. Build with Node 22+ and opentype.js 1.3.4.\n\n\`\`\`sh\nnode scripts/brand/build-app-art.mjs --kit /path/to/brand/yatagarasu --tools /path/to/tools\n\`\`\`\n\nAdd \`--check\` for a read-only byte comparison of all SVGs and this receipt. The tools directory contains \`node_modules/opentype.js\`; omit it if installed alongside the kit. For a standalone kit set \`SORA_BOLD_OTF\` to the matching iOS Sora Bold font. Figtree outlines are shared within each SVG, with fixed digit advances for updates. Each feature plays a ten-second illustrative sequence. The static presentation is the settled state. The sunset card’s weakest text is “Total balance”: 6.21:1 minimum measured against its glyph footprint. The 118 px send seal and warning-card break are positioned for the site’s 85% crop (including the warning’s 13% upward shift).\n\n## Animated icons\n\nThe eight 64×64 benefit/stat icons and three 96×96 TON step numerals live in src/public/icons/animated/. Each has an eight-second cycle and a static reduced-motion drawing. File sizes in bytes:\n\n${iconNames.map(name=>`${name}.svg: ${Buffer.byteLength(outputs.get(`src/public/icons/animated/${name}.svg`))}`).join('\n\n')}\n\n## SHA-256\n\nKit inputs (relative to the kit root):\n\n\`\`\`\n${table(inputs)}\n\`\`\`\n\nAdditional display font:\n\n\`\`\`\n${sha(display)}  fearless-iOS/fearless/Fonts/sora-Bold.otf\n\`\`\`\n\nGenerator and delivered artwork (the receipt excludes its own recursive digest):\n\n\`\`\`\n${table(sourceFiles.map(file=>[file,sha(readFileSync(join(root,file)))]))}\n${table([...outputs].map(([file,svg])=>[file,sha(svg)]))}\n\`\`\`\n`
outputs.set('docs/brand-app-art.md',guide)
for(const [file,data] of outputs){const dest=join(root,file);if(values.check){if(!existsSync(dest)||!readFileSync(dest).equals(Buffer.from(data))){console.error(`Mismatch: ${file}`);process.exitCode=1}}else {mkdirSync(dirname(dest),{recursive:true});writeFileSync(dest,data)}}
if(!process.exitCode)console.log(`${values.check?'Checked':'Built'} 25 SVGs and provenance receipt.`)
