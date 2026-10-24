<script setup lang="ts">
defineProps<{
  fullName: string
}>()
</script>

<template>
  <section class="w py-3xl px-xs text-center">
    <h1 class="mb-s">
      Your Secure and User-Friendly <span class="color-accent">{{ fullName }}</span> Wallet
    </h1>
    <p class="color-secondary text-s mb-m">
      Securely store and manage your assets with Fearless Wallet on the {{ fullName }} network.
    </p>
    <p class="flex">
      <GetAppButtons accent />
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