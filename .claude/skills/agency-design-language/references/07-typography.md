# Typography Systems & Kinetic Text for Premium Agency Sites

Stack: Next.js 15 App Router + Tailwind + Motion (Framer Motion) + R3F. No paid GSAP plugins (no SplitText Club plugin).

## 1. Font pairing strategy — grotesque/serif combos that read "premium agency"

The 2026 premium-agency look leans on: (a) an expressive/idiosyncratic display face for oversized headlines, (b) a neutral, highly-legible grotesque for UI/body, and increasingly (c) an inverted sans-over-serif or serif-display pairing to avoid the generic "SaaS Inter everywhere" look. All picks below are free on Google Fonts (self-hostable via `next/font/google`, zero runtime request to Google).

**Recommended pairing (primary pick for this build):**
- Display/headline: **Fraunces** (variable serif, axes: `wght` 100–900, `opsz` 9–144, `SOFT` 0–100, `WONK` 0–1) — editorial, warm, slightly eccentric at high optical size; push `opsz` low + `WONK` on for a distinctive wordmark feel, push `opsz` high + `SOFT` low for clean editorial headlines.
- Body/UI: **Inter** (variable, `wght` 100–900, `opsz` 14–32) — the safest, most legible neutral grotesque; use tabular nums for stats.
- Alternative body if Inter feels too "SaaS default": **Geist** (Vercel's variable grotesque, free, feels more contemporary/agency than Inter) or **General Sans** (via Fontshare, not Google Fonts but free+self-hostable).

**Alternative pairings (pick ONE system, don't mix multiple display faces):**
- **Instrument Serif + Inter** — Instrument Serif is a high-contrast display serif (headers/hero only, it has no weight range — regular/italic only) reading as luxury/editorial; pair with Inter body. Very 2026 "quiet luxury" feel.
- **Bricolage Grotesque + Fraunces** — Bricolage as the grotesque display (variable, has `opsz` axis giving it hand-touched irregularity at large sizes) with Fraunces as a secondary serif accent (pull quotes, "About" sections). Reads as lifestyle-magazine-modern, less corporate.
- **Libre Franklin + Lora** or **Archivo + Lora** — sans headline over serif body (inverted editorial), sturdy/confident, good for a more "consultancy" than "creative studio" tone.
- **Space Grotesk + Inter** — default modern-tech pairing if the agency skews product/tech (Space Grotesk has quirky terminals for headline personality; keep it OUT of body copy, it gets fatiguing under ~24px).

**Rule of thumb:** never combine two grotesques (they fight for the same job) and never combine two loud display serifs. One expressive face, one workhorse face. Reserve the expressive face for ≥48px sizes; below that everything should degrade to the grotesque.

## 2. Free Google Fonts alternatives to expensive paid faces

Agencies commonly reference paid faces like PP Neue Montreal, PP Editorial New/Suisse Int'l, ABC Diatype, GT Walsheim in their pitch decks — here's what to substitute so you stay license-clean:

| Paid reference | Free Google Fonts substitute | Similarity notes |
|---|---|---|
| PP Neue Montreal | **Inter** (~88% match, safest), **Geist** (~85%, more character), **Space Grotesk** (~78%, more personality in headlines) | Inter for body, Space Grotesk/Geist for display |
| PP Editorial New / Suisse Int'l Editorial | **Fraunces** (low opsz, low SOFT) or **Instrument Serif** | Both give the tall, high-contrast editorial serif look |
| ABC Diatype / GT Walsheim | **DM Sans** (variable, `opsz` 9–40, `wght` 100–1000 — widest weight range on a 2-axis file) or **Plus Jakarta Sans** | Geometric-humanist, rounds well at UI sizes |
| Söhne / Neue Haas Grotesk | **Work Sans** or **Archivo** | Archivo also ships a wide-width axis for oversized headline treatments |

Use [fontalternatives.com](https://fontalternatives.com) or Typewolf's Google Fonts list when you need to match a specific reference deck.

## 3. Fluid type scale with `clamp()`

Core formula (linear interpolation between a min viewport/font-size pair and a max viewport/font-size pair):

```
slope = (maxSize - minSize) / (maxViewport - minViewport)
intercept = minSize - slope * minViewport
preferred = intercept + slope * 100vw   // in vw units
font-size: clamp(minSize, preferred, maxSize)
```

Practical scale (base 16px, viewport range 375px–1600px, scale ratio ~1.25–1.333 at desktop, tighter at mobile so headlines don't overwhelm small screens). Values in rem (1rem=16px):

```css
:root {
  /* step -1: captions/labels */
  --fs--1: clamp(0.75rem, 0.72rem + 0.15vw, 0.875rem);
  /* step 0: body */
  --fs-0: clamp(1rem, 0.96rem + 0.2vw, 1.125rem);
  /* step 1: lead paragraph */
  --fs-1: clamp(1.125rem, 1.05rem + 0.375vw, 1.375rem);
  /* step 2: h4/subhead */
  --fs-2: clamp(1.375rem, 1.2rem + 0.875vw, 1.875rem);
  /* step 3: h3 */
  --fs-3: clamp(1.75rem, 1.4rem + 1.75vw, 2.75rem);
  /* step 4: h2 */
  --fs-4: clamp(2.25rem, 1.6rem + 3.25vw, 4rem);
  /* step 5: h1 / section headline */
  --fs-5: clamp(2.75rem, 1.6rem + 5.75vw, 6rem);
  /* step 6: hero display (oversized) */
  --fs-6: clamp(3.5rem, 1rem + 12vw, 10rem);
  /* step 7: mega hero, single word/short phrase only */
  --fs-7: clamp(4rem, 0rem + 18vw, 16rem);
}
```

**Wire into Tailwind** (v4 `@theme` or v3 `tailwind.config`):
```css
@theme {
  --font-size-fluid-xs: clamp(0.75rem, 0.72rem + 0.15vw, 0.875rem);
  --font-size-fluid-h1: clamp(2.75rem, 1.6rem + 5.75vw, 6rem);
  --font-size-fluid-display: clamp(3.5rem, 1rem + 12vw, 10rem);
  --font-size-fluid-mega: clamp(4rem, 0rem + 18vw, 16rem);
}
```
Then use `text-fluid-display` etc. as normal Tailwind utilities — no breakpoint jumps, scales continuously.

**Gotchas:**
- Never use raw `vw` alone for font-size (breaks user browser zoom / accessibility text-resize) — always wrap in `clamp()` with a rem-based min/max so it respects OS/browser font-size preferences.
- Use `rem` for the min/max bounds, `vw` only in the preferred/middle term.
- Pair fluid font-size with fluid `line-height` (unitless, e.g. 0.95–1.05 for oversized display, 1.5–1.6 for body) and fluid `letter-spacing` (tighten tracking as size increases: `letter-spacing: clamp(-0.03em, ..., -0.01em)` for large display type).
- Generators to hand-tune values fast: clampgen.com, fwdtools.com/css-clamp-generator, csstools.io/fluid-typography, or Utopia.fyi (industry-standard fluid scale calculator, not found in this search pass but well known — worth checking directly).

## 4. Oversized display type (2026 trend notes)

- Type-as-hero-image is the dominant 2026 pattern: large-scale headline fills the viewport in place of a stock photo, using `--fs-7`/`--fs-6` scale above (10–16rem clamp ceiling). Works especially well combined with a subtle grain/noise overlay or a thin R3F particle field behind the text (see r3f-portfolio-3d skill) rather than a photo.
- Keep oversized headlines to 2–5 words max; anything longer breaks the "headline as design element" effect and just becomes hard to read.
- Tighten `letter-spacing` aggressively at these sizes (`-0.02em` to `-0.05em`) since default tracking looks loose/amateurish above ~96px.
- Use `text-wrap: balance` (or `pretty`) on headline elements — native CSS, no JS needed, prevents orphan words on oversized multi-line headlines. Supported in all evergreen browsers as of 2025+.
- Mix weight within one headline for hierarchy (e.g., "We build **brands**" — bold on the emphasis word, regular elsewhere) using variable font `wght` axis rather than swapping families.

## 5. Text reveal animations — no paid GSAP plugins

Three implementation tiers depending on how much you want to hand-roll vs. use Motion's utility.

### A. Motion (Framer Motion) `splitText()` — requires Motion+ (paid add-on)
Motion.dev ships a first-party `splitText()` returning `{ chars, words, lines }` arrays that are just DOM elements, animatable with `animate()`/`stagger()`:
```js
import { splitText, animate, stagger } from "motion"

document.fonts.ready.then(() => {
  const { chars } = splitText("h1")
  animate(chars, { opacity: [0, 1], y: [10, 0] }, { duration: 0.6, delay: stagger(0.03) })
})
```
Note: `splitText` itself is a **Motion+ (paid) feature** — small one-time cost, not a subscription, but if avoiding all paid deps, skip this and use approach B or C.

### B. Hand-rolled split + Framer Motion `staggerChildren` (fully free, recommended default)
Split text into words/chars yourself in React (simple `.split(" ")` or a grapheme-aware split for chars), wrap each in a `motion.span`, animate with variants:
```jsx
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
}
const child = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: "0%", opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

function RevealText({ text }) {
  return (
    <motion.span variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.6 }} style={{ display: "inline-block" }}>
      {text.split(" ").map((word, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden" }}>
          <motion.span variants={child} style={{ display: "inline-block" }}>
            {word + " "}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
```
Key trick for the classic **line-mask reveal** (text slides up "from behind a curtain"): the OUTER span has `overflow: hidden`, the INNER motion.span is what translates from `y: 100%` → `0%`. This clips the slide so it looks like the text emerges from a mask edge rather than just fading/sliding over other content. Apply this per-word for a "words rise from baseline" effect, or per-line (wrap each rendered line, requires measuring line breaks — trickier with wrapping text, easiest when you control line breaks manually with `<br/>` in short headlines).

For **character-level stagger**, same pattern but split `word` into `[...word]` (spread operator handles most Unicode graphemes correctly, safer than `.split("")` for accented chars/emoji) and reduce stagger interval to ~0.015–0.025s so it doesn't feel sluggish.

### C. CSS-only reveal (no JS animation library, cheapest, good for reduced-motion fallback)
```css
.line-mask { overflow: hidden; display: block; }
.line-mask > span {
  display: inline-block;
  transform: translateY(110%);
  animation: reveal 0.8s cubic-bezier(0.16,1,0.3,1) forwards;
  animation-delay: calc(var(--i) * 60ms);
}
@keyframes reveal { to { transform: translateY(0); } }
```
Trigger via IntersectionObserver adding a class, or Tailwind's `animate-*` utilities gated behind a `data-inview` attribute toggled by a small custom hook (`useInView` from Motion is free/lightweight and doesn't require Motion+).

### D. Scroll-scrubbed reveal (headline "writes on" as you scroll)
Use Motion's `useScroll` + `useTransform` (free, core library) to drive per-character/word opacity based on scroll progress instead of a single whileInView trigger — gives the "words light up as you scroll past" effect common in agency case-study pages:
```jsx
const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.25"] })
// map each word's opacity to a slice of scrollYProgress via useTransform, offset per word index
```

**Accessibility note for all approaches:** wrap the whole reveal system in `useReducedMotion()` (Motion hook, free) and fall back to a simple opacity fade or no animation at all — required for `prefers-reduced-motion`, and also protects against layout-shift complaints from Lighthouse/CLS if `translateY` isn't contained by `overflow: hidden` on the mask wrapper.

## 6. Variable fonts — what to actually use and why

- **556 of ~1,944 Google Fonts are now variable** (2026 count). Prefer variable over static-weight families whenever available — one file replaces 4–9 static weight files, meaningfully reduces font payload and layout shift from weight-swap.
- Standard OpenType axes: `wght` (weight), `wdth` (width), `ital` (italic on/off), `slnt` (slant), `opsz` (optical size — adjusts stroke contrast/proportions for the size it'll be displayed at, not just scaling).
- **High-value variable picks for an agency build:**
  - **Fraunces** — 4 axes (`wght`, `opsz`, `SOFT`, `WONK`), best-in-class for expressive display serif work; animate `wght` or `opsz` on hover/scroll for a genuinely unique kinetic effect no static font can do.
  - **Roboto Flex** — 13 axes (most in the Google library) if you want to get experimental with grade/width morphing.
  - **DM Sans** — `opsz` 9–40 + `wght` 100–1000, excellent single-file replacement for a whole weight family in UI contexts.
  - **Inter** — `opsz` 14–32 + `wght` 100–900, the safe universal default for body/UI.
- **Kinetic use of variable axes (differentiator, cheap to implement):** animate `font-variation-settings` directly with Motion instead of animating between discrete font files — e.g. hover on a nav link morphs `wght` from 400→700 smoothly, or scroll-link `opsz`/`wght` on the hero headline for a "typeface breathing" effect. This is something almost no template does and reads as genuinely premium/technical craft.
```jsx
<motion.h1
  style={{ fontVariationSettings: useTransform(scrollYProgress, [0, 1], ['"wght" 300', '"wght" 800']) }}
>
```
Note: for this to animate smoothly you generally need to hand off `font-variation-settings` as a motion value (Motion supports animating this CSS property natively) rather than relying on `next/font`'s generated CSS var alone.

## 7. `next/font` setup (Next.js 15 App Router)

**Google Fonts, variable, multiple families, CSS-variable strategy (recommended for multi-font systems):**
```ts
// app/fonts.ts
import { Fraunces, Inter } from "next/font/google"

export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"], // opt into non-default variable axes
})

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})
```
```tsx
// app/layout.tsx
import { fraunces, inter } from "./fonts"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```
```css
/* tailwind config or globals.css */
@theme {
  --font-display: var(--font-display), serif;
  --font-body: var(--font-body), sans-serif;
}
```
Then `font-display` / `font-body` become Tailwind utility classes.

**Key facts:**
- Google Fonts via `next/font/google` are downloaded at BUILD time and self-hosted from your own domain — zero runtime request to Google, no layout shift from external font loading, GDPR-friendly (no third-party request to Google servers at runtime).
- For variable fonts you do NOT need to specify `weight` — omit it and the full variable range ships in one file. Only specify `weight: ["400","700"]` array if using a static (non-variable) family.
- `axes` option lets you pull in non-default variable axes (e.g. Fraunces' `SOFT`/`WONK`, Inter's `opsz`) that aren't included by default — check each font's available axes on the Google Fonts variable font page before assuming they're bundled.
- Use `variable` (CSS custom property) strategy over `className` when managing 2+ fonts — keeps font application explicit in CSS/Tailwind rather than fighting specificity from a className applied at the root.
- `display: "swap"` avoids invisible-text flash; pair with `adjustFontFallback: true` (default) so Next.js auto-generates a metric-matched fallback font to minimize CLS during swap.
- **Local/custom fonts** (e.g. a licensed paid variable font, or self-hosted Fontshare file): use `next/font/local`, and for variable font files pass `src` as a single string (not an array of weight objects):
```ts
import localFont from "next/font/local"
const customDisplay = localFont({
  src: "./fonts/CustomVariable.woff2",
  variable: "--font-display",
  display: "swap",
})
```
- Centralize all font definitions in one `app/fonts.ts` file imported only in `layout.tsx` — keeps the font system a single source of truth as the project grows.

## Sources

- [30 Google Font Pairings To Use In 2026](https://www.thebrief.ai/blog/google-font-pairings/)
- [Best Google Font Pairings for Websites (2026)](https://madegooddesigns.com/best-google-font-pairings/)
- [Free Alternatives to Neue Montreal for Branding](https://fontalternatives.com/alternatives/neue-montreal/for/branding/)
- [Free Alternatives to Neue Montreal for UI Design](https://fontalternatives.com/alternatives/neue-montreal/for/ui/)
- [Free Online Clamp Calculator: Fluid CSS Typography (2026)](https://madegooddesigns.com/tools/clamp-calculator/)
- [CSS Clamp Generator — Fluid Typography & Type Scale](https://fwdtools.com/css-clamp-generator/)
- [CSS Clamp Generator — Fluid Typography & Font Scale](https://csstools.io/fluid-typography)
- [CSS Clamp Generator: Fluid Typography & Spacing Calculator](https://clampgen.com/)
- [Motion.dev splitText docs](https://motion.dev/docs/split-text)
- [How to use a mask to animate HTML text when in view (React/Framer Motion/Next.js)](https://blog.olivierlarose.com/tutorials/text-mask-animation)
- [How to Animate a Text Reveal Effect in React with Framer Motion](https://brad-carter.medium.com/how-to-animate-a-text-reveal-effect-in-react-with-framer-motion-ae8ddd296f0d)
- [Making Stagger Reveal Animations for Text (Codrops)](https://tympanus.net/codrops/2020/06/17/making-stagger-reveal-animations-for-text/)
- [Web design trends for 2026: kinetic type, broken grids](https://elements.envato.com/learn/web-design-trends)
- [Getting the Most Out of Variable Fonts on Google Fonts (CSS-Tricks)](https://css-tricks.com/getting-the-most-out-of-variable-fonts-on-google-fonts/)
- [Best Variable Fonts on Google Fonts in 2026 — FontFYI](https://fontfyi.com/blog/best-variable-fonts/)
- [2026 Typography Trend: Variable Fonts as Brand Systems](https://fontalternatives.com/blog/variable-fonts-brand-systems-2026/)
- [Bricolage Grotesque and Fraunces Font Pairing](https://www.jukeboxprint.com/fonts/font-pairing/bricolage-grotesque-and-fraunces)
- [The 40 Best Google Fonts—Typewolf](https://www.typewolf.com/google-fonts)
- [Fraunces Font: Free Download, Examples & Pairings](https://maxibestof.one/typefaces/fraunces)
- [Components: Font — Next.js docs](https://nextjs.org/docs/pages/api-reference/components/font)
- [Implement Local & Google Fonts in Next.js (The Right way)](https://medium.com/@muqorrobin/implement-local-google-fonts-in-next-js-the-right-way-a-practical-pattern-guide-529ffbed517a)
- [Next.js font optimization: Adding custom and Google fonts — LogRocket](https://blog.logrocket.com/next-js-font-optimization-custom-google-fonts/)
