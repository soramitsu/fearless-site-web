<script setup lang="ts">
const { fullName, shortName } = defineProps<{
  fullName: string
  shortName: string
  description: string[]
  icon: string
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
  <section class="mt-xxl mb-3xl w-narrow px-l rich">
    <img :src="icon" :alt="`${fullName} icon`" class="mx-auto icon mb-xl" />
    <h2>About {{ fullName }}</h2>
    <p v-for="line in description">
      {{ line }}
    </p>
    <h2>
      Using {{ fullName }} in Fearless Wallet
    </h2>
    <ol>
      <li v-for="item in data">
        {{ item }}
      </li>
    </ol>
  </section>
</template>

<style scoped>
.icon {
  width: var(--space-3xl);
  height: var(--space-3xl);
}
</style>