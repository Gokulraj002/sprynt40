# Services Section Patterns for Digital Marketing Agency Sites

Research for skill library: how top agencies present services (SEO, paid ads, social, branding, web dev)
without a boring 6-icon card grid. Includes IA guidance for SEO (overview vs. individual service pages).

---

## 1. The four dominant non-card patterns

### A. Numbered editorial list (index-style)
Services rendered as a vertical list of large typographic rows — `01 SEO`, `02 Paid Media`, `03 Content`, `04 CRO` —
instead of boxed cards. This is the single most common "award-quality" services pattern seen on Awwwards-tier
agency sites (Instrument-style restraint, Bureau Dimanche, Metasense-style product-site structure).

**Why it reads as premium:** it borrows from editorial/magazine layout (numbered contents page) rather than
SaaS marketing-site card grids, which instantly signals "agency," not "app landing page."

**Actionable build spec:**
- Full-bleed rows, each ~120–200px tall, large serif or heavy sans headline (48–96px), thin 1px divider rules.
- Number in a monospace or tabular-nums font, muted color (40–50% opacity), positioned left, small relative to headline.
- Row content: number → service name → one-line descriptor → arrow/plus icon right-aligned.
- On hover: row background tints, headline shifts weight or color, arrow icon slides right (`translateX`) — all via
  Motion `whileHover` with `transition: { duration: 0.3, ease: [0.16,1,0.3,1] }`.
- Click behavior: either expands inline (accordion, see below) or routes to a dedicated `/services/[slug]` page.
- Stagger the rows in on scroll-into-view with Motion's `staggerChildren: 0.08` off a shared parent `variants` object.

### B. Accordion with hover/click image preview
Collapsed list of service names (numbered or not). Clicking (or hovering, on desktop) a row expands it to reveal
description + a full-width or right-column image/video that illustrates the service. Only one row open at a time.

**Reference pattern:** Framer's "Service Accordion" community component (Pentaclay) is a direct implementation of
this exact brief — minimal numbered layout by default, expands on click to reveal full-width image + service detail
with a "cinematic image reveal" and "editorial feel." Good to study structurally even if not reused verbatim.

**Actionable build spec:**
- State: `activeIndex` (single-open accordion, not multi-open — multi-open dilutes the "reveal" drama).
- Use `AnimatePresence` + `motion.div` with `initial={{ height: 0, opacity: 0 }}`, `animate={{ height: 'auto', opacity: 1 }}`,
  and `exit={{ height: 0, opacity: 0 }}`. Wrap height-animated content in a fixed-overflow container (`overflow: hidden`).
- Image reveal on expand: clip-path or scale-in from 0.9 → 1 with slight y-offset, 400-600ms, easing `easeOutExpo`.
- On desktop, consider triggering on **hover** instead of click for a faster preview (reduces the row-to-detail latency),
  but pair with a click-through to the full service page for accessibility and mobile fallback (hover doesn't exist on touch).
- Keyboard: rows must be real `<button>` elements with `aria-expanded`, and the whole accordion needs `role="region"`
  associations for a11y — do not build accordion purely with div+onClick.

### C. Hover-triggered floating/cursor-follow image
A list of service names (text-only, no thumbnails inline). On hover of a row, a floating image/video panel appears
and follows the cursor (or snaps to a fixed slot near the list), previewing that service's output (a campaign shot,
a UI screen, a video still). Mouse-leave fades it out.

**Named examples found in Awwwards inspiration tagged specifically "service list item hover" / "cursor hover image
effects":** OIC Design ("Service list item hover" — floating image, follow-pointer), Vault49 ("reactive cursor image
hover," agency portfolio), CUSP ("cursor hover image effects," WebGL agency portfolio), Noomo Agency ("3D hover
effect"), KARMA Digital Agency ("portfolio hover preview"). These are the canonical execution of this exact pattern —
worth pulling up directly on awwwards.com/inspiration/ for visual reference before building.

**Actionable build spec (GSAP or Motion, either works):**
- Track `mousemove` on the list container; use `quickTo`/`quickSetter` (GSAP) or a spring-animated `x`/`y` motion value
  (Motion's `useSpring` wrapping `useMotionValue`) so the floating image trails the cursor with inertia rather than
  snapping — spring stiffness ~150–300, damping ~20–30 feels natural, avoid a raw 1:1 cursor lock (feels cheap/laggy).
- Image container: `position: fixed`, `pointer-events: none`, starts `scale(0)` / `opacity: 0`, animates to
  `scale(1)`/`opacity:1` on row `mouseenter`, reverses on `mouseleave`. Typical size: 280–400px wide, slight rotation
  (-4° to 4°) adds editorial "polaroid" feel.
- Swap the image instantly (no cross-fade lag) when moving between adjacent rows — use a `key`-based `AnimatePresence
  mode="wait"` only if you want a cross-fade; otherwise swap `src` directly for snappier feel matching real agency sites.
- Must have a non-hover fallback for mobile/touch: on small viewports, collapse to pattern B (tap-to-expand accordion)
  or a static stacked list with inline thumbnails — never ship cursor-follow as the only rendering path.

### D. Sticky-scroll service walkthrough (scrollytelling)
The services list (or a single active service label) sticks to the viewport while the user scrolls; as they scroll,
a companion panel (image, stat, or mini case study) advances through steps tied to scroll position. This is the
"pinned narrative" pattern common on product/story sites, adapted to services.

**Reference:** Awwwards inspiration entry "Sticky Scroll Services" (Jords+Co Studio) tagged agency/portfolio/studio/
sticky-scroll/tabs/cards — a direct services-page implementation of this exact idea, useful as a structural reference.

**Actionable build spec:**
- Structure: one `position: sticky; top: 0` panel (the visual/detail side) inside a tall parent whose height = N × 100vh
  (N = number of services). The list/label side can either sit next to the sticky panel or be the sticky panel itself
  with content scrolling past on the other side.
- Drive active-step state with Motion's `useScroll({ target: containerRef, offset: ['start start', 'end end'] })` to
  get a 0–1 progress value, then `useTransform` to map progress → active index (`Math.floor(progress * N)`), or use
  IntersectionObserver on N step-marker divs (simpler, better perf, avoids scroll-jank on low-end devices).
- Prefer IntersectionObserver over continuous scroll-linked transforms for the *index switching* logic — reserve
  `useScroll`/`useTransform` for smooth secondary motion (e.g., a progress bar or parallax image drift) layered on top.
- On mobile, sticky-scroll walkthroughs often collapse to a simple stacked sequence (no pinning) — pinning long
  vertical panels on small viewports frequently causes jump/jank; test on real devices, not just resized desktop.
- This pattern pairs well with a persistent left-side "service index" nav (numbers 01–05) that highlights the active
  step and is clickable to jump — gives wayfinding the pure scrollytelling version lacks.

---

## 2. Pattern selection guidance (by agency size/positioning)

| Agency signal you want | Best-fit pattern |
|---|---|
| Editorial, confident, restrained ("we don't need to sell you") | A — numbered list |
| Portfolio-forward, proof-heavy | B — accordion w/ image, or C — hover reveal (image = actual work) |
| Storytelling / process-led ("here's how we work") | D — sticky scroll walkthrough |
| Small/boutique, few services (3–5) | A or B — more content depth per service justified |
| Full-service, many offerings (8+) | A with click-through to dedicated pages, or grouped accordion (categories → sub-services) |

Avoid combining more than one of these per page — pick one hero services treatment; a secondary/related-services
module elsewhere on the site can use a simpler grid.

---

## 3. Motion/interaction details that separate "good" from "template"

- **Never animate on load only** — animate on scroll-into-view (`whileInView`, `viewport: { once: true, margin: '-100px' }`)
  so returning/scrolling users still get the reveal, and above-the-fold content isn't fighting a page-load animation.
- **Easing matters more than duration.** Use custom cubic-beziers (`[0.16, 1, 0.3, 1]` "expo-out" or `[0.22, 1, 0.36, 1]`)
  rather than Motion's default `easeInOut` — default easing is what makes template sites feel generic.
- **Stagger children, not just fade the whole block.** A services list where each row's number, headline, and
  description fade in with a ~60-100ms stagger reads as far more crafted than a single blanket fade.
- **Hover states need an exit as considered as the enter.** Cursor-follow images and accordion panels that snap shut
  or vanish abruptly break the illusion; mirror the enter transition in reverse, slightly faster (enter 400ms / exit 250ms).
- **Respect `prefers-reduced-motion`:** disable cursor-follow tracking and height/scale transforms, fall back to
  simple opacity crossfades or instant state changes.
- **Three.js/R3F opportunity:** for a stack that already includes R3F, pattern C's floating preview panel can be
  upgraded to a small WebGL canvas (subtle distortion shader on the preview image, or a mini particle/gradient scene
  per service) rather than a flat `<img>` — but keep it scoped to a small canvas region, not full-viewport, to avoid
  performance cost on a section users scroll past quickly.

---

## 4. Information architecture: services overview vs. individual service pages (SEO)

This is a real, well-documented SEO tradeoff — not just a design preference.

**Default recommendation for a real agency site: dedicated page per core service.**
- Google ranks pages, not sites. A single `/services` page trying to rank for "SEO agency," "PPC management," "social
  media marketing," and "branding" simultaneously dilutes topical relevance for all four keyword clusters — a
  dedicated `/services/seo` page can go deep on SEO-specific intent, terminology, FAQs, and proof points that a
  shared page can't fit without becoming bloated.
- Each service page should target distinct buyer intent, search volume, and vocabulary. "SEO" and "paid social
  advertising" have almost no keyword overlap and different searcher intent (organic/long-term vs. paid/immediate) —
  conflating them on one page serves neither audience well.
- **Recommended structure (pillar/hub model):**
  - `/services` = pillar/hub page: short positioning statement, the numbered/editorial list of all services (using
    one of patterns A–D above) with each row linking out to its own page. This page targets broad/branded queries
    ("[agency name] services," "digital marketing agency") and functions as an internal-linking hub.
  - `/services/seo`, `/services/paid-media`, `/services/social`, `/services/branding`, `/services/web-design` = child
    pages, each the actual ranking target for its specific service keyword, with its own H1, meta title/description,
    process breakdown, relevant case studies, FAQ schema, and a service-specific CTA.
  - Supporting content (blog posts, guides, comparisons) links up into the relevant child service page, not just the hub.
- **When a single combined page is acceptable:** genuinely small service list (2–3 closely related services), or
  early-stage/portfolio site where SEO ranking isn't the current priority (brand/direct-traffic driven). Even then,
  design the hub so each service still gets its own anchor/section with a unique, scrapeable heading — makes it easy
  to split into standalone pages later without an IA rewrite.
- **Practical build implication for this stack:** implement `/services` as the animated overview (pattern A/C/D), and
  each `/services/[slug]/page.tsx` as a proper Next.js App Router route with its own generated metadata
  (`generateMetadata`) — this is what actually enables the SEO benefit; an SPA-style client-only "expand in place"
  accordion that never changes the URL provides zero SEO value for individual services, since Google only sees the
  hub page's content. If pattern B (accordion) is used, still route each row to a real page rather than only
  expanding in place; the accordion can serve as the hub's client-side preview while the real content lives at a URL.

---

## 5. Concrete implementation notes for the stack (Next.js 15 + Tailwind + Motion + R3F)

- Route structure: `app/services/page.tsx` (hub, animated list) + `app/services/[slug]/page.tsx` (dedicated pages,
  `generateStaticParams` from a services data file, `generateMetadata` per slug for title/description/OG).
- Keep the services data (name, slug, one-liner, full description, hero image/video, process steps, related case
  studies) in a single typed array/CMS collection — both the hub list and the child pages read from the same source
  of truth, so pattern A/B/C rows and the actual page content never drift out of sync.
- For pattern C (cursor-follow), guard the whole interaction behind a `useMediaQuery`/pointer:fine check
  (`window.matchMedia('(hover: hover) and (pointer: fine)')`) so touch devices never even mount the mousemove
  listener — cleaner than CSS-hiding it.
- For pattern D (sticky scroll), wrap the pinned container in a component that unmounts/disables the sticky behavior
  below a breakpoint (render a plain stacked list on mobile) rather than fighting `position: sticky` edge cases on
  small viewports with JS.
- Reuse the row/number/headline component across the hub list, the accordion, and even the footer's sitemap-style
  services list — one component, three contexts, keeps typography/motion consistent site-wide.

---

## 5 named things worth pulling up directly for visual reference
1. **Framer "Service Accordion" (Pentaclay)** — https://www.framer.com/community/marketplace/components/service-accordion/ — direct numbered-accordion-with-image-reveal component, closest off-the-shelf match to pattern B.
2. **Awwwards: "Sticky Scroll Services" — Jords+Co Studio** — pinned services walkthrough, pattern D reference.
3. **Awwwards: "Service list item hover" — OIC Design** — floating/follow-pointer image on service row hover, pattern C reference.
4. **Awwwards: "Cursor hover image effects" — CUSP** — WebGL-flavored cursor-follow image, useful if upgrading pattern C with R3F.
5. **Framer "Scroll Services" community component** — scroll-animated services section, cards animating in one-by-one on scroll — a lighter-weight alternative to full sticky-pin (pattern D lite).

---

## Sources
- https://www.framer.com/community/marketplace/components/service-accordion/
- https://www.awwwards.com/inspiration/sticky-scroll-services-jords-co
- https://www.awwwards.com/inspiration/sticky-section-the-cycladist
- https://www.awwwards.com/inspiration/service-list-item-hover-oic-design
- https://www.awwwards.com/inspiration/follow-mouse-cursor-vault49
- https://www.awwwards.com/inspiration/cursor-hover-image-effects-cusp
- https://www.awwwards.com/inspiration/portfolio-hover-preview-karma-digital-agency
- https://www.awwwards.com/inspiration/3d-hover-effect-noomo-agency
- https://www.framer.com/community/marketplace/components/scroll-services/
- https://motion.dev/docs/react-use-scroll
- https://motion.dev/docs/react-scroll-animations
- https://www.frontend.fyi/course/motion/06-scroll-animations/08-scroll-animations-with-position-sticky
- https://www.framer.com/blog/marketing-agency-websites/
- https://www.marketermilk.com/blog/best-marketing-agency-websites
- https://gregorydigital.co.uk/blog/dedicated-service-pages-for-seo/
- https://sgd.com.au/service-page-framework/
- https://www.laurajawadmarketing.com/blog/seo-for-service-overview-page/
- https://niftymarketing.com.au/why-one-service-page-usually-isnt-enough-to-compete/
