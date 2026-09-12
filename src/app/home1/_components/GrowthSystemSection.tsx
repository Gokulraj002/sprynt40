import Link from "next/link";
import styles from "../home1.module.css";
import { Arrow } from "./shared";

const stages = [
  ["01", "Attract", "SEO · Ads · Social"],
  ["02", "Convert", "Web · CRM · Automation"],
  ["03", "Retain", "Email · Loyalty · Reviews"],
  ["04", "Grow", "Data · Reporting · Optimization"],
] as const;

const principles = [
  ["Tailored around you", "No fixed tiers or unnecessary services."],
  ["One four-month scope", "Clear priorities, delivery and ownership."],
  ["One connected team", "Strategy, creative and technology together."],
] as const;

export function GrowthSystemSection() {
  return (
    <section id="growth-system" className="relative overflow-hidden bg-[#f6f3ee] py-20 sm:py-24 lg:py-28" data-theme="light">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-black/10" />
      <div className={styles.shell}>
        <div className="grid items-end gap-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase text-[#6a625a] before:mr-2 before:text-[#f97604] before:content-['///']">
              One connected system
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.03] text-black sm:text-5xl lg:text-6xl">
              Different capabilities. <span className="text-[#f97604]">One growth direction.</span>
            </h2>
          </div>
          <div className="lg:pb-1">
            <p className="max-w-xl text-base leading-7 text-black/60">
              Marketing, sales, automation and technology are planned as one operating system—so every action moves the same business goal forward.
            </p>
            <Link href="/about" className="mt-6 inline-flex items-center gap-3 rounded-full border border-black/20 bg-white px-5 py-3 text-sm font-semibold text-black shadow-sm transition hover:-translate-y-0.5 hover:border-[#f97604]">
              How our model works <Arrow />
            </Link>
          </div>
        </div>

        <div className="relative mt-12 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#080808] text-white shadow-[0_36px_90px_-48px_rgba(0,0,0,.7)] sm:mt-14">
          <div className="flex flex-col gap-3 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="text-xs font-bold uppercase text-[#f97604]">Sprynt40 growth architecture</p>
              <p className="mt-1 text-sm text-white/55">One system from first attention to measurable revenue.</p>
            </div>
            <span className="w-fit rounded-full border border-[#f97604]/35 bg-[#f97604]/10 px-4 py-2 text-xs font-semibold text-[#ff9b43]">
              Strategy → Execution → Growth
            </span>
          </div>

          <div className="relative grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {stages.map(([number, title, detail], index) => (
              <article key={title} className="group relative bg-[#0b0b0b] px-6 py-8 sm:px-7 lg:min-h-56 lg:py-9">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-full border border-[#f97604]/40 bg-[#f97604]/10 text-xs font-bold text-[#ff9b43]">{number}</span>
                  {index < stages.length - 1 && <span aria-hidden="true" className="text-lg text-white/25">→</span>}
                </div>
                <h3 className="mt-9 font-display text-2xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/50">{detail}</p>
                <div className="mt-6 h-0.5 w-10 bg-[#f97604] transition-all duration-300 group-hover:w-20" />
              </article>
            ))}
          </div>

          <div className="grid gap-px border-t border-white/10 bg-white/10 lg:grid-cols-3">
            {principles.map(([title, detail]) => (
              <div key={title} className="bg-[#111] px-6 py-5 sm:px-8">
                <p className="font-display text-base font-semibold text-white">{title}</p>
                <p className="mt-1 text-xs leading-5 text-white/45">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
