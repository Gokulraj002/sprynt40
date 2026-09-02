import type { Metadata } from "next";
import { inter } from "./fonts";
import { site } from "@/lib/data/site";
import { OrgJsonLd } from "@/lib/jsonld";
import SmoothScroll from "@/components/fx/SmoothScroll";
import Cursor from "@/components/fx/Cursor";
import WhatsAppFab from "@/components/fx/WhatsAppFab";
import ScrollProgress from "@/components/fx/ScrollProgress";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    siteName: site.name,
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={inter.variable}
    >
      <body>
        <OrgJsonLd />
        <SmoothScroll>
          <Header />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
        <ScrollProgress />
        <WhatsAppFab />
        <Cursor />
      </body>
    </html>
  );
}
