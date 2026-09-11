"use client";

/**
 * Global scroll fx: a top-edge progress bar plus a back-to-top button.
 *
 * Progress bar: pure transform (scaleX, origin-left) driven by scrollYProgress,
 * smoothed through a spring for a premium "catching up" feel. The bar mirrors
 * scroll position rather than being decorative motion, so it stays springy even
 * under reduced motion — only the spring lag itself is removed.
 *
 * Back-to-top: appears once the page has scrolled past 1.5 viewport heights,
 * offset left of the WhatsApp FAB slot so the two never overlap. Lenis (mounted
 * on fine-pointer devices via SmoothScroll) intercepts wheel/touch input, but a
 * programmatic window.scrollTo still works — Lenis listens to native scroll
 * events and stays in sync.
 */

import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 150, damping: 30 });

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const threshold = () => window.innerHeight * 1.5;

    const evaluate = () => setShowBackToTop(window.scrollY > threshold());
    evaluate();

    window.addEventListener("scroll", evaluate, { passive: true });
    window.addEventListener("resize", evaluate);

    return () => {
      window.removeEventListener("scroll", evaluate);
      window.removeEventListener("resize", evaluate);
    };
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent"
        style={{ scaleX: reduceMotion ? scrollYProgress : smoothProgress }}
      />

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            onClick={handleBackToTop}
            aria-label="Back to top"
            initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
            transition={reduceMotion ? { duration: 0.15 } : { type: "spring", stiffness: 300, damping: 24, mass: 0.6 }}
            className="fixed bottom-4 right-20 z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface-2 text-ink transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:bottom-6 sm:right-24"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="pointer-events-none"
            >
              <path
                d="M8 13V3M8 3L3 8M8 3l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
