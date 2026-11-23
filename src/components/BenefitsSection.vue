<script setup lang="ts">
const benefits = [
  {
    title: 'Self-custody',
    description: 'You and only you own your crypto. No access or control over your assets!',
    icon: 'custody'
  },
  {
    title: '100% open source',
    description: 'Our website,T&Cs, GitHub repositories, are all accessible within the app—as are roadmap and dev status information on upcoming features.',
    icon: 'open-source'
  },
  {
    title: 'Encryption',
    description: 'Fearless Wallet ensures top-tier security with up-to-date crypto protocols for Ethereum and Polkadot, providing robust encryption to safeguard your assets.',
    icon: 'encryption'
  },
  {
    title: 'Zero tracking',
    description: 'Fearless Wallet generates passwords and keys on your device, so only you have access to your accounts and data.',
    icon: 'privacy'
  },
  {
    title: 'Wallet management',
    description: "You can select any wallet controlled by Fearless, and import or create new ones.",
    icon: 'wallets'
  },
]
</script>

<template>
  <section class="w px-3xs">
    <h2 v-reveal class="text-center px-m w-narrow mb-s">
      <span class="color-accent">Security</span> You Can Trust, <span class="color-accent">Privacy</span> You Control
    </h2>
    <p v-reveal="1" class="color-secondary text-s text-center px-m w-narrow mb-l">
      Own you funds and data while we take care of your security - fearlessly.
    </p>
    <div v-reveal="2" class="grid rounded-s o-hidden lit">
      <div v-for="benefit, i in benefits" :key="benefit.title" class="bg-block p-l benefit"
        :class="{ accent: i === 0 }">
        <ShikibanLattice v-if="i === 0" />
        <div class="head">
          <div class="icon-wrap">
            <div v-if="i === 0" class="seal">
              <ShikibanSolar :groups="['ring', 'hexagram']" />
            </div>
            <div class="icon icon-well">
              <img :src="`/icons/animated/${benefit.icon}.svg`" alt="" width="64" height="64" loading="lazy">
            </div>
          </div>
          <h3 :class="{ 'text-m': i }">
            {{ benefit.title }}
          </h3>
        </div>
        <p class="color-secondary" :class="{ 'text-xs': i }">
          {{ benefit.description }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  gap: 1px;
}

.benefit {
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
  min-height: 20rem;
  justify-content: space-between;
}

.head {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.icon {
  width: var(--space-xl);
  height: var(--space-xl);
  position: relative;
  z-index: 1;
}

.benefit {
  position: relative;
}

.benefit .head,
.benefit p {
  position: relative;
  z-index: 1;
}

.icon-wrap {
  position: relative;
}

.accent .icon-wrap {
  margin: auto;
}

/* Self-custody sits inside the seal, which is centred on its icon. */
.seal {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 142%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  opacity: 0.6;
  pointer-events: none;
}

.icon img {
  width: 64%;
  height: 64%;
}

.accent .head {
  flex-direction: column;
  flex: 1;
  gap: var(--space-m);
}

.accent .icon {
  width: var(--space-3xl);
  height: var(--space-3xl);
  margin: auto;
}

.accent h3 {
  width: 100%;
  order: -1;
}

@media (min-width: 640px) and (max-width: 799px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .accent {
    grid-column-end: span 2;
  }
}

@media (min-width: 800px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-auto-rows: 1fr;
  }

  .accent {
    grid-row-end: span 2;
  }

  .accent .icon {
    width: 16rem;
    height: 16rem;
  }
}
</style>