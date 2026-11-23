<script setup lang="ts">
const title = 'Terms of Service | Fearless Wallet'
const description =
  'The End User License Agreement between Soramitsu Helvetia AG and everyone who downloads or uses Fearless Wallet.'

useSeoMeta({
  title,
  ogTitle: title,
  twitterTitle: title,
  description,
  ogDescription: description,
  twitterDescription: description
})

// The document's path is given below, not read from the route: while a link
// is being followed the route is still the page being left, and the other
// legal page's text would be fetched and kept. The head above is this page's
// own, so the document does not set one.
</script>

<template>
  <ContentDoc path="/terms" :head="false" class="rich w-narrow px-m py-3xl" />
</template>
