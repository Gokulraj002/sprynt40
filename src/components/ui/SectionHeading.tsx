import { cn } from "@/lib/cn";

/**
 * Editorial section intro: small tracked label + display serif title.
 * Put the emphasised word inside <Em> for the italic accent treatment.
 */
export function SectionHeading({
  label,
  title,
  lead,
  className,
  align = "left",
}: {
  label: string;
  title: React.ReactNode;
  lead?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p className="text-label font-sans uppercase text-ink-muted">{label}</p>
      <h2 className="mt-4 font-display text-display font-medium text-balance">{title}</h2>
      {lead && <p className="mt-5 text-lead text-ink-muted">{lead}</p>}
    </div>
  );
}

export function Em({ children }: { children: React.ReactNode }) {
  return <em className="italic text-accent">{children}</em>;
}
