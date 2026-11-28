<script setup lang="ts">
// How far down the page you are, on the wallet's eight-segment dial. Gold
// lights up to the share read; at the end the centre fills. It appears once
// the page has moved, and takes you back to the top.
const share = ref(0)
const shown = ref(false)
let frame = 0

const read = () => {
  frame = 0
  const room = document.documentElement.scrollHeight - window.innerHeight
  share.value = room > 0 ? Math.min(1, Math.max(0, window.scrollY / room)) : 0
  shown.value = window.scrollY > window.innerHeight * 0.6
}

const onScroll = () => {
  if (!frame) frame = requestAnimationFrame(read)
}

const toTop = () => window.scrollTo({ top: 0 })

onMounted(() => {
  read()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (frame) cancelAnimationFrame(frame)
})
</script>

<template>
  <button class="scroll-dial press" :class="{ shown }" type="button" aria-label="Back to top"
    :tabindex="shown ? 0 : -1" @click="toTop">
    <ShikibanDial :share="share" />
    <svg class="arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 17V8M7.5 11.5 12 7l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round" />
    </svg>
  </button>
</template>

<style scoped>
:global(:root) {
  --scroll-dial-size: 5.2rem;
}

.scroll-dial {
  position: fixed;
  left: var(--space-xs);
  bottom: var(--space-xs);
  width: var(--scroll-dial-size);
  height: var(--scroll-dial-size);
  padding: 0.7rem;
  border-radius: 50%;
  background-color: rgba(26, 14, 62, 0.86);
  -webkit-backdrop-filter: blur(1.2rem);
  backdrop-filter: blur(1.2rem);
  box-shadow: inset 0 0 0 1px var(--color-line), 0 1rem 3rem rgba(8, 3, 26, 0.6);
  color: var(--fw-text);
  cursor: pointer;
  z-index: 9;
  opacity: 0;
  visibility: hidden;
  transform: scale(0.88);
  transition:
    opacity var(--d-180) linear,
    visibility var(--d-180) linear,
    transform var(--d-255) var(--ease-settle);
}

.scroll-dial.shown {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
}

.scroll-dial.shown:active {
  transform: scale(0.94);
}

.arrow {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 46%;
  height: 46%;
  transition: opacity var(--d-180) linear;
}

/* On a phone the left edge is where headings and text begin, and the dial
   covered their first letters as they scrolled past. It sits on the right
   there, where lines end; the cookie notice leaves it that column. */
@media (max-width: 639px) {
  .scroll-dial {
    left: auto;
    right: var(--space-xs);
  }
}

/* At the end of the page the dial's centre fills instead. */
.scroll-dial:has(.settled) .arrow {
  color: var(--fw-ink);
}
</style>
