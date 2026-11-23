<script setup lang="ts">
const props = defineProps<{
  href?: string;
  title?: string;
  icon?: string;
  small?: boolean;
  xsSmall?: boolean;
  accent?: boolean;
  target?: "_blank" | "_self";
}>();

const component = computed(() => {
  if (props.href) return resolveComponent("NuxtLink");

  return "button";
});

const classComponent = computed(() => {
  const classes = [
    "button press",
    {
      accent: props.accent,
      "text-s bold px-m py-s": !props.xsSmall && !props.small,
      "text-xs px-3xs py-2xs": props.xsSmall,
      "text-xxs px-s py-xs": props.small,
    },
  ];

  return classes;
});
</script>

<template>
  <component
    :href="href"
    :is="component"
    :class="classComponent"
    :target="target"
  >
    <span class="shape"><span v-if="accent" class="sheen" /></span>

    <!-- The icon is decoration: the title names the button, and a button
         with an icon alone is named by the aria-label its user passes. -->
    <img
      v-if="icon"
      :src="`/icons/${icon}.svg`"
      alt=""
      class="icon"
    />

    <span v-if="title">{{ title }}</span>
  </component>
</template>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  position: relative;
  color: var(--color-text-primary);
  border-radius: 1.8rem;
  isolation: isolate;
}

.button > * {
  position: relative;
}

.icon {
  width: 1.3em;
  height: 1.3em;
}

/* Night glass with a line; the primary (pink) action is the brand fill with
   its glow, a lit rim and a slow sheen. */
.shape {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  overflow: hidden;
  background-color: rgba(31, 17, 72, 0.78);
  box-shadow: inset 0 0 0 1px var(--color-line), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transition: background-color var(--d-255) var(--ease-glide), box-shadow var(--d-255) var(--ease-glide);
  z-index: -1;
}

.button.accent .shape {
  background: linear-gradient(180deg, var(--fw-pink-fill), var(--fw-pink-deep));
  box-shadow:
    inset 0 0 0 1px rgba(255, 143, 196, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.28),
    0 0.8rem 2.8rem rgba(230, 0, 111, 0.42);
}

.sheen {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 34%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.26), rgba(255, 255, 255, 0));
  transform: translateX(-130%) skewX(-18deg);
  animation: fw-sheen 6s var(--ease-glide) infinite;
}

@media (hover: hover) {
  .button:hover .shape {
    background-color: rgba(46, 25, 104, 0.92);
    box-shadow: inset 0 0 0 1px rgba(255, 194, 74, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .button.accent:hover .shape {
    box-shadow:
      inset 0 0 0 1px rgba(255, 194, 74, 0.7),
      inset 0 1px 0 rgba(255, 255, 255, 0.32),
      0 1rem 3.6rem rgba(230, 0, 111, 0.6);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sheen {
    display: none;
  }
}
</style>
