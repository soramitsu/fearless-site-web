import { defineNuxtPlugin } from '#app'
import onClickOutside from '~/directives/on-click-outside'
import createReveal from '~/directives/reveal'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('on-click-outside', onClickOutside)
  nuxtApp.vueApp.directive('reveal', createReveal(() => Boolean(nuxtApp.isHydrating)))
})
