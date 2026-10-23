import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
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
    ['/release-notes/ios', 'Fearless Wallet Release Notes for iOS', 'Source Code (zip)'],
    ['/release-notes/android', 'Fearless Wallet Release Notes for Android', 'Source Code (zip)'],
    ['/bitcoin-wallet', 'The Secure Bitcoin Wallet', 'Bitcoin'],
    ['/privacy', 'Privacy', 'Information Collection and Use'],
    ['/terms', 'Terms', 'Intellectual Property Rights'],
  ]) {
    const body = await html(path)
    assert.ok(body.match(/<title>(.*?)<\/title>/)?.[1].includes(title), `${path}: title ${body.match(/<title>(.*?)<\/title>/)?.[1]}`)
    assert.ok(body.includes(marker), `${path}: rendered content`)
    assert.equal((body.match(/<meta\b[^>]*name="keywords"/g) || []).length, 1, `${path}: keyword metadata`)
    console.log(`Rendered page passed: ${path}`)
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
  for (const name of ['assetlinks.json', 'apple-app-site-association']) {
    const response = await fetch(`${base}/.well-known/${name}`)
    assert.equal(response.status, 200, name)
    assert.ok(await response.json(), name)
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
