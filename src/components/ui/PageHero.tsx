import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

type Tone = "violet" | "emerald" | "amber" | "cyan";

type Cta = { label: string; href: string; external?: boolean };

type HeroImage = {
  src: string;
  alt: string;
  /** Banner crop, as an object-position value. e.g. "center 52%" */
  position?: string;
  /** Slight zoom and saturation lift, for flatter source images. */
  muted?: boolean;
  /** Short chips shown beneath the copy. */
  labels?: string[];
};

type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  tone?: Tone;
  primary?: Cta;
  secondary?: Cta;
  /** "image" is a full-bleed banner; "none" is a compact text-only header. */
  visual?: "image" | "none";
  /** Compact keeps content-rich page banners below the first-screen fold. */
  size?: "standard" | "compact";
  image?: HeroImage;
};

/** Only the eyebrow chip and the label dots carry the tone colour. */
const toneClass: Record<Tone, { chip: string; dot: string }> = {
  violet: { chip: "border-violet/20 bg-violet/10 text-violet", dot: "bg-violet" },
  emerald: { chip: "border-emerald-200 bg-emerald-50 text-emerald-800", dot: "bg-emerald-500" },
  amber: { chip: "border-amber-200 bg-amber-50 text-amber-800", dot: "bg-amber-500" },
  cyan: { chip: "border-cyan-200 bg-cyan-50 text-cyan-800", dot: "bg-cyan-500" },
};

export function PageHero({ visual = "image", size = "standard", image, ...props }: PageHeroProps) {
  return visual === "image" && image ? (
    <BannerHero {...props} image={image} size={size} />
  ) : (
    <TextHero {...props} />
  );
}

/** Full-bleed banner with the copy laid over it. Used by every page but the legal ones. */
function BannerHero({
  eyebrow,
  title,
  lead,
  tone = "violet",
  primary,
  secondary,
  image,
  size,
}: Omit<PageHeroProps, "visual" | "image" | "size"> & {
  image: HeroImage;
  size: "standard" | "compact";
}) {
  return (
    <Section
      theme="dark"
      className={cn(
        "flex min-h-[520px] overflow-hidden bg-base-dark pt-24 pb-10 sm:min-h-[560px] sm:pt-28 sm:pb-12",
        size === "compact"
          ? "lg:min-h-[620px] lg:pt-28 lg:pb-12"
          : "lg:min-h-[clamp(720px,calc(100svh-4rem),920px)] lg:pt-36 lg:pb-20",
      )}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        style={{ objectPosition: image.position ?? "center" }}
        className={cn(
          "absolute inset-0 object-cover hero-banner-kenburns",
          image.muted && "scale-[1.035] saturate-[1.08] contrast-[1.03]",
        )}
      />

      {/* Scrims — keep the copy legible over any part of the image. */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,18,0.78)_0%,rgba(5,8,18,0.5)_38%,rgba(5,8,18,0.14)_72%,rgba(5,8,18,0.08)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,18,0.26)_0%,rgba(5,8,18,0.05)_42%,rgba(5,8,18,0.48)_100%)]" />

      <Container className="relative z-10 flex flex-1 items-end">
        <div className="max-w-[21rem] sm:max-w-4xl">
          <p className="inline-flex rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-md">
            {eyebrow}
          </p>

          <h1 className="mt-5 font-display text-[clamp(2.05rem,9vw,4.9rem)] font-semibold leading-[1.05] tracking-normal text-white text-balance sm:leading-[1.03]">
            {title}
          </h1>

          {lead && (
            <p className="mt-5 max-w-[20rem] text-[0.95rem] leading-7 text-white/78 sm:max-w-2xl sm:text-lg">
              {lead}
            </p>
          )}

          <CtaRow primary={primary} secondary={secondary} onDark />

          {image.labels && image.labels.length > 0 && (
            <div className="mt-7 hidden max-w-xl flex-wrap gap-2 sm:flex">
              {image.labels.map((label, index) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-2 text-xs font-semibold uppercase text-white/82 backdrop-blur-md"
                >
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      index === 1 ? toneClass[tone].dot : "bg-white/45",
                    )}
                  />
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

/**
 * Compact text-only header. Used by the legal pages, which deliberately carry
 * no banner: they are reference documents people open to find one clause, so
 * a full-bleed hero would only push the content further down.
 */
function TextHero({
  eyebrow,
  title,
  lead,
  tone = "violet",
  primary,
  secondary,
}: Omit<PageHeroProps, "visual" | "image">) {
  return (
    <Section
      theme="light"
      className="overflow-hidden bg-[radial-gradient(circle_at_15%_10%,rgba(249,115,22,0.13),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fbff_62%,#ffffff_100%)] pt-28 pb-10 sm:pt-32 sm:pb-12 lg:pt-36 lg:pb-14"
    >
      <Container>
        <div className="max-w-3xl">
          <p
            className={cn(
              "inline-flex rounded-full border px-4 py-2 text-sm font-semibold shadow-sm",
              toneClass[tone].chip,
            )}
          >
            {eyebrow}
          </p>

          <h1 className="mt-6 font-display text-[clamp(2.1rem,3.6vw,3.4rem)] font-semibold leading-[1.02] tracking-normal text-ink text-balance">
            {title}
          </h1>

          {lead && (
            <p className="mt-5 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
              {lead}
            </p>
          )}

          <CtaRow primary={primary} secondary={secondary} />
        </div>
      </Container>
    </Section>
  );
}

function CtaRow({
  primary,
  secondary,
  onDark = false,
}: {
  primary?: Cta;
  secondary?: Cta;
  onDark?: boolean;
}) {
  if (!primary && !secondary) return null;

  return (
    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
      {primary && (
        <Button
          href={primary.href}
          variant="accent"
          external={primary.external ?? primary.href.startsWith("http")}
          className="px-7"
        >
          {primary.label}
        </Button>
      )}
      {secondary && (
        <Button
          href={secondary.href}
          variant="outline"
          external={secondary.external ?? secondary.href.startsWith("http")}
          className={cn(
            "px-7",
            onDark
              ? "border-white/24 bg-white/10 text-white backdrop-blur-md hover:border-white/60"
              : "bg-white/75",
          )}
        >
          {secondary.label}
        </Button>
      )}
    </div>
  );
}
