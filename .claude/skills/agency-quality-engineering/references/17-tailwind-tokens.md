# Tailwind CSS v4 for Premium Marketing Sites

Target stack: Next.js 15 App Router + Tailwind v4 + Motion + R3F. Focus: CSS-first
config, token strategy, fluid type, custom utilities for grain/gradient, container
queries, avoiding div-soup in section components, and knowing when to bail to plain CSS.

## 1. v4 setup with Next.js 15 (CSS-first, no tailwind.config.js)

Install:
```bash
npm install tailwindcss @tailwindcss/postcss
```
`postcss.config.mjs`:
```js
export default {
  plugins: { "@tailwindcss/postcss": {} },
};
```
No `autoprefixer`, no `postcss-import` — v4 bundles both. Remove any `tailwind.config.js`
unless you need a JS-only plugin; if you do, load it explicitly:
```css
@import "tailwindcss";
@config "../../tailwind.config.js";
```

`app/globals.css` — this file *is* the config now:
```css
@import "tailwindcss";

@theme {
  --color-brand-50:  oklch(0.98 0.02 250);
  --color-brand-500: oklch(0.62 0.19 250);
  --color-brand-900: oklch(0.28 0.09 250);

  --font-display: "Neue Montreal", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;

  --breakpoint-3xl: 120rem;
}
```
Import once at the root layout (`app/layout.tsx`): `import "./globals.css"`. Nothing
else needed — no `content` glob array; v4's Oxide scanner auto-detects template files
by walking the project (respecting `.gitignore`), so App Router's `app/`, `components/`,
`lib/` etc. are picked up automatically. If you keep files outside the project root
(a shared UI package, a monorepo `packages/ui`), add them explicitly:
```css
@source "../../packages/ui/src/**/*.{ts,tsx}";
```

**v3 vs v4 config mental model**: in v3 you edited `theme.extend.colors` in JS and
Tailwind generated CSS variables for you at build time as an implementation detail.
In v4 the CSS variables *are* the source of truth — `@theme` both defines the design
token and instructs Tailwind to emit matching utilities (`--color-brand-500` →
`bg-brand-500`, `text-brand-500`, `border-brand-500`, `fill-brand-500`, `ring-brand-500`,
all for free). This means design tokens are directly consumable in plain CSS
(`color: var(--color-brand-500)`), in inline styles, and in JS via
`getComputedStyle(document.documentElement).getPropertyValue('--color-brand-500')` —
useful for animating Tailwind tokens with Motion (`animate={{ backgroundColor:
"var(--color-brand-500)" }}`) or feeding a token into a Three.js/R3F material color
without hardcoding hex twice.

**next/font integration**: `next/font` generates a CSS variable (e.g. `--font-inter`)
on `<html>`. Wire it into the theme with the `inline` option so Tailwind resolves the
reference instead of leaving a dangling `var()`:
```css
@theme inline {
  --font-sans: var(--font-inter);
  --font-display: var(--font-neue-montreal);
}
```

**Breaking changes that bite on marketing sites**:
- `ring` default width changed 3px → 1px (use `ring-3` for old default).
- Default border/ring color is now `currentColor`, not `gray-200`/`blue-500` — always
  set an explicit border color utility, don't rely on the old gray default.
- Arbitrary CSS-variable syntax changed: `bg-[--brand]` → `bg-(--brand)`.
- `!important` moved to a trailing bang: `flex!` not `!flex`.
- Renamed shadow/radius scale (`shadow-sm`→`shadow-xs`, old `shadow`→`shadow-sm`) —
  re-check every card/button shadow after upgrading a v3 site.
- Requires Safari 16.4+, Chrome 111+, Firefox 128+ (uses `@property`, `color-mix()`).
  Fine for a modern agency site; a factor if you support legacy enterprise browsers.

## 2. Design token strategy

Structure tokens in three tiers, all inside one or more `@theme` blocks:

**Tier 1 — primitives** (raw palette, spacing scale, type scale). Use `oklch()` for
color primitives — perceptually uniform, so generating a 50–950 ramp for a brand hue
produces visually even steps (unlike hex/HSL which clump at the dark end):
```css
@theme {
  --color-ink-50:  oklch(0.985 0.003 250);
  --color-ink-950: oklch(0.13  0.02  260);
}
```

**Tier 2 — semantic aliases** for things that might change by theme/brand without
touching every component:
```css
@theme {
  --color-surface: var(--color-ink-50);
  --color-surface-inverted: var(--color-ink-950);
  --color-accent: var(--color-brand-500);
}
```
Note: semantic aliases that reference other theme vars generally need `@theme inline`
to resolve correctly (plain `@theme` can hit cascade-order issues since generated
utilities land in a fixed layer position).

**Tier 3 — component-scoped custom properties** defined outside `@theme` (plain
`:root` or scoped to a component class) for values that shouldn't become utilities —
e.g. a hero's parallax offset, a grain opacity, a gradient angle:
```css
:root {
  --hero-grain-opacity: 0.06;
  --section-gutter: clamp(1.25rem, 4vw, 5rem);
}
```
Only put a variable in `@theme` if you *want* Tailwind to mint utility classes from
it. Everything else belongs in plain `:root`/component scope — this is the main
lever for avoiding an explosion of one-off utilities.

**Spacing**: v4 ships a single `--spacing` base unit (default `0.25rem`) that drives
the entire numeric spacing scale (`p-4`, `gap-6`, `-mt-2`, arbitrary fractions like
`p-17` all derive from it) instead of a fixed object of named steps. Override the
base to instantly rescale the whole site's rhythm:
```css
@theme {
  --spacing: 0.3rem; /* slightly looser rhythm across every spacing utility */
}
```
Add named exceptions for section-level rhythm that doesn't fit the scale:
```css
@theme {
  --spacing-section: clamp(4rem, 10vw, 10rem);
  --spacing-gutter: clamp(1.25rem, 5vw, 6rem);
}
```
```html
<section class="py-(--spacing-section) px-(--spacing-gutter)">
```

## 3. Fluid type via clamp() in tokens

Bake `clamp()` directly into `--text-*` theme values — this is the biggest quality-of-
life win in v4 for marketing/hero typography, since font-size tokens can now carry
paired line-height/letter-spacing/weight as a value list:
```css
@theme {
  --text-hero: clamp(2.75rem, 1.4rem + 6vw, 7rem);
  --text-hero--line-height: 0.95;
  --text-hero--letter-spacing: -0.02em;
  --text-hero--font-weight: 600;

  --text-display: clamp(2rem, 1rem + 3.5vw, 4.5rem);
  --text-display--line-height: 1.05;

  --text-lede: clamp(1.125rem, 1rem + 0.6vw, 1.5rem);
  --text-lede--line-height: 1.5;
}
```
Usage is a single class: `<h1 class="text-hero">`. Under the hood this expands to
`font-size`, `line-height`, `letter-spacing`, `font-weight` together — no more
separate `leading-none tracking-tight` bolted on every heading, and no per-breakpoint
`text-4xl md:text-6xl lg:text-8xl` chains that jump discretely at breakpoints instead
of scaling smoothly (a giveaway of template-grade sites vs. award-site polish).

Compute clamp values with the standard two-point formula (min size at min viewport,
max size at max viewport):
```
slope = (maxSize - minSize) / (maxVw - minVw)
yIntercept = minSize - slope * minVw
clamp(minSize, {yIntercept}rem + {slope*100}vw, maxSize)
```
Tools like Utopia or typeclamp.com generate the numbers; paste results straight into
`--text-*` tokens rather than reaching for a clamp plugin — v4's native support makes
`tailwind-clamp`-style plugins unnecessary for this use case.

For truly one-off hero numbers that don't deserve a token, arbitrary values still
work inline: `text-[clamp(3rem,2vw+2rem,6rem)]` — but prefer promoting anything reused
across ≥2 sections into `@theme`.

## 4. Custom utilities: grain, noise, gradients

Use `@utility` (not `@layer utilities`, which is v3-only and doesn't support variants
like `hover:`/`lg:` properly in v4):

**Grain/noise overlay** (inline SVG turbulence, no image asset, no JS):
```css
@utility bg-grain {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: var(--grain-opacity, 0.05);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    mix-blend-mode: overlay;
  }
}
```
```html
<section class="bg-grain [--grain-opacity:0.08]">
```
Tune opacity per-section via the arbitrary-property CSS-variable syntax rather than
writing multiple grain variants.

**Mesh/gradient utility** as a functional custom utility taking theme-driven color
stops:
```css
@theme {
  --color-mesh-1: oklch(0.7 0.15 250);
  --color-mesh-2: oklch(0.75 0.18 320);
}
@utility bg-mesh {
  background-image:
    radial-gradient(at 20% 20%, var(--color-mesh-1) 0px, transparent 50%),
    radial-gradient(at 80% 70%, var(--color-mesh-2) 0px, transparent 50%);
}
```

**Functional utility with `--value()`** for parameterized effects, e.g. a glow blur
strength driven straight from arbitrary or theme values:
```css
@utility glow-* {
  filter: drop-shadow(0 0 --value(integer)px var(--color-accent));
}
```
`glow-24` and `glow-[40]` both work; add `--default()` for a bare `glow` fallback.

Custom utilities compose with every built-in variant automatically (`hover:bg-grain`,
`lg:bg-mesh`, `dark:bg-grain`) — this is the main advantage over just writing a
`.grain` class in `@layer components`.

## 5. Container queries

v4 ships container queries as first-class, no `@tailwindcss/container-queries` plugin
needed. Mark a wrapper `@container`, then style children by the *container's* size,
not the viewport — critical for reusable marketing components (feature cards, logo
grids, testimonial blocks) that get dropped into narrow sidebars in one layout and
full-bleed sections in another:
```html
<div class="@container">
  <div class="grid grid-cols-1 gap-6 @lg:grid-cols-2 @4xl:grid-cols-3">
    <!-- card content reflows based on container, not viewport -->
  </div>
</div>
```
Named containers avoid ambiguity when queries nest (`@container/card` +
`@lg/card:...`). Add custom sizes via `--container-*` theme vars exactly like
breakpoints. Use `@min-[475px]`/`@max-[960px]` for arbitrary one-offs and stack
`@sm:@max-md:` for a range. This is the right tool for a component library shared
between a full-width hero and a narrower "related services" rail — reach for it
instead of duplicating a component with different responsive props per context.

## 6. Avoiding utility-class soup in section components

Symptoms of soup: a `<div>` with 25+ classes mixing layout, spacing, color, typography,
and one-off arbitrary values, repeated with slight drift across 8 section files.

**Fixes, in order of preference**:

1. **Extract semantic tokens first** (Section 2) so sections reference `bg-surface`,
   `text-hero`, `py-section` instead of raw scale values — this alone kills most
   arbitrary-value sprawl.

2. **`@layer components` for truly repeated structural patterns** — but per the v4
   docs, reach for this less than you think; most "component classes" in a marketing
   site are one section design used once. Reserve it for genuinely reused atoms:
   ```css
   @layer components {
     .btn-primary {
       @apply inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3
              text-sm font-medium text-white transition-colors hover:bg-brand-600;
     }
   }
   ```
   `@apply` still works in v4 for this kind of consolidation; use it sparingly (it
   reintroduces a specificity/indirection layer you have to remember exists).

3. **Component-level composition in React, not CSS** — for a Next.js marketing site
   this beats `@apply` most of the time. Build a small `<Section>`, `<Container>`,
   `<Eyebrow>`, `<Heading>` set of primitives that hardcode the token classes once;
   page sections then compose primitives instead of raw `div`s with long class
   strings:
   ```tsx
   <Section tone="dark" grain>
     <Container>
       <Heading as="h2" size="display">Our approach</Heading>
     </Container>
   </Section>
   ```
   This keeps Tailwind classes centralized in ~10 primitive files instead of smeared
   across 30 section files, without paying `@apply`'s indirection cost.

4. **`cva` (class-variance-authority) + `tailwind-merge`/`cn()` helper** for
   primitives with variants (button intents, card elevations, badge tones) — standard
   in the Next.js/Tailwind ecosystem, keeps variant logic typed and out of JSX:
   ```ts
   const button = cva("inline-flex items-center rounded-full transition-colors", {
     variants: {
       intent: { primary: "bg-accent text-white", ghost: "bg-transparent text-ink-900" },
       size: { sm: "px-4 py-2 text-sm", lg: "px-8 py-4 text-base" },
     },
   });
   ```

5. **Sort/lint classes** with `prettier-plugin-tailwindcss` so long class strings stay
   in a consistent, scannable order even when you can't shorten them further.

## 7. When to drop to plain CSS

Tailwind utilities are the wrong tool once you're orchestrating:

- **Multi-keyframe or physics-driven animation timelines** — GSAP timelines, Motion
  `useScroll`-driven transforms, or anything with >2-3 interpolated properties over a
  scroll range. Write the animation logic in JS/CSS keyframes and use Tailwind only
  for static layout/spacing around it. Trying to express a 6-step scroll-scrubbed
  reveal as stacked utility variants is unreadable and fights the animation library's
  own state management.

- **`@keyframes` for anything beyond simple looped effects** (spin, pulse, marquee):
  define them inside `@theme` via `--animate-*` + a nested `@keyframes` block so they
  become a real Tailwind utility (`animate-marquee`) — good for simple, reusable,
  non-parametric loops. Once timing needs to vary per-instance or respond to
  scroll/pointer state, move to inline `style` bound to a CSS variable, or to
  Motion/GSAP directly.

- **Complex selectors**: sibling combinators, `:has()`, custom pseudo-element chains
  for decorative effects (custom cursors, multi-layer glow/blur stacks, SVG filter
  pipelines beyond the grain trick above). Arbitrary-property utilities
  (`[mask-type:luminance]`) work for one-offs, but past 2-3 chained arbitrary
  properties, a plain `.hero-glow { ... }` class in a component-scoped CSS file (or
  CSS Module) is more maintainable and easier to diff in review.

- **Three.js/R3F canvas styling**: canvas contents aren't reachable by Tailwind at
  all — shader uniforms and material colors should still *pull from* the same design
  tokens (read `--color-accent` via `getComputedStyle` or duplicate the value as a JS
  constant generated from the same source), but the actual scene styling is plain
  JS/GLSL, not utilities. Keep a single source of truth (e.g. a `tokens.ts` that
  mirrors critical `@theme` colors as JS hex/vec3 for shader uniforms) rather than
  hardcoding colors twice with drift risk.

- **Print stylesheets, email templates, or anything needing static, cascade-free CSS**
  — outside Tailwind's sweet spot regardless of version.

**Rule of thumb**: if a style decision needs a variable that changes over time (per
frame, per scroll position, per pointer position) rather than per state/breakpoint,
it belongs in JS-driven inline styles or a plain CSS file with custom properties —
Tailwind utilities are for discrete, cacheable class combinations, not continuous
values.

## Sources
- https://tailwindcss.com/docs/theme
- https://tailwindcss.com/docs/upgrade-guide
- https://tailwindcss.com/docs/adding-custom-styles
- https://tailwindcss.com/docs/responsive-design
- https://github.com/Liam-McKenna04/tailwindcss-noise
- https://ibelick.com/blog/create-grainy-backgrounds-with-css
- https://tomodahinata.com/en/blog/tailwind-css-v4-css-first-design-tokens-production-guide
