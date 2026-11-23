<script setup lang="ts">
import type { NetworkInfo } from '~/lib/constants/types'

const props = defineProps<{ networks: (NetworkInfo & { slug?: string })[] }>()
const searchTerm = ref('')

const filteredNetworks = computed(() => {
  const query = searchTerm.value.trim().toLowerCase()
  return props.networks.filter(network =>
    network.fullName.toLowerCase().includes(query) || network.shortName?.toLowerCase().includes(query)
  )
})
</script>

<template>
  <div class="search">
    <input v-model="searchTerm" placeholder="Search supported networks" aria-label="Search supported networks"
      autocomplete="off" enterkeyhint="search" class="input text-xs rounded-xs" />
    <div class="list p-3xs rounded-xs text-xs">
      <ul v-if="filteredNetworks.length">
        <li v-for="network in filteredNetworks" :key="network.fullName">
          <template v-if="network.slug">
            <NuxtLink v-if="network.slug" :to="`/${network.slug}-wallet`" class="rounded-xs">
              <span class="icon"><img :src="network.icon" alt="" loading="lazy" /></span>
              <span class="name">{{ network.fullName }}</span>
              <img :src="`/icons/arrow-right.svg`" alt="" loading="lazy" class="arrow" />
            </NuxtLink>
          </template>
          <template v-else>
            <div>
              <span class="icon"><img :src="network.icon" alt="" loading="lazy" /></span>
              <span class="name">{{ network.fullName }}</span>
            </div>
          </template>
        </li>
      </ul>
      <p v-else class="text-center p-4xs">No networks found :-(</p>
    </div>
  </div>
</template>

<style scoped>
.search {
  max-width: 42rem;
  position: relative;
}

.input {
  padding: var(--space-xs) var(--space-l) var(--space-xs) var(--space-xs);
  border: none;
  width: 100%;
  color: var(--color-text-primary);
  background-color: rgba(18, 10, 46, .82);
  box-shadow: inset 0 0 0 1px var(--color-line), inset 0 1px 0 rgba(255, 194, 74, 0.3);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  background-image: url('/icons/search.svg');
  background-size: 1.2em;
  background-repeat: no-repeat;
  background-position: 96% center;
}

.input::placeholder {
  color: var(--fw-text-muted);
  opacity: 1;
}

.list {
  background-color: var(--fw-night);
  color: var(--fw-text);
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  right: 0;
  max-height: 24rem;
  overflow-y: auto;
  box-shadow: 0px 1rem 3rem 0 rgba(8, 3, 26, 0.7), inset 0 0 0 1px var(--color-line);
  visibility: hidden;
  opacity: 0;
  transform: scaleY(1.02) translateY(.4rem);
  transform-origin: top center;
  transition: opacity var(--d-180) linear, visibility var(--d-180) linear, transform var(--d-255) var(--ease-settle);
}

.list ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.list li div,
.list li a {
  display: flex;
  flex: 1;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-3xs);
}

.list li a {
  transition: background-color var(--d-255) var(--ease-glide);
}

.list .icon {
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
}

.list .icon img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.list .name {
  flex: 1;
  text-align: left;
}

.list .arrow {
  opacity: 0.25;
  width: 1em;
  height: 1em;
  transition: transform var(--d-255) var(--ease-settle), opacity var(--d-255) var(--ease-glide);
}

.search:focus-within .list,
.list:hover {
  visibility: visible;
  opacity: 1;
  transform: scaleY(1);
}

@media (hover: hover) {
  .list li a:hover {
    background-color: var(--fw-plum);
  }

  .list li a:hover .arrow {
    transform: translateX(-0.3em);
    opacity: 1;
  }
}
</style>
