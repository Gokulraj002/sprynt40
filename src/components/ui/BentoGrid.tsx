import { cn } from "@/lib/cn";
import { Spotlight } from "@/components/ui/Spotlight";

/**
 * Asymmetric bento layout — the current default for "premium SaaS/agency"
 * capability grids (replaces the plain equal-width card row). `span`
 * controls how many of the 6 desktop columns a cell occupies.
 */
export function BentoGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-6", className)}>
      {children}
    </div>
  );
}

export function BentoCard({
  span = 2,
  theme,
  className,
  children,
}: {
  span?: 2 | 3 | 4 | 6;
  theme?: "dark" | "light";
  className?: string;
  children: React.ReactNode;
}) {
  const spanClass = {
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
    6: "md:col-span-6",
  }[span];

  return (
    <Spotlight
      data-theme={theme}
      className={cn(
        "card-lit rounded-2xl border border-line bg-surface-2",
        spanClass,
        className,
      )}
    >
      {children}
    </Spotlight>
  );
}
