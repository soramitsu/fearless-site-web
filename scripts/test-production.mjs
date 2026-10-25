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
    ['/bitcoin-wallet', 'The Secure Bitcoin Wallet', 'Bitcoin'],
    ['/privacy', 'Privacy', 'Information Collection and Use'],
    ['/terms', 'Terms', 'Intellectual Property Rights'],
  ]) {
    const body = await html(path)
    assert.ok(body.match(/<title>(.*?)<\/title>/)?.[1].includes(title.replaceAll('&', '&amp;')), `${path}: title ${body.match(/<title>(.*?)<\/title>/)?.[1]}`)
    assert.ok(body.includes(marker), `${path}: rendered content`)
    assert.equal((body.match(/<meta\b[^>]*name="keywords"/g) || []).length, 1, `${path}: keyword metadata`)
    console.log(`Rendered page passed: ${path}`)
  }
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
  assert.ok((await html('/')).includes('href="/support/"'), 'Footer links to Help & Support')
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
    ['/blog/zchains', 'Download mobile app'],
  ]) {
    const body = await html(path)
    assert.deepEqual(linkHrefs(body, 'Download browser extension'), [chromeExtensionUrl], `${path}: extension link`)
    assert.deepEqual(linkHrefs(body, mobileText), ['/download'], `${path}: mobile app link`)
  }
  for (const path of ['/', '/download', '/bitcoin-wallet', '/blog/welcome', '/blog/2024-in-review', '/blog/zchains', '/ton-connect']) {
    const body = await html(path)
    assert.ok(!body.includes('qrcodes.pro'), `${path}: no expired short links`)
    assert.match(body, /id="update-extension"[\s\S]*?\d+\.\d+\.\d+ or later[\s\S]*?chrome:\/\/extensions/, `${path}: extension update banner`)
  }
  const blog = await html('/blog')
  assert.match(blog, /alt="Welcome to Fearless Wallet: Your Gateway to the Decentralized Future"/)
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
  console.log('Production regression checks passed: content, metadata, assets, images, 404s, sitemaps and app associations.')
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
