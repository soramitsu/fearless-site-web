<script setup lang="ts">
const links = [{
  icon: "appstore",
  title: "Fearless Wallet for iOS",
  description: "Stay updated with the latest features and improvements in Fearless Wallet for iOS.",
  href: '/release-notes/ios',
  internal: true
},
{
  icon: "android",
  title: "Fearless Wallet for Android",
  description: "Stay updated with the latest features and improvements in Fearless Wallet for Android.",
  href: '/release-notes/android',
  internal: true
}]

const title = 'Fearless Wallet Release Notes',
  description =
    'TODO...',
  keywords =
    'TODO...'

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
  <h1 class="w-narrow px-l pt-3xl text-center">
    <span class="color-accent">Fearless</span> Release Notes
  </h1>
  <LinkTilesWithIconsSection :links="links" class="my-xxl" />
  <section class="w-narrow px-l mb-xxl rich">
    Discover enhanced security, performance upgrades, and bug fixes in our newest release. Keep your app up-to-date for
    the best experience.
  </section>
</template>