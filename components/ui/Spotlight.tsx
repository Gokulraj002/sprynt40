"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Mouse-follow radial glow — the signature "premium SaaS card" treatment
 * (Aceternity/Linear pattern). Wrap any bordered surface in <Spotlight>;
 * the glow tracks the pointer and fades in/out on enter/leave. Pointer-only
 * (desktop feel); on touch devices the glow simply never fires, which reads
 * as fine since there's no visible cost.
 */
export function Spotlight({
  className,
  children,
  size = 400,
  ...rest
}: {
  className?: string;
  children: React.ReactNode;
  size?: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-size);
  const mouseY = useMotionValue(-size);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleLeave = () => {
    mouseX.set(-size);
    mouseY.set(-size);
  };

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${mouseX}px ${mouseY}px, var(--color-accent) 0%, transparent 70%)`;

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn("group relative isolate overflow-hidden", className)}
      {...rest}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.08] motion-reduce:!opacity-0"
        style={{ background }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
