<script setup lang="ts">
const features = [{
  title: 'Manage multiple networks',
  image: '/features/networks.svg',
}, {
  title: 'Hold, send and receive',
  image: '/features/send.svg',
}, {
  title: 'Scam warning ',
  image: '/features/scam-warning.svg',
  imageOnTop: true
}, {
  title: 'Swap',
  image: '/features/swap.svg',
},]
</script>

<template>
  <section class="w">
    <h2 v-reveal class="text-xxl text-center mb-xxl">
      Features
    </h2>
    <div class="grid px-3xs">
      <div v-for="(feature, index) in features" :key="feature.image" v-reveal="index % 2"
        class="rounded-s o-hidden bg-block lit feature">
        <ShikibanLattice />
        <ShikibanMarks />
        <h3 class="text-center px-m">{{ feature.title }}</h3>
        <div class="image px-m" :class="{ 'on-top': feature.imageOnTop }">
          <img :src="feature.image" :alt="feature.title" loading="lazy" width="375" height="430" />
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
  border: 1px solid rgba(255, 194, 74, 0.28);
  box-shadow: 0px 4rem 10rem 0px rgba(8, 3, 26, 0.7);
  transform: translateY(2px);
  max-width: 36rem;
  width: 100%;
  height: auto;
  transition: transform var(--d-510) var(--ease-settle);
}

.feature h3,
.feature .image {
  position: relative;
  z-index: 1;
}

@media (hover: hover) {
  .feature:hover .image:not(.on-top) img {
    transform: translateY(-1.2rem);
  }
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