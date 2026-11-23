import type { DirectiveBinding, ObjectDirective } from 'vue'

// v-reveal marks an element that lands when it first scrolls into view.
// v-reveal="2" gives it tier 2: tiers start 45 ms apart, like the apps'
// later arrivals. The element is only ever hidden while <html> carries the
// `motion` class, which the head script sets when motion is allowed.
type RevealElement = HTMLElement & { fwRevealObserver?: IntersectionObserver }

// Once it has landed the element gives up the reveal's styles, so its own
// transforms and transitions (a hover lift, say) apply again.
const settle = (el: HTMLElement) => {
  el.removeAttribute('data-reveal')
  el.classList.remove('is-in')
  el.style.removeProperty('--tier')
}

const land = (el: HTMLElement) => {
  el.classList.add('is-in')
  const tier = Number(el.style.getPropertyValue('--tier')) || 0
  const done = () => {
    el.removeEventListener('transitionend', onEnd)
    clearTimeout(timer)
    settle(el)
  }
  const onEnd = (event: TransitionEvent) => {
    if (event.target === el && event.propertyName === 'transform') done()
  }
  // The timer covers a transition that never reports its end.
  const timer = setTimeout(done, 700 + tier * 45)
  el.addEventListener('transitionend', onEnd)
}

// `isHydrating` tells whether the server's page is still being taken over.
// What is already on screen then has been visible since the first paint, so
// it is left alone: hiding it now to land it again would make it blink.
const createReveal = (isHydrating: () => boolean): ObjectDirective<RevealElement, number | undefined> => ({
  mounted(el, binding: DirectiveBinding<number | undefined>) {
    if (!('IntersectionObserver' in window) || !document.documentElement.classList.contains('motion')) return
    if (isHydrating() && el.getBoundingClientRect().top < window.innerHeight) return

    el.setAttribute('data-reveal', '')
    if (binding.value) el.style.setProperty('--tier', String(binding.value))

    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      observer.disconnect()
      delete el.fwRevealObserver
      land(el)
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })

    observer.observe(el)
    el.fwRevealObserver = observer
  },
  unmounted(el) {
    el.fwRevealObserver?.disconnect()
  },
  // Rendered on the server as a plain element: nothing is hidden until the
  // page is running and motion is allowed.
  getSSRProps: () => ({}),
})

export default createReveal
