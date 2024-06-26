const networks = await fetch(
  'https://raw.githubusercontent.com/soramitsu/shared-features-utils/master/chains/v9/chains.json',
).then((res) => res.json())

console.log(
  'export const networks = [' +
    networks
      .filter((network) => !network.disabled)
      .map(
        (network) => `
  {
    name: '${network.name}',
    icon: '/networks/${network.icon.replace(/.*\/(.*)\.svg/g, '$1')}.svg',
  },`,
      )
      .join('') +
    '\n]',
)
