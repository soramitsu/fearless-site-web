<script setup lang="ts">
// Available items must be in the current store versions, with their platforms
// named; keep the versions in the note under the cards in step with the
// release notes.
const roadmap = [{
  title: 'Available as of November 2026',
  items: [
    'The Yatagarasu redesign in the iOS app, the Android app and the Chrome extension',
    'Bitcoin and Solana in all three apps, including sending',
    'DOT and KSM staking on Asset Hub in the iOS and Android apps',
    'Taira testnet in the Chrome extension: balance, history and sending testnet XOR',
    'One searchable asset list',
    'WalletConnect on our own open-source client',
  ]
}, {
  title: 'In progress',
  items: [
    'TON Connect in the Chrome extension',
    'Iroha Connect: connect to apps on SORA Nexus, starting with Taira',
    'Find more ERC-20 tokens on supported Ethereum-compatible networks in Chrome',
  ]
}, {
  title: 'Next',
  items: [
    'Make Universal Wallet recovery more consistent across iOS, Android and the Chrome extension',
    'Verify transfer support on SORA Nexus mainnet',
    'Keep the wallet core, network lists and data clients open source',
  ]
}]

const title = 'Fearless Wallet Roadmap',
  description =
    'See what’s available in Fearless Wallet as of November 2026 and follow work on TON Connect, Taira app connections and token discovery.',
  keywords =
    'Fearless Wallet roadmap, Chrome extension, iOS, Android, Asset Hub staking, TON Connect, SORA Nexus, Universal Wallet'

useSeoMeta({
  title,
  ogTitle: title,
  twitterTitle: title,
  description,
  ogDescription: description,
  twitterDescription: description
})

useHead({
  meta: [{ name: 'keywords', content: keywords }]
})

useSchemaOrg([
  {
    "@type": "WebPage",
    inLanguage: "en-US",
    name: 'Fearless Wallet Roadmap',
    description,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: roadmap.flatMap(stage => stage.items.map(name => ({ stage: stage.title, name })))
        .map(({ stage, name }, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Thing",
            name,
            description: stage,
          }
        }))
    },
  }
])
</script>

<template>
  <h1 class="w-narrow px-l pt-3xl text-center">
    Fearless Wallet <span class="color-accent">roadmap</span>
  </h1>

  <div class="w grid px-3xs py-xxl">
    <div v-for="item in roadmap" :key="item.title" class="p-l bg-block rounded-s rich">
      <h2 class="text-m mb-m">{{ item.title }}</h2>
      <ul class="color-secondary text-s">
        <li v-for="subitem in item.items" :key="subitem">{{ subitem }}</li>
      </ul>
    </div>
  </div>

  <p class="w-narrow px-l mb-xxl">
    Versions covered are iOS 4.2.4, Android 4.3.7 and Chrome extension 4.2.10. Read more in
    <NuxtLink to="/blog/november-2026-update">What’s New in Fearless Wallet: November 2026</NuxtLink> and the
    <NuxtLink to="/release-notes">release notes</NuxtLink>.
  </p>
</template>

<style scoped>
.grid {
  display: grid;
  gap: var(--space-m);
}

@media (min-width: 800px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 1fr;
  }
}
</style>
