import { serviceCatalog } from "@/lib/data/service-catalog";

export type Service = {
  slug: string;
  name: string;
  short: string;
  outcome: string;
  body: string[];
  deliverables: string[];
};

const serviceBodies: Record<string, { short: string; outcome: string; body: string[] }> = {
  "Website & Tech": {
    short: "Fast websites, landing pages and tracking foundations",
    outcome:
      "Build the digital base your campaigns can trust: sharp pages, fast loading, clean mobile UX and analytics wired from day one.",
    body: [
      "Your website is the conversion surface for every ad, search result, post and referral. We design and build the pages that matter first, then connect tracking so performance is visible.",
      "This includes the technical layer around speed, mobile usability, analytics, booking flows and knowledge base content when your business needs it.",
    ],
  },
  "SEO & Local Presence": {
    short: "Search visibility for buyer-intent and local demand",
    outcome:
      "Improve organic discovery with technical fixes, local search work and Google Business Profile signals that compound over time.",
    body: [
      "We start with the queries your customers already use, then clean up the pages, metadata and local presence needed to compete for that demand.",
      "For local businesses, the focus is practical: profile quality, local keywords, citations, posts and map-pack signals tied to measurable enquiries.",
    ],
  },
  "Paid Ads": {
    short: "Meta, Google and retargeting campaigns focused on ROI",
    outcome:
      "Launch paid campaigns with clearer targeting, stronger creative and reporting that shows what is actually producing enquiries.",
    body: [
      "Paid media works when offer, audience, creative and tracking line up. We build campaign structures around the intended business outcome instead of running disconnected experiments.",
      "Meta, Google Search and retargeting are paired with static creative, conversion tracking and performance review so spend can move toward what is working.",
    ],
  },
  "Social & Content": {
    short: "Consistent content systems for brand visibility",
    outcome:
      "Create a steady social presence with content planning, short-form video, repurposing and brand copy that supports trust and demand.",
    body: [
      "Content should make the business easier to understand and easier to choose. We plan the calendar, shape the angles and turn core ideas into platform-ready assets.",
      "The system can include Instagram strategy, Reels, Shorts, community management and copywriting depending on the brand's current stage.",
    ],
  },
  "Reviews & Reputation": {
    short: "Systems that collect, manage and respond to customer proof",
    outcome:
      "Turn customer feedback into a visible trust asset through review generation, response workflows and reputation alerts.",
    body: [
      "Reviews influence search, ads and direct conversion. We create easier ways for happy customers to leave feedback and clearer workflows for response management.",
      "AI sentiment alerts and follow-up prompts help the team act faster when a review needs attention.",
    ],
  },
  Branding: {
    short: "Identity, style and messaging that make the brand clearer",
    outcome:
      "Give campaigns and pages a stronger visual and verbal system with logo, style kit, menu design and brand story support.",
    body: [
      "Branding is not decoration here. It is the system that keeps every page, post, ad and listing consistent enough for customers to remember and trust.",
      "We can refine the logo, style kit, menus, campaign direction and founder/business story so the brand feels more deliberate.",
    ],
  },
  Conversion: {
    short: "Landing page and journey improvements for more leads",
    outcome:
      "Improve the moments where visitors decide, click, book or enquire with clearer offers, CTAs and lead capture paths.",
    body: [
      "More traffic will not fix a weak conversion path. We review the journey, tighten the offer and remove friction around the main action.",
      "This work connects landing page audits, CTA improvements, customer journey fixes and lead capture optimization.",
    ],
  },
  "Leads, CRM & Sales": {
    short: "Lead handling, CRM automation and sales pipeline setup",
    outcome:
      "Connect marketing response to sales action with lead management, CRM automation and nurture flows that reduce leakage.",
    body: [
      "A lead is only valuable when the team can see it, follow it and move it forward. We set up the pipeline and workflows that make response consistent.",
      "WhatsApp and email follow-ups can be connected into the nurture path so enquiries do not sit idle after the first touch.",
    ],
  },
  "Email & Messaging": {
    short: "Email, WhatsApp and SMS campaigns for retention and reactivation",
    outcome:
      "Use owned messaging channels to bring customers back with newsletters, broadcasts, win-back flows and personalized offers.",
    body: [
      "Email, WhatsApp and SMS work best when they are planned around customer moments, not random blasts. We build the campaign strategy and templates around that.",
      "The messaging system can support newsletters, broadcast campaigns, automated win-backs and personalized offer communication.",
    ],
  },
  "Loyalty & Retention": {
    short: "Rewards, memberships and referral loops for repeat revenue",
    outcome:
      "Increase repeat business with loyalty programs, QR capture, memberships, referrals and customer lifetime value tracking.",
    body: [
      "Retention turns one-time buyers into a business asset. We design loyalty and membership systems that are simple enough for customers to use and teams to manage.",
      "Points, tiers, referrals and CLV tracking help the business understand who returns, why they return and how to encourage the next visit.",
    ],
  },
  "AI & Automation": {
    short: "Chatbots, AI receptionist and automated customer follow-up",
    outcome:
      "Use AI where it removes delay: website chat, WhatsApp replies, phone reception, win-back offers and review alerts.",
    body: [
      "Automation should make response faster without making the business feel impersonal. We choose the use cases where speed and consistency matter most.",
      "That may include an AI chatbot, AI phone receptionist, personalized offers, win-back automation and reputation alerts.",
    ],
  },
  "Revenue & Data": {
    short: "Pricing, customer value and ROI visibility",
    outcome:
      "Make smarter growth decisions with menu engineering, segmentation, competitor tracking, referrals and channel-level ROI reporting.",
    body: [
      "Growth improves when the business can see what is profitable, what repeats and what should be promoted next. We connect data work to commercial decisions.",
      "The package can include menu/pricing analysis, CLV segmentation, competitor monitoring, referral setup and upsell or cross-sell prompts.",
    ],
  },
  "Delivery & Marketplace": {
    short: "Marketplace listings, delivery ads and ordering-flow improvements",
    outcome:
      "Improve visibility and conversion on delivery platforms through stronger listings, offers, ads and ordering prompts.",
    body: [
      "Delivery platforms are search engines with purchase intent. We optimize the listing, offer and ordering path so the business competes better where customers already buy.",
      "This can include Uber Eats, DoorDash and marketplace listing work, delivery platform ads and local visibility support.",
    ],
  },
  "Video & Influencer": {
    short: "UGC, local influencers and short-form brand storytelling",
    outcome:
      "Create more human demand signals with UGC, influencer seeding, behind-the-scenes content and founder story videos.",
    body: [
      "Customers trust proof that feels real. We use video and creator-led content to make the business easier to understand, remember and share.",
      "The work can include local influencer seeding, UGC campaigns, BTS series, founder stories and short-form creative direction.",
    ],
  },
  Reporting: {
    short: "Dashboards and optimization notes that keep work accountable",
    outcome:
      "Track performance across campaigns, leads, sales quality and ROI so every month has a clearer next move.",
    body: [
      "A growth system needs a scoreboard. We set up reporting that shows what changed, what produced enquiries and where the next improvement should happen.",
      "Monthly dashboards and optimization notes keep the package accountable after the first launch.",
    ],
  },
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const allServices: Service[] = serviceCatalog.map((group) => {
  const copy = serviceBodies[group.title];

  return {
    slug: slugify(group.title),
    name: group.title,
    short: copy.short,
    outcome: copy.outcome,
    body: copy.body,
    deliverables: group.items,
  };
});
