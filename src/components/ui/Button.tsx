import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "accent" | "ink" | "outline" | "whatsapp";

const styles: Record<Variant, string> = {
  accent:
    "btn-shine bg-accent text-accent-ink shadow-[0_8px_24px_-8px_var(--color-accent)] hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-8px_var(--color-accent)] active:translate-y-0 active:brightness-95",
  ink: "bg-ink text-surface hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0",
  outline:
    "border border-line text-ink hover:-translate-y-0.5 hover:border-ink/50 active:translate-y-0",
  whatsapp:
    "bg-[#25d366] text-[#062b16] hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0",
};

export function Button({
  href,
  variant = "accent",
  className,
  children,
  external,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-[filter,opacity,border-color,transform,box-shadow] duration-300 motion-reduce:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    styles[variant],
    className,
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
