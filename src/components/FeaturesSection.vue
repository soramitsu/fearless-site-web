<script setup lang="ts">
const features = [{
  title: 'Create or import account(s)',
  image: '/features/account.png',
  imageOnTop: true
}, {
  title: 'Manage multiple networks',
  image: '/features/networks.png',
}, {
  title: 'Hold, send and receive',
  image: '/features/send.png',
}, {
  title: 'Stake',
  image: '/features/stake.png',
}, {
  title: 'Swap',
  image: '/features/swap.png',
}]
</script>

<template>
  <section class="w">
    <h2 class="text-xxl text-center mb-xxl">
      Features
    </h2>
    <div class="grid px-3xs">
      <div v-for="feature in features" :key="feature.image" class="rounded-s o-hidden bg-block feature">
        <h3 class="text-center px-m">{{ feature.title }}</h3>
        <div class="image px-m" :class="{ 'on-top': feature.imageOnTop }">
          <NuxtImg :src="feature.image" :alt="feature.title" loading="lazy" sizes="75vw md:40vw" quality="80" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: flex;
  gap: var(--space-l);
  overflow-x: auto;
  align-items: flex-start;
}

.feature {
  width: 75vw;
  flex: 0 0 auto;
}

.feature:nth-child(even) {
  margin-top: var(--space-xxl);
}

.feature h3 {
  height: 4em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image {
  display: flex;
  justify-content: center;
  overflow: hidden;
  margin-top: -5rem;
  padding-top: 5rem;
}

.image img {
  aspect-ratio: 375/430;
  object-fit: cover;
  border-radius: var(--space-s) var(--space-s) 0 0;
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0px 4rem 10rem 0px rgba(0, 0, 0, 0.6);
  transform: translateY(2px);
  max-width: 36rem;
  width: 100%;
}

.image.on-top {
  margin-top: 0;
  padding-top: 0;
}

.image.on-top img {
  transform: translateY(-13%);
  border-radius: 0 0 var(--space-s) var(--space-s);
}

@media (min-width: 640px) {
  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .feature {
    width: unset;
  }

  .feature:nth-child(even) {
    margin-top: 20rem;
  }

  .feature:nth-child(even):not(:last-child) {
    margin-bottom: -20rem;
  }

  .feature h3 {
    max-width: 40rem;
    margin: 0 auto;
  }
}

@media (min-width: 800px) {
  .grid {
    gap: var(--space-xxl);
  }
}
</style>