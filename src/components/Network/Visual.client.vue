<script setup lang="ts">
import { Engine, Render, Runner, Bodies, Composite, Composites, MouseConstraint, Mouse } from 'matter-js'
import { networks } from './networks'

const parent = shallowRef()
const canvas = shallowRef()

onMounted(async () => {
  await nextTick()
  if (!canvas.value || !parent.value) return

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
      visible: false
    }
  }
  const wallWidth = 100

  const top = Bodies.rectangle(parent.value.clientWidth / 2, - wallWidth / 2, parent.value.clientWidth, wallWidth, wallOptions)
  const floor = Bodies.rectangle(parent.value.clientWidth / 2, parent.value.clientHeight + wallWidth / 2, parent.value.clientWidth, wallWidth, wallOptions)
  const leftWall = Bodies.rectangle(parent.value.clientWidth + wallWidth / 2, parent.value.clientHeight / 2, wallWidth, parent.value.clientHeight, wallOptions)
  const rightWall = Bodies.rectangle(-wallWidth / 2, parent.value.clientHeight / 2, wallWidth, parent.value.clientHeight, wallOptions)

  // create chains

  const chains = Composites.stack(0, 0, 13, 3, 30, 0, function (x: number, y: number, i: number, j: number) {
    return Bodies.circle(x + Math.random() * 200 - 100, y + Math.random() * 100, 36, {
      density: 0.0006,
      frictionAir: 0.01,
      restitution: 0.03,
      friction: 0.01,
      render: {
        sprite: {
          texture: networks[j * 13 + i].icon,
          xScale: 1.5,
          yScale: 1.5,
        }
      }
    })
  })

  // add mouse control

  const mouse = Mouse.create(render.canvas)
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false
      }
    }
  })

  Composite.add(world, [top, floor, leftWall, rightWall, chains, mouseConstraint])

  // keep the mouse in sync with rendering

  render.mouse = mouse

  // fit the render viewport to the scene

  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: parent.value.clientWidth, y: parent.value.clientHeight }
  })

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        Runner.run(runner, engine)
        Render.run(render)
      } else {
        Runner.stop(runner)
        Render.stop(render)
      }
    })
  })

  observer.observe(canvas.value)
})
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