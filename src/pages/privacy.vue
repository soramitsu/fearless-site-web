<script setup lang="ts">
const title = 'Privacy Policy | Fearless Wallet'
const description =
  'How SORAMITSU collects, uses, and discloses personal information when you use Fearless Wallet, with the browser extension privacy supplement.'

useSeoMeta({
  title,
  ogTitle: title,
  twitterTitle: title,
  description,
  ogDescription: description,
  twitterDescription: description
})

useSchemaOrg([defineWebPage({ inLanguage: 'en-US', name: 'Privacy Policy', description })])

// The document's path is given below, not read from the route: while a link
// is being followed the route is still the page being left, and the other
// legal page's text would be fetched and kept. The head above is this page's
// own, so the document does not set one.
</script>

<template>
  <ContentDoc path="/privacy" :head="false" class="rich w-narrow px-m py-3xl" />
</template>
