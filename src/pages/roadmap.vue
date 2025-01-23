<script setup lang="ts">
const roadmap = [{
  title: 'SORA Ecosystem',
  items: [
    'SORA Card integration',
    'Demeter Farming integration',
  ]
}, {
  title: 'TON Ecosystem',
  items: [
    'Improved UX/UI and wallet management',
  ]
}, {
  title: 'Coinbase',
  items: [
    'Coinbase Onramp integration',
  ]
}]

const title = 'Fearless Wallet 2025 Roadmap',
  description =
    'The Fearless Wallet roadmap summarizes objectives and future direction, including ongoing ideas and concepts for blockchain development.',
  keywords =
    'Fearless Wallet roadmap, crypto wallet apps, wallet app, wallet web, krypto wallet, browser wallet, crypto wallet, blockchain wallet app'

useSeoMeta({
  title,
  ogTitle: title,
  twitterTitle: title,
  description,
  ogDescription: description,
  twitterDescription: description,
  keywords
})

useSchemaOrg([
  defineWebPage({
    inLanguage: "en-US",
    name: 'Fearless Wallet Roadmap',
    description: 'Roadmap for Q1/Q2 2025 outlining key developments and strategic initiatives for Fearless Wallet.',
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Thing",
            name: "Polkaswap liquidity pools",
            description: "Enhancements and updates to liquidity pools within the Polkaswap platform."
          }
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Thing",
            name: "Demeter Farming",
            description: "Introduction of new farming strategies and opportunities."
          }
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@type": "Thing",
            name: "SORA Card",
            description: "Launch of the SORA Card for seamless transactions."
          }
        },
        {
          "@type": "ListItem",
          position: 4,
          item: {
            "@type": "Thing",
            name: "UI/UX Updates",
            description: "Improvements to user interface and experience."
          }
        },
        {
          "@type": "ListItem",
          position: 5,
          item: {
            "@type": "Thing",
            name: "New Asset Management Flow",
            description: "Streamlined processes for managing assets."
          }
        },
        {
          "@type": "ListItem",
          position: 6,
          item: {
            "@type": "Thing",
            name: "EVM Support",
            description: "Adding support for new chains and Ethereum Virtual Machine compatibility."
          }
        },
        {
          "@type": "ListItem",
          position: 7,
          item: {
            "@type": "Thing",
            name: "Transaction Gas Management",
            description: "Optimizations to manage transaction gas and speed up processing."
          }
        },
        {
          "@type": "ListItem",
          position: 8,
          item: {
            "@type": "Thing",
            name: "DeFi Tool Integrations",
            description: "Integrating various DeFi tools to enhance functionality."
          }
        }
      ]
    },
  })
])
</script>

<template>
  <h1 class="w-narrow px-l pt-3xl text-center">
    Roadmap for <span class="color-accent">Q1/Q2 2025</span>
  </h1>

  <div class="w grid px-3xs py-xxl">
    <div v-for="item in roadmap" :key="item.title" class="p-l bg-block rounded-s rich">
      <h2 class="text-m mb-m">{{ item.title }}</h2>
      <ul class="color-secondary text-s">
        <li v-for="subitem in item.items" :key="subitem">{{ subitem }}</li>
      </ul>
    </div>
  </div>

  <p class="w-narrow px-l mb-m">
    Welcome to the Fearless Wallet Roadmap
  </p>
  <p class="w-narrow px-l mb-m">
    This roadmap highlights our key focus areas, showcasing how we are committed to driving innovation, enhancing user experience, and fostering growth in the decentralized finance (DeFi) landscape.
  </p>
  <p class="w-narrow px-l mb-xxl">
    Stay tuned for detailed updates as we unveil exciting new features, improvements, and partnerships that will elevate
    your Fearless Wallet experience. Join us on this journey towards a more secure and user-friendly digital wallet
    solution!
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