# Three.js / React Three Fiber for Agency Sites

Stack target: Next.js 15 App Router + Tailwind + Motion (Framer Motion) + R3F/drei.

## 1. Named examples worth studying (award-quality 3D usage)

- **Active Theory** (activetheory.net) — large-scale real-time WebGL, multi-user/"metaverse" builds; the reference point for production-grade 3D on the open web. Study their restraint: heavy WebGL is usually gated to a hero or a dedicated case-study page, not every scroll section.
- **Resn** — high-impact 3D paired with careful performance discipline; Three.js rendering pipelines layered with GSAP timelines, built to still pass Core Web Vitals. Good model for "3D as garnish, not the whole meal."
- **Immersive Garden, Unseen Studio, Locomotive** — repeatedly cited alongside Active Theory/Resn as the elite WebGL studios behind current Awwwards Site-of-the-Day work; useful for browsing current-year technique trends (shader hero, distorted mesh cursor, FBO particle fields).
- Awwwards inspiration tags worth mining directly: "FBO Particles with Three.js," "Dynamic hero image using three.js," "Hero Shader" pages, and the site-wide `awwwards.com/websites/three-js/` collection — browse these per-project for the current visual language rather than treating any single site as canonical (trends rotate every 6–12 months).
- Pattern across all of them: 3D is concentrated in ONE moment (hero load-in, a signature case-study reveal, a cursor-trail texture) and the rest of the site is fast, accessible HTML/CSS. None of them render 3D on every page or every fold.

## 2. Next.js App Router integration — the SSR problem

Three.js touches `window`, `document`, and WebGL context at import time, which breaks in RSC/SSR. The fix is dynamic import with SSR disabled, not `'use client'` alone:

```tsx
// app/page.tsx (Server Component)
import dynamic from 'next/dynamic'

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => <HeroFallback />, // static gradient/image, same layout box
})

export default function Page() {
  return (
    <section className="relative h-screen">
      <HeroScene />
    </section>
  )
}
```

```tsx
// components/three/HeroScene.tsx
'use client'
import { Canvas } from '@react-three/fiber'

export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
      {/* scene graph */}
    </Canvas>
  )
}
```

Key rules:
- Always mark the Canvas-containing file `'use client'` even though the parent already used `dynamic(..., { ssr:false })` — the inner file is still a client component and Next will error on server-only APIs if you forget.
- The `loading` fallback should occupy the exact same box (height, background gradient) as the eventual canvas to avoid CLS — ship a CSS gradient placeholder that visually approximates the 3D scene.
- **Version gotcha**: R3F v8 is not compatible with React 19 / Next 15's React 19 default. Install `@react-three/fiber@rc` (v9) and matching `@react-three/drei@rc` when building on Next 15. Pin exact versions in package.json since these are still RC-track and can break on minor bumps.
- Avoid importing `three` or `@react-three/*` anywhere that a Server Component can reach transitively (barrel files, shared `lib/` utils) — it forces the whole chunk into the server bundle graph and can throw `ReferenceError: self is not defined`.

## 3. Particle fields (the workhorse agency effect)

Two approaches, pick by particle count:

**< ~5,000 particles — `<Points>` + `PointMaterial` (drei), CPU-updated:**
```tsx
import { Points, PointMaterial } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

function ParticleField({ count = 3000 }) {
  const points = useRef<THREE.Points>(null!)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr.set([(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10], i * 3)
    }
    return arr
  }, [count])

  useFrame((state, delta) => {
    points.current.rotation.y += delta * 0.05
  })

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled>
      <PointMaterial transparent size={0.02} sizeAttenuation depthWrite={false} />
    </Points>
  )
}
```

**> 10,000 particles or GPU-simulated motion (flocking, curl-noise, mouse-attraction) — FBO/GPGPU particles:**
Render particle positions into a float texture on the GPU each frame (ping-pong render targets), then read that texture in a vertex shader to place points. This is the "FBO Particles with Three.js" technique Awwwards frequently features. It's expensive to build from scratch — for an agency site, only reach for full FBO simulation on a flagship hero; use `InstancedMesh` + a cheap noise-driven vertex shader for anything secondary.

**InstancedMesh for particle-like geometry (not raw points, e.g. floating shards/orbs):**
```tsx
<instancedMesh ref={ref} args={[undefined, undefined, count]}>
  <icosahedronGeometry args={[0.05, 0]} />
  <meshStandardMaterial />
</instancedMesh>
```
Keep total unique draw-call-worthy meshes under roughly 1,000; instancing collapses thousands of objects into one draw call, which is the single highest-leverage perf move available.

## 4. Shader gradient backgrounds

Full-screen shader plane pattern (from Codrops' subtle-shader-background technique):
- Use a plane with a trivial vertex shader that skips 3D projection: `gl_Position = vec4(position.xy, 0.0, 1.0);` — this pins the plane to fill the viewport regardless of camera, cheap and simple.
- Fragment shader takes uniforms: `resolution` (viewport size for UV math), `time` (drives animated gradient motion), color stops (`uColorA`, `uColorB`, etc.), and optionally a mouse-trail texture.
- For mouse-reactive gradients, drei ships a `TrailTexture` hook that paints a fading trail into an off-screen canvas texture on `onPointerMove` — sample it in the fragment shader to distort/reveal the gradient without hand-rolling pointer tracking.
- Update `time` via `useFrame`, not `useState` (state updates re-render React; uniform mutation via ref does not):
```tsx
const matRef = useRef<THREE.ShaderMaterial>(null!)
useFrame((state) => {
  matRef.current.uniforms.uTime.value = state.clock.elapsedTime
})
```
- Alternative no-shader-code route: `@shadergradient/react` (works on React 18/19) wraps this pattern as a drop-in `<ShaderGradientCanvas>` component — good for teams that don't want to hand-write GLSL, faster to ship, less unique visually.
- drei's `<GradientTexture>` is the lightest-weight option (declarative `THREE.Texture`, attaches to `map`) when you just need a gradient material and not animated noise — no custom shader needed at all.

## 5. Distorted / interactive meshes

`MeshDistortMaterial` (drei) is the fastest way to get an organic, blob-like hero object — it distorts geometry following simplex noise, driven by a `distort` (0–1 intensity) and `speed` prop:
```tsx
import { MeshDistortMaterial, Sphere } from '@react-three/drei'

<Sphere args={[1, 128, 128]}>
  <MeshDistortMaterial distort={0.4} speed={2} roughness={0.2} metalness={0.6} color="#7c3aed" />
</Sphere>
```
Mouse-reactive variant: drive `distort` or a custom uniform from normalized pointer position captured via `onPointerMove` on the Canvas, lerped in `useFrame` for smoothness (avoid snapping directly to raw pointer deltas — always ease toward a target value with `THREE.MathUtils.lerp`).

`MeshTransmissionMaterial` / `MeshRefractionMaterial` (drei) for glass/liquid agency-brand orbs — visually striking but expensive (renders a background buffer per frame); restrict to a single small object, never a field of them.

Cursor-follow tilt/parallax on a mesh (common on product/feature cards):
```tsx
useFrame(({ pointer }) => {
  meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, pointer.y * 0.3, 0.05)
  meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, pointer.x * 0.3, 0.05)
})
```
`state.pointer` (R3F's built-in normalized -1..1 pointer, updated by the Canvas's own pointer events) is preferable to wiring a raw DOM `mousemove` listener — it's already normalized to the canvas and respects `pointerEvents`.

## 6. Scroll-linked camera / scrollytelling

Built-in option: drei's `<ScrollControls>` + `<Scroll>`:
```tsx
<Canvas>
  <ScrollControls pages={3} damping={0.25}>
    <Scroll>{/* 3D content, positioned by page offset */}</Scroll>
    <Scroll html>{/* DOM content overlay, scrolls in sync */}</Scroll>
  </ScrollControls>
</Canvas>
```
Read progress inside a child with `useScroll()` (returns `offset` 0–1) and drive camera position/rotation or object transforms in `useFrame`. Good for self-contained 3D scroll sequences fully inside the Canvas.

For syncing 3D to the *page's* native scroll (so DOM sections and WebGL move together, which is what most agency sites actually want — not a Canvas-driven scroll container): use GSAP ScrollTrigger to update camera/object refs directly, or the dedicated `r3f-scroll-rig` library (14islands), which uses Lenis for smooth scroll and stays compatible with drei/react-spring while syncing DOM element positions to 3D meshes 1:1. This is the more common real-world pattern for agency sites because it keeps normal HTML scroll semantics (and thus normal accessibility/SEO) rather than moving scroll ownership into the Canvas.

GSAP-driven camera fly-through pattern:
```tsx
useEffect(() => {
  gsap.timeline({ scrollTrigger: { trigger: '#scene-wrapper', start: 'top top', end: 'bottom bottom', scrub: 1 } })
    .to(camera.position, { z: 2, x: 1.5, ease: 'none' }, 0)
    .to(camera.rotation, { y: 0.3, ease: 'none' }, 0)
}, [])
```
Pair with `frameloop="demand"` + `invalidate()` on scroll tick so the canvas isn't rendering 60fps while scroll is idle (see §8).

## 7. Mouse-reactive scenes — general pattern

Use R3F's `state.pointer` inside `useFrame` rather than external mousemove listeners whenever the effect is inside the Canvas. Always damp/lerp toward the target rather than setting directly — raw pointer-follow reads as janky, lerped follow reads as premium. Typical lerp factor: 0.05–0.12 for "smooth drag," 0.15–0.25 for "snappy but eased."

For effects that must react to mouse position *before* the Canvas mounts (e.g., a CSS-layer element that should feel connected to the WebGL scene), lift pointer position to a shared store (Zustand/Jotai) so both DOM and Canvas layers read the same coordinate source — avoids two independent, slightly-out-of-sync pointer trackers.

## 8. Performance budget — concrete techniques

1. **`frameloop="demand"`** — only render on prop/state change instead of every animation frame; saves battery and avoids fan noise on idle scenes. Must pair with `invalidate()` calls anywhere something changes outside R3F's own reactivity (e.g., OrbitControls, GSAP-driven refs):
   ```tsx
   const { invalidate } = useThree()
   controlsRef.current.addEventListener('change', invalidate)
   ```
2. **`<PerformanceMonitor>`** (drei) — tracks running FPS, fires `onIncline`/`onDecline`/`onFallback` so you can step DPR or disable postprocessing dynamically:
   ```tsx
   <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} onFallback={() => setLowQuality(true)}>
     <Canvas dpr={dpr}>...</Canvas>
   </PerformanceMonitor>
   ```
3. **Adaptive DPR** — cap `dpr={[1, 2]}` on `<Canvas>` rather than always rendering at `devicePixelRatio` (a 3x retina phone will otherwise render at 3x resolution for no visible benefit and heavy GPU cost).
4. **Instancing** — collapse repeated geometry into `InstancedMesh`; single draw call for thousands of objects vs. one draw call per mesh. This is the highest ROI single change for particle/shard/orb fields.
5. **Geometry/material reuse** — `useLoader`'s cache automatically shares loaded assets across components referencing the same URL; also manually share `THREE.BufferGeometry`/`Material` instances via `useMemo` instead of instantiating per-component.
6. **Suspense + code-split heavy scenes** — wrap `<Canvas>` children needing async loads (GLTF, textures) in `<Suspense fallback={...}>`; combine with route-level dynamic import so the ~600KB+ three.js/drei bundle only loads on pages that need it, never in the main JS bundle.
7. **Budget targets** (practical, not spec'd anywhere official but standard practice in the field): keep hero scene JS (three + r3f + drei subset, tree-shaken) under ~150–200KB gzipped; target 60fps on mid-tier laptops, degrade gracefully to 30fps floor on mobile before falling back entirely; avoid post-processing chains (bloom, DoF, SSAO) on anything but the single hero moment — each pass is a full-screen extra render.
8. **Silent-failure watch-out**: exceeding mobile GPU memory triggers WebGL context loss, which forces R3F into its Suspense fallback with no visible error — always test on an actual mid-range Android device, not just Chrome DevTools throttling, since context-loss behavior doesn't reproduce well in emulation.

## 9. Mobile fallback strategy

- Treat mobile as a **different tier of experience**, not a shrunk desktop scene. Options in increasing cost order:
  1. Static image/CSS-gradient replacement of the entire 3D hero below a breakpoint (cheapest, most reliable, best Core Web Vitals).
  2. Reduced scene: same Canvas, but with particle count cut 70–90%, no post-processing, DPR capped at 1, simpler materials (swap `MeshTransmissionMaterial`/physical materials for `meshBasicMaterial`).
  3. Full scene gated behind a device-capability check (WebGL2 support + rough GPU tier heuristic, e.g. via `navigator.hardwareConcurrency` or a library like `detect-gpu`) with graceful downgrade.
- Respect `prefers-reduced-motion`: disable ambient looping animation (auto-rotate, particle drift) for users who set it, while still allowing user-initiated interaction (pointer-follow) — check via `window.matchMedia('(prefers-reduced-motion: reduce)')` and branch inside `useFrame`.
- Detect touch/coarse pointer (`window.matchMedia('(pointer: coarse)')`) to disable mouse-reactive effects that have no touch equivalent, rather than leaving a dead interaction that desktop users would notice but mobile users can't trigger anyway.
- Because canvas content is invisible to assistive tech and crawlers, never put essential copy or CTAs only inside the WebGL layer — always duplicate critical text/links in real DOM (this also fixes SEO: 3D-only sites need parallel HTML content for indexing).

## 10. When 3D helps vs. hurts a marketing/agency site

**Helps when:**
- The 3D *is* the differentiator/portfolio piece — an agency selling WebGL/creative-dev services should demonstrate the craft directly (dogfooding); clients expect it as proof of capability.
- Confined to a single, load-bearing moment: hero load-in, a signature case-study transition, an interactive "capabilities" showcase — not sprinkled across every section.
- Desktop-first traffic with a technical/creative buyer persona (agencies pitching other agencies, design-forward B2B) where a slower, richer first impression is acceptable trade-off for memorability.
- Paired with a genuinely fast, accessible fallback so the "hurts" risks below are mitigated rather than ignored.

**Hurts when:**
- Target audience/traffic mix is majority mobile or low-end devices — a static image beats WebGL on Core Web Vitals, conversion, and bounce almost every time in that case.
- The core conversion path (contact form, pricing, CTA) would be sacrificed to loading budget or visually competes with the 3D for attention.
- Timeline/budget doesn't allow proper QA across GPU tiers — a broken/janky 3D scene reads far worse than no 3D at all.
- Screen-reader/keyboard-only accessibility is a hard requirement and the 3D content carries information not duplicated elsewhere (canvas has no DOM semantics; assistive tech gets nothing from it by default).
- Traditional/enterprise client industries where "flashy" undercuts perceived reliability — sophistication read differently across sectors.
- Rule of thumb from the research: always keep a non-WebGL path to every piece of essential content, and treat 3D as a conversion-risk decision to A/B test, not an assumed win — measure bounce/conversion with 3D on vs. off rather than assuming the "wow" factor pays for itself.

## Sources

- [Three.js with Next.js Integration Guide (2026)](https://threejsresources.com/frameworks/three-js-nextjs)
- [Installation - React Three Fiber docs](https://r3f.docs.pmnd.rs/getting-started/installation)
- [Scaling Performance - React Three Fiber docs](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [How to Code a Subtle Shader Background Effect with React Three Fiber (Codrops)](https://tympanus.net/codrops/2024/10/31/how-to-code-a-subtle-shader-background-effect-with-react-three-fiber/)
- [How to Code a Shader Based Reveal Effect with React Three Fiber + GLSL (Codrops)](https://tympanus.net/codrops/2024/12/02/how-to-code-a-shader-based-reveal-effect-with-react-three-fiber-glsl/)
- [Creating cool shader backgrounds in react-three-fiber](https://adamkarlsten.com/blog/creating-shader-backgrounds/)
- [GitHub - ruucm/shadergradient](https://github.com/ruucm/shadergradient)
- [GitHub - 14islands/r3f-scroll-rig](https://github.com/14islands/r3f-scroll-rig)
- [Animate a Camera Fly-through on Scroll Using Theatre.js and React Three Fiber (Codrops)](https://tympanus.net/codrops/2023/02/14/animate-a-camera-fly-through-on-scroll-using-theatre-js-and-react-three-fiber/)
- [React Three Fiber tutorial - Scroll Animations (Wawa Sensei)](https://wawasensei.dev/tuto/react-three-fiber-tutorial-scroll-animations)
- [Boosting React Three Fiber Mobile Performance in 2026 (Krapton)](https://www.krapton.com/blog/boosting-react-three-fiber-mobile-performance-in-2026-a-deep-dive-d6105c)
- [Performance Issues with R3F drei CameraControls on Low-End Devices (three.js discourse)](https://discourse.threejs.org/t/performance-issues-with-r3f-drei-cameracontrols-on-low-end-devices/74776)
- [The best WebGL & interactive 3D agencies in 2026 (Psychoactive)](https://www.psychoactive.co.nz/content-hub/best-webgl-interactive-3d-agencies)
- [10 Best Three.js Agencies (2026) (Utsubo)](https://www.utsubo.com/blog/top-threejs-agencies)
- [Active Theory](https://activetheory.net/)
- [FBO Particles with Three.js (Awwwards)](https://www.awwwards.com/inspiration/fbo-particles-with-three-js)
- [Three.js & Accessibility (Medium)](https://medium.com/@piplev/three-js-accessibility-c4f45d83f2c6)
- [WebGL & Three.js Site SEO: Make 3D Sites Rankable (Utsubo)](https://www.utsubo.com/blog/webgl-three-js-site-seo-rankable-guide)
