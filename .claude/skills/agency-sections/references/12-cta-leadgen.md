# CTAs, Pricing & Lead Generation on Agency Sites

Research for: award-quality digital marketing agency site (Next.js 15 + Tailwind + Motion + R3F).
Goal: convert without looking like a funnel. Premium studios sell confidence, not urgency.

---

## 1. The core tension: premium aesthetic vs. conversion rigor

Two failure modes to avoid:

- **Over-designed, under-converting** (basement.studio pattern): text-link CTAs only, no
  buttons, email addresses instead of forms. Gorgeous, but functions like a portfolio, not
  a lead-gen machine. Fine for a boutique studio that only wants referral-tier inbound;
  wrong model if the brief wants qualified leads at volume.
- **Over-optimized, under-designed** (generic SaaS/marketing-agency template): five
  competing CTAs, exit popups, countdown timers, chat bubbles. Reads as small/desperate —
  the opposite of the "award-quality" positioning this project wants.

**The synthesis that works for a premium agency:** one CTA *goal* repeated 3–4 times down
the page (hero, mid-page after proof, pricing/services, footer), each instance restated in
different copy/visual weight, never more than one primary action visible in the viewport at
once. Data point: SaaS landing pages with a single CTA convert at 13.5% vs. 10.5% for pages
with 5+ CTAs — fewer, repeated, consistent asks beat a scattershot of options.

---

## 2. CTA copy: which verb, and why

### "Book a call" vs "Get a proposal" vs "Start a project" vs "Free audit"

| Copy | Implied friction | Best use | Risk |
|---|---|---|---|
| **Book a call / Schedule a consultation** | Medium — calendar commitment | Agencies selling relationship/strategy (retainer, brand, high-ticket) | Feels like a sales call to a wary visitor; needs trust signals nearby |
| **Get a proposal / Get a quote** | Low-medium — feels like "just information" | Project-based work, defined scope (web build, campaign launch) | Vague on timeline — pair with a micro-promise ("in 48 hours") to kill the "how long will this take" objection |
| **Start a project** | Low — aspirational, non-transactional | Hero CTAs, brand-forward agencies | Vague; needs a second, more concrete CTA nearby for higher-intent visitors |
| **Free audit / Free teardown** | Very low — lead magnet, not a sales ask | Top-of-funnel, colder traffic, performance-marketing-flavored agencies | Can undercut premium positioning if framed as "free stuff"; frame as a diagnostic, not a freebie |
| **Let's talk** | Low, conversational | Footer/closing CTA, big-type sections | Too soft as the *only* CTA on the page — pair with something more specific higher up |

**Actionable pattern — match friction to intent, not just to taste:**
- Cold/scroll traffic at the **top** of the page → lower-friction copy ("See our work",
  "Let's talk") or a value-specific hook ("Free audit: see what's costing you leads").
- Warm traffic that has scrolled past case studies/proof **mid-page and lower** → higher
  intent, so escalate to the real ask ("Book a call", "Get a proposal").
- A/B evidence backs the human/specific framing over generic transactional copy:
  PartnerStack got **+111%** conversion swapping "Book a Demo" → "Get Started"; Mailmodo got
  **+110%** swapping "Book a demo" → "Talk to a Human." The lesson generalizes: specific,
  human, low-jargon copy consistently beats generic transactional verbs. Test agency-specific
  equivalents: "See if we're a fit" instead of "Contact us"; "Talk to a strategist" instead
  of "Book a demo."
- Value-anchored CTA copy ("Book a call — see your 90-day plan") outperformed generic
  copy by a wide margin in B2B tests. For an agency site, attach the CTA to a tangible
  output: not "Contact us" but "Get your growth plan" / "See your audit."

### Lead magnet vs. direct ask — pick one strategy per traffic tier, not per page

- **Audit/teardown offers** work because they're a diagnostic the visitor already wants
  ("what's wrong with my site/ads/SEO right now") — genuinely qualifying, since only people
  who suspect a problem will hand over info to get one. Agencies using an embedded audit
  tool as the primary top-of-funnel CTA have reported meaningfully higher lead volume than
  a plain contact form — but the tradeoff is lead *quality* dips (colder, more DIY-curious
  visitors) unless the audit is gated behind enough friction (real domain + email, not just
  email).
- **Book-a-call CTAs** convert lower-volume but higher-intent leads — better for high-ticket
  retainers where a 15-minute call is the qualifying step anyway.
- **For a portfolio-forward agency site, the practical move:** use the *soft* ask ("Let's
  talk" / "Start a project") everywhere as the primary path, and offer the audit/free-value
  lead magnet as a **secondary, lower-commitment option** near case studies or in the
  services section — not competing for the same visual weight as the primary CTA.

---

## 3. Placement strategy across the page

Benchmarked pattern across ~2,000 B2B sites analyzed in aggregate:

- **Hero section**: ~85% of visitors see it; CTA here drives the largest lift (~20–30%
  relative). This is non-negotiable real estate — always have a primary CTA in/near the
  hero, but it doesn't have to be a boxy button; on award-tier sites it's often a text
  link with a strong hover state, or a single pill button paired with a secondary
  "See our work" link (primary = conversion, secondary = de-risking exploration).
- **Mid-page, after social proof/case studies**: ~45% visibility, ~10–15% lift. This is
  where the CTA should escalate in specificity — visitors here have already seen results,
  so ask directly ("Book a call to talk about [category]").
- **Footer**: ~25% visibility but still worth 5–8% lift — and disproportionately important
  for *brand feel* on agency sites. This is where "big type" full-bleed CTA sections
  (see §5) live — the visitors who reach it are the most qualified (they scrolled the
  whole site), so this CTA can be the most direct/high-commitment one on the page.
- **Never place a CTA that interrupts an in-progress reading task** (e.g., mid-case-study,
  mid-paragraph) — it reads as desperate. Let sections *resolve* before asking.

**Rule of one repeated goal:** design CTAs as restatements of a single action across the
page (e.g., all point to the same contact/booking flow) with escalating specificity, not as
three separate offers competing for attention. On a services or work page, a persistent
plan is: hero (soft), after proof (direct), footer (direct + big type), plus an always-
available sticky element for high-intent visitors who already know what they want (§4).

---

## 4. Sticky CTAs — do them, but subtly

Rules distilled from CRO practice, adapted for premium/agency tone:

1. **One action only.** A sticky bar with 2–3 buttons converts worse than one. Pick the
   single most valuable next step (usually "Book a call" or "Contact") and commit.
2. **Don't show it instantly.** Fade/slide it in after a scroll threshold (e.g., past the
   hero, ~600–800px, or after the first case study) so it reads as "available when you're
   ready" rather than "grabbing you at the door." This is easy to implement with Motion's
   `useScroll`/`useMotionValueEvent` + a translateY/opacity spring.
   `whileInView`-triggered mount, or a `IntersectionObserver` flip on a sentinel div past
   the hero, is the standard pattern in Next.js/Framer builds.
3. **Small footprint, especially on mobile.** A slim bottom bar (not a full-screen takeover)
   with a single button; never cover more than ~10–12% of viewport height.
4. **Never cover content.** Reserve bottom padding on the page (`padding-bottom` matching
   sticky bar height) so it doesn't obscure a final CTA or footer form when it appears.
5. **Match the site's restraint.** On a premium/award-style build, prefer a minimal
   floating pill/button (just an icon + one word, expanding to full label on hover/scroll-
   up) over a bar with copy — it should feel like a UI affordance, not an ad.
6. **Desktop: consider a persistent nav-bar CTA instead of a separate sticky element** —
   many award-winning agency sites solve "always-available CTA" by keeping one button
   permanently in the top nav (often the only filled/colored button among otherwise
   ghost/text nav links), which avoids a separate sticky-bar treatment entirely. This is
   often the most tasteful solution for this project's aesthetic bar.

---

## 5. Footer CTA sections with big type — the "closer" moment

This is the single most reliable premium-agency pattern and worth building as a dedicated
reusable component:

- **Structure**: full-viewport-height or near-full-height section, dark or high-contrast
  background distinct from the rest of the page (signals "final answer"), massive
  headline (often 8–15vw clamp'd type, sometimes filling the whole section edge-to-edge),
  one CTA button/link, minimal supporting copy (one line max, often just an email address
  or "we reply within 24 hours").
- **Copy pattern**: short, second-person, slightly informal — "Let's build something.",
  "Got a project in mind?", "Ready when you are." — followed by a single button ("Start a
  conversation", "Get in touch", "Book a call").
- **Motion treatment**: this is prime real estate for a scroll-triggered reveal — headline
  characters/words staggering in via Motion `whileInView`, or a subtle magnetic-cursor
  effect on the CTA button/link (cursor gets pulled toward the button within a radius) —
  a very common Awwwards-tier micro-interaction that reads as craft rather than gimmick.
- **Secondary info nearby, de-emphasized**: email, social links, office locations/timezone,
  sometimes a "response time" trust signal ("We respond within 1 business day") — placed
  below or beside the giant CTA, never competing with it in size/weight.
- **Practical Tailwind/Next approach**: `clamp()`-based fluid type
  (`text-[clamp(2.5rem,10vw,9rem)]`) for the headline, a single flex/grid section, and treat
  this as its own top-level section component (`<ClosingCTA />`) reused verbatim as the
  final section on every page (home, services, work, about) — consistency here reinforces
  brand recall across the site, and it doubles as the natural place to route all page-level
  "soft" CTAs once a visitor reaches the bottom.

---

## 6. Pricing page approaches: packages vs. custom quote

Three viable models for a marketing agency; the right choice depends on service
complexity, not on design taste alone:

### A. Tiered packages (Bronze/Silver/Gold or Starter/Growth/Scale)
- **When it works**: productized services with fairly fixed scope (SEO starter package,
  social management retainer, PPC management at defined spend tiers).
- **Design pattern**: 3 columns, middle tier visually emphasized (larger card, "Most
  popular" badge, slightly elevated/bordered) — classic decoy-effect layout where the
  middle option is the one you actually want chosen, flanked by a cheaper option that
  feels limited and a premium option that anchors the middle as reasonable.
  Note the anchoring vs. decoy distinction: **anchoring** = showing a higher number first
  so the real price feels smaller by contrast (e.g., "Enterprise: custom" or a high top-
  tier price listed first/largest, priming the value scale); **decoy** = a deliberately
  less-attractive middle option engineered to push people toward the target tier. Use
  anchoring by listing the highest-value tier's outcomes prominently; use the decoy
  structure by making the cheapest tier visibly scope-limited.
- **Copy trick for the "starting at" objection**: always pair a number with a scope
  qualifier — "$3,000/mo — includes 2 channels" beats a bare price, because bare numbers
  invite "compared to what?" pushback.

### B. Custom quote only ("Let's talk about your project")
- **When it works**: strategy/branding/bespoke web builds, high-ticket retainers, agencies
  positioning as boutique/premium rather than commodity/productized. This is the dominant
  pattern among award-winning creative agencies — pricing pages are rare among Awwwards-
  tier studios; the "pricing page" is instead a qualifying contact/brief form.
- **Design pattern**: replace the price grid with a **qualifying intake flow** — a short
  multi-step form or a single richly-designed contact page asking budget range (as a
  select, not free text: "$10k–25k / $25k–50k / $50k+"), project type, and timeline. This
  filters for fit without ever printing a number, which protects premium positioning
  (numbers on a page invite direct competitor comparison; a conversation doesn't).
- **Trust-building substitute for a price**: show *proof of value* instead of cost — case
  study metrics, client logos, a "process" timeline section — so the visitor mentally
  justifies "this is worth asking about" before hitting the form.

### C. Hybrid (increasingly the 2025–2026 norm)
- Publish clear starting-price packages for productized/lower-ticket services, and route
  everything custom/high-ticket to "Get a proposal." This resolves the tension: SEO-driven
  cold traffic gets an immediate, scannable price (reduces bounce from "no pricing
  transparency" complaints), while the agency's actual highest-margin bespoke work stays
  behind a qualifying conversation.
- **Practical build note**: a `/pricing` route can show 2–3 productized package cards +
  one "Custom / Enterprise" card that always says "Get a proposal" instead of a number —
  reuse the same card component with a `custom: boolean` prop that swaps the price for a
  CTA.

### General pricing-page conversion notes
- Full-service agency pricing in the market genuinely spans **$5,000–$50,000+/month**
  depending on channels/scope — if publishing any numbers, anchor them against this range
  explicitly ("most engagements start around $X") so visitors self-select before contact,
  reducing unqualified inbound.
- Never leave a pricing/proposal CTA as a dead end — the button should route to a
  short-form (name, email, budget range, project type) not a generic "Contact Us" wall;
  every field of friction removed increases completion.

---

## 7. Lead magnet / audit-offer mechanics (if used)

- **Position as diagnostic, not freebie.** Copy like "See what's holding your funnel back"
  outperforms "Get your free audit" for a premium-positioned brand — same offer, less
  "free stuff" framing, more "expert diagnosis" framing.
- **Gate lightly.** Require domain/URL + email only; every extra field (phone, company
  size, budget) measurably drops completion. Save qualifying questions for the follow-up
  call, not the form.
- **Deliver fast or show progress.** Tools that generate an audit "in seconds" (even if
  it's actually a templated report + human follow-up) significantly outperform "we'll email
  you within 48 hours" — perceived speed matters more than actual depth at the point of
  conversion.
- **Use it as a secondary CTA, not the hero's only ask**, unless the agency's whole
  positioning is performance-marketing/audit-led (e.g., an SEO- or PPC-focused agency
  where "free audit" IS the brand promise). For a broader creative/digital agency, keep
  audit offers to a dedicated services or resources section, not competing with "Book a
  call" in the hero.

---

## 8. Conversion tactics that will visibly cheapen an award-quality build — avoid these

- Countdown timers / fake urgency ("Only 2 spots left this month") — reads as low-trust on
  a portfolio-driven agency site; save urgency framing (if any) for actual capacity
  constraints stated plainly ("We take on 3 new clients per quarter").
- Exit-intent popups with discount codes — fine for e-commerce, wrong register for a
  service agency; if used at all, a single subtle exit-intent offering the audit lead
  magnet (not a "wait, come back!" discount) is the only version that fits.
  Recommendation: skip exit-intent entirely for this build.
- More than one color/style of button competing on a single view — pick one CTA visual
  language (color, shape, weight) sitewide; secondary actions should be ghost/text-link
  style so the primary CTA color always reads as "the one true action."
  Same principle in §1: multiple CTA styles fighting for attention reads as amateur, no
  matter how good the type or animation is.
- Chat widgets that pop open unprompted — if using live chat/Intercom-style support, keep
  it collapsed by default; an unprompted chat bubble undercuts the confident, uncluttered
  feel of an awards-tier layout.
- Overly long, multi-field forms as the *first* touchpoint — always offer a low-friction
  first step (email only, or a calendar link) and push qualifying questions later in the
  funnel (post-booking form, or the sales call itself).

---

## 9. Concrete component/build recommendations for this project

1. **`<HeroCTA />`**: primary button (filled, brand color) + secondary text link ("View our
   work"), both routing distinctly — button to contact/booking, link to portfolio anchor.
2. **`<StickyContactPill />`**: appears via Motion `whileInView`/scroll-threshold, single
   icon+label pill bottom-right (desktop) or slim bottom bar (mobile), links to the same
   contact target as hero CTA — OR skip this entirely and put the persistent CTA in the
   nav bar as the one filled button among ghost nav links (recommended default for this
   aesthetic).
3. **`<ClosingCTA />`**: reusable full-bleed, high-contrast, fluid-type section, used as the
   final section on every route; scroll-triggered stagger reveal on headline, magnetic-
   cursor hover state on the button.
4. **`/pricing`**: hybrid model — 2–3 productized package cards with anchor pricing + one
   "Custom" card with no number, "Get a proposal" CTA, routing to a short qualifying form
   (project type, budget range as a select, timeline).
5. **Contact/proposal form**: max 4 fields for step one (name, email, budget range,
   one-line project description); anything else deferred to a follow-up call — this is
   the actual conversion point all the CTAs above are funneling toward, so it should get
   proportionally more design/UX attention than any single button.

---

## Sources

- [Best Call to Action Examples for PPC Landing Pages in 2025](https://swipepages.com/blog/call-to-action-examples/)
- [20 Best CTA on Landing Page Examples & Inspirations](https://landingi.com/blog/cta-on-landing-pages-playbook-examples/)
- [8 Steps To Writing CTA Copy That Motivates Action](https://www.klientboost.com/landing-pages/call-to-action-copy/)
- [Weak Call to Action in Proposals](https://www.buzzboard.ai/the-call-to-action-conundrum-strengthening-ctas-in-proposals-for-small-businesses/)
- [Digital Marketing Agency Pricing: 2026 Cost Guides](https://clicksgeek.com/digital-marketing-agency-pricing/)
- [Digital Marketing Pricing: How Much Does It Cost in 2026?](https://www.webfx.com/digital-marketing/pricing/)
- [Digital Marketing Packages, Pricing Guide](https://colorwhistle.com/build-your-digital-marketing-packages/)
- [Digital Marketing Agency Pricing Guide 2026](https://influenceflow.io/resources/digital-marketing-agency-pricing-complete-2026-guide-to-costs-models-roi/)
- [Best Web Agencies Websites — Awwwards](https://www.awwwards.com/websites/design-agencies/)
- [Best Footer Design in Websites — Awwwards](https://www.awwwards.com/websites/footer-design/)
- [Sticky CTA Buttons: Best Practices & Examples](https://www.digitalxlabs.io/blogs/web-design/sticky-cta-design)
- [Sticky CTAs on Service Pages: A Practical Guide](https://contentthatsales.com/sticky-cta-service-page/)
- [7 Key CTA Design Rules + Examples From 9-Figure Brands](https://www.crazyegg.com/blog/cta-design/)
- [How to use free audits as a lead generation tool](https://insites.com/how-to-use-free-audits-as-a-lead-generation-tool-for-your-marketing-agency)
- [Agency SEO audit widget for generating leads](https://insites.com/agency-lead-magnet/)
- [19 Lead Magnet Ideas for Your Digital Marketing Agency](https://agencyanalytics.com/blog/marketing-agency-lead-magnets)
- [basement.studio](https://basement.studio/)
- [Framer Blog: 11 Best Marketing Agency Websites and What Works](https://www.framer.com/blog/marketing-agency-websites/)
- [Data-Driven B2B SaaS Landing Page CTA Best Practices](https://www.saashero.net/design/b2b-saas-landing-cta-practices/)
- [Landing Page CTA Placement Guide](https://www.saashero.net/design/landing-page-design-cta-placement/)
- [CTA Button Conversion Rate Benchmarks 2026](https://foundrycro.com/blog/cta-button-conversion-rate-benchmarks-2026/)
- [Digital Psychology: How to Use It to Optimise Your B2B Web Design](https://nerdcow.co.uk/blog/digital-psychology/)
- [Positioning decoy pricing to shape how customers perceive value](https://www.simon-kucher.com/en/insights/positioning-decoy-pricing-shape-how-customers-perceive-value)
- [How Does Anchoring Psychology Shape Customer Decisions on Pricing Pages](https://www.getmonetizely.com/articles/how-does-anchoring-psychology-shape-customer-decisions-on-your-saas-pricing-page)
