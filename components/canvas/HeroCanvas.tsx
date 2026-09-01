"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// R3F/three only ever load on the client, and only when the device tier
// actually earns the canvas — see shouldUseFallback below.
const SignalField = dynamic(() => import("./SignalField"), { ssr: false });

function shouldUseFallback() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  return reducedMotion || coarsePointer || cores <= 4;
}

/**
 * Hero WebGL background — "noise becoming signal". Renders the R3F point
 * field on capable desktop hardware, and a static CSS gradient everywhere
 * else (reduced motion, touch/coarse pointer, low core count). Gated via
 * useEffect/matchMedia so SSR and the first paint always render the static
 * fallback, keeping hydration consistent.
 */
export default function HeroCanvas() {
  const [mounted, setMounted] = useState(false);
  const [useFallback, setUseFallback] = useState(true);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setMounted(true);
      setUseFallback(shouldUseFallback());
    });

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: coarse)");
    const recheck = () => setUseFallback(shouldUseFallback());

    reducedMotionQuery.addEventListener("change", recheck);
    pointerQuery.addEventListener("change", recheck);
    return () => {
      cancelAnimationFrame(raf);
      reducedMotionQuery.removeEventListener("change", recheck);
      pointerQuery.removeEventListener("change", recheck);
    };
  }, []);

  const showCanvas = mounted && !useFallback;

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {showCanvas ? <SignalField /> : <StaticFallback />}
    </div>
  );
}

function StaticFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-surface">
      <div
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_12%,var(--color-surface-2)_0%,transparent_55%),radial-gradient(110%_100%_at_88%_78%,var(--color-surface-2)_0%,transparent_60%)]"
      />
      <div className="absolute right-[10%] top-1/2 h-[42vh] w-[42vh] -translate-y-1/2 rounded-full bg-accent opacity-[0.14] blur-[120px]" />
    </div>
  );
}
