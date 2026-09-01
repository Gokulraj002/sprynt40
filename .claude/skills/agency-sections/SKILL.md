---
name: agency-sections
description: Conversion-focused section patterns for the agency website — services presentation, case study/work showcases, testimonials and social proof, CTAs and pricing, contact forms and lead capture. Use this skill whenever building or rewriting ANY page section below the hero — services, work/portfolio, stats, testimonials, pricing, footer CTA, contact page — or when the user asks to "add a section", improve conversions, or present the agency's offer.
---

# Agency Sections

Every section has one job in a conversion narrative: credibility → capability → proof → ask. Design each so it could not be mistaken for a template.

## Services

No card grids. Four premium patterns: (A) numbered editorial list (magazine TOC — most agency-signaling), (B) accordion with image reveal, (C) cursor-follow floating preview (`pointer: fine` gated), (D) sticky-scroll pinned walkthrough (IntersectionObserver active-index, disabled on mobile). **SEO-critical**: each service is a real routed `/services/[slug]` page with own H1/metadata/FAQ schema — the animated hub links out; expand-in-place-only = zero SEO value.

## Work / case studies

Grid hover: cursor-following preview modal (GSAP `quickTo`, layered lag) or in-card crossfade-to-video (touch fallback). Case study structure: results-headline (`[Metric] [direction] in [timeframe]`) → animated stat bar → 2–4 sentence Challenge → Approach → gallery → Results with before/after ("2.1% → 6.4%", never bare deltas) → testimonial → next-project CTA. Count-ups: `useInView` once + `tabular-nums`. Build a reusable `<BrowserFrame>` instead of skeuomorphic device mockups. Horizontal scroll only for one flagship gallery moment.

## Social proof

Static grayscale→color logo grid (6–20 logos) in high-trust zones; marquee only for 20+ logos, 15–25s cycle, pause-on-hover, edge masks. Max 3 badges per cluster (NASCAR effect). Every stat/quote/badge needs named source + date + unit — unsourced claims actively destroy trust with marketing-savvy buyers. Few great testimonials → editorial pull-quotes, not carousels. Stat counters staggered 100–150ms, 1.2–2s ease-out, skip-to-final on reduced motion. Video testimonials: never autoplay, real freeze-frame + lightbox, 30–90s, captioned, paired with a number.

## CTA & pricing

**One CTA goal per page**, restated with escalating specificity (soft ask top → direct ask after proof) — single-CTA pages convert 13.5% vs 10.5% for 5+. Copy: specific/human beats transactional — "Get your growth plan" / "Talk to a human", not "Contact Us". Pricing: tiered packages (decoy middle) for productized; custom-quote + qualifying intake for bespoke; or hybrid with a no-number Custom card. The signature closer on every route: full-bleed big-type footer CTA (clamp 2.5–9rem headline, one button, whileInView stagger). Sticky CTA = one filled nav button; no countdown timers or exit-intent junk.

## Contact & lead capture

Multi-step beats single-page (~13.9% vs 4.5%) when 5+ fields are justified; order low→high friction, contact info LAST. Budget/service/timeline as tap-chip grids (with "not sure yet" escape), never sliders. Spam: honeypot (position-hidden, not display:none) + <2–3s timing check + rate limit + server-side Zod — no CAPTCHA. Stack: Server Actions + `useActionState` + react-hook-form/Zod mirror + Resend + react-email; Cal.com embed for booking; persistent `wa.me` WhatsApp CTA (critical for Indian clients — often outconverts the form).

## References

- `references/09-services-section.md` · `references/10-case-studies.md` · `references/11-social-proof.md` · `references/12-cta-leadgen.md` · `references/13-contact-forms.md` — read the matching file fully before building that section.
