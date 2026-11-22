<script setup lang="ts">
const props = defineProps<{ error?: { statusCode?: number } }>()
const missing = computed(() => props.error?.statusCode === 404)
</script>

<template>
  <section class="w px-3xs py-3xl text-center error">
    <NuxtLink to="/" class="mark" aria-label="Fearless Wallet home">
      <img src="/brand/lockup-stacked.svg" alt="Fearless" width="640" height="505">
    </NuxtLink>
    <h1 class="mb-s">
      {{ missing ? 'Page not found' : 'Something went wrong' }}
    </h1>
    <p class="color-secondary text-s mb-l">
      {{ missing ? 'This page has moved or never existed.' : 'Please try again in a moment.' }}
    </p>
    <Button title="Go to the homepage" href="/" accent />
  </section>
</template>

<style scoped>
.error {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.mark img {
  width: 18rem;
  height: auto;
  margin-bottom: var(--space-xl);
}
</style>
