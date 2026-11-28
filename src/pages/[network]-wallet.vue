<script setup lang="ts">
import networks from '~/lib/networks'

const route = useRoute()
const networkName = route.params.network
const network = typeof networkName === 'string' && Object.hasOwn(networks, networkName)
  ? networks[networkName]
  : undefined

if (!network) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
    fatal: true
  })
}

const { fullName, shortName, icon, description } = network

if (!(fullName && shortName && icon && description)) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
    fatal: true
  })
}

const { availability } = network

// The page's head matches its status: a gated network promises no transfers,
// a testnet says its tokens are for testing.
const head = {
  live: {
    title: `${fullName} Wallet | Fearless Wallet`,
    description: `Hold, send and receive ${shortName} on ${fullName} with Fearless Wallet, the open-source self-custody wallet.`,
  },
  testnet: {
    title: `${fullName} | Fearless Wallet`,
    description: `${fullName} is a testnet: its ${shortName} has no value. Try it in the Fearless Wallet Chrome extension.`,
  },
  gated: {
    title: `${fullName} | Fearless Wallet`,
    description: `${fullName} mainnet transfers are not enabled in Fearless Wallet yet. Use the Taira testnet to try it.`,
  },
}[availability]

const title = head.title,
  metaDescription = head.description,
  keywords = `${fullName} wallet, ${shortName} wallet, Fearless Wallet, self-custody wallet, open-source wallet`

useSeoMeta({
  title,
  ogTitle: title,
  twitterTitle: title,
  description: metaDescription,
  ogDescription: metaDescription,
  twitterDescription: metaDescription
})

useHead({
  meta: [{ name: 'keywords', content: keywords }]
})

useSchemaOrg([
  defineArticle({
    inLanguage: "en-US",
    headline: title,
    description: metaDescription,
    keywords: keywords.split(', '),
    author: { "@type": "Organization", name: "Fearless Wallet" }
  })
])
</script>

<template>
  <NetworkHero :network="network" />
  <NetworkWhy v-if="network.availability === 'live'" :fullName="fullName" />
  <NetworkInfo :network="network" />
  <NetworkFAQ v-if="network.availability === 'live'" :fullName="fullName" :shortName="shortName" />
  <hr>
  <NetworkList title="Explore Other Networks" :networks="networks" />
</template>
