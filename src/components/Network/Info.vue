<script setup lang="ts">
defineProps<{
  fullName: string
  description: string[]
  icon: string
}>()
</script>

<template>
  <section class="mt-xxl mb-3xl w-narrow px-l ">
    <img :src="icon" :alt="`${fullName} icon`" class="mx-auto icon mb-xl" />
    <h2 class="mb-l">About {{ fullName }}</h2>
    <p v-for="line in description" class="mb-m">
      {{ line }}
    </p>
  </section>
</template>

<style scoped>
.icon {
  width: var(--space-3xl);
  height: var(--space-3xl);
}
</style>