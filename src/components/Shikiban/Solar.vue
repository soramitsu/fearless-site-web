<script setup lang="ts">
import { geometry } from '~/lib/brand/geometry'

// The solar geometry from the brand kit. Each stroke draws over its own
// window as --draw runs from 0 to 1, a soft glow under a bright core, the
// stars arriving at their marks; the tick ring turns slowly. It draws once,
// when it first comes into view.
const props = withDefaults(defineProps<{
  // Which groups of the figure to draw.
  groups?: readonly string[]
  // Draw time; the kit's ignite takes 900 ms.
  ms?: number
  ticks?: boolean
}>(), {
  groups: () => ['ring', 'hexagram', 'lattice', 'ray'],
  ms: 900,
  ticks: true,
})

const { solar } = geometry
const strokes = computed(() => solar.strokes.filter(stroke => props.groups.includes(stroke.group)))
const stars = computed(() => solar.stars.filter(star => props.groups.includes('lattice') || star.size > 0.1))
const tickGap = (2 * Math.PI * solar.ticks.r) / solar.ticks.count

// A four-point star of the given size about a point.
const starPath = (x: number, y: number, size: number) => {
  const long = size / 2
  const short = long * 0.16
  return `M${x} ${y - long}L${x + short} ${y - short}L${x + long} ${y}L${x + short} ${y + short}L${x} ${y + long}L${x - short} ${y + short}L${x - long} ${y}L${x - short} ${y - short}Z`
}

const el = ref<SVGSVGElement>()
const drawn = ref(false)
// On screen: the tick ring turns only then (an SVG transform animation is
// repainted on the main thread, so it must not run unseen).
const live = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  if (!el.value || !('IntersectionObserver' in window)) {
    drawn.value = true
    return
  }
  observer = new IntersectionObserver(entries => {
    const entry = entries[entries.length - 1]!
    live.value = entry.isIntersecting
    if (entry.isIntersecting && entry.intersectionRatio >= 0.2) drawn.value = true
  }, { threshold: [0, 0.2] })
  observer.observe(el.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <svg ref="el" class="solar" :class="{ drawn, live }" :style="{ '--ms': `${ms}ms` }" viewBox="-1.12 -1.12 2.24 2.24"
    fill="none" stroke-linecap="round" aria-hidden="true">
    <g class="glow" :stroke="geometry.colors.glow">
      <path v-for="(stroke, index) in strokes" :key="`g${index}`" :d="stroke.d" pathLength="1" class="stroke"
        :style="{ '--a': stroke.from, '--b': stroke.to }" :stroke-width="solar.stroke.glow * stroke.weight" />
    </g>
    <g class="core" :stroke="geometry.colors.core">
      <path v-for="(stroke, index) in strokes" :key="`c${index}`" :d="stroke.d" pathLength="1" class="stroke"
        :style="{ '--a': stroke.from, '--b': stroke.to }" :stroke-width="solar.stroke.core * stroke.weight * 1.6" />
    </g>
    <circle v-if="ticks" class="ticks" :r="solar.ticks.r" :stroke="geometry.colors.core"
      :stroke-width="solar.ticks.size * 1.6" :stroke-dasharray="`0 ${tickGap}`" />
    <g class="stars" :fill="geometry.colors.star">
      <path v-for="(star, index) in stars" :key="`s${index}`" :d="starPath(star.x, star.y, star.size)" class="star"
        :style="{ '--a': star.reveal }" />
    </g>
  </svg>
</template>

<style scoped>
.solar {
  --draw: 1;
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* Only wait undrawn when motion is allowed; otherwise the figure is whole. */
.motion .solar {
  --draw: 0;
}

.motion .solar.drawn {
  --draw: 1;
  transition: --draw var(--ms) linear;
}

.glow {
  opacity: 0.32;
}

.stroke {
  stroke-dasharray: 1;
  stroke-dashoffset: calc((1 - clamp(0, (var(--draw) - var(--a)) / (var(--b) - var(--a)), 1)) * 1px);
}

.ticks {
  opacity: clamp(0, (var(--draw) - 0.2) * 5, 0.8);
  transform-origin: 0 0;
  animation: fw-turn 349s linear infinite;
  animation-play-state: paused;
}

.live .ticks {
  animation-play-state: running;
}

.star {
  opacity: clamp(0, (var(--draw) - var(--a)) * 30, 1);
  transform-box: fill-box;
  transform-origin: 50% 50%;
  transform: scale(clamp(0.2, (var(--draw) - var(--a)) * 30, 1));
}
</style>
