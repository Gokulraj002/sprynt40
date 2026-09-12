"use client";

/**
 * Custom dual-layer cursor: an instant 6px dot plus a spring-lagged 32px ring.
 * Hard-gated to fine-pointer, hover-capable devices with no reduced-motion
 * preference — never mounts listeners or renders anything on touch/coarse
 * pointers or when the user asks for reduced motion. Native cursor stays
 * visible throughout; this is an accent layer, not a replacement.
 */

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

const DOT_SIZE = 6;
const RING_SIZE = 32;
const RING_SIZE_INTERACTIVE = 44;
const RING_SIZE_LABELED = 96;

type CursorState = {
  label: string | null;
  interactive: boolean;
};

const IDLE_STATE: CursorState = { label: null, interactive: false };

export default function Cursor() {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>(IDLE_STATE);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const ringX = useSpring(mouseX, { damping: 22, stiffness: 300, mass: 0.5 });
  const ringY = useSpring(mouseY, { damping: 22, stiffness: 300, mass: 0.5 });

  // SSR-safe gate check: only ever evaluated on the client, after mount.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));

    const fineMq = window.matchMedia("(pointer: fine) and (hover: hover)");
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const evaluate = () => setEnabled(fineMq.matches && !reducedMq.matches);
    evaluate();

    fineMq.addEventListener("change", evaluate);
    reducedMq.addEventListener("change", evaluate);

    return () => {
      cancelAnimationFrame(raf);
      fineMq.removeEventListener("change", evaluate);
      reducedMq.removeEventListener("change", evaluate);
    };
  }, []);

  // Listeners only attach once the hard gate is satisfied; fully torn down
  // the moment it isn't (media query flips, or unmount).
  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const zoneOf = (node: EventTarget | null) =>
      (node as Element | null)?.closest?.("[data-cursor], a, button") ?? null;

    const handleOver = (e: MouseEvent) => {
      const zone = zoneOf(e.target);
      if (!zone) return;
      const label = (zone as HTMLElement).dataset.cursor ?? null;
      setCursorState({ label, interactive: !label });
    };

    const handleOut = (e: MouseEvent) => {
      const fromZone = zoneOf(e.target);
      if (!fromZone) return;
      const toZone = zoneOf(e.relatedTarget);
      if (toZone === fromZone) return; // still inside the same hovered zone
      setCursorState(IDLE_STATE);
    };

    window.addEventListener("pointermove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      setCursorState(IDLE_STATE);
    };
  }, [enabled, mouseX, mouseY]);

  if (!mounted || !enabled) return null;

  const ringSize = cursorState.label
    ? RING_SIZE_LABELED
    : cursorState.interactive
      ? RING_SIZE_INTERACTIVE
      : RING_SIZE;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden="true">
      {/* Dot: tracks the raw mouse position 1:1, zero lag */}
      <motion.div
        className="absolute left-0 top-0 rounded-full bg-white mix-blend-difference"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      {/*
        Ring: spring-lagged follower, grows for interactive and labelled
        targets. The box stays a fixed RING_SIZE and only `scale` animates —
        animating width/height instead would force layout and paint on every
        frame of a cursor that moves constantly.
      */}
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-white mix-blend-difference"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ scale: ringSize / RING_SIZE }}
        transition={{ type: "spring", damping: 22, stiffness: 300, mass: 0.5 }}
      >
        {cursorState.label && (
          <motion.span
            // Undo the ring's scale so the label stays at its real size.
            animate={{ scale: RING_SIZE / ringSize }}
            transition={{ type: "spring", damping: 22, stiffness: 300, mass: 0.5 }}
            className="whitespace-nowrap text-[11px] font-medium uppercase tracking-wide text-white"
          >
            {cursorState.label}
          </motion.span>
        )}
      </motion.div>
    </div>
  );
}
