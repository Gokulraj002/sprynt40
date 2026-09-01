---
name: agency-motion-system
description: The animation system for the agency website — Motion (framer-motion) patterns, GSAP ScrollTrigger + Lenis smooth scroll, custom cursors and magnetic hover, page transitions and preloaders in Next.js App Router. Use this skill whenever adding or debugging ANY animation on the site — scroll reveals, pinned/scrubbed sections, hover effects, route transitions, loaders — or when the user says "animate this", "add scroll effects", "make it smooth", or an animation feels janky or breaks on navigation.
---

# Agency Motion System

Motion must be **choreography, not decoration** — staggers teach reading order; every effect passes the "would a static frame look designed?" test and runs 60fps under CPU throttle.

## Library split (do not double up)

- **Motion** (`motion` package, import from `motion/react`) for ~80%: reveals, variants, hovers, parallax via `useScroll`/`useTransform`, `whileInView`.
- **GSAP** (now 100% free incl. ScrollTrigger/ScrollSmoother/SplitText since Webflow acquisition) reserved for 1–3 signature set pieces: pinned horizontal rails, scrubbed sequences.
- **Lenis** for smooth scroll — MUST sync: `lenis.on('scroll', ScrollTrigger.update)`, drive from `gsap.ticker`, `lagSmoothing(0)`, or pins visibly desync.

## Non-negotiable mechanics

- Bundle: `LazyMotion` + `m` (~4.6kb) with `domAnimation`, `strict` mode; never bare `motion` imports creeping back (34kb).
- `"use client"` only on thin animation wrappers (`components/motion/*`), never whole pages/sections.
- Choreography via parent/child variants + `delayChildren: stagger(0.08)` — never hand-computed `index * delay`.
- Animate only `transform` / `opacity` / `clip-path`. Never width/height/top/padding. `will-change` transient only.
- App Router cleanup: `useGSAP` hook (`@gsap/react`) for auto context revert; `lenis.destroy()` on unmount; `ScrollTrigger.refresh()` after fonts/images settle.
- Shared vocabulary in `lib/motion.ts`: expo-out `[0.16, 1, 0.3, 1]` for entrances; springs — premium/heavy = low stiffness + mass ≈1, snappy UI = high stiffness. Exits mirror entrances but faster.

## Cursors & micro-interactions

Two-layer cursor: instant dot + spring-lagged follower (damping 20–25, stiffness 300); contextual labels ("View"/"Drag") via one context provider + `data-cursor` attributes. Magnetic pull: strength 0.25–0.4, radius 80–120px. `mix-blend-mode: difference` auto-inverts across themes. **Hard-gate**: unmount all cursor code unless `(pointer: fine) and (hover: hover)`; native cursor in forms/long copy/checkout. Every hover effect needs a `:focus-visible` twin.

## Transitions & loaders

- Preloaders are usually a net CWV negative — only for real WebGL/video first-paint cost, ≤2s, session-gated, tied to actual load promises.
- App Router exit animations need `AnimatePresence` in `template.tsx` + the FrozenRouter pattern (full code in `references/15-transitions-loaders.md`); or use the native React `ViewTransition` component / `next-view-transitions` for simple crossfades.
- Curtain wipes: hand-built Motion `clipPath`/`scaleY` overlay, ≤700–900ms.

All of it behind the global reduced-motion signal (see agency-quality-engineering skill).

## References

- `references/04-motion-patterns.md` — Motion imports, LazyMotion, variants, AnimatePresence rules, spring tokens.
- `references/03-scroll-animation.md` — ScrollTrigger vs useScroll decision table, Lenis sync recipe, App Router traps, CSS scroll-timeline option.
- `references/14-micro-interactions.md` — cursor architecture with exact spring values, magnetic math, touch gating.
- `references/15-transitions-loaders.md` — FrozenRouter code, ViewTransition patterns, preloader rules.
