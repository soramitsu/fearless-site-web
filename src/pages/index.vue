<script setup lang="ts">
const title = 'Fearless Wallet The Mobile Crypto Wallet for Multi-Chain Future',
  description =
    'Fearless Wallet is a Multi-chain Web3 Wallet. Web and mobile app versions. Securely buy, sell, trade, store, stake and send Crypto across 80+ blockchains.',
  keywords =
    'crypto wallet apps, wallet app, wallet web, krypto wallet, browser wallet, crypto wallet, blockchain wallet app'

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
    name: title,
    description: description
  }),
  defineSoftwareApp({
    applicationCategory: "http://schema.org/FinanceApplication",
    name: "Fearless Wallet",
    operatingSystem: "WINDOWS, OSX, IOS, ANDROID",
    downloadUrl: "https://fearlesswallet.io/",
    aggregateRating: {
      ratingValue: "4.6",
      ratingCount: "6459"
    },
    offers: {
      price: "0",
      priceCurrency: "USD"
    }
  })
])
</script>

<template>
  <HeroSection class="pb-xl" />
  <NetworkSection class="mb-xxl" />
  <FeaturesSection class="mb-3xl" />
  <BannerSection class="mb-3xl" />
  <BenefitsSection class="mb-3xl" />
  <ManifestSection class="mb-3xl" />
</template>