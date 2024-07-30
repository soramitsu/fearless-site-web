<script setup lang="ts">
const title = 'Fearless Wallet FAQ | Your Questions Answered About Our Digital Wallet',
  description =
    'Discover answers to all your questions about the Fearless Wallet in our comprehensive FAQ section. Learn about features, security, supported cryptocurrencies, and troubleshooting tips to enhance your experience with our user-friendly digital wallet.',
  keywords =
    'Fearless Wallet, FAQ, digital wallet questions, cryptocurrency wallet, wallet features, security measures, supported cryptocurrencies'

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
    name: 'Fearless Wallet FAQ',
    description: 'The FAQ section of Fearless Wallet provides essential information about features, security, supported cryptocurrencies, and troubleshooting tips to enhance user experience.'
  })
])

const activeItem = ref<number>()

const toggleAccordion = (id: number) => {
  if (activeItem.value === id) {
    activeItem.value = undefined
  } else {
    activeItem.value = id
  }
}
</script>

<template>
  <h1 class="w-narrow px-l pt-3xl text-center">
    Fearless Wallet <span class="color-accent">FAQ</span>
  </h1>
  <AccordionContainer class="w-narrow px-3xs my-xxl">
    <ContentList v-slot="{ list }" path="/faq">
      <AccordionItem v-for="(item, i) in list" :title="item.question" :key="i" :id="i" @toggle="toggleAccordion"
        :open="i === activeItem">
        <ContentRenderer :value="item" />
      </AccordionItem>
    </ContentList>
  </AccordionContainer>
</template>