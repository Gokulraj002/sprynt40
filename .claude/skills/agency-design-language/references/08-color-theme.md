# Color, Gradients & Theme Systems — Premium Agency Sites

## 1. Dark-first vs light-first: which to pick

Premium digital agency sites skew **dark-first** (~65-70% of Awwwards SOTD "agency" category) because dark backgrounds make saturated accent colors, video reels, and WebGL/particle work read as more cinematic and let motion (cursor glow, gradient blobs, grain) do more visible work. Light-first sites (Obys's newer site, Pentagram, Work & Co) read as more "editorial/print" and lean on typography and whitespace instead of atmosphere.

**Decision heuristic for an agency site:**
- Dark-first if the story is "technical/cinematic/futuristic" (dev shops, AI/product studios, motion-heavy reels) — e.g. Locomotive, Active Theory, Resn, Jam3, Fantasy, Basic Agency, Zajno.
- Light-first if the story is "editorial/craft/strategy-led" — e.g. Pentagram, Work & Co, Instrument (light sections), Ueno (bright, saturated light).
- **Hybrid (best of both, and the current dominant pattern for 2025-2026 award sites):** near-black hero that gives way to a light or off-white content body, then dark again in the footer — this is the "theme switching on scroll" pattern (see §5). This lets you have cinematic hero impact AND readable, accessible long-form content.

## 2. Base neutral palettes (hex values)

Never use pure `#000000` / `#FFFFFF` as your primary surface — both are harsh and flatten depth (grain and gradients look muddier against true black, and true white bloats perceived contrast/glare). Premium sites use *near*-black and *near*-white surfaces with a warm or cool tint that matches the brand accent.

**Dark-first neutral ramp (cool, tech-leaning):**
```
--bg-void:      #0a0a0c   /* page background, deepest */
--bg-surface:   #121214   /* card / panel base (~Material's #121212 idea) */
--bg-elevated:  #1a1a1e   /* raised surface: nav, modals */
--bg-elevated-2:#242428   /* hover / active state on elevated surface */
--border-subtle:#2a2a30
--text-primary: #f5f5f2   /* off-white, not #fff */
--text-secondary:#a1a1aa
--text-muted:   #6b6b74
```

**Dark-first neutral ramp (warm, editorial/luxury-leaning):**
```
--bg-void:      #0c0a08
--bg-surface:   #16130f
--bg-elevated:  #211c16
--text-primary: #f2ede4   /* warm off-white / bone */
--text-secondary:#b5ac9e
```

**Light-first neutral ramp (avoid pure white):**
```
--bg-page:      #faf9f6   /* warm paper white */
--bg-card:      #ffffff
--bg-sunken:    #f0efe9   /* section band, subtle contrast */
--text-primary: #14140f   /* near-black, not #000 */
--text-secondary:#57564d
--border-subtle:#e5e3da
```

Rule of thumb from Material/Apple dark-UI guidance: **elevation = lightness**, not shadow. On dark backgrounds, a "raised" card gets a *lighter* fill (e.g. `#1a1a1e` → `#242428`), because box-shadows barely read on dark backgrounds. On light backgrounds, elevation still uses soft shadow + a barely-lighter/whiter fill.

## 3. Accent color strategy

Winning pattern across agency sites: **one neutral system + exactly one saturated accent**, used sparingly (CTA buttons, active nav state, link hover, cursor glow, a single gradient stop, form focus rings). Two accents max if one is a true complementary/secondary used only for gradients.

Approximate 60/30/10 split: 60% base neutral, 30% secondary neutral/tint, 10% accent. On a dark agency site this often becomes ~90% near-black/off-white, ~8% mid-gray, ~2% accent — the accent should feel *rare and expensive*, not decorative everywhere.

**Example accent hexes actually used in this genre (representative, not scraped brand-exact):**
- Electric lime/acid green on black — `#c9ff3d` / `#d4ff5e` (common in dev-agency and "hacker-chic" studios)
- Signal orange — `#ff5a1f` / `#ff6b35` (Basic Agency, Resn-adjacent)
- Cobalt/electric blue — `#3d5afe` / `#4d7cff` (tech/product studios, Linear-esque)
- Hot coral/pink — `#ff3d71` / `#f4709c` (Obys-adjacent palettes)
- Signature deep purple/violet — `#7928ca` / `#6d28d9` (Stripe/Vercel-gradient lineage)
- Warm gold/brass on cream — `#b08d57` (luxury/consulting-agency positioning)

Pick ONE, derive a 3-step tint/shade ramp from it (`accent-300/500/700`) for hover/active/disabled states, and use OKLCH or HSL so you can programmatically lighten/darken without muddying hue — e.g. `oklch(70% 0.19 150)` for the lime above. Tailwind v4's color system is OKLCH-native, so defining accents in OKLCH keeps interpolated/animated gradients (see §4) perceptually smooth instead of passing through gray in the middle like RGB lerp does.

## 4. Mesh / animated gradients

**Why mesh gradients dominate 2025-2026 agency heroes:** they read as premium/organic (vs. a flat linear-gradient "SaaS blob"), work as a full-bleed background behind text without competing for attention, and can be built with zero images (pure CSS or a tiny WebGL shader).

**Technique A — CSS multi-radial-gradient mesh (cheapest, no JS):**
```css
.mesh-hero {
  background-color: #0a0a0c;
  background-image:
    radial-gradient(at 20% 20%, #7928ca66 0px, transparent 50%),
    radial-gradient(at 80% 10%, #3d5afe55 0px, transparent 50%),
    radial-gradient(at 50% 80%, #ff3d7144 0px, transparent 50%);
  filter: blur(60px) saturate(140%);
}
```
Animate by moving the `at X% Y%` positions with a `background-position`-style CSS custom-property animation (Houdini `@property` for typed interpolation), or by animating `transform: translate()` on absolutely-positioned blurred `<div>` blobs instead of the gradient itself — background-image values can't be interpolated by the browser, so **animate a proxy** (position, transform, opacity, hue-rotate filter) not the gradient syntax directly.

**Technique B — blurred blob divs (most common in production, easiest to make "alive"):**
3-5 absolutely positioned `div`s, each `border-radius: 50%`, `filter: blur(80-120px)`, one accent color each at 30-50% opacity, animated with Motion/GSAP on independent slow loops (15-30s, `ease: "linear"` or noisy easing) via `x`, `y`, `scale`. This is what Stripe, Linear-adjacent sites, and most "gradient mesh hero" agency sites actually ship — cheaper than WebGL, GPU-accelerated (transform/opacity only), and trivially made to react to scroll or cursor position.

**Technique C — WebGL/shader mesh gradient (for R3F-heavy sites):** a fullscreen plane with a fragment shader doing simplex/Perlin noise domain-warping between 3-4 accent colors (`mix()` chains), animated via `uTime` uniform. Gives the smoothest, most "liquid" look and lets you tie color to scroll progress or audio/cursor. Reference: Stripe's open-sourced `mesh-gradient` WebGL package category; also the general technique behind hypercolor.dev's mesh generator (can export usable gradient stop configs to skip building the tool yourself).

**Practical guidance:** keep mesh gradients to the hero (and maybe footer) — using them as full-page backgrounds fights the theme-switch pattern in §5 and hurts text contrast in content sections. Always render mesh gradients in a layer *behind* a subtle noise texture (§ below) or the colors band/banding-artifact on large 4K/OLED screens.

## 5. Noise / grain texture — why and how

Flat gradients (mesh or linear) show visible color banding on modern displays, especially dark-to-dark or pastel transitions. A 2-5% opacity noise/grain overlay eliminates banding, adds tactile/filmic depth, and is now close to a *default* expectation on award-tier hero sections.

**Technique — inline SVG `feTurbulence` (no image asset, scales infinitely, near-zero KB):**
```html
<svg style="position:fixed; inset:0; width:0; height:0;">
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0" />
  </filter>
</svg>
```
```css
.grain-overlay {
  position: fixed; inset: 0; pointer-events: none; z-index: 50;
  filter: url(#grain);
  opacity: 0.045;              /* 3-6% is the sweet spot */
  mix-blend-mode: overlay;     /* or "soft-light" for subtler result */
}
```
Alternative (simpler, GPU-cheap, no SVG filter cost): a small tiled base64 PNG/webp noise texture (64×64) set as `background-image` with `background-repeat: repeat`, animated by jittering `background-position` on a `requestAnimationFrame`/CSS-steps loop for a true "film grain flicker" — this is lighter on paint cost than an SVG filter recalculated every frame, and is what most production agency sites actually use for perf reasons. Generators: fffuel.co/nnnoise (free SVG noise export), or CSS-Tricks' "Grainy Gradients" technique layering a noise PNG under a gradient with `background-blend-mode: overlay`.

**Rule:** put the grain layer as a single fixed, full-viewport overlay div at the top of your DOM (highest z-index, `pointer-events:none`), not per-section — one grain layer for the whole page keeps it consistent and cheap (one paint layer instead of N).

## 6. Section theme-switching on scroll (dark hero → light content → dark footer)

This is the single most distinctive "premium agency" color technique right now — it signals intentional art direction rather than a static template.

**Pattern A — CSS-only via `background` on each `<section>` + native smooth scroll:** simplest, but the transition between sections is a hard cut unless you add a gradient-blend seam (`::after` pseudo-element with a gradient from section-A's color to section-B's color, positioned at the boundary, ~100-200px tall).

**Pattern B — data-attribute theme switching driven by IntersectionObserver (most common in production Next.js sites):**
```tsx
// each <section data-theme="dark" | "light"> in the page
useEffect(() => {
  const sections = document.querySelectorAll('[data-theme]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document.documentElement.setAttribute(
            'data-page-theme',
            entry.target.getAttribute('data-theme')!
          );
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px' } // trigger when section crosses viewport center
  );
  sections.forEach((s) => observer.observe(s));
  return () => observer.disconnect();
}, []);
```
Then a fixed nav/cursor/logo reads `[data-page-theme="dark"] .nav { color: var(--text-on-dark) }` etc., transitioning via `transition: color 400ms ease, background-color 400ms ease`. This is cheaper than scroll-linked interpolation and avoids jank because it only fires on section boundary crossings, not every scroll frame.

**Pattern C — continuous scroll-linked color interpolation (Framer Motion / Motion for React):** for the hero-to-first-section seam specifically (not the whole page — too expensive/jittery for many sections):
```tsx
const { scrollYProgress } = useScroll({ target: heroRef, offset: ["end end", "end start"] });
const bg = useTransform(scrollYProgress, [0, 1], ["#0a0a0c", "#faf9f6"]);
const color = useTransform(scrollYProgress, [0, 1], ["#f5f5f2", "#14140f"]);
return <motion.section style={{ backgroundColor: bg, color }}>...</motion.section>;
```
Use `useMotionTemplate`/OKLCH-aware interpolation or `mix()` if colors pass through a muddy midpoint in plain hex/RGB lerp — Motion interpolates RGB by default, so a black→white transition briefly looks gray, which is usually fine for background but can look off for accent colors; specify explicit intermediate stops if it matters.

**Pattern D — clip-path/sticky "curtain reveal":** the outgoing (dark) section stays `position: sticky` at `top:0` while the incoming (light) section scrolls up over it with a `border-radius` on its top edge (rounded "page turn" look) — popularized by agency sites like Locomotive/Dogstudio-style work and easily built with `position: sticky` + `z-index` stacking, no JS required for the base effect, JS only needed for the rounded-corner scale animation.

**Nav/cursor contrast handling:** whatever pattern you use, the fixed header/logo/custom-cursor must invert with the section theme — either swap a `mix-blend-mode: difference` (auto-inverts against any background, zero JS, but can look muddy on mid-tone gradients) or explicitly swap the token via the `data-page-theme` attribute above (predictable, preferred for a logo/wordmark that must stay on-brand).

## 7. Tailwind + CSS variable token setup (Tailwind v4)

Tailwind v4 is CSS-first: define raw palette + semantic tokens as native CSS variables, remap per theme, and reference them via `@theme` so `bg-surface`, `text-primary` etc. become real utilities.

```css
/* globals.css */
@import "tailwindcss";

@theme {
  /* raw palette - rarely used directly in markup */
  --color-accent-300: oklch(85% 0.15 150);
  --color-accent-500: oklch(70% 0.19 150);
  --color-accent-700: oklch(50% 0.17 150);
}

:root {
  /* semantic tokens - default (dark) theme */
  --bg-void: #0a0a0c;
  --bg-surface: #121214;
  --bg-elevated: #1a1a1e;
  --text-primary: #f5f5f2;
  --text-secondary: #a1a1aa;
  --border-subtle: #2a2a30;
}

[data-page-theme="light"] {
  --bg-void: #faf9f6;
  --bg-surface: #ffffff;
  --bg-elevated: #f0efe9;
  --text-primary: #14140f;
  --text-secondary: #57564d;
  --border-subtle: #e5e3da;
}

@theme inline {
  /* map semantic vars into Tailwind utilities: bg-void, text-primary, etc. */
  --color-void: var(--bg-void);
  --color-surface: var(--bg-surface);
  --color-elevated: var(--bg-elevated);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-border-subtle: var(--border-subtle);
}
```
**Critical caveat (confirmed via Tailwind v4 discussions):** if you bake color values directly with `@theme` (non-`inline`), they're resolved at build time and won't react to a runtime `[data-page-theme]`/`.dark` class swap. The fix is exactly the two-stage pattern above: raw/semantic values live in plain `:root` / `[data-page-theme="..."]` selectors (real CSS custom properties, mutable at runtime), and a separate `@theme inline { --color-x: var(--x) }` block just aliases them into Tailwind's utility-generation system. Then `bg-void`, `text-primary`, `border-border-subtle` work as normal Tailwind classes but actually respond to the runtime attribute/class toggle — this is what makes `next-themes` (class-based) or the IntersectionObserver `data-page-theme` pattern from §6 work with Tailwind utilities instead of fighting them.

For light/dark via OS preference as a fallback (not just scroll-driven), wrap the light overrides in `@media (prefers-color-scheme: light)` guarded by `:root:not([data-page-theme])` so an explicit scroll-driven or user-toggled theme always wins over system preference.

## 8. Contrast & accessibility checklist

- **WCAG AA minimum:** 4.5:1 for body text, 3:1 for large text (≥18pt / ≥14pt bold) and UI component borders/icons. AAA (7:1) is worth targeting for primary body copy on a content-heavy agency site since it costs little visually once neutrals are tuned.
- **Dark mode is not exempt:** offering a dark theme does not itself satisfy contrast SC 1.4.3 — every text/background pair in *both* themes must independently pass. Check both `data-page-theme="dark"` and `="light"` states, not just one.
- **Never place body text directly on an animated mesh gradient or grain layer** — always composite through a semi-opaque scrim (`bg-black/40` dark or `bg-white/70` light) or restrict gradient to areas with large display type only (which tolerates lower contrast at large sizes per WCAG's large-text carve-out).
- **Gradient text (`bg-clip-text`):** treat the *lightest* stop in the gradient as the contrast-determining color against its background — if any stop dips below 4.5:1 (or 3:1 for large/display type), add a subtle `text-shadow` or increase stop luminance rather than shipping it as-is.
- **Accent-on-accent is the most common failure:** an accent-colored button label on an accent-colored background hover state is easy to ship and easy to fail — always verify the *hover/active* state contrast too, not just default.
- **Elevation ramps must stay perceptually ordered:** in a dark UI, `bg-surface → bg-elevated → bg-elevated-2` should be monotonically increasing in lightness (L in OKLCH/HSL) so hierarchy reads correctly for low-vision users relying on luminance rather than hue.
- **Reduced motion:** all gradient animation, grain flicker, and scroll-linked color interpolation must respect `prefers-reduced-motion: reduce` — freeze grain/gradient motion to a static frame, keep only the section-boundary hard theme swap (no smooth interpolation) for that segment of users.
- Tools: use `oklch()` contrast is trickier to eyeball than sRGB — verify with WebAIM Contrast Checker or the `culori`/`colorjs.io` npm packages at build time if tokens are generated programmatically, not just by eye.

## 9. Named reference sites (for visual/pattern study)

- **Obys Agency** (obys.agency) — light-first now, but keeps a dark-to-light narrative arc across the page; strong neutral + one accent restraint.
- **Locomotive** (locomotive.ca) — dark, mesh/blob gradient hero, heavy grain, agency-of-record for the "scroll-driven cinematic" genre.
- **Active Theory** (activetheory.net) — dark, WebGL-forward, minimal accent, lets 3D do the color work.
- **Resn** (resn.co.nz) — playful saturated accents on dark, per-project theme shifts.
- **Basic Agency / Ueno-lineage studios** — bright saturated accent on light or dark base, bold single-accent restraint.
- **Fantasy** (fantasy.co), **Jam3**, **Zajno**, **Dogstudio** — dark-first, mesh/blob gradients + grain, section theme-switch patterns on scroll.
- **Stripe.com / Vercel.com / Linear.app** — not agencies but the reference implementations for mesh-gradient hero + OKLCH accent + near-black elevation ramps that agency sites borrow from.
- Browse **awwwards.com/websites/design-agencies/** directly for current Site-of-the-Day examples — the genre rotates fast, so check what's winning in the last 30-60 days rather than relying on a fixed list.

## 10. Quick build checklist

1. Pick ONE hue for the accent; derive it in OKLCH so tints/shades stay clean.
2. Build two neutral ramps (dark + light), neither pure black nor pure white.
3. Set up the two-stage Tailwind v4 token pattern (`:root`/`[data-page-theme]` raw vars + `@theme inline` aliasing) *before* writing any component so nothing hardcodes a hex.
4. Build the hero mesh gradient as 3-5 blurred blob divs (Motion-animated transform/opacity), not raw animated `background-image`.
5. Add one global fixed grain overlay div (SVG `feTurbulence` or tiled noise PNG) at 3-6% opacity, `mix-blend-mode: overlay`.
6. Wire IntersectionObserver → `data-page-theme` attribute for section-boundary theme swaps; reserve Motion `useScroll`/`useTransform` color interpolation for the single hero→first-section seam only.
7. Run every text/background pair (both themes, default + hover states) through a contrast checker; gate all gradient/grain/scroll-color motion behind `prefers-reduced-motion`.
