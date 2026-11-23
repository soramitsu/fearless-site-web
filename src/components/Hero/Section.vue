<script setup lang="ts">
const benefits = [
  { icon: 'networks', to: 50, suffix: '+', subline: 'networks' },
  { icon: 'users', to: 250, suffix: 'k+', subline: 'users' },
  { icon: 'wallets', to: 3, suffix: '', subline: 'platforms' },
]

const isTrailerOpen = ref(false)
</script>

<template>
  <section class="o-hidden">
    <div class="w hero">
      <div class="text">
        <p class="eyebrow tier text-xxs mb-xs" style="--tier: 0">
          <img src="/brand/crest-badge-small.svg" alt="" width="28" height="28">
          Your keys. Every chain.
        </p>
        <h1 class="tier mb-s" style="--tier: 1">
          Open-Source <span class="sun">Universal</span> Wallet
        </h1>
        <p class="tier color-secondary text-s mb-m" style="--tier: 2">
          One self-custody wallet for browser, iOS, and Android, with one phrase for Bitcoin, Solana, TON, EVM,
          Polkadot, and SORA accounts.
        </p>
        <div class="tier buttons mb-l" style="--tier: 3">
          <GetAppButtons accent />
          <button class="trailer-button press px-s py-xs text-s" type="button" @click="isTrailerOpen = true">
            Watch the trailer
          </button>
        </div>
        <div class="tier benefits" style="--tier: 4">
          <div v-for="(benefit, index) in benefits" :key="benefit.icon"
            class="benefit text-s px-xs py-xs bg-block lit rounded-xs">
            <img :src="`/icons/animated/${benefit.icon}.svg`" alt="" class="icon mb-xxs" width="64" height="64" />
            <span class="bold color-gold tabular">
              <span class="visually-hidden">{{ benefit.to }}{{ benefit.suffix }}</span>
              <span class="count" aria-hidden="true" :data-suffix="benefit.suffix"
                :style="{ '--to': benefit.to, '--order': index }" />
            </span><br>
            {{ benefit.subline }}
          </div>
        </div>
      </div>
      <div class="image">
        <HeroVisual class="inner" />
      </div>
    </div>
    <Modal :open="isTrailerOpen" label="Fearless Wallet trailer" @close="isTrailerOpen = false">
      <div class="video">
        <iframe v-if="isTrailerOpen" width="560" height="315"
          src="https://www.youtube-nocookie.com/embed/J0rAxcni6cs?autoplay=1" title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin" allowfullscreen class="rounded-s outline-block"
          loading="lazy"></iframe>
      </div>
    </Modal>
  </section>
</template>

<style scoped>
.hero {
  padding-top: var(--space-3xl);
  padding-bottom: var(--space-l);
  position: relative;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 0.8em;
  color: var(--fw-gold);
}

.eyebrow img {
  width: 2.8rem;
  height: 2.8rem;
}

/* The word the wallet is named for carries the sunset. */
.sun {
  background: linear-gradient(100deg, var(--fw-gold) 0%, var(--fw-ember) 38%, var(--fw-pink-text) 78%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3xs);
}

.benefits {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3xs);
}

.icon {
  width: 3.6rem;
  height: 3.6rem;
}

/* The numbers count to their value in 0.6 s, as the wallet's balance does.
   The real text is beside them for readers and for browsers that cannot
   animate a registered number. */
.count {
  --n: var(--to);
  counter-reset: n var(--n);
}

.count::after {
  content: counter(n) attr(data-suffix);
}

.image {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 -4%;
  position: relative;
}

.image .inner {
  width: 100%;
}

.text {
  padding: 0 0 var(--space-l) 0;
}

.text>* {
  padding-left: var(--space-l);
  padding-right: var(--space-l);
}

.text>.benefits {
  margin-left: var(--space-l);
  margin-right: var(--space-l);
  padding: 0;
}

/* In the row with the store buttons, so it never lies over the wallet. */
.trailer-button {
  position: relative;
  color: var(--fw-text);
  background-color: rgba(26, 14, 62, 0.86);
  box-shadow: inset 0 0 0 1px var(--color-line), inset 0 1px 0 rgba(255, 194, 74, 0.3);
  -webkit-backdrop-filter: blur(1.2rem);
  backdrop-filter: blur(1.2rem);
  display: flex;
  gap: var(--space-xs);
  border-radius: var(--space-xl);
  align-items: center;
}

.trailer-button::before {
  content: '';
  background-image: url('/icons/play.svg');
  background-size: contain;
  background-repeat: no-repeat;
  width: 1em;
  height: 1em;
}

.video {
  aspect-ratio: 16 / 9;
  width: 100%;
}

.video>iframe {
  width: 100%;
  height: 100%;
}

@media (hover:hover) {
  .trailer-button {
    transition: box-shadow var(--d-255) var(--ease-glide), transform var(--d-180) var(--ease-settle);
  }

  .trailer-button:hover {
    box-shadow: inset 0 0 0 1px rgba(255, 194, 74, 0.6), inset 0 1px 0 rgba(255, 194, 74, 0.3);
  }
}

@media (min-width: 800px) {
  .hero {
    display: grid;
    grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
    align-items: center;
    padding-top: var(--space-xxl);
  }

  .text {
    padding: var(--space-xl) var(--space-xs);
  }

  .text>* {
    padding-left: unset;
    padding-right: unset;
  }

  .text>.benefits {
    margin-left: 0;
    margin-right: 0;
    max-width: 49rem;
  }

  .image {
    align-self: center;
    margin: 0 -2% 0 0;
  }
}
</style>

<!-- Not scoped: the hero lands in tiers from the first paint, which depends
     on the `motion` class on <html>. Tier k starts k × 45 ms later. -->
<style>
@property --n {
  syntax: '<integer>';
  inherits: false;
  initial-value: 0;
}

.motion .hero .tier {
  animation: fw-hero-land var(--d-510) var(--ease-settle) calc(120ms + var(--tier, 0) * 45ms) both;
  transform-origin: 30% 40%;
}

.motion .hero .count {
  animation: fw-count-up 600ms var(--ease-glide) calc(420ms + var(--order, 0) * 90ms) both;
}

@keyframes fw-hero-land {
  0% {
    opacity: 0;
    transform: translate3d(0, 1.8rem, 0) scale(0.92);
  }

  45% {
    opacity: 1;
  }

  100% {
    opacity: 1;
    transform: none;
  }
}

@keyframes fw-count-up {
  from {
    --n: 0;
  }
}
</style>
