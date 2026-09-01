# Next.js 15 App Router Architecture for an Award-Quality Marketing Site

Stack assumed: Next.js 15 (App Router), TypeScript, Tailwind CSS, Motion (formerly Framer Motion), Three.js/R3F. Goal: a small (10-20 page/section) agency marketing site — NOT a SaaS app. Bias every decision toward less JS, fewer deps, fewer moving parts.

## 1. Core principle: this is a static-first content site, not an app

A digital agency site has no auth, no database-backed user state, no dashboards. That means:

- Almost everything should be a **Server Component**, statically rendered at build time (`generateStaticParams` / default static rendering) or ISR'd if content is CMS-driven.
- Client Components are the **exception**, reserved for anything that touches `useState`, `useEffect`, browser APIs, event handlers, Motion animations, or R3F canvases.
- There is no reason to reach for Redux/Zustand/React Query on a marketing site — local `useState`/`useRef` and URL state cover everything (a filter on a case-studies grid, a mobile nav toggle, a lightbox).

This single framing eliminates most bloat before it starts.

## 2. Recommended folder tree

```
src/
  app/
    layout.tsx                 # root layout: fonts, <html>, global providers (theme), analytics
    page.tsx                   # homepage
    globals.css                # Tailwind entry + CSS variables/tokens
    (marketing)/                # route group, no URL segment — optional but keeps app/ tidy
      about/page.tsx
      work/page.tsx
      work/[slug]/page.tsx      # case study detail
      services/page.tsx
      services/[slug]/page.tsx
      contact/page.tsx
      blog/page.tsx              # only if you actually blog — else delete
      blog/[slug]/page.tsx
    api/
      contact/route.ts          # form submission handler (Route Handler)
    sitemap.ts                  # dynamic sitemap via MetadataRoute.Sitemap
    robots.ts
    opengraph-image.tsx         # optional, generated OG image
    not-found.tsx
    error.tsx
  components/
    sections/                   # page-level composed sections (Hero, Services, CaseStudyGrid, CTA, Footer)
      Hero.tsx
      LogoMarquee.tsx
      ServicesGrid.tsx
      CaseStudyGrid.tsx
      Testimonials.tsx
      ContactCTA.tsx
      SiteFooter.tsx
      SiteHeader.tsx
    ui/                         # small reusable primitives (Button, Badge, Container, Marquee)
      Button.tsx
      Container.tsx
      MagneticButton.tsx        # client component (motion)
      RevealText.tsx            # client component (motion)
    canvas/                     # all R3F/Three code isolated here, lazy-loaded
      HeroScene.tsx
      ParticleField.tsx
      SceneCanvas.tsx           # wraps <Canvas> with dynamic import + fallback
    providers/
      MotionProvider.tsx        # LazyMotion / MotionConfig wrapper, if used
      SmoothScrollProvider.tsx  # only if using Lenis; otherwise skip
  lib/
    data.ts                     # or content/*.ts — typed content objects (services, projects, team)
    constants.ts                # site metadata, nav links, social links
    utils.ts                    # cn() helper, formatters
    animations.ts                # shared Motion variants (fadeUp, stagger, etc.)
    fonts.ts                    # next/font definitions
    metadata.ts                 # helper to build per-page Metadata objects
    validations.ts               # zod schema for contact form
  content/                      # OPTIONAL: MDX files if using MDX for case studies/blog
    work/agency-x.mdx
    blog/post-1.mdx
  types/
    index.ts                    # shared TS types (Project, Service, TeamMember)
  hooks/
    useMediaQuery.ts
    useScrollProgress.ts
public/
  images/                       # only truly static, hand-placed assets (favicons, og fallback)
  fonts/                        # self-hosted font files if not using next/font/google
```

Notes:
- Route group `(marketing)` is optional here since the whole site IS marketing — only introduce it if you later add a separate `(admin)` or auth area. Don't add ceremony you don't need.
- Keep `app/` limited to routing files (`page`, `layout`, `loading`, `error`, `not-found`, route handlers) plus colocated `page`-only helpers. Everything reusable lives in `components/`, `lib/`.
- `components/sections` vs `components/ui` is the key split: sections are page-specific composed blocks (server by default, may import client children); ui is small generic primitives, many of which are client components because they animate or handle interaction.
- `components/canvas/` isolates all Three.js/R3F code so it can be dynamically imported with `ssr: false` and code-split away from users who never scroll to it or on reduced-motion/low-end devices.

## 3. Server vs Client component split (concrete rules)

**Default to Server Component. Add `"use client"` only when a component needs one of:**
1. `useState`, `useReducer`, `useEffect`, `useRef` for DOM/animation
2. Event handlers (`onClick`, `onChange`, scroll listeners)
3. Motion/Framer Motion primitives (`motion.div`, `AnimatePresence`, `useScroll`, `useTransform`)
4. React Three Fiber (`<Canvas>`, hooks like `useFrame`)
5. Browser-only APIs (`window`, `IntersectionObserver`, `matchMedia`)
6. Third-party client libs (embla-carousel, lenis, etc.)

**Pattern for an animated marketing page:**
```tsx
// app/page.tsx — Server Component (no directive)
import { Hero } from "@/components/sections/Hero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { services } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <Hero />                              {/* client internally, but composed here on server */}
      <ServicesGrid services={services} />  {/* data fetched/passed server-side, rendered as server markup with client "reveal" wrapper */}
    </>
  );
}
```

```tsx
// components/sections/Hero.tsx
"use client"; // only because it animates
import { motion } from "motion/react";

export function Hero() {
  return (
    <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
      <h1>...</h1>
    </motion.section>
  );
}
```

**Push the client boundary as deep as possible.** Instead of marking a whole page or a whole section `"use client"`, wrap only the animated element:
```tsx
// components/ui/RevealOnScroll.tsx — "use client"
export function RevealOnScroll({ children }: { children: React.ReactNode }) {
  return <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} viewport={{ once: true }}>{children}</motion.div>;
}
```
```tsx
// components/sections/ServicesGrid.tsx — stays a Server Component
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
export function ServicesGrid({ services }: Props) {
  return (
    <div className="grid grid-cols-3 gap-8">
      {services.map((s) => (
        <RevealOnScroll key={s.slug}><ServiceCard {...s} /></RevealOnScroll>
      ))}
    </div>
  );
}
```
This keeps data-heavy/text-heavy markup server-rendered (better TTFB, smaller client bundle, better SEO) while only the thin animation wrapper ships JS.

**R3F/Three.js isolation:** always dynamically import canvas components with `next/dynamic` and `ssr: false`, and gate behind viewport/reduced-motion checks:
```tsx
const HeroScene = dynamic(() => import("@/components/canvas/HeroScene"), { ssr: false, loading: () => <HeroFallback /> });
```
This is the single biggest lever against bloat/slow LCP on a 3D-heavy agency site — Three.js/R3F/drei should never block first paint or ship to users who never trigger it (respect `prefers-reduced-motion`, and consider skipping WebGL on low-end/mobile with a static gradient/image fallback).

## 4. Content management: constants/data files vs MDX vs headless CMS

For an agency site, pick based on **who edits content and how often**:

| Approach | When to use | Tradeoffs |
|---|---|---|
| **TS/JSON data files in `lib/data.ts`** | Default choice. Content changes via PRs (dev-maintained). Case studies, services, team, testimonials are structured and few (<30 items). | Zero dependencies, fully type-safe, fastest builds, no runtime fetch. Non-devs can't edit without a PR. |
| **MDX (`next-mdx-remote` or `@next/mdx`)** | You want rich, per-case-study long-form content with embedded custom components (e.g., a case study with an inline before/after slider). | Adds a build dependency; still git-based so non-devs still need PRs (or a CMS on top, e.g. Contentlayer/Velite for typed MDX). Good middle ground. |
| **Headless CMS (Sanity/Contentful/Payload)** | Client/marketing team needs to self-serve edit content without a developer; blog cadence is high; you need preview/draft mode. | Adds an external service, API calls, webhook revalidation (`revalidateTag`/`revalidatePath`), auth, cost. Real complexity — only justified if there's a genuine non-dev editor. |

**Recommendation for this project:** start with typed data files (`lib/data.ts` / `lib/content/*.ts`) for services, testimonials, team, nav. Use MDX only for case studies/blog if long-form rich content is needed. Do NOT add a headless CMS unless the client explicitly needs self-service editing — it's the single biggest source of unnecessary complexity, extra network calls, and slower builds on a project this size. A CMS can always be bolted on later behind the same `lib/data.ts` interface (swap the data source, keep the component contract).

Example typed data file:
```ts
// lib/data.ts
export interface Project {
  slug: string;
  title: string;
  client: string;
  category: "Branding" | "Web" | "Campaign";
  coverImage: string;
  year: number;
}

export const projects: Project[] = [
  { slug: "acme-rebrand", title: "Acme Rebrand", client: "Acme Co", category: "Branding", coverImage: "/images/work/acme.jpg", year: 2026 },
  // ...
];
```

## 5. Avoiding dependency bloat — target dependency list (<10 runtime deps)

Every dependency is a maintenance liability, a bundle-size cost, and a potential source of hydration/version conflicts (especially React 19 peer-dep issues). Audit ruthlessly.

**Recommended runtime dependencies (8):**
1. `next` — framework
2. `react`, `react-dom` (count as one entry conceptually, but 2 packages)
3. `motion` (the renamed `framer-motion` package) — animation
4. `three` — required peer for R3F
5. `@react-three/fiber` — R3F renderer
6. `@react-three/drei` — only if actually using its helpers (`useTexture`, `Environment`, etc.); otherwise skip it and hand-roll to save bundle size
7. `clsx` (or `tailwind-merge` if you need class-conflict resolution) — tiny, for the `cn()` helper
8. `zod` — only if you have a contact form needing runtime validation server-side (Route Handler)

**Explicitly avoid unless there's a real justification:**
- Component library dumps (full shadcn/ui install of 40 components when you use 4) — copy in only the specific primitives you need (Button, Input, Textarea) rather than running the CLI to scaffold everything.
- State managers (Redux/Zustand/Jotai) — not needed without complex client state.
- Data-fetching libraries (React Query/SWR) — not needed for static/ISR content with no client-side refetching.
- `axios` — native `fetch` is sufficient and is what Next.js extends for caching.
- `lodash` — use native array/object methods; if truly needed, import single functions (`lodash.debounce`) not the whole package.
- `styled-components`/`emotion`/CSS-in-JS — Tailwind already owns styling; mixing systems adds runtime cost and inconsistency.
- Icon libraries wholesale (`react-icons` full import) — use `lucide-react` with named imports (tree-shakes cleanly) or inline SVGs for a handful of custom icons.
- `gsap` alongside Motion — pick one animation engine. Motion (Framer Motion) covers scroll-linked, spring, and layout animations well enough for a marketing site; only reach for GSAP if you need its specific scroll-trigger/timeline sequencing power AND drop Motion to avoid shipping two animation runtimes.
- Smooth-scroll libs (Lenis) — nice-to-have, adds a client provider + JS; justify it as a deliberate feel choice, not a default.
- Form libraries (`react-hook-form`) — fine to include if the contact form has multi-field validation/UX needs, but a single-purpose form can also be handled with a Server Action + `useFormStatus`/`useActionState` and zod, with zero extra client library.

**Dev dependencies** (not counted in the "10"): `typescript`, `eslint`, `eslint-config-next`, `prettier`, `tailwindcss`, `@tailwindcss/postcss` (Tailwind v4) or `postcss`/`autoprefixer` (v3), `@types/three`, `@types/node`.

## 6. TypeScript conventions

- `strict: true` in `tsconfig.json`, no exceptions.
- Type all content shapes in `types/index.ts` or colocated with the data file (`lib/data.ts` as shown above) — this is what makes swapping data source → CMS later painless.
- Component props: `interface Props { ... }` above the component, avoid `React.FC` (loses easy generic inference, adds implicit `children`).
- Prefer `type` for unions/utility compositions, `interface` for object shapes that might be extended.
- Use path aliases (`@/components/...`, `@/lib/...`) via `tsconfig.json` `paths` — avoid relative `../../../` chains.
- Co-locate a component's variant/animation types next to the component, not in a giant global types file.
- Server Actions / Route Handlers: validate input with `zod`, infer types with `z.infer<typeof schema>` rather than hand-duplicating types.

## 7. Image handling with `next/image`

- Always use `next/image`, never bare `<img>`, for anything content-driven (hero images, case study covers, team photos).
- **Above-the-fold hero image:** set `priority` (disables lazy loading, adds `fetchpriority=high`) — but only on the single true LCP element; overusing `priority` defeats its purpose.
- **Always set dimensions**: use `width`/`height` for intrinsic-size images, or `fill` inside a `position: relative` sized container for responsive/cropped art-directed images (common for full-bleed section backgrounds).
- **`sizes` prop** is mandatory whenever the rendered width varies by breakpoint (grids, full-bleed heroes) — without it Next.js assumes full viewport width and over-serves large images to small viewports. Example: `sizes="(max-width: 768px) 100vw, 50vw"`.
- Use `placeholder="blur"` with a generated `blurDataURL` (via `plaiceholder` at build time, or static imports which Next.js auto-generates blur data for) for perceived-performance on large case-study imagery.
- Static-import local images from `public/`/co-located folders when possible (`import hero from "./hero.jpg"`) — Next.js auto-derives width/height and blur data, removing manual guesswork and layout-shift risk.
- For remote/CMS-hosted images, configure `images.remotePatterns` in `next.config.ts` (not the deprecated `domains` array) to allowlist hosts.
- Let Next.js's built-in optimizer serve AVIF/WebP automatically (default `formats` config already prefers modern formats) — don't hand-roll a separate image CDN unless self-hosting on a platform without image optimization (in which case consider `next.config.ts` `images.loader` for Cloudinary/Imgix).
- Never put a decorative/animated canvas texture image through `next/image` inside R3F — Three.js textures load via `useTexture`/`TextureLoader` directly from `public/`, bypassing the Next.js image pipeline (it's a WebGL texture, not a DOM `<img>`).
- Set `quality` deliberately (default 75 is usually fine; bump to 85-90 only for full-bleed hero/portfolio shots where compression artifacts are visible).

## 8. Additional bloat-avoidance checklist

- No unused shadcn/ui components: if you run `npx shadcn add`, add components one at a time as needed, never `add --all`.
- Delete Next.js starter boilerplate (default favicon, unused `app/api` examples, sample fonts) before shipping.
- Run `next build` with the bundle analyzer (`@next/bundle-analyzer`, dev-only dep) occasionally to catch an accidentally client-bundled heavy import (e.g., importing all of `three` utilities into a component that only needed one export, or a barrel file `index.ts` that re-exports the whole `components/` tree and drags client code into a server bundle boundary).
- Avoid barrel files (`components/index.ts` exporting everything) — they hurt tree-shaking and make the server/client boundary harder to reason about; import directly from the source file.
- Use `next/font` (self-hosted, zero layout shift, no external request) instead of a `<link>` to Google Fonts CDN.
- Metadata: use the `Metadata`/`generateMetadata` API per route instead of manual `<head>` tags; centralize shared defaults in `lib/metadata.ts`.

## Recommended package.json runtime deps (concrete)

```json
{
  "dependencies": {
    "next": "^15.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "motion": "^11.x",
    "three": "^0.17x",
    "@react-three/fiber": "^8.x",
    "@react-three/drei": "^9.x",
    "clsx": "^2.x",
    "zod": "^3.x"
  }
}
```
9 packages, under the ~10 budget, with `@react-three/drei` and `zod` as the two most droppable if the site turns out to need neither heavy 3D helpers nor server-validated forms.

---

## Sources
- https://www.groovyweb.co/blog/nextjs-project-structure-full-stack
- https://dev.to/krunal_groovy/the-nextjs-15-app-router-project-structure-that-scales-with-examples-47ha
- https://amitdevx.tech/blogs/nextjs-15-app-router-architecture-guide
- https://nextjs.org/docs/app/api-reference/file-conventions/route-groups
- https://www.debugbear.com/blog/nextjs-image-optimization
- https://prismic.io/blog/nextjs-image-component-optimization
- https://adhithiravi.medium.com/speed-matters-optimize-image-performance-in-next-js-15-like-a-pro-de1f1d2270e9
