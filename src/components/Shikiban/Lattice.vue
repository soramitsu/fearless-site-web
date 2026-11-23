<script setup lang="ts">
// The asanoha lattice at 5 %, with the band of light that crosses it every
// nine seconds and shows the lattice at 32 % where it passes. The lattice is
// drawn once; only the band moves, and only while the card is on screen.
const el = ref<HTMLElement>()
const live = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  if (!el.value || !('IntersectionObserver' in window)) return
  observer = new IntersectionObserver(entries => {
    live.value = entries.some(entry => entry.isIntersecting)
  })
  observer.observe(el.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <span ref="el" class="lattice" :class="{ live }" aria-hidden="true">
    <span class="rest" />
    <span class="glint"><span class="band" /></span>
  </span>
</template>

<style scoped>
.lattice {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.rest,
.glint {
  position: absolute;
  inset: 0;
  -webkit-mask: url('/brand/asanoha.svg') 0 0 / 26px auto;
  mask: url('/brand/asanoha.svg') 0 0 / 26px auto;
}

.rest {
  background-color: rgba(255, 194, 74, 0.05);
}

.band {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 220px;
  background: linear-gradient(90deg, rgba(255, 213, 138, 0), rgba(255, 213, 138, 0.32) 50%, rgba(255, 213, 138, 0));
  transform: translateX(-240px);
}

.lattice.live .band {
  --band-travel: 140rem;
  animation: fw-band 9s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .band {
    display: none;
  }
}
</style>
