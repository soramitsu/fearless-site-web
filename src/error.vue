<script setup lang="ts">
const props = defineProps<{ error?: { statusCode?: number } }>()
const missing = computed(() => props.error?.statusCode === 404)
const heading = computed(() => missing.value ? 'Page not found' : 'Something went wrong')

// A link followed inside the site that leads here replaces the whole app, so
// the page announces its heading itself, as app.vue does for other pages.
// Arriving here from the server (a typed or shared address) needs no
// announcement: the browser reads the new page.
const announcement = ref('')
const arrivedFromServer = useNuxtApp().isHydrating
onMounted(async () => {
  if (arrivedFromServer) return
  await nextTick()
  announcement.value = heading.value
})

// The page says what it is in the tab and to a search engine, and keeps the
// site's header and footer so a visitor can go on from here.
useHead({
  title: () => `${heading.value} | Fearless Wallet`,
  meta: [
    { name: 'robots', content: 'noindex' },
    { key: 'description', name: 'description', content: () => missing.value ? 'This page does not exist on fearlesswallet.io.' : 'This page could not be shown.' },
    { key: 'og:title', property: 'og:title', content: () => `${heading.value} | Fearless Wallet` },
    { key: 'og:description', property: 'og:description', content: () => missing.value ? 'This page does not exist on fearlesswallet.io.' : 'This page could not be shown.' },
    { key: 'twitter:title', name: 'twitter:title', content: () => `${heading.value} | Fearless Wallet` },
    { key: 'twitter:description', name: 'twitter:description', content: () => missing.value ? 'This page does not exist on fearlesswallet.io.' : 'This page could not be shown.' },
  ],
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
  <p class="visually-hidden" role="status" aria-live="polite" aria-atomic="true">{{ announcement }}</p>
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
