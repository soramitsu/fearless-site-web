<script setup lang="ts">
const open = ref(false)
const scrolled = ref(false)
const burger = ref<HTMLButtonElement>()
const nav = ref<HTMLElement>()

const router = useRouter()
router.afterEach(() => open.value = false)

// Opening the menu from the keyboard moves into it; Escape closes it and
// hands focus back to the button.
const toggle = async () => {
  open.value = !open.value
  if (!open.value) return
  await nextTick()
  nav.value?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true })
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || !open.value) return
  open.value = false
  burger.value?.focus()
}

const menu = [
  {
    title: 'Roadmap',
    href: '/roadmap'
  },
  {
    title: 'FAQ',
    href: '/faq'
  },
  {
    title: 'Blog',
    href: '/blog',
  },
  {
    title: 'wiki',
    href: 'https://wiki.fearlesswallet.io/',
    external: true
  }
];

// The bar turns to glass once the page has moved under it.
const onScroll = () => { scrolled.value = window.scrollY > 12 }

onMounted(() => {
  // The head script opens the menu until the app runs; take its state over.
  open.value = nav.value?.classList.contains('open') ?? false
  document.documentElement.classList.add('nav-ready')
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="header-anchor">
    <header class="header pt-xs pb-l" :class="{ scrolled }" v-on-click-outside="() => { open = false }">
      <div class="w px-xs inner text-xxs">
        <NuxtLink to="/" class="home" aria-label="Fearless Wallet home">
          <img src="/logo.svg" alt="Fearless Wallet" width="148" height="32">
        </NuxtLink>
        <button ref="burger" class="burger press" :class="{ open }" type="button" :aria-expanded="open"
          aria-controls="site-menu" aria-label="Menu" @click="toggle">Menu</button>
        <nav id="site-menu" ref="nav" class="nav" :class="{ open }" aria-label="Site">
          <div class="main-nav">
            <NuxtLink v-for="(item, index) in menu" :key="index" :to="item.href" :target="item.external ? '_blank' : undefined" class="nav-item"
              active-class="active">
              {{ item.title }}
              <svg v-if="item.external" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M6.66667 5.77778C6.66667 4.79594 7.4626 4 8.44444 4H18.2222C19.2041 4 20 4.79594 20 5.77778V15.5556C20 16.5374 19.2041 17.3333 18.2222 17.3333C17.2404 17.3333 16.4444 16.5374 16.4444 15.5556V10.0697L7.03486 19.4793C6.34059 20.1736 5.21496 20.1736 4.5207 19.4793C3.82643 18.785 3.82643 17.6594 4.5207 16.9651L13.9303 7.55556H8.44444C7.4626 7.55556 6.66667 6.75962 6.66667 5.77778Z"
                  fill="currentColor" />
              </svg>

            </NuxtLink>
          </div>
          <NuxtLink to="/community" class="nav-item" active-class="active">Community</NuxtLink>
          <Button href="/download" title="Download" icon="download" small accent class="download" />
        </nav>
      </div>
    </header>
  </div>
</template>

<style scoped>
/* Sticky with no height: the header still overlays the page like a fixed
   header, but starts below the update banner and pins once it scrolls away. */
.header-anchor {
  position: sticky;
  top: 0;
  height: 0;
  z-index: 10;
}

.header {
  position: absolute;
  top: 0;
  width: 100%;
  background: linear-gradient(180deg, rgba(18, 10, 46, 0.92) 0%, rgba(18, 10, 46, 0.6) 34%, rgba(18, 10, 46, 0.28) 66%, rgba(18, 10, 46, 0) 100%);
  pointer-events: none;
}

.header>.inner {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  border-radius: 2.2rem;
  padding-top: var(--space-3xs);
  padding-bottom: var(--space-3xs);
  transition: background-color var(--d-360) var(--ease-glide), box-shadow var(--d-360) var(--ease-glide);
}

/* Glass with the lit rim, like the apps' tab bar. */
.header.scrolled>.inner {
  background-color: rgba(26, 14, 62, 0.78);
  -webkit-backdrop-filter: blur(1.8rem) saturate(1.3);
  backdrop-filter: blur(1.8rem) saturate(1.3);
  box-shadow:
    inset 0 0 0 1px rgba(118, 97, 142, 0.38),
    inset 0 1px 0 rgba(255, 194, 74, 0.35),
    0 1.2rem 3.6rem rgba(8, 3, 26, 0.55);
}

.home {
  display: flex;
  align-items: center;
  padding: var(--space-4xs) var(--space-3xs);
}

.home img {
  height: 3.2rem;
  width: auto;
  aspect-ratio: 694.31 / 150;
  transition: filter var(--d-255) var(--ease-glide);
}

.burger {
  order: 2;
  width: 4.6rem;
  height: 4rem;
  border-radius: 1.4rem;
  background-color: rgba(31, 17, 72, 0.82);
  box-shadow: inset 0 0 0 1px var(--color-line), inset 0 1px 0 rgba(255, 194, 74, 0.3);
  color: transparent;
  position: relative;
}

.burger::before,
.burger::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -.1rem -.8rem;
  width: 1.6rem;
  height: .2rem;
  border-radius: .2rem;
  background-color: var(--fw-text);
  transition: transform var(--d-255) var(--ease-settle);
}

.burger::before {
  transform: translateY(-.4rem);
}

.burger::after {
  transform: translateY(.4rem);
}

.burger.open::before {
  transform: rotate(225deg);
}

.burger.open::after {
  transform: rotate(-45deg);
}

.nav,
.main-nav {
  display: flex;
}

.nav-item {
  padding: var(--space-xxs) var(--space-xs);
  background-color: transparent;
  border-radius: 1.2rem;
  transition: color var(--d-255) var(--ease-glide), background-color var(--d-255) var(--ease-glide);
  display: flex;
  gap: var(--space-3xs);
  position: relative;
}

.nav-item svg {
  width: 1.25em;
  height: 1.25em;
}

/* The active page glows pink with a small gold dot, as the active tab does. */
.nav-item.active {
  color: var(--fw-pink-text);
}

.nav-item.active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0.2rem;
  width: 0.5rem;
  height: 0.5rem;
  margin-left: -0.25rem;
  border-radius: 50%;
  background-color: var(--fw-gold);
  box-shadow: 0 0 0.8rem var(--fw-gold);
}

@media (max-width: 799px) {
  .nav {
    background-color: rgba(26, 14, 62, 0.96);
    -webkit-backdrop-filter: blur(1.8rem);
    backdrop-filter: blur(1.8rem);
    box-shadow:
      inset 0 0 0 1px rgba(118, 97, 142, 0.45),
      inset 0 1px 0 rgba(255, 194, 74, 0.4),
      0 2rem 5rem rgba(8, 3, 26, 0.7);
    border-radius: var(--space-xs);
    position: absolute;
    right: var(--space-xs);
    top: 6.4rem;
    flex-direction: column;
    padding: var(--space-xxs);
    width: 22rem;
    transition: opacity var(--d-255) linear, visibility var(--d-255) linear, transform var(--d-255) var(--ease-settle);
    transform-origin: 100% 0;
    opacity: 0;
    visibility: hidden;
    transform: scale(0.88);
  }

  /* Visible at once when it opens, so focus can move into it. */
  .nav.open {
    visibility: visible;
    opacity: 1;
    transform: scale(1);
    transition-property: opacity, transform;
  }

  .main-nav {
    flex-direction: column;
  }

  .nav-item.active {
    background-color: rgba(58, 16, 96, 0.7);
  }

  .nav-item.active::after {
    left: auto;
    right: 1.2rem;
    bottom: 50%;
    margin: 0 0 -0.25rem;
  }

  .download {
    margin-top: var(--space-xs);
  }
}

/* Without script the menu cannot be opened, so on small screens its links
   sit in the page instead (the head script sets `js`). */
@media (max-width: 799px) {
  html:not(.js) .header-anchor {
    position: static;
    height: auto;
  }

  html:not(.js) .header {
    position: static;
    padding-bottom: 0;
  }

  html:not(.js) .inner {
    flex-wrap: wrap;
  }

  html:not(.js) .nav,
  html:not(.js) .main-nav {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  html:not(.js) .burger {
    display: none;
  }

  html:not(.js) .nav {
    position: static;
    width: 100%;
    margin-top: var(--space-xxs);
    opacity: 1;
    visibility: visible;
    transform: none;
  }
}

@media (min-width: 800px) {
  .header>.inner {
    padding-left: var(--space-xs);
    padding-right: var(--space-3xs);
  }

  .home {
    margin-right: var(--space-m);
  }

  .nav {
    justify-content: space-between;
    flex: 1;
    gap: var(--space-s);
    align-items: center;
  }

  .main-nav {
    flex: 1;
    align-items: center;
  }

  .nav-item {
    justify-content: center;
  }

  .burger {
    display: none;
  }
}

@media (hover: hover) {
  .home:hover img {
    filter: drop-shadow(0 0 1rem rgba(255, 194, 74, 0.55));
  }
}

@media (hover: hover) and (min-width: 800px) {
  .nav-item:not(.active):hover {
    color: var(--fw-gold);
  }
}
</style>
