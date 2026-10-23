<script setup lang="ts">
import { type Link } from '~/lib/constants/types'
const props = defineProps<{ content: (string | Link)[] }>()
const segments = computed(() => props.content.map(item => typeof item === 'string'
  ? { isLink: false, title: item, href: '' }
  : { isLink: true, title: item.title, href: item.href }))
</script>

<template>
  <template v-for="item in segments">
    <template v-if="!item.isLink">{{ item.title }}</template>
    <template v-else>
      <NuxtLink :href="item.href" :target="item.href.startsWith('https://') ? '_blank' : undefined">
        {{ item.title }}
      </NuxtLink>
    </template>
  </template>
</template>
