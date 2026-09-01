# Case Study / Portfolio Showcase Patterns for a DM Agency Site

Stack target: Next.js 15 App Router + Tailwind + Motion (Framer Motion) + R3F/Three.js.

## 1. Work Grid with Hover Video/Image Preview

This is the single highest-leverage pattern for an agency site — it's the pattern used by nearly every Awwwards-winning studio (Locomotive, Ueno, Instrument, Henri Heymans, Patrick Heng). Two implementations dominate:

### A. Cursor-Following Preview Modal (floating thumbnail follows mouse)
Reference build: Olivier Larose's "Awwwards Project Gallery" tutorial (Next.js + GSAP + Framer Motion) — https://blog.olivierlarose.com/tutorials/project-gallery-mouse-hover

Architecture:
- **List of project rows/cards** (text-only, no thumbnail visible by default) — client keeps it lightweight/typographic until hover.
- **One floating "modal" div**, `position: fixed`, sized ~300–400px, that follows the cursor and only becomes visible on hover of any grid row.
- **State shape**: `{ active: boolean, index: number }` — a single active flag plus an index into the projects array, not per-row state. This means only one DOM preview element exists, swapped by index — cheap for animation.
- **Cursor tracking**: use `gsap.quickTo()` (not raw `.to()` in a mousemove handler — quickTo is optimized for high-frequency updates) bound to `pageX`/`pageY`. Stagger THREE separate quickTo instances with different durations (e.g. 0.8s for the modal container, 0.5s for a small cursor dot, 0.45s for a text label) — the differing durations create a trailing/lag effect between layers that reads as "premium" rather than everything moving in lockstep.
- **Image swap without unmount**: instead of swapping `src`, stack all preview images/videos in the floating container and translate a slider: `top: ${index * -100}%`. This avoids image re-load flicker and lets you animate a smooth vertical slide when hovering different rows in sequence.
- **Enter/exit animation**: Framer Motion variants with asymmetric easing — `[0.76, 0, 0.24, 1]` on enter (fast-out, standard "expo" style), `[0.32, 0, 0.67, 0]` on exit. Scale from ~0 to 1 plus the height/clip animation.
- Use next/image or next/video with `preload`/lazy strategy — since all previews for visible rows should be pre-mounted (opacity 0) to avoid load-in lag on first hover.

Practical adaptation for an agency site: pair this with the **work grid = the entire homepage-to-portfolio bridge** — most agency sites use exactly this component in two places: a "Selected Work" homepage section (3-6 items) and the full `/work` index (all items). Keep it as ONE reusable `<WorkRow>` + `<HoverPreview>` pair.

### B. In-Card Video Autoplay (no cursor-follow, simpler)
For thumbnails already showing an image: on hover, crossfade the static image to an autoplaying muted looped `<video>` inside the same card bounds (scale 1.02–1.05 on hover for subtle zoom). Cheaper to build, still reads as high-craft. Good fallback pattern for touch devices — on mobile, skip the hover-video entirely and just show a static image with an autoplaying muted video only when the card scrolls into view (IntersectionObserver), not on hover (since there is no hover on touch).

### Implementation checklist
- Preload video `preload="metadata"` or `poster` frame so hover doesn't cause a load flash.
- Debounce/cancel: if the user hovers rapidly across rows, cancel prior GSAP tweens (`quickTo` auto-handles this, raw tweens need `.kill()`).
- Respect `prefers-reduced-motion`: fall back to a plain crossfade, no cursor-follow, no parallax.
- z-index the floating modal above nav but allow it to be interrupted/hidden when the user leaves the grid section entirely (`onMouseLeave` on the grid wrapper, not per-row).

## 2. Horizontal Scroll Galleries

Common for: full project index pages, "our clients" logo walls, or a mid-page featured-work rail. NOT recommended as the primary case-study reading pattern (results content is dense — horizontal scroll fights against readable metrics/text). Best reserved for:
- A **visual-only** gallery of screenshots/mockups WITHIN a case study (the "gallery" section after the results section).
- A homepage "recent work" rail when there are more items than fit in one row.

Technique (per Awwwards examples — Studio Arde "Work Gallery", Henri Heymans, Patrick Heng, "Department of Culture and Tech"):
- Pin the section with `position: sticky` (or GSAP ScrollTrigger `pin: true`) so vertical scroll is translated into horizontal transform via `gsap.to(track, { x: -distance, scrollTrigger: { scrub: true, pin: true, end: () => "+=" + track.scrollWidth } })`.
- In React/Next.js, prefer this GSAP ScrollTrigger approach over `Locomotive Scroll` for new builds — Locomotive Scroll v4/v5 has friction with Next.js App Router hydration and is increasingly superseded by native `ScrollTrigger` + CSS `scroll-snap` for simpler cases.
- Simpler CSS-only alternative for a lighter-weight gallery: `overflow-x: scroll; scroll-snap-type: x mandatory;` on the container, `scroll-snap-align: start` on children — no JS required, works with trackpad/touch natively, degrades gracefully. Use this for image-only galleries where you don't need scroll-scrubbed transform tricks.
- Always add explicit horizontal scroll affordance (drag cursor icon, subtle scrollbar, or arrow nav) since horizontal scroll is non-obvious on desktop trackped/mouse-wheel — many implementations capture vertical wheel delta and remap it to horizontal `scrollLeft` inside the pinned section.

## 3. Case Study Detail Page Structure

Canonical structure validated across case-study writing guidance (HubSpot, AgencyAnalytics, Straight North) and agency site conventions:

1. **Hero** — full-bleed project image/video, client name, one-line result headline (not a generic title — e.g. "3.2x ROAS in 90 days for [Client]" beats "[Client] Case Study"). Category/service tags (Paid Media, SEO, CRO, Web Design). This is the single most important line on the page — treat it like an ad headline, not a filing label.
2. **At-a-glance stat bar** — immediately below hero, 3-4 big animated numbers (see Section 4). This is what most agency sites lead with now — results BEFORE narrative, because most visitors scan rather than read.
3. **Overview / Context** — one short paragraph: who the client is, what industry, what engagement scope (services + timeframe).
4. **The Challenge** — the specific pain point/obstacle, written to be relatable to a prospect with the same problem (not just "client wanted more traffic" — the actual constraint: e.g. stagnant CAC, low-quality leads, outdated brand perception, a failed prior agency relationship).
5. **The Approach / Strategy** — what the agency actually did: channels, creative strategy, testing framework, tech stack, timeline/phases. This is the "how," often broken into 2-4 sub-sections or a numbered/phased layout (Discovery → Strategy → Execution → Optimization). Visual treatment: alternating image/text blocks, or a horizontal phase-stepper.
6. **Visual gallery / mockup showcase** — screenshots, ad creative, mockups in device frames (see Section 5). This is where horizontal scroll or a masonry grid can live.
7. **The Results** — expanded metrics with context (not just numbers — comparison to baseline, industry benchmark, or timeframe). Charts/graphs (before/after) strengthen credibility. Include both quantitative (ROAS, CPA, CTR, conversion rate, traffic growth %) and qualitative (client quote/testimonial) proof.
8. **Client testimonial** — pull-quote, ideally with a photo/logo, placed either mid-page (after results) or as a closing beat before next-project nav.
9. **Next case study / CTA footer** — full-bleed link to the next project (common pattern: name + thumbnail that hover-previews just like the grid) plus a "Start your project" CTA. Never end a case study on a dead page — always chain to more work or a contact CTA.

Design/UX notes:
- Keep the challenge and approach sections SHORT — prospects skim. 2-4 sentences each; let visuals and stats carry weight.
- Use a persistent in-page sub-nav or scroll-progress indicator for long case studies (jump to Challenge/Approach/Results) — improves usability on content-dense pages.
- Sticky client info sidebar (logo, services, timeline, links) alongside a longer-form right-hand narrative column is a common two-column layout for agencies with more detailed case studies.

## 4. Results-First Storytelling (ROAS / Traffic / Conversions)

Marketing agencies differ from general design portfolios in one key way: **the results ARE the creative deliverable**. Structure around this:

- **Lead with outcome, not activity.** Headline pattern: `[Metric] [direction] in [timeframe]` — "214% increase in qualified leads in 6 months," "3.8x ROAS from a 1.2x baseline," "$2.1M pipeline generated." Avoid vague claims ("significant growth") — specificity builds trust.
- **Animated number counters (count-up-on-scroll-into-view)** for the stat bar — implement with Framer Motion's `useMotionValue` + `animate()` or a simple `useInView` + `requestAnimationFrame` counter, triggered once when the stat bar scrolls into viewport. Keep duration short (0.8-1.5s) and use an eased curve, not linear — feels more "counted" and less mechanical.
- **Before/after framing**: show baseline vs. result side by side (e.g. "2.1% → 6.4% conversion rate") rather than just the delta — gives scale/context and is more persuasive than a bare percentage.
- **Context every number**: a "312% increase" from a near-zero baseline is misleading without qualifiers — mature case-study copy includes absolute values or benchmarks alongside percentage lifts (e.g. against industry average CPA).
- **Segment metrics by what a prospect cares about**: agencies increasingly organize results by objective (Awareness / Acquisition / Revenue) rather than a flat list, since a CMO reading the case study wants to map the story to their own funnel stage.
- **Mini bar/line chart components** reinforce numeric claims — simple SVG sparkline or bar comparison (before/after, or month-over-month trendline) next to or below the stat. Don't over-engineer these — a small inline chart reads as more credible than a giant dashboard screenshot.
- **Client quote as social proof anchor** — place a short, specific testimonial (ideally naming the actual result) near the stats, not buried at the bottom.

## 5. Image Treatment & Mockup Presentation

- **Device framing**: for web/app work, present screenshots inside a clean browser chrome or device frame rather than a raw screenshot — signals polish. Tools/approaches: Figma browser-frame components, or build a lightweight custom `<BrowserFrame>` React component (rounded rect + 3 dots + URL bar) that wraps a screenshot/video — cheaper than importing a mockup library, fully stylable to match brand.
- **3D angled/perspective mockups** (laptop tilted in space, floating phone) are common for hero shots but should be used sparingly — flat, full-bleed screenshots inside a simple frame usually read as more premium/modern than heavy skeuomorphic device mockups (which can look dated/stock). If using 3D, prefer subtle CSS `perspective`/`rotate3d` on scroll-linked parallax rather than static rendered mockups, or R3F for a genuinely interactive 3D object if it's a signature moment (not every image).
- **Full-bleed sectioned images**: alternate full-width hero images with contained/framed detail shots to create visual rhythm down the case-study page — avoid a monotonous single-column of same-sized boxes.
- **Scroll-triggered image reveals**: clip-path wipe (e.g. `clip-path: inset(0 100% 0 0)` animating to `inset(0 0 0 0)`) or a simple fade+translateY(40px)→0 on scroll-into-view (Framer Motion `whileInView`) for each image block — keeps the page feeling alive without gimmicks.
- **Grayscale-to-color hover** on logo walls/client grids is a classic, cheap "polish" signal — desaturate(100%) by default, transition to full color on hover.
- **Consistent aspect ratios** across the grid (e.g. all 4:3 or 16:10) prevent layout jank; use `next/image` with `fill` + a fixed-ratio wrapper, and `object-fit: cover`.
- **Lazy-load and optimize aggressively**: case-study pages are image/video-heavy; use next/image with blur placeholders, and lazy-load hover-preview videos only when their parent row enters viewport (don't eagerly load every video in a 20-item grid).

## 6. Named Reference Sites / Studios (for visual/structural inspiration)

- **Instrument** (instrument.com) — large agency, case studies feel curated despite scale; good model for organizing breadth without clutter.
- **Ueno** — strong narrative flow case studies, clean modern grid.
- **Work & Co** — makes business context clear alongside craft; good model for B2B-credible case studies (useful since a marketing agency site often needs to convince a CMO, not just impress designers).
- **Humaan** (humaan.com) — scrolling animation + bold typography + immersive case studies, Awwwards-recognized.
- **Locomotive** (locomotive.ca) — Awwwards Site of the Month; originators of the horizontal/pinned scroll library bearing their name; case studies are a strong structural reference even if you don't use their JS library directly.
- **Patrick Heng** (portfolio, individual) — horizontal scroll navigation built with GSAP + Three.js + microinteractions — good technical reference for combining horizontal scroll with WebGL accents.
- **Henri Heymans** (portfolio) — horizontal scrolling, WebGL, cursor interaction — reference for cursor-driven hover states.
- Browse **Awwwards → Portfolio winners** (awwwards.com/websites/winner_category_portfolio) and **Awwwards → "horizontal-scroll" inspiration tag** for a continuously updated feed of current best-practice examples rather than relying on a fixed list — these categories surface new agency/portfolio sites regularly.

## 7. Quick Build Priorities (for this project)

If implementing in order of impact-to-effort ratio for a DM agency site:
1. Work grid with in-card video autoplay on hover (simpler variant, B above) — ships fast, high visual payoff.
2. Case-study template: Hero → Stat bar (animated counters) → Challenge/Approach (short, 2-col) → Gallery → Results (charts) → Testimonial → Next-project CTA.
3. Animated counters via Framer Motion `useInView` — reusable `<StatCounter value={} suffix={} duration={} />` component.
4. Browser-frame mockup component for web/app screenshots — one reusable wrapper, used across all case studies for consistency.
5. Only after 1-4: layer in the cursor-following hover-modal (A above) for the homepage "Selected Work" section as the signature/differentiating interaction, and a GSAP-pinned horizontal gallery for one flagship case study's image section as a "wow" moment — don't apply horizontal scroll everywhere, reserve it for 1-2 deliberate spots so it stays special.
