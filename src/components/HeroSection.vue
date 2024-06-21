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
          Explore <span class="color-accent">Multi-chain Future</span>
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
        <NuxtImg src="/hero.png" alt="Fearless Wallet mobile app" />
      </div>
    </div>
  </section>
</template>

<style scoped>
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
  margin-right: -10%;
  pointer-events: none;
  aspect-ratio: 1521/1853;
}

.text {
  padding: 0 var(--space-l);
}

@media (min-width: 800px) {
  .hero {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding-bottom: var(--space-3xl);
  }

  .text {
    padding: var(--space-xl) var(--space-xs);
  }

  .image {
    margin: -8% -10% -24% -10%;
    align-self: center;
  }
}
</style>