<script setup lang="ts">
const roadmap = [{
  title: 'SORA Ecosystem',
  items: [
    'Polkaswap liquidity pools',
    'Demeter Farming',
    'SORA Card'
  ]
}, {
  title: 'UI/UX Updates',
  items: [
    'New Asset management flow'
  ]
}, {
  title: 'EVM',
  items: [
    'New chain support',
    'Transaction gas management to speed them up',
    'DeFi tool integrations',
  ]
}]
</script>

<template>
  <h1 class="w-narrow px-l pt-3xl text-center">
    Roadmap for <span class="color-accent">Q2 2024</span>
  </h1>

  <div class="w grid px-3xs py-xxl">
    <div v-for="item in roadmap" :key="item.title" class="p-l bg-block rounded-s rich">
      <h2 class="text-m mb-m">{{ item.title }}</h2>
      <ul class="color-secondary text-s">
        <li v-for="subitem in item.items" :key="subitem">{{ subitem }}</li>
      </ul>
    </div>
  </div>

  <p class="w-narrow px-l mb-m">
    Welcome to our Roadmap page. Here, you can find a simplified overview of our upcoming developments and strategic
    initiatives. This overview provides a glimpse into our key focus areas as we continue to drive innovation and
    growth.
  </p>
  <p class="w-narrow px-l mb-xxl">
    Stay tuned for more detailed updates.
  </p>
</template>

<style scoped>
.grid {
  display: grid;
  gap: var(--space-m);
}

@media (min-width: 800px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 1fr;
  }
}
</style>