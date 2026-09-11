# Sprynt40

Marketing site for Sprynt40. Next.js App Router, TypeScript, Tailwind CSS v4,
Motion, and React Three Fiber.

**Proprietary — all rights reserved.** See [LICENSE](LICENSE) and [NOTICE](NOTICE).

## Requirements

- Node.js 20 or newer

## Getting started

```bash
npm install
npm run dev
```

The site runs at http://localhost:3000.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint with ESLint |

## Structure

```
src/
  app/                 Routes (App Router)
    (legal)/           Privacy, terms, refund policy — group, not a URL segment
    services/[slug]/   Service detail pages
    work/[slug]/       Case study pages
  components/
    ui/                Reusable primitives — Button, Section, PageHero, BigCta
    layout/            Header, Footer, NavOverlay
    canvas/            React Three Fiber scenes
    fx/                Cursor, smooth scroll, scroll progress
    home|about|services|contact/   Page-specific composites
  lib/
    data/              Site content — copy, services, projects, social proof
    actions/           Server actions
    fonts.ts  motion.ts  cn.ts  jsonld.tsx
public/images/         Static assets
```

`@/*` resolves to `src/*`.

## Content edits

Most copy lives in [`src/lib/data/`](src/lib/data/). Brand name, contact details,
and navigation are centralised in [`src/lib/data/site.ts`](src/lib/data/site.ts).

## Before launch

- `src/lib/actions/contact.ts` logs leads only — wire it to an email or CRM provider.
