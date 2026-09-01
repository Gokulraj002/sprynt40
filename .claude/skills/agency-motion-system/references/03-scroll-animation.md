# Scroll-Driven Animation Techniques — Next.js 15 App Router / Tailwind / Motion / R3F

## 0. Decision matrix — which tool for which job

| Need | Use | Why |
|---|---|---|
| Pinned sections, complex scrubbed timelines, horizontal scroll, SVG morphing, snap sequences | **GSAP + ScrollTrigger** | Purpose-built pinning engine, `scrub`, `snap`, `matchMedia` responsive triggers — nothing else matches its pin/scrub robustness |
| Simple parallax, fade/scale on scroll, scroll-linked opacity/transform on a handful of elements, React-idiomatic declarative code | **Motion (`useScroll`/`useTransform`)** | No extra dependency beyond Motion (already used for micro-interactions), stays in React's render model, smaller bundle |
| Whole-page inertia/smooth scroll feel | **Lenis** | Decouples native scroll from easing; the de-facto standard on Awwwards sites in 2025–2026 |
| Simple scroll-tied CSS effects (progress bars, image reveals) with zero JS cost | **Native CSS `animation-timeline: scroll()/view()`** | Runs entirely on the compositor thread — immune to main-thread jank. ~84% global support mid-2026 (Chrome/Edge 115+, Firefox 132+, Safari 18+); wrap in `@supports` and provide a static/CSS fallback for older browsers |
| 3D scenes tied to scroll (camera moves, model rotation) | **R3F + `useScroll` (drei) or Lenis progress fed into `useFrame`** | See drei's `ScrollControls` — pairs cleanly with Lenis by disabling drei's internal scroll container and driving it from Lenis' `scroll` event instead |

Rule of thumb for an agency site: use **Motion for 80% of scroll reveals** (cheap, React-native), reach for **GSAP ScrollTrigger only for the 1–3 signature hero/case-study moments** (pin, horizontal scroll, scrubbed video/canvas sequences), and put **Lenis underneath everything** for the buttery whole-page feel.

---

## 1. GSAP ScrollTrigger in Next.js App Router

### 1.1 Licensing (important, changed in 2025)
As of **GSAP 3.13 (May 2025)**, GSAP was acquired by Webflow and made **100% free for all use, including commercial**, and *every* previously-paywalled "Club GSAP" plugin (SplitText, ScrollSmoother, MorphSVG, DrawSVG, MotionPathPlugin, etc.) is now available via plain `npm install gsap`. No membership token/registry needed anymore. This removes what used to be the single biggest friction point for using GSAP in a commercial agency build.

### 1.2 Install
```bash
npm install gsap @gsap/react
```

### 1.3 Setup pattern — centralize registration, use `useGSAP`
Never call `gsap.registerPlugin(ScrollTrigger)` inside every component — repeated registration across route changes in App Router is a common source of leaked triggers and degraded performance. Register once in a small client module:

```ts
// lib/gsap-config.ts
'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };
```

Component usage — `useGSAP` auto-reverts everything created inside it (tweens, ScrollTriggers, event listeners) on unmount, which is the fix for the classic "ScrollTrigger leaks after client-side nav" bug in App Router:

```tsx
'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap-config';

export default function PinnedSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to('.panel', {
      xPercent: -100 * (gsap.utils.toArray('.panel').length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: container.current,
        pin: true,
        scrub: 1,
        end: () => '+=' + (container.current?.offsetWidth ?? 0),
        invalidateOnRefresh: true, // recompute on resize instead of caching stale values
      },
    });
  }, { scope: container }); // scope limits selector text (".panel") to this subtree — critical when multiple instances exist on one page

  return (
    <div ref={container} className="overflow-hidden">
      <div className="flex">
        <div className="panel w-screen shrink-0">…</div>
        <div className="panel w-screen shrink-0">…</div>
        <div className="panel w-screen shrink-0">…</div>
      </div>
    </div>
  );
}
```

Key `useGSAP` details:
- `scope` (ref or selector) constrains GSAP's selector text so you can safely reuse class names like `.panel` across many components on the same page without cross-contamination.
- `contextSafe(fn)` wraps handlers created **outside** the initial `useGSAP` callback (e.g. an `onClick` added later) so they're still tracked and reverted — needed for animations fired from user interaction rather than mount.
- Cleanup is automatic; you do **not** need a manual `return () => ctx.revert()` as was required with raw `gsap.context()` in the pre-`useGSAP` era.

### 1.4 App Router-specific gotchas
- **`ScrollTrigger` must never run on the server.** Guard registration with `typeof window !== 'undefined'`, and any file importing `ScrollTrigger` must have `'use client'` at the top — Server Components cannot touch it at all.
- **Route changes don't unmount everything you'd expect.** On `next/link` navigation, stale `ScrollTrigger` instances/pinned spacer `<div>`s can survive if cleanup wasn't wired correctly, causing layout to break on the next page. Call `ScrollTrigger.refresh()` inside a `useEffect` keyed on `usePathname()` in your root layout/providers to force recalculation after each route transition.
- **Fonts/images loading after first paint shift trigger positions.** Because ScrollTrigger measures pixel offsets on load, any late-loading web font (FOUT) or unsized image changes document height *after* triggers were calculated, causing "start point" drift. Fixes: use `next/font` (loads before paint, no layout shift), explicit `width`/`height` (or `aspect-ratio`) on all images in animated sections, and call `ScrollTrigger.refresh()` in an `onLoadingComplete`/`useEffect` once images/fonts are confirmed ready.
- **`useLayoutEffect` warning in SSR.** GSAP/ScrollTrigger internals want to measure the DOM before paint; `useGSAP` already applies an isomorphic layout effect internally so you generally don't need to hand-roll `typeof window !== 'undefined' ? useLayoutEffect : useEffect` yourself when using it — but if you use raw `gsap.context()` outside `useGSAP`, do this manually to avoid the "useLayoutEffect does nothing on the server" console warning.
- **Responsive behavior**: wrap breakpoint-dependent trigger logic in `ScrollTrigger.matchMedia()` (GSAP's built-in equivalent of a media query) instead of `window.innerWidth` checks — it auto re-runs when the viewport crosses a breakpoint and auto-cleans the old context.

### 1.5 Pin + horizontal scroll recipe (the signature agency "case study wall" pattern)
```tsx
useGSAP(() => {
  const panels = gsap.utils.toArray<HTMLElement>('.panel');
  gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: '.horizontal-wrap',
      pin: true,
      scrub: 1,
      snap: 1 / (panels.length - 1), // snaps to each panel on release
      end: () => '+=' + (document.querySelector('.horizontal-wrap') as HTMLElement).offsetWidth,
    },
  });
}, { scope: wrapRef });
```
Pitfalls specific to this pattern:
- `anticipatePin: 1` reduces a visible jump-flash right as pinning engages (add to the `scrollTrigger` config on the pinning trigger).
- Nested pinned sections inside a Lenis-smoothed page need the Lenis↔ScrollTrigger sync described in §2, or the pin will visibly stutter/desync from the scrollbar.
- Horizontal panels must have explicit widths (`w-screen`/`w-[100vw]` in Tailwind) — percentage-based flex children without a fixed basis cause `end` distance miscalculation.

---

## 2. Lenis smooth scroll — Next.js App Router integration

### 2.1 Install & basic client-only wrapper
```bash
npm install lenis
```
Lenis must run client-side only and needs its own RAF loop; wrap it in a small provider mounted high in the tree (e.g. inside `app/providers.tsx`, itself a `'use client'` component rendered from `app/layout.tsx`):

```tsx
'use client';
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential ease-out
      smoothWheel: true,
      syncTouch: false, // keep native touch scroll on mobile — smoothing touch feels laggy/unnatural
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
```

### 2.2 Syncing Lenis with GSAP ScrollTrigger (required — do not skip)
Without this, ScrollTrigger reads the native scroll position while Lenis is easing the *visual* position independently, causing pinned/scrubbed animations to desync from what's on screen:

```ts
useEffect(() => {
  const lenis = lenisRef.current;
  if (!lenis) return;

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000); // drive Lenis off GSAP's ticker instead of its own rAF
  });
  gsap.ticker.lagSmoothing(0); // disable GSAP's lag-smoothing; Lenis already handles perceived smoothness

  return () => gsap.ticker.remove(lenis.raf);
}, []);
```
Run only **one** RAF driver — either Lenis' own `requestAnimationFrame(raf)` loop (§2.1) *or* the `gsap.ticker.add` approach above, never both, or you'll double-update and cause micro-jitter.

### 2.3 Sync with Motion's `useScroll`
Motion's `useScroll` reads `window.scrollY` / a container's `scrollTop` by default, so it naturally follows whatever Lenis is doing to the scroll position (Lenis doesn't hijack the actual scrollbar/scrollTop, it just eases visually via `transform` on a wrapper in some configs, or updates native scroll in others depending on version). If using Lenis's default (non-transform) mode, `useScroll` needs no special wiring. If you configure Lenis to animate a wrapper via CSS transform (older "content" wrapper pattern from Locomotive-Scroll days), you must instead pass `useScroll({ container: wrapperRef })` — check which mode you're in before assuming zero-config compatibility.

### 2.4 Common Lenis pitfalls
- **Don't smooth touch scroll** (`syncTouch: false`, the default) — smoothing on mobile touch feels like input lag, not luxury; native momentum scroll is already good.
- **Anchor links / `#hash` navigation break** unless you intercept clicks and call `lenis.scrollTo(target)` instead of letting the browser jump natively.
- **`position: sticky` inside a Lenis-wrapped page can behave oddly** in transform-based Lenis configurations, because `sticky` is computed against the nearest scrolling ancestor, which a `transform`-animated wrapper changes; test sticky elements explicitly after adding Lenis.
- **Performance on low-end devices**: some teams report frame-rate drops running Lenis + ScrollTrigger simultaneously on older hardware — mitigate by using `will-change: transform` sparingly (only on actively-animating layers, remove after animation, since permanent `will-change` inflates GPU memory) and by disabling Lenis smoothing entirely under `prefers-reduced-motion` and on low-end mobile (`navigator.hardwareConcurrency` heuristic or simply always `syncTouch:false` + reduce `duration` on small viewports).
- **Always `lenis.destroy()` in cleanup** — otherwise the RAF loop keeps running after route/component unmount in App Router, leaking across client-side navigations.

---

## 3. Motion (Framer Motion) — `useScroll` / `useTransform`

Package note: as of mid-2025 the library ships as **`motion`** (the legacy `framer-motion` package still works, same API, just aliased/deprecated naming going forward). Prefer `import { useScroll, useTransform, motion } from 'motion/react'` in new code.

### 3.1 Core pattern — scroll-linked (not scroll-triggered) animation
```tsx
'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export default function ParallaxHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'], // progress 0 when target enters viewport bottom, 1 when it exits top
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="relative h-[140vh]">
      <motion.div style={{ y, opacity }} className="sticky top-0 h-screen">
        Hero content
      </motion.div>
    </div>
  );
}
```
`scrollYProgress` is a `MotionValue` (0→1), not React state — it updates outside React's render cycle for performance, so don't try to read `.get()` during render for conditional JSX; use `useTransform`/`useMotionValueEvent` instead.

### 3.2 Horizontal scroll section with Motion
```tsx
const { scrollYProgress } = useScroll({ target: sectionRef });
const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']); // -75% for 4 panels
```
Wrap the section in a tall (`h-[400vh]`) container with an inner `sticky top-0 h-screen` viewport, same pinning trick GSAP does with `pin: true` — Motion has no native "pin" API, you build it from `position: sticky` + a tall spacer.

### 3.3 Performance notes
- Motion only animates `transform` and `opacity` off the main thread by default (hardware-accelerated); animating `top`/`left`/`width` via `useTransform` forces layout recalculation every frame — stick to `x`/`y`/`scale`/`opacity`.
- For simple viewport-entry reveals (not continuously scroll-linked), prefer `whileInView` (uses IntersectionObserver under the hood, cheaper than a scroll listener) over `useScroll`:
  ```tsx
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
  />
  ```
  Reserve `useScroll`/`useTransform` specifically for effects that must track scroll *continuously* (parallax, progress bars, scrubbed reveals).
- `useScroll({ container: ref })` for scoping to a scrollable div instead of the window — needed if a section has its own internal scroll (e.g. a horizontally-scrolling case-study carousel nested in the main page).

---

## 4. Pitfalls that recur across the whole stack

1. **Hydration mismatches from browser-only reads.** Anything computing initial style/transform from `window.innerWidth`, `matchMedia`, or `navigator` during render (not inside `useEffect`) diverges from the server-rendered HTML and throws a hydration error. Rule: render a neutral/static state on first paint, then apply scroll-dependent transforms only after mount in an effect. Never gate JSX output on `typeof window !== 'undefined'` directly in the render body — it produces different server vs. client trees; instead use a `mounted` state flag set in `useEffect`.

2. **Layout shift (CLS) from animated sections.** Pinned/horizontal sections reserve real document height (the "spacer") for the pin duration — if that height is computed from content that loads late (images, fonts, remote data), the page jumps once ScrollTrigger recalculates. Fix: reserve space with explicit `aspect-ratio`/min-height Tailwind classes before content loads, use `next/font` and `next/image` (both eliminate their respective layout-shift sources), and call `ScrollTrigger.refresh()` / re-run `useScroll` measurement once all async content is confirmed painted.

3. **Scroll jank from animating non-composited properties.** Only animate `transform` and `opacity`. Animating `width`, `height`, `top`, `left`, `margin`, or box-shadow spread on every scroll tick forces synchronous layout ("layout thrashing") and drops frames, especially on mobile Safari. If you truly need a width change, animate `scaleX` with a fixed `transform-origin` instead.

4. **Multiple independent RAF/scroll-listener loops competing.** Running Lenis's own RAF *and* GSAP's ticker *and* a raw `window.addEventListener('scroll', …)` simultaneously multiplies main-thread work per frame. Consolidate: one driver (GSAP ticker, per §2.2) feeding both Lenis and ScrollTrigger; Motion's `useScroll` already uses its own optimized internal scheduler and doesn't need manual wiring.

5. **`prefers-reduced-motion` must actually change behavior, not just animation duration.** WCAG 2.1 expects large-scale motion (parallax, pinned scrub sequences, autoplaying background video tied to scroll) to be disabled or drastically reduced, not merely sped up. Pattern: read the media query once (`window.matchMedia('(prefers-reduced-motion: reduce)').matches`) at the top of the animation provider, and branch — skip Lenis smoothing, skip ScrollTrigger `scrub`/`pin`, replace with instant `whileInView` fades. Re-check on the `change` event since users can toggle OS setting live.

6. **`will-change` overuse.** Blanket `will-change: transform` on many elements permanently promotes them to their own GPU compositor layers, which inflates GPU memory and can *cause* jank rather than prevent it. Apply it just before an animation starts (e.g. in the `onEnter` of a ScrollTrigger) and remove it in `onLeave`/on completion.

7. **Route-change leaks in App Router.** Both GSAP contexts and Lenis instances must be explicitly destroyed on unmount (`useGSAP`'s auto-revert; `lenis.destroy()`); relying on the browser tab reload to clean up (as in classic multi-page sites) doesn't apply here — client-side navigation keeps the JS runtime alive, so leaked triggers/instances accumulate across page visits within a session.

8. **Nested pinning + Lenis desync.** A ScrollTrigger `pin: true` section inside a Lenis-smoothed page will visibly lag behind the "true" scroll position unless `lenis.on('scroll', ScrollTrigger.update)` is wired (§2.2) — this is the single most common bug report in the GSAP forums for this stack combination.

9. **R3F scroll-linked scenes**: driving `useFrame` off `scrollYProgress`/Lenis progress directly (rather than re-deriving camera position from scratch each frame) avoids feedback loops with drei's own `ScrollControls`; if using drei's `ScrollControls`, don't also wrap the page in Lenis for the *same* scroll container — pick one authority for that scroll region to avoid double-damping.

---

## 5. Named reference sites / examples worth studying

- **Pilot Republic** — Awwwards Site of the Day; built on Webflow but layered with GSAP + Lenis for signature scroll interactions (proof the GSAP+Lenis combo is genuinely in production use on award-tier agency sites, not just demos).
- Awwwards' curated **"Parallax" collection** (`awwwards.com/websites/parallax/`) and **GSAP-animation inspiration search** (`awwwards.com/inspiration_search/gsap-animation/`) — good rotating source of current pin/scrub/parallax patterns to benchmark against before building this site's hero.
- GSAP's own **CodePen "Horizontal scroll section with GSAP ScrollTrigger"** (`codepen.io/GreenSock/pen/jOrjPmm`) — canonical reference implementation for the pinned horizontal case-study-wall pattern.

---

## 6. Minimal recommended stack for this project

```bash
npm install gsap @gsap/react lenis motion
```
- **Lenis** mounted once in `app/providers.tsx`, synced to GSAP's ticker.
- **Motion (`useScroll`/`useTransform`/`whileInView`)** for the majority of section reveals and parallax — it's already needed for micro-interactions elsewhere, so this avoids a second animation runtime for simple cases.
- **GSAP ScrollTrigger** reserved for 1–3 hero-moment set pieces (pinned horizontal case-study rail, scrubbed hero video/canvas sequence) where its pin/scrub/snap engine is meaningfully more capable than sticky+transform tricks.
- **`next/font` + `next/image`** everywhere to eliminate the layout-shift sources that otherwise desync trigger measurements.
- A single `useReducedMotion` (Motion's built-in hook, or a manual `matchMedia` check reused for Lenis/GSAP) gating all of the above.
