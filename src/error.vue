<script setup lang="ts">
const props = defineProps<{ error?: { statusCode?: number } }>()
const missing = computed(() => props.error?.statusCode === 404)
const heading = computed(() => missing.value ? 'Page not found' : 'Something went wrong')

// The page says what it is in the tab and to a search engine, and keeps the
// site's header and footer so a visitor can go on from here.
useHead({
  title: () => `${heading.value} | Fearless Wallet`,
  meta: [{ name: 'robots', content: 'noindex' }],
})
</script>

<template>
  <SkipLink />
  <Header />
  <main id="main" tabindex="-1">
    <section class="w px-3xs py-3xl text-center error">
      <NuxtLink to="/" class="mark" aria-label="Fearless Wallet home">
        <img src="/brand/lockup-stacked.svg" alt="Fearless" width="640" height="505">
      </NuxtLink>
      <h1 class="mb-s">{{ heading }}</h1>
      <p class="color-secondary text-s mb-l">
        {{ missing ? 'This page has moved or never existed.' : 'Please try again in a moment.' }}
      </p>
      <Button title="Go to the homepage" href="/" accent />
    </section>
  </main>
  <Footer />
  <DynamicBackground />
</template>

<style scoped>
.error {
  min-height: 80vh;
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
