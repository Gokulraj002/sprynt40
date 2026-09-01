---
name: agency-site-director
description: Master playbook for building a unique, award-quality digital marketing agency website with Next.js 15 (App Router) + Tailwind CSS + Motion (Framer Motion) + Three.js/React Three Fiber, with strictly minimal, clean code. Use this skill whenever the user asks to build, scaffold, design, or extend the agency website in this project — including "create the site", "build the homepage", "add a section", "make it look premium/cinematic", or shares reference sites to draw ideas from. Always load this skill FIRST for any site-building request; it tells you which companion skills and research files to pull in next.
---

# Agency Site Director

You are building a **digital marketing agency website** that must feel like an Awwwards contender, not a template. This skill is the top-level playbook: stack rules, code-quality rules, page blueprint, and pointers to companion skills and research.

## Non-negotiable stack

- **Next.js 15, App Router, TypeScript** — created with `create-next-app` (no `src/` opinion wars: use `src/` off by default result, keep whatever create-next-app generates, but stay consistent).
- **Tailwind CSS** (v4 if available in create-next-app) — design tokens as CSS variables. **Never Bootstrap.**
- **Motion** (`motion` package, formerly framer-motion) for UI animation choreography.
- **Three.js via @react-three/fiber + @react-three/drei** only where 3D genuinely earns its place (hero/background) — always dynamically imported, never in the initial bundle.
- Optional, only when a technique requires them: `gsap` (ScrollTrigger scrubbing/pinning), `lenis` (smooth scroll). Do not add both Motion scroll and GSAP scroll for the same job — pick one per effect.

## Clean-code contract (the user explicitly demanded "no unwanted code")

- Every dependency must be justified by a visible feature. Target **under ~10 runtime dependencies** total.
- No dead files, no commented-out blocks, no unused exports, no boilerplate pages left from scaffolding (delete default create-next-app cruft immediately).
- No component libraries (no shadcn dumps, no MUI). Build the ~6 primitives the site needs (Button, Container, SectionHeading, etc.) by hand.
- All site copy/data (services, case studies, testimonials, nav links) lives in typed data files under `lib/data/` — sections map over data; no copy hard-coded inside JSX layouts.
- Server components by default; `"use client"` only on leaf components that animate or handle interaction.
- One animation vocabulary: define shared easings/durations/variants in `lib/motion.ts` and reuse them — consistency is what makes a site feel designed.

## Recommended structure

```
app/
  layout.tsx        # fonts (next/font), metadata, <SmoothScroll>, global chrome
  page.tsx          # home: composes sections
  work/  services/  about/  contact/   # routes as needed
components/
  ui/               # Button, Container, SectionHeading, Marquee, ...
  sections/         # Hero, Services, Work, Proof, CTA, Footer ...
  fx/               # cursor, transitions, canvas/3D wrappers (all client)
lib/
  data/             # services.ts, projects.ts, testimonials.ts, site.ts
  motion.ts         # shared variants, easings, springs
  hooks.ts          # useMediaQuery, useReducedMotion helpers
```

## Homepage blueprint (default section order)

1. **Hero** — one big idea: kinetic headline + sub + single CTA; optional 3D/canvas background.
2. **Client logo marquee** — instant credibility.
3. **Services** — editorial list/accordion with hover media, not card grids.
4. **Selected work / case studies** — results-first (metrics: ROAS, leads, growth).
5. **Proof** — stats counters + testimonial pull-quote.
6. **Process or About teaser** — how the agency works.
7. **Big CTA footer** — oversized type, "book a call", contact links, WhatsApp for IN clients.

Every section: real `<h2>` hierarchy, semantic HTML, crawlable text (SEO is the agency's own marketing).

## Companion skills — load these when their domain comes up

Each companion skill carries distilled research (from 20 parallel research passes) in its `references/` folder — read the matching reference file fully before building that piece.

- **agency-design-language** — layout/grid, navigation/menus, typography, color/theme tokens, gradients & grain.
- **agency-motion-system** — Motion patterns, GSAP+Lenis scroll, cursors/magnetic hover, page transitions & loaders.
- **agency-3d-hero** — hero archetypes and all Three.js/R3F work, with the device-tier fallback ladder.
- **agency-sections** — services, case studies, social proof, CTAs/pricing, contact & lead capture.
- **agency-quality-engineering** — architecture/anti-bloat, Tailwind v4 tokens, performance budgets, SEO, accessibility.
- Also available globally: **cinematic-animations** (GSAP scroll heroes, particles) and **r3f-portfolio-3d** (R3F in Next.js) for implementation recipes; **anthropic-skills:seo-strategy** for SEO audits.

## Quality gates before calling anything "done"

- `npm run build` passes clean; no TS or lint errors.
- Test in the browser (preview tools) at desktop AND mobile widths; screenshot-verify hero, one mid section, and footer.
- `prefers-reduced-motion` honored globally; heavy effects disabled on touch/low-end.
- Lighthouse-minded: LCP element is text or an optimized image (never the 3D canvas), no CLS from fonts or media.
- Unique, not clichéd: if a section could be mistaken for a template, redesign it before shipping.
