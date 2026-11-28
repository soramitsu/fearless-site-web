<script setup lang="ts">
// The first stop for a keyboard: past the notice and the header, to the
// page's content. With script the jump moves focus without writing "#main"
// into the address; without it the plain link does the same.
const skip = (event: MouseEvent) => {
  const main = document.getElementById('main')
  if (!main) return
  event.preventDefault()
  main.focus({ preventScroll: true })
  main.scrollIntoView({ block: 'start' })
}
</script>

<template>
  <a class="skip-link text-xs bold" href="#main" @click="skip">Skip to content</a>
</template>

<style scoped>
/* Out of sight above the page until it has focus (and transparent, so its
   shadow does not reach down into view either). */
.skip-link {
  position: fixed;
  top: var(--space-3xs);
  left: var(--space-3xs);
  z-index: 30;
  padding: var(--space-xxs) var(--space-xs);
  border-radius: 1.2rem;
  background-color: var(--fw-night);
  color: var(--fw-text);
  box-shadow: inset 0 0 0 1px var(--rim-gold), var(--shadow-plum);
  transform: translateY(calc(-100% - 2 * var(--space-xs)));
  opacity: 0;
}

.skip-link:focus {
  transform: none;
  opacity: 1;
}
</style>
