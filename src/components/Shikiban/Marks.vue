<script setup lang="ts">
// The composition marks the wallet's balance card carries: a gold bracket in
// each corner and short ticks at 1 − 1/√2, 1/2 and 1/√2 of the width.
const ticks = ['29.289%', '50%', '70.711%']
</script>

<template>
  <span class="marks" aria-hidden="true">
    <i class="corner tl" /><i class="corner tr" /><i class="corner bl" /><i class="corner br" />
    <template v-for="tick in ticks" :key="tick">
      <i class="tick top" :style="{ left: tick }" /><i class="tick bottom" :style="{ left: tick }" />
    </template>
  </span>
</template>

<style scoped>
.marks {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  z-index: 1;
}

.corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 0 solid rgba(255, 194, 74, 0.7);
  transition: transform var(--d-360) var(--ease-settle);
}

.tl {
  top: 9px;
  left: 9px;
  border-top-width: 1px;
  border-left-width: 1px;
}

.tr {
  top: 9px;
  right: 9px;
  border-top-width: 1px;
  border-right-width: 1px;
}

.bl {
  bottom: 9px;
  left: 9px;
  border-bottom-width: 1px;
  border-left-width: 1px;
}

.br {
  bottom: 9px;
  right: 9px;
  border-bottom-width: 1px;
  border-right-width: 1px;
}

.tick {
  position: absolute;
  width: 1px;
  height: 4px;
  background-color: rgba(255, 194, 74, 0.45);
}

.tick.top {
  top: 4px;
}

.tick.bottom {
  bottom: 4px;
}
</style>
