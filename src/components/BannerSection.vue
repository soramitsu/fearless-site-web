<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  img: {
    src: string
    alt: string
  }
}>()
</script>

<template>
  <section class="w px-3xs">
    <div v-reveal class="banner bg-block lit rounded-s o-hidden">
      <ShikibanLattice />
      <ShikibanMarks />
      <div class="ornament">
        <ShikibanSolar :groups="['ring', 'hexagram']" />
      </div>
      <div class="text">
        <h2 class="text-xxl mb-s">
          {{ title }}
        </h2>
        <p v-if="description" class="color-secondary text-s">
          {{ description }}
        </p>
      </div>
      <div class="image pt-xl px-xl">
        <img v-bind="img" loading="lazy" width="375" height="430" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.banner {
  position: relative;
}

.text,
.image {
  position: relative;
  z-index: 1;
}

.text {
  padding: var(--space-l);
}

/* The seal's rings and triangles, drawn as the banner arrives. */
.ornament {
  position: absolute;
  right: -8%;
  top: 50%;
  width: min(64rem, 70%);
  aspect-ratio: 1;
  transform: translateY(-46%);
  opacity: 0.4;
  pointer-events: none;
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
  border: 1px solid rgba(255, 194, 74, 0.28);
  box-shadow: 0px 4rem 10rem 0px rgba(8, 3, 26, 0.7);
  height: auto;
  transform: translateY(2px);
  max-width: 40rem;
  width: 100%;
}

@media (min-width: 800px) {
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