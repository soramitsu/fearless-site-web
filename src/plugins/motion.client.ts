import { defineNuxtPlugin } from '#app'

// The head script sets the `motion` class once, before the first paint. This
// keeps it true to the visitor's setting if they change it while the page is
// open: turning reduced motion on removes the class (and with it every
// animation that waits on it), turning it off restores it.
export default defineNuxtPlugin(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  const apply = () => {
    document.documentElement.classList.toggle('motion', !reduced.matches)
    if (reduced.matches) document.documentElement.classList.remove('launch')
  }
  reduced.addEventListener('change', apply)
})
