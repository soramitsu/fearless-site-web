<script setup lang="ts">
// While the next page loads: the wallet's loader, three comets on the
// mirror's rim. Short loads show nothing.
const { isLoading } = useLoadingIndicator({ throttle: 180 })
</script>

<template>
  <div class="route-loader" :class="{ on: isLoading }">
    <ShikibanLoader v-if="isLoading" />
  </div>
</template>

<style scoped>
.route-loader {
  position: fixed;
  top: 8.8rem;
  left: 50%;
  width: 5.6rem;
  height: 5.6rem;
  margin-left: -2.8rem;
  padding: 1rem;
  border-radius: 50%;
  background-color: rgba(18, 10, 46, 0.86);
  -webkit-backdrop-filter: blur(1.2rem);
  backdrop-filter: blur(1.2rem);
  box-shadow: inset 0 0 0 1px var(--color-line), 0 1rem 3rem rgba(8, 3, 26, 0.6);
  z-index: 20;
  pointer-events: none;
  opacity: 0;
  transform: scale(0.88);
  transition: opacity var(--d-128) linear, transform var(--d-128) var(--ease-depart);
}

.route-loader.on {
  opacity: 1;
  transform: scale(1);
  transition: opacity var(--d-180) linear, transform var(--d-255) var(--ease-settle);
}
</style>
