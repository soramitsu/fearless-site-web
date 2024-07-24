<script setup lang="ts">
import type { Link } from '~/lib/constants/types'

const { items } = defineProps<{
  items: {
    title: string,
    content: (string | Link)[][]
  }[]
}>()
const activeItem = ref<number>()

const toggleAccordion = (i: number) => {
  if (activeItem.value === i) {
    activeItem.value = undefined
  } else {
    activeItem.value = i
  }
}
</script>

<template>
  <div class="accordion">
    <div v-for="(item, i) in items" :key="i" class="item bg-block rounded-s px-m" :class="{ open: i === activeItem }">
      <h3 @click="toggleAccordion(i)" class="text-m py-m hover-trigger">
        {{ item.title }}
        <div class="icon">
          <span class="line"></span>
          <span class="line"></span>
        </div>
      </h3>
      <div class="content">
        <div>
          <div class="pb-m inner text-s color-secondary rich">
            <p v-for="p in item.content">
              <TextWithLinks :content="p" />
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.accordion {
  display: grid;
  gap: var(--space-xs);
}

.item {
  transition: background-color 0.3s ease;
}

.item.open {
  background-color: rgba(255, 255, 255, 0.1);
}

.item>h3 {
  display: grid;
  gap: var(--space-xs);
  grid-template-columns: 1fr auto;
  align-items: center;
  cursor: pointer;
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
  transition: transform .3s ease;
  border-radius: 1rem;
  background-color: currentColor;
}

.item:not(.open)>h3 .icon:after {
  transform: rotate(90deg);
}

.item.open>h3 .icon::before {
  transform: rotate(-180deg);
}

.content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows .3s ease;
  overflow: hidden;
  min-height: 0;
}

.content>div {
  min-height: 0;
}

.item.open .content {
  grid-template-rows: 1fr;
}

.inner {
  transform: translateY(var(--space-s));
  opacity: 0;
  transition: transform .3s ease, opacity .3s ease;
}

.item.open .inner {
  opacity: 1;
  transform: translateY(0);
}

@media (hover:hover) {
  .item:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>