<script setup lang="ts">
import { Renderer, Program, Color, Mesh, Triangle, Vec2 } from 'ogl'

// The aurora behind every page: ink with a slow plum weather and two very
// soft drifting glows, pink and ember, each under 18 % and one cycle a
// minute, as behind the wallet home in the apps. It is drawn at half
// resolution, 20 times a second, and only while the tab is visible. With
// reduced motion it is a still picture.
const el = ref<HTMLCanvasElement>()

const vertex = /* glsl */ `
    attribute vec2 uv;
    attribute vec2 position;

    varying vec2 vUv;

    void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
    }
  `

const fragment = /* glsl */ `
    precision highp float;

    uniform vec3 uInk;
    uniform vec3 uPlum;
    uniform vec3 uPink;
    uniform vec3 uEmber;
    uniform float uTime;
    uniform float uScroll;
    uniform vec2 uResolution;

    varying vec2 vUv;

    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 13.0)) * 13.0;
    }

    vec4 permute(vec4 x) {
      return mod289(((x*34.0)+1.0)*x);
    }

    vec4 taylorInvSqrt(vec4 r) {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

    vec2 fade(vec2 t) {
      return t*t*t*(t*(t*6.0-15.0)+10.0);
    }

    // Classic Perlin noise
    float cnoise(vec2 P) {
      vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
      vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
      Pi = mod289(Pi); // To avoid truncation effects in permutation
      vec4 ix = Pi.xzxz;
      vec4 iy = Pi.yyww;
      vec4 fx = Pf.xzxz;
      vec4 fy = Pf.yyww;

      vec4 i = permute(permute(ix) + iy);

      vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
      vec4 gy = abs(gx) - 0.5 ;
      vec4 tx = floor(gx + 0.5);
      gx = gx - tx;

      vec2 g00 = vec2(gx.x,gy.x);
      vec2 g10 = vec2(gx.y,gy.y);
      vec2 g01 = vec2(gx.z,gy.z);
      vec2 g11 = vec2(gx.w,gy.w);

      vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
      g00 *= norm.x;
      g01 *= norm.y;
      g10 *= norm.z;
      g11 *= norm.w;

      float n00 = dot(g00, vec2(fx.x, fy.x));
      float n10 = dot(g10, vec2(fx.y, fy.y));
      float n01 = dot(g01, vec2(fx.z, fy.z));
      float n11 = dot(g11, vec2(fx.w, fy.w));

      vec2 fade_xy = fade(Pf.xy);
      vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
      float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
      return 3.0 * n_xy;
    }

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      float aspect = uResolution.x / max(uResolution.y, 1.0);
      vec2 p = vec2(vUv.x * aspect, vUv.y);
      // One cycle a minute.
      float t = uTime * 6.2831853 / 60000.0;
      float drift = uScroll * 0.0004;

      float n = cnoise(p * 1.25 + vec2(0.3 * sin(t), drift + 0.22 * cos(t)));
      vec3 color = mix(uInk, uPlum, clamp(n * 0.5 + 0.3, 0.0, 1.0) * 0.5);

      vec2 pinkAt = vec2(aspect * (0.2 + 0.14 * sin(t)), 0.74 + 0.12 * cos(t) + drift * 0.6);
      vec2 emberAt = vec2(aspect * (0.82 + 0.12 * cos(t + 1.3)), 0.26 + 0.14 * sin(t + 0.6) + drift * 0.3);
      float pink = smoothstep(0.85, 0.0, distance(p, pinkAt));
      float ember = smoothstep(0.75, 0.0, distance(p, emberAt));
      color = mix(color, uPink, pink * 0.17);
      color = mix(color, uEmber, ember * 0.11);

      // A little noise hides the banding of such slow gradients.
      color += (hash(gl_FragCoord.xy) - 0.5) / 180.0;

      gl_FragColor = vec4(color, 1.0);
    }
  `

let stop: (() => void) | undefined

onMounted(async () => {
  await nextTick()
  if (!el.value) return

  let renderer: Renderer
  try {
    renderer = new Renderer({
      dpr: 0.5,
      canvas: el.value,
      width: window.innerWidth,
      height: window.innerHeight,
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
    })
  } catch {
    // No WebGL: the page keeps its plain ink background.
    return
  }
  const gl = renderer.gl

  // Rather than using a plane (two triangles) to cover the viewport here is a
  // triangle that includes -1 to 1 range for 'position', and 0 to 1 range for 'uv'.
  // Excess will be out of the viewport.

  //         position                uv
  //      (-1, 3)                  (0, 2)
  //         |\                      |\
  //         |__\(1, 1)              |__\(1, 1)
  //         |__|_\                  |__|_\
  //   (-1, -1)   (3, -1)        (0, 0)   (2, 0)

  const geometry = new Triangle(gl)

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uInk: { value: new Color('#120A2E') },
      uPlum: { value: new Color('#3A1060') },
      uPink: { value: new Color('#E6006F') },
      uEmber: { value: new Color('#FF7A1A') },
      uResolution: { value: new Vec2(window.innerWidth, window.innerHeight) },
    },
  })

  const mesh = new Mesh(gl, { geometry, program })
  const still = window.matchMedia('(prefers-reduced-motion: reduce)')
  const frameMs = 50
  let frame = 0
  let last = 0

  const draw = () => renderer.render({ scene: mesh })

  const tick = (now: number) => {
    frame = requestAnimationFrame(tick)
    if (now - last < frameMs) return
    last = now
    program.uniforms.uTime.value = now
    draw()
  }

  const run = () => {
    cancelAnimationFrame(frame)
    frame = 0
    if (still.matches || document.hidden) draw()
    else frame = requestAnimationFrame(tick)
  }

  const resize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    program.uniforms.uResolution.value = new Vec2(window.innerWidth, window.innerHeight)
    if (!frame) requestAnimationFrame(draw)
  }

  const scroll = () => {
    // A still picture for visitors who ask for reduced motion.
    if (still.matches) return
    program.uniforms.uScroll.value = window.scrollY
    if (!frame) requestAnimationFrame(draw)
  }

  window.addEventListener('resize', resize)
  window.addEventListener('scroll', scroll, { passive: true })
  document.addEventListener('visibilitychange', run)
  still.addEventListener('change', run)
  run()

  stop = () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('resize', resize)
    window.removeEventListener('scroll', scroll)
    document.removeEventListener('visibilitychange', run)
    still.removeEventListener('change', run)
  }
})

onBeforeUnmount(() => stop?.())
</script>

<template>
  <canvas ref="el" class='background' aria-hidden="true" />
</template>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -2;
  display: block;
}
</style>
