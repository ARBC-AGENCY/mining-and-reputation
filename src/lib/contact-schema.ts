import { z } from "zod";

/**
 * Shared by the API route and (later) the form component.
 *
 * Error messages are i18n KEYS, not prose — they resolve against the
 * "contact.errors" namespace in messages/*.json so validation failures are
 * localised like everything else.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "name.tooShort").max(100, "name.tooLong"),
  email: z.email("email.invalid").max(254, "email.tooLong"),
  organisation: z.string().trim().max(150, "organisation.tooLong").optional(),
  message: z
    .string()
    .trim()
    .min(20, "message.tooShort")
    .max(5000, "message.tooLong"),
  // Honeypot. Hidden from real users via CSS; bots fill every field they find.
  // Deliberately UNVALIDATED: a validation error here would name the field in
  // the 422 response and teach the bot to skip it. The route inspects it
  // instead and answers 200 without sending.
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactFieldErrors = Partial<
  Record<keyof ContactInput, string[]>
>;
