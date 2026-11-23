<script setup lang="ts">
const title = 'Fearless Wallet The DeFi Crypto Wallet for Multi-Chain Future',
  description =
    'Fearless Wallet is an open-source self-custody wallet for browser, iOS, and Android. One Universal Wallet phrase restores Bitcoin, Solana, TON, EVM, Polkadot, and SORA accounts.',
  keywords =
    'crypto wallet apps, wallet app, wallet web, browser wallet, crypto wallet, blockchain wallet app, bitcoin wallet, solana wallet, ton wallet, SORA Nexus wallet'

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
    name: title,
    description: description
  }),
  {
    "@type": "SoftwareApplication",
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
  }
])
</script>

<template>
  <HeroSection class="pb-xl" />
  <NetworkSection class="mb-xxl" />
  <FeaturesSection class="mb-3xl" />
  <section class="w px-3xs mb-3xl">
    <div v-reveal class="rounded-s bg-block lit o-hidden px-l py-xxl universal">
      <ShikibanLattice />
      <ShikibanMarks />
      <div class="tunnel">
        <ShikibanGates />
      </div>
      <h2 class="text-xl mb-s">
        One <span class="color-gold">Universal Wallet</span> for the supported ecosystems
      </h2>
      <p class="text-s color-secondary mb-l">
        Create or import one recovery phrase and use it across the maintained Fearless Wallet apps: iOS, Android, and
        the browser extension. The wallet roadmap covers Bitcoin, Solana, TON, EVM, Polkadot/Substrate, and SORA
        Nexus/Taira accounts with open-source wallet core code.
      </p>
      <ul class="ecosystems text-s color-secondary">
        <li>Bitcoin native SegWit accounts for BTC receive, send, balance, and history.</li>
        <li>Solana accounts, SPL Token visibility, and browser-extension dApp connection support.</li>
        <li>TON wallet support using the public TI indexer at ti.soramitsu.io.</li>
        <li>SORA Nexus and Taira Iroha account support with Nexus mainnet gated until production Torii is confirmed.</li>
      </ul>
    </div>
  </section>
  <BannerSection title="Earn with Staking"
    description="Stake across 7+ networks, earn rewards, and contribute to network security." :img="{
      src: '/features/stake.svg',
      alt: 'Staking'
    }" class="mb-3xl" />
  <BenefitsSection class="mb-3xl" />
  <ManifestSection class="mb-3xl" />
</template>

<style scoped>
.universal {
  position: relative;
}

.universal>h2,
.universal>p,
.universal>ul {
  position: relative;
  z-index: 1;
  max-width: 82rem;
}

/* The launch's gates, seen from the side of the card: scrolling the page
   moves the camera through them. */
.tunnel {
  position: absolute;
  right: -12rem;
  top: 50%;
  width: 62rem;
  aspect-ratio: 1;
  transform: translateY(-50%);
  opacity: 0.5;
  pointer-events: none;
}

.ecosystems {
  display: grid;
  gap: var(--space-xs);
  list-style: none;
  padding: 0;
}

.ecosystems li {
  position: relative;
  padding-left: 2.4rem;
}

.ecosystems li::before {
  content: '';
  position: absolute;
  left: 0.2rem;
  top: 0.55em;
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 50%;
  background-color: var(--fw-gold);
  box-shadow: 0 0 1rem rgba(255, 194, 74, 0.7);
}

@media (max-width: 799px) {
  .tunnel {
    right: -26rem;
    opacity: 0.28;
  }
}

@media (min-width: 800px) {
  .ecosystems {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
