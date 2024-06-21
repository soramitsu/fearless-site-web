<template>
  <section class="w px-3xs">
    <div class="banner bg-block rounded-s">
      <div class="text">
        <h2 class="text-xxl mb-s">
          <span class="color-accent">Staking</span> made simple
        </h2>
        <p class="color-secondary text-s">
          Stake across 7+ networks, earn rewards, and contribute to network security.
        </p>
      </div>
      <div class="image pt-xl px-xl">
        <NuxtImg src="/features/stake.png" alt="Staking" loading="lazy" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.text {
  padding: var(--space-l);
}

.image {
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.image img {
  aspect-ratio: 375/430;
  object-fit: cover;
  border-radius: var(--space-s) var(--space-s) 0 0;
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0px 4rem 10rem 0px rgba(0, 0, 0, 0.6);
  transform: translateY(2px);
  max-width: 40rem;
  width: 100%;
}

@media (min-width: 760px) {
  .banner {
    display: grid;
    gap: var(--space-l);
    grid-template-columns: repeat(2, 1fr);
  }

  .text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: var(--space-xxl);
  }

  .text h2 {
    margin-right: -40%;
  }

  .image {
    padding-top: var(--space-xxl);
  }
}
</style>