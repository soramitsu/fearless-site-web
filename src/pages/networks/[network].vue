<script setup lang="ts">
import networks from '~/lib/networks'

const route = useRoute()

if (!(typeof route.params.network === 'string' && route.params.network in networks)) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
    fatal: true
  })
}

const { fullName, shortName, icon, description } = networks[route.params.network]
</script>

<template>
  <NetworkHero :fullName="fullName" :icon="icon" />
  <p v-for="line in description" class="w-narrow px-l mb-m">
    {{ line }}
  </p>

  <hr>
  <NetworkList title="Explore Other Networks" :networks="networks" />
</template>