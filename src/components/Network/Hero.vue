<script setup lang="ts">
import { chromeExtensionUrl } from '~/lib/appLinks'
import type { FeaturedNetwork } from '~/lib/networks'

defineProps<{ network: FeaturedNetwork }>()
</script>

<template>
  <section class="w py-3xl px-xs text-center">
    <h1 class="mb-s">
      <span class="color-accent">{{ network.fullName }}</span> Wallet
    </h1>
    <p v-if="network.availability === 'gated'" class="color-secondary text-s mb-m">
      {{ network.fullName }} mainnet transfers are not enabled yet.
    </p>
    <p v-else-if="network.availability === 'testnet'" class="color-secondary text-s mb-m">
      Use the Chrome extension to send {{ network.shortName }} on this testnet.
    </p>
    <p v-else class="color-secondary text-s mb-m">
      Manage {{ network.shortName }} on {{ network.fullName }} with Fearless Wallet.
    </p>
    <p class="flex">
      <Button v-if="network.testnetGuide" v-bind="network.testnetGuide" accent />
      <Button v-else-if="network.availability === 'testnet'" :href="chromeExtensionUrl" title="Get extension" icon="desktop" accent />
      <GetAppButtons v-else-if="network.availability === 'live'" accent />
    </p>
  </section>
</template>

<style scoped>
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3xs);
  flex-wrap: wrap;
}
</style>
