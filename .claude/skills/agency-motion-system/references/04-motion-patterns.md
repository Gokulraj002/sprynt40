# Motion (Framer Motion) in Next.js 15 App Router — Actionable Patterns

Source library: **Motion for React** (renamed from Framer Motion in 2024–2025). The old
`framer-motion` package still works and is API-identical, but new projects should install
`motion` and import from `motion/react`. Package: `npm install motion` (also `yarn add motion`,
`pnpm add motion`). Requires React 18.2+.

## 1. Package & import surface — pick the right entrypoint

Motion ships several import paths for React; picking the right one is the single biggest
bundle-size lever before you even touch LazyMotion.

| Import | Use case | Notes |
|---|---|---|
| `import { motion } from "motion/react"` | Standard usage in a Client Component | Full feature set, ~34kb min+gzip |
| `import * as motion from "motion/react-client"` | Server Component tree, no `"use client"` needed on the importing file | Motion internally marks itself client-only; lets you keep the *page* as a Server Component and only the animated leaf is client-boundary |
| `import * as m from "motion/react-m"` | Paired with `LazyMotion` | Ships with **no** preloaded animation features (no gestures, no layout) — smallest primitive |
| `motion` (legacy) `import { motion } from "framer-motion"` | Migrating old code | Works unchanged, swap to `motion/react` when convenient — no API changes, straight find/replace |

**Actionable rule for this project:** default every animated component to `import { motion } from "motion/react"` inside a small client wrapper, never inline `"use client"` animation logic directly in a Server Component page — see §2.

## 2. Client component boundaries in the App Router

Motion components only work in Client Components. In App Router, don't slap `"use client"`
on entire pages just to animate a hero — isolate the boundary:

```tsx
// components/motion/fade-in.tsx
"use client";
import { motion } from "motion/react";

export function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
```

```tsx
// app/page.tsx — stays a Server Component
import { FadeIn } from "@/components/motion/fade-in";

export default async function Page() {
  const data = await getData(); // server-only data fetching preserved
  return (
    <main>
      <FadeIn><h1>{data.headline}</h1></FadeIn>
    </main>
  );
}
```

Rules of thumb:
- Keep data-fetching Server Components as parents; pass server data as props into small
  `"use client"` motion wrappers — never fetch inside the animated leaf.
- Group reusable motion primitives (`FadeIn`, `StaggerList`, `RevealText`) in
  `components/motion/*` so the client boundary is centralized and auditable.
- If you truly need to avoid a `"use client"` directive at the call site (e.g. a shared UI
  kit consumed by both Server and Client Components), import from `motion/react-client`
  instead — it self-declares as a client module.

## 3. LazyMotion — cut ~85% of the animation bundle

Full `motion` component costs **~34kb** min+gzip. Using `LazyMotion` + the bare `m` component
drops the initial cost to **~4.6kb**, then loads feature packs on demand:

- `domAnimation` (+15kb): variants, exit animations, tap/hover/focus gestures — covers ~90%
  of a marketing site's needs (fades, stagger, hover states, AnimatePresence).
- `domMax` (+25kb): everything above **plus** pan/drag gestures and `layout` animations.

**Global setup** (put in a client provider near the root, e.g. `app/providers/motion-provider.tsx`):

```tsx
"use client";
import { LazyMotion, domAnimation } from "motion/react";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation} strict>{children}</LazyMotion>;
}
```

Then every animated component uses `m` instead of `motion`:

```tsx
import * as m from "motion/react-m";

<m.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} />
```

`strict` mode throws a build/runtime error if anyone accidentally imports full `motion`
inside the tree — enforce this to keep the bundle discipline as more contributors touch
the codebase.

**Defer feature loading further** (only worth it if `layout`/drag animations are rare, e.g.
a single interactive case-study page):

```tsx
const loadFeatures = () => import("./motion-features").then(res => res.default);
// motion-features.ts: export { domMax as default } from "motion/react";

<LazyMotion features={loadFeatures}>{children}</LazyMotion>
```

**Agency-site recommendation:** use `domAnimation` globally via `LazyMotion` at the root
layout. Only reach for `domMax` (or a page-scoped dynamic import) on the rare page that
needs `layout`/`layoutId` shared-element transitions (e.g. a work/case-study index →
detail transition) or drag interactions.

## 4. Variants + stagger choreography (the core "premium" pattern)

Variants are the mechanism for orchestrated, multi-element reveals — this is what makes a
hero or grid feel directed rather than "everything fades in at once."

```tsx
import * as m from "motion/react-m";
import { stagger } from "motion/react";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      delayChildren: stagger(0.08), // 80ms between each child
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

<m.ul variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }}>
  {items.map((it) => (
    <m.li key={it.id} variants={item}>{it.label}</m.li>
  ))}
</m.ul>
```

Key mechanics:
- Variants **propagate down** the tree automatically — children with matching variant keys
  (`hidden`/`visible`) inherit the parent's animation trigger; you don't manually stagger
  delays.
- `when: "beforeChildren"` / `"afterChildren"` controls whether the parent's own transition
  resolves before children start — use `"beforeChildren"` for containers that also fade/scale.
- `stagger(0.08)` (or a plain number) generates the incremental `delayChildren` — prefer this
  over hand-computing `index * 0.1` in a custom variant function.
- For per-item custom timing (e.g. reversed stagger, hover-triggered fan-out), use a
  **dynamic variant function**: `visible: (i) => ({ opacity: 1, transition: { delay: i * 0.05 } })`
  and pass `custom={index}` on each child.
- Always pair `whileInView` with `viewport={{ once: true, margin: "-100px" }}` for scroll
  reveals — `once: true` prevents re-triggering on scroll-back (jarring on agency sites with
  long scrolling pages), and a negative margin starts the animation before the element is
  fully in view for a snappier feel.

## 5. Layout animations — shared elements without manual FLIP math

```tsx
// Grid → detail shared element (e.g. work index card → case study hero image)
<m.div layoutId={`card-${project.slug}`} className="rounded-2xl overflow-hidden">
  <m.img layoutId={`card-img-${project.slug}`} src={project.thumb} />
</m.div>
```

When a component with a matching `layoutId` mounts elsewhere in the tree (e.g. after route
navigation, paired with AnimatePresence), Motion automatically tweens position/size/border-
radius between the two — no manual bounding-rect math.

Gotchas to bake into any shared component library:
- Motion animates `layout` via `transform` (translate+scale), **not** literal width/height —
  cheap on the compositor, but this means `display: inline` elements won't animate (browsers
  ignore transforms on inline boxes) — force `inline-block`/`block`/`flex`.
- Don't combine `layout` with manual `animate` on the same transform-affecting property —
  they fight. Let `layout` own position/size; use `animate` only for non-layout properties.
- Scaling can visually distort text/borders inside a `layout` element — apply `layout` to the
  affected children too, or use `style={{ transformOrigin: ... }}` correction.
- SVG elements don't support `layout` — animate `attrs` (`d`, `points`, `viewBox`) directly.
- Wrap multiple independently-updating layout components with `<LayoutGroup>` so they
  coordinate (e.g. an accordion where one panel's expansion should push siblings smoothly).
- Custom transition per layout change: `transition={{ layout: { duration: 0.3 } }}`, and for
  a curved (non-linear) shared-element path use `path: arc()` from `motion/react`.
- `domMax` (not `domAnimation`) feature set is required for `layout`/drag under LazyMotion.

## 6. AnimatePresence — exit animations & route/element transitions

React unmounts elements instantly; `AnimatePresence` intercepts that unmount to run exit
animations first.

**Structural rule (most common bug):** AnimatePresence must wrap the *conditional*, not be
wrapped by it.

```tsx
// WRONG — AnimatePresence itself gets unmounted, exit never runs
{isOpen && <AnimatePresence><Modal /></AnimatePresence>}

// RIGHT
<AnimatePresence>
  {isOpen && <Modal key="modal" exit={{ opacity: 0, scale: 0.96 }} />}
</AnimatePresence>
```

- Every direct child needs a stable, unique `key` — **never** array index (breaks exit
  animations on reorder/filter).
- `mode="sync"` (default): enter/exit animate simultaneously — use for independent elements.
- `mode="wait"`: waits for exit to finish before the entering element starts — use for single-
  slot content swaps (tab panels, testimonial carousel). Convention: `ease: "easeIn"` on exit,
  `ease: "easeOut"` on enter for a polished asymmetric feel.
- `mode="popLayout"`: exiting element is popped out of flow immediately so siblings reflow
  live — pair with `layout` on siblings for masonry/list-filter UIs (removing a card from a
  filtered grid without a layout jump).
- `initial={false}` on `AnimatePresence` suppresses the enter animation for whatever is
  already mounted on first render — use this for anything that shouldn't animate in on page
  load (e.g. a already-active tab).

**Route transitions in Next.js App Router:** the App Router has no built-in transition hook —
it unmounts/mounts route segments immediately. The working pattern combines a persistent
`layout.tsx` (holds `AnimatePresence`) with `template.tsx` (re-mounts per navigation, so it's
the thing `AnimatePresence` can detect as added/removed):

```tsx
// app/layout.tsx (Server Component is fine; AnimatePresence lives in a client child)
import { PageTransitionProvider } from "@/components/motion/page-transition-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </body>
    </html>
  );
}
```

```tsx
// components/motion/page-transition-provider.tsx
"use client";
import { AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <div key={pathname}>{children}</div>
    </AnimatePresence>
  );
}
```

```tsx
// app/template.tsx — re-invoked every navigation, gives AnimatePresence a fresh child to key on
"use client";
import { motion } from "motion/react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

Caveats to note in code comments for future maintainers: exit animations delay the old page's
unmount, which can visually double-render during the transition window — keep exit durations
short (200–350ms) on marketing sites, and test with `next/navigation`'s soft-navigation
prefetching since fast repeated nav can queue overlapping AnimatePresence cycles.

## 7. Spring configs that feel "premium"

Motion's spring accepts either physics params or duration-based params:

```tsx
// Physics-based (use when you want natural, slightly organic motion — hover states, drag release)
transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}

// Duration-based (use when you need a *predictable* time budget — page transitions, modals)
transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
```

Parameter meaning:
- `stiffness` (default 100): higher = snappier/faster settle. 300–500 reads as crisp UI
  feedback (buttons, toggles); 80–150 reads as heavier/premium (hero elements, cards).
- `damping` (default 10): higher = less oscillation. Pair high stiffness with proportionally
  higher damping to avoid a "boingy" cheap feel — ratio around `damping ≈ 2 × sqrt(stiffness × mass)`
  gives critical damping (no overshoot) if you want zero bounce.
- `mass` (default 1): higher = slower, heavier-feeling. Use <1 (e.g. 0.5–0.8) for UI chrome
  that should feel light/responsive; keep at 1 for large hero elements.
- `bounce` (0–1, default 0.25): 0 = no overshoot, ~0.15–0.25 = subtle premium settle, >0.4
  reads as playful/toy-like — avoid for agency/corporate tone, reserve for micro-interactions
  like a like-button pop.
- `visualDuration`: overrides perceived timing so "most" of the motion resolves by that time
  and any bounce happens after — use when a designer specs "should feel done in ~400ms" but
  you still want spring physics rather than a tween.

**Recommended defaults for a premium agency site:**

```ts
// lib/motion/springs.ts
export const springSnappy = { type: "spring", stiffness: 400, damping: 32, mass: 0.6 }; // buttons, cursor-follow, small UI
export const springSmooth = { type: "spring", stiffness: 120, damping: 20, mass: 1 };    // cards, panels, layout shared-elements
export const easeReveal = { duration: 0.6, ease: [0.16, 1, 0.3, 1] };                     // scroll reveals (tween, not spring)
```

Set a sitewide default via `MotionConfig` instead of repeating transition objects:

```tsx
import { MotionConfig } from "motion/react";
<MotionConfig transition={{ duration: 0.4, ease: "easeInOut" }}>
  <App />
</MotionConfig>
```

Individual component `transition` props override the `MotionConfig` default — use
`MotionConfig` for the "boring majority" (fades/opacity) and explicit springs for hero/
signature interactions.

## 8. Performance — transform/opacity discipline, will-change, layout thrashing

- **GPU-safe (compositor-only) properties:** `transform`, `opacity`. Treat these as free —
  every hero/scroll animation should be expressible in terms of `x`, `y`, `scale`, `rotate`,
  `opacity`.
- **Emerging GPU support (test cross-browser):** `filter`, `clipPath`, `backgroundColor`. Use
  `filter: drop-shadow()` instead of animating `box-shadow`; use `clip-path: inset()` instead
  of animating `border-radius` growth on large elements.
- **Avoid animating layout-triggering properties** (`height`, `width`, `padding`, `top/left`,
  `border-width`) directly — each triggers layout recalc + paint on every frame. At 60fps
  you get 16.7ms/frame (8ms at 120fps on ProMotion displays); layout thrash blows that budget
  fast. Use `layout` (which internally uses transform-based FLIP) or restructure to animate
  `scale`/`x`/`y` instead.
- **`will-change`:** Motion doesn't apply this for you globally. Hint sparingly —
  `style={{ willChange: "transform" }}` — only on elements you know will animate imminently
  (e.g. right before a hover-triggered transform), not blanket-applied to every motion
  component. Each layer costs GPU memory; over-hinting can *degrade* performance by exhausting
  the compositor's layer budget, especially on mobile/low-end GPUs.
- **Individual transform values aren't always hardware-accelerated:** Motion's ergonomic API
  (`animate={{ x: 100 }}`) composes into a single `transform` string under the hood, which is
  accelerated — but percentage-based transforms (`translateX("100%")`) may not accelerate in
  every browser. Prefer pixel/viewport-unit values for guaranteed acceleration on critical
  above-the-fold animations (hero R3F/canvas overlays, nav reveal).
- **Test on low-power devices**, especially for `layout` animations on `position: absolute`
  elements with many children — isolated small trees animate fine, but large DOM subtrees can
  still jank even with transform-only strategies.
- **Respect `prefers-reduced-motion`:** wrap large-motion sequences (parallax, R3F camera
  moves, big spring bounces) with a check via `useReducedMotion()` from `motion/react` and
  fall back to simple opacity crossfades — required for an "award-quality" accessibility bar.

```tsx
import { useReducedMotion } from "motion/react";

function Hero() {
  const reduce = useReducedMotion();
  return (
    <m.div
      initial={{ opacity: 0, y: reduce ? 0 : 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0.2 } : springSmooth}
    />
  );
}
```

## 9. Quick decision checklist for this project

1. Install `motion` (not `framer-motion`) — import from `motion/react` (or `motion/react-client`
   for server-adjacent components).
2. Wrap the root layout in `LazyMotion features={domAnimation} strict`; use `m` everywhere by
   default; only reach for `domMax`/full `motion` on the one or two pages needing `layout`/drag.
3. Centralize spring/easing tokens in `lib/motion/springs.ts` and reuse — don't hand-roll
   transition objects per component.
4. Build a small `components/motion/` kit: `FadeIn`, `StaggerList`, `RevealText`,
   `PageTransitionProvider` — keep `"use client"` boundaries at this layer only.
5. Use variants + `stagger()` for any multi-element reveal; never hand-compute per-index
   delays unless you need custom non-linear timing.
6. Use `AnimatePresence` for every conditionally-rendered UI (modals, toasts, filtered grids,
   route transitions) — always outside the conditional, always with stable keys.
7. Animate only `transform`/`opacity` (plus cautiously `filter`/`clipPath`); avoid `height`/
   `width`/`padding` animations — use `layout` or restructure instead.
8. Apply `will-change` surgically, never globally; respect `prefers-reduced-motion` on every
   large-motion sequence.
