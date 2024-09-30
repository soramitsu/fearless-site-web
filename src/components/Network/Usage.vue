<script setup lang="ts">
const { fullName, shortName } = defineProps<{
  fullName: string
  shortName: string
}>()

const data = computed(() => [
  `Store ${fullName} (${shortName}) securely`,
  `Keep your ${fullName} (${shortName}) safe with cutting-edge security features in Fearless Wallet`,
  `Effortlessly Send and Receive ${fullName} (${shortName})`,
  `Send and receive ${shortName} seamlessly using an ${fullName} address or by scanning a QR code`,
  `Instantly Swap ${fullName} (${shortName})`,
  `Exchange ${fullName} for other cryptocurrencies like DAI, USDT, and more in seconds — directly from your wallet via Polkaswap integration`,
  'Privacy and Security First',
  `Take full control of your ${fullName} while we ensure your security — fearlessly`,
  'Simple and user friendly',
  'Enjoy an intuitive interface designed for smooth and easy crypto management',
])
</script>

<template>
  <section class="w grid px-3xs">
    <div v-for="item, i in data" class="bg-block p-l rounded-s">
      <div class="icon bold mb-m">{{ i + 1 }}</div>
      <p class="text-s">{{ item }}</p>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  gap: var(--space-m);
}

.icon {
  width: var(--space-xl);
  height: var(--space-xl);
  border-radius: 50%;
  background-color: rgba(0, 0, 0, .6);
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (min-width: 800px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-auto-rows: 1fr;
  }
}
</style>