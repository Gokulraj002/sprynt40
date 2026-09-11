/*
  Shared motion vocabulary — every animated component imports from here.
  One easing language is what makes the site feel designed.
*/
import type { Variants, Transition } from "motion/react";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const; // expo-out
export const DUR = { fast: 0.3, base: 0.5, slow: 0.75 } as const;
export const STAGGER = 0.06;

export const springPremium: Transition = { type: "spring", stiffness: 120, damping: 20, mass: 1 };
export const springSnappy: Transition = { type: "spring", stiffness: 300, damping: 24, mass: 0.6 };

/*
  Viewport config for whileInView reveals.

  `amount` MUST stay height-independent: it maps to an IntersectionObserver
  threshold (intersected area / element area), so any percentage-based amount
  is unsatisfiable for an element taller than the viewport — the ratio caps out
  at viewportH / elementH. A prior `amount: 0.3` silently hid the homepage
  service catalog on mobile, where the 1-column grid is ~4600px tall (max ratio
  ~0.18) so the parent never reached "visible" and, via `when: "beforeChildren"`,
  none of its 15 cards ever animated in.

  `amount: "some"` fires as soon as any part intersects; the negative bottom
  margin keeps the intended "reveal just after it enters" feel without ever
  depending on how tall the element is.
*/
export const viewportOnce = {
  once: true,
  amount: "some",
  margin: "0px 0px -80px 0px",
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR.slow, ease: "easeOut" } },
};

export const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER, when: "beforeChildren" } },
};

/** word/line mask reveal child — pair with an overflow-hidden wrapper */
export const maskUp: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.6, ease: EASE_OUT } },
};
