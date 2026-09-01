export type CatalogGroup = {
  title: string;
  items: string[];
  tone: "orange" | "blue" | "violet";
};

export const workflowSteps = [
  {
    step: "01",
    title: "Study your business",
    text: "We audit your market, competitors, customers and current channels before recommending anything.",
  },
  {
    step: "02",
    title: "Build your package",
    text: "We pick only the services that fit your stage, from marketing and websites to automation and reporting.",
  },
  {
    step: "03",
    title: "Deliver for 4 months",
    text: "One flat price, one clear plan, and a focused delivery path from Day 1 through Month 4.",
  },
  {
    step: "04",
    title: "Report and optimize",
    text: "Tracking, dashboards and ongoing adjustments keep the system improving after launch.",
  },
];

export const serviceCatalog: CatalogGroup[] = [
  {
    title: "Website & Tech",
    tone: "orange",
    items: [
      "Custom website design and development",
      "Landing page build",
      "Speed, performance and mobile optimization",
      "GA4 analytics and tracking setup",
      "Booking, reservation and knowledge base setup",
    ],
  },
  {
    title: "SEO & Local Presence",
    tone: "blue",
    items: [
      "On-page SEO optimization",
      "Technical SEO audit",
      "Local keyword research",
      "Google Business Profile optimization",
      "Map pack ranking and Google Posts management",
    ],
  },
  {
    title: "Paid Ads",
    tone: "orange",
    items: [
      "Meta Facebook and Instagram ads",
      "Google Search Ads management",
      "Retargeting and remarketing campaigns",
      "Static ad creative design",
      "Ad spend conversion tracking and ROI reporting",
    ],
  },
  {
    title: "Social & Content",
    tone: "violet",
    items: [
      "Content calendar, posting and scheduling",
      "Instagram content strategy",
      "Short-form video Reels and Shorts production",
      "Content repurposing",
      "Community management and brand copywriting",
    ],
  },
  {
    title: "Reviews & Reputation",
    tone: "blue",
    items: [
      "Review generation system setup",
      "Review response management",
      "Review generation QR codes",
      "AI-powered review sentiment analysis",
      "Reputation alerts and follow-up prompts",
    ],
  },
  {
    title: "Branding",
    tone: "orange",
    items: [
      "Professional logo and style kit",
      "Menu design and layout",
      "Brand copy for sites and listings",
      "Creative direction for campaigns",
      "Founder and business story positioning",
    ],
  },
  {
    title: "Conversion",
    tone: "violet",
    items: [
      "Landing page conversion audit",
      "Conversion-first landing pages",
      "Offer and CTA improvement",
      "Customer journey fixes",
      "Lead capture optimization",
    ],
  },
  {
    title: "Leads, CRM & Sales",
    tone: "blue",
    items: [
      "Lead management system setup",
      "CRM automation workflows",
      "Sales pipeline setup",
      "Lead nurture sequence design",
      "WhatsApp and email follow-up flows",
    ],
  },
  {
    title: "Email & Messaging",
    tone: "orange",
    items: [
      "Newsletter design and campaign strategy",
      "WhatsApp marketing and broadcasts",
      "SMS marketing and broadcasts",
      "Automated win-back campaigns",
      "Personalized offer messaging",
    ],
  },
  {
    title: "Loyalty & Retention",
    tone: "violet",
    items: [
      "Loyalty and rewards program setup",
      "QR-to-loyalty capture",
      "Subscription and membership model design",
      "Gamified points, tiers and referral rewards",
      "Customer lifetime value tracking",
    ],
  },
  {
    title: "AI & Automation",
    tone: "blue",
    items: [
      "AI chatbot for website and WhatsApp",
      "AI phone receptionist setup",
      "Automated win-back campaigns",
      "AI-generated personalized offers",
      "AI review sentiment alerts",
    ],
  },
  {
    title: "Revenue & Data",
    tone: "orange",
    items: [
      "Menu engineering and pricing analysis",
      "CLV tracking and segmentation",
      "Competitor price and promo monitoring",
      "Referral program setup",
      "Upsell and cross-sell prompts",
    ],
  },
  {
    title: "Delivery & Marketplace",
    tone: "violet",
    items: [
      "Uber Eats, DoorDash and marketplace listing optimization",
      "Delivery platform ad management",
      "Marketplace offer improvement",
      "Ordering-flow conversion prompts",
      "Local visibility support",
    ],
  },
  {
    title: "Video & Influencer",
    tone: "blue",
    items: [
      "UGC campaign management",
      "Local influencer seeding programs",
      "Behind-the-scenes video series",
      "Founder story video series",
      "Short-form creative direction",
    ],
  },
  {
    title: "Reporting",
    tone: "orange",
    items: [
      "Monthly performance dashboard",
      "Campaign performance reporting",
      "Sales and lead quality tracking",
      "ROI visibility by channel",
      "Ongoing optimization notes",
    ],
  },
];

export const proofNotes = [
  "No fixed tiers or forced add-ons",
  "One custom 4-month package",
  "Marketing, sales, automation and AI connected",
  "One flat price instead of disconnected retainers",
];
