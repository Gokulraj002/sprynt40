# SEO for a Digital Marketing Agency Site — Next.js 15 App Router

Agency sites are a special SEO case: they must visibly demonstrate SEO competence (their own site is the portfolio piece), rank for `[service] + [location]` combos, and stay crawlable despite heavy Motion/R3F animation. Below is actionable, code-level guidance.

## 1. Root Metadata & Title Templates

Set `metadataBase` once in the root layout — every relative OG/canonical URL resolves against it. Use `title.template` so every page inherits a consistent brand suffix without repeating it.

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://youragency.com'),
  title: {
    default: 'Youragency — Growth Marketing Agency',
    template: '%s | Youragency',
  },
  description: 'Performance marketing, SEO, and brand design for ambitious B2B and DTC brands.',
  applicationName: 'Youragency',
  authors: [{ name: 'Youragency', url: 'https://youragency.com' }],
  generator: 'Next.js',
  keywords: ['digital marketing agency', 'SEO agency', 'PPC management', 'brand design'],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Youragency',
    locale: 'en_US',
    url: '/',
  },
  twitter: { card: 'summary_large_image', site: '@youragency' },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
}
```

Per-page overrides use `generateMetadata` when data is dynamic (service pages, blog posts, location pages) and static `export const metadata` for fixed pages. **Never export both from the same segment** — Next.js throws. Always set `alternates.canonical` explicitly per page even though it looks derivable — Next does not auto-infer it from the URL, and duplicate-content issues on agency sites (utm-tagged campaign landing pages, `?ref=` variants) are common.

```tsx
// app/services/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const service = await getService(params.slug)
  if (!service) return {}
  return {
    title: service.metaTitle ?? `${service.name} Services`,
    description: service.metaDescription,
    alternates: { canonical: `/services/${params.slug}` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      images: [`/services/${params.slug}/opengraph-image`],
      type: 'article',
    },
  }
}
```

## 2. OG Images — Static Files vs. Dynamic ImageResponse

Two patterns, pick per route:

**Static** — drop `opengraph-image.png` / `twitter-image.png` next to `page.tsx` in the segment folder; Next.js picks it up automatically, no metadata wiring needed. Use for the homepage, about, contact.

**Dynamic** (recommended for service pages, location pages, and blog posts — this is what makes an agency site look sharp when shared) — `opengraph-image.tsx` in the segment, using the Satori-based `ImageResponse`:

```tsx
// app/services/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const runtime = 'edge'

export default async function Image({ params }: { params: { slug: string } }) {
  const service = await getService(params.slug)
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%',
        background: 'linear-gradient(135deg, #0A0A0F 0%, #1a1a2e 100%)', color: 'white',
        padding: 80, justifyContent: 'center' }}>
        <div style={{ fontSize: 28, opacity: 0.6, letterSpacing: 4, textTransform: 'uppercase' }}>Youragency</div>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 20, maxWidth: 900 }}>{service.name}</div>
        <div style={{ fontSize: 28, opacity: 0.7, marginTop: 20 }}>{service.tagline}</div>
      </div>
    ),
    { ...size }
  )
}
```

No headless browser is spun up — Satori converts JSX/CSS to SVG then PNG, so this stays fast even on the edge runtime. For dozens of blog posts, generate params with `generateImageMetadata` if you need multiple sizes/alt variants per route.

## 3. JSON-LD — The Structured-Data Layer That Actually Matters Here

**Critical gotcha:** JSON-LD placed inside `generateMetadata`/`metadata` is silently dropped — Next only maps recognized `<meta>` fields. Structured data must be rendered as a literal `<script type="application/ld+json">` in the page/layout JSX (a Server Component), not via `next/script` (that's for executable JS with loading strategies; JSON-LD is inert data).

```tsx
// app/layout.tsx — sitewide Organization + WebSite graph
function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://youragency.com/#organization',
        name: 'Youragency',
        url: 'https://youragency.com',
        logo: 'https://youragency.com/logo.png',
        sameAs: [
          'https://www.linkedin.com/company/youragency',
          'https://twitter.com/youragency',
          'https://www.instagram.com/youragency',
        ],
        contactPoint: [{
          '@type': 'ContactPoint',
          telephone: '+1-555-010-2000',
          contactType: 'sales',
          areaServed: 'US',
        }],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://youragency.com/#website',
        url: 'https://youragency.com',
        name: 'Youragency',
        publisher: { '@id': 'https://youragency.com/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://youragency.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}
```

Use `LocalBusiness` (not just `Organization`) if the agency serves a physical service area / has an office — it unlocks Google Business Profile richness and local pack eligibility:

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Youragency",
  "image": "https://youragency.com/office.jpg",
  "address": { "@type": "PostalAddress", "streetAddress": "123 Market St", "addressLocality": "Austin", "addressRegion": "TX", "postalCode": "78701", "addressCountry": "US" },
  "geo": { "@type": "GeoCoordinates", "latitude": 30.2672, "longitude": -97.7431 },
  "url": "https://youragency.com",
  "telephone": "+1-555-010-2000",
  "priceRange": "$$$",
  "areaServed": [{ "@type": "City", "name": "Austin" }, { "@type": "City", "name": "Dallas" }],
  "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "09:00", "closes": "18:00" }]
}
```

Per service page, emit `Service` schema linked back to the Organization/LocalBusiness `@id` — this is what lets Google associate "PPC management Austin" with your entity graph:

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Search Engine Optimization",
  "provider": { "@id": "https://youragency.com/#organization" },
  "areaServed": { "@type": "Country", "name": "United States" },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "SEO Packages",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Technical SEO Audit" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Content & Link Building" } }
    ]
  }
}
```

FAQ sections (common on service/pricing pages) get `FAQPage` — but only mark up FAQs that are actually visible as text in the DOM, not ones hidden entirely behind JS-only accordions with no SSR'd text (see §6). Also add `BreadcrumbList` on every deep page (service, location, blog post) — it's cheap and improves SERP breadcrumb display plus reinforces the site hierarchy for crawlers.

Build a small helper so every page doesn't hand-roll `<script>` tags:

```tsx
// lib/json-ld.tsx
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
```

Validate with Google's Rich Results Test and Schema.org validator before shipping — malformed `@graph` nesting is the #1 structured-data bug.

## 4. Site Structure for Service × Location Keywords

Agencies competing locally need a deliberate URL taxonomy — do not create a combinatorial explosion of thin `service-city` pages; Google treats those as doorway pages and may filter them.

**Recommended structure:**
```
/services                      → hub page, links to all services
/services/seo                  → pillar page, deep content, internal links to sub-services
/services/seo/technical-seo    → sub-service (optional, only if enough unique content)
/services/ppc-management
/services/social-media-marketing
/locations                     → hub (only if you genuinely serve multiple metros)
/locations/austin              → real local page: local case studies, testimonials, team, NAP
/industries/saas                → optional vertical-specific pages (SaaS marketing, e-commerce marketing)
/blog
/blog/[slug]
/case-studies
/case-studies/[slug]
```

Only build `/locations/[city]` pages when you can populate them with genuinely unique content (local client logos, local testimonials, a local phone number, embedded map, city-specific case study) — a templated page with just the city name swapped in is a classic low-value-content penalty risk. If you serve one metro, skip the location-hub pattern entirely and fold locality signals into the homepage + `LocalBusiness` schema + Google Business Profile instead.

Internal linking: every service page should link to 2–3 relevant case studies and 1–2 relevant blog posts; every blog post should link back to the relevant service page with descriptive (not "click here") anchor text. This distributes authority from your highest-traffic content type (blog) to your highest-value conversion pages (services).

## 5. Heading Hierarchy in Visually-Designed Sections

Design systems built around big hero sections, staggered scroll reveals, and Motion-animated section titles tend to produce heading soup (multiple `<h1>`s, skipped levels, or divs styled to look like headings with no real heading tag at all). Rules to enforce across the component library:

- Exactly **one `<h1>` per page** — it's the hero headline, not the logo/wordmark. If the hero has a big kinetic-type animated headline split into `<span>` characters for a stagger animation, the wrapping element must still be a single semantic `<h1>`, with the animation applied to child spans, not by splitting into multiple heading tags.
- Section titles ("Our Services", "Work", "What Clients Say") are `<h2>`. Card/item titles inside those sections are `<h3>`. Never skip a level (`h1` → `h3`) purely because the `h2` visual size didn't match the design comp — style headings with CSS classes independent of their semantic level (`className="text-sm uppercase"` on an `<h2>` is fine).
- Animated counters, marquees, and logo walls have no heading — but the section wrapping them still needs an `<h2>` (can be visually hidden with `sr-only` if the design has no visible title, e.g. `<h2 className="sr-only">Client logos</h2>`).
- FAQ accordions: each question should be a real heading (`<h3>` or `<h4>` inside a `<button>`), not a `<div>` — this is also required for the FAQPage JSON-LD to be defensible/consistent with visible content per Google's guidelines.
- Audit with a real tool, not eyeballing: run the page through a headings-outline extension or `document.querySelectorAll('h1,h2,h3,h4,h5,h6')` in devtools before launch.

Example pattern for a hero with animated split-text that stays semantically clean:

```tsx
// components/hero.tsx
<h1 className="sr-only">Performance marketing that compounds.</h1>
<div aria-hidden="true" className="text-6xl font-bold">
  {/* Motion split-char animation renders here purely decoratively */}
  <SplitText text="Performance marketing that compounds." />
</div>
```
This pattern (visually-hidden real heading + `aria-hidden` decorative animated duplicate) is the safest way to reconcile "must animate individual characters" with "must have one clean, readable, indexable H1." Simpler alternative: animate opacity/y-transform on the whole `<h1>` as one block (Motion `motion.h1`) instead of splitting into spans — avoids the duplication pattern entirely and is usually visually sufficient.

## 6. Ensuring Animated Content Is Crawlable/Indexable

Googlebot renders JavaScript (via a headless Chromium in the indexing pipeline), but rendering is queued, rate-limited, and second-pass — content that only appears after animation/interaction can be missed or devalued. Rules for this stack specifically:

1. **Render real text in the initial HTML.** Since this is Next.js App Router, default to Server Components for anything containing copy (headlines, paragraphs, service descriptions, FAQ text). Only the animation *wrapper* needs to be a Client Component — pass text as children/props from the server:

```tsx
// Server Component parent
export default async function ServicesSection() {
  const services = await getServices()
  return <AnimatedServiceGrid services={services} /> // text-bearing data passed in, not fetched client-side
}
```
```tsx
// Client Component — only handles motion, not data-fetching or text ownership
'use client'
export function AnimatedServiceGrid({ services }) {
  return services.map(s => (
    <motion.div key={s.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}>
      <h3>{s.name}</h3><p>{s.description}</p>
    </motion.div>
  ))
}
```
The `initial={{opacity: 0}}` state is a CSS/inline-style concern — the text node itself is present in the DOM at load, satisfying crawlers, even though it's visually hidden until scroll-triggered. This is fine: Googlebot reads the DOM/accessibility tree, not the rendered pixel opacity.

2. **Never gate primary content behind a required interaction.** Content that only mounts after a click, hover, or a Three.js scene finishing load (e.g. copy revealed only after a WebGL intro animation completes) is a crawlability risk — always SSR the fallback/underlying content and layer the animation as enhancement, never as the sole render path.

3. **Three.js / R3F hero canvases carry zero text value** — any headline or CTA rendered *inside* the canvas as a 3D text mesh is invisible to crawlers and inaccessible to screen readers. Always duplicate that copy as real HTML (can be visually layered via `position: absolute` over the canvas, or `sr-only` if purely decorative), and make sure the Suspense fallback for the R3F scene doesn't delay the surrounding text from rendering — text should never be inside the `<Canvas>`'s Suspense boundary.

4. **Reduced-motion / no-JS fallback doubles as an SEO fallback.** A `prefers-reduced-motion` static version and a mobile/low-power fallback tier (already standard practice per the r3f-portfolio-3d skill) also guarantees content renders without relying on animation completing — good for accessibility and a safety net for any crawler/bot with limited JS execution budget.

5. **Avoid `IntersectionObserver`-gated content fetching.** If "load more" case studies or lazy blog cards only fetch data on scroll intersection with no SSR'd initial batch, crawlers that don't scroll (many don't fully simulate scroll/viewport interaction) will miss them. SSR the first batch (e.g. first 12 case studies) and only lazy-load subsequent pages client-side.

6. **Verify empirically**, don't assume: use Google Search Console's URL Inspection → "View Crawled Page" → check the rendered HTML/screenshot actually shows your headline and body copy, and cross-check by disabling JS in devtools (Cmd+Shift+P → "Disable JavaScript") and confirming the page isn't blank.

## 7. Sitemap & Robots (App Router file conventions)

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllBlogPosts()
  const services = await getAllServices()
  const base = 'https://youragency.com'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/case-studies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
  ]

  const serviceRoutes = services.map(s => ({
    url: `${base}/services/${s.slug}`, lastModified: s.updatedAt, changeFrequency: 'monthly' as const, priority: 0.8,
  }))

  const postRoutes = posts.map(p => ({
    url: `${base}/blog/${p.slug}`, lastModified: p.updatedAt, changeFrequency: 'monthly' as const, priority: 0.6,
  }))

  return [...staticRoutes, ...serviceRoutes, ...postRoutes]
}
```

Past 50,000 URLs (unlikely for an agency site but relevant if the blog scales large), split with `generateSitemaps()`:

```ts
export async function generateSitemaps() {
  const count = await getBlogPostCount()
  return Array.from({ length: Math.ceil(count / 50000) }, (_, id) => ({ id }))
}
export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPostsPage(id, 50000)
  return posts.map(p => ({ url: `https://youragency.com/blog/${p.slug}`, lastModified: p.updatedAt }))
}
```

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/', '/_next/', '/preview/'] },
      { userAgent: 'GPTBot', allow: '/' },       // decide deliberately re: AI crawlers
      { userAgent: 'CCBot', allow: '/' },
    ],
    sitemap: 'https://youragency.com/sitemap.xml',
    host: 'https://youragency.com',
  }
}
```

Explicitly decide on AI-crawler policy (`GPTBot`, `CCBot`, `PerplexityBot`, `ClaudeBot`) — for an agency selling visibility/marketing services, blocking them is usually counterproductive (you want to show up in AI answer engines too — AEO is now part of the pitch).

## 8. Blog Architecture for Content Marketing

Structure for topical authority, not just a flat post list:

```
/blog                          → paginated index, filterable by category
/blog/category/[category]      → category archive (e.g. /blog/category/seo)
/blog/[slug]                   → post
/blog/author/[author]          → author archive (E-E-A-T signal — real bios, credentials)
```

Key implementation points:
- **MDX or headless CMS** (Sanity/Contentful) fetched in a Server Component; render with `next-mdx-remote` or CMS's rich-text renderer — never client-fetch blog body content.
- **`Article`/`BlogPosting` JSON-LD** per post with `author`, `datePublished`, `dateModified`, `image`, and `publisher` referencing the Organization `@id`.
- **Author pages with real bios** — Google's helpful-content signals reward demonstrated expertise; agency blogs claiming SEO expertise with anonymous/no author bylines undercut their own credibility signal.
- **Pillar + cluster model**: one comprehensive pillar page per core service (e.g. "The Complete Guide to B2B SEO") linking out to 8–12 supporting cluster posts (each targeting a long-tail sub-topic), all cross-linking back to the pillar and to the relevant `/services/[slug]` page. This is the single highest-leverage content-architecture decision for an agency trying to rank for competitive head terms.
- **`generateStaticParams`** for blog posts and service pages — statically generate at build time (ISR with `revalidate` if content updates from a CMS) rather than fully dynamic SSR, for both speed (Core Web Vitals) and crawl efficiency.
- **Reading-time, TOC, and related-posts widgets** should be SSR'd, not client-fetched — they're minor but compound across hundreds of posts.
- **Canonical + `dateModified` hygiene**: when a post is meaningfully updated, bump `dateModified` in JSON-LD and update the displayed "Updated on" date — freshness is a real ranking factor for competitive marketing-topic queries.

## 9. Performance as an SEO Prerequisite (agency-specific risk)

Because this stack layers Motion + R3F + Tailwind on a marketing site, Core Web Vitals (LCP, INP, CLS) are at real risk — and a marketing agency with a slow site is a credibility failure with prospects, not just an algorithmic ding. Concretely: lazy-load the R3F canvas below the fold with `next/dynamic({ ssr: false })` + Suspense fallback matching final layout dimensions (prevents CLS), preload the hero's LCP image/font, and cap total main-thread JS by code-splitting heavy animation libraries per-route rather than loading them in the root layout.

---

**Sources:**
- [Next.js Docs — generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js Docs — generateImageMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-image-metadata)
- [Next.js Docs — JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld)
- [Vercel — Structured data for SEO](https://vercel.com/i/structured-data-for-seo)
- [Complete Guide to Dynamic OG Images in Next.js 15+](https://medium.com/@uyiosazeeirvin/complete-guide-to-dynamic-og-images-in-next-js-15-5f69fd583dbe)
- [Sitemaps and robots.txt in Next.js](https://www.frontendhorizon.com/blog/sitemaps-and-robots-txt-in-next-js-telling-crawlers-and-ai-bots-what-actually-matters)
- [JavaScript SEO: How to make dynamic content crawlable](https://searchengineland.com/guide/javascript-seo)
