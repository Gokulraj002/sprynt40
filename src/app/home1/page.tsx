import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { hasWhatsApp, waLink } from "@/lib/data/site";
import { GrowthPlanLab } from "./GrowthPlanLab";
import styles from "./home1.module.css";

export const metadata: Metadata = {
  title: "Complete Business Growth Solutions",
  description:
    "A tailored four-month growth system connecting marketing, sales, automation, AI and reporting.",
};

const services = [
  ["Website & Tech", "Websites, landing pages, speed, mobile and analytics setup.", "screen"],
  ["SEO & Local Presence", "Be found on Google, maps and in the moments that matter.", "search"],
  ["Paid Ads", "Google and Meta campaigns built to create real demand.", "megaphone"],
  ["Social & Content", "Strategy, content, reels, copy and community management.", "people"],
  ["Reviews & Reputation", "Generate more reviews, respond faster and build trust.", "star"],
  ["Branding", "Professional identity systems, logo kits and brand collateral.", "palette"],
  ["Conversion", "Turn attention into action with sharper customer journeys.", "growth"],
  ["Leads, CRM & Sales", "Capture, organize, nurture and progress every opportunity.", "user"],
  ["Email & Messaging", "Campaigns, newsletters, WhatsApp and broadcast systems.", "mail"],
  ["Loyalty & Retention", "Rewards, memberships, referrals and repeat-purchase flows.", "gift"],
  ["AI & Automation", "Chatbots, AI reception and workflows that work around the clock.", "bot"],
  ["Revenue & Data", "ROI tracking, pricing intelligence and actionable insight.", "chart"],
  ["Delivery & Marketplace", "Listing, advertising and platform optimization.", "delivery"],
  ["Video & Influencer", "UGC, local creators and founder-led video campaigns.", "video"],
  ["Reporting", "A clear monthly dashboard for every important growth signal.", "report"],
] as const;

const process = [
  ["We Study Your Business", "A real audit of your market, competitors and customers before we suggest anything."],
  ["We Build Your Package", "We select the exact services that fit where your business is today."],
  ["We Deliver for 4 Months", "One flat price and a clear plan from Day 1 through Month 4."],
  ["We Report & Optimize", "Ongoing tracking and adjustment—not a one-and-done setup."],
] as const;

const industries = [
  ["Cafés & Restaurants", "/images/home1/industry-cafe-restaurant-v1.webp", "A premium café interior with breakfast and coffee"],
  ["Retail & E-commerce", "/images/home1/industry-retail-ecommerce-v1.webp", "Online retail products, parcels and a mobile storefront"],
  ["Healthcare", "/images/home1/industry-healthcare-v1.webp", "A contemporary clinic workspace with a stethoscope and medical dashboard"],
  ["Education", "/images/home1/industry-education-v1.webp", "A graduation cap, open notebook and modern learning workspace"],
  ["Hospitality", "/images/home1/industry-hospitality-v1.webp", "A warm premium hotel suite at sunset"],
  ["Real Estate", "/images/home1/industry-real-estate-v1.webp", "A contemporary mixed-use property illuminated at dusk"],
] as const;

const faqs = [
  ["How does the 4-month program work?", "We begin with research, build a custom plan, deliver it across four focused months, then report and optimize as we go."],
  ["Do you create a custom package?", "Yes. We select only the services that match your current stage, goals and market."],
  ["Is there a monthly retainer?", "No. The engagement is priced once for four months, with no forced add-ons or surprise retainers."],
  ["Which services will my business need?", "That is decided after the initial business study—not before. Your package may combine marketing, sales, technology, automation and reporting."],
  ["How do you measure results?", "Your monthly dashboard connects activity to meaningful indicators such as leads, conversion, retention and revenue."],
] as const;

const heroSignals = [
  { value: "14 days", label: "campaign launch window" },
  { value: "1 metric", label: "weekly decision focus" },
  { value: "12+", label: "creative tests every month" },
] as const;

function Icon({ name }: { name: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, React.ReactNode> = {
    screen: <><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
    megaphone: <><path d="M4 13v-2l13-5v12L4 13Z"/><path d="M7 14v5h4l1-4M19 9l2-2M19 15l2 2"/></>,
    people: <><circle cx="8" cy="8" r="3"/><circle cx="17" cy="7" r="3"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="17" r="3"/></>,
    star: <path d="m12 2 3 6 7 .9-5 4.8 1.3 6.8L12 17l-6.3 3.5L7 13.7 2 8.9 9 8l3-6Z"/>,
    palette: <><path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h3a6 6 0 0 0-3-10Z"/><circle cx="7.5" cy="9" r=".8" fill="currentColor"/><circle cx="10" cy="6.5" r=".8" fill="currentColor"/></>,
    growth: <><path d="M4 20V10M10 20V6M16 20v-9M22 20V3"/><path d="m3 7 6-4 6 4 7-5"/></>,
    user: <><circle cx="12" cy="7" r="4"/><path d="M4 22c0-5 3-8 8-8s8 3 8 8"/></>,
    mail: <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></>,
    gift: <><rect x="3" y="9" width="18" height="12" rx="1"/><path d="M12 9v12M2 9h20M7 9c-4 0-4-5-1-5 2.5 0 4 5 6 5M17 9c4 0 4-5 1-5-2.5 0-4 5-6 5"/></>,
    bot: <><rect x="4" y="7" width="16" height="13" rx="4"/><path d="M12 3v4M8 13h.01M16 13h.01M8 17h8"/></>,
    chart: <><path d="M4 21V11M10 21V6M16 21v-8M22 21V3"/></>,
    delivery: <><path d="M3 7h11v11H3zM14 11h4l3 4v3h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></>,
    video: <><rect x="3" y="6" width="14" height="13" rx="2"/><path d="m17 11 5-3v9l-5-3zM8 6l1-3h4l1 3"/></>,
    report: <><path d="M5 3h14v18H5zM8 16v2M12 12v6M16 8v10"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}>{paths[name]}</svg>;
}

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

export default function HomeOnePage() {
  return (
    <div className={styles.home1Page}>
      <Section
        id="hero"
        theme="dark"
        className="hidden min-h-svh overflow-hidden pt-24 pb-8 md:flex lg:pt-[7.5rem]"
      >
        <Image
          src="/images/home/hero-command-wall.png"
          alt="A classical strategist using a laptop inside a panoramic digital marketing command centre"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center saturate-[0.88] hue-rotate-[105deg]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,5,0.48)_0%,rgba(10,8,5,0.2)_35%,rgba(10,8,5,0.72)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(249,115,22,0.28),transparent_28%)]" />

        <Container className="relative z-10 flex flex-1 flex-col">
          <div className="mx-auto flex max-w-5xl flex-1 flex-col items-center justify-between text-center">
            <div className="pt-4 sm:pt-8">
              <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur">
                Digital growth engineered with AI clarity
              </p>
              <h1 className="mx-auto mt-6 max-w-5xl font-display text-[clamp(4rem,7.2vw,6.7rem)] font-semibold leading-[0.98] tracking-normal text-white text-balance">
                Being visible is not enough. Be measurable.
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-white/72">
                Sprynt40 builds digital marketing systems where creative, websites, ads and analytics
                work together to turn attention into qualified growth.
              </p>
              <div className="mt-7 flex items-center justify-center gap-3">
                <Button href="/contact" variant="accent" className="px-7">
                  Build my growth plan
                </Button>
                <Button
                  href={hasWhatsApp ? waLink("Hi! I want to build a growth plan.") : "/services"}
                  variant="outline"
                  external={hasWhatsApp}
                  className="border-white/25 bg-white/10 px-7 text-white backdrop-blur hover:border-white/60"
                >
                  {hasWhatsApp ? "Talk on WhatsApp" : "Explore services"}
                </Button>
              </div>
            </div>

            <div className="w-full pb-6">
              <div className="mx-auto grid max-w-3xl grid-cols-3 overflow-hidden rounded-full border border-white/15 bg-white/10 text-white shadow-[0_24px_90px_-40px_rgba(249,115,22,0.78)] backdrop-blur-md">
                {heroSignals.map((item) => (
                  <div key={item.value} className="border-l border-white/15 px-6 py-4 first:border-l-0">
                    <p className="font-display text-3xl font-semibold">{item.value}</p>
                    <p className="mt-1 text-sm text-white/65">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <section className={`${styles.hero} md:hidden`} data-theme="dark">
        <Image className={styles.heroImage} src="/images/home1/sprynt40-staircase-portal-v2.png" alt="A business leader climbing illuminated steps toward a monumental orange arrow portal" fill priority sizes="100vw" />
        <div className={styles.heroShade} />
        <div className={styles.heroWide}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Complete business growth solutions</p>
            <h1>From Today<br/>to <span>What&apos;s Next.</span></h1>
            <p className={styles.lead}>Marketing, technology, automation and more—one tailored system built around your business, not a fixed package.</p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} href="/contact">Get your custom plan <Arrow /></Link>
              <a className={styles.secondaryButton} href="#process">See how it works <span className={styles.play}>▶</span></a>
            </div>
            <div className={styles.heroBenefits}>
              <div><span>More</span><strong>Visibility</strong><Icon name="chart" /></div>
              <div><span>More</span><strong>Customers</strong><Icon name="people" /></div>
              <div><span>More</span><strong>Revenue</strong><Icon name="growth" /></div>
            </div>
            <div className={styles.heroJourney}><span>Ideas</span><i>→</i><span>Strategy</span><i>→</i><span>Execution</span><i>→</i><span>Growth</span></div>
          </div>
        </div>

        <div className={`${styles.heroFloatCard} ${styles.heroFloatMarketing}`}><Icon name="chart"/><div><strong>Marketing</strong><span>Turn attention<br/>into customers.</span></div></div>
        <div className={`${styles.heroFloatCard} ${styles.heroFloatSales}`}><Icon name="people"/><div><strong>Sales</strong><span>Capture, nurture<br/>and convert.</span></div></div>
        <div className={`${styles.heroFloatCard} ${styles.heroFloatAutomation}`}><Icon name="bot"/><div><strong>Automation</strong><span>Let technology<br/>do the work.</span></div></div>

        <aside className={styles.heroRail} aria-label="Sprynt40 growth statement">
          <p>Brands<br/>People<br/>Businesses<br/>Communities</p>
          <strong>Grow Loud.</strong>
          <i />
          <span>A brighter<br/>bolder<br/>tomorrow</span>
          <em>Grow<br/>Loud!</em>
        </aside>
      </section>

      <section className={styles.trust} aria-label="Core platforms">
        <div className={styles.shell}>
          <p className={styles.trustLabel}>Built for ambitious brands</p>
          <div className={styles.logoRow}><span>Google</span><span>Meta</span><span>Shopify</span><span>AWS</span><span>Odoo</span><span>Freshworks</span></div>
        </div>
      </section>

      <section className={styles.services} id="services" data-theme="light">
        <div className={styles.shell}>
          <div className={styles.sectionIntro}>
            <div><p className={styles.kicker}>Our services</p><h2>Everything You Need<br/>to <span>Grow.</span></h2></div>
            <div><p>We combine strategy, creative thinking and technology to help you attract, convert and retain more customers.</p><Link href="/services">Explore all services <Arrow /></Link></div>
          </div>
          <div className={styles.serviceGrid}>
            {services.map(([title, copy, icon]) => <article key={title} className={styles.serviceCard}><Icon name={icon}/><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </div>
      </section>

      <GrowthPlanLab />

      <section className={styles.process} id="process" data-theme="dark">
        <Image className={styles.processImage} src="/images/home1/sprynt40-growth-mountain-v1.png" alt="A glowing orange trail reaching a mountain summit" fill sizes="100vw" />
        <div className={styles.processShade}/>
        <div className={styles.shell}>
          <p className={styles.kickerDark}>How it works</p>
          <h2>A Simple <span>4-Step</span> Process.</h2>
          <p className={styles.processLead}>No confusion. No long contracts. Just a clear plan to grow your business.</p>
          <div className={styles.steps}>{process.map(([title, copy], index) => <article key={title}><div className={styles.stepTop}><strong>0{index + 1}</strong><i/></div><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </div>
      </section>

      <section className={styles.system} data-theme="light">
        <div className={styles.systemCopy}>
          <p className={styles.kicker}>One connected system</p>
          <h2>Not Just Marketing.<br/>A Complete <span>Growth System.</span></h2>
          <p>Marketing, sales, automation and technology—all connected to help you grow faster and go further.</p>
          <ul><li><strong>Fully tailored</strong><span>No two packages are the same.</span></li><li><strong>One flat price</strong><span>A focused four-month engagement.</span></li><li><strong>End-to-end system</strong><span>Everything works together.</span></li></ul>
          <Link className={styles.outlineButton} href="/about">Learn more about us <Arrow /></Link>
        </div>
        <div className={styles.orbitPanel} data-theme="dark">
          <div className={styles.orbit}>
            <span className={styles.orbitCenter}><b>Sprynt40</b><small>Grow Loud!</small></span>
            <span className={styles.orbitOne}><b>Attract</b><small>SEO · Ads · Social</small></span>
            <span className={styles.orbitTwo}><b>Convert</b><small>Web · CRM · AI</small></span>
            <span className={styles.orbitThree}><b>Retain</b><small>Email · Loyalty</small></span>
            <span className={styles.orbitFour}><b>Grow</b><small>Data · Optimization</small></span>
            <span className={styles.orbitFive}><b>Build</b><small>Brand · Content</small></span>
          </div>
          <p className={styles.scribble}>Different pieces.<br/>One bigger picture.</p>
        </div>
      </section>

      <section className={styles.industries} id="industries" data-theme="light">
        <div className={styles.shell}>
          <div className={styles.sectionIntro}>
            <div><p className={styles.kicker}>Industries we serve</p><h2>Different Businesses.<br/><span>One Growth Mindset.</span></h2></div>
            <div><p>Whether you run a café, a retail brand or a growing service business—our strategies are tailored to your industry.</p><Link href="/contact">Discuss your industry <Arrow /></Link></div>
          </div>
          <div className={styles.industryRail}>{industries.map(([title, src, alt]) => <article key={title}><Image src={src} alt={alt} fill loading="eager" unoptimized sizes="(max-width: 700px) 70vw, 18vw"/><div/><h3>{title}</h3></article>)}</div>
        </div>
      </section>

      <section className={styles.results} data-theme="dark">
        <div className={styles.shell}>
          <div className={styles.resultsGrid}>
            <div><p className={styles.kickerDark}>The model</p><h2>Real Businesses.<br/><span>Real Growth.</span></h2></div>
            <blockquote>“Your growth plan should not be a pile of disconnected services. It should be one focused system—built for your business, measured clearly, and improved continuously.”<footer>Sprynt40 growth principle</footer></blockquote>
            <div className={styles.metricGrid}><div><strong>4</strong><span>Focused months</span></div><div><strong>1</strong><span>Flat price</span></div><div><strong>15</strong><span>Growth systems</span></div></div>
          </div>
        </div>
      </section>

      <section className={styles.faq} data-theme="light">
        <div className={styles.shell}>
          <div className={styles.faqGrid}><div><p className={styles.kicker}>FAQ</p><h2>Questions?<br/>We’ve Got Answers.</h2><Link className={styles.outlineButton} href="/contact">Ask us anything <Arrow /></Link></div><div className={styles.questions}>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></div>
        </div>
      </section>

      <section className={styles.finalCta} data-theme="dark">
        <Image src="/images/home1/sprynt40-consultation-door-v1.png" alt="A business leader stepping into a bright future" fill sizes="100vw"/>
        <div className={styles.finalShade}/>
        <div className={styles.shell}><div className={styles.finalCopy}><h2>Ready to Grow Loud?<br/><span>Let’s Build Your Custom Plan.</span></h2><p>Book a call—we’ll study your business, then send back a tailored four-month package with one flat price.</p><div className={styles.heroActions}><Link className={styles.primaryButton} href="/contact">Book a free consultation <Arrow /></Link><a className={styles.email} href="mailto:hello@sprynt40.online">or email us<br/><strong>hello@sprynt40.online</strong></a></div></div></div>
      </section>

      <footer className={styles.customFooter} data-theme="dark">
        <div className={styles.shell}><div className={styles.footerGrid}><div><Image className={styles.footerLogo} src="/logos.jpeg" alt="Sprynt40 — Grow Loud!" width={1600} height={1600}/><p>Digital growth solutions for businesses ready to move forward.</p></div><nav><strong>Quick links</strong><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/services">Services</Link><Link href="/work">Work</Link><Link href="/contact">Contact</Link></nav><nav><strong>Our services</strong><a href="#services">Website & Tech</a><a href="#services">SEO & Local</a><a href="#services">Paid Ads</a><a href="#services">AI & Automation</a><Link href="/services">View all services</Link></nav><div><strong>Let’s grow</strong><a href="mailto:hello@sprynt40.online">hello@sprynt40.online</a><p>Andhra Pradesh, India</p><em>Grow<br/>Loud!</em></div></div><div className={styles.copyright}><span>© 2026 Sprynt40. All rights reserved.</span><span><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms & Conditions</Link></span></div></div>
      </footer>
    </div>
  );
}
