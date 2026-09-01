export const logos = [
  "Website",
  "SEO",
  "Meta Ads",
  "Google Ads",
  "CRM",
  "Automation",
  "Loyalty",
  "Reporting",
] as const;

export type Testimonial = {
  text: string;
  author: string;
  role: string;
  city: string;
  metric: string;
  featured?: boolean;
};

export const testimonials: Testimonial[] = [
  {
    text: "A strong growth package starts with the business model first, then the exact services needed to move one commercial goal.",
    author: "Sprynt40",
    role: "Growth team",
    city: "India",
    metric: "Custom 4-month package",
  },
  {
    text: "The service mix changes by business, but the operating rhythm stays clear: study, build, deliver, report and optimize.",
    author: "Sprynt40",
    role: "Delivery system",
    city: "India",
    metric: "4-month delivery path",
    featured: true,
  },
  {
    text: "Website, campaigns, follow-up and reporting should not sit in separate boxes. They should tell the team what to do next.",
    author: "Sprynt40",
    role: "Strategy principle",
    city: "India",
    metric: "Connected growth system",
  },
];

export const stats = [
  { value: 4, suffix: " months", label: "planned delivery window" },
  { value: 15, suffix: "", label: "service groups available" },
  { value: 1, suffix: "", label: "custom package per business" },
  { value: 4, suffix: "", label: "study-build-deliver-optimize stages" },
] as const;
