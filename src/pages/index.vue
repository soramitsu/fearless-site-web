<script setup lang="ts">
const title = 'Fearless Wallet The Mobile Crypto Wallet for Multi-Chain Future',
  description =
    'Fearless Wallet is a Multichain Web3 Wallet. Web and mobile app versions. Securely buy, sell, trade, store, stake and send Crypto across 80+ blockchains.',
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
</script>

<template>
  <HeroSection />
  <hr>
  <BenefitsSection class="mt-xxl mb-3xl" />
  <NetworkSection class="my-xxl" />
  <FeaturesSection class="mt-xxl mb-3xl" />
  <BannerSection class="my-3xl" />
  <ManifestSection class="my-3xl" />
</template>