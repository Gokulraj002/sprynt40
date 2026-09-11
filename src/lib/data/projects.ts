export type Project = {
  slug: string;
  client: string;
  sector: string;
  headline: string; // results-first: [metric] [direction] in [timeframe]
  metric: { value: string; label: string };
  before: string;
  after: string;
  challenge: string;
  approach: string[];
  results: { value: string; label: string }[];
  quote?: { text: string; author: string; role: string };
  tint: "lime" | "violet" | "neutral";
};

export const projects: Project[] = [
  {
    slug: "local-brand-growth-system",
    client: "Local Brand Growth System",
    sector: "Retail and service businesses",
    headline: "From scattered channels to one measurable growth system",
    metric: { value: "4", label: "months of focused delivery" },
    before: "Disconnected activity",
    after: "One working package",
    challenge:
      "The business has a website, social pages and campaigns, but each channel works separately. Leads arrive inconsistently and reporting does not show what to improve next.",
    approach: [
      "Audit the website, search presence, social content, paid media and follow-up path before choosing the service mix.",
      "Rebuild the key pages and campaign messaging around one customer action.",
      "Connect CRM, WhatsApp/email follow-up and monthly reporting so the team can act on enquiries faster.",
    ],
    results: [
      { value: "1", label: "custom package instead of fixed tiers" },
      { value: "4", label: "months from audit to optimization" },
      { value: "8+", label: "channels connected when needed" },
    ],
    tint: "lime",
  },
  {
    slug: "conversion-led-website-system",
    client: "Conversion-Led Website System",
    sector: "Website and lead generation",
    headline: "A clearer website built to turn attention into enquiries",
    metric: { value: "5", label: "conversion surfaces improved" },
    before: "Traffic without clarity",
    after: "Pages built for action",
    challenge:
      "The existing site looks active but does not explain the offer quickly, guide mobile visitors cleanly or capture leads with enough context for sales.",
    approach: [
      "Redesign priority pages with a stronger offer, proof blocks and cleaner CTAs.",
      "Build landing pages for service-specific campaigns and local search traffic.",
      "Install GA4 tracking and lead-source visibility before campaign scale.",
    ],
    results: [
      { value: "1", label: "primary enquiry path" },
      { value: "3", label: "core page types covered" },
      { value: "100%", label: "mobile-first review before launch" },
    ],
    tint: "violet",
  },
  {
    slug: "local-visibility-retention-system",
    client: "Local Visibility and Retention System",
    sector: "Local search, reviews and loyalty",
    headline: "A repeatable path from discovery to return visits",
    metric: { value: "6", label: "retention loops available" },
    before: "One-time visits",
    after: "Repeatable follow-up",
    challenge:
      "The business is discoverable in some places, but reviews, listings, offers, loyalty and win-back communication are not working together.",
    approach: [
      "Improve Google Business Profile, local keywords, citations and map-pack signals.",
      "Add review generation, response management and sentiment alerts.",
      "Build loyalty, referral, QR capture and win-back messaging into the customer journey.",
    ],
    results: [
      { value: "5", label: "local visibility levers" },
      { value: "4", label: "review and reputation workflows" },
      { value: "3", label: "repeat-customer paths" },
    ],
    tint: "neutral",
  },
];
