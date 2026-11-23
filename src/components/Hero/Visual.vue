<script setup lang="ts">
import { geometry } from '~/lib/brand/geometry'

// The hero's stage: the Yatagarasu on its rock under the solar geometry, and
// in front of it the wallet as a phone built from layers that float at
// different depths.
//
// On a visitor's first page of a session the stage opens the way the apps
// launch: the Ignite clip plays, the camera dives through the solar disc, the
// six gates fly past, the mirror opens and the wallet flies up into place,
// its parts at their own depths. The numbers are the brand kit's
// (tokens/shikiban.json and hero/launch-timeline.json). The server renders
// the settled stage; the `launch` class on <html> (set by the head script,
// only when motion is allowed) covers it until the flight has run. Reduced
// motion never launches. The launch waits, as the apps' launch screen (the
// crest on ink), until the stage is actually on screen; from then on every
// step has a deadline that drops the cover with a plain fade, so it can
// never keep the stage covered.

const { flight, gates, perspective, mirror } = geometry
// Where the dive is centred in the clip's frame (kit: focus.popup).
const focus = { x: 0.5, y: 0.4625 }
const zoomStartSeconds = 2
// Once the stage is seen the clip loads, and the crest shows the wallet's
// loader until it plays. Right after a deploy the CDN's cache is cold and
// the first byte can take seconds: wait up to 6 s for it. Once bytes arrive,
// a clip that receives nothing for 1.5 s has stalled. Whatever happens, it
// must be playing within 9 s of the stage being seen and reach the dive
// within 10 s, so a clip that crawls in cannot keep the stage covered.
// (If the script never runs at all, the stylesheet lifts the cover by
// itself at 8 s.)
const firstByteMs = 6000
const playCapMs = 9000
const diveCapMs = 10000
// Once playing, the clip must keep moving and reach the dive in time.
const noProgressMs = 1500

const stage = ref<HTMLElement>()
const cover = ref<HTMLElement>()
const clip = ref<HTMLVideoElement>()
const corona = ref<HTMLElement>()
const gateEls = ref<SVGGElement[]>([])
// Stage tiers: 0 the wallet, 2 the rest (the call button).
const tiers = ref<{ el: HTMLElement, tier: number }[]>([])
// The wallet's own parts: tier 0 the balance card, 1 the round actions,
// 2 the header and the tab bar, 4 the list, 5 what floats nearest.
const depths = ref<{ el: HTMLElement, tier: number }[]>([])
const idle = ref<HTMLVideoElement>()
const caw = ref<HTMLVideoElement>()

const launching = ref(false)
// The script has taken the launch over from the stylesheet's own timeout.
const armed = ref(false)
// The idle sky behind the stage is shown: not while the launch screen and
// the clip are up (the kit's launch screen is the white crest on plain ink),
// only once the mirror opens or the cover fades.
const revealed = ref(false)
// The stage has been seen and the clip is on its way.
const waiting = ref(false)
const skipButton = ref<HTMLButtonElement>()
const callButton = ref<HTMLButtonElement>()
const clipPlaying = ref(false)
const calling = ref(false)
const offScreen = ref(false)
const stageSize = ref({ width: 842, height: 900 })

const squarePath = (diamond: boolean) => {
  const corners = diamond
    ? [[0, -1], [1, 0], [0, 1], [-1, 0]]
    : [[Math.SQRT1_2, -Math.SQRT1_2], [Math.SQRT1_2, Math.SQRT1_2], [-Math.SQRT1_2, Math.SQRT1_2], [-Math.SQRT1_2, -Math.SQRT1_2]]
  return `M${corners.map(([x, y]) => `${x!.toFixed(5)} ${y!.toFixed(5)}`).join('L')}Z`
}

const smootherstep = (u: number) => u * u * u * (u * (u * 6 - 15) + 10)
const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
// A value from a list sampled evenly over 0..1.
const sample = (list: readonly number[], u: number) => {
  const at = clamp01(u) * (list.length - 1)
  const low = Math.floor(at)
  const high = Math.min(list.length - 1, low + 1)
  return list[low]! + (list[high]! - list[low]!) * (at - low)
}

const setTier = (list: { el: HTMLElement, tier: number }[], tier: number) => (el: unknown) => {
  if (!(el instanceof HTMLElement)) return
  if (!list.some(entry => entry.el === el)) list.push({ el, tier })
}

let frame = 0
let speed = 1
let clipRequested = false
let flightStarted = false
// The cover is fading out after a failed start; nothing else may begin.
let aborting = false
let finished = false
let unmounted = false
let startTimer: ReturnType<typeof setTimeout> | undefined
let fadeTimer: ReturnType<typeof setTimeout> | undefined
let lastClipTime = -1
let lastProgressAt = 0
let visibility: IntersectionObserver | undefined
let clipLoading = false
// When the clip's bytes last arrived, and when the stage was first seen.
let lastNetworkAt = 0
let seenAt = 0
let gotBytes = false
const onClipProgress = () => {
  gotBytes = true
  lastNetworkAt = performance.now()
}
let reduced: MediaQueryList | undefined
let callTimer: ReturnType<typeof setTimeout> | undefined
let callCapTimer: ReturnType<typeof setTimeout> | undefined
// The call must begin within 6 s of the tap and, once playing, end within 2 s
// of its length (3 s); otherwise it has stalled, and the stage goes back to
// the idle loop. Its clip starts loading as soon as the pointer or focus
// reaches the button, so on a slow link the tap waits less.
const callStartMs = 6000
const callSlackMs = 2000
// The share of the stage that must be seen before the launch plays.
let need = 0.35

const motionAllowed = () => document.documentElement.classList.contains('motion') && !reduced?.matches

// Decorative video plays only while it can be seen and motion is allowed.
const syncMedia = () => {
  const visible = !offScreen.value && !document.hidden
  if (calling.value) {
    if (visible) return
    // The call does not carry on unseen.
    caw.value?.pause()
    clearTimeout(callTimer)
    clearTimeout(callCapTimer)
    calling.value = false
  }
  const video = idle.value
  if (!video) return
  if (motionAllowed() && visible && !launching.value) video.play().catch(() => {})
  else video.pause()
}

const clearFlightStyles = () => {
  for (const { el } of tiers.value) {
    el.style.transform = ''
    el.style.opacity = ''
    el.style.transition = ''
  }
  for (const { el } of depths.value) {
    el.style.scale = ''
    for (const child of el.children) (child as HTMLElement).style.opacity = ''
  }
}

const finish = () => {
  if (finished) return
  // Skip is about to go away: if it still holds focus, keep focus in the
  // stage. If the visitor has moved on, leave focus where it is.
  const skipHadFocus = skipButton.value !== undefined && document.activeElement === skipButton.value
  finished = true
  waiting.value = false
  for (const event of ['progress', 'loadedmetadata', 'loadeddata']) clip.value?.removeEventListener(event, onClipProgress)
  cancelAnimationFrame(frame)
  clearTimeout(startTimer)
  clearTimeout(fadeTimer)
  launching.value = false
  // `launched` first: the stage has arrived and must not land a second time.
  document.documentElement.classList.add('launched')
  document.documentElement.classList.remove('launch')
  clearFlightStyles()
  try {
    sessionStorage.setItem('fw-launched', '1')
  } catch { /* private mode: the launch simply runs again next page */ }
  const video = clip.value
  if (video) {
    video.pause()
    // A launch that was given up has no use for the rest of its clip.
    if (!flightStarted) {
      for (const source of [...video.querySelectorAll('source')]) source.remove()
      video.load()
    }
  }
  if (!unmounted) {
    nextTick(() => {
      syncMedia()
      if (skipHadFocus) callButton.value?.focus({ preventScroll: true })
    })
  }
}

// The clip cannot play, has stalled, or was never seen in time: drop the
// cover with a plain fade.
const abort = () => {
  if (finished || flightStarted || aborting) return
  aborting = true
  waiting.value = false
  cancelAnimationFrame(frame)
  clearTimeout(startTimer)
  const el = cover.value
  if (!el || unmounted) return finish()
  clearFlightStyles()
  revealed.value = true
  el.style.transition = 'opacity 360ms linear'
  el.style.opacity = '0'
  for (const { el: tier } of tiers.value) {
    tier.style.transition = 'opacity 360ms linear'
    tier.style.opacity = '1'
  }
  clearTimeout(fadeTimer)
  fadeTimer = setTimeout(finish, 360)
}

const runFlight = () => {
  if (flightStarted || finished || aborting) return
  flightStarted = true
  clearTimeout(startTimer)
  const { width, height } = stageSize.value
  const shorter = Math.min(width, height)
  const fx = width * focus.x
  const fy = height * focus.y
  const far = Math.hypot(Math.max(fx, width - fx), Math.max(fy, height - fy))
  let elapsed = 0
  let last = performance.now()
  let cleared = false

  const step = (now: number) => {
    elapsed += (now - last) * speed
    last = now
    const u = clamp01(elapsed / flight.durationMs)
    const camera = flight.travel * smootherstep(u)
    const fadeIn = clamp01(u / flight.gateFadeIn)
    let mirrorRadius = 0

    gates.forEach((gate, index) => {
      const el = gateEls.value[index]
      const beyond = perspective + gate.depth - camera
      const scale = beyond > 0 ? perspective / beyond : Infinity
      const radius = flight.baseRadius * shorter * scale
      if (gate.figure === 'mirror') mirrorRadius = Number.isFinite(radius) ? radius : far * 4
      if (!el) return
      // A gate is gone once the camera has passed it.
      const strength = scale >= flight.passScale ? 0 : fadeIn * sample(flight.gateAlpha[index]!, u)
      el.style.opacity = String(strength)
      if (!strength) return
      el.style.transform = `translate(${fx}px, ${fy}px) scale(${radius})`
      el.style.setProperty('--core', `${Math.min(4.5, 1 + 0.9 * scale)}px`)
    })

    // The mirror opens: a round opening about the focus, then the corona.
    const sinceIris = elapsed - flight.irisAtMs
    if (sinceIris >= 0 && cover.value && !cleared) {
      if (!revealed.value) revealed.value = true
      const iris = mirrorRadius * mirror.cusp * flight.irisInset * clamp01(sinceIris / flight.irisOpenMs)
      if (iris >= far) {
        // The opening has cleared the view: nothing of the cover is left.
        cleared = true
        cover.value.style.visibility = 'hidden'
      }
      const hole = `radial-gradient(circle at ${fx}px ${fy}px, transparent ${Math.max(0, iris - 1.5)}px, #000 ${iris}px)`
      cover.value.style.webkitMaskImage = hole
      cover.value.style.maskImage = hole
      if (corona.value) {
        const span = Math.max(1, far - iris)
        const stops = flight.corona.map(([at, color]) => `${color} ${(iris + at * span).toFixed(1)}px`).join(', ')
        corona.value.style.background = `radial-gradient(circle at ${fx}px ${fy}px, ${stops})`
        corona.value.style.opacity = String(clamp01(sinceIris / flight.coronaMs))
      }
    }

    // The wallet flies up through the opening. Tier k lies a little deeper
    // than tier k − 1, so it comes apart in depth on the way and closes up
    // as it lands; every tier ends at exactly scale 1.
    const remaining = flight.travel - camera
    const tierScale = (tier: number) => perspective / (perspective + remaining * (1 + tier * flight.tierLag))
    const tierFade = (tier: number) => clamp01((elapsed - (flight.irisAtMs + tier * flight.tierStaggerMs)) / flight.tierFadeMs)
    const wallet = tierScale(0)
    for (const { el, tier } of tiers.value) {
      el.style.transform = `scale(${tierScale(tier).toFixed(4)})`
      el.style.opacity = String(tierFade(tier))
    }
    for (const { el, tier } of depths.value) {
      // Relative to the wallet, which already carries tier 0's scale.
      el.style.scale = (tierScale(tier) / wallet).toFixed(4)
      const opacity = String(tierFade(tier))
      for (const child of el.children) (child as HTMLElement).style.opacity = opacity
    }

    if (u < 1) frame = requestAnimationFrame(step)
    else finish()
  }

  frame = requestAnimationFrame(step)
}

// While the clip plays: start the flight at the dive, and give up if the
// clip stops moving or takes too long to get there.
const watchClip = (now: number) => {
  const video = clip.value
  if (!video || finished || flightStarted) return
  if (video.currentTime >= zoomStartSeconds || video.ended) return runFlight()
  if (video.currentTime !== lastClipTime) {
    lastClipTime = video.currentTime
    lastProgressAt = now
  }
  // Buffering while bytes still arrive is a wait, not a stall.
  const stalled = now - Math.max(lastProgressAt, gotBytes ? lastNetworkAt : 0) > noProgressMs
  // The deadline counts from the moment the stage was seen, not from when
  // playback began, so buffering cannot stretch it.
  if (stalled || now - seenAt > diveCapMs) return abort()
  frame = requestAnimationFrame(watchClip)
}

// The stage has come on screen: play the clip, or give up if it has not
// started in time.
// Fetch the clip once the stage is seen (not before: a phone visitor who
// never scrolls to it should not pay for it).
const loadClip = () => {
  const video = clip.value
  if (!video || clipLoading || finished) return
  clipLoading = true
  lastNetworkAt = performance.now()
  for (const event of ['progress', 'loadedmetadata', 'loadeddata']) video.addEventListener(event, onClipProgress)
  // play() starts the download; a load() here would only cancel and repeat it.
  video.preload = 'auto'
}

// Until the clip plays: give up if its first byte has not come in 6 s, if
// its bytes stop for 1.5 s, or after 9 s in any case (checked every 250 ms).
const checkStart = () => {
  if (finished || clipPlaying.value || aborting) return
  const now = performance.now()
  const waited = now - seenAt
  const stalled = gotBytes ? now - lastNetworkAt > noProgressMs : waited > firstByteMs
  if (stalled || waited > playCapMs) return abort()
  startTimer = setTimeout(checkStart, 250)
}

const startClip = () => {
  const video = clip.value
  if (finished || clipRequested) return
  if (!video) return abort()
  clipRequested = true
  seenAt = performance.now()
  loadClip()
  waiting.value = true
  startTimer = setTimeout(checkStart, 250)
  video.play().then(() => {
    if (finished || unmounted || aborting || clipPlaying.value) return
    clearTimeout(startTimer)
    clipPlaying.value = true
    waiting.value = false
    // A tap may already have started the flight; the clip just plays on.
    if (flightStarted) return
    lastProgressAt = performance.now()
    lastClipTime = -1
    frame = requestAnimationFrame(watchClip)
  }).catch(abort)
}

// A tap during the launch plays the rest 2.5 times faster.
const skip = () => {
  if (!launching.value || finished || aborting) return
  speed = 2.5
  if (clip.value) clip.value.playbackRate = 2.5
  if (!flightStarted) {
    cancelAnimationFrame(frame)
    measure()
    runFlight()
  }
}

// Tapping the crow plays its call once, with sound. Sound never plays on its
// own: only this button starts it.
const call = () => {
  const video = caw.value
  if (!video || calling.value || launching.value) return
  calling.value = true
  video.currentTime = 0
  video.muted = false
  idle.value?.pause()
  // If the clip has not begun in time (it cannot load, say), give the stage
  // back to the idle loop.
  clearTimeout(callTimer)
  clearTimeout(callCapTimer)
  callTimer = setTimeout(() => {
    if (calling.value && video.currentTime === 0) stopCall()
  }, callStartMs)
  video.play().catch(callEnded)
}

// The call has started: it must be over within its length and a little.
const callPlaying = () => {
  const video = caw.value
  if (!video || !calling.value) return
  clearTimeout(callCapTimer)
  const remaining = Number.isFinite(video.duration) ? Math.max(0, video.duration - video.currentTime) : 3
  // A call that starts and then stalls must not keep the stage either.
  callCapTimer = setTimeout(() => { if (calling.value) stopCall() }, remaining * 1000 + callSlackMs)
}

// The pointer or focus is on the button: fetch the call so a tap plays it
// sooner.
const prepareCall = () => {
  const video = caw.value
  if (video && video.preload === 'none' && !launching.value) video.preload = 'auto'
}

const callEnded = () => {
  clearTimeout(callTimer)
  clearTimeout(callCapTimer)
  calling.value = false
  syncMedia()
}

const stopCall = () => {
  caw.value?.pause()
  callEnded()
}

// With a mouse, the phone leans a little toward the pointer.
const tilt = ref<HTMLElement>()
let tiltFrame = 0
let lean = { x: 0, y: 0 }

const applyLean = () => {
  tiltFrame = 0
  tilt.value?.style.setProperty('--lean-x', lean.x.toFixed(3))
  tilt.value?.style.setProperty('--lean-y', lean.y.toFixed(3))
}

const onPointerMove = (event: PointerEvent) => {
  if (event.pointerType !== 'mouse' || launching.value || !stage.value || !motionAllowed()) return
  const box = stage.value.getBoundingClientRect()
  lean = {
    x: Math.min(1, Math.max(-1, ((event.clientX - box.left) / box.width) * 2 - 1)),
    y: Math.min(1, Math.max(-1, ((event.clientY - box.top) / box.height) * 2 - 1)),
  }
  if (!tiltFrame) tiltFrame = requestAnimationFrame(applyLean)
}

const onPointerLeave = () => {
  lean = { x: 0, y: 0 }
  if (!tiltFrame) tiltFrame = requestAnimationFrame(applyLean)
}

const measure = () => {
  if (!stage.value) return
  const box = stage.value.getBoundingClientRect()
  if (box.width && box.height) stageSize.value = { width: box.width, height: box.height }
}

// Enough of the stage is seen when 35 % of it is on screen, or, in a window
// too short to ever show that much, 80 % of the window's height. The
// observer watches exactly that share, so the moment is never missed.
const onIntersect = (entries: IntersectionObserverEntry[]) => {
  const entry = entries[entries.length - 1]!
  offScreen.value = !entry.isIntersecting
  if (launching.value && !finished && entry.isIntersecting && entry.intersectionRatio >= need - 0.002) {
    measure()
    startClip()
  }
  syncMedia()
}

const observe = () => {
  visibility?.disconnect()
  if (!stage.value) return
  const height = stage.value.getBoundingClientRect().height || 1
  need = Math.min(0.35, (0.8 * window.innerHeight) / height)
  visibility = new IntersectionObserver(onIntersect, { threshold: [0, need] })
  visibility.observe(stage.value)
}

const onResize = () => {
  measure()
  // The share that can be seen depends on the window: watch the new one.
  if (launching.value && !clipRequested && !finished && 'IntersectionObserver' in window) observe()
}

// The visitor turned reduced motion on while the page was open.
const onMotionPreference = () => {
  if (reduced?.matches && launching.value) {
    cancelAnimationFrame(frame)
    finish()
  }
  syncMedia()
}

onMounted(() => {
  measure()
  window.addEventListener('resize', onResize, { passive: true })
  document.addEventListener('visibilitychange', syncMedia)
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduced.addEventListener('change', onMotionPreference)

  launching.value = document.documentElement.classList.contains('launch')
  // The script ran so late that the stylesheet has already lifted the cover:
  // the stage is showing, so it stays shown.
  if (launching.value && cover.value && getComputedStyle(cover.value).opacity !== '1') finish()

  if ('IntersectionObserver' in window && stage.value) {
    // From here the script answers for the cover, not the stylesheet.
    armed.value = launching.value
    observe()
  } else if (launching.value) {
    finish()
  } else {
    syncMedia()
  }
})

onBeforeUnmount(() => {
  unmounted = true
  window.removeEventListener('resize', onResize)
  document.removeEventListener('visibilitychange', syncMedia)
  reduced?.removeEventListener('change', onMotionPreference)
  visibility?.disconnect()
  for (const event of ['progress', 'loadedmetadata', 'loadeddata']) clip.value?.removeEventListener(event, onClipProgress)
  cancelAnimationFrame(frame)
  cancelAnimationFrame(tiltFrame)
  clearTimeout(startTimer)
  clearTimeout(fadeTimer)
  clearTimeout(callTimer)
  clearTimeout(callCapTimer)
  idle.value?.pause()
  caw.value?.pause()
  clip.value?.pause()
  // Leaving mid-launch must not leave the next page's stage covered.
  document.documentElement.classList.remove('launch')
})

const rows = [
  { src: 'row-eth', top: 61.33 },
  { src: 'row-sol', top: 69.95 },
  { src: 'row-dot', top: 78.57 },
]
</script>

<template>
  <figure ref="stage" class="stage"
    :class="{ launching, armed, revealed, waiting, playing: clipPlaying, calling, off: offScreen }"
    @click="skip" @pointermove="onPointerMove" @pointerleave="onPointerLeave">
    <figcaption class="visually-hidden">
      The Yatagarasu, the three-legged crow on the Fearless crest, with the Fearless Wallet home screen.
    </figcaption>

    <!-- Decorative: the videos load only when they are about to play. -->
    <div class="sky" aria-hidden="true">
      <video ref="idle" class="crow" muted loop playsinline preload="none" poster="/brand/crow-poster.webp"
        width="842" height="900" tabindex="-1">
        <source src="/brand/crow-idle.webm" type="video/webm">
        <source src="/brand/crow-idle.mp4" type="video/mp4">
      </video>
      <video ref="caw" class="crow caw" playsinline preload="none" width="842" height="900" tabindex="-1"
        @playing="callPlaying" @ended="callEnded">
        <source src="/brand/crow-caw.webm" type="video/webm">
        <source src="/brand/crow-caw.mp4" type="video/mp4">
      </video>
    </div>

    <div :ref="setTier(tiers, 0)" class="part" style="--part: 0">
      <div class="phone-wrap" aria-hidden="true">
        <div ref="tilt" class="tilt">
          <div class="phone">
            <img src="/hero/back.svg" alt="" class="plate back" width="375" height="812">
            <div :ref="setTier(depths, 2)" class="depth">
              <img src="/hero/screen.svg" alt="" class="plate screen" width="375" height="812">
            </div>
            <div :ref="setTier(depths, 0)" class="depth">
              <img src="/hero/card.svg" alt="" class="layer mid" style="top: 18.47%; aspect-ratio: 343 / 196">
            </div>
            <div :ref="setTier(depths, 1)" class="depth">
              <img src="/hero/actions.svg" alt="" class="layer mid" style="top: 44.09%; aspect-ratio: 343 / 84">
            </div>
            <div :ref="setTier(depths, 4)" class="depth">
              <img v-for="row in rows" :key="row.src" :src="`/hero/${row.src}.svg`" alt="" class="layer mid"
                :style="{ top: `${row.top}%`, aspectRatio: '343 / 64' }">
            </div>
            <div :ref="setTier(depths, 5)" class="depth">
              <img src="/hero/row-xor.svg" alt="" class="layer near xor">
              <img src="/hero/toast.svg" alt="" class="layer near toast">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div :ref="setTier(tiers, 2)" class="part" style="--part: 2">
      <button ref="callButton" class="call press text-xxs" type="button" :disabled="calling || launching"
        @pointerenter="prepareCall" @focus="prepareCall" @click.stop="call">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 9.5h3.2L12 5.6v12.8l-4.8-3.9H4z" fill="currentColor" />
          <path class="wave" d="M15.2 9.2a4 4 0 0 1 0 5.6M17.9 6.6a7.6 7.6 0 0 1 0 10.8" stroke="currentColor"
            stroke-width="1.7" stroke-linecap="round" />
        </svg>
        Hear the crow's call
      </button>
    </div>

    <!-- The launch. Its first frame is the apps' launch screen: the white
         crest on ink. -->
    <div ref="cover" class="cover" aria-hidden="true">
      <div class="frame">
        <img src="/brand/crest.svg" alt="" class="crest" :class="{ away: clipPlaying }" width="512" height="512">
        <div v-if="waiting" class="wait"><ShikibanLoader /></div>
        <video ref="clip" class="clip" muted playsinline preload="none" width="842" height="900" tabindex="-1">
          <source src="/brand/crow-launch.webm" type="video/webm">
          <source src="/brand/crow-launch.mp4" type="video/mp4">
        </video>
        <div ref="corona" class="corona" />
      </div>
      <svg class="gates" :viewBox="`0 0 ${stageSize.width} ${stageSize.height}`" fill="none" stroke-linejoin="round">
        <g v-for="(gate, index) in gates" :key="index" :ref="el => { if (el) gateEls[index] = el as SVGGElement }"
          class="gate">
          <g v-for="layer in ['glow', 'core']" :key="layer" :class="layer">
            <template v-if="gate.figure === 'plate'">
              <circle r="1" />
              <path :d="squarePath(gate.diamond)" />
            </template>
            <template v-else>
              <path :d="mirror.rim" />
              <circle :r="mirror.cusp * 0.94" />
            </template>
          </g>
        </g>
      </svg>
    </div>

    <!-- The tap that speeds the launch up, for the keyboard too. Outside the
         cover, which is hidden from assistive technology. -->
    <button v-if="launching && armed" ref="skipButton" class="skip press text-xxs" type="button"
      @click.stop="skip">
      Skip intro
    </button>
  </figure>
</template>

<style scoped>
.stage {
  position: relative;
  aspect-ratio: 842 / 900;
  width: 100%;
  isolation: isolate;
}

/* The crow's frame fades into the page on every side; the launch's frame
   fades the same way, so nothing shows a hard edge. */
.sky,
.frame {
  position: absolute;
  inset: 0;
  -webkit-mask-image: radial-gradient(ellipse closest-side at 50% 47%, #000 46%, rgba(0, 0, 0, 0.5) 76%, transparent 100%);
  mask-image: radial-gradient(ellipse closest-side at 50% 47%, #000 46%, rgba(0, 0, 0, 0.5) 76%, transparent 100%);
}

.sky {
  transition: opacity 360ms linear;
}

.crow {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity var(--d-255) linear;
}

.crow.caw {
  opacity: 0;
}

.calling .crow.caw {
  opacity: 1;
}

/* A part of the stage that the launch flies in: the wallet, then the rest.
   Not called a tier: the hero's text tiers have their own entrance. */
.part {
  position: absolute;
  inset: 0;
  transform-origin: 50% 46.25%;
  pointer-events: none;
}

.phone-wrap {
  position: absolute;
  right: 1%;
  bottom: -6%;
  height: 74%;
  aspect-ratio: 375 / 812;
  perspective: 180rem;
  animation: fw-float 9s ease-in-out infinite;
}

.tilt {
  --lean-x: 0;
  --lean-y: 0;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: rotateX(calc(var(--lean-y) * -5deg)) rotateY(calc(var(--lean-x) * 8deg));
  transition: transform var(--d-510) var(--ease-settle);
}

.phone {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 12.8% / 5.9%;
  box-shadow: 2rem 3rem 9rem rgba(8, 3, 26, 0.8), 0 0 6rem rgba(230, 0, 111, 0.18);
  transform-style: preserve-3d;
  transform: rotateX(22deg) rotateY(-14deg) rotateZ(12deg);
  animation: rock 7s ease-in-out infinite alternate;
}

.plate {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* One of the wallet's depth tiers: it fills the phone, so the launch can
   scale it about the phone's centre while its layers keep their own depth. */
.depth {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
}

.screen {
  transform: translateZ(1.6vw);
}

.layer {
  position: absolute;
  left: 4.267%;
  width: 91.467%;
  height: auto;
}

.mid {
  transform: translateZ(4vw);
  filter: drop-shadow(0 1.2rem 1.6rem rgba(8, 3, 26, 0.55));
}

.near {
  transform: translateZ(13vw);
  filter: drop-shadow(0 2rem 2.4rem rgba(8, 3, 26, 0.65));
}

/* The layers that float nearest sit beside the phone, never over the
   labels of the screen they illustrate. */
.xor {
  top: 61%;
  left: -100%;
  aspect-ratio: 343 / 64;
}

.toast {
  top: -4%;
  left: 43%;
  width: 62.93%;
  aspect-ratio: 236 / 56;
}

@keyframes rock {
  from {
    transform: rotateX(24deg) rotateY(-18deg) rotateZ(15deg);
  }

  to {
    transform: rotateX(20deg) rotateY(-7deg) rotateZ(8deg);
  }
}

.call {
  position: absolute;
  left: 4%;
  top: 4%;
  display: inline-flex;
  align-items: center;
  gap: 0.6em;
  padding: 0.7em 1.1em 0.7em 0.8em;
  border-radius: 10rem;
  color: var(--fw-text);
  background-color: rgba(26, 14, 62, 0.72);
  -webkit-backdrop-filter: blur(1.2rem);
  backdrop-filter: blur(1.2rem);
  box-shadow: inset 0 0 0 1px rgba(255, 194, 74, 0.45), 0 0.8rem 2.4rem rgba(8, 3, 26, 0.5);
  pointer-events: auto;
  cursor: pointer;
}

.call svg {
  width: 1.5em;
  height: 1.5em;
  color: var(--fw-gold);
}

.call:disabled {
  cursor: default;
}

.skip {
  position: absolute;
  right: 4%;
  bottom: 4%;
  z-index: 4;
  padding: 0.7em 1.1em;
  border-radius: 10rem;
  color: var(--fw-text);
  background-color: rgba(18, 10, 46, 0.72);
  box-shadow: inset 0 0 0 1px rgba(255, 194, 74, 0.45);
  cursor: pointer;
}

.calling .wave {
  animation: wave var(--d-720) ease-in-out infinite alternate;
}

@keyframes wave {
  from {
    opacity: 0.25;
  }

  to {
    opacity: 1;
  }
}

/* The launch cover exists only while <html> carries `launch`. */
.cover {
  display: none;
  position: absolute;
  inset: 0;
  cursor: pointer;
  z-index: 3;
}

.frame {
  background-color: var(--fw-ink);
}

.cover .crest {
  position: absolute;
  top: 46.25%;
  left: 50%;
  width: 26%;
  height: auto;
  transform: translate(-50%, -50%);
  transition: opacity 300ms linear;
  z-index: 1;
}

.cover .crest.away {
  opacity: 0;
}

/* The wallet's loader circles the crest while the clip is on its way; it
   appears only if the wait is noticeable. */
.wait {
  position: absolute;
  top: 46.25%;
  left: 50%;
  width: 40%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  z-index: 1;
  opacity: 0;
  animation: fw-wait-in var(--d-360) linear var(--d-510) forwards;
}

@keyframes fw-wait-in {
  to {
    opacity: 1;
  }
}

.clip,
.corona,
.gates {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.clip {
  object-fit: cover;
}

.corona {
  opacity: 0;
}

.gates {
  overflow: hidden;
}

/* A soft glow under a bright core, as the solar geometry is drawn. No
   filter: these grow to many times the stage. */
.gate {
  opacity: 0;
  stroke-width: 1.5px;
}

.gate .core {
  stroke: var(--fw-gold-core);
  stroke-width: var(--core, 1.5px);
}

.gate .glow {
  stroke: #ff8a42;
  stroke-opacity: 0.32;
  stroke-width: 7px;
}

.gate circle,
.gate path {
  vector-effect: non-scaling-stroke;
}

/* On a phone the layers that float in front must stay inside the page. */
@media (max-width: 799px) {
  .phone-wrap {
    right: 15%;
    height: 70%;
  }
}

@media (min-width: 800px) {
  .screen {
    transform: translateZ(1.2rem);
  }

  .mid {
    transform: translateZ(2.5rem);
  }

  .near {
    transform: translateZ(10.5rem);
  }
}

/* Nothing rocks or floats while the stage is out of sight. */
.off .phone,
.off .phone-wrap {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .phone,
  .phone-wrap {
    animation: none;
  }

  .tilt {
    transform: none;
  }
}
</style>

<!-- Not scoped: these depend on a class on <html>. Until the flight has run
     the settled stage is hidden under the cover; if the script never takes
     over, the cover lifts by itself after eight seconds. -->
<style>
.launch .stage .cover {
  display: block;
  animation: fw-launch-cover-lift 0.5s linear 8s forwards;
}

.launch .stage .part {
  opacity: 0;
  animation: fw-launch-part-show 0.5s linear 8s forwards;
}

/* The launch screen is the white crest on plain ink: the idle sky stays
   hidden until the mirror opens or the cover fades. */
.launch .stage:not(.revealed) .sky {
  opacity: 0;
  animation: fw-launch-part-show 0.5s linear 8s forwards;
}

/* Before the script runs, the call button sits under the cover: keep it out
   of the tab order until the stylesheet lifts the cover by itself. */
.launch .stage:not(.armed) .call {
  visibility: hidden;
  animation: fw-launch-call-show 0s linear 8.5s forwards;
}

@keyframes fw-launch-call-show {
  to {
    visibility: visible;
  }
}

/* Once the script is running it takes the cover over from the stylesheet's
   own timeout: it waits until the stage is seen and then keeps deadlines of
   its own. */
.launch .stage.armed .cover,
.launch .stage.armed .part,
.launch .stage.armed .sky {
  animation: none;
}

/* Without a launch (a returning visitor, or a page reached by a link) the
   stage's parts land the way a later arrival does in the apps: from the
   kit's landing scale to 1 about the focus, 45 ms apart, fading in over the
   first 45 %. `launched` marks a stage whose launch has just run, which has
   already arrived. */
.motion:not(.launch):not(.launched) .stage .part {
  animation: fw-stage-land var(--d-510) var(--ease-settle) calc(160ms + var(--part, 0) * 45ms) both;
}

@keyframes fw-stage-land {
  0% {
    opacity: 0;
    transform: scale(0.849);
  }

  45% {
    opacity: 1;
  }

  100% {
    opacity: 1;
    transform: none;
  }
}

@keyframes fw-launch-cover-lift {
  to {
    opacity: 0;
    visibility: hidden;
  }
}

@keyframes fw-launch-part-show {
  to {
    opacity: 1;
  }
}
</style>
