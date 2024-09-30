<script setup lang="ts">
defineProps<{
  fullName: string
  icon: string
}>()
</script>

<template>
  <section class="o-hidden">
    <div class="w hero">
      <div class="text">
        <h1 class="mb-s">
          <div class="label bg-block rounded-xs px-xs py-3xs text-s bold">
            Fearless Wallet:
          </div>
          Your Secure and User-Friendly <div class="color-accent chain">
            <img :src="icon" :alt="`${fullName} icon`" />
            {{ fullName }}
          </div>Wallet
        </h1>
        <p class="color-secondary text-s mb-m">
          Access {{ fullName }} in Fearless Wallet for secure storage and management of your assets.
        </p>
        <div class="buttons mb-l">
          <Button href="https://qrcodes.pro/5FVEPa" title="Get extension" icon="desktop" target="_blank" accent />
          <Button href="https://qrcodes.pro/9cSnKW " title="Get mobile app" icon="mobile" target="_blank" accent />
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
  position: relative;
}

.chain img {
  width: 1.2em;
  height: 1.2em;
  margin-bottom: -0.2em;
  display: inline-flex;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3xs);
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

.label {
  margin-bottom: var(--space-xxs);
  width: fit-content;
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

  .text>h1 {
    margin-right: -25%;
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