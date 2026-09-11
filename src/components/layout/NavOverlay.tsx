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
import { EASE_OUT, STAGGER, maskUp } from "@/lib/motion";

/*
  Full-screen mobile nav overlay. Must render as a SIBLING of the header, not
  a child: the header's backdrop-blur makes it a containing block for
  fixed-position descendants, which would collapse this panel's `inset-0` to
  the header's own box instead of the viewport. Its z-index sits below the
  header so the logo and close button stay visible over the panel.
  See Header.tsx for the trigger + focus return logic. This component owns:
  the panel wipe + staggered link reveal, the dialog a11y pattern (focus trap,
  Escape, initial focus), and the reduced-motion fallback.
*/

const panelVariants: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.7, ease: EASE_OUT },
  },
  exit: {
    clipPath: "inset(0 0 100% 0)",
    transition: { duration: 0.45, ease: EASE_OUT },
  },
};

const panelVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

const linksParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER, delayChildren: 0.4 } },
};

const linksParentReduced: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const rowReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
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
      reducedMotion ? 0 : 150,
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
          variants={reducedMotion ? panelVariantsReduced : panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[90] flex flex-col bg-[linear-gradient(180deg,#ffffff_0%,#fff8ef_58%,#eefbff_100%)] pt-20 sm:pt-28"
        >
          <h2 id={labelId} className="sr-only">
            Site navigation
          </h2>

          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-between px-5 pb-8 sm:px-8 sm:pb-10">
            <motion.nav
              variants={reducedMotion ? linksParentReduced : linksParent}
              initial="hidden"
              animate="visible"
              aria-label="Primary"
              className="flex flex-col gap-1"
            >
              {site.nav.map((item, index) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <div key={item.href} className="overflow-hidden">
                    <motion.div variants={reducedMotion ? rowReduced : maskUp}>
                      <Link
                        ref={index === 0 ? firstLinkRef : undefined}
                        href={item.href}
                        onClick={onClose}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "block rounded-sm py-1.5 font-display text-[clamp(2rem,12vw,4.5rem)] font-semibold leading-[1.04] tracking-normal transition-colors duration-300 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:py-2",
                          isActive ? "text-accent" : "text-ink",
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  </div>
                );
              })}
            </motion.nav>

            <motion.div
              variants={reducedMotion ? rowReduced : maskUp}
              className="flex flex-col items-stretch gap-5 border-t border-orange-100 pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pt-6"
            >
              <Button
                href={waLink("Hi! I want to talk about growth.")}
                variant={hasWhatsApp ? "whatsapp" : "accent"}
                external={hasWhatsApp}
              >
                {hasWhatsApp ? "Message us" : "Start a project"}
              </Button>
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-3">
                {site.socials.map((social) => (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-sm text-sm text-ink-muted transition-colors duration-300 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
