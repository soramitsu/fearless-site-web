<template>
  <section class="w px-3xs">
    <h2 class="bg-block lit rounded-s py-s o-hidden mb-xxl">
      <div class="sliding">
        <template v-for="i in new Array(3)">
          <span>Fearlessly</span>
          <span class="icon crest"><img src="/brand/crest-badge-small.svg" alt="" /></span>
          <span class="color-accent">Feature-ready</span>
          <span class="icon icon-well"><img src="/icons/networks.svg" alt="" /></span>
        </template>
      </div>
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
</style>