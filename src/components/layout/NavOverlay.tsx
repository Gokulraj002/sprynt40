"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { hasWhatsApp, site, waLink } from "@/lib/data/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { EASE_OUT, STAGGER } from "@/lib/motion";

/*
  Full-screen mobile nav overlay. Renders as a SIBLING of the header, not a
  child: the header's backdrop-blur makes it a containing block for
  fixed-position descendants, which would collapse this panel's `inset-0` to
  the header's own box instead of the viewport. Its z-index sits below the
  header so the logo and close button stay visible over the panel.

  Design: dark brand ground with a subtle accent glow, one-column layout
  with clear information hierarchy — primary nav, contact block, socials.
  Reads as a proper mobile drawer rather than a magazine takeover.
*/

const panelVariants: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
};

const panelVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.1, ease: "easeOut" } },
};

const linksParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER, delayChildren: 0.15 } },
};

const linksParentReduced: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_OUT },
  },
};

const rowReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15, ease: "easeOut" } },
};

export function NavOverlay({
  open,
  onClose,
  panelId,
  labelId,
}: {
  open: boolean;
  onClose: () => void;
  panelId: string;
  labelId: string;
}) {
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(
      () => firstLinkRef.current?.focus(),
      reducedMotion ? 0 : 120,
    );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, reducedMotion]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelId}
          data-theme="dark"
          variants={reducedMotion ? panelVariantsReduced : panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[90] flex flex-col overflow-y-auto bg-black text-white"
        >
          {/* Ambient accent glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(60%_50%_at_50%_0%,rgba(249,118,4,0.22),transparent_70%)]"
          />

          <h2 id={labelId} className="sr-only">
            Site navigation
          </h2>

          <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-between px-6 pb-10 pt-24 sm:px-8 sm:pt-28">
            <div className="flex flex-col gap-10">
              {/* Section eyebrow */}
              <motion.p
                variants={reducedMotion ? rowReduced : rowVariants}
                initial="hidden"
                animate="visible"
                className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-[color:var(--palette-tagline)]"
              >
                Menu
              </motion.p>

              {/* Primary nav */}
              <motion.nav
                variants={reducedMotion ? linksParentReduced : linksParent}
                initial="hidden"
                animate="visible"
                aria-label="Primary"
                className="flex flex-col divide-y divide-white/10 border-y border-white/10"
              >
                {site.nav.map((item, index) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                  return (
                    <motion.div
                      key={item.href}
                      variants={reducedMotion ? rowReduced : rowVariants}
                    >
                      <Link
                        ref={index === 0 ? firstLinkRef : undefined}
                        href={item.href}
                        onClick={onClose}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "group flex items-center justify-between gap-6 rounded-sm py-5 font-display text-3xl font-semibold tracking-tight transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
                          isActive
                            ? "text-accent"
                            : "text-white hover:text-accent",
                        )}
                      >
                        <span className="flex items-baseline gap-4">
                          <span
                            aria-hidden
                            className="font-sans text-xs font-medium tracking-[0.2em] text-[color:var(--palette-tagline)]"
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          {item.label}
                        </span>
                        <svg
                          aria-hidden
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={cn(
                            "size-5 shrink-0 transition-transform duration-300",
                            isActive
                              ? "text-accent"
                              : "text-white/40 group-hover:translate-x-1 group-hover:text-accent",
                          )}
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.nav>

              {/* Contact block */}
              <motion.div
                variants={reducedMotion ? rowReduced : rowVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: reducedMotion ? 0 : 0.35 }}
                className="grid gap-4"
              >
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-[color:var(--palette-tagline)]">
                  Get in touch
                </p>
                <a
                  href={`mailto:${site.email}`}
                  onClick={onClose}
                  className="group flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 px-4 py-4 text-sm transition-colors hover:border-accent/50 hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest text-[color:var(--palette-tagline)]">
                      Email
                    </span>
                    <span className="mt-1 font-medium text-white">
                      {site.email}
                    </span>
                  </span>
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4 text-white/40 transition-colors group-hover:text-accent"
                  >
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </a>
              </motion.div>
            </div>

            {/* Footer: primary CTA + socials + tagline */}
            <motion.div
              variants={reducedMotion ? rowReduced : rowVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: reducedMotion ? 0 : 0.45 }}
              className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-6"
            >
              <Button
                href={waLink("Hi! I want to talk about growth.")}
                variant={hasWhatsApp ? "whatsapp" : "accent"}
                external={hasWhatsApp}
                className="w-full justify-center py-3.5"
              >
                {hasWhatsApp ? "Chat on WhatsApp" : "Start a project"}
              </Button>

              <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {site.socials.map((social) => (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-sm text-sm text-[color:var(--palette-tagline)] transition-colors duration-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>

              <p className="text-xs text-[color:var(--palette-tagline)]">
                &copy; {new Date().getFullYear()} {site.name} · {site.tagline}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
