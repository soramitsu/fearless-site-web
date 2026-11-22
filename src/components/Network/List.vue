<script setup lang="ts">
import type { NetworkInfo } from '~/lib/constants/types'

defineProps<{
  title: string
  networks: {
    [key: string]: NetworkInfo
  }
}>()
</script>

<template>
  <section class="w mt-xxl mb-3xl px-m">
    <h2 class="mb-l">{{ title }}</h2>
    <div class="list">
      <NuxtLink v-for="(network, slug) in networks" :href="`/${slug.toString()}-wallet`" :key="network.shortName"
        class="bg-block lit rounded-s py-xs pl-xs pr-s link">
        <img :src="network.icon" :alt="`${network.fullName} icon`" />
        <div>
          <h3 class="text-s">{{ network.fullName }}</h3>
          <p v-if="network.shortName" class="color-secondary text-xxs">{{ network.shortName }}</p>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.list {
  display: flex;
  gap: var(--space-xxs);
  flex-direction: column;
}

.link {
  display: flex;
  gap: var(--space-xs);
  align-items: center;
}

.link img {
  width: var(--space-l);
  height: var(--space-l);
  border-radius: 50%;
}

@media (hover:hover) {
  .link {
    transition: background-color var(--d-255) var(--ease-glide);
  }

  .link:hover {
    background-color: var(--color-bg-raised);
  }
}

@media (min-width: 800px) {
  .list {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>