"use server";

/**
 * Server Action backing the /contact form.
 *
 * Spam stack: honeypot field + submit-time-trap, layered with server-side
 * Zod validation. Bots get a generic success response so a failed honeypot
 * or timing check never tips them off to what was checked.
 */
import { z } from "zod";

/** Minimum time (ms) a human plausibly needs to fill the form. */
const MIN_FILL_TIME_MS = 2500;

const contactFields = [
  "name",
  "email",
  "phone",
  "company",
  "service",
  "budget",
  "message",
  "consent",
] as const;

type ContactField = (typeof contactFields)[number];

const contactSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name."),
    email: z
      .string()
      .trim()
      .email("Enter a valid business email.")
      .optional()
      .or(z.literal("")),
    phone: z
      .string()
      .trim()
      .min(7, "Enter a valid phone number.")
      .optional()
      .or(z.literal("")),
    company: z.string().trim().optional(),
    service: z.string().min(1, "Choose the service you're interested in."),
    budget: z.string().min(1, "Choose an approximate budget range."),
    message: z.string().trim().min(10, "Tell us a little about your project (10+ characters)."),
    consent: z.literal("on", {
      message: "Please agree to the privacy policy to continue.",
    }),
  })
  .refine((data) => Boolean(data.email) || Boolean(data.phone), {
    message: "Add an email or phone number so we can reach you.",
    path: ["email"],
  });

export type ContactFormState = {
  ok: boolean;
  /** User-facing summary message — success copy or a generic error nudge. */
  message?: string;
  errors?: Partial<Record<ContactField, string>>;
};

export const initialContactFormState: ContactFormState = { ok: false };

const SUCCESS_MESSAGE = "Thanks — we've received your enquiry and will reply within one working day.";

export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const honeypot = formData.get("website");
  const startedAtRaw = formData.get("startedAt");
  const startedAt = typeof startedAtRaw === "string" ? Number(startedAtRaw) : NaN;

  const honeypotFilled = typeof honeypot === "string" && honeypot.trim().length > 0;
  const submittedTooFast =
    !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_TIME_MS;

  if (honeypotFilled || submittedTooFast) {
    return { ok: true, message: SUCCESS_MESSAGE };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    service: formData.get("service"),
    budget: formData.get("budget"),
    message: formData.get("message"),
    consent: formData.get("consent"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const errors: ContactFormState["errors"] = {};
    for (const field of contactFields) {
      const fieldMessage = fieldErrors[field]?.[0];
      if (fieldMessage) errors[field] = fieldMessage;
    }
    return {
      ok: false,
      errors,
      message: "Please check the highlighted fields and try again.",
    };
  }

  // TODO: wire to Resend/CRM before launch — currently just logs the lead.
  console.log("[contact] new lead", {
    ...parsed.data,
    receivedAt: new Date().toISOString(),
  });

  return { ok: true, message: SUCCESS_MESSAGE };
}
