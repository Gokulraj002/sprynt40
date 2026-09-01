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

/** viewport config for whileInView reveals */
export const viewportOnce = { once: true, amount: 0.3 } as const;

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
