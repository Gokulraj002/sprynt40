---
name: agency-design-language
description: Visual design language for the agency website — layout/grid systems, navigation and overlay menus, typography pairings and fluid type scales, color/theme tokens and gradients. Use this skill whenever designing or restyling ANY visual aspect of the site — picking fonts or colors, building the header/nav/menu, making the site "look premium", art-directing a section, or translating a reference site's look into our own system. Load before writing any layout or globals.css theme code.
---

# Agency Design Language

The premium/template divide is decided by **one governing idea expressed consistently across grid, type, and motion** — not by stacking effects. Pick the idea first (editorial? brutalist? luxury-minimal?), then let every token serve it.

## Core rules

**Type is the hero.** Viewport-filling headlines with scroll-tied motion replaced hero imagery. Pairing default: **Fraunces (variable serif) + Inter**; alternatives: Instrument Serif + Inter (quiet luxury), Bricolage Grotesque + Fraunces (magazine-modern). Never two grotesques or two loud serifs. Self-host via `next/font/google`, `variable` strategy, one `app/fonts.ts`. Fluid scale via clamp() tokens from `--fs--1` up to a 4–16rem mega step — always bounded in rem.

**Color: one neutral system + exactly one saturated OKLCH accent** (~2–10% usage). Never pure #000/#fff — near-black `#0a0a0c` and warm off-white `#faf9f6`. Signature 2025-26 move: **section theme switching** — dark hero → light body → dark footer, driven by IntersectionObserver toggling `data-page-theme` on `<html>`. Tailwind v4 gotcha: raw vars in `:root`/`[data-page-theme]` selectors + `@theme inline` aliases, or runtime switching breaks.

**Texture kills the "flat template" look**: 3–5 blurred animated blob divs for mesh gradients (transform/opacity only) + one fixed SVG feTurbulence grain overlay at 3–6% opacity `mix-blend-mode: overlay`.

**Navigation**: persistent minimal header (5–8 links max, one filled CTA) + full-screen overlay menu animated in two stages (panel wipe, then staggered large-type links). Sticky header combines transparent→blur, logo shrink, hide-on-scroll-down. Magnetic hover only on CTA/close/socials, gated behind `(hover: hover) and (pointer: fine)`. Overlay needs the full dialog a11y pattern (focus trap, Escape, `inert` background).

**Grid-breaking** (offset columns, overlapping media, asymmetric 60/40 splits) signals craft; centered uniform cards signal template.

## References — read before building the matching piece

- `references/01-design-trends.md` — governing-idea framework, named award-site examples, static-frame test.
- `references/06-navigation.md` — header behaviors, overlay choreography, magnetic buttons, nav a11y checklist.
- `references/07-typography.md` — pairings, free substitutes for paid faces, clamp scale math, split-text reveal without paid plugins, variable-font axis animation.
- `references/08-color-theme.md` — palettes with hex values, OKLCH ramps, theme-switch implementation, grain/gradient recipes, Tailwind v4 token setup.
