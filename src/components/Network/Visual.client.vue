<script setup lang="ts">
import { Engine, Render, Runner, Bodies, Body, Composite, Events, MouseConstraint, Mouse } from 'matter-js'

const networks = [
  '/networks/ton.svg',
  '/networks/SORA.svg',
  '/networks/Polkadot.svg',
  '/networks/Kusama.svg',
  '/networks/Pendulum.svg',
  '/networks/Moonriver.svg',
  '/networks/Moonbeam.svg',
  '/networks/xlayerchain.svg',
  '/networks/homeverse.svg',
  '/networks/Ethereum.svg',
  '/networks/bnbchain.svg',
  '/networks/Polygon.svg',
  '/networks/Arbitrum.svg',
  '/networks/Optimism.svg',
  '/networks/Avalanche.svg',
  '/networks/Zetachain.svg',
  '/networks/oasys.svg',
  '/networks/mchverse.svg',
  '/networks/tcgverse.svg',
  '/networks/chainverse.svg',
  '/networks/saakuruverse.svg',
  '/networks/yooldoverse.svg',
  '/networks/acala.svg',
  '/networks/Karura.svg',
  '/networks/Bifrost.svg',
  '/networks/Basilisk.svg',
  '/networks/phala.svg',
  '/networks/clover.svg',
  '/networks/Amplitude.svg',
  '/networks/Bitgreen.svg',
  '/networks/Pendulum.svg',
  '/networks/quartz.svg',
]

const parent = shallowRef()
const canvas = shallowRef()

// Everything the simulation holds, released when the section goes away.
let dispose: (() => void) | undefined

onMounted(async () => {
  await nextTick()
  if (!canvas.value || !parent.value) return

  // Visitors who ask for reduced motion get the coins at rest: no falling,
  // no dragging. The setting is followed while the page is open.
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  let still = reduced.matches

  // create an engine

  const engine = Engine.create(),
    world = engine.world

  // create a renderer

  const render = Render.create({
    canvas: canvas.value,
    engine: engine,
    options: {
      width: parent.value.clientWidth,
      height: parent.value.clientHeight,
      showAngleIndicator: false,
      wireframes: false,
      background: 'transparent',
      pixelRatio: window.devicePixelRatio || 1
    }
  })

  // create runner

  const runner = Runner.create()

  // create walls

  const wallOptions = {
    isStatic: true,
    render: {
      visible: false,
      lineWidth: 20
    }
  }
  const wallWidth = 1000
  const wallHeight = 1600
  const ethalonArea = 600000
  const multiplayer = Math.sqrt(ethalonArea / (parent.value.clientWidth * parent.value.clientHeight))
  const width = parent.value.clientWidth * multiplayer
  const height = parent.value.clientHeight * multiplayer

  const top = Bodies.rectangle(wallHeight / 2, -wallWidth / 2, wallHeight, wallWidth, wallOptions)
  const floor = Bodies.rectangle(wallHeight / 2, height + wallWidth / 2, wallHeight, wallWidth, wallOptions)
  const leftWall = Bodies.rectangle(-wallWidth / 2, wallHeight / 2, wallWidth, wallHeight, wallOptions)
  const rightWall = Bodies.rectangle(width + wallWidth / 2, wallHeight / 2, wallWidth, wallHeight, wallOptions)

  // create chain icons

  const elementSize = 18

  const chains = networks.map((network, i) => {
    const size = elementSize + networks.length - i
    return Bodies.circle(Math.random() * width, Math.random() * height / 1.5, size, {
      density: 0.0006,
      frictionAir: 0.01,
      restitution: 0.03,
      friction: 0.01,
      render: {
        sprite: {
          texture: network,
          xScale: size / 24,
          yScale: size / 24,
        }
      }
    })
  })

  Composite.add(world, [top, floor, leftWall, rightWall, ...chains])

  // Each MouseConstraint registers an engine listener that survives removal
  // from the world. Keep one for this engine across preference changes.
  const mouse = Mouse.create(render.canvas)
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  })
  render.mouse = mouse

  // Matter stores these DOM listeners on Mouse but omits them from its types.
  const handlers = mouse as Mouse & Record<'mousemove' | 'mousedown' | 'mouseup' | 'mousewheel', EventListener>
  const setMouseEnabled = (enabled: boolean) => {
    if (enabled) {
      Mouse.setElement(mouse, render.canvas)
      Composite.add(world, mouseConstraint)
    } else {
      for (const [name, handler] of [
        ['mousemove', handlers.mousemove],
        ['mousedown', handlers.mousedown],
        ['mouseup', handlers.mouseup],
        ['touchmove', handlers.mousemove],
        ['touchstart', handlers.mousedown],
        ['touchend', handlers.mouseup],
      ] as const) {
        mouse.element.removeEventListener(name, handler)
      }
      // A release can occur while the handlers are detached.
      mouse.button = -1
      mouseConstraint.constraint.bodyB = null
      Mouse.clearSourceEvents(mouse)
      Composite.remove(world, mouseConstraint)
    }
    // Both create and setElement bind the wheel. Keep it available for scrolling.
    mouse.element.removeEventListener('wheel', handlers.mousewheel)
  }

  setMouseEnabled(!still)

  // fit the render viewport to the scene

  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: width, y: height }
  })

  // The still picture: let the coins fall and settle unseen, a slice of the
  // work per frame so the page stays responsive, then draw them once their
  // pictures have loaded.

  let settleFrame = 0
  let stillTimer: ReturnType<typeof setTimeout> | undefined
  let settled = false
  let disposed = false
  const pictures = () => Promise.all(networks.map(src => new Promise<void>(resolve => {
    const image = new Image()
    image.onload = image.onerror = () => resolve()
    image.src = src
  })))

  const drawStill = () => {
    if (disposed) return
    Render.world(render)
    clearTimeout(stillTimer)
    stillTimer = setTimeout(() => { if (!disposed && still) Render.world(render) }, 400)
  }

  const settle = () => {
    if (settled || settleFrame) return
    let steps = 0
    const slice = () => {
      settleFrame = 0
      if (disposed || !still) return
      for (let step = 0; step < 45; step++) Engine.update(engine, 1000 / 60)
      steps += 45
      if (steps < 900) {
        settleFrame = requestAnimationFrame(slice)
        return
      }
      settled = true
      pictures().then(drawStill)
    }
    settleFrame = requestAnimationFrame(slice)
  }

  // create intersection observer

  let inView = false

  const run = () => {
    Runner.run(runner, engine)
    Render.run(render)

    // pull the coins up
    chains.forEach(body => {
      const forceMagnitude = 0.02 * body.mass

      Body.applyForce(body, body.position, {
        x: 0,
        y: -forceMagnitude - Math.random() * forceMagnitude
      })
    })
  }

  const stop = () => {
    Runner.stop(runner)
    Render.stop(render)
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      inView = entry.isIntersecting
      if (still) {
        if (inView) settle()
      } else if (inView) {
        run()
      } else {
        stop()
      }
    })
  }, { rootMargin: '200px 0px' })

  observer.observe(canvas.value)

  // The visitor changed the setting while the page was open.

  const onPreference = () => {
    if (still === reduced.matches) return
    still = reduced.matches
    setMouseEnabled(!still)
    if (still) {
      stop()
      settled = false
      if (inView) settle()
    } else {
      cancelAnimationFrame(settleFrame)
      settleFrame = 0
      if (inView) run()
    }
  }

  reduced.addEventListener('change', onPreference)

  // resize canvas

  const resizeHandler = () => {
    const multiplayer = Math.sqrt(ethalonArea / (parent.value.clientWidth * parent.value.clientHeight))
    const width = parent.value.clientWidth * multiplayer
    const height = parent.value.clientHeight * multiplayer

    const dx = width + wallWidth / 2 - rightWall.position.x
    const dy = height + wallWidth / 2 - floor.position.y

    // @ts-ignore
    Render.setSize(render, parent.value.clientWidth, parent.value.clientHeight)

    Body.translate(rightWall, { x: dx, y: 0 })
    Body.translate(floor, { x: 0, y: dy })

    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: width, y: height }
    })

    if (still && settled) drawStill()
  }

  window.addEventListener('resize', resizeHandler)

  dispose = () => {
    disposed = true
    window.removeEventListener('resize', resizeHandler)
    reduced.removeEventListener('change', onPreference)
    observer.disconnect()
    cancelAnimationFrame(settleFrame)
    clearTimeout(stillTimer)
    stop()
    setMouseEnabled(false)
    Events.off(engine, 'beforeUpdate')
    Composite.clear(world, false)
    Engine.clear(engine)
  }
})

onBeforeUnmount(() => dispose?.())
</script>

<template>
  <div class="parent" ref="parent"><canvas ref="canvas" /></div>
</template>

<style scoped>
.parent {
  position: relative;
  overflow: hidden;
}

.parent canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
