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

const title = 'Download Fearless Wallet - Custodial Multichain Wallet',
  description =
    'Download the latest version of Fearless Wallet. The Fearless Wallet is available as a mobile app and desktop browser extension. Download the app now!',
  keywords =
    'crypto wallet apps, wallet app, wallet web, download, browser wallet, cryptowallet, crypto, multichain wallet, cryptowallet, crypto wallet, wallet, blockchain, buy, sell, bitcoin, btc, ethereum, eth, shiba inu, doge, self custody, web3 ,digital art, nft, exchange, swap, bridge'

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
    name: 'Download Fearless Wallet',
    description: 'Download the Fearless Wallet app to securely manage your cryptocurrencies and digital assets.',
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "Fearless Wallet",
      operatingSystem: "iOS, Android",
      applicationCategory: "Wallet",
      description: "Fearless Wallet is a secure and user-friendly wallet for managing your cryptocurrencies.",
      downloadUrl: "https://www.fearlesswallet.io/download",
      softwareVersion: "1.0.0",
      releaseNotes: "Initial release of Fearless Wallet with support for multiple cryptocurrencies.",
      offers: {
        "@type": "Offer",
        url: "https://www.fearlesswallet.io/download",
        priceCurrency: "USD",
        price: "0.00",
        itemCondition: "https://schema.org/NewCondition",
        availability: "https://schema.org/InStock"
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "1200"
      },
      image: {
        "@type": "ImageObject",
        url: "https://fearlesswallet.io/og.jpg",
        width: 1200,
        height: 630
      }
    }
  })
])
</script>

<template>
  <h1 class="w-narrow px-l pt-3xl text-center">
    <span class="color-accent">Download</span> Fearless Wallet
  </h1>
  <LinkTilesWithIconsSection :links="links" class="my-xxl" />
  <section class="w-narrow px-l mb-xxl rich">
    <h2 class="text-l mb-m">
      Download Fearless Wallet: Your Secure Cryptocurrency Management Solution
    </h2>

    <p>
      Welcome to the official download page for Fearless Wallet, the ultimate solution for secure and efficient
      cryptocurrency management. Whether you’re accessing it via a web browser, iOS, or Android device, Fearless Wallet
      offers seamless integration and robust security features tailored to meet your needs.
    </p>

    <hr>

    <h2 class="text-l mb-m">
      Why Choose Fearless Wallet?
    </h2>

    <ul>
      <li>
        <b class="color-accent">Cross-Platform Compatibility:</b> Easily manage your digital assets on any
        device—desktop, iPhone, or Android
        smartphone.
      </li>
      <li>
        <b class="color-accent">Top-Notch Security:</b> Protect your cryptocurrencies with advanced security protocols
        that ensure your funds
        are safe.
      </li>
      <li>
        <b class="color-accent">User-Friendly Interface:</b> Navigate effortlessly through our intuitive design, making
        cryptocurrency
        management simple for everyone.
      </li>
    </ul>

    <hr>

    <h2 class="text-l mb-m">
      Join the Fearless Community
    </h2>

    <p>
      Download Fearless Wallet today and take control of your cryptocurrency investments with confidence. Join a rapidly
      growing community of users who trust Fearless Wallet for their digital asset management needs.
    </p>
    <p>
      Start Your Fearless Journey Now!<br />
      Choose your preferred platform to get started.<br />
      Take charge of your cryptocurrency with Fearless Wallet—where security meets efficiency!
    </p>
  </section>
</template>