<script setup lang="ts">
import { detectMobileAppUrl } from '~/helpers/common'
import { chromeExtensionUrl, downloadPagePath } from '~/lib/appLinks'

defineProps<{
  accent?: boolean
}>()

// The server render and desktop visitors get the download page, which lists
// every store. Phones switch to their own store once the page is running.
const mobileAppHref = ref(downloadPagePath)

onMounted(() => {
  mobileAppHref.value = detectMobileAppUrl() ?? downloadPagePath
})
</script>

<template>
  <Button :href="chromeExtensionUrl" title="Get extension" icon="desktop" target="_blank" :accent="accent" />
  <Button :href="mobileAppHref" title="Get mobile app" icon="mobile"
    :target="mobileAppHref === downloadPagePath ? undefined : '_blank'" :accent="accent" />
</template>
