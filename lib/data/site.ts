/*
  Single source of truth for brand identity.
  The final brand name/logo arrive later — change ONLY this file.
*/
export const site = {
  name: "Sprynt40",
  wordmark: "Sprynt40", // rendered via components/ui/Logo.tsx
  tagline: "Grow Loud!",
  description:
    "A digital marketing agency building tailored 4-month growth systems across websites, ads, SEO, content, CRM, automation, loyalty and reporting.",
  url: "https://sprynt40.com",
  city: "India",
  email: "hello@sprynt40.com",
  phone: "",
  whatsapp: "",
  bookingUrl: "/contact",
  promise: "One tailored growth system",
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footerNav: {
    company: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Work", href: "/work" },
      { label: "Growth audit", href: "/teardown" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "X", href: "https://x.com" },
  ],
} as const;

export const waLink = (text?: string) =>
  site.whatsapp
    ? `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`
    : "/contact";

export const hasWhatsApp = Boolean(site.whatsapp);
