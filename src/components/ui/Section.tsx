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
  ref,
  ...props
}: {
  id?: string;
  theme?: "dark" | "light";
  grain?: boolean;
  className?: string;
  children: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
} & Omit<React.ComponentPropsWithoutRef<"section">, "id" | "className" | "children">) {
  return (
    <section
      ref={ref}
      id={id}
      data-theme={theme}
      className={cn("relative py-20 sm:py-28 lg:py-36", grain && "grain", className)}
      {...props}
    >
      {children}
    </section>
  );
}
