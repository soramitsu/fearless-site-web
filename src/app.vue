<script lang="ts" setup>
useSchemaOrg([
  defineWebPage({
    inLanguage: "en-US",
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
  <Header />
  <NuxtPage />
  <Footer />
  <CookieBumper />
  <DynamicBackground />
</template>
