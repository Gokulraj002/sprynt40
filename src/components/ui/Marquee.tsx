import { cn } from "@/lib/cn";

/**
 * Infinite CSS-driven marquee. Duplicates children once so the track can
 * loop seamlessly via a pure `translateX` keyframe (see the `animate-marquee`
 * utility below) — no JS, no layout thrash, pauses on hover, and collapses
 * to a static wrapped row under prefers-reduced-motion.
 */
export function Marquee({
  children,
  className,
  reverse = false,
  durationSeconds = 32,
  pauseOnHover = true,
  fade = true,
}: {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  durationSeconds?: number;
  pauseOnHover?: boolean;
  fade?: boolean;
}) {
  return (
    <div
      className={cn(
        "group/marquee relative flex w-full overflow-hidden motion-reduce:overflow-x-auto",
        fade &&
          "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          style={{
            animationDuration: `${durationSeconds}s`,
            animationDirection: reverse ? "reverse" : "normal",
          }}
          className={cn(
            "flex shrink-0 animate-marquee items-center gap-10 pr-10 motion-reduce:animate-none",
            pauseOnHover && "group-hover/marquee:[animation-play-state:paused]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
