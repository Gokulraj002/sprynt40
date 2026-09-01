# Page Transitions & Loaders in Next.js App Router (2026)

Stack context: Next.js 15/16 App Router, Tailwind, Motion (Framer Motion), R3F.

## 1. Preloaders / intro sequences — when they're worth it

**Default answer: don't build one.** Every source agrees a preloader is a performance and UX liability unless it's doing real work.

- A preloader/load-transition can directly hurt LCP (delays when real content paints), CLS (any layout shift when the loader unmounts and real content pops in), and perceived responsiveness (blocking animations delay input handling). Source: managedserver.eu Core Web Vitals analysis.
- Modern sites often hit meaningful content in 200–300ms; adding an artificial 1–2s preloader on top of that is pure friction, not polish — it reads as an "annoying visual flicker," not craft.
- Google's guidance: 75% of page loads need LCP < 2.5s. A preloader that gates the LCP element behind a JS-driven animation timeline is fighting the metric directly.

**When a preloader is actually justified (agency/award-site context):**
- The page has genuinely heavy first-paint cost you can't hide otherwise — e.g. a WebGL/R3F hero that needs texture/shader compile time, custom variable-font FOIT you want to mask, or a large hero video. In that case the loader is *covering* real load time, not adding fake time on top of a fast page.
- It's a one-time, first-visit-only moment (session-gated), never repeated on internal navigation.
- It's short: **under ~1.2–2s**, ideally tied to `document.fonts.ready` / asset-load promises rather than a fixed `setTimeout`, so it never runs longer than the actual wait.
- It's skippable/interruptible — a click or keypress should be able to dismiss it instantly; never trap the user.
- It doesn't block interaction — the underlying page can still mount in the background.

**Implementation pattern that protects Core Web Vitals:**
- Reserve the loader's box with fixed dimensions (`position: fixed; inset: 0`) so its removal cannot shift layout (CLS-safe).
- Let the real page mount and paint underneath the loader (`position: fixed` overlay with `z-index`), so LCP is measured against the actual hero content becoming visible, and the overlay merely delays *visibility*, not paint, of your critical elements — note: LCP is measured on visible/painted content, so an opaque overlay sitting on top of the hero still delays LCP by definition. To avoid this, either (a) keep the preloader only for genuinely long external asset loads (3D/video) where there's no way around the wait, or (b) fade the overlay out fast (<300ms) and treat the *overlay's own text/logo* as your intentional LCP element, not the hero behind it.
- Use `requestAnimationFrame`/CSS transitions, not `setTimeout` polling, and cap total duration with `Promise.race([assetsLoaded, timeout(2000)])` so a slow asset never creates an infinitely-spinning loader.
- Gate with `sessionStorage` so the intro plays once per session, not on every soft navigation:
```tsx
'use client';
import { useEffect, useState } from 'react';

export function Preloader({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(() =>
    typeof window !== 'undefined' && !sessionStorage.getItem('intro-played')
  );

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      sessionStorage.setItem('intro-played', '1');
      setShow(false);
    }, 1200); // hard cap
    return () => clearTimeout(t);
  }, [show]);

  return (
    <>
      {show && <IntroOverlay onDone={() => setShow(false)} />}
      {children}
    </>
  );
}
```
- Never re-run the intro on route changes — that's the #1 preloader mistake on agency sites. It belongs in the root layout gated by session state, not per-page.

**Bottom line for this project:** for a digital marketing agency site, skip the preloader entirely unless the hero is R3F/WebGL and needs a genuine asset-load mask. Prefer investing that motion budget into a fast, snappy route-transition instead (below) — it reads as more premium per millisecond spent than a splash screen.

## 2. Why exit animations are hard in App Router

The root cause: **the App Router unmounts the outgoing route segment immediately** when navigation starts, before any exit animation can play. Unlike the old Pages Router (where `_app.tsx` could own `AnimatePresence` around a stable component tree), App Router's segment-based rendering tears down `page.tsx` synchronously on navigation.

Consequences:
- If `AnimatePresence` (Motion) lives inside `page.tsx`, it dies with the page — no exit animation ever plays, only enter.
- `template.tsx` re-mounts on every navigation (that's its whole purpose — fresh instance per route), which is good for *enter* animations but doesn't by itself fix *exit* animations, because the router context updates and swaps children before Motion's exit can run.
- Putting `AnimatePresence` in `layout.tsx` (persistent across navigations) is necessary but not sufficient — the Next.js router still forcibly updates `LayoutRouterContext` and swaps the segment's children mid-flight, effectively skipping the exit phase.

## 3. The FrozenRouter pattern (the standard fix for Motion/Framer Motion)

This is the load-bearing trick used across the ecosystem (e.g. corfitz.dev's "Solving Framer Motion Page Transitions in Next.js App Router") to make `AnimatePresence` exit animations actually work in App Router:

```tsx
// hooks/use-previous-value.ts
import { useEffect, useRef } from 'react';

function usePreviousValue<T>(value: T): T | undefined {
  const prevValue = useRef<T>();
  useEffect(() => {
    prevValue.current = value;
    return () => { prevValue.current = undefined; };
  });
  return prevValue.current;
}
```

```tsx
// components/frozen-router.tsx
'use client';
import { useContext } from 'react';
import { useSelectedLayoutSegment } from 'next/navigation';
// @ts-expect-error internal Next.js context, not officially exported
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';

function FrozenRouter({ children }: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const prevContext = usePreviousValue(context) || null;

  const segment = useSelectedLayoutSegment();
  const prevSegment = usePreviousValue(segment);

  const changed =
    segment !== prevSegment && segment !== undefined && prevSegment !== undefined;

  return (
    <LayoutRouterContext.Provider value={changed ? prevContext : context}>
      {children}
    </LayoutRouterContext.Provider>
  );
}
```

```tsx
// app/template.tsx
'use client';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import FrozenRouter from '@/components/frozen-router';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
}
```

How it works: `FrozenRouter` intercepts the router's context updates. When it detects the selected layout segment has changed (a navigation happened), it feeds the **previous** router context back down to `children` instead of the new one — effectively freezing the outgoing page's rendered content in place so `AnimatePresence` gets a stable, unchanging tree to animate the exit of. Once the exit animation completes and `AnimatePresence` unmounts the old `motion.div`, the new `key`'s tree takes over with the current context.

Key requirements/gotchas:
- `key={pathname}` on the direct motion child is what makes `AnimatePresence` treat each route as a distinct presence — without it, Motion sees "the same component," not enter/exit.
- `mode="wait"` finishes the exit before mounting the new page (curtain/sequential feel); `mode="popLayout"` or default lets them overlap (crossfade feel).
- This must live in `template.tsx`, not `layout.tsx` — `template.tsx` is what actually re-mounts per route so a fresh `motion.div` instance exists to animate in.
- `LayoutRouterContext` is an unexported internal from `next/dist/shared/lib/app-router-context.shared-runtime` — it's a private API, can break on Next.js minor upgrades, and needs re-validation after every Next.js update. Treat it as a known-fragile technique, not a stable public API.
- Nested/parallel route segments each need their own `template.tsx` if you want independent transitions per segment.

## 4. View Transitions API — the native alternative (Next.js 15 experimental → Next.js 16 stable-ish)

Two generations of API exist; know which one you're targeting.

### Next.js 15: `experimental.viewTransition` flag + `unstable_ViewTransition`
```js
// next.config.js
module.exports = {
  experimental: { viewTransition: true },
};
```
```tsx
// app/layout.tsx
import { unstable_ViewTransition as ViewTransition } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ViewTransition>{children}</ViewTransition>
      </body>
    </html>
  );
}
```
Despite the `unstable_` prefix (reflecting the evolving browser spec, not code quality), this shipped in production on nextjs.org and the Vercel dashboard.

### Next.js 16 / React 19.2+: stable `ViewTransition` component, richer API
Works in App Router with **zero config** — route navigations are wrapped as React transitions automatically, and `<ViewTransition>` activates on transitions/`Suspense`/`useDeferredValue` (not plain `setState`).

```tsx
import { ViewTransition } from 'react';
```

Four patterns from the official Next.js guide (`nextjs.org/docs/app/guides/view-transitions`), all directly applicable to an agency site:

**a) Shared-element morph** (e.g. project thumbnail → case-study hero image): give both instances the same `name`:
```tsx
// grid
<ViewTransition name={`project-${id}`}><Image src={thumb} /></ViewTransition>
// detail page
<ViewTransition name={`project-${id}`}><Image src={hero} fill /></ViewTransition>
```
No CSS required for the morph itself; add `share="morph"` + `default="none"` to customize with `::view-transition-image-pair(.morph)` keyframes (e.g. a mid-flight blur to mask interpolation artifacts).

**b) Suspense-reveal for loading states** — skeleton slides out, content slides in, asymmetric timing (exit fast ~150ms, enter slower ~210–400ms) so old content clears before new content competes for attention.

**c) Directional route transitions** via `<Link transitionTypes={['nav-forward']}>` / `['nav-back']`, mapped to CSS in `enter`/`exit` props keyed by transition type — this is the closest native equivalent to a curtain/wipe: assign `nav-forward`/`nav-back` classes and animate `::view-transition-old`/`::view-transition-new` with `translate`. Must be applied per `page.tsx` (not `layout.tsx`, since layouts persist and never re-fire enter/exit).

**d) Same-route crossfade** for tab-like content changes: `<ViewTransition key={slug} name="..." share="auto" enter="auto" default="none">` — swapping the `key` is what makes React treat it as an exit/enter pair.

**Essential companion CSS (always include):**
```css
/* let clicks pass through the transition overlay */
::view-transition { pointer-events: none; }

/* respect motion preference — do this or ship an accessibility bug */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*),
  ::view-transition-new(*),
  ::view-transition-group(*) {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
  }
}
```

**Anchoring a persistent header during slides** (prevents it visually "moving" with the content — critical for agency nav bars):
```css
::view-transition-group(site-header) { animation: none; z-index: 100; }
::view-transition-old(site-header) { display: none; }
::view-transition-new(site-header) { animation: none; }
```
```tsx
<header style={{ viewTransitionName: 'site-header' }}>...</header>
```

**Browser support caveat:** Chromium 125+ and recent Safari/Firefox for the newer transition-types/`view-transition-class` features used by React's integration; older/unsupported browsers simply skip the animation and navigate normally (graceful degradation — no polyfill needed, no broken UX). Safari support is behind and can behave differently.

### `next-view-transitions` (Shu Ding) — the pragmatic library option
For teams that want the raw View Transitions API wired up without building the plumbing:
```bash
pnpm install next-view-transitions
```
```tsx
// app/layout.tsx
import { ViewTransitions } from 'next-view-transitions';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ViewTransitions>
        <body>{children}</body>
      </ViewTransitions>
    </html>
  );
}
```
```tsx
import { Link } from 'next-view-transitions'; // drop-in replacement for next/link
```
Also exposes `useTransitionRouter()` for programmatic `push()` with transitions (imperative navigation triggered by button clicks, form submits, etc.). Explicitly scoped to "basic use cases" per its own docs — concurrent rendering/Suspense/streaming edge cases are still maturing in React/Next core, so don't reach for it if you need the advanced Suspense-reveal/directional patterns above; use React's native `ViewTransition` component instead once on Next 16.

### View Transitions API vs. Framer Motion/FrozenRouter — which to pick
| | View Transitions API (native/next-view-transitions) | Framer Motion + FrozenRouter |
|---|---|---|
| Setup complexity | Low (flag + component, or 1 library) | Medium-high (private API dependency) |
| Browser support | Chromium/Safari-recent only; degrades gracefully elsewhere | Universal (pure JS/CSS) |
| Animation control | CSS `::view-transition-*` pseudo-elements — good but coarser | Full JS control, easing curves, physics, orchestration |
| Cross-element morphing (thumbnail→hero) | Native, easy (`name` prop) | Manual (FLIP techniques, shared layout IDs) |
| Fragility | Stable-ish public API (Next 16), experimental flag on Next 15 | Depends on unexported `LayoutRouterContext` internal |
| Best for | Shared-element morphs, directional nav, crossfades | Fully custom curtain/wipe/mask sequences, R3F-integrated transitions |

**Recommendation for an award-quality agency site:** use the native View Transitions API (or `next-view-transitions`) for simple directional/crossfade nav between standard pages, and reserve the heavier Framer Motion + FrozenRouter (or GSAP timeline) approach specifically for the signature moment — e.g. the homepage → case-study curtain reveal — where you need full control over easing, staggered text reveals, and clip-path masking that CSS view-transition pseudo-elements can't express.

## 5. Curtain / wipe transitions — implementation

Agency/Awwwards-style curtain wipes are typically hand-built with Framer Motion or GSAP rather than the native API, because they need: staggered panels, clip-path masking, and content that mounts underneath the wipe before it's revealed (not just a crossfade).

**Core technique — clip-path wipe panel** (in the `template.tsx` from Section 3, replace the fade with a wipe):
```tsx
<motion.div
  key={pathname}
  initial={{ clipPath: 'inset(0 0 100% 0)' }}
  animate={{ clipPath: 'inset(0 0 0% 0)' }}
  exit={{ clipPath: 'inset(0 0 0 100%)' }}
  transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
>
  <FrozenRouter>{children}</FrozenRouter>
</motion.div>
```

**Full curtain-rise (separate overlay panel, not clipping content itself)** — more control, avoids clipping issues with nested `position: fixed` elements (e.g. R3F canvases):
```tsx
'use client';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';

export function Curtain() {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        className="fixed inset-0 z-[999] bg-black pointer-events-none"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0, transitionEnd: { display: 'none' } }}
        exit={{ scaleY: 1, display: 'block' }}
        style={{ originY: 0 }}
        transition={{ duration: 0.6, ease: [0.83, 0, 0.17, 1] }}
      />
    </AnimatePresence>
  );
}
```
Pair this overlay component with the FrozenRouter `template.tsx` so the underlying route content is stable while the curtain covers/uncovers it — the curtain hides the abrupt unmount/remount rather than trying to animate the content itself.

**Sequencing tips specific to agency sites:**
- Stagger the curtain across 2–4 vertical panels (`grid grid-cols-4`, each panel delayed by `i * 0.05s`) for the classic "blinds" reveal — cheap to add, reads as more crafted than a single flat wipe.
- Reveal the destination page's H1/hero text with a follow-on stagger (Motion `staggerChildren`) timed to start just as the curtain clears, not after — overlapping the reveal keeps total perceived transition time down.
- Keep total curtain duration ≤ 700–900ms. Longer reads as slow, not premium, especially on repeat navigation within the same session.
- Debounce/lock navigation during the transition (`isAnimating` ref/state) to prevent double-click race conditions where a second route change fires mid-wipe.

## 6. Protecting Core Web Vitals during route transitions

- **LCP**: never gate the destination page's hero/LCP element behind a JS timeline that starts *after* data fetch — prefetch routes (`<Link prefetch>` is on by default in App Router) so the destination's RSC payload is already cached when the transition starts; the wipe should mask network latency that's already been hidden by prefetching, not create new latency.
- **CLS**: transitions must never reflow surrounding layout — animate `transform`/`opacity`/`clip-path` only (all compositor-friendly), never `width`/`height`/`top`/`left` margins that trigger layout. This is true for curtain wipes and Motion `layout` animations alike — prefer `scaleY`/`clipPath` over animating actual box dimensions.
- **INP (replaced FID in 2024)**: keep transition JS off the main thread as much as possible — Motion animates via `transform`/`opacity` on the compositor by default (hardware accelerated); avoid animating properties that force style/layout recalculation on every frame. Test with heavy interaction during a transition (rapid nav clicks) to confirm INP doesn't spike.
- **Respect `prefers-reduced-motion`** for both curtain wipes and View Transitions — skip translate/scale entirely, keep opacity-only or instant swap. Not just an accessibility nicety; Google's Core Web Vitals story increasingly correlates with broader UX-quality signals.
- **Reserve overlay space** for any full-screen transition element (`position: fixed; inset: 0`) so it can never contribute to CLS when it mounts/unmounts — fixed-position elements are excluded from layout flow entirely.
- **Measure it**: run Lighthouse/PageSpeed Insights with the transition system live (not disabled) — teams routinely ship a beautiful transition that quietly regresses LCP by 400–800ms because the overlay sits on top of the hero during first load. Test cold-load (with intro/preloader if used) and warm client-side nav (with the wipe) as two separate scenarios.

## Sources
- [Next.js: Designing view transitions](https://nextjs.org/docs/app/guides/view-transitions) — official guide, Next.js 16 native `ViewTransition`, all four patterns + CSS
- [next-view-transitions](https://next-view-transitions.vercel.app/) / [npm](https://www.npmjs.com/package/next-view-transitions) — Shu Ding's library
- [Solving Framer Motion Page Transitions in Next.js App Router — corfitz.dev](https://www.corfitz.dev/posts/adding-framer-motion-page-transitions-to-next-js-app-router) — FrozenRouter pattern, full code
- [Jack Whiting — Using View Transitions in Next.js](https://jackwhiting.co.uk/posts/using-view-transitions-in-next-js) — `unstable_ViewTransition` / Next 15 experimental flag
- [The Effects of Preloaders and Load Transitions on UX and Core Web Vitals — managedserver.eu](https://www.managedserver.eu/the-effects-of-preloaders-and-load-transitions-on-user-experience-and-core-web-vitals/) — LCP/CLS/FID impact of preloaders
- [Awwwards — Page Transitions: Creative Examples, Resources and Tips](https://www.awwwards.com/page-transitions-creative-examples-resources-and-some-tips.html)
- [vercel/next.js discussion #46300 — View Transition API support](https://github.com/vercel/next.js/discussions/46300)
- [vercel/next.js discussion #59349 — Page transitions in App Dir layout.tsx](https://github.com/vercel/next.js/discussions/59349)
