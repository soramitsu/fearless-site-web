<script setup lang="ts">
import type { FeaturedNetwork } from '~/lib/networks'

defineProps<{ network: FeaturedNetwork }>()
</script>

<template>
  <section class="mt-xxl mb-3xl w-narrow px-l rich">
    <img :src="network.icon" :alt="`${network.fullName} logo`" class="mx-auto icon mb-xl" />
    <h2>About {{ network.fullName }}</h2>
    <p v-for="line in network.description" :key="line">
      {{ line }}
    </p>
    <template v-if="network.availability === 'live'">
      <h2>Using {{ network.fullName }} in Fearless Wallet</h2>
      <ol>
        <li>Select {{ network.shortName }} on {{ network.fullName }}.</li>
        <li>To receive {{ network.shortName }}, select <b>Receive</b> to see your address.</li>
        <li>To send {{ network.shortName }}, select <b>Send</b>, enter the recipient’s address and review the fee.</li>
      </ol>
    </template>
  </section>
</template>

<style scoped>
.icon {
  width: var(--space-3xl);
  height: var(--space-3xl);
}
</style>
