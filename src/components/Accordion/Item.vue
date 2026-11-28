<script setup lang="ts">
// `level` is the question's heading level: 3 under a section heading (the
// default), 2 where the questions come straight after the page's title.
withDefaults(defineProps<{ title: string, name: string, level?: 2 | 3 }>(), { level: 3 })
</script>

<template>
  <details :name="name" class="item bg-block lit rounded-s px-m">
    <summary>
      <component :is="`h${level}`" class="title text-m py-m">
        {{ title }}
        <span class="icon" aria-hidden="true"></span>
      </component>
    </summary>
    <div class="pb-m text-s color-secondary rich">
      <slot />
    </div>
  </details>
</template>

<style scoped>
.item {
  transition: background-color var(--d-255) var(--ease-glide);
}

.item[open] {
  background-color: var(--color-bg-raised);
}

.item[open] summary {
  color: var(--fw-gold);
}

summary {
  display: block;
  cursor: pointer;
}

summary::-webkit-details-marker {
  display: none;
}

/* The same weight and tracking at either heading level. */
summary .title {
  display: grid;
  gap: var(--space-xs);
  grid-template-columns: 1fr auto;
  align-items: center;
  font-weight: 600;
  letter-spacing: -0.015em;
}

.icon {
  width: 1em;
  height: 1em;
  position: relative;
}

.icon::before,
.icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  height: 0.16em;
  width: 100%;
  margin: -0.08em 0;
  transition: transform var(--d-360) var(--ease-settle);
  border-radius: 1rem;
  background-color: currentColor;
}

.item:not([open]) .icon::after {
  transform: rotate(90deg);
}

.item[open] .icon::before {
  transform: rotate(-180deg);
}

@media (prefers-reduced-motion: reduce) {
  .item,
  .icon::before,
  .icon::after {
    transition: none;
  }
}

@media (hover:hover) {
  .item:hover {
    background-color: var(--color-bg-raised);
  }
}
</style>
