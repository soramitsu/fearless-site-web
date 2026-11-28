<script setup lang="ts">
const { title, href, icon, external } = defineProps<{
  title: string
  href: string
  icon?: string
  external?: boolean
}>()
</script>

<template>
  <NuxtLink :href="href" class="banner outline-block rounded-s p-m bold" :target="external ? '_blank' : undefined">
    <div class="title">
      {{ title }}
    </div>
    <img :src="`/icons/${icon || external ? 'arrow' : 'arrow-right'}.svg`" alt="" class="icon">
  </NuxtLink>
</template>

<style scoped>
.banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-m);
  background-color: var(--color-bg-block);
  transition: border-color var(--d-255) var(--ease-glide), background-color var(--d-255) var(--ease-glide);
}

.banner>.title {
  flex: 1;
}

.icon {
  width: 1em;
  height: 1em;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}

@media (hover: hover) {
  .banner:hover {
    border-color: rgba(255, 194, 74, 0.6);
    background-color: var(--color-bg-raised);
  }
}
</style>