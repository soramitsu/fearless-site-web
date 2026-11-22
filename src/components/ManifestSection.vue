<template>
  <section class="w px-3xs">
    <h2 class="bg-block lit rounded-s py-s o-hidden mb-xxl">
      <span class="phrase visually-hidden">Fearlessly <span class="color-accent">Feature-ready</span></span>
      <span class="sliding" aria-hidden="true">
        <template v-for="i in 3" :key="i">
          <span>Fearlessly</span>
          <span class="icon crest"><img src="/brand/crest-badge-small.svg" alt="" /></span>
          <span class="color-accent">Feature-ready</span>
          <span class="icon icon-well"><img src="/icons/networks.svg" alt="" /></span>
        </template>
      </span>
    </h2>
    <p v-reveal class="text-l bold w-narrow px-m mb-l">
      Fearless Wallet's goal is to empower You to take <span class="color-accent">charge of your financial
        destiny</span>. With <span class="color-accent">our easy-to-use tools</span> and blockchain flexibility,
      managing and growing your portfolio has never been easier or more exciting.
    </p>
    <p v-reveal="1" class="text-l bold w-narrow px-m mb-xxl">
      Join us and Stay Fearless!
    </p>
    <div v-reveal="2" class="w-narrow px-m buttons">
      <GetAppButtons />
    </div>
  </section>
</template>

<style scoped>
.sliding {
  display: flex;
  gap: var(--space-l);
  padding-left: var(--space-l);
  width: fit-content;
  justify-content: space-around;
  align-items: center;
  text-wrap: nowrap;
  will-change: transform;
  animation: sliding 9s linear infinite;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  border-radius: 50%;
}

.icon img {
  width: 50%;
  height: 50%;
}

.icon.crest img {
  width: 100%;
  height: 100%;
}

.buttons {
  display: flex;
  gap: var(--space-3xs);
  flex-wrap: wrap;
  align-items: center;
}

@keyframes sliding {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-33.33%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sliding {
    display: none;
    animation: none;
  }

  .phrase {
    position: static;
    display: block;
    width: auto;
    height: auto;
    margin: 0;
    padding-inline: var(--space-xs);
    clip: auto;
    white-space: normal;
    overflow-wrap: anywhere;
    text-align: center;
  }
}
</style>
