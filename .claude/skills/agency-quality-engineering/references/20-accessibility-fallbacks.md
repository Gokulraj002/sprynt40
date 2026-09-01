# Accessibility & Graceful Degradation for Animated Sites

Stack: Next.js 15 App Router + Tailwind + Motion (Framer Motion) + GSAP + Three.js/R3F.
Goal: ship the cinematic effects without failing WCAG 2.2 AA or breaking for keyboard/reduced-motion/low-end users.

---

## 1. One global source of truth for "reduced motion" / "low power"

Don't let Motion, GSAP, and R3F each independently read `matchMedia` — they'll drift, double-fire, and you'll forget one. Set a single `data-motion` attribute on `<html>` at the root and have every system read it.

**`app/layout.tsx`** — set the attribute before hydration to avoid flash-of-full-motion:
```tsx
// Inline script in <head>, runs before paint, no FOUC
<script
  dangerouslySetInnerHTML={{
    __html: `(function(){
      var m = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.documentElement.setAttribute('data-motion', m ? 'reduced' : 'full');
    })();`,
  }}
/>
```

**`lib/motion-context.tsx`** — React context that also listens for live changes (user can toggle OS setting without reload) and exposes a manual override (many agency sites add an in-UI "reduce motion" toggle for users who don't know the OS setting exists):
```tsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type MotionPref = 'full' | 'reduced';
const MotionCtx = createContext<{ pref: MotionPref; setOverride: (p: MotionPref | null) => void }>(
  { pref: 'full', setOverride: () => {} }
);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [systemPref, setSystemPref] = useState<MotionPref>('full');
  const [override, setOverride] = useState<MotionPref | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemPref(mq.matches ? 'reduced' : 'full');
    const handler = (e: MediaQueryListEvent) => setSystemPref(e.matches ? 'reduced' : 'full');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const pref = override ?? systemPref;

  useEffect(() => {
    document.documentElement.setAttribute('data-motion', pref);
  }, [pref]);

  return <MotionCtx.Provider value={{ pref, setOverride }}>{children}</MotionCtx.Provider>;
}
export const useMotionPref = () => useContext(MotionCtx);
```

Now every animation system consumes the same `data-motion` attribute or the `useMotionPref()` hook:

- **CSS**: `[data-motion="reduced"] .parallax-layer { transform: none !important; }` — kill CSS-only parallax/marquee globally in one rule block.
- **Motion (Framer Motion)**: wrap the app in `<MotionConfig reducedMotion="user">` — this makes Motion automatically strip `transform`/`layout` animations for `prefers-reduced-motion: reduce` users without per-component code. For custom control, read `useReducedMotion()` (Motion's own hook, matches `matchMedia`) and branch: swap `{ x: 100 }` slide-ins for `{ opacity: 1 }` fades, cut duration to ~0.15s instead of removing entirely (WCAG wants *reduced*, not necessarily zero, motion for non-essential UI feedback).
- **GSAP**: use `gsap.matchMedia()` as the single conditional gate, not scattered `if` checks:
```js
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: reduce)', () => {
  gsap.set('.hero-title', { opacity: 1, y: 0 }); // final state immediately, no tween
  ScrollTrigger.getAll().forEach(st => st.disable()); // or return a cleanup fn
});
mm.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.from('.hero-title', { y: 60, opacity: 0, duration: 1, scrollTrigger: '.hero' });
});
```
`gsap.matchMedia()` auto-reverts everything created in a branch when the query stops matching (e.g., live OS toggle) — critical for correctness, avoid manual ScrollTrigger teardown bugs.
- **Three.js/R3F**: gate at the scene-mount level, not per-mesh. If `pref === 'reduced'`, either (a) don't mount the `<Canvas>` at all and render a static poster image/gradient in its place, or (b) mount it but disable `useFrame` continuous rotation/camera drift and set `autoRotate={false}`, freeze particle motion, keep only essential state-driven transitions (e.g., a single crossfade on scroll section change, no idle animation loop). Idle infinite-loop animation (floating shapes, rotating cameras) is exactly the vestibular trigger `prefers-reduced-motion` exists for — kill it outright, don't just slow it down.

**Rule of thumb**: "reduced" means remove parallax, auto-play video/particle loops, large-scale transforms, and camera drift. It does NOT mean disable all UI feedback — hover/focus state changes and short opacity fades on click are fine and expected.

---

## 2. Custom cursors and overlay menus must not break keyboard/touch users

Custom cursor implementations (a `<div>` following the mouse, hiding the native cursor via `cursor: none`) are a top accessibility failure mode on agency sites. Rules:

- **Never set `cursor: none` globally.** Scope it only inside sections with the custom cursor active, and only when a `pointer: fine` + `hover: hover` media query matches (i.e., real mouse, not touch/stylus):
```css
@media (pointer: fine) and (hover: hover) {
  .cursor-zone { cursor: none; }
}
```
Touch devices never get `pointer:fine`, so mobile/tablet users keep native touch behavior automatically — don't render the custom-cursor component at all on touch (check `window.matchMedia('(pointer: coarse)')` and skip mounting it).
- **Keyboard users never see a mouse-tracked cursor** — that's expected and fine, but every element that reacts to cursor proximity/hover (magnetic buttons, hover-reveal captions) must also react to `:focus-visible` with an equivalent visual state. If a button scales up on cursor hover via a mousemove listener, also bind the same scale-up to the `focus` event so Tab-users get the same affordance.
- **`:focus-visible` outline must survive your CSS reset.** A common bug: agencies strip `outline: none` globally for the "clean" look and never restore it. Minimum fix:
```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
```
Must hit 3:1 contrast against adjacent background (WCAG 2.4.7 / 2.4.11). On dark hero backgrounds, a low-contrast accent color that looks fine as decoration may fail as a focus ring — test the ring color separately from the brand palette if needed.

**Overlay/fullscreen menus** (the animated full-viewport nav overlay is an agency-site staple):
- Trigger button needs `aria-expanded` and `aria-controls` pointing at the overlay's id.
- On open: move focus into the overlay (first link or a heading with `tabindex="-1"`), and **trap focus** inside it (Tab/Shift+Tab cycle only within overlay elements) until closed — use a small trap util or a library (`focus-trap-react`) rather than hand-rolling, hand-rolled traps reliably miss edge cases (dynamically added links, `Tab` from last element not wrapping).
- `Escape` key must close the overlay.
- On close: return focus to the trigger button that opened it — do not leave focus lost on `<body>`.
- The overlay's animated entrance (stagger-in nav links via Motion/GSAP) should itself respect `data-motion="reduced"` — swap the staggered slide to an instant show, since users tabbing through a menu that's still animating in will have focus land on links before they're visually stable.
- Background page content behind the overlay needs `aria-hidden="true"` (or `inert`) applied to the rest of `<body>` while it's open, so screen reader virtual cursor / mobile screen reader swipe-navigation doesn't leak into hidden content. `inert` is now broadly supported and is the cleaner primitive vs. manually managing `aria-hidden` + `tabindex="-1"` on every sibling.

---

## 3. Focus management for scroll-hijacked / pinned sections

GSAP ScrollTrigger `pin: true` sections and Motion `useScroll`-driven scenes change the DOM's visual order without changing its logical/tab order — that's usually fine, but two failure modes recur:

- **Pinned sections with scroll-jacking (horizontal scroll-through-pin, snap sections) can trap keyboard scroll.** If you intercept wheel/scroll events to drive a horizontal gallery, keyboard users hitting Space/PageDown must still advance — test Tab and arrow-key scrolling explicitly, don't assume mouse-wheel interception is the only input.
- **Route/section changes driven by animation (e.g., Next.js App Router page transitions animated with Motion's `AnimatePresence`) must move focus to the new content's heading** on transition-complete, and should announce the change via a visually-hidden `aria-live="polite"` region (`"Now viewing: Work"` ) so screen reader users get an equivalent signal to the sighted transition cue. Without this, SPA-style transitions silently leave screen reader focus on a removed/stale DOM node — one of the most common SPA a11y regressions.

---

## 4. Color contrast on gradient and dark-theme sections

Agency sites lean on gradient hero backgrounds and dark themes for the "premium" look — this is where contrast failures concentrate.

- **WCAG AA**: 4.5:1 for body text, 3:1 for large text (≥18px, or ≥14px bold) and for UI component boundaries/icons. Dark-mode target should be 7:1+ (AAA) for body copy in practice — dark backgrounds with mid-gray text look fine to a sighted designer on a calibrated monitor and fail badly on typical mobile screens in daylight.
- **Gradients have no single contrast ratio** — contrast must be checked at the *worst point* under the text, not the average. If a heading spans a gradient from `#1a1a2e` to `#e94560`, check contrast against both the darkest and lightest color stops the text overlaps, not just one sample point.
- **Fastest fix that also looks intentional**: a scrim/overlay between the gradient/image and the text — a `linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))` behind the bottom third of a hero image where the headline sits, or a flat 30–40% black (light text) / 20–30% white (dark text) layer under a text block. This is standard in award-site hero patterns and reads as a deliberate design choice, not a compromise.
- **Never rely on color alone** to convey state (active nav link, form error, disabled button) — pair a color change with an icon, underline, weight change, or text label. This also covers colorblind users cheaply.
- Run automated checks in CI/dev: axe DevTools or Lighthouse a11y audit catch most contrast failures on static text; they will NOT catch text-over-video/gradient cases reliably — spot check those manually with a contrast picker at the actual rendered pixel.

---

## 5. Semantic HTML inside visually-driven sections

Divs-with-onClick and canvas-only sections are the norm in cinematic builds — make them screen-reader-legible without changing the visual design:

- **`<Canvas>` (R3F) is a black box to assistive tech.** Always give the WebGL hero section itself normal semantic structure around the canvas: a `<section aria-label="...">` wrapping it, a real `<h1>`/`<h2>` for the headline (even if it's also rendered as part of a shader/3D text effect, keep an HTML heading — visually positioned via CSS, not `display:none`/`visibility:hidden` which some screen readers skip; use a visually-hidden utility class if you must duplicate text, or `aria-hidden` the decorative 3D version and keep one real, visible-or-sr-only text heading as source of truth).
- Mark the `<canvas>` element itself `aria-hidden="true"` (it's decorative/output-only, no meaningful DOM inside it for AT to read) unless you've implemented actual interactive a11y inside the 3D scene (e.g., `react-three-a11y`'s `<A11y>` wrapper, which layers focusable/announceable HTML proxies over 3D meshes for scenes where 3D objects are genuinely interactive, like a product configurator). For purely decorative hero scenes, `aria-hidden` + a real heading sibling is sufficient and far less work.
- Use landmark elements (`<header>`, `<nav>`, `<main>`, `<footer>`, `<section aria-label>`) even when every section is full-viewport and visually borderless — screen reader users navigate by landmark list, not by scrolling, and a page that's one giant unlabeled `<div>` soup is unusable by landmark navigation regardless of how good the visuals are.
- Every custom "button" built as a styled `<div>`/`<span>` for a magnetic/hover effect must be a real `<button>` or `<a>` (native focusability, keyboard activation via Enter/Space, correct role) — restyle the native element with CSS rather than rebuilding button semantics with `role="button"` + manual `tabIndex`/`onKeyDown` unless truly unavoidable, native elements get you the behavior for free and avoid missed edge cases (Space vs Enter, disabled state, screen reader button announcement).
- Decorative marquees, floating shapes, noise/grain overlays, cursor-trail canvases: all `aria-hidden="true"`, and if implemented as `<img>`, use `alt=""` (empty, not omitted) to mark explicitly decorative.

---

## 6. Mobile / low-end device fallback tiers

Treat "mobile" and "low-end" as two separate axes — a modern iPhone is mobile but not low-end; a several-year-old Android budget phone is both. Tier the experience rather than a single on/off:

**Detection signals** (combine, don't rely on one):
- `navigator.hardwareConcurrency` (CPU core count — ≤4 is a reasonable "low" threshold)
- `navigator.deviceMemory` (Chrome-only, undefined elsewhere — treat missing as unknown, not as "high")
- `matchMedia('(pointer: coarse)')` / `(hover: none)` → touch-primary device
- `navigator.connection?.saveData` or `effectiveType` (`'2g'`/`'slow-2g'`) → respect Data Saver mode, disable autoplay video/heavy asset preloading
- GPU tier via `detect-gpu` (pmndrs) — runs a quick benchmark, returns a `tier` 0–3 and `isMobile`; the standard library for this in the R3F ecosystem. Use it to gate WebGL feature tiers rather than hand-rolled UA sniffing (UA strings lie/are frozen going forward, unreliable long-term).

**Tiering strategy** (apply top-down, each tier strictly less work than the one above):
1. **Full desktop tier** (fine pointer, GPU tier ≥2, `hardwareConcurrency` ≥6, no `saveData`): full particle counts, post-processing passes (bloom, DoF), scroll-linked camera moves, custom cursor, cursor-trail canvas effects.
2. **Mid tier** (touch or mid GPU): keep 3D but cut particle/instance counts 50–80%, disable post-processing passes, cap `devicePixelRatio` at 1.5–2 (`Math.min(window.devicePixelRatio, 2)` in the R3F `<Canvas dpr={...}>` prop — uncapped DPR on a high-density phone is one of the single biggest mobile WebGL perf killers), disable camera auto-drift/idle animation, keep only scroll/tap-triggered transitions.
3. **Low tier / low-end or reduced-motion**: don't mount `<Canvas>` at all — swap in a static image, CSS gradient, or a lightweight looping video/CSS animation that approximates the hero's mood at near-zero cost. This is not a lesser experience to apologize for; treat the static fallback as its own designed asset (export a good still frame from the 3D scene, don't just show a gray box).
4. **Explicit `saveData` / `prefers-reduced-motion: reduce`**: forces tier 3 regardless of device capability — user intent overrides inferred capability.

**Practically in code**: compute the tier once (client-side, after mount, via a small hook combining the signals above + `detect-gpu`), store it in the same context as motion preference (or a sibling `PerformanceProvider`), and branch component trees at a high level (`{tier === 'full' ? <SceneCanvas /> : <StaticHero />}`) rather than threading dozens of conditional props through a single mega-component — cleaner to maintain and guarantees the low-tier path never even imports/executes the heavy Three.js scene graph code (pair with `next/dynamic` + `ssr: false` and a conditional import so the R3F bundle isn't even downloaded on the low tier).

**Always cap for everyone, not just low tier**: limit `devicePixelRatio` (never render at native 3x on any device — 2 is a sane ceiling for WebGL canvases), pause `useFrame`/RAF loops via the Page Visibility API when the tab isn't visible, and pause/reduce work when the canvas scrolls out of the viewport (`IntersectionObserver` gating the render loop) — these aren't accessibility fixes per se but they're what keeps "full tier" from becoming a battery-draining, thermal-throttling mess on the very high-end devices that were supposed to handle it.

---

## Quick checklist

- [ ] Single `data-motion` attribute set pre-hydration + live-updated; Motion, GSAP, R3F all read it
- [ ] `MotionConfig reducedMotion="user"` at app root (Motion)
- [ ] `gsap.matchMedia()` used for all reduced-motion branching, not manual ifs
- [ ] `<Canvas>` unmounted entirely (not just paused) on reduced-motion / low tier
- [ ] Custom cursor: `cursor: none` scoped to `(pointer: fine) and (hover: hover)`, never global
- [ ] Every hover-reactive element has an equivalent `:focus-visible` state
- [ ] `:focus-visible` outline restored after CSS reset, 3:1 contrast against background
- [ ] Overlay menu: focus trap, `Escape` closes, focus returns to trigger, `inert`/`aria-hidden` on background
- [ ] SPA/section transitions move focus + announce via `aria-live="polite"`
- [ ] Gradient/dark hero text checked at worst-case color stop, scrim added where needed, 4.5:1 body / 3:1 large text minimum
- [ ] Real `<h1>`–`<h2>`, `<section aria-label>`, `<button>`/`<a>` used under every visually custom component
- [ ] `<canvas>` and decorative overlays `aria-hidden="true"`
- [ ] GPU/device tiering via `detect-gpu` + `hardwareConcurrency`/`saveData`, DPR capped at 2, RAF paused off-screen/off-tab

---

## Sources

- [Add support for `prefers-reduced-motion` — Motion GitHub PR](https://github.com/motiondivision/motion/pull/407)
- [prefers-reduced-motion CSS media feature — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [prefers-reduced-motion: Taking a no-motion-first approach — Tatiana Mac](https://www.tatianamac.com/posts/prefers-reduced-motion)
- [gsap.matchMedia() docs — GSAP](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/)
- [Accessible Animation — GSAP resources](https://gsap.com/resources/a11y/)
- [ScrollTrigger.matchMedia and prefers-reduced-motion — GSAP forums](https://gsap.com/community/forums/topic/27141-scrolltriggermatchmedia-and-prefers-reduced-motion/)
- [react-three-a11y — pmndrs GitHub](https://github.com/pmndrs/react-three-a11y)
- [Three.js & Accessibility — Medium](https://medium.com/@piplev/three-js-accessibility-c4f45d83f2c6)
- [detect-gpu — pmndrs GitHub](https://github.com/pmndrs/detect-gpu)
- [A guide to designing accessible, WCAG-conformant focus indicators — Sara Soueidan](https://www.sarasoueidan.com/blog/focus-indicators/)
- [Creating an Accessible Menu That Meets WCAG — Be Accessible](https://beaccessible.com/post/accessible-menu/)
- [How to Build Accessible Modals with Focus Traps — UXPin](https://www.uxpin.com/studio/blog/how-to-build-accessible-modals-with-focus-traps/)
- [Perfectly Contrasting Text on a Gradient Background — PropelAuth](https://www.propelauth.com/post/contrasting-text-gradient-background)
- [Gradients: Accessible Colour Contrasts — achecks.org](https://www.achecks.org/gradients-accessible-colour-contrasts-with-gradient-backgrounds/)
- [Dark Mode Contrast: WCAG-Compliant Dark UI Guide — colorcontrast.org](https://www.colorcontrast.org/blog/dark-mode-contrast-accessibility-guide/)
- [Hero sections — accessible, semantic and performant — Medium](https://medium.com/@matt.dawkins/hero-sections-accessible-semantic-and-performant-c04502e16f40)
- [Understanding HTML landmarks — LogRocket](https://blog.logrocket.com/html-landmarks-understanding-applying/)
