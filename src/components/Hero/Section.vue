<script setup lang="ts">
const benefits = [
  [{ accent: '80+' }, ' networks'],
  [{ accent: '250k' }, ' users'],
  ['Cross-chain'],
  ['Founded in ', { accent: '2021' }],
  ['Self-custodial']
]
</script>

<template>
  <section class="o-hidden">
    <div class="w hero">
      <div class="text">
        <h1 class="mb-s">
          Multi-chain <span class="color-accent">Crypto Wallet</span>
        </h1>
        <p class="color-secondary text-s mb-m">
          True crypto ownership with Fearless DeFi Wallet. 80+ networks, one unified experience.
        </p>
        <div class="buttons mb-l">
          <Button href="https://qrcodes.pro/5FVEPa" title="Get Extension" icon="desktop" target="_blank" />
          <Button href="https://qrcodes.pro/9cSnKW " title="Get mobile app" icon="mobile" target="_blank" />
        </div>
        <div class="benefits">
          <div v-for="benefit in benefits" class="benefit text-s px-xs py-xxs">
            <template v-for="piece in benefit">
              <template v-if="typeof piece === 'object'">
                <span class="color-accent bold">{{ piece.accent }}</span>
              </template>
              <template v-else>{{ piece }}</template>
            </template>
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
}

.buttons,
.benefits {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.buttons {
  gap: var(--space-3xs);
}

.benefits {
  gap: var(--space-4xs);
}

.benefit {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: var(--space-xxs);
}

.image {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  pointer-events: none;
  margin: 0 -10% 0 0;
}

.image .inner {
  height: 110vw;
}

.text {
  padding: 0 var(--space-l) var(--space-l) var(--space-l);
  min-height: 56rem;
}

@media (min-width: 800px) {
  .hero {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding-top: var(--space-xxl);
    padding-bottom: var(--space-l);
  }

  .text {
    padding: var(--space-xl) var(--space-xs);
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