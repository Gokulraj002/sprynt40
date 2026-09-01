"use server";

/**
 * Server Action backing the /contact multi-step form (see
 * .claude/skills/agency-sections/references/13-contact-forms.md §5/§6).
 *
 * Spam stack: honeypot field + submit-time-trap, layered with server-side
 * Zod validation. Bots get a generic success response so a failed honeypot
 * or timing check never tips them off to what was checked.
 */
import { z } from "zod";

/** Minimum time (ms) a human plausibly needs to fill the form. */
const MIN_FILL_TIME_MS = 2500;

const contactFields = [
  "service",
  "budget",
  "name",
  "email",
  "phone",
  "message",
] as const;

type ContactField = (typeof contactFields)[number];

const contactSchema = z
  .object({
    service: z.string().min(1, "Choose what you need help with."),
    budget: z.string().min(1, "Choose a project budget range."),
    name: z.string().trim().min(2, "Enter your name."),
    email: z
      .string()
      .trim()
      .email("Enter a valid email like name@company.com.")
      .optional()
      .or(z.literal("")),
    phone: z.string().trim().min(7, "Enter a valid phone number.").optional().or(z.literal("")),
    message: z.string().trim().optional(),
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

const SUCCESS_MESSAGE = "Got it — we'll reply within one working day.";

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

  // Bot signals: never reveal which check failed — fake a normal success.
  if (honeypotFilled || submittedTooFast) {
    return { ok: true, message: SUCCESS_MESSAGE };
  }

  const parsed = contactSchema.safeParse({
    service: formData.get("service"),
    budget: formData.get("budget"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
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
      message: "Check the highlighted fields and try again.",
    };
  }

  // TODO: wire to Resend/CRM before launch — currently just logs the lead.
  console.log("[contact] new lead", {
    ...parsed.data,
    receivedAt: new Date().toISOString(),
  });

  return { ok: true, message: SUCCESS_MESSAGE };
}
