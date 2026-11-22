<script setup lang="ts">
const isVisible = ref(false)
let showTimer: number

const handleCLick = () => {
  try {
    window.localStorage.cookieMessageAccepted = true
  } catch (e) {
    console.warn('No access to localSotage')
  }
  isVisible.value = false
}

onMounted(() => {
  if (!window?.localStorage?.cookieMessageAccepted) {
    showTimer = window.setTimeout(() => isVisible.value = true, 1000)
  }
})

onBeforeUnmount(() => window.clearTimeout(showTimer))
</script>

<template>
  <aside class="bumper bg-block lit p-m text-s rounded-xs" :class="{ visible: isVisible }" aria-label="Cookie notice">
    <p class="text-xs text-center">
      We use only necessary cookies to give you the most relevant experience.
    </p>
    <Button href="/privacy" title="Learn more" small />
    <Button @click="handleCLick" title="Accept" small accent />
  </aside>
</template>

<style scoped>
.bumper {
  display: none;
  flex-wrap: wrap;
  gap: var(--space-m) var(--space-3xs);
  -webkit-backdrop-filter: blur(4rem);
  backdrop-filter: blur(4rem);
  background-color: rgba(26, 14, 62, 0.9);
  /* Leave the fixed dial its own column when the notice scrolls into view. */
  width: calc(100% - var(--scroll-dial-size) - 2 * var(--space-xs) - var(--space-3xs));
  max-width: 46rem;
  margin: var(--space-xs) var(--space-3xs) var(--space-3xs) auto;
}

.bumper.visible {
  display: flex;
}

.bumper p {
  flex-basis: 100%;
}

.bumper .button {
  flex: 1 1 12rem;
}
</style>
