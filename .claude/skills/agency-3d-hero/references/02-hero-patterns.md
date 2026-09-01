# Hero Section Patterns — Award-Winning Agency Sites

Research for: DIGITAL MARKETING AGENCY site. Stack: Next.js 15 App Router + Tailwind + Motion (Framer Motion) + Three.js/R3F.

## 1. The Five Dominant Hero Archetypes

### A. Oversized Kinetic Typography Hero
Massive headline (often 8vw–14vw / clamp-based) as the entire visual payload — no image needed. Words/lines/chars animate in on load, sometimes continue reacting to scroll or cursor.
- **When to use**: agency wants to lead with voice/positioning, not imagery. Cheapest to build well, fastest to load — ideal default for a marketing agency.
- **Structure**: headline + 1-line subhead (value prop) + CTA, stacked, huge negative space around type.
- **Examples**: Obys Agency (editorial art-direction, typographic motion — "static frames already look like posters"), Mat Voyce portfolio (Awwwards SOTD + GSAP SOTY 2025 nominee for "kinetic typography that earns its motion"), Locomotive (Montreal — "smooth navigation, impactful animations, true mastery").
- **Do**: split text into words/lines (not full paragraphs) for animation; keep kinetic motion OFF body copy/nav — readability there matters more than spectacle; use variable fonts for weight-morph effects.
- **Don't**: animate every character in long headlines (>10 words) — it reads as slow, not premium. Cap character-level splits to short headlines (<6 words).

### B. WebGL / Three.js / Canvas Hero
Full-bleed shader background, particle field, 3D object, or fluid/cursor-reactive distortion, with typography overlaid.
- **When to use**: agency wants to signal technical craft (dev-heavy agencies, "creative technologist" positioning). Highest wow-factor, highest engineering cost, biggest performance risk.
- **Examples**: Lusion ("perhaps the most influential WebGL/shader studio working today"; site + Oryzo project won Awwwards Site of the Month + Developer Award); Active Theory ("world-leading interactive design studio... physics-based interactions, futuristic immersive storytelling"); Resn ("playful, character-driven interactive experiences... long-running fixture in award shortlists"); Matt Bierman portfolio (WebGL + Three.js + ASCII hero); Immersive Garden (Cartier Watches & Wonders — self-contained 3D alcoves, Awwwards SOTD).
- **Implementation notes (R3F)**:
  - Gate the WebGL canvas behind a `prefers-reduced-motion` + mobile/low-end-GPU check; ship a static-gradient or CSS-only fallback tier (see `r3f-portfolio-3d` skill).
  - Keep particle counts and shader complexity scroll-linked rather than always-animating to control CPU/GPU budget.
  - Lazy-mount the `<Canvas>` client-side only (`dynamic(() => import(...), { ssr: false })` in Next.js) so it never blocks first paint/LCP.
  - Overlay DOM typography (real HTML, not canvas text) on top for SEO + accessibility + crisp CTA hit targets.
- **Don't**: let WebGL delay Largest Contentful Paint — render the headline/CTA in HTML immediately, let the canvas hero fade in behind/around it.

### C. Video Hero
Full-bleed looping background video (muted, autoplay) behind headline + CTA, or a video that IS the hero (product demo, brand film).
- **When to use**: strong existing brand film/reel, or service is visually demonstrable (motion work, campaigns). Video hero "catches and holds attention in the first critical few seconds while keeping the CTA in front of them longer."
- **Do**: keep it short and loopable (8–15s), muted, `playsinline`, poster-frame fallback, compress aggressively (target <3–5MB for a hero loop), lazy-load below a lightweight first-paint gradient/poster so LCP isn't blocked by video weight.
- **Example pattern**: Public Library Agency — clean white left panel + stylish video right panel (split-screen + video combined, see below).
- **Don't**: use video as the sole background with no compressed poster image — first paint suffers on slow connections.

### D. Split / Asymmetric Layout Hero
Two (or more) unequal zones — typically 60/40 or 70/30 — one side carries the headline + CTA, the other carries visual proof (video, rotating case-study thumbnails, 3D object, client logo marquee).
- **When to use**: agency needs the hero to do double duty — brand voice AND immediate credibility/work-proof — without a second scroll.
- **Do**: let the smaller panel be the "evidence" panel (client logos, a looping reel, a stat ticker) so the CTA side stays uncluttered; break the grid intentionally (headline overlapping the divider, or one panel bleeding off-viewport) — that's what separates "asymmetric" from "just two columns."
- **Examples**: Wade and Leta ("unconventional hero, asymmetrical grids, bold color pairings"), Pinpoint CGI ("visible grids... arrangement changes with independent scrolling"), Hyumankind Agency ("uneven split with different functionalities").
- **Don't**: make both panels equal-weight 50/50 — that reads as a template, not art direction. Asymmetry (55/45 minimum skew, ideally 60/40+) is the signal of intentional design.

### E. Full-bleed Static/Editorial Hero with Motion Accents
Large single image or bold color field, minimal on-load animation (fade/slide only), relying on typography scale and whitespace rather than tech spectacle.
- **When to use**: when performance/SEO is prioritized over spectacle, or brand tone is confident/restrained rather than experimental. This is the safest "premium but fast" default and a good baseline to layer motion onto incrementally.

## 2. Above-the-Fold Conversion Checklist (applies to ALL archetypes)

A hero, however elaborate, must still convert:
1. **One value proposition, one CTA.** "The best hero section examples all lead with one clear value proposition and a single focused CTA." Resist adding a second competing button in the hero.
2. **CTA copy is a verb + outcome**, not "Learn More" — e.g., "Start Your Project," "See Our Work," "Book a Strategy Call."
3. **CTA must be visually distinct** — contrasting color/weight against the hero background, and its hit target must survive whatever WebGL/video is behind it (test tap targets on mobile after any 3D/video hero build).
4. **Keep the CTA in frame** even during entrance animation — don't have it fly in 2+ seconds after the headline; cap total hero choreography at ~1.2–1.8s so the CTA is interactive quickly.
5. **Trust/proof signal near the fold**: client-logo strip, a stat ("200+ campaigns launched"), or a one-line social proof — placed either inside the split-hero's secondary panel or immediately below the fold, not fighting the headline for attention.
6. **Never let entrance animation block interaction** — set `pointer-events` correctly during intro so users who scroll/click early aren't ignored; the CTA button should be clickable even mid-animation if `opacity`/`transform` allow.

## 3. Headline Reveal Choreography — Concrete Timing/Easing Values

Distilled from GSAP/SplitText and Framer Motion practice for hero headline reveals:

**Split strategy** — pick ONE:
- **Line-level split** (2–4 lines): best default for agency headlines; each line masked and slides up.
- **Word-level split**: good middle ground for medium headlines (5–10 words); staggers per word.
- **Char-level split**: only for short punchy headlines (<6 words) or logotype-style reveals; feels gimmicky on long copy.

**Timing (hero-scale, i.e., first thing the user sees):**
- Per-word duration: **~0.5s**, `power3.out` / `power4.out` / `expo.out` easing (snap-in, decelerate hard — avoids the "floaty" feel of `easeInOut`).
- Word/line stagger: **~0.08–0.12s** between items so a 4–6 word headline fully resolves in **under ~1s** total.
- Char-level stagger (when used): **~0.02s (20ms)** between characters → ~400ms cascade for a short word; fast enough to feel snappy, slow enough to still read as sequential.
- Y-offset for line/word reveal: translate from **20–40px** below (not more — large offsets read as janky on hero-scale type) combined with opacity 0→1 and a clip-path or overflow-mask so text appears to rise "through" a mask line rather than just fading.
- Total hero intro budget: **1.0–1.8s** from first paint to fully-settled headline + visible CTA. Longer than ~2s starts to feel like the site is making the user wait.
- Subhead + CTA: delay start until headline is ~60–70% through its stagger (not fully done) — overlapping entrances feel choreographed rather than a slow queue of sequential reveals.
- Easing family: prefer **exponential/power-out curves** (`power3.out`, `power4.out`, `expo.out`) for entrances — sharp start, soft landing. Avoid linear or bouncy easings for premium/agency tone; save spring/bounce for playful micro-interactions elsewhere, not the primary hero statement.

**Framer Motion equivalent values** (translating the above into Motion primitives):
```
variants: hidden -> visible
  hidden: { y: 32, opacity: 0 }
  visible: { y: 0, opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } // expo-out cubic-bezier
staggerChildren: 0.09
delayChildren: 0.05
```
Use `useReducedMotion()` to collapse all of this to a simple opacity fade (0.3s) for accessibility.

## 4. Do / Don't Summary

**Do**
- Lead with one sentence of positioning + one CTA; everything else is secondary.
- Mask/clip text reveals (overflow-hidden parent + translateY child) rather than raw opacity fades — reads far more "designed."
- Keep hero animation budget under ~1.8s; CTA interactive almost immediately.
- Use `prefers-reduced-motion` and a mobile-tier fallback for any WebGL/video hero (static tier — gradient/poster image).
- Make asymmetry deliberate: 60/40 or steeper splits, elements bleeding off-canvas, overlapping type/panels.
- Render critical text as real HTML/DOM (not canvas-drawn) for SEO + accessibility, even inside a WebGL hero.
- Compress/lazy-load heavy media (video, 3D assets) behind an immediate lightweight first paint.

**Don't**
- Animate every character of a long headline — slows perceived load and annoys repeat visitors.
- Use two competing CTAs in the hero.
- Let a WebGL canvas or hero video block LCP — always have instant text/CTA paint first.
- Make split-hero panels perfectly 50/50 — reads as generic template.
- Use bouncy/elastic easing for the primary headline entrance — reserve for smaller playful accents.
- Rely on autoplay video with sound or with no compressed poster fallback.
- Let scroll-jacking or heavy intro animations trap users who want to skip straight to content — always allow scroll/click to bypass or fast-forward the intro.

## 5. Named Example Sites (5+)

1. **Lusion** (lusion.co) — WebGL/shader studio-grade hero; cursor-reactive particle/material work; Oryzo project won Awwwards Site of the Month + Developer Award (2026).
2. **Obys Agency** (obys.agency) — Editorial art direction, typographic-motion hero; "static frames already look like posters" — benchmark for kinetic-typography restraint.
3. **Active Theory** (activetheory.net) — Immersive WebGL heroes, physics-based interaction, futuristic storytelling; world-leading interactive studio.
4. **Resn** (resn.co.nz) — Playful, character-driven WebGL/canvas hero work with strong craft and humor; long-running Awwwards shortlist fixture.
5. **Locomotive** (locomotive.ca) — Montreal agency; smooth-scroll + impactful animation hero, model for premium showcase sites (also the team behind the Locomotive Scroll library).
6. **Mat Voyce Portfolio** — Awwwards Site of the Day + GSAP Site of the Year 2025 nominee specifically for kinetic-typography hero execution.
7. **Immersive Garden** (Cartier Watches & Wonders project) — 3D-alcove hero storytelling, Awwwards Site of the Day; example of WebGL hero used for narrative/product staging rather than abstract effect.
8. **Matt Bierman Portfolio** — Interactive WebGL hero combining Three.js + ASCII-art rendering as a distinctive visual signature.

## 6. Implementation Checklist for This Project (Next.js 15 + Tailwind + Motion + R3F)

- [ ] Choose ONE primary archetype (recommend: kinetic-typography hero as base, optionally layer a subtle R3F particle/gradient background per the `r3f-portfolio-3d` skill — hybrid of A + B is the current award-site sweet spot).
- [ ] Build headline with `overflow-hidden` line wrappers + Motion `staggerChildren` per timing values above.
- [ ] Mount any `<Canvas>` via `next/dynamic` with `ssr:false`; provide static gradient fallback for reduced-motion/mobile/low-tier GPU.
- [ ] Single CTA, verb-led copy, contrasting color, interactive within ~1s of load.
- [ ] Add a thin trust strip (client logos or a stat) directly under the hero fold, not inside the animated headline block.
- [ ] Test LCP with Lighthouse — hero text/CTA must paint before any heavy WebGL/video asset finishes loading.
- [ ] Respect `prefers-reduced-motion`: collapse all stagger/transform choreography to a simple ≤0.3s opacity fade.
