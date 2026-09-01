# Navigation & Menu Design — Premium Digital Agency Sites

Stack target: Next.js 15 App Router + Tailwind + Motion (Framer Motion) + R3F.

## 1. The core pattern: full-screen overlay menu

Nearly every awarded agency site (Locomotive, Resn, Active Theory, Basic Agency, Dogstudio, Obys Agency, Hello Monday, Cuberto, Zajno, Instrument) replaces a horizontal navbar with a **minimal persistent header** (logo + single "Menu" trigger, sometimes a CTA button) that opens a **full-viewport overlay** on click. This is the single highest-leverage nav decision for an agency site — it reads as confident/editorial rather than "utility SaaS nav."

**Structure:**
- Header bar: logo (left), trigger word "Menu"/"Index"/hamburger icon (right), optional CTA ("Start a project") — all sitting on `position: fixed` or `sticky`, transparent over hero, background fades in on scroll.
- Overlay: `position: fixed; inset: 0; z-index: 100` panel that covers the full viewport (not a dropdown), containing:
  - Large-type primary links (Home, Work, Services, About, Contact) — often 48–120px type, one per line.
  - Secondary column: social links, office locations/timezones, email, phone.
  - Sometimes a live clock, a rotating word list, or a small preview image that swaps per hovered link (mega-menu-lite: hovering "Work" shows a project thumbnail).
  - A close ("Close"/X) trigger, same position as open trigger so muscle memory holds.

**Implementation notes (Next.js + Motion):**
- Keep overlay mounted with `AnimatePresence` so exit animations run; don't conditionally unmount without it.
- Panel entrance: background color/clip-path wipe in (0.4–0.6s, custom cubic-bezier like `[0.76, 0, 0.24, 1]` "expo" ease) followed by staggered link reveal.
- Stagger children with Motion's `staggerChildren` (0.05–0.08s) + `delayChildren` offset so links start after the panel wipe finishes — this two-stage timing (panel first, then content) is what separates amateur from premium execution.
- Per-link animation: `y: 100% → 0` combined with `opacity 0 → 1`, sometimes wrapped in an `overflow: hidden` parent so the text visually "rises" into view (classic agency move — used by Basic Agency, Instrument). Add slight blur-out (`filter: blur(8px) → blur(0)`) for extra polish, seen on Framer's "Growing Navigation" component pattern.
- Body scroll lock while open (`document.body.style.overflow = 'hidden'`, or a hook like `usehooks-ts`'s `useLockBodyScroll`) — don't forget to also block background scroll on iOS Safari (`touchmove` prevention or `overscroll-behavior: contain`).
- Route change should auto-close the overlay; wire the close to Next's `usePathname()` change via `useEffect`.

**Named component references found:** Framer Marketplace "Overlay Menu" (Kunal), "Staggered Menu FX" (coloured layers slide in first, then panel, then staggered items — literally the two-stage pattern above), "Growing Navigation" (blur+slide stagger at 80ms/item), "FlowingMenu."

## 2. Sticky / shrinking header behavior

Three behaviors, often combined:

1. **Background/opacity transition on scroll** — header starts transparent over a hero (so hero art reads edge-to-edge), then gains a background/blur (`backdrop-filter: blur(12px)` + semi-opaque bg) once `scrollY > threshold` (commonly 50–100px). Implement with a scroll listener + Motion's `useScroll`/`useMotionValueEvent`, or CSS-only via a sentinel element + `IntersectionObserver` toggling a class (cheaper, no jank).
2. **Height/size shrink** — logo and header padding scale down (e.g., 120px → 72px tall) as you scroll, giving a "compacting" feel. Pure-CSS trick: nested `position: sticky` containers with different `top` offsets (see CSS-Tricks "shrinking header without JS") — cheapest for perf since it avoids a scroll-driven JS animation loop. For finer control pair with Motion's `useTransform` mapping `scrollY` to `height`/`scale`.
3. **Hide-on-scroll-down, reveal-on-scroll-up** — track scroll delta, translate header `translateY(-100%)` when scrolling down past a small buffer (~10px, to avoid jitter from momentum scroll), `translateY(0)` when scrolling up or near top. This is extremely common on long-scroll agency case-study pages so the nav doesn't eat viewport during reading, but reappears instantly when the user wants to navigate away. Debounce/threshold the direction check (only flip state after ~5–10px of consistent movement) to prevent flicker.

**Perf note:** for R3F/heavy-canvas hero sections, drive header transforms off `motion/react`'s `useScroll` (which uses passive scroll listeners + rAF) rather than raw `onScroll` state updates, to avoid re-render thrash competing with the WebGL frame loop.

## 3. Magnetic buttons / cursor-follow interactions

A signature "premium agency" micro-interaction: buttons (especially the nav CTA, close button, and social icons in the overlay) subtly pull toward the cursor within a radius, then spring back on mouseleave.

**Implementation (React + Motion, GSAP alternative also common):**
```
onMouseMove: compute cursor position relative to element center via getBoundingClientRect()
  offsetX = (clientX - centerX) * strength   // strength ~0.3–0.5
  offsetY = (clientY - centerY) * strength
  animate x/y to offset (Motion springs: stiffness ~150, damping ~15)
onMouseLeave: animate x/y back to 0 (slightly bouncier spring, e.g. stiffness 200, damping 10)
```
- Use `useRef` for the DOM node (avoid re-render on every mousemove — update via Motion's `useMotionValue`/`animate()` imperatively, not React state).
- Constrain effect to a radius (e.g., only activate within 1.5x the element's bounding box) so distant cursor movement doesn't drag the button from afar.
- Common libs/examples: Olivier Larose's magnetic-button tutorial (GSAP and Motion versions both documented), `smoothui.dev`/`uibeats.com` prebuilt `MagneticButton` components with configurable `strength`/`radius` props — good reference APIs to mirror.
- Disable entirely on touch devices (`@media (hover: hover) and (pointer: fine)` gate, or check `window.matchMedia`) — magnetic effects on mobile are meaningless and can cause jank.

## 4. Hover states for nav links

- **Underline draw-in**: pseudo-element (`::after`) `scaleX(0) → scaleX(1)` with `transform-origin: left`, transition ~0.3s ease-out. Cheap, GPU-accelerated (avoid animating `width`).
- **Text "rise" swap**: two stacked copies of the label (`overflow:hidden` wrapper), on hover both translate up so a duplicate/colored copy replaces the original — classic Locomotive/Basic-agency link hover. Pure CSS with `group-hover` in Tailwind, or Motion `whileHover` variants.
- **Clip-path wipe reveal**: for link hover backgrounds or image-preview reveals in mega-menus, animate `clip-path: inset()` or `polygon()` rather than `opacity` for a sharper, more "designed" wipe.
- **Cursor-follow label/blob**: hovering a nav item spawns a small custom cursor (dot, or the word "View") that follows the mouse — implement via a single fixed-position element whose `x/y` are driven by `useMotionValue` + `requestAnimationFrame`/spring, shown/hidden via `AnimatePresence` on hover state. Used heavily by Resn, Cuberto for "View project" cues; translates well to nav items pointing at case studies.
- Always pair color/underline hover with a **focus-visible** equivalent (see accessibility section) — don't gate the affordance behind `:hover` only.

## 5. Mega-menu vs minimal nav — which for an agency site

- **Minimal full-screen overlay wins for agencies** almost universally: agency sites typically have 5–8 top-level items (Work, Services, About, Studio, Journal, Contact) — well under the ~7-item threshold where mega-menus become necessary (mega-menus justify themselves at 20+ pages / deep e-commerce-style catalogs, per UX research). A mega-menu reads corporate/enterprise (SaaS, retail); a full-screen minimal overlay reads editorial/craft — the desired agency register.
- **When a mega-menu-*like* pattern still appears**: hovering a link in the overlay reveals a live preview thumbnail or short list of sub-items (e.g., hovering "Work" reveals 3-4 featured case-study thumbnails; hovering "Services" reveals a sub-list: Brand, Web, Motion, Strategy). This is best understood as a **"mega-menu inside the overlay"** rather than a classic top-nav dropdown — keeps the persistent header clean while still surfacing depth for content-heavy agencies.
- Rule of thumb for this project: default to minimal (5-7 links, no dropdowns in the header itself); if the site has 15+ case studies or multiple service verticals, add contextual previews *inside* the full-screen overlay rather than a traditional mega-dropdown from the header bar.

## 6. Mobile nav patterns

- The full-screen overlay pattern **already is** the mobile pattern — same component just needs responsive type sizing (`clamp()` for link font-size, e.g. `clamp(2rem, 8vw, 4rem)`) and a single-column layout (drop the secondary preview column, stack social links at the bottom).
- Trigger stays a hamburger/"Menu" text in the fixed header; per UX research, bottom-anchored triggers reduce thumb-reach cost, but agencies conventionally keep the trigger top-right for brand consistency across breakpoints — acceptable tradeoff since the menu itself is infrequent-but-important navigation, not primary task navigation (bottom tab bars are for app-like frequent switching, not marketing sites).
- Avoid true native "bottom sheet" (partial-height drawer) for primary nav on marketing/agency sites — it undersells the full-screen "moment" that makes these menus feel premium; reserve bottom sheets for secondary actions (share, filter) if used at all.
- Ensure the overlay's tap targets are ≥44×44px and links have generous vertical padding (16–24px) since large display type alone doesn't guarantee touch-friendly hit areas — wrap the whole row, not just the text glyphs, in the clickable area.
- Test iOS Safari safe-area insets (`env(safe-area-inset-top/bottom)`) so the overlay's close button and bottom social row aren't obscured by the notch/home-indicator.

## 7. Accessibility of animated full-screen menus

This is the category most agency showcase sites get wrong — treat it as a differentiator, not an afterthought.

- **Semantics**: overlay root should be `role="dialog"` with `aria-modal="true"` and `aria-labelledby` pointing at a (visually hidden if needed) heading like "Site navigation." The trigger button needs `aria-expanded` (true/false) and `aria-controls` pointing at the panel id.
- **Focus management**:
  - On open: move focus into the panel — typically to the first link or a heading, not left on the trigger.
  - **Trap focus** inside the panel while open (Tab/Shift+Tab cycle within it only) — use a maintained library (`focus-trap-react`, Radix's `Dialog`/`FocusScope`, or Headless UI's `Dialog`) rather than hand-rolling; hand-rolled traps are the #1 source of bugs (focus escaping to the underlying page, or getting stuck).
  - On close: return focus to the trigger button that opened it (store a ref before opening).
- **Keyboard**: `Escape` must close the menu. Tab order should follow visual/DOM order matching the stagger animation order (don't let CSS order diverge from DOM order — screen reader and keyboard users get the DOM order regardless of animation).
- **Motion sensitivity**: wrap stagger/slide/blur animations in a `prefers-reduced-motion` check — either drop to instant opacity crossfade or remove translate/blur entirely, keep timing near-instant (<0.2s). In Motion, branch variants on `useReducedMotion()` hook; in CSS, gate `@media (prefers-reduced-motion: reduce)` and set `transition: none` / `animation: none`, or swap to opacity-only.
- **Screen reader content while closed**: nav links inside the closed overlay must not be reachable via Tab (set `inert` on the closed panel, or `tabIndex={-1}` on each link and toggle, or unmount conditionally) — otherwise keyboard/SR users tab through invisible offscreen links before ever reaching visible content, a very common bug in `transform: translateY(100%)`-based overlays that stay in the DOM.
- **Live region**: not usually necessary for menu open/close itself since focus movement + dialog role already announces it in most screen readers, but do announce route changes if using client-side routing (Next.js App Router needs an explicit route-announcer since it doesn't auto-manage this like older frameworks — add a visually-hidden `aria-live="polite"` region that updates with the new page title on navigation).
- **Color contrast**: large display type over dark/photographic overlay backgrounds must still meet 4.5:1 (or 3:1 for genuinely large text ≥24px bold/≥18.66px per WCAG large-text threshold) — check against the busiest background frame if the overlay background is animated/gradient.

## 8. Quick build checklist for this project

1. Header: fixed, transparent→blurred-bg on scroll (IntersectionObserver sentinel), logo + Menu trigger + optional CTA, hide-on-scroll-down/show-on-scroll-up for long pages.
2. Overlay: `AnimatePresence`-mounted full-screen panel; two-stage animation (bg wipe → staggered links); `role="dialog"` + `aria-modal` + focus trap (library, not hand-rolled) + `Escape`-to-close + return-focus-on-close.
3. Links: large `clamp()` type, rise/underline hover, optional hover-preview thumbnail for Work/Services.
4. Magnetic effect: apply to nav CTA + close button + social icons only, `useMotionValue`-driven, radius-gated, disabled on touch via `(hover: hover)` media check.
5. Mobile: same overlay component, single column, ≥44px tap targets, safe-area insets respected.
6. Reduced motion: branch all overlay/magnetic animations on `useReducedMotion()`; ship an opacity-only fallback.
7. Route change: auto-close overlay + move focus + announce new page title via a hidden live region (App Router doesn't do this for you).

## Sources
- https://freefrontend.com/css-fullscreen-menus/
- https://www.framer.com/marketplace/components/staggered-menu-fx/
- https://www.framer.com/community/marketplace/components/growing-navigation/
- https://www.framer.com/marketplace/components/flowingmenu/
- https://www.awwwards.com/websites/navigation/
- https://www.awwwards.com/websites/unusual-navigation/
- https://blog.olivierlarose.com/tutorials/magnetic-button
- https://smoothui.dev/docs/components/magnetic-button
- https://uibeats.com/docs/button/magnetic-button
- https://css-tricks.com/how-to-create-a-shrinking-header-on-scroll-without-javascript/
- https://www.codemzy.com/blog/react-sticky-header-disappear-scroll
- https://johandejong.dev/blog/sticky-header-with-show-hide-on-scroll
- https://coreui.io/react/docs/components/focus-trap/accessibility/
- https://www.levelaccess.com/blog/accessible-navigation-menus-pitfalls-and-best-practices/
- https://www.uxpin.com/studio/blog/how-to-build-accessible-modals-with-focus-traps/
- https://accessibility.build/guides/accessible-menu
- https://www.a11y-collective.com/blog/wcag-animation/
- https://theplusaddons.com/blog/best-mega-menu-examples/
- https://www.onething.design/post/top-website-navigation-design-patterns
- https://www.uxpin.com/studio/blog/mobile-navigation-examples/
- https://www.nngroup.com/articles/mobile-navigation-patterns/
- https://tobiasahlin.com/blog/css-trick-animating-link-underlines/
- https://www.landing.love/sites/activetheory-2/
- https://dappasol.com/guides/best-cinematic-website-studios/
