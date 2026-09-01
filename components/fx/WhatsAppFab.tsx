"use client";

/**
 * Persistent WhatsApp FAB — our answer to the reference site's pixel-art
 * mascot (see reference-monkfunnel.md), rebuilt in SIGNAL's own voice: no
 * mascot, no cartoon, just a dark-lab signal pill that periodically surfaces
 * a one-line brand quip.
 *
 * Collapsed: a 48px WhatsApp-green circle, bottom-right.
 * Every ~12s (while visible, motion is allowed, and the tab is active) it
 * expands via a spring layout animation to reveal one rotating quip for ~5s,
 * then collapses again. Reduced motion disables the cycle entirely — the
 * circle stays static. The whole pill is a single wa.me link.
 */

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { hasWhatsApp, waLink } from "@/lib/data/site";
import { DUR, EASE_OUT, springSnappy } from "@/lib/motion";
import { cn } from "@/lib/cn";

const QUIPS = [
  "Your conversion ceiling is a copy problem.",
  "One metric. Every week.",
  "Live in 14 days — ask us how.",
  "The creative is the targeting.",
  "Losers die fast. Winners get the budget.",
] as const;

const SCROLL_THRESHOLD = 600;
const CYCLE_EVERY = 12_000;
const EXPANDED_FOR = 5_000;

const HREF = waLink("Hi! I'd like to talk about growth.");

export default function WhatsAppFab() {
  if (!hasWhatsApp) return null;
  return <WhatsAppFabInner />;
}

function WhatsAppFabInner() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [quipIndex, setQuipIndex] = useState(0);

  const expandTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll gate: only ever show once the visitor is ~600px into the page.
  useEffect(() => {
    const evaluate = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    evaluate();
    window.addEventListener("scroll", evaluate, { passive: true });
    return () => window.removeEventListener("scroll", evaluate);
  }, []);

  // Quip cycle: self-scheduling timers (not setInterval) so a backgrounded
  // tab or an unmount can cleanly cancel exactly what's pending.
  useEffect(() => {
    const clearTimers = () => {
      if (expandTimer.current) clearTimeout(expandTimer.current);
      if (collapseTimer.current) clearTimeout(collapseTimer.current);
      expandTimer.current = null;
      collapseTimer.current = null;
    };

    if (prefersReducedMotion || !visible) {
      clearTimers();
      collapseTimer.current = setTimeout(() => setExpanded(false), 0);
      return;
    }

    const scheduleExpand = () => {
      expandTimer.current = setTimeout(() => {
        if (document.hidden) {
          // Tab is backgrounded — don't pop the quip open unseen, just
          // keep waiting until it's foregrounded again.
          scheduleExpand();
          return;
        }
        setQuipIndex((i) => (i + 1) % QUIPS.length);
        setExpanded(true);
        collapseTimer.current = setTimeout(() => {
          setExpanded(false);
          scheduleExpand();
        }, EXPANDED_FOR);
      }, CYCLE_EVERY);
    };

    scheduleExpand();

    const onVisibilityChange = () => {
      if (document.hidden) {
        clearTimers();
        setExpanded(false);
      } else if (!expandTimer.current && !collapseTimer.current) {
        scheduleExpand();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearTimers();
    };
  }, [visible, prefersReducedMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          transition={{ duration: DUR.fast, ease: EASE_OUT }}
        >
          <motion.a
            href={HREF}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            layout
            transition={springSnappy}
            className={cn(
              "flex h-12 items-center justify-center gap-2 rounded-full bg-[#25d366] px-3 text-[#062b16] shadow-lg",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            )}
          >
            <WhatsAppGlyph className="h-6 w-6 shrink-0" />
            {!prefersReducedMotion && (
              <AnimatePresence mode="wait">
                {expanded && (
                  <motion.span
                    key={quipIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DUR.fast, ease: EASE_OUT }}
                    className="whitespace-nowrap pr-1 text-sm font-medium"
                  >
                    {QUIPS[quipIndex]}
                  </motion.span>
                )}
              </AnimatePresence>
            )}
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.148.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.99.583 3.845 1.588 5.401L2 22l4.735-1.556A9.953 9.953 0 0 0 12.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2zm0 18.2a8.174 8.174 0 0 1-4.166-1.142l-.299-.177-2.812.924.93-2.74-.194-.283A8.15 8.15 0 0 1 3.8 12c0-4.529 3.673-8.2 8.2-8.2 4.528 0 8.201 3.671 8.201 8.2 0 4.528-3.673 8.2-8.2 8.2z" />
    </svg>
  );
}
