import { readFile, readdir } from 'node:fs/promises'
import type { NetworkInfo } from '~/lib/constants/types'
import featuredNetworks from './src/lib/networks'

const featuredNetworkNames: { [key: string]: true } = {}
const resultNetworks = Object.keys(featuredNetworks).reduce((acc, key) => {
  featuredNetworkNames[featuredNetworks[key].fullName] = true
  acc.push({
    ...featuredNetworks[key],
    slug: key,
  })
  return acc
}, [] as (NetworkInfo & { slug?: string })[])

const networks: {
  name: string
  icon: string
  disabled?: boolean
}[] = JSON.parse(await readFile(new URL('./data/networks.json', import.meta.url), 'utf8'))

const iconFiles = new Set(await readdir(new URL('./src/public/networks/', import.meta.url)))
function verifyIcon(icon: string) {
  if (!/^\/networks\/[^/]+\.svg$/.test(icon) || !iconFiles.has(decodeURIComponent(icon.slice('/networks/'.length)))) {
    throw new Error(`Missing case-sensitive local network icon: ${icon}`)
  }
}
for (const network of networks) {
  if (!network.name || !/^\/networks\/[^/]+\.svg$/.test(network.icon)) {
    throw new Error('Network entries need a name and a local SVG icon')
  }
  verifyIcon(network.icon)
}
Object.values(featuredNetworks).forEach(network => verifyIcon(network.icon))

networks
  .filter((network) => !network.disabled)
  .forEach((network) => {
    if (!featuredNetworkNames[network.name]) {
      resultNetworks.push({
        fullName: network.name,
        icon: network.icon,
      })
    }
  })

const generated = `export const networks = ${JSON.stringify(resultNetworks, null, 2)}\n`
if (process.argv.includes('--check')) {
  const existing = await readFile(new URL('./src/components/Network/networks.ts', import.meta.url), 'utf8')
  if (existing !== generated) throw new Error('Network data is stale; run yarn parseNetworks')
  console.log('Website network data and local icons verified.')
} else {
  process.stdout.write(generated)
}
