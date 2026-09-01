---
name: agency-quality-engineering
description: Engineering quality bar for the agency website — Next.js 15 clean architecture, Tailwind v4 tokens, Core Web Vitals performance, SEO/structured data, and accessibility/reduced-motion. Use this skill when scaffolding the project, adding dependencies, setting up Tailwind/fonts/metadata, optimizing performance or SEO, before ANY commit/build/"is it done" check, or when the user mentions speed, Google ranking, Lighthouse, accessibility, or code cleanliness.
---

# Agency Quality Engineering

The site is the agency's own marketing: it must rank, load fast on mid-tier Android, and stay clean enough to hand to any developer.

## Architecture (anti-bloat)

- Dependency budget ~9: `next react react-dom motion three @react-three/fiber @react-three/drei clsx zod` (+ deliberately justified `gsap`/`lenis`). Banned: Redux/Zustand, React Query, axios, lodash, styled-components, shadcn dumps, wholesale react-icons.
- `"use client"` at the leaves only (thin `RevealOnScroll`, `MagneticButton` wrappers); pages/sections stay Server Components. All R3F in `components/canvas/`, `dynamic({ssr:false})`, gated by viewport + motion tier.
- No CMS under ~30 content items: typed `lib/data/*.ts` (+ MDX for long case studies), swappable behind the same interface later.
- `next/image`: `priority` only on true LCP, mandatory `sizes`, static imports for local assets; R3F textures load from `public/` via `useTexture`, never next/image.

## Tailwind v4

CSS-first `@theme` in globals.css (no tailwind.config). Fluid type as paired tokens (`--text-hero` + `--text-hero--line-height`) → one `text-hero` class, no breakpoint chains. Grain/glow via `@utility` (composes with variants). Runtime theme switching: raw vars on `:root`/`[data-page-theme]` + `@theme inline` aliases. Avoid utility soup by extracting ~10 primitives (`<Section>`, `<Heading>`…), not `@apply`. Drop to plain CSS for scrubbed timelines; mirror tokens into `tokens.ts` for canvas use.

## Performance (budgets are hard numbers)

First-load JS ≤150–170KB compressed; LCP ≤2.0s p75 mobile; INP ≤200ms; CLS ≤0.05. Levers: LazyMotion, dynamic R3F, scoped GSAP imports; compositor-only animation; batch reads before writes per rAF tick; `frameloop="demand"`. Fonts: `next/font` + `adjustFontFallback: true` (metric-adjusted fallback = zero swap CLS). Video: poster is the LCP, `preload="metadata"`, IO-gated src below fold, `muted playsinline`.

## SEO

JSON-LD only as literal `<script type="application/ld+json">` in Server Component JSX — metadata-API placement is silently dropped. Dynamic OG images via `opengraph-image.tsx` + `ImageResponse` for service/blog pages (a portfolio flex in itself). One real `<h1>` per page even with split-text heroes (animate `motion.h1` as a block or pair `sr-only` h1). All copy server-rendered and passed as props into animation wrappers; `initial={{opacity:0}}` is crawl-safe. No thin service×city doorway pages — only city pages with genuinely unique content; locality otherwise via `ProfessionalService` schema. `sitemap.ts` + `robots.ts` in App Router.

## Accessibility & fallback tiers

Single source of truth: inline pre-hydration script sets `data-motion` on `<html>`; `MotionConfig reducedMotion="user"`, `gsap.matchMedia()`, and the R3F mount decision all read the same signal. Device tiers (full / mid / static) from `hardwareConcurrency` + `deviceMemory` + `saveData` + pointer + `detect-gpu`. Contrast checked at the worst gradient stop (AA 4.5:1, 30–40% scrim fix). Overlay menus: full dialog pattern. Every hover interaction has a `:focus-visible` twin.

## References

- `references/16-nextjs-architecture.md` · `references/17-tailwind-tokens.md` · `references/18-performance.md` · `references/19-seo.md` · `references/20-accessibility-fallbacks.md` — read the matching file fully before working in that area.
