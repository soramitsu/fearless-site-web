<script setup lang="ts">
const benefits = [
  { icon: 'networks', accent: '80+', subline: ' networks' },
  { icon: 'user', accent: '250k', subline: ' users' },
  { icon: 'calendar', accent: '2021', subline: 'founded' },
  { icon: 'star', accent: '4/5+', subline: 'rating' },
]
</script>

<template>
  <section class="o-hidden">
    <div class="w hero">
      <div class="text">
        <h1 class="mb-s">
          Multi-chain Crypto Wallet
        </h1>
        <p class="color-secondary text-s mb-m">
          True crypto ownership with Fearless DeFi Wallet. 80+ networks, one unified experience.
        </p>
        <div class="buttons mb-l">
          <Button href="https://qrcodes.pro/5FVEPa" title="Get Extension" icon="desktop" target="_blank" accent />
          <Button href="https://qrcodes.pro/9cSnKW " title="Get mobile app" icon="mobile" target="_blank" accent />
        </div>
        <div class="benefits">
          <div v-for="benefit in benefits" class="text-s px-xs py-xs outline-block rounded-xs">
            <img :src="`/icons/${benefit.icon}.svg`" :alt="`${benefit.icon} icon`" class="icon mb-xxs" />
            <span class="bold color-accent">{{ benefit.accent }}</span><br>
            {{ benefit.subline }}
          </div>
        </div>
      </div>
      <div class="image">
        <HeroVisual class="inner" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding-top: var(--space-3xl);
  padding-bottom: var(--space-l);
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3xs);
}

.benefits {
  display: grid;
  grid-template-columns: repeat(4, minmax(10rem, 1fr));
  gap: var(--space-4xs);
  overflow-x: auto;
}

.icon {
  width: 2.4rem;
  height: 2.4rem;
}

.image {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  pointer-events: none;
  margin: 0 -10% 0 0;
  position: relative;
}

.image .inner {
  height: 110vw;
}

.text {
  padding: 0 0 var(--space-l) 0;
  min-height: 56rem;
}

.text>* {
  padding-left: var(--space-l);
  padding-right: var(--space-l);
}

@media (min-width: 800px) {
  .hero {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding-top: var(--space-xxl);
  }

  .text {
    padding: var(--space-xl) var(--space-xs);
  }

  .text>* {
    padding-left: unset;
    padding-right: unset;
  }

  .benefits {
    grid-template-columns: repeat(3, 1fr);
    max-width: 49rem;
  }

  .image {
    align-self: center;
    aspect-ratio: unset;
    margin: 0;
  }

  .image .inner {
    height: 100%;
    min-height: 80rem;
  }
}
</style>