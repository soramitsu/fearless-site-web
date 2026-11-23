<script setup lang="ts">
import { geometry } from '~/lib/brand/geometry'

// The wallet's dial: a ring of eight segments, clockwise from 12 o'clock.
// Gold is lit up to `share`; a cyan comet circles while `busy`; a gold dot
// fills the centre once it is settled.
const props = withDefaults(defineProps<{
  share: number
  busy?: boolean
}>(), { busy: false })

const { segments, gapTurn, cometTurn, cometSeconds } = geometry.dial
const radius = 0.82
const arc = (fromTurn: number, toTurn: number) => {
  const at = (turn: number) => {
    const angle = turn * 2 * Math.PI - Math.PI / 2
    return `${(radius * Math.cos(angle)).toFixed(4)} ${(radius * Math.sin(angle)).toFixed(4)}`
  }
  return `M${at(fromTurn)}A${radius} ${radius} 0 0 1 ${at(toTurn)}`
}
const parts = Array.from({ length: segments }, (_, index) => ({
  d: arc(index / segments + gapTurn / 2, (index + 1) / segments - gapTurn / 2),
  index,
}))
const lit = (index: number) => Math.min(1, Math.max(0, props.share * segments - index))
const settled = computed(() => !props.busy && props.share >= 0.999)
const comet = arc(0, cometTurn)
</script>

<template>
  <svg class="dial" :class="{ busy, settled }" viewBox="-1 -1 2 2" fill="none" stroke-linecap="round"
    aria-hidden="true">
    <path v-for="part in parts" :key="`r${part.index}`" :d="part.d" class="rest" />
    <path v-for="part in parts" :key="`l${part.index}`" :d="part.d" pathLength="1" class="lit"
      :stroke-dasharray="`${lit(part.index)} 1`" :opacity="lit(part.index) > 0 ? 1 : 0" />
    <path :d="comet" class="comet" :style="{ animationDuration: `${cometSeconds}s` }" />
    <circle r="0.3" class="centre" />
    <circle :r="radius" class="seal" />
  </svg>
</template>

<style scoped>
.dial {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.rest,
.lit {
  stroke: var(--fw-gold);
  stroke-width: 0.2;
}

.rest {
  opacity: 0.2;
}

.lit {
  transition: stroke-dasharray var(--d-180) var(--ease-glide);
}

.comet {
  stroke: var(--fw-flight);
  stroke-width: 0.2;
  opacity: 0;
  transform-origin: 0 0;
}

.busy .comet {
  opacity: 1;
  animation: fw-turn-cw 1.44s linear infinite;
}

.centre {
  fill: var(--fw-gold);
  transform: scale(0);
  transform-origin: 0 0;
  transition: transform var(--d-255) var(--ease-settle);
}

.settled .centre {
  transform: scale(1);
}

.seal {
  stroke: var(--fw-gold);
  stroke-width: 0.06;
  opacity: 0;
  transform-origin: 0 0;
}

.settled .seal {
  animation: fw-pulse-ring var(--d-510) var(--ease-glide) 1;
}
</style>
