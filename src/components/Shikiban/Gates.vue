<script setup lang="ts">
import { geometry } from '~/lib/brand/geometry'

// The six gates of the apps' launch: five plates (a circle with its inscribed
// square, alternately square and diamond) and last the eight-lobed mirror,
// each lying 1/√2 deeper than the one before. Seen flat they are the ad
// quadratum figure; as the page scrolls past, the camera travels and they
// come apart into a tunnel. One law: scale = p / (p + depth − camera).
const { gates, perspective, mirror } = geometry
const square = (diamond: boolean) => {
  const corners = diamond
    ? [[0, -1], [1, 0], [0, 1], [-1, 0]]
    : [[Math.SQRT1_2, -Math.SQRT1_2], [Math.SQRT1_2, Math.SQRT1_2], [-Math.SQRT1_2, Math.SQRT1_2], [-Math.SQRT1_2, -Math.SQRT1_2]]
  return `M${corners.map(([x, y]) => `${x!.toFixed(5)} ${y!.toFixed(5)}`).join('L')}Z`
}

const el = ref<SVGSVGElement>()
// How far the camera has travelled, as a share of the way to the mirror.
const travel = gates[gates.length - 1]!.depth * 0.92
let frame = 0
let observer: IntersectionObserver | undefined
let watching = false

const update = () => {
  frame = 0
  if (!el.value) return
  const box = el.value.getBoundingClientRect()
  const view = window.innerHeight || 1
  // 0 as the figure enters at the bottom, 1 as it leaves at the top.
  const progress = Math.min(1, Math.max(0, (view - box.top) / (view + box.height)))
  el.value.style.setProperty('--camera', (progress * travel).toFixed(1))
}

const onScroll = () => {
  if (watching && !frame) frame = requestAnimationFrame(update)
}

onMounted(() => {
  if (!el.value || !document.documentElement.classList.contains('motion')) return
  observer = new IntersectionObserver(entries => {
    watching = entries.some(entry => entry.isIntersecting)
    if (watching) onScroll()
  })
  observer.observe(el.value)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (frame) cancelAnimationFrame(frame)
})
</script>

<template>
  <svg ref="el" class="gates" viewBox="-1.02 -1.02 2.04 2.04" fill="none" stroke-linejoin="round"
    :style="{ '--p': perspective }" aria-hidden="true">
    <g v-for="(gate, index) in gates" :key="index" class="gate" :style="{ '--depth': gate.depth }">
      <template v-if="gate.figure === 'plate'">
        <circle r="1" />
        <path :d="square(gate.diamond)" />
      </template>
      <template v-else>
        <path :d="mirror.rim" />
        <circle :r="mirror.cusp * 0.94" />
      </template>
    </g>
  </svg>
</template>

<style scoped>
.gates {
  --camera: 0;
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.gate {
  --scale: calc(var(--p) / max(60, var(--p) + var(--depth) - var(--camera)));
  transform: scale(var(--scale));
  transform-origin: 0 0;
  /* A gate is gone once the camera has passed it. */
  opacity: clamp(0, (7 - var(--scale)) * 0.5, 1);
  stroke: var(--fw-gold-core);
  stroke-width: 1.4;
  vector-effect: non-scaling-stroke;
}

.gate circle,
.gate path {
  vector-effect: non-scaling-stroke;
}

.gate:last-child {
  stroke: var(--fw-gold);
  stroke-width: 2;
}
</style>
