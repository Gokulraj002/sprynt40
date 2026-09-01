# SIGNAL build spec (read fully before writing any code)

Award-quality digital marketing agency site. Next.js 16 App Router + TS + Tailwind v4 + `motion` + R3F. Concept: **"noise → signal"** — dark cinematic lab aesthetic; read `.claude/skills/agency-site-director/references/concept-signal.md` and `reference-monkfunnel.md` for the full art direction and funnel skeleton. Deep technique guidance lives in `.claude/skills/agency-*/references/*.md` — read the file matching your task.

## Foundation contracts (already built — import, never modify)

- **Tokens** (`app/globals.css`): use ONLY semantic Tailwind classes — `bg-surface`, `bg-surface-2`, `text-ink`, `text-ink-muted`, `border-line`, `bg-accent`, `text-accent`, `text-accent-ink`, `text-violet`, `bg-base-dark`, `bg-base-light`. Type: `font-display` (Space Grotesk) / `font-sans` (Inter); fluid steps `text-hero`, `text-display`, `text-title`, `text-lead`, `text-label`. Grain overlay: add `grain` prop on Section or `grain` class on a relative container.
- **Theming**: `<Section theme="dark|light">` re-scopes tokens (dark is default). Never hardcode hex.
- **Primitives** (`components/ui/`): `Container`, `Section` (`id`, `theme`, `grain`, `className`), `Button` (`href`, `variant: accent|ink|outline|whatsapp`, `external`), `SectionHeading` (`label`, `title`, `lead`, `align`) + `Em` for italic accent words, `Chip` (`pulse`).
- **Motion** (`lib/motion.ts`): `EASE_OUT`, `DUR`, `STAGGER`, `springPremium`, `springSnappy`, `viewportOnce`, `fadeUp`, `fadeIn`, `staggerParent`, `maskUp`. Import `{ motion } from "motion/react"` in client components only.
- **Data** (`lib/data/`): `site.ts` (`site`, `waLink(text?)`), `services.ts` (`anchorService`, `scaleServices`, `allServices`, type `Service`), `projects.ts` (`projects`, type `Project`), `social-proof.ts` (`logos`, `testimonials`, `stats`), `process.ts` (`processSteps`, `faqs`). ALL copy comes from data files — never hardcode brand strings.
- **Util**: `cn` from `lib/cn.ts`.

## Hard rules

1. Server Components by default; `"use client"` only on leaf components that animate/interact. Copy must be server-rendered or passed as props into client wrappers (SEO).
2. Animate only `transform`/`opacity`/`clip-path`. Entrances: `variants={fadeUp}` + `whileInView="visible"` + `initial="hidden"` + `viewport={viewportOnce}`, staggered via `staggerParent`. Exits faster than entrances.
3. Respect reduced motion: wrap imperative effects behind `useReducedMotion()` from `motion/react`; CSS `motion-reduce:` for keyframe stuff. Pointer-only effects gated by `window.matchMedia("(pointer: fine) and (hover: hover)")` and unmounted on touch.
4. Every interactive element keyboard-accessible with `:focus-visible` styles; semantic HTML (`h2` per section via SectionHeading; one `h1` per page).
5. TypeScript strict, no `any`. No new npm packages. No edits to shared/foundation files, `package.json`, `app/layout.tsx`, `app/page.tsx`, or another agent's files. Create ONLY the files your task lists.
6. Fully self-contained sections: no props, import data directly, export named component.
7. WhatsApp deep link: `waLink("Hi! I want to talk about growth.")` with `external` Button variant `whatsapp`.
8. Don't run the dev server or repo-wide typecheck (other agents' files are still landing); just write correct code.

## Folder structure (phase 2)

- `components/layout/` — Header, NavOverlay, Footer (global chrome)
- `components/home/` — homepage sections (Hero, Services, Work, Proof, Pricing, Teardown, Faq, …)
- `components/shared/` — cross-page sections (BigCta — reuse it as the closer on standalone pages)
- `components/ui/`, `components/fx/`, `components/canvas/`, `components/contact/` — unchanged
- `lib/data/` now also has `posts.ts` (`posts`, type `Post` — body paragraphs, "## " prefix = h2) and `pricing.ts` (`pricingTiers`); `site.ts` gained `footerNav.company` / `footerNav.legal`, and `site.nav` now points at real routes (/services, /process, /work, /pricing, /blog, /about, /contact).

## Standalone page conventions (phase 2)

Every standalone page: dark hero band (text-label eyebrow + single h1 font-display text-display + lead) → light content sections → `<BigCta />` from components/shared as the closer (do NOT rebuild it). Export `metadata` (or generateMetadata). Server components except leaf interactions. Keep each page self-contained; import data from lib/data only.

## Page composition (done by the integrator, not you)

Home: Header → Hero → LogoStrip → Services → Process → Work → Proof → Pricing → Teardown → Faq → BigCta → Footer. Fx mounted globally: SmoothScroll, Cursor.
