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
}[] = await fetch(
  'https://raw.githubusercontent.com/soramitsu/shared-features-utils/master/chains/v9/chains.json',
).then((res) => res.json())

networks
  .filter((network) => !network.disabled)
  .forEach((network) => {
    if (!featuredNetworkNames[network.name]) {
      resultNetworks.push({
        fullName: network.name,
        icon: `/networks/${network.icon.replace(/.*\/(.*)\.svg/g, '$1')}.svg`,
      })
    }
  })

console.log('export const networks =', resultNetworks)
