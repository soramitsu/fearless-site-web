import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'

// Exercise the built server: a successful bundle does not prove that Nuxt's
// content, public or server directories still resolve after a major upgrade.
const socket = createServer()
socket.listen(0, '127.0.0.1')
await once(socket, 'listening')
const port = socket.address().port
await new Promise((resolve, reject) => socket.close(error => error ? reject(error) : resolve()))
const base = `http://127.0.0.1:${port}`
const server = spawn(process.execPath, ['.output/server/index.mjs'], {
  env: { ...process.env, HOST: '127.0.0.1', PORT: String(port), NITRO_HOST: '127.0.0.1', NITRO_PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
})
let logs = ''
server.stdout.on('data', value => { logs += value })
server.stderr.on('data', value => { logs += value })
let startupError
server.on('error', error => { startupError = error })

try {
  let ready = false
  for (let attempt = 0; attempt < 100; attempt++) {
    if (startupError) throw startupError
    if (server.exitCode !== null) throw new Error(`Preview server exited: ${logs}`)
    try {
      await fetch(`${base}/robots.txt`, { signal: AbortSignal.timeout(1000) })
      ready = true
      break
    } catch { await delay(100) }
  }
  assert.ok(ready, `Preview server did not start: ${logs}`)
  const html = async path => {
    const response = await fetch(base + path, { signal: AbortSignal.timeout(10000) })
    assert.equal(response.status, 200, path)
    assert.match(response.headers.get('content-type'), /text\/html/, path)
    return (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
  }
  for (const [path, title, marker] of [
    ['/', 'Fearless Wallet The DeFi', 'Universal Wallet'],
    ['/download', 'Fearless Wallet', 'self-custody'],
    ['/blog', 'Fearless Wallet Crypto and Web3 Blog', 'Welcome to Fearless Wallet'],
    ['/blog/welcome', 'Welcome to Fearless Wallet', 'Why Choose Fearless Wallet?'],
    ['/faq', 'Fearless Wallet FAQ', 'How safe is Fearless Wallet?'],
    ['/support/', 'Help & Support | Fearless Wallet', 'Contact support'],
    ['/release-notes/ios', 'Fearless Wallet Release Notes for iOS', 'Source Code (zip)'],
    ['/release-notes/android', 'Fearless Wallet Release Notes for Android', 'Source Code (zip)'],
    ['/bitcoin-wallet', 'Bitcoin Wallet | Fearless Wallet', 'Bitcoin'],
    ['/privacy', 'Privacy', 'Information Collection and Use'],
    ['/terms', 'Terms', 'Intellectual Property Rights'],
  ]) {
    const body = await html(path)
    assert.ok(body.match(/<title>(.*?)<\/title>/)?.[1].includes(title.replaceAll('&', '&amp;')), `${path}: title ${body.match(/<title>(.*?)<\/title>/)?.[1]}`)
    assert.ok(body.includes(marker), `${path}: rendered content`)
    assert.equal((body.match(/<meta\b[^>]*name="keywords"/g) || []).length, 1, `${path}: keyword metadata`)
    console.log(`Rendered page passed: ${path}`)
  }
  // Each page's own description, share card and address reach the server's
  // HTML, and its structured data is a filled, parseable graph (an Unhead 2
  // schema module under Nuxt's Unhead 3 once left both empty).
  for (const [path, description, types] of [
    ['/', 'One Universal Wallet phrase', ['Organization', 'WebSite', 'WebPage', 'SoftwareApplication']],
    ['/download', 'Download the latest version of Fearless Wallet', ['Organization', 'WebSite', 'WebPage']],
    ['/faq', 'answers to all your questions', ['Organization', 'WebSite', 'FAQPage']],
    ['/blog/welcome', '', ['Organization', 'WebSite', 'Article']],
    ['/nexus-wallet', 'mainnet transfers are not enabled', ['Organization', 'WebSite', 'Article']],
    ['/blog', 'Explore the Fearless Wallet blog', ['Organization', 'WebSite', 'CollectionPage']],
    ['/privacy', 'How SORAMITSU collects', ['Organization', 'WebSite', 'WebPage']],
    ['/terms', 'The End User License Agreement', ['Organization', 'WebSite', 'WebPage']],
    ['/support', 'Get help with Fearless Wallet', ['Organization', 'WebSite', 'ContactPage']],
    ['/ton-connect', 'on iOS or Android', ['Organization', 'WebSite', 'WebPage']],
  ]) {
    const response = await fetch(base + path)
    const page = await response.text()
    const meta = (key, name) => page.match(new RegExp(`<meta[^>]*${key}="${name}"[^>]*content="([^"]*)"`))?.[1]
    if (description) {
      assert.ok(meta('name', 'description')?.includes(description), `${path}: description ${meta('name', 'description')}`)
      assert.equal(meta('property', 'og:description'), meta('name', 'description'), `${path}: og:description`)
    }
    assert.match(meta('property', 'og:image') || '', /^https:\/\//, `${path}: absolute og:image`)
    const url = `https://fearlesswallet.io${path === '/' ? '/' : path}`
    assert.equal(meta('property', 'og:url'), url, `${path}: og:url`)
    assert.match(page, new RegExp(`<link[^>]*rel="canonical"[^>]*href="${url}"`), `${path}: canonical`)
    const scripts = [...page.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    assert.equal(scripts.length, 1, `${path}: one JSON-LD script`)
    const graph = JSON.parse(scripts[0][1])['@graph']
    assert.deepEqual(graph.map(node => node['@type']), types, `${path}: JSON-LD nodes`)
    assert.ok(!JSON.stringify(graph).includes('aggregateRating'), `${path}: no unsourced ratings`)
    // The page's own node names the same address as the canonical link.
    const ownNodes = graph.filter(node => ['WebPage', 'FAQPage', 'CollectionPage', 'ContactPage', 'Article'].includes(node['@type']))
    assert.equal(ownNodes.length, 1, `${path}: one node for the page itself`)
    assert.equal(ownNodes[0].url || ownNodes[0].mainEntityOfPage, url, `${path}: ${ownNodes[0]['@type']} address`)
    assert.ok(!JSON.stringify(graph).includes('www.fearlesswallet.io'), `${path}: no www address in structured data`)
    if (path === '/faq') {
      // Answers come from front matter; an unquoted colon there once turned one into an object.
      const answers = graph.find(node => node['@type'] === 'FAQPage').mainEntity.map(question => question.acceptedAnswer.text)
      assert.ok(answers.length >= 9, '/faq: every question in the FAQ graph')
      for (const answer of answers) assert.ok(typeof answer === 'string' && answer.length > 40, `/faq: answer is text: ${JSON.stringify(answer).slice(0, 80)}`)
      assert.ok(answers.some(answer => answer.includes('advanced settings before you continue')), '/faq: import answer gives the recovery order')
    }
    console.log(`Head and structured data passed: ${path}`)
  }
  // The router also answers other spellings of an address; each names the
  // sitemap's lowercase address without a trailing slash, everywhere.
  for (const [variant, path] of [['/download/', '/download'], ['/Support', '/support'], ['/FAQ/', '/faq']]) {
    const response = await fetch(base + variant, { headers: { accept: 'text/html' } })
    assert.equal(response.status, 200, `${variant}: status`)
    const page = await response.text()
    const url = `https://fearlesswallet.io${path}`
    assert.match(page, new RegExp(`<link[^>]*rel="canonical"[^>]*href="${url}"`), `${variant}: canonical`)
    assert.match(page, new RegExp(`<meta[^>]*property="og:url"[^>]*content="${url}"`), `${variant}: og:url`)
    const graph = JSON.parse(page.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1])['@graph']
    assert.equal(graph[2].url, url, `${variant}: structured data address`)
    console.log(`Address variant passed: ${variant}`)
  }
  // A post's share image is described by its own front matter, the team that
  // writes the posts is the organization, and an update is dated.
  const november = await (await fetch(`${base}/blog/november-2026-update`)).text()
  assert.match(november, /<meta[^>]*property="og:image:alt"[^>]*content="The Fearless crow beside/, 'November post: share image description')
  assert.match(november, /<meta[^>]*name="twitter:image:alt"[^>]*content="The Fearless crow beside/, 'November post: X card image description')
  const article = JSON.parse(november.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1])['@graph'].find(node => node['@type'] === 'Article')
  assert.deepEqual(article.author, { '@id': 'https://fearlesswallet.io/#organization' }, 'November post: author')
  assert.match(String(article.dateModified), /^2026-11-26/, 'November post: dateModified')
  assert.match(november.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, ''), /Updated Thu, Nov 26, 2026/, 'November post: visible update date')
  const privacy = await html('/privacy/')
  for (const disclosure of [
    'Browser extension privacy supplement',
    'Effective 25 October 2026, for browser extension release 4.2.0.',
    'Wallet data on your device',
    'Network services and public transactions',
    'Websites and connected applications',
    'Optional Google Drive backups',
    'drive.appdata',
    'Use, retention and your controls',
    'Soramitsu Helvetia AG',
    'dataprotection@soramitsu.co.jp',
  ]) {
    assert.ok(privacy.includes(disclosure), `Browser extension privacy disclosure: ${disclosure}`)
  }
  const support = await html('/support/')
  for (const href of ['mailto:fearless@soramitsu.co.jp', 'https://t.me/fearlesshappiness', '/faq', 'https://wiki.fearlesswallet.io/']) {
    assert.ok(support.includes(`href="${href}"`), `Support link: ${href}`)
  }
  assert.match(support, /Never share your recovery phrase/)
  // The footer uses the canonical address (the sitemap's); the apps' /support/ links serve the same page.
  assert.ok((await html('/')).includes('href="/support"'), 'Footer links to Help & Support')
  // App buttons go to the stores directly: the short links they used expired.
  const chromeExtensionUrl = 'https://chromewebstore.google.com/detail/fearless-wallet/nhlnehondigmgckngjomcpcefcdplmgc'
  const linkHrefs = (body, text) => [...body.matchAll(/<a\b[^>]*\bhref="([^"]*)"[^>]*>((?:(?!<\/a>)[\s\S])*)<\/a>/g)]
    .filter(([, , content]) => content.includes(text)).map(([, href]) => href)
  for (const [path, count] of [['/', 2], ['/bitcoin-wallet', 1]]) {
    const body = await html(path)
    assert.deepEqual(linkHrefs(body, 'Get extension'), Array(count).fill(chromeExtensionUrl), `${path}: Get extension`)
    assert.deepEqual(linkHrefs(body, 'Get mobile app'), Array(count).fill('/download'), `${path}: Get mobile app`)
  }
  for (const [path, mobileText] of [
    ['/blog/welcome', 'Download for iOS/Android'],
    ['/blog/2024-in-review', 'Download for iOS/Android'],
  ]) {
    const body = await html(path)
    assert.deepEqual(linkHrefs(body, 'Download browser extension'), [chromeExtensionUrl], `${path}: extension link`)
    assert.deepEqual(linkHrefs(body, mobileText), ['/download'], `${path}: mobile app link`)
  }
  // TON Connect works in the phone apps; the extension's store release does
  // not have it yet, so the guide links to the App Store and Google Play.
  const tonConnect = await html('/ton-connect')
  assert.deepEqual(linkHrefs(tonConnect, 'Download for iOS'), ['https://apps.apple.com/us/app/fearless-wallet/id1537251089'], '/ton-connect: iOS link')
  assert.deepEqual(linkHrefs(tonConnect, 'Download for Android'), ['https://play.google.com/store/apps/details?id=jp.co.soramitsu.fearless'], '/ton-connect: Android link')
  for (const path of ['/', '/download', '/bitcoin-wallet', '/blog/welcome', '/blog/2024-in-review', '/blog/zchains', '/ton-connect']) {
    const body = await html(path)
    assert.ok(!body.includes('qrcodes.pro'), `${path}: no expired short links`)
    assert.match(body, /id="update-extension"[\s\S]*?\d+\.\d+\.\d+ or later[\s\S]*?chrome:\/\/extensions/, `${path}: extension update banner`)
  }
  const blog = await html('/blog')
  // The card's title names the link; its cover is decorative and sized to the
  // card rather than served at full width.
  assert.match(blog, /<h2[^>]*>Welcome to Fearless Wallet: Your Gateway to the Decentralized Future<\/h2>/)
  assert.match(blog, /<img[^>]*srcset="[^"]*(?:w_640|s_640x360)[^"]*\/blog\/welcome\/cover\.jpg 1x, [^"]*(?:w_1280|s_1280x720)[^"]*\/blog\/welcome\/cover\.jpg 2x"[^>]*\balt\b/)
  const image = blog.match(/src="(\/_ipx\/[^"?]*welcome[^"?]*)"/)
  assert.ok(image, 'Blog image uses the local image renderer')
  const imageResponse = await fetch(base + image[1], { signal: AbortSignal.timeout(10000) })
  assert.equal(imageResponse.status, 200, 'Image renderer')
  assert.match(imageResponse.headers.get('content-type'), /^image\//)
  for (const path of ['/logo.svg', '/icons/download.svg']) {
    const response = await fetch(base + path)
    assert.equal(response.status, 200, path)
    assert.match(response.headers.get('content-type'), /image\/svg\+xml/)
  }
  // The Yatagarasu brand: the lockup in the header, the crow and the wallet's
  // layers in the hero, fonts served from this site, and motion that waits
  // for the head script instead of hiding anything in the server's HTML.
  const home = await html('/')
  assert.match(home, /<img[^>]*src="\/logo\.svg"[^>]*alt="Fearless Wallet"/, 'Header lockup')
  assert.match(await (await fetch(`${base}/logo.svg`)).text(), /aria-label="Fearless"/, 'Lockup is the brand master')
  for (const marker of ['/brand/crow-idle.webm', '/brand/crow-poster.webp', '/hero/card.svg', '/hero/row-xor.svg', "Hear the crow's call", 'Your keys. Every chain.']) {
    assert.ok(home.includes(marker.replaceAll("'", '&#39;')) || home.includes(marker), `Home hero: ${marker}`)
  }
  assert.doesNotMatch(home, /<html[^>]*class=/, 'The server never sets the motion or launch class')
  assert.doesNotMatch(home, /data-reveal/, 'Nothing is hidden for a reveal in the server HTML')
  assert.match(await (await fetch(base + '/')).text(), /classList\.add\('motion'\)/, 'Head script enables motion')
  // Tab and home-screen icons are the Yatagarasu crest. The ICO and touch
  // icon URLs carry a version so browsers and search engines that cached the
  // old bird fetch them again.
  const icons = JSON.parse(await (await fetch(`${base}/site.webmanifest`)).text()).icons.map(icon => icon.src)
  assert.deepEqual(icons, ['/icon.svg', '/icon-192.png', '/icon-512.png'], 'Manifest icons')
  for (const path of ['/', '/download', '/blog/welcome']) {
    const body = await html(path)
    for (const link of [
      /<link[^>]*rel="icon"[^>]*href="\/favicon\.ico\?v=yatagarasu"/,
      /<link[^>]*rel="icon"[^>]*href="\/icon\.svg"[^>]*type="image\/svg\+xml"/,
      /<link[^>]*rel="apple-touch-icon"[^>]*href="\/apple-touch-icon\.png\?v=yatagarasu"/,
      /<link[^>]*rel="manifest"[^>]*href="\/site\.webmanifest"/,
    ]) assert.match(body, link, `${path}: ${link}`)
    assert.doesNotMatch(body, /href="\/icon\.png"/, `${path}: no 256 px PNG icon link`)
    assert.ok(!/fonts\.(googleapis|gstatic)\.com/.test(body), `${path}: no font service`)
    assert.match(body, /rel="preload"[^>]*href="\/fonts\/sora\.woff2"|href="\/fonts\/sora\.woff2"[^>]*rel="preload"/, `${path}: display font preloaded`)
  }
  for (const [path, type] of [
    ['/brand/crest.svg', /image\/svg\+xml/],
    ['/brand/lockup-stacked.svg', /image\/svg\+xml/],
    ['/brand/asanoha.svg', /image\/svg\+xml/],
    ['/hero/back.svg', /image\/svg\+xml/],
    ['/hero/screen.svg', /image\/svg\+xml/],
    ['/features/networks.svg', /image\/svg\+xml/],
    ['/features/send.svg', /image\/svg\+xml/],
    ['/features/scam-warning.svg', /image\/svg\+xml/],
    ['/features/swap.svg', /image\/svg\+xml/],
    ['/features/stake.svg', /image\/svg\+xml/],
    ['/fonts/sora.woff2', /font\/woff2/],
    ['/fonts/figtree-400.woff2', /font\/woff2/],
    ['/brand/crow-idle.mp4', /video\/mp4/],
    ['/brand/crow-launch.webm', /video\/webm/],
    ['/og.jpg', /image\/jpeg/],
    ['/favicon.ico', /image\/(x-icon|vnd\.microsoft\.icon)/],
    ['/favicon.ico?v=yatagarasu', /image\/(x-icon|vnd\.microsoft\.icon)/],
    ['/icon.svg', /image\/svg\+xml/],
    ['/icon-192.png', /image\/png/],
    ['/apple-touch-icon.png?v=yatagarasu', /image\/png/],
  ]) {
    const response = await fetch(base + path)
    assert.equal(response.status, 200, path)
    assert.match(response.headers.get('content-type'), type, path)
  }
  // Animated artwork is used as images: it must stay self-contained and must
  // stop for visitors who ask for reduced motion.
  for (const path of ['/hero/card.svg', '/features/send.svg', '/features/swap.svg']) {
    const svg = await (await fetch(base + path)).text()
    assert.match(svg, /@keyframes/, `${path}: animated`)
    assert.match(svg, /prefers-reduced-motion:\s*reduce/, `${path}: honours reduced motion`)
    assert.doesNotMatch(svg, /<script|<image|href="http|url\(http|@import/, `${path}: self-contained`)
  }
  for (const path of ['/blog/missing-article', '/missing-network-wallet', '/constructor-wallet', '/release-notes/missing', '/release-notes/constructor']) {
    assert.equal((await fetch(base + path)).status, 404, path)
  }
  const sitemap = await (await fetch(`${base}/api/sitemap`)).json()
  for (const path of ['/blog/welcome', '/bitcoin-wallet', '/release-notes/ios', '/release-notes/android']) {
    assert.ok(sitemap.includes(path), `Sitemap: ${path}`)
  }
  const xml = await fetch(`${base}/sitemap.xml`)
  assert.equal(xml.status, 200)
  assert.match(await xml.text(), /https:\/\/fearlesswallet.io\/blog\/welcome/)
  for (const name of ['assetlinks.json', 'apple-app-site-association', 'apple-app-site-association.json']) {
    const response = await fetch(`${base}/.well-known/${name}`, { redirect: 'error' })
    assert.equal(response.status, 200, name)
    assert.match(response.headers.get('content-type'), /^application\/json(?:;|$)/, `${name}: JSON content type`)
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff', `${name}: nosniff`)
    assert.equal(response.headers.get('cache-control'), 'public, max-age=300, must-revalidate', `${name}: cache policy`)
    const source = JSON.parse(await readFile(`src/public/.well-known/${name}`, 'utf8'))
    assert.deepEqual(await response.json(), source, `${name}: deployed association contract`)
  }
  console.log('Production regression checks passed: content, metadata, brand, assets, images, 404s, sitemaps and app associations.')
} catch (error) {
  console.error(logs)
  throw error
} finally {
  if (server.exitCode === null) {
    const exited = once(server, 'exit')
    server.kill('SIGTERM')
    await exited
  }
}
