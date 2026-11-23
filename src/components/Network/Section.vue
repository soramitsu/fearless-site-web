<script setup lang="ts">
import { networks } from './networks'

const supportedNetworks = networks.filter(network => network.availability !== 'gated')
const roundedCount = Math.floor(supportedNetworks.length / 10) * 10
const icons = [...new Set(supportedNetworks.map(network => network.icon))].slice(0, 32)
</script>

<template>
  <section class="w px-3xs">
    <div v-reveal class="rounded-s bg-block lit px-l pt-xxl text-center networks">
      <ShikibanLattice />
      <NetworkVisual :icons="icons" class="bg rounded-s" />
      <ShikibanMarks />
      <h2 class="w-narrow mb-s">
        <span class="color-accent">{{ roundedCount }}+ Networks</span> including Bitcoin, Solana, TON, Ethereum, and Polkadot
      </h2>
      <p class="w-narrow text-s color-secondary mb-m">
        Network availability varies by app. For Karura, Polkadex and Ajuna, use a custom node in the Chrome extension.
      </p>
      <NetworkSearch :networks="supportedNetworks" class="mx-auto" />
    </div>
  </section>
</template>

<style scoped>
.networks {
  position: relative;
  padding-bottom: 16rem;
  z-index: 0;
}

.networks>*:not(.lattice):not(.marks):not(.bg) {
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
