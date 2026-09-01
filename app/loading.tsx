import { site } from "@/lib/data/site";

/** Route-level loading state. CSS-only — no client JS needed for a spinner this simple. */
export default function Loading() {
  return (
    <div
      data-theme="light"
      className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-[linear-gradient(135deg,#f5f3ff_0%,#ecfeff_55%,#fff7ed_100%)]"
    >
      <p className="animate-pulse font-display text-title font-medium text-ink motion-reduce:animate-none">
        {site.wordmark}
      </p>
      <div className="signal-track relative h-px w-[120px] overflow-hidden rounded-full bg-line">
        <span className="signal-sweep absolute inset-y-0 left-0 w-1/3 bg-accent" />
      </div>
      <style>{`
        .signal-sweep {
          animation: signal-sweep 1.4s ease-in-out infinite;
        }
        @keyframes signal-sweep {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(360%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .signal-sweep {
            animation: none;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
