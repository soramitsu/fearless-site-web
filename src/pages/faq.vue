<script setup lang="ts">
const title = 'Fearless Wallet FAQ | Your Questions Answered About Our Digital Wallet',
  description =
    'Discover answers to all your questions about the Fearless Wallet in our comprehensive FAQ section. Learn about features, security, supported cryptocurrencies, and troubleshooting tips to enhance your experience with our user-friendly digital wallet.',
  keywords =
    'Fearless Wallet, FAQ, digital wallet questions, cryptocurrency wallet, wallet features, security measures, supported cryptocurrencies'

const { data } = await useAsyncData('faq', () => queryContent('/faq').find())

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
    inLanguage: "en-US",
    "@type": "FAQPage",
    "name": "Fearless Wallet Frequently Asked Questions",
    "description": "Answers to common questions about the safety, functionality, and features of Fearless Wallet.",
    "url": "https://www.fearlesswallet.io/faq",
    "mainEntity": data.value?.map((item) => (
      {
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
  }
])
</script>

<template>
  <h1 class="w-narrow px-l pt-3xl text-center">
    Fearless Wallet <span class="color-accent">FAQ</span>
  </h1>
  <AccordionContainer class="w-narrow px-3xs my-xxl">
    <AccordionItem v-for="item in data" :key="item.question" :title="item.question" name="wallet-faq" :level="2">
      <ContentRenderer :value="item" />
    </AccordionItem>
  </AccordionContainer>
</template>
