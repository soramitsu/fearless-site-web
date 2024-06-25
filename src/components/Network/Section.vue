<template>
  <section class="w px-3xs">
    <div class="rounded-s bg-block px-l pt-xxl text-center networks">
      <NetworkVisual class="bg rounded-s" />
      <h2 class="w-narrow mb-s">
        <span class="color-accent">80+ networks</span> on Ethereum and Polkadot
      </h2>
      <p class="w-narrow text-s color-secondary mb-m">
        Fearless Wallet supports over 80 networks from Ethereum and Polkadot ecosystems, including: Polygon, Binance
        Smart Chain, Moonbeam, Kusama and more.
      </p>
      <NetworkSearch class="mx-auto" />
    </div>
  </section>
</template>

<style scoped>
.networks {
  position: relative;
  padding-bottom: 18rem;
  z-index: 0;
}

.networks>* {
  position: relative;
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>