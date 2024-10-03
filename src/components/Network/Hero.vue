<script setup lang="ts">
defineProps<{
  fullName: string
}>()
</script>

<template>
  <section class="w py-3xl px-xs text-center">
    <h1 class="mb-s">
      <div class="label bg-block rounded-xs px-xs py-3xs text-s bold">
        Fearless Wallet:
      </div>
      Your Secure and User-Friendly <span class="color-accent">{{ fullName }}</span> Wallet
    </h1>
    <p class="color-secondary text-s mb-m">
      Access {{ fullName }} in Fearless Wallet for secure storage and management of your assets.
    </p>
    <p class="flex">
      <Button href="https://qrcodes.pro/5FVEPa" title="Get extension" icon="desktop" target="_blank" accent />
      <Button href="https://qrcodes.pro/9cSnKW " title="Get mobile app" icon="mobile" target="_blank" accent />
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

.label {
  width: fit-content;
  margin: 0 auto var(--space-xs) auto;
}
</style>