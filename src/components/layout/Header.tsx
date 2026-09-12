"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

/*
  The surface probe has to run BEFORE the browser paints, otherwise the bar
  paints once in its initial state and then corrects itself — a white flash
  on top of the dark hero. useLayoutEffect does exactly that; the alias keeps
  React from warning during the server render, where layout effects never run.
*/
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [surfaceTheme, setSurfaceTheme] = useState<"light" | "dark">("light");

  const headerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  const { scrollY } = useScroll();
  const pathname = usePathname();
  const headerTheme = mobileOpen ? "dark" : surfaceTheme;

  // Close the mobile overlay whenever the route changes (e.g. a social link
  // or programmatic navigation), not just on direct nav-link clicks.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMobileOpen(false));
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  /*
    Mirror the theme of whichever [data-theme] surface sits beneath the bar.

    This measures geometry rather than hit-testing with elementsFromPoint.
    Hit-testing only answers correctly once the page has painted, so on a
    client-side route change it returned nothing and the bar fell back to
    light — a white header sitting on top of the dark hero. Reading
    getBoundingClientRect is deterministic and correct as soon as layout
    exists, which is immediately after commit — before paint.
  */
  useIsomorphicLayoutEffect(() => {
    let raf = 0;

    const probe = () => {
      const header = headerRef.current;
      // Sample just below the bar so we read the surface it overlaps.
      const y = (header?.offsetHeight ?? 64) / 2;

      const surfaces = document.querySelectorAll<HTMLElement>("[data-theme]");
      let match: string | null = null;

      for (const surface of surfaces) {
        if (header?.contains(surface)) continue;
        const rect = surface.getBoundingClientRect();
        // Last match wins, so a themed child overrides its themed parent.
        if (rect.top <= y && rect.bottom > y) {
          match = surface.getAttribute("data-theme");
        }
      }

      if (match) setSurfaceTheme(match === "dark" ? "dark" : "light");
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(probe);
    };

    probe();
    schedule();

    /*
      Re-probe when the content under the bar is replaced, not just when the
      route changes. Next shows the `loading.tsx` fallback first — and that
      skeleton is light-themed — so the bar correctly turns light, then the
      real (dark) hero swaps in under it. `pathname` does not change across
      that swap, so without these observers the header stayed white until the
      visitor happened to scroll.
    */
    const main = document.querySelector("main");
    const resizeObserver = new ResizeObserver(schedule);
    if (main) resizeObserver.observe(main);

    const mutationObserver = new MutationObserver(schedule);
    if (main) mutationObserver.observe(main, { childList: true });

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
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
              : "border-b border-line bg-white/78 backdrop-blur-xl",
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
                "relative flex size-11 flex-col items-center justify-center gap-1.5 rounded-full border shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden",
                headerTheme === "dark"
                  ? "border-white/18 bg-white/12"
                  : "border-line bg-white/88",
              )}
            >
              <motion.span
                animate={
                  mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.18, ease: EASE_OUT }}
                className="h-[1.5px] w-5 bg-current"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="h-[1.5px] w-5 bg-current"
              />
              <motion.span
                animate={
                  mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.18, ease: EASE_OUT }}
                className="h-[1.5px] w-5 bg-current"
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
