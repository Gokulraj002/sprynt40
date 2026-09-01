import { cn } from "@/lib/cn";

/**
 * Themed page section. `theme` re-scopes the semantic color tokens,
 * so children keep using bg-surface / text-ink / border-line.
 */
export function Section({
  id,
  theme,
  grain,
  className,
  children,
}: {
  id?: string;
  theme?: "dark" | "light";
  grain?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-theme={theme}
      className={cn("relative py-20 sm:py-28 lg:py-36", grain && "grain", className)}
    >
      {children}
    </section>
  );
}
