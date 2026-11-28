<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h3)))
</script>

<template>
  <h3 :id="id">
    <slot />
    <!-- A hover-only handle for copying a link to this heading: kept out of
         the heading's name and out of the Tab order. -->
    <a v-if="id && generate" :href="`#${id}`" class="anchor" aria-hidden="true" tabindex="-1">#</a>
  </h3>
</template>

<style scoped>
h3>.anchor {
  display: none;
}

@media (hover:hover) {
  h3 {
    position: relative;
  }

  h3>.anchor {
    position: absolute;
    display: inline-block;
    top: 0;
    left: 0;
    transform: translateX(-85%) scale(0.75);
    transform-origin: right;
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--d-255) var(--ease-glide), visibility var(--d-255) var(--ease-glide), transform var(--d-255) var(--ease-settle);
    color: var(--fw-gold);
    font-weight: 400;
    padding-right: .75em;
  }

  h3:hover>.anchor {
    opacity: 1;
    visibility: visible;
    transform: translateX(-100%) scale(0.75);
  }
}
</style>