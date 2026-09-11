import Image from "next/image";
import Link from "next/link";
import type { MouseEventHandler } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/lib/data/site";

/**
 * Sprynt40 brand lockup — orange arrow mark + "Sprynt40" wordmark +
 * "Grow Loud!" tagline. Source asset `public/logo.jpeg` is a tightly-cropped
 * 1400×420 image on brand-black background (~3.33:1 aspect).
 *
 * Rendered with `object-contain` so the full lockup is always visible — no
 * crop, no cut-off letters. The black background reads as an intentional
 * "badge" on either light or dark headers.
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
        "inline-flex items-center rounded-md bg-black px-2 py-1 transition-opacity duration-300 hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:px-2.5 sm:py-1.5",
        className,
      )}
    >
      <Image
        src="/logo.jpeg"
        alt={`${site.name} — ${site.tagline}`}
        width={1400}
        height={420}
        priority
        sizes="(max-width: 640px) 128px, 176px"
        className="block h-8 w-auto object-contain sm:h-9"
      />
    </Link>
  );
}
