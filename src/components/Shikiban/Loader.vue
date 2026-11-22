<script setup lang="ts">
import { geometry } from '~/lib/brand/geometry'

// The wallet's loader: three comets (the crow's three legs) circling the
// eight-lobed mirror's rim, a third of a turn apart, each with a fading tail.
// With reduced motion the comets stand still.
const { rim, cusp } = geometry.mirror
const { comets, tailTurn, secondsPerTurn } = geometry.loader
const gap = 1 / comets
// Three strokes with the same head and shorter, brighter dashes make the tail.
const tails = [
  { length: tailTurn, opacity: 0.25 },
  { length: tailTurn * 0.6, opacity: 0.55 },
  { length: tailTurn * 0.25, opacity: 1 },
].map(tail => ({
  ...tail,
  dash: `${tail.length} ${gap - tail.length}`,
  offset: -(tailTurn - tail.length),
}))
const inner = (cusp * 0.94) / Math.SQRT2
</script>

<template>
  <svg class="loader" viewBox="-1.08 -1.08 2.16 2.16" fill="none" stroke-linecap="round" role="img"
    aria-label="Loading">
    <path :d="rim" class="rest" />
    <circle :r="inner" class="rest" />
    <path v-for="(tail, index) in tails" :key="index" :d="rim" pathLength="1" class="comet"
      :stroke-dasharray="tail.dash" :opacity="tail.opacity"
      :style="{ '--offset': tail.offset, animationDuration: `${secondsPerTurn}s` }" />
  </svg>
</template>

<style scoped>
.loader {
  display: block;
  width: 100%;
  height: 100%;
}

.rest {
  stroke: var(--fw-gold);
  stroke-width: 0.045;
  opacity: 0.25;
}

/* Running the dashes along the rim keeps the comets on its lobes. */
.comet {
  stroke: var(--fw-flight);
  stroke-width: 0.085;
  stroke-dashoffset: calc(var(--offset) * 1px);
  animation: loader-run 2.88s linear infinite;
}

@keyframes loader-run {
  to {
    stroke-dashoffset: calc((var(--offset) - 1) * 1px);
  }
}
</style>
