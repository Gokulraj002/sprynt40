"use client";

/**
 * Professional single-page contact form.
 * All fields visible with labels; dropdowns for service/budget; consent
 * checkbox for privacy policy. Submits through the submitContact Server
 * Action via useActionState.
 */
import Link from "next/link";
import { useActionState, useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { allServices } from "@/lib/data/services";
import { hasWhatsApp, waLink } from "@/lib/data/site";
import { cn } from "@/lib/cn";
import { initialContactFormState, submitContact } from "@/lib/actions/contact";

const NOT_SURE = "Not sure yet";

const serviceOptions = [...allServices.map((service) => service.name), NOT_SURE];

const budgetOptions = [
  "Under ₹1,00,000",
  "₹1,00,000 – ₹3,00,000",
  "₹3,00,000 – ₹10,00,000",
  "₹10,00,000+",
  NOT_SURE,
];

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} className="mt-1.5 min-h-[1.1rem] text-xs text-accent" aria-live="polite">
      {message ?? ""}
    </p>
  );
}

const inputClass =
  "mt-2 w-full rounded-lg border border-line bg-surface px-4 py-3 text-ink outline-none transition-colors focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30";

const labelClass = "text-sm font-medium text-ink";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialContactFormState);
  const [startedAt] = useState(() => Date.now());
  const idBase = useId();

  if (state.ok) {
    return (
      <div className="w-full max-w-[calc(100vw-2.5rem)] min-w-0 overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.35)] sm:max-w-none sm:p-8">
        <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-accent text-accent-ink">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-6" aria-hidden>
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <p className="font-display text-title font-semibold text-balance">
          {state.message ?? "Thanks — we've received your enquiry."}
        </p>
        <p className="mt-3 text-ink-muted">
          A member of our growth team will review your brief and reply within one working day.
        </p>
        {hasWhatsApp && (
          <Button
            href={waLink("Hi! I just filled out the contact form on the site.")}
            external
            variant="whatsapp"
            className="mt-6"
          >
            Continue on WhatsApp
          </Button>
        )}
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="w-full max-w-[calc(100vw-2.5rem)] min-w-0 overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.28)] sm:max-w-none sm:p-8"
      noValidate
    >
      {/* Honeypot — off-screen, real bots may still ignore aria-hidden. */}
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

      <div className="mb-6">
        <h2 className="font-display text-title font-semibold text-balance">
          Send us your brief
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Fill in the details below. Fields marked <span className="text-accent">*</span> are required.
        </p>
      </div>

      {state.message && !state.ok && (
        <p
          role="alert"
          className="mb-6 rounded-lg border border-accent/40 bg-accent/5 px-4 py-3 text-sm text-accent"
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-6">
        {/* Name + Email */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor={`${idBase}-name`} className={labelClass}>
              Full name <span className="text-accent">*</span>
            </label>
            <input
              id={`${idBase}-name`}
              name="name"
              type="text"
              autoComplete="name"
              required
              aria-describedby={`${idBase}-name-error`}
              aria-invalid={Boolean(state.errors?.name)}
              className={inputClass}
              placeholder="Jane Doe"
            />
            <FieldError id={`${idBase}-name-error`} message={state.errors?.name} />
          </div>

          <div>
            <label htmlFor={`${idBase}-email`} className={labelClass}>
              Business email <span className="text-accent">*</span>
            </label>
            <input
              id={`${idBase}-email`}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              aria-describedby={`${idBase}-email-error`}
              aria-invalid={Boolean(state.errors?.email)}
              className={inputClass}
              placeholder="jane@company.com"
            />
            <FieldError id={`${idBase}-email-error`} message={state.errors?.email} />
          </div>
        </div>

        {/* Phone + Company */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor={`${idBase}-phone`} className={labelClass}>
              Phone / WhatsApp
            </label>
            <input
              id={`${idBase}-phone`}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              aria-describedby={`${idBase}-phone-error`}
              aria-invalid={Boolean(state.errors?.phone)}
              className={inputClass}
              placeholder="+91 98765 43210"
            />
            <FieldError id={`${idBase}-phone-error`} message={state.errors?.phone} />
          </div>

          <div>
            <label htmlFor={`${idBase}-company`} className={labelClass}>
              Company / Brand
            </label>
            <input
              id={`${idBase}-company`}
              name="company"
              type="text"
              autoComplete="organization"
              aria-describedby={`${idBase}-company-error`}
              className={inputClass}
              placeholder="Sprynt40 Pvt. Ltd."
            />
            <FieldError id={`${idBase}-company-error`} message={state.errors?.company} />
          </div>
        </div>

        {/* Service + Budget */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor={`${idBase}-service`} className={labelClass}>
              Service interest <span className="text-accent">*</span>
            </label>
            <select
              id={`${idBase}-service`}
              name="service"
              required
              defaultValue=""
              aria-describedby={`${idBase}-service-error`}
              aria-invalid={Boolean(state.errors?.service)}
              className={cn(inputClass, "appearance-none pr-10 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22currentColor%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.06l3.71-3.83a.75.75%200%20111.08%201.04l-4.25%204.39a.75.75%200%2001-1.08%200L5.21%208.27a.75.75%200%20010-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat")}
            >
              <option value="" disabled>
                Choose a service
              </option>
              {serviceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <FieldError id={`${idBase}-service-error`} message={state.errors?.service} />
          </div>

          <div>
            <label htmlFor={`${idBase}-budget`} className={labelClass}>
              Estimated budget <span className="text-accent">*</span>
            </label>
            <select
              id={`${idBase}-budget`}
              name="budget"
              required
              defaultValue=""
              aria-describedby={`${idBase}-budget-error`}
              aria-invalid={Boolean(state.errors?.budget)}
              className={cn(inputClass, "appearance-none pr-10 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22currentColor%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.06l3.71-3.83a.75.75%200%20111.08%201.04l-4.25%204.39a.75.75%200%2001-1.08%200L5.21%208.27a.75.75%200%20010-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat")}
            >
              <option value="" disabled>
                Choose a range
              </option>
              {budgetOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <FieldError id={`${idBase}-budget-error`} message={state.errors?.budget} />
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor={`${idBase}-message`} className={labelClass}>
            Tell us about your project <span className="text-accent">*</span>
          </label>
          <textarea
            id={`${idBase}-message`}
            name="message"
            rows={5}
            required
            aria-describedby={`${idBase}-message-error`}
            aria-invalid={Boolean(state.errors?.message)}
            className={cn(inputClass, "resize-y")}
            placeholder="What are you trying to achieve in the next 4 months? Include your website, current traction, and where things are getting stuck."
          />
          <FieldError id={`${idBase}-message-error`} message={state.errors?.message} />
        </div>

        {/* Consent */}
        <div>
          <label className="flex items-start gap-3 text-sm text-ink-muted">
            <input
              type="checkbox"
              name="consent"
              required
              aria-describedby={`${idBase}-consent-error`}
              aria-invalid={Boolean(state.errors?.consent)}
              className="mt-0.5 size-4 accent-accent"
            />
            <span>
              I agree to Sprynt40&apos;s{" "}
              <Link
                href="/privacy"
                className="text-ink underline underline-offset-2 hover:text-accent"
              >
                Privacy Policy
              </Link>{" "}
              and consent to being contacted about my enquiry.{" "}
              <span className="text-accent">*</span>
            </span>
          </label>
          <FieldError id={`${idBase}-consent-error`} message={state.errors?.consent} />
        </div>

        {/* Submit */}
        <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold tracking-tight text-accent-ink transition-[filter,opacity] duration-300 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
          >
            {pending ? (
              <>
                <svg
                  className="size-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
                Sending…
              </>
            ) : (
              "Send enquiry"
            )}
          </button>
          <p className="text-xs text-ink-muted">
            We&apos;ll respond within one working day. Your details are never shared.
          </p>
        </div>
      </div>
    </form>
  );
}
