"use client";

/*
  Global Lenis smooth-scroll wrapper. Mounted once, high in the tree
  (app/layout.tsx), around the whole app.

  Skips Lenis entirely — falls back to native scroll — when the user
  prefers reduced motion or is on a coarse (touch) pointer, since
  smoothed inertia scrolling reads as laggy input on touch devices.
*/

import { useEffect, useRef } from "react";
import Lenis from "lenis";

const HEADER_OFFSET = 80;

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reducedMotion || coarsePointer) return;

    const lenis = new Lenis({
      duration: 1.1,
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Same-page hash links (nav uses "/#services" etc.) — native hash jump
    // is instant and ignores Lenis's virtual scroll position, so intercept
    // and drive the scroll through Lenis with an offset for the fixed header.
    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement)?.closest("a[href*='#']") as HTMLAnchorElement | null;
      if (!anchor) return;

      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
      if (!url.hash) return;

      const target = document.querySelector(url.hash);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -HEADER_OFFSET });
      history.pushState(null, "", url.hash);
    }
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
