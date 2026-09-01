import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

type Tone = "violet" | "emerald" | "amber" | "cyan";
type HeroImage = {
  src: string;
  alt: string;
  position?: string;
  muted?: boolean;
  badge?: string;
  labels?: string[];
};

const toneClass: Record<Tone, { text: string; chip: string; glow: string; dot: string }> = {
  violet: {
    text: "text-violet",
    chip: "border-violet/20 bg-violet/10 text-violet",
    glow: "from-violet/25 via-fuchsia-200/35 to-cyan-100/50",
    dot: "bg-violet",
  },
  emerald: {
    text: "text-emerald-700",
    chip: "border-emerald-200 bg-emerald-50 text-emerald-800",
    glow: "from-emerald-200/45 via-cyan-100/50 to-white",
    dot: "bg-emerald-500",
  },
  amber: {
    text: "text-amber-700",
    chip: "border-amber-200 bg-amber-50 text-amber-800",
    glow: "from-amber-200/45 via-orange-100/45 to-white",
    dot: "bg-amber-500",
  },
  cyan: {
    text: "text-cyan-700",
    chip: "border-cyan-200 bg-cyan-50 text-cyan-800",
    glow: "from-cyan-200/45 via-violet-100/40 to-white",
    dot: "bg-cyan-500",
  },
};

export function PageHero({
  eyebrow,
  title,
  lead,
  tone = "violet",
  primary,
  secondary,
  visual = "bridge",
  image,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  tone?: Tone;
  primary?: { label: string; href: string; external?: boolean };
  secondary?: { label: string; href: string; external?: boolean };
  visual?: "bridge" | "services" | "metrics" | "image" | "none";
  image?: HeroImage;
}) {
  const toneStyles = toneClass[tone];
  const hasImageBackground = visual === "image" && Boolean(image);

  if (hasImageBackground && image) {
    return (
      <Section
        theme="dark"
        className="flex min-h-[520px] overflow-hidden bg-base-dark pt-24 pb-10 sm:min-h-[560px] sm:pt-28 sm:pb-12 lg:min-h-[600px] lg:pt-32 lg:pb-14 xl:min-h-[620px]"
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className={cn(
            "absolute inset-0 object-cover hero-banner-kenburns",
            image.muted && "scale-[1.035] saturate-[1.08] contrast-[1.03]",
          )}
          style={{ objectPosition: image.position ?? "center" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,18,0.78)_0%,rgba(5,8,18,0.5)_38%,rgba(5,8,18,0.14)_72%,rgba(5,8,18,0.08)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,18,0.26)_0%,rgba(5,8,18,0.05)_42%,rgba(5,8,18,0.48)_100%)]" />
        <div className="absolute inset-y-0 left-0 w-full max-w-5xl bg-[radial-gradient(circle_at_20%_55%,rgba(5,8,18,0.42),transparent_48%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(255,255,255,0.18),transparent_30%)]" />

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
            {(primary || secondary) && (
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
                    className="border-white/24 bg-white/10 px-7 text-white backdrop-blur-md hover:border-white/60"
                  >
                    {secondary.label}
                  </Button>
                )}
              </div>
            )}

            {image.labels && image.labels.length > 0 && (
              <div className="mt-7 hidden max-w-xl flex-wrap gap-2 sm:flex">
                {image.labels.map((label, index) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-2 text-xs font-semibold uppercase text-white/82 backdrop-blur-md"
                  >
                    <span className={cn("size-2 rounded-full", index === 1 ? toneStyles.dot : "bg-white/45")} />
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

  return (
    <Section
      theme="light"
      className={cn(
        "overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-18 lg:pt-36 lg:pb-20",
        "bg-[radial-gradient(circle_at_15%_10%,rgba(139,92,246,0.14),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fbff_62%,#ffffff_100%)]",
      )}
    >
      <Container className="grid items-center gap-10 lg:grid-cols-[0.98fr_1.02fr] lg:gap-16">
        <div className="max-w-3xl">
          <p
            className={cn(
              "inline-flex rounded-full border px-4 py-2 text-sm font-semibold shadow-sm",
              toneStyles.chip,
            )}
          >
            {eyebrow}
          </p>
          <h1 className="mt-6 font-display text-[clamp(2.7rem,6vw,5.8rem)] font-semibold leading-[1.02] tracking-normal text-ink text-balance">
            {title}
          </h1>
          {lead && <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-muted sm:text-xl">{lead}</p>}
          {(primary || secondary) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
                  className="bg-white/75 px-7"
                >
                  {secondary.label}
                </Button>
              )}
            </div>
          )}
        </div>

        {visual !== "none" && (
          <div className="relative min-h-[360px] overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/80 p-4 shadow-[0_30px_90px_-45px_rgba(76,29,149,0.5)] backdrop-blur">
            <div className={cn("absolute inset-0 bg-gradient-to-br", toneStyles.glow)} />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.055)_1px,transparent_1px)] bg-[size:34px_34px]" />
            {visual === "image" && image && <ImageBannerVisual image={image} dotClass={toneStyles.dot} />}
            {visual === "bridge" && <BridgeVisual dotClass={toneStyles.dot} />}
            {visual === "services" && <ServicesVisual textClass={toneStyles.text} />}
            {visual === "metrics" && <MetricsVisual dotClass={toneStyles.dot} />}
          </div>
        )}
      </Container>
    </Section>
  );
}

function ImageBannerVisual({
  image,
  dotClass,
}: {
  image: HeroImage;
  dotClass: string;
}) {
  const labels = image.labels ?? ["Strategy", "Creative", "Conversion"];

  return (
    <div className="relative min-h-[330px] overflow-hidden rounded-[1.35rem]">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 1024px) 48vw, 100vw"
        className={cn(
          "object-cover hero-banner-kenburns",
          image.muted && "scale-110 blur-[1.5px] saturate-[0.85]",
        )}
        style={{ objectPosition: image.position ?? "center" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.5)_42%,rgba(15,23,42,0.16)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.72),transparent_34%)]" />

      <div className="relative flex min-h-[330px] flex-col justify-end p-5 sm:p-6">
        <div className="max-w-sm rounded-[1.15rem] border border-white/75 bg-white/82 p-5 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.55)] backdrop-blur-md">
          <p className="text-xs font-semibold uppercase text-ink-muted">
            {image.badge ?? "Digital growth system"}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {labels.map((label, index) => (
              <div
                key={label}
                className="rounded-xl border border-line bg-white/80 px-3 py-3 text-center"
              >
                <span className={cn("mx-auto block size-2 rounded-full", index === 1 ? dotClass : "bg-ink/35")} />
                <span className="mt-2 block text-[11px] font-semibold uppercase leading-4 text-ink">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BridgeVisual({ dotClass }: { dotClass: string }) {
  return (
    <div className="relative flex h-full min-h-[330px] items-center justify-center">
      <div className="absolute left-6 top-8 rounded-2xl border border-line bg-white/80 px-5 py-4 shadow-sm">
        <p className="text-xs font-semibold uppercase text-ink-muted">Your customer</p>
        <p className="mt-1 font-display text-2xl font-semibold text-ink">Intent</p>
      </div>
      <div className="absolute right-6 bottom-8 rounded-2xl border border-line bg-white/80 px-5 py-4 shadow-sm">
        <p className="text-xs font-semibold uppercase text-ink-muted">Your business</p>
        <p className="mt-1 font-display text-2xl font-semibold text-ink">Revenue</p>
      </div>
      <div className="relative h-24 w-[78%] rounded-[999px] border border-white/70 bg-white/65 shadow-inner">
        <div className="absolute left-[9%] top-1/2 h-4 w-[82%] -translate-y-1/2 rounded-full bg-ink" />
        <div className="absolute left-[9%] top-1/2 h-4 w-[50%] -translate-y-1/2 rounded-full bg-accent" />
        {[12, 28, 44, 60, 76].map((left, index) => (
          <span
            key={left}
            className={cn(
              "absolute top-1/2 size-8 -translate-y-1/2 rounded-full border-4 border-white shadow-md",
              index < 3 ? dotClass : "bg-ink",
            )}
            style={{ left: `${left}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function ServicesVisual({ textClass }: { textClass: string }) {
  const items = ["Strategy", "Paid Ads", "SEO", "Social", "CRO", "Content"];
  return (
    <div className="relative grid min-h-[330px] place-items-center">
      <div className="rounded-[1.5rem] border border-line bg-white/85 p-6 shadow-xl">
        <p className={cn("text-sm font-semibold uppercase", textClass)}>Digital marketing</p>
        <p className="mt-2 font-display text-5xl font-semibold leading-none text-ink">
          Smart strategies.
          <br />
          Stronger growth.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {items.map((item) => (
            <span key={item} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricsVisual({ dotClass }: { dotClass: string }) {
  return (
    <div className="relative grid min-h-[330px] place-items-center">
      <div className="grid w-full max-w-sm gap-4">
        {[
          ["Creative tests", "12+"],
          ["Qualified leads", "+64%"],
          ["ROAS clarity", "3.2x"],
        ].map(([label, value], index) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-2xl border border-line bg-white/85 p-5 shadow-sm"
            style={{ transform: `translateX(${index % 2 ? 18 : -10}px)` }}
          >
            <span className="flex items-center gap-3 text-sm font-medium text-ink-muted">
              <span className={cn("size-2 rounded-full", dotClass)} />
              {label}
            </span>
            <span className="font-display text-3xl font-semibold text-ink">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
