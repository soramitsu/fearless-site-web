<script setup lang="ts">
const links = [{
  title: 'Telegram',
  href: 'https://t.me/fearlesswallet',
  icon: 'telegram',
  description: 'Join our Telegram community for real-time discussions, support, and updates about Fearless Wallet.'
}, {
  title: 'Announcements',
  href: 'https://t.me/fearless_announcements',
  icon: 'telegram',
  description: 'Stay up-to-date with the latest news and announcements from the Fearless Wallet team on Telegram.'
}, {
  title: 'X',
  href: 'https://twitter.com/fearlesswallet',
  icon: 'x',
  description: 'Follow us on X (formerly Twitter) for the latest updates, tips, and news about Fearless Wallet.'
}, {
  title: 'GitHub',
  href: 'https://github.com/soramitsu',
  icon: 'github',
  description: 'Explore our GitHub repository for the latest code, updates, and contributions to the Fearless Wallet project.'
}, {
  title: 'YouTube',
  href: 'https://www.youtube.com/fearlesswallet',
  icon: 'youtube',
  description: 'Subscribe to our YouTube channel for tutorials, updates, and insights about Fearless Wallet.'
}, {
  title: 'Medium',
  href: 'https://medium.com/fearlesswallet',
  icon: 'medium',
  description: 'Read our in-depth articles, updates, and stories about Fearless Wallet on Medium.'
}]
</script>

<template>
  <h1 class="w-narrow px-l pt-3xl text-center">
    Join the <span class="color-accent">Fearless Community</span>
  </h1>

  <LinkTilesWithIconsSection :links="links" :columns="3" class="my-xxl" />

  <p class="w-narrow px-l mb-m">
    Welcome to the Fearless Wallet community hub! Connect with us across various platforms to stay informed, get
    support, and engage with other users. Whether you prefer real-time chats, following the latest updates, exploring
    our codebase, or watching informative videos, we've got a place for you.
  </p>
  <p class="w-narrow px-l mb-xxl">
    Join us and be a part of the Fearless Wallet community today!
  </p>
</template>