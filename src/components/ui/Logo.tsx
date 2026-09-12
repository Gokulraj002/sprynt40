import Image from "next/image";
import Link from "next/link";
import type { MouseEventHandler } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/lib/data/site";

/**
 * Sprynt40 brand lockup, rendered from the supplied `public/logos.jpeg`.
 *
 * That file is a 1600×1600 square with the mark sitting in a band across the
 * middle — roughly a quarter of the height — surrounded by black. Rendering
 * the whole square with `object-contain` therefore draws the wordmark at a
 * quarter of the box height, which is why it read as tiny in the header.
 *
 * A wide box plus `object-cover` frames just that band instead, so the mark
 * fills the space. The source file is never modified; this is purely how it
 * is cropped at render time. The surrounding black reads as an intentional
 * badge on light and dark headers alike.
 */
export function Logo({
  className,
  onClick,
  withTagline = true,
}: {
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  /** Kept for API compatibility; the tagline is baked into the artwork. */
  withTagline?: boolean;
}) {
  void withTagline;

  return (
    <Link
      href="/"
      aria-label={`${site.name} — ${site.tagline}`}
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-lg transition-opacity duration-300 hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
        className,
      )}
    >
      <Image
        src="/logos.jpeg"
        alt={`${site.name} — ${site.tagline}`}
        width={1600}
        height={1600}
        priority
        sizes="(max-width: 640px) 168px, 224px"
        // 4:1 box + object-cover crops the square down to the logo band.
        className="block h-11 w-[10.5rem] rounded-lg object-cover object-center sm:h-14 sm:w-56"
      />
    </Link>
  );
}
