import { Container } from "@/components/ui/Container";
import { Chip } from "@/components/ui/Chip";
import { Logo } from "@/components/ui/Logo";
import { hasWhatsApp, site, waLink } from "@/lib/data/site";
import { allServices } from "@/lib/data/services";

const linkCls =
  "text-ink-muted transition-colors duration-300 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none";

/**
 * Global footer — mounted once, below BigCta, on every route.
 * Server component: no interactivity, so no "use client" needed.
 */
export function Footer() {
  return (
    <footer
      data-theme="light"
      className="relative border-t border-line bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] py-16 sm:py-20 lg:py-24"
    >
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-xs">
            <Logo withTagline className="[&_svg]:size-10" />
            <p className="mt-4 text-sm text-ink-muted">
              Websites, ads, SEO, content, CRM, automation and reporting
              connected into one measurable growth system.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 xl:grid-cols-4">
            <nav aria-label="Company">
              <p className="font-sans text-label uppercase text-ink-muted/80">Company</p>
              <ul className="mt-4 space-y-3">
                {site.footerNav.company.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className={`${linkCls} text-sm`}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Services">
              <p className="font-sans text-label uppercase text-ink-muted/80">Services</p>
              <ul className="mt-4 space-y-3">
                {allServices.slice(0, 8).map((service) => (
                  <li key={service.slug}>
                    <a href={`/services/${service.slug}`} className={`${linkCls} text-sm`}>
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Legal">
              <p className="font-sans text-label uppercase text-ink-muted/80">Legal</p>
              <ul className="mt-4 space-y-3">
                {site.footerNav.legal.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className={`${linkCls} text-sm`}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Contact">
              <p className="font-sans text-label uppercase text-ink-muted/80">Contact</p>
              <ul className="mt-4 space-y-3">
                <li>
                  <a href={`mailto:${site.email}`} className={`${linkCls} break-words text-sm`}>
                    {site.email}
                  </a>
                </li>
                {site.phone && (
                  <li>
                    <a href={`tel:${site.phone}`} className={`${linkCls} text-sm`}>
                      {site.phone}
                    </a>
                  </li>
                )}
                {hasWhatsApp && (
                  <li>
                    <a
                      href={waLink("Hi! I want to talk about growth.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${linkCls} text-sm`}
                    >
                      WhatsApp
                    </a>
                  </li>
                )}
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${linkCls} text-sm`}
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-muted">
            © {new Date().getFullYear()} {site.name} · {site.city}
          </p>
          <Chip className="text-[11px]">Built for measurable growth</Chip>
        </div>
      </Container>
    </footer>
  );
}
