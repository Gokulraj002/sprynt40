"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { hasWhatsApp, site, waLink } from "@/lib/data/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/Logo";
import { EASE_OUT } from "@/lib/motion";
import { NavOverlay } from "./NavOverlay";

/*
  Fixed top header. It probes the [data-theme] section currently beneath it
  and mirrors that theme on itself, so ink/border/glass tokens always contrast
  with whatever is scrolled underneath (light hero on the homepage, dark hero
  bands on subpages).
*/

const PANEL_ID = "site-nav-overlay";
const LABEL_ID = "site-nav-overlay-label";
const SCROLL_THRESHOLD = 8;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [surfaceTheme, setSurfaceTheme] = useState<"light" | "dark">("light");

  const headerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  const { scrollY } = useScroll();
  const pathname = usePathname();
  const headerTheme = mobileOpen ? "light" : surfaceTheme;

  // Close the mobile overlay whenever the route changes (e.g. a social link
  // or programmatic navigation), not just on direct nav-link clicks.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMobileOpen(false));
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // Mirror the theme of whatever [data-theme] surface sits beneath the bar.
  useEffect(() => {
    let raf = 0;
    const probe = () => {
      const hits = document.elementsFromPoint(window.innerWidth / 2, 40);
      const under = hits.find((el) => !headerRef.current?.contains(el));
      const theme = under?.closest("[data-theme]")?.getAttribute("data-theme");
      setSurfaceTheme(theme === "dark" ? "dark" : "light");
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(probe);
    };
    probe();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > SCROLL_THRESHOLD);
  });

  // Return focus to the trigger once the overlay closes.
  useEffect(() => {
    if (wasOpen.current && !mobileOpen) {
      triggerRef.current?.focus();
    }
    wasOpen.current = mobileOpen;
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        ref={headerRef}
        data-theme={headerTheme}
        className={cn(
          "fixed inset-x-0 top-0 z-[100] transition-[background-color,border-color,box-shadow] duration-300",
          headerTheme === "dark"
            ? "border-b border-white/10 bg-black/55 text-white shadow-[0_18px_60px_-44px_rgba(0,0,0,0.95)] backdrop-blur-xl"
            : scrolled
              ? "border-b border-line bg-white/92 shadow-sm backdrop-blur-xl"
              : "border-b border-orange-100/70 bg-white/78 backdrop-blur-xl",
        )}
      >
        <div className="relative z-[110]">
          <Container className="flex h-14 items-center justify-between sm:h-20">
            <Logo onClick={() => setMobileOpen(false)} />

            <nav
              aria-label="Primary"
              className="hidden items-center gap-5 lg:gap-7 md:flex"
            >
              {site.nav.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group relative rounded-sm text-sm font-medium transition-colors duration-300 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
                      isActive ? "text-ink" : "text-ink-muted",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "pointer-events-none absolute inset-x-0 -bottom-1 h-px origin-left bg-ink transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100",
                        isActive ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                );
              })}
              <Button
                href={waLink("Hi! I want to talk about growth.")}
                variant={hasWhatsApp ? "whatsapp" : "accent"}
                external={hasWhatsApp}
                className="px-4 py-2.5 text-xs lg:px-5"
              >
                {hasWhatsApp ? "Message us" : "Start a project"}
              </Button>
            </nav>

            <button
              ref={triggerRef}
              type="button"
              aria-expanded={mobileOpen}
              aria-controls={PANEL_ID}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((open) => !open)}
              className={cn(
                "relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden",
                headerTheme === "dark"
                  ? "border-white/18 bg-white/12"
                  : "border-orange-100 bg-white/88",
              )}
            >
              <motion.span
                animate={
                  mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="h-px w-5 bg-ink"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="h-px w-5 bg-ink"
              />
              <motion.span
                animate={
                  mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="h-px w-5 bg-ink"
              />
            </button>
          </Container>
        </div>
      </motion.header>

      <NavOverlay
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        panelId={PANEL_ID}
        labelId={LABEL_ID}
      />
    </>
  );
}
