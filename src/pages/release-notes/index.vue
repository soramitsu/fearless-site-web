<script setup lang="ts">
import { chromeExtensionUrl } from '~/lib/appLinks'

const links = [{
  icon: "appstore",
  title: "Fearless Wallet for iOS",
  description: "Find the current App Store version and browse the iOS release archive.",
  href: '/release-notes/ios',
  internal: true
},
{
  icon: "android",
  title: "Fearless Wallet for Android",
  description: "Find the current Google Play version and browse the Android release archive.",
  href: '/release-notes/android',
  internal: true
}, {
  icon: "chrome",
  title: "Fearless Wallet for Chrome",
  description: "Read the extension’s latest changes in the Chrome Web Store.",
  href: chromeExtensionUrl
}]

const title = 'Fearless Wallet Release Notes - Latest Updates & Features',
  description =
    'Discover the latest updates and features of Fearless Wallet. Stay informed with our comprehensive release notes for all platforms.',
  keywords =
    'Fearless Wallet, release notes, updates, features, DeFi, crypto wallet'

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
  defineWebPage({
    inLanguage: "en-US",
    name: 'Fearless Release Notes',
    description: 'Discover the latest updates and features of Fearless Wallet. Stay informed with our comprehensive release notes for all platforms.',
  })
])
</script>

<template>
  <h1 class="w-narrow px-l pt-3xl text-center">
    <span class="color-accent">Fearless</span> Release Notes
  </h1>
  <LinkTilesWithIconsSection :links="links" :columns="3" class="my-xxl" />
  <section class="w-narrow px-l mb-xxl rich">
    <p>The iOS and Android archives include releases published on GitHub. Newer versions may be available in the stores.</p>
  </section>
</template>
