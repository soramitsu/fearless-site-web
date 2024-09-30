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
  <NetworkWhy :fullName="fullName" />
  <NetworkInfo :fullName="fullName" :description="description" :icon="icon" />
  <BannerSection :title="`Using ${fullName} in Fearless Wallet`" :img="{
    src: '/features/hero.svg',
    alt: 'Home screen'
  }" class="mb-m" />
  <NetworkUsage :fullName="fullName" :shortName="shortName" />
  <NetworkFAQ :fullName="fullName" :shortName="shortName" />
  <hr>
  <NetworkList title="Explore Other Networks" :networks="networks" />
</template>