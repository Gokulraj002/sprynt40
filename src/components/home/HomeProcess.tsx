import Image from "next/image";
import { Container } from "@/components/ui/Container";

const steps = [
  ["We Study Your Business", "A real audit of your market, competitors and customers before we suggest anything."],
  ["We Build Your Package", "We select the exact services that fit where your business is today."],
  ["We Deliver for 4 Months", "One flat price and a clear plan from Day 1 through Month 4."],
  ["We Report & Optimize", "Ongoing tracking and adjustment—not a one-and-done setup."],
] as const;

export function HomeProcess() {
  return (
    <section id="process" data-theme="dark" className="relative overflow-hidden bg-black py-16 text-white sm:py-20 lg:py-24">
      <Image
        src="/images/home1/sprynt40-growth-mountain-v1.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center opacity-80"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,.91)_42%,rgba(0,0,0,.28)_100%)]" />

      <Container className="relative z-10">
        <p className="text-xs font-semibold uppercase text-white/75 before:mr-2 before:text-accent before:content-['///']">
          How it works
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
          A Simple <span className="text-accent">4-Step</span> Process.
        </h2>
        <p className="mt-2 text-sm text-white/70 sm:text-base">
          No confusion. No long contracts. Just a clear plan to grow your business.
        </p>

        <div className="mt-12 grid gap-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map(([title, copy], index) => (
            <article key={title}>
              <div className="flex items-center">
                <strong className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-sm text-white">
                  {String(index + 1).padStart(2, "0")}
                </strong>
                {index < steps.length - 1 && (
                  <span className="ml-3 hidden flex-1 border-t border-dashed border-white/40 lg:block" />
                )}
              </div>
              <h3 className="mt-5 font-display text-base font-semibold">{title}</h3>
              <p className="mt-2 max-w-64 text-xs leading-5 text-white/65">{copy}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
