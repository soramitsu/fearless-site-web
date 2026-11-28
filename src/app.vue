<script setup lang="ts">
import { pageUrl } from '~/lib/siteIdentity'

// A page reached by a link lands the way a later arrival does in the apps:
// the animation restarts once the new page has rendered. The first page of a
// visit does not animate here (the hero has its own arrival).
const page = ref<HTMLElement>()
const nuxtApp = useNuxtApp()
let first = true

// Every page names its own address, and carries the organization and the
// website in its structured data (a page adds its own nodes).
const route = useRoute()
const url = computed(() => pageUrl(route.path))
useHead({
  link: [{ key: 'canonical', rel: 'canonical', href: url }],
  meta: [{ key: 'og:url', property: 'og:url', content: url }],
})
useSchemaOrg()

// A link followed inside the site changes the page without a load, so a
// screen reader is told where it led: the new page's main heading. Nothing is
// said on the first page of a visit, which the browser announces itself.
const announcement = ref('')

nuxtApp.hook('page:finish', async () => {
  if (first) {
    first = false
    return
  }
  const el = page.value
  if (!el) return
  el.classList.remove('page-arrive')
  // Reading layout restarts the animation.
  void el.offsetWidth
  el.classList.add('page-arrive')
  // Emptied first, so two pages with the same heading are both announced.
  announcement.value = ''
  await nextTick()
  announcement.value = el.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim() || document.title
})
</script>

<template>
  <SkipLink />
  <RouteLoader />
  <ExtensionUpdateBanner />
  <Header />
  <main id="main" ref="page" tabindex="-1" @animationend.self="page?.classList.remove('page-arrive')">
    <NuxtPage />
  </main>
  <Footer />
  <CookieBumper />
  <ScrollDial />
  <DynamicBackground />
  <p class="visually-hidden" role="status" aria-live="polite" aria-atomic="true">{{ announcement }}</p>
</template>
