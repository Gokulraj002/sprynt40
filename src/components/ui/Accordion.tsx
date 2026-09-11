"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/cn";

/**
 * Thin Radix Accordion wrapper (the shadcn/ui pattern) — full keyboard
 * roving-tabindex, aria-expanded/controls, and a native [data-state] driven
 * open/close animation done in pure CSS (grid-rows trick), so it costs
 * nothing under prefers-reduced-motion and needs no JS height measurement.
 */
export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-t border-line last:border-b", className)}
      {...props}
    />
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="m-0">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex w-full items-center justify-between gap-6 py-6 text-left outline-none transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4",
          className,
        )}
        {...props}
      >
        <span className="font-display text-xl font-medium text-balance md:text-2xl">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="relative size-6 shrink-0 text-ink-muted transition-transform duration-300 ease-out group-data-[state=open]:rotate-45"
        >
          <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
          <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={cn(
        "grid overflow-hidden text-ink-muted transition-[grid-template-rows] duration-300 ease-out",
        "grid-rows-[0fr] data-[state=open]:grid-rows-[1fr] motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <div className="min-h-0">
        <p className="max-w-2xl pb-6">{children}</p>
      </div>
    </AccordionPrimitive.Content>
  );
}
