<script setup lang="ts">
// A page reached by a link lands the way a later arrival does in the apps:
// the animation restarts once the new page has rendered. The first page of a
// visit does not animate here (the hero has its own arrival).
const page = ref<HTMLElement>()
const nuxtApp = useNuxtApp()
let first = true

nuxtApp.hook('page:finish', () => {
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
})
</script>

<template>
  <RouteLoader />
  <ExtensionUpdateBanner />
  <Header />
  <main ref="page" @animationend.self="page?.classList.remove('page-arrive')">
    <NuxtPage />
  </main>
  <Footer />
  <CookieBumper />
  <ScrollDial />
  <DynamicBackground />
</template>
