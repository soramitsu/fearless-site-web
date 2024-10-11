<script setup lang="ts">
const { error } = defineProps<{
  error: {
    url: string
    statusCode: number
    statusMessage: string
    message: string
    description: string
    data: any
  }
}>()
</script>

<template>
  <Header />
  <section class="w px-3xs py-3xl text-center">
    <h1 class="mb-m wrap">
      Error <span class="color-accent">{{ error.statusCode }}</span>
    </h1>
    <p class="mb-l text-l">
      {{ error.statusMessage }}
    </p>
    <Button title="Go to the homepage" href="/" />
  </section>
  <Footer />
  <DynamicBackground />
</template>

<style scoped>
h1 {
  word-break: break-word;
}
</style>