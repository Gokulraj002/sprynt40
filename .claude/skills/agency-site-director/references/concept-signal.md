# Site concept — "SIGNAL" (our unique idea)

**Governing idea:** A digital marketing agency as a *signal laboratory*. The internet is noise; the agency isolates the signal — the one message, channel, and metric that moves a business — and amplifies it. Every design decision expresses noise→signal: chaos resolving into order, scattered particles converging into form, blurred noise sharpening into type.

Positioned as the opposite pole of the monkfunnel reference (their skin: light, cute, pixel-game; ours: dark, cinematic, precise) while reusing its proven conversion skeleton.

## Brand (final — arrived 2026-09-01)
**Sprynt40 — "Grow Loud!"** Orange north-east arrow mark on black; bold geometric sans wordmark. Mark recreated as SVG in `components/ui/Logo.tsx` (swap in the original vector via `public/` when supplied). ALL brand strings live ONLY in `lib/data/site.ts`; phone/email/wa.me/domain still placeholders.

## Art direction (v3 — "Grow Loud", light-first, logo-matched — supersedes v2 below)
- **Light-first**: near-white `oklch(99.1% 0 0)` surfaces carry the site; deep black `oklch(15.5% .004 285)` sections are punctuation (subpage hero bands, Work, Signal Audit, BigCta, footer) echoing the logo's black ground.
- **Accent = logo orange**: `oklch(67% .2 41)` (≈ #f97316 family), brighter `oklch(72% .19 45)` on dark scopes; accent-ink is near-black (black-on-orange, like the logo geometry). Ultramarine and lime are both retired.
- **Type**: Space Grotesk (display, matches the bold wordmark) + Inter. The serif era is over — do not reintroduce Fraunces.
- Header is surface-aware: probes the `[data-theme]` section beneath and mirrors it.
- Hero: light, "Grow *loud*. Cut through the noise." with orange italic; particle field uses zinc-400 + orange points, normal blending (additive washes out on white).

## Art direction (v2 — premium zinc + ultramarine, 21st.dev-informed, 2026-09-01)
- **Theme:** dark-first. Cool zinc near-black `oklch(16.5% .005 285)` hero/footer, near-white `oklch(98.5% 0 0)` mid-sections (section theme switching via `data-theme`), one accent: **electric ultramarine** — `oklch(50% .27 268)` on light scopes, brighter `oklch(67% .21 272)` on dark (hex approx `#4b3ff2` / `#7f6bff`), used ≤10%. Signature treatments from 21st.dev research: `card-lit` (inset lit-from-above dark cards), `card-soft` (huge soft light shadows), gradient hairlines. Lime is retired — never reintroduce it.
- **Type:** Fraunces (variable, opsz/SOFT/WONK) for display — italic key words like the reference but darker attitude; Inter for UI/body. Fluid clamp tokens `--text-hero` 4–10rem.
- **Texture:** SVG feTurbulence grain overlay 4% + one slow mesh-gradient (3 blurred lime/violet blobs) behind the hero canvas.
- **Signature motifs:**
  - Hero: R3F particle field (~4k instanced points) drifting as noise, converging toward a waveform/lens shape near the CTA on mouse/scroll — "noise becomes signal". Static designed fallback for low tier.
  - "Signal chips": scan-line/waveform micro-graphics replacing generic icons; metric chips styled like readouts (`tabular-nums`, tiny pulse dot).
  - Kinetic headline: word-mask reveal, one italic Fraunces word per headline in accent color.
  - Custom cursor (dot + lagged ring, `difference` blend) with "View"/"Open" labels, pointer-fine only.

## Page skeleton (steals the proven funnel)
1. Hero — "We cut through the noise." / italic accent on *noise* → subcopy: one channel, one message, one metric. Dual CTA: solid "Get your growth plan" + WhatsApp "Message us". Thin trust strip.
2. Logo strip (static grayscale→color).
3. Anchor offer card (Performance Marketing engine) + 4 scale cards: SEO, Google Ads, Meta Ads, Funnels/CRO — each links to `/services/[slug]` real pages.
4. Numbered process 01–04 (Audit → Signal map → Launch → Compound) with promise chip "Live campaigns in 14 days".
5. Selected work — results-first cards with metric readout chips, cursor-follow preview on `pointer:fine`.
6. Proof: stat counters + editorial pull-quote testimonials (founder, role, city, metric chip; middle card inverted).
7. Lead magnet: "Free ad-account teardown →".
8. FAQ accordion (real content, FAQ schema).
9. Big-type footer CTA: "Ready when the noise isn't." + one button + reassurance microcopy ("No pitch. 30 useful minutes.").
10. Footer columns + wa.me + tel/mailto.

## Rules
- All copy server-rendered; canvas is atmosphere only.
- Motion vocabulary from `lib/motion.ts` only (expo-out entrances, 0.08s staggers, springs per motion-system skill).
- Section theme switching: IntersectionObserver toggling `data-page-theme` on `<html>`; Tailwind v4 `@theme inline` aliases.
- Quality gates from agency-quality-engineering skill apply before "done".
