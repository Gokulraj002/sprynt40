---
name: agency-3d-hero
description: Hero sections and Three.js/React Three Fiber work for the agency website — kinetic typography heroes, WebGL particle/gradient backgrounds, scroll-linked 3D, and the device-tier fallback ladder. Use this skill whenever building or changing the hero, adding ANY 3D/WebGL/canvas/particle effect anywhere on the site, or when the user says "3D", "three.js", "particles", "shader background", or "make the hero wow".
---

# Agency 3D Hero

3D earns its place as **one concentrated flagship moment** — atmosphere and depth around real content, not a spectacle that replaces it. The winning hybrid: kinetic typography in real DOM layered over a lightweight R3F particle/gradient background.

## Hero rules

- Five archetypes: kinetic type, WebGL, video, split/asymmetric (60/40, never 50/50), editorial-static. Default to the kinetic-type + subtle WebGL hybrid.
- Headline reveal: word-level split, ~0.5s per word, expo/power3-out, 0.08–0.12s stagger; total choreography 1.0–1.8s max. CTA interactive almost immediately — never gated behind the full sequence.
- One value prop, one verb-led CTA, thin trust strip near the fold.
- Headline + CTA are real HTML **first**; LCP element is text or an optimized image, never the canvas. Copy never lives only inside a canvas.

## R3F engineering

- Version: React 19/Next 15 requires **R3F v9** (`@react-three/fiber` v9 + matching drei) — v8 breaks.
- Always `next/dynamic(() => import(...), { ssr: false })` around a `"use client"` Canvas file, with a same-size placeholder (no CLS) that doubles as the reduced-motion/low-tier static fallback.
- Performance levers: `frameloop="demand"` + `invalidate()`, drei `<PerformanceMonitor>` adaptive DPR capped `[1, 2]`, `InstancedMesh` for particles. Scene bundle budget ~150–200KB gzipped.
- Particles: drei `<Points>` under ~5k (CPU); GPGPU/FBO curl-noise only for one flagship hero (10k+).
- Scroll-linked 3D: prefer GSAP ScrollTrigger / Lenis-synced native scroll driving the camera (keeps real HTML scroll semantics) over drei `<ScrollControls>` owning the page.

## Fallback ladder (never binary)

Tier by `hardwareConcurrency` + `deviceMemory` + `saveData` + `pointer: coarse` + `detect-gpu`: full desktop → mid (cut particles 50–80%, no post-processing, DPR ≤1.5–2) → low/reduced-motion (never mount Canvas; designed static image; R3F bundle never downloaded).

## References

- `references/02-hero-patterns.md` — archetypes with named award examples, timing tables, conversion discipline.
- `references/05-threejs-r3f.md` — R3F v9 setup, demand frameloop, particle techniques, scroll-camera patterns, when 3D helps vs hurts.
