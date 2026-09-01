# Micro-interactions & Cursor Effects — Actionable Guide

Stack target: Next.js 15 App Router + Tailwind + Motion (Framer Motion) + R3F.

## 1. Core principle: gate everything behind pointer capability

Never ship a custom cursor, magnetic hover, or image trail to a touch device. There is no cursor
on touch screens — mounting cursor logic there wastes cycles and can visually break tap targets.

```ts
// hooks/useHasFinePointer.ts
'use client';
import { useEffect, useState } from 'react';

export function useHasFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (hover: hover)');
    setFine(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return fine;
}
```

Mount `<CustomCursor />`, magnetic wrappers, and trail canvases only when this hook returns
`true`. Also respect `prefers-reduced-motion` — disable magnetic pull and trail spawning (keep
plain hover states) when reduced motion is requested. This single gate prevents the #1 mistake:
janky/broken cursor code shipped to iPad and phone users (~50-60% of agency site traffic).

CSS-only fallback/companion for native cursor swaps:

```css
@media (any-hover: hover) and (pointer: fine) {
  html { cursor: none; } /* only hide native cursor when a custom one will render */
}
```

Never hide the native cursor without a working replacement mounted — a "no cursor" bug is worse
than a boring default arrow. dbushell's accessibility piece also flags: match the custom cursor's
visual size to expectations (don't render it huge), keep a visible hotspot, and be aware macOS
scales cursor images with system Pointer Size while Windows does not — another reason to prefer a
DOM-rendered follower over a native `cursor: url(...)` image for anything beyond a simple pointer.

## 2. Dot + follower cursor (two-layer pattern)

Standard architecture used across Awwwards SOTD sites: a small **dot** that tracks the raw mouse
position 1:1 (zero lag, gives precision feedback) and a larger **follower ring** that lags behind
via lerp/spring (gives the "weight"/liquid feel).

### Framer Motion / Motion implementation

```tsx
'use client';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';

export function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Follower: springs lag behind the raw value = organic trailing motion
  const followerX = useSpring(mouseX, { damping: 25, stiffness: 300, mass: 0.5 });
  const followerY = useSpring(mouseY, { damping: 25, stiffness: 300, mass: 0.5 });

  const [variant, setVariant] = useState<'default' | 'view' | 'drag' | 'hidden'>('default');

  useEffect(() => {
    const move = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Dot: no spring, follows instantly */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-white mix-blend-difference"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
      />
      {/* Follower: spring-lagged ring, scales/labels per context */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] flex items-center justify-center rounded-full border border-white mix-blend-difference"
        style={{ x: followerX, y: followerY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: variant === 'view' ? 96 : variant === 'drag' ? 72 : 32,
          height: variant === 'view' ? 96 : variant === 'drag' ? 72 : 32,
          opacity: variant === 'hidden' ? 0 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        {variant === 'view' && <span className="text-xs text-white">View</span>}
        {variant === 'drag' && <span className="text-xs text-white">Drag</span>}
      </motion.div>
    </>
  );
}
```

Drive `variant` via a tiny React context (`CursorProvider`) so any component in the tree can call
`setVariant('view')` `onMouseEnter` / `setVariant('default')` `onMouseLeave` — this is exactly the
pattern Olivier Larose's "sticky cursor" tutorial and most production implementations use: a
context provider + `useRef` bounds element, rather than prop-drilling.

### Vanilla lerp version (if avoiding Motion for the cursor layer)

```js
let mouse = { x: 0, y: 0 };
let pos = { x: 0, y: 0 };
const LERP_FACTOR = 0.15; // 0.1–0.2 typical; lower = laggier/heavier, higher = snappier

function loop() {
  pos.x += (mouse.x - pos.x) * LERP_FACTOR;
  pos.y += (mouse.y - pos.y) * LERP_FACTOR;
  follower.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
  requestAnimationFrame(loop);
}
```

`lerp(start, end, factor) = start * (1 - factor) + end * factor`. Run this in its own
`requestAnimationFrame` loop, not inside the pointermove handler, to decouple render rate from
event rate.

### Contextual labels ("View" / "Drag" / "Play")

Pattern: a single data-attribute drives the follower's content so one cursor component powers an
entire grid instead of per-card cursor instances:

```tsx
<article
  onMouseEnter={() => setCursor({ variant: 'view', label: 'View' })}
  onMouseLeave={() => setCursor({ variant: 'default' })}
  data-cursor="view"
>
```

Use for: project/case-study cards → "View", draggable carousels/sliders → "Drag", video
thumbnails → "Play", external links → "↗". Keep label copy to one word, uppercase, small
(11–13px) — it's a hint, not a tooltip.

### mix-blend-mode for automatic contrast

`mix-blend-mode: difference` (or `exclusion`) on the cursor layer makes it auto-invert against
whatever is beneath it — no need to manually swap cursor color over dark vs light sections. This
is the single highest-leverage trick for cursor visibility on multi-section sites with alternating
backgrounds. Apply it to the *cursor elements themselves* (`position: fixed`, high z-index), not
to page content.

Caveat: `mix-blend-mode` disables the element's own text/background contrast against video or
complex imagery in unpredictable ways — test over hero video/WebGL canvases specifically, and pair
with a solid fallback color for browsers with no support (rare now, but Safari has had blend-mode
+ `will-change` performance quirks — profile on Safari specifically).

## 3. Magnetic hover (buttons, nav links, social icons)

Distance-based pull toward cursor, capped by a radius, released with a spring snap-back.

```tsx
'use client';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useRef } from 'react';

export function MagneticButton({ children, strength = 0.35, radius = 100 }: {
  children: React.ReactNode; strength?: number; radius?: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 15, stiffness: 150, mass: 0.1 });
  const springY = useSpring(y, { damping: 15, stiffness: 150, mass: 0.1 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < radius) {
      const falloff = 1 - dist / radius; // stronger pull near center
      x.set(dx * strength * falloff);
      y.set(dy * strength * falloff);
    }
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className="rounded-full px-8 py-4"
    >
      {children}
    </motion.button>
  );
}
```

**Tuned values that read as "premium" rather than "twitchy":**
- `strength`: 0.25–0.4 (button drifts 25–40% of the raw cursor offset). Below 0.25 feels inert;
  above 0.5 feels chaotic/overshooting.
- `radius`: 80–120px for buttons/pills; up to 150–200px for large nav wordmarks.
- Spring for the pull itself: soft — `damping: 15, stiffness: 150` (or `duration: 0.4, bounce: 0.1`
  in Motion's newer duration-based spring API) — should feel viscous, not bouncy.
- Snap-back on release can use a slightly snappier spring (`stiffness: 200–300, damping: 20`) so it
  doesn't linger.
- **Two-layer magnetism**: for icon buttons with inner glyphs, apply a *second*, stronger magnetic
  transform to the inner icon (e.g. `strength: 0.5`) so the icon drifts further than its container
  — this "double magnetism" is what makes agency nav icons (Locomotive, Cuberto-style) feel alive
  rather than just a moving box.

For a non-Framer, GSAP `quickTo` version (cheaper, good when the rest of the site already loads
GSAP for scroll):

```js
const xTo = gsap.quickTo(button, 'x', { duration: 0.4, ease: 'power3' });
const yTo = gsap.quickTo(button, 'y', { duration: 0.4, ease: 'power3' });
button.addEventListener('mousemove', (e) => {
  const { left, top, width, height } = button.getBoundingClientRect();
  xTo((e.clientX - (left + width / 2)) * 0.35);
  yTo((e.clientY - (top + height / 2)) * 0.35);
});
button.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
```

`gsap.quickTo` is purpose-built for this — cheaper than tweening from scratch each event.

## 4. Image trail effect (cursor-driven media reveal)

Used on portfolio/agency hero and case-study index pages: as the cursor moves, a sequence of
thumbnail images spawns along the path and fades out.

**Architecture (DOM-based, not canvas, for typical use):**
- Pre-render a pool of `<img>` elements (hidden, `opacity: 0`) — one per trail image — sized via
  CSS, positioned `fixed`/`absolute`.
- On `mousemove`, compute cumulative distance traveled since the last spawn; only spawn a new
  image once distance exceeds a threshold (e.g. `window.innerWidth / 8` or a flat 60–100px). This
  **throttles by distance, not time** — prevents a stationary mouse from spamming images and keeps
  spawn density proportional to movement speed.
- Position the new image at cursor coords, animate in (scale 0.8→1, opacity 0→1, ~0.4s), hold
  briefly, then animate out (opacity→0, slight scale/translate) and recycle it back into the pool
  (`onComplete` removes/reuses rather than leaking DOM nodes — genuine object pooling matters here
  for GC pauses on longer sessions).
- Cycle through the image pool with an incrementing index (`index % images.length`) so trail
  images repeat in sequence rather than randomly.

```tsx
'use client';
import { useRef, useCallback } from 'react';
import { gsap } from 'gsap';

export function useImageTrail(images: string[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const idx = useRef(0);
  const THRESHOLD = 80;

  const onMove = useCallback((e: React.MouseEvent) => {
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    if (Math.hypot(dx, dy) < THRESHOLD) return;
    lastPos.current = { x: e.clientX, y: e.clientY };

    const img = document.createElement('img');
    img.src = images[idx.current % images.length];
    idx.current++;
    img.className = 'pointer-events-none fixed h-32 w-24 object-cover rounded-md';
    img.style.left = `${e.clientX}px`;
    img.style.top = `${e.clientY}px`;
    containerRef.current?.appendChild(img);

    gsap.fromTo(img,
      { opacity: 0, scale: 0.7 },
      {
        opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out',
        onComplete: () => {
          gsap.to(img, {
            opacity: 0, duration: 0.5, delay: 0.3, ease: 'power1.in',
            onComplete: () => img.remove(),
          });
        },
      }
    );
  }, [images]);

  return { containerRef, onMove };
}
```

Named reference: Codrops "Made with GSAP: Building a Fun Gravity-Based Mouse Trail" (2026) extends
this with a physics fall/bounce on each spawned image (`back.in(1.5 + (1 - y/H))` easing scaled by
drop height) for a more playful, gravity-driven variant — good inspiration if the brand tone is
energetic rather than premium/minimal.

R3F variant: for a WebGL hero, swap DOM `<img>` spawning for instanced planes/sprites with a
custom shader trail (fade via per-instance opacity uniform driven by age) — same distance-throttle
logic, GPU-rendered. Only worth the complexity if the rest of the hero is already R3F.

## 5. Hover distortion (image/video RGB-shift, ripple, liquid)

Common on case-study cards: hovering an image triggers a WebGL/shader distortion (displacement
map, chromatic aberration, or liquid ripple) rather than a plain CSS scale.

- Implementation is typically a `<Canvas>` (R3F) plane with the image as a texture, a displacement
  texture (noise or a hand-drawn map) blended in via `uniform float uHover` animated 0→1 on
  pointer enter/leave with `gsap.to()` or a spring.
- Cheaper CSS-only alternative: layered `filter: blur()` + `transform: scale()` cross-fade between
  two duplicate image layers, or an SVG `feDisplacementMap` filter with an animated `scale`
  attribute — much lighter than WebGL, works well for a whole grid of cards without per-card
  Canvas instances (WebGL context limits matter — browsers cap concurrent contexts around 8–16).
- Keep distortion subtle for agency work (professional, not gimmicky): displacement amplitude
  low enough that the image reads clearly mid-transition; total transition 0.6–0.9s.

## 6. Button hover choreography (beyond color swap)

Layer multiple simultaneous micro-animations rather than a single background-color transition —
this is what separates "template" hover states from award-quality ones:

1. **Background reveal**: a circle/shape scales from 0 at the cursor's entry point (not the
   button's center) using `transform-origin` set dynamically from the `mouseenter` event
   coordinates — gives the fill a "spreading from where you clicked" feel.
2. **Text swap**: current label slides up/out while a duplicate slides up/in from below (classic
   "flip" hover) — implement with two stacked `<span>`s in a `overflow-hidden` container, animate
   `y: 0 → -100%` on the first and `y: 100% → 0` on the second, staggered by ~0.03–0.05s.
3. **Icon nudge**: an arrow/chevron icon translates 4–8px in its pointing direction on hover
   (`transition: transform 0.3s cubic-bezier(0.65,0,0.35,1)`).
4. **Border/underline draw**: `stroke-dashoffset` animation or `scaleX` transform-origin trick for
   an underline that "draws" left-to-right rather than fading in.

Combine 2–3 of these per button max — stacking all four on every CTA reads as noisy. Reserve full
choreography for primary CTAs and hero buttons; secondary/tertiary buttons get 1 layer (usually
just the text-swap or icon nudge).

Easing: use custom cubic-beziers, not `ease-in-out`. `cubic-bezier(0.65, 0, 0.35, 1)` (a
snappier ease-in-out) or `cubic-bezier(0.16, 1, 0.3, 1)` ("expo out", fast-start-slow-settle) read
as more premium than default easing across all of the above.

## 7. When custom cursors are appropriate vs annoying

**Appropriate:**
- Portfolio/agency/case-study sites where the cursor itself is part of the visual identity and
  interaction is exploratory (hovering to preview, not filling forms).
- Image-heavy grids/galleries where a "View"/"Play" label cursor replaces a redundant on-image
  button.
- Full-bleed hero sections with few, large interactive targets (nav, one CTA) — low risk of
  interfering with reading/scanning.

**Annoying / avoid:**
- Anywhere with dense text or forms — a custom cursor competing with a text-insertion caret or
  form focus rings actively hurts usability. Always fall back to native cursor over `<input>`,
  `<textarea>`, and text-selectable body copy (`cursor: auto !important` scoped to those
  elements, or unmount the custom cursor layer entirely on those routes/sections).
- Long-form blog/article pages — readers need the native cursor for text selection; a custom
  cursor here is pure friction for zero benefit.
- Any interaction requiring precision (drag-to-resize, color pickers, canvas editors) — added
  cursor lag from spring/lerp smoothing directly hurts precision tasks. Disable the smoothing
  (or the whole custom cursor) inside app-like/dashboard UI even on an agency's own internal
  tools pages.
- Checkout/pricing/contact forms — never obscure or lag the pointer during a conversion-critical
  flow.
- On mid-range and low-end laptops, a `mousemove`-driven cursor plus a magnetic-hover nav plus a
  WebGL hero running simultaneously can visibly drop frame rate — profile with Chrome's
  performance panel; if the cursor rAF loop and R3F render loop compete, throttle the cursor
  update or share one rAF driver.

Rule of thumb: custom cursor = the site's "hands" for browsing image content; native cursor
returns the instant precision, text input, or reading is required.

## 8. Touch device handling checklist

1. Gate all cursor/magnetic/trail code behind `matchMedia('(pointer: fine) and (hover: hover)')`
   (see §1) — do not rely on viewport width alone, since some touch laptops report wide viewports.
2. Never attach `mousemove`-only magnetic listeners without also verifying they don't fire from
   synthetic mouse events some mobile browsers emit after `touchend` (the 300ms-old "ghost click"
   issue) — prefer Pointer Events (`pointermove`, `pointertype === 'mouse'` check) over legacy
   mouse events for a single unified, filterable API.
3. Provide the equivalent affordance for touch without the cursor: contextual labels ("View",
   "Drag") that appear on hover should instead be always-visible small badges/icons on touch
   viewports, or triggered on `touchstart` with a tap-and-hold reveal — don't just silently drop
   the affordance.
4. Magnetic buttons: on touch, skip the pull physics entirely and just use `:active` scale-down
   (e.g. `scale(0.96)` on tap) for tactile feedback — magnetic pull toward a touch point makes no
   sense since there's no "approach" phase.
5. Image trails: disable entirely on touch — a finger drag spawning dozens of images is expensive
   and touch drags are usually scrolling, not intentional "trail" gestures.
6. Test with Chrome DevTools' "Show touch/mouse tools" plus real-device testing (iOS Safari
   specifically diverges from Chrome Android on `pointer`/`hover` media query reporting for some
   hybrid devices — verify rather than assume).

## Named example sites / references (for visual/behavioral inspiration)

- **Awwwards "Custom Cursor with Trail Effect and Blending Layers"** — blend-mode + trail combo
  reference: https://www.awwwards.com/inspiration/custom-cursor-with-trail-effect-and-blending-layers
- **Awwwards "Reactive Cursor with Blending Modes mask"** — contrast-aware cursor via blend +
  mask: https://www.awwwards.com/inspiration/reactive-cursor-with-blending-modes-mask
- **Awwwards "Magnetic Cursor to Glassmorphism UI Reveal"** (Vertex3D) — magnetic cursor + glass
  panel reveal combo: https://www.awwwards.com/inspiration/magnetic-custom-cursor-physics-vertex3d
- **Pavel Laptev's "Context Cursor"** — cursor that morphs shape to match the hovered element
  (iPad-pointer-inspired), open-source reference implementation:
  https://pavellaptev.github.io/context-cursor/ (repo: github.com/PavelLaptev/context-cursor)
- **Olivier Larose — "Sticky Cursor" tutorial** — canonical Next.js + Framer Motion sticky/scaling
  cursor with `useMotionValue`/`useSpring`, rotation via `Math.atan2`:
  https://blog.olivierlarose.com/tutorials/sticky-cursor
- **Codrops — "Made with GSAP: Building a Fun Gravity-Based Mouse Trail"** (2026) — physics-driven
  image trail with fall/bounce: https://tympanus.net/codrops/2026/05/20/made-with-gsap-building-a-fun-gravity-based-mouse-trail/
- General category to study on Awwwards: filter Sites by tag "Cursors" / "Micro-interactions" —
  agency/studio sites (Locomotive-style, Cuberto-style, Resn-style boutique studios) are the
  highest-density source of production-grade cursor + magnetic-hover choreography.

## Sources

- [Magnetic Cursor to Glassmorphism UI Reveal - Awwwards](https://www.awwwards.com/inspiration/magnetic-custom-cursor-physics-vertex3d)
- [Magnetic Cursor Effect - GSAP Vault](https://gsapvault.com/effects/magnetic-cursor)
- [Building a Magnetic Button with Cursor Physics - smoothui.dev](https://smoothui.dev/blog/building-magnetic-button)
- [Build a Sticky Cursor Effect with Next.js, Framer Motion - Olivier Larose](https://blog.olivierlarose.com/tutorials/sticky-cursor)
- [Cool Custom Cursors With React + Framer Motion: Part 1](https://medium.com/swlh/cool-custom-cursors-with-react-framer-motion-part-1-228126bcae68)
- [Made with GSAP: Building a Fun Gravity-Based Mouse Trail - Codrops](https://tympanus.net/codrops/2026/05/20/made-with-gsap-building-a-fun-gravity-based-mouse-trail/)
- [Custom Cursor with Trail Effect and Blending Layers - Awwwards](https://www.awwwards.com/inspiration/custom-cursor-with-trail-effect-and-blending-layers)
- [Reactive Cursor with Blending Modes mask - Awwwards](https://www.awwwards.com/inspiration/reactive-cursor-with-blending-modes-mask)
- [Custom Cursor Accessibility - dbushell.com](https://dbushell.com/2025/10/27/custom-cursor-accessibility/)
- [Custom Cursors in React: How They Work and When to Skip Them - 21st.dev](https://21st.dev/blog/custom-cursor-react)
- [Context Cursor - Pavel Laptev](https://pavellaptev.github.io/context-cursor/)
