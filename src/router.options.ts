import type { RouterConfig } from '@nuxt/schema'
import type { RouterScrollBehavior } from 'vue-router'
import { START_LOCATION } from 'vue-router'

// The stylesheet scrolls smoothly (links inside a page, the dial's way back
// to the top), and that also caught the router: a link followed from the foot
// of a long page showed the new page already scrolled down, then glided to
// its top for a second or more. A new page opens at its top at once, or at
// the place it was left on Back and Forward; inside a page the scroll stays
// smooth.
//
// This follows Nuxt's own scroll behaviour (nuxt/dist/pages/runtime/
// router.options.js) and differs only in asking for an instant jump. The
// site uses no page transitions, so there is none to wait for.
type Position = Awaited<ReturnType<RouterScrollBehavior>>

const marginTop = (hash: string) => {
  const element = document.getElementById(hash.slice(1))
  if (!element) return 0
  return (Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0)
    + (Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0)
}

const scrollBehavior: RouterScrollBehavior = (to, from, savedPosition) => {
  const nuxtApp = useNuxtApp()
  const router = useRouter()

  // The same page: only the hash changed.
  if (to.path.replace(/\/$/, '') === from.path.replace(/\/$/, '')) {
    if (from.hash && !to.hash) return savedPosition ?? { left: 0, top: 0 }
    if (to.hash) return { el: to.hash, top: marginTop(to.hash) }
    return false
  }

  const scrollToTop = typeof to.meta.scrollToTop === 'function' ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop
  if (scrollToTop === false) return false

  const position = (): Position => {
    if (savedPosition) return { ...savedPosition, behavior: 'instant' }
    if (to.hash) return { el: to.hash, top: marginTop(to.hash), behavior: 'instant' }
    return { left: 0, top: 0, behavior: 'instant' }
  }

  if (from === START_LOCATION) return position()

  // A new page starts at its top: jump there now, before it paints, so it is
  // never seen at the old page's offset. Only Back/Forward and hash links
  // wait for the page to render, since their target lies further down.
  if (!savedPosition && !to.hash) return position()

  // Once the new page has rendered, so a saved place further down exists.
  return new Promise<Position>((resolve) => {
    nuxtApp.hooks.hookOnce('page:loading:end', () => {
      requestAnimationFrame(() => resolve(router.currentRoute.value.fullPath === to.fullPath ? position() : false))
    })
  })
}

export default <RouterConfig>{ scrollBehavior }
