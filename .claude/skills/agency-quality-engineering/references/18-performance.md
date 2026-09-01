# Performance for Heavily Animated Sites (Next.js 15 + Tailwind + Motion + R3F/Three.js)

Award-site animation (GSAP/Motion/Three.js, WebGL heroes, scroll-scrub video) and good
Core Web Vitals are NOT in conflict — they fail together only when the animation stack
loads eagerly, blocks the main thread, and touches layout properties. Everything below
is about deferring, isolating, and cheapening the animation work so it never sits on the
critical rendering path.

## 1. The budget targets (write these into a `PERF_BUDGET.md` and enforce in CI)

For a marketing/agency site that must rank and convert:

- **LCP ≤ 2.0s at p75 on throttled 4G mobile** (Google's pass bar is 2.5s — aim tighter
  because animated sites tend to regress). Best-in-class target: ≤ 1.2s.
- **INP ≤ 200ms** (Google's Core Web Vital since March 2024, replaced FID). Heavy
  scroll-jank sites often fail this from long animation frames during scroll/hover.
- **CLS ≤ 0.1**, ideally ≤ 0.05 — the easiest one to blow with custom fonts, lazy 3D
  canvases, and injected cursor/particle overlays that don't reserve space.
- **Total JS (compressed) ≤ 150–170KB** for the initial route. Alex Russell's
  "sub-3-second on a $200 Android over 4G" research puts the realistic ceiling around
  ~350KB total JS before interactivity suffers structurally; treat 150KB as the target
  for the *first paint bundle* and let heavy libs (Three.js, GSAP ScrollTrigger, full
  Motion) load as separate async chunks after LCP.
- **Main thread work < 4s total, no Long Animation Frame (LOAF) > 200ms** during scroll.
- Set a **Lighthouse CI budget.json** with `resourceSizes` caps (script ≤ 170KB, total ≤
  1MB by first load) and wire it into CI so a regression fails the build, not just gets
  noticed in prod.

## 2. Code-split every animation library — nothing heavy in the initial bundle

**Three.js / React Three Fiber**
- Always `dynamic(() => import('./Scene'), { ssr: false, loading: () => <Fallback /> })`
  for the R3F `<Canvas>` — Three.js touches `window`/WebGL context, can't SSR, and a
  naive top-level import adds 150–600KB+ (three + drei + postprocessing) to the main
  chunk.
- Mark the Canvas wrapper `'use client'`, import it dynamically from a Server Component
  page shell so the rest of the page (text, nav, CTA) stays server-rendered and ships
  zero JS for that content.
- Import only the drei helpers you use (`import { useGLTF } from '@react-three/drei'`)
  rather than a barrel import — tree-shaking drei is inconsistent, so prefer scoped
  subpath imports where available.
- Gate the 3D scene behind an `IntersectionObserver`/`useInView` so it doesn't even
  start downloading until the hero section is about to scroll into view, and behind a
  `prefers-reduced-motion` + rough device-capability check (see the r3f-portfolio-3d
  skill's mobile fallback tier — swap to a static poster/gradient on low-end/mobile).

**GSAP**
- Import only the plugins you use: `import gsap from 'gsap'; import { ScrollTrigger }
  from 'gsap/ScrollTrigger'` — never `import * as GSAP`. ScrollTrigger/ScrollSmoother/
  SplitText are separate chunks; don't register plugins you don't call.
- Load GSAP inside a `useEffect`/dynamic import for any component that isn't needed for
  first paint (below-the-fold scroll reveals), so it's fetched after hydration, not
  blocking it.
- Kill/revert ScrollTriggers on unmount (`ScrollTrigger.getAll().forEach(t=>t.kill())`)
  to prevent leaked rAF loops accumulating across route changes in the App Router (a
  classic long-session INP killer on marketing sites with lots of internal nav).

**Motion (Framer Motion)**
- Default `motion` component ships ~34KB; swap to **`LazyMotion` + the `m` component**
  and load `domAnimation` (or `domMax` only if you need drag/layout animations) to cut
  initial cost to ~4.6–6KB, loading the rest async after first paint:
  ```tsx
  import { LazyMotion, domAnimation, m } from "motion/react";
  <LazyMotion features={domAnimation} strict>
    <m.div animate={{ opacity: 1 }} />
  </LazyMotion>
  ```
- Use `useReducedMotion()` (≈1KB standalone) to branch to instant/opacity-only
  transitions for `prefers-reduced-motion: reduce` users — required for accessibility
  and also cheapens the interaction cost on low-power devices.
- Prefer CSS-driven Tailwind transitions (`transition`, `animate-*`) for simple
  hover/focus states; reserve Motion/GSAP JS for orchestrated, scroll-linked, or
  physics-based sequences where CSS can't express the choreography.

**Rule of thumb:** anything not needed to render the LCP element and the primary CTA
above the fold should be a separate chunk, loaded via `next/dynamic`, a route-level
`loading` boundary, or an in-view trigger — never a static top-of-file import in a page
that's part of the initial route.

## 3. requestAnimationFrame hygiene (this is what actually protects INP)

- **Batch DOM reads then writes** inside a single rAF callback — never interleave
  `getBoundingClientRect()`/`offsetTop` reads with style writes across ticks (forces
  synchronous layout thrashing).
- **Animate only `transform` and `opacity`.** These are compositor-only properties —
  no layout, no paint. Animating `width`, `height`, `top/left`, `margin` forces
  layout recalculation on every frame and is the #1 cause of janky scroll animations.
  Use `translate3d`/`scale` instead of changing box dimensions.
- Use `will-change: transform` sparingly and only on elements actively animating —
  remove it after (creates a new compositor layer; too many layers exhausts GPU memory
  on mobile, which paradoxically *hurts* performance).
- For scroll-driven effects, prefer the **rAF → work → paint** pattern over raw scroll
  listeners: throttle scroll handlers into a single rAF tick (`if (ticking) return;
  requestAnimationFrame(() => { update(); ticking = false }); ticking = true`), or use
  GSAP ScrollTrigger / Motion's `useScroll` which already do this internally — don't
  hand-roll a naive `addEventListener('scroll', fn)` without rAF-gating.
- Where practical, migrate simple scroll-linked transforms to **CSS scroll-driven
  animations** (`animation-timeline: scroll()`) — zero JS, runs off the main thread
  entirely, and is now supported in Chromium/Firefox; keep GSAP/Motion as the
  progressive-enhancement layer or for Safari fallback.
- For expensive per-frame math (physics, particle position updates, noise functions),
  defer to `requestIdleCallback` or a Web Worker when it's not visually synchronous
  with a gesture, and always cap work with a frame budget check
  (`if (performance.now() - frameStart > 8) break`).
- **R3F specifically:** use `frameloop="demand"` for scenes that aren't perpetually
  animating (hero that settles, product viewers) and call `invalidate()` only on actual
  state changes — this stops Three.js's default continuous render loop from burning a
  frame budget every 16ms even when nothing on screen changed. Cap `dpr` with
  `<Canvas dpr={[1, 2]}>` instead of raw devicePixelRatio (avoids 3x rendering cost on
  high-DPI phones). Reduce/disable postprocessing passes and shadow maps on mobile via
  a device-tier check.

## 4. Image optimization

- Use `next/image` everywhere for raster assets — it auto-generates responsive `srcset`,
  serves AVIF/WebP with fallback, and lazy-loads by default for anything not `priority`.
- Set `priority` (and `fetchPriority="high"` for non-`next/image` LCP candidates) on
  **exactly one** image: whichever element is the actual LCP candidate (usually the
  hero image or hero video poster). Do not mark every hero-section image priority —
  that defeats prioritization.
- Always set explicit `width`/`height` (or `fill` + a sized/aspect-ratio'd parent) —
  this is what lets `next/image` reserve layout space and prevents CLS on load.
- For decorative/background WebGL textures, compress aggressively (KTX2/Basis for 3D
  textures, or at minimum WebP) and lazy-load them only once the Canvas mounts, not in
  the initial JS bundle as base64/data URIs.

## 5. Video: never let hero video become an LCP or bandwidth liability

- Treat a hero background video as: **poster image = the real LCP element**, video is
  a progressive enhancement layered on top after paint.
  ```html
  <video poster="/hero-poster.avif" autoplay muted loop playsinline
         preload="metadata" />
  ```
- `preload="none"` or `"metadata"` (never `"auto"`) — `auto` can pull the entire file
  before interaction on some browsers, wrecking mobile data and LCP.
- Lazy-load below-the-fold video entirely via `IntersectionObserver`: don't set `src`
  until the section nears the viewport; swap in a `<source>` only then.
- `autoplay` requires `muted` + `playsinline` to work cross-browser (especially iOS
  Safari) — never rely on a video for meaningful audio-off content that must autoplay.
- Serve an actual compressed MP4/WebM (H.264/VP9, target ≤ 2–3MB for a 10–15s hero
  loop at 1080p, more aggressively compressed on mobile via `<source media>` variants)
  rather than a GIF — GIFs are 5–10x larger for the same visual.
- Consider a managed video CDN (Mux, Cloudflare Stream) for adaptive bitrate on longer
  case-study/showreel video — avoids shipping a single huge file to all connection
  speeds.

## 6. Fonts: kill FOUT/FOIT-driven CLS

- Use `next/font/google` or `next/font/local` — never a `<link>` to Google Fonts CDN.
  next/font self-hosts at build time (no third-party request, no render-blocking
  `@import`), inlines `font-display` control, and auto-generates a metric-adjusted
  fallback face.
- Leave `adjustFontFallback: true` (the default) — Next.js computes `ascent-override`,
  `descent-override`, `line-gap-override`, and `size-adjust` on the fallback (Arial/
  Times) so it occupies the *same box size* as the real font, eliminating the reflow
  when the webfont swaps in. This is the single biggest CLS fix for custom display
  fonts on hero sections.
- Use `display: 'swap'` (default) for body copy so text renders immediately in the
  fallback and swaps — never `block`, which delays text paint waiting on the font file
  (directly hurts LCP if the LCP element is text).
- Subset aggressively — only load the Latin (or actually-used) subset/weights; each
  extra weight is a separate file. For a marketing site, 2–3 weights per family is
  usually enough (e.g., Regular + Semibold + Bold), not the full variable-font range
  unless you specifically need variable-weight animation.
- Preload only the above-the-fold critical font file if not using next/font's automatic
  preload (next/font does this automatically for fonts used in the root layout).

## 7. Server Components + streaming to protect LCP

- Keep the hero's text/heading/CTA as a **Server Component** — ship it as static HTML,
  not client JS. The 3D/animated background is a sibling `'use client'` island loaded
  async; it must never gate the text's paint.
- Use `loading.tsx` / `<Suspense>` boundaries so route transitions show instantly while
  heavier below-the-fold sections (case studies, testimonials carousels, 3D scenes)
  stream in.
- Avoid `next/dynamic({ ssr: false })` for anything that IS the LCP element — that
  forces a client-only render with a loading flash. Reserve `ssr:false` for genuinely
  browser-only, non-LCP widgets (Canvas, map embeds, chat widgets).

## 8. Measuring: don't ship on vibes

- **Lighthouse CI** in the pipeline with a `budget.json`/`assertions` block per route
  (home, case-study template, contact) — fail the PR on regression, not just log it.
- **PageSpeed Insights / CrUX** for real-world field data (p75 LCP/INP/CLS) — lab
  Lighthouse scores can look great while real users on mid-tier Android phones and
  real-world network conditions see worse numbers; CrUX is what Google actually uses
  for ranking signal.
- **Chrome DevTools Performance panel → Long Animation Frames (LoAF)** — the modern
  successor to Long Tasks for INP debugging; surfaces exactly which animation/script is
  blocking the main thread during scroll/interaction.
- **`web-vitals` npm package** wired to analytics (or Vercel Speed Insights) for
  continuous RUM on the actual animated pages in production — synthetic Lighthouse runs
  won't catch a GSAP ScrollTrigger recalculating layout on real users' devices.
- Test on an actual throttled mid-tier device profile (Moto G Power / "Slow 4G" CPU 4x
  slowdown in DevTools), not just a dev machine — WebGL/Three.js scenes that feel silky
  on an M-series laptop can drop to single-digit fps and blow the INP budget on the
  hardware real visitors use.
- Re-run Lighthouse specifically with the hero animation/3D scene both **before** and
  **after** its in-view trigger fires, to confirm the deferred bundle truly isn't
  counted in the initial route's JS weight.

## 9. Quick checklist for this project's build

- [ ] `next/dynamic(..., { ssr: false })` for every R3F Canvas / heavy GSAP-only widget
- [ ] `LazyMotion` + `m` instead of full `motion` import
- [ ] `frameloop="demand"` + capped `dpr` on all non-perpetual R3F scenes
- [ ] Only `transform`/`opacity` animated; no layout-property tweening
- [ ] `next/font` with `adjustFontFallback` on, ≤3 weights per family
- [ ] Hero LCP element identified explicitly, `priority`/`fetchPriority="high"` set once
- [ ] Video: poster-first, `preload="metadata"`, IO-gated `src` for below-fold video
- [ ] `prefers-reduced-motion` branch tested (instant/opacity-only fallback, no 3D)
- [ ] Lighthouse CI budget.json wired into CI, JS ≤170KB initial route
- [ ] ScrollTrigger/rAF loops explicitly killed on route change / unmount

## Sources

- [Reduce bundle size of Framer Motion — motion.dev](https://motion.dev/docs/react-reduce-bundle-size)
- [LazyMotion — motion.dev](https://motion.dev/docs/react-lazy-motion)
- [Improve Web Performance With requestAnimationFrame — DebugBear](https://www.debugbear.com/blog/requestanimationframe)
- [How to use animations on sites without tanking Core Web Vitals — Hosting.com](https://hosting.com/blog/how-to-build-animation-heavy-wordpress-sites-without-tanking-core-web-vitals/)
- [Improve INP Using Long Animation Frames (LoAF)](https://www.hirecorewebvitalsconsultant.com/blog/improve-inp-using-long-animation-frames-loaf/)
- [Scaling performance — React Three Fiber docs](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [100 Three.js Tips That Actually Improve Performance (2026) — Utsubo](https://www.utsubo.com/blog/threejs-best-practices-100-tips)
- [Lazy loading video — web.dev](https://web.dev/articles/lazy-loading-video)
- [Video performance — web.dev](https://web.dev/learn/performance/video-performance)
- [Improving LCP for Video Hero Components — aarontgrogg.com](https://aarontgrogg.com/blog/2026/01/06/improving-lcp-for-video-hero-components/)
- [Fixing layout shifts caused by web fonts — Vincent Bernat](https://vincent.bernat.ch/en/blog/2024-cls-webfonts)
- [Framework tools for font fallbacks — Chrome Developers](https://developer.chrome.com/blog/framework-tools-font-fallback)
- [Fonts (next/font) — Vercel Academy](https://vercel.com/academy/nextjs-foundations/fonts-with-next-font)
- [Use Lighthouse for performance budgets — web.dev](https://web.dev/articles/use-lighthouse-for-performance-budgets)
- [Lighthouse CI Performance Budgets Guide (2026) — qaskills.sh](https://qaskills.sh/blog/lighthouse-ci-performance-budgets-guide-2026)
- [Three.js with Next.js Integration Guide (2026) — threejsresources.com](https://threejsresources.com/frameworks/three-js-nextjs)
