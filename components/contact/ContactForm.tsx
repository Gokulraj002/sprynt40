"use client";

/**
 * Multi-step lead-qualification form (see
 * .claude/skills/agency-sections/references/13-contact-forms.md §1–4, §9).
 *
 * Step order runs lowest-friction → highest-friction: what do you need →
 * budget → contact info. Chips are real buttons (aria-pressed, native
 * keyboard support) so the whole flow works without a mouse. Submission
 * goes through the submitContact Server Action via useActionState.
 */
import { useActionState, useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { Button } from "@/components/ui/Button";
import { allServices } from "@/lib/data/services";
import { hasWhatsApp, waLink } from "@/lib/data/site";
import { cn } from "@/lib/cn";
import { DUR, EASE_OUT } from "@/lib/motion";
import { initialContactFormState, submitContact } from "@/app/actions/contact";

const TOTAL_STEPS = 3;

const NOT_SURE = "Not sure yet";

const serviceOptions = [...allServices.map((service) => service.name), NOT_SURE];

const budgetOptions = ["Under ₹1L", "₹1-3L", "₹3-10L", "₹10L+", NOT_SURE];

type ContactValues = {
  service: string;
  budget: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

const emptyValues: ContactValues = {
  service: "",
  budget: "",
  name: "",
  email: "",
  phone: "",
  message: "",
};

function ChipGrid({
  options,
  value,
  onChange,
  name,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  name: string;
}) {
  return (
    <div role="group" aria-label={name} className="flex min-w-0 flex-wrap gap-2.5">
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className={cn(
              "min-h-11 max-w-full whitespace-normal rounded-full border px-4 py-2.5 text-center text-sm font-medium tracking-tight transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              selected
                ? "border-accent bg-accent text-accent-ink"
                : "border-line bg-surface text-ink hover:border-ink/40",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} className="mt-1.5 min-h-[1.1rem] text-xs text-accent" aria-live="polite">
      {message ?? ""}
    </p>
  );
}

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE_OUT } },
  exit: { opacity: 0, y: -16, transition: { duration: DUR.fast, ease: EASE_OUT } },
};

const stepVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR.fast, ease: "linear" } },
  exit: { opacity: 0, transition: { duration: DUR.fast, ease: "linear" } },
};

export function ContactForm() {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<ContactValues>(emptyValues);
  const [state, formAction, pending] = useActionState(submitContact, initialContactFormState);
  // Rendered once at mount into a hidden field; the action compares it
  // against submit time to reject bot-fast submissions (see §6 of the ref).
  const [startedAt] = useState(() => Date.now());
  const shouldReduceMotion = useReducedMotion();
  const idBase = useId();

  const set = <K extends keyof ContactValues>(key: K) => (v: ContactValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const canAdvanceFrom = (currentStep: number) => {
    if (currentStep === 1) return values.service.length > 0;
    if (currentStep === 2) return values.budget.length > 0;
    return true;
  };

  const goNext = () => setStep((current) => Math.min(TOTAL_STEPS, current + 1));
  const goBack = () => setStep((current) => Math.max(1, current - 1));

  if (state.ok) {
    return (
      <div className="w-full max-w-[calc(100vw-2.5rem)] min-w-0 overflow-hidden rounded-[1.5rem] border border-orange-100 bg-white p-6 shadow-[0_24px_70px_-45px_rgba(124,45,18,0.42)] sm:max-w-none sm:p-8">
        <p className="font-display text-title font-medium text-balance">
          {state.message ?? "Got it — we'll reply within one working day."}
        </p>
        {hasWhatsApp && (
          <>
            <p className="mt-3 text-ink-muted">
              Want a faster answer? Jump straight into WhatsApp - a real person will pick it up.
            </p>
            <Button
              href={waLink("Hi! I just filled out the contact form on the site.")}
              external
              variant="whatsapp"
              className="mt-6"
            >
              Continue on WhatsApp
            </Button>
          </>
        )}
      </div>
    );
  }

  const variants = shouldReduceMotion ? stepVariantsReduced : stepVariants;

  return (
    <form
      action={formAction}
      className="w-full max-w-[calc(100vw-2.5rem)] min-w-0 overflow-hidden rounded-[1.5rem] border border-orange-100 bg-white p-6 shadow-[0_24px_70px_-45px_rgba(124,45,18,0.42)] sm:max-w-none sm:p-8"
    >
      {/* Honeypot — real inputs are visually hidden bots may still skip
          display:none, so this uses off-screen positioning instead. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden opacity-0"
      >
        <label htmlFor={`${idBase}-website`}>Company website</label>
        <input
          id={`${idBase}-website`}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />
      <input type="hidden" name="service" value={values.service} />
      <input type="hidden" name="budget" value={values.budget} />

      <div className="mb-8 flex items-center justify-between gap-4">
        <p className="text-label font-sans uppercase text-ink-muted">
          Step {step} of {TOTAL_STEPS}
        </p>
        <div className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1 w-8 rounded-full transition-colors duration-300",
                i < step ? "bg-accent" : "bg-line",
              )}
            />
          ))}
        </div>
      </div>

      {state.message && !state.ok && (
        <p role="alert" className="mb-6 text-sm text-accent">
          {state.message}
        </p>
      )}

      <div className="relative min-h-[220px]">
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 && (
            <motion.div
              key="step-1"
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 className="break-words font-display text-title font-medium text-balance">
                What do you need help with?
              </h2>
              <p className="mt-2 text-sm text-ink-muted">Pick the closest match — we&apos;ll dig into specifics on the call.</p>
              <div className="mt-6">
                <ChipGrid
                  name="What do you need help with"
                  options={serviceOptions}
                  value={values.service}
                  onChange={set("service")}
                />
              </div>
              <FieldError id={`${idBase}-service-error`} message={state.errors?.service} />
              <StepNav>
                <span />
                <NextButton disabled={!canAdvanceFrom(1)} onClick={goNext} />
              </StepNav>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 className="break-words font-display text-title font-medium text-balance">
                Project budget range?
              </h2>
              <p className="mt-2 text-sm text-ink-muted">Roughly is fine — this just shapes the plan we bring to the call.</p>
              <div className="mt-6">
                <ChipGrid
                  name="Project budget range"
                  options={budgetOptions}
                  value={values.budget}
                  onChange={set("budget")}
                />
              </div>
              <FieldError id={`${idBase}-budget-error`} message={state.errors?.budget} />
              <StepNav>
                <BackButton onClick={goBack} />
                <NextButton disabled={!canAdvanceFrom(2)} onClick={goNext} />
              </StepNav>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 className="break-words font-display text-title font-medium text-balance">
                Where should we send it?
              </h2>
              <p className="mt-2 text-sm text-ink-muted">Name plus one way to reach you — email or WhatsApp/phone.</p>

              <div className="mt-6 flex flex-col gap-5">
                <div>
                  <label htmlFor={`${idBase}-name`} className="text-sm font-medium text-ink">
                    Name
                  </label>
                  <input
                    id={`${idBase}-name`}
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={values.name}
                    onChange={(e) => set("name")(e.target.value)}
                    aria-describedby={`${idBase}-name-error`}
                    aria-invalid={Boolean(state.errors?.name)}
                    className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none transition-colors focus-visible:border-accent"
                  />
                  <FieldError id={`${idBase}-name-error`} message={state.errors?.name} />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`${idBase}-email`} className="text-sm font-medium text-ink">
                      Email
                    </label>
                    <input
                      id={`${idBase}-email`}
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={(e) => set("email")(e.target.value)}
                      aria-describedby={`${idBase}-email-error`}
                      aria-invalid={Boolean(state.errors?.email)}
                      className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none transition-colors focus-visible:border-accent"
                    />
                    <FieldError id={`${idBase}-email-error`} message={state.errors?.email} />
                  </div>

                  <div>
                    <label htmlFor={`${idBase}-phone`} className="text-sm font-medium text-ink">
                      Phone / WhatsApp
                    </label>
                    <input
                      id={`${idBase}-phone`}
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={values.phone}
                      onChange={(e) => set("phone")(e.target.value)}
                      aria-describedby={`${idBase}-phone-error`}
                      aria-invalid={Boolean(state.errors?.phone)}
                      className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none transition-colors focus-visible:border-accent"
                    />
                    <FieldError id={`${idBase}-phone-error`} message={state.errors?.phone} />
                  </div>
                </div>

                <div>
                  <label htmlFor={`${idBase}-message`} className="text-sm font-medium text-ink">
                    Message <span className="text-ink-muted">(optional)</span>
                  </label>
                  <textarea
                    id={`${idBase}-message`}
                    name="message"
                    rows={3}
                    value={values.message}
                    onChange={(e) => set("message")(e.target.value)}
                    className="mt-2 w-full resize-none rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none transition-colors focus-visible:border-accent"
                  />
                </div>
              </div>

              <StepNav>
                <BackButton onClick={goBack} />
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium tracking-tight text-accent-ink transition-[filter,opacity] duration-300 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
                >
                  {pending ? "Sending…" : "Send it"}
                </button>
              </StepNav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

function StepNav({ children }: { children: ReactNode }) {
  return <div className="mt-8 flex items-center justify-between gap-4">{children}</div>;
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-ink/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      Back
    </button>
  );
}

function NextButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium tracking-tight text-accent-ink transition-[filter,opacity] duration-300 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40"
    >
      Continue
    </button>
  );
}
