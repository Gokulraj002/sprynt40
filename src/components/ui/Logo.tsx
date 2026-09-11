import Image from "next/image";
import Link from "next/link";
import type { MouseEventHandler } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/lib/data/site";

/**
 * Sprynt40 brand lockup — orange arrow mark + "Sprynt40" wordmark + "Grow Loud!"
 * tagline, all together in one asset (public/logos.jpeg, 1600×1600, black bg).
 *
 * The source image has ~40% padding around the actual mark, so we render it
 * into a wide container with `object-cover` — the crop lands exactly on the
 * logo band and the surrounding black reads as an intentional brand badge on
 * light or dark surfaces.
 */
export function Logo({
  className,
  onClick,
  withTagline = true,
}: {
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  /** kept for API compatibility; tagline is baked into the lockup asset. */
  withTagline?: boolean;
}) {
  void withTagline;

  return (
    <Link
      href="/"
      aria-label={`${site.name} — ${site.tagline}`}
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-sm transition-opacity duration-300 hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
        className,
      )}
    >
      <Image
        src="/logos.jpeg"
        alt={`${site.name} — ${site.tagline}`}
        width={1600}
        height={1600}
        priority
        className="h-10 w-40 rounded-md object-cover object-center sm:h-12 sm:w-48"
      />
    </Link>
  );
}
