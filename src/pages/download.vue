<script setup lang="ts">
const links = [{
  icon: "chrome",
  title: "Fearless Wallet for Chrome",
  description: "Easily access and manage your Fearless Wallet directly from your browser with our Chrome extension.",
  href: 'https://chrome.google.com/webstore/detail/fearless-wallet/nhlnehondigmgckngjomcpcefcdplmgc',
},
{
  icon: "appstore",
  title: "Fearless Wallet for iOS",
  description: "Download Fearless Wallet from the App Store for a seamless and secure crypto experience on your iPhone or iPad.",
  href: 'https://apps.apple.com/us/app/fearless-wallet/id1537251089',
},
{
  icon: "playmarket",
  title: "Fearless Wallet for Android",
  description: "Get Fearless Wallet on your Android device from the Play Market.",
  href: 'https://play.google.com/store/apps/details?id=jp.co.soramitsu.fearless',
},
{
  icon: "github",
  title: "Fearless Wallet APK for Android",
  description: "Download the Fearless Wallet APK directly from GitHub for your Android device.",
  href: 'https://github.com/soramitsu/fearless-Android/releases',
}]
</script>

<template>
  <h1 class="w-narrow px-l pt-3xl text-center">
    <span class="color-accent">Download</span> Fearless Wallet
  </h1>
  <LinkTilesWithIconsSection :links="links" class="my-xxl" />
  <p class="w-narrow px-l mb-m">
    Welcome to the official download page for Fearless Wallet, your gateway to secure and efficient cryptocurrency
    management. Whether you're using a browser, iOS, or Android, we have you covered with seamless integration and
    top-notch security features. Choose your preferred platform and start your fearless journey today.
  </p>
  <p class="w-narrow px-l mb-xxl">
    Download Fearless Wallet now and take control of your cryptocurrency with confidence. Join a growing community of
    users who trust Fearless Wallet for secure and efficient digital asset management.
  </p>
</template>