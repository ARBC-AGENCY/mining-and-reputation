import { z } from "zod";

/** Matches the segmented newsletter structure in the architecture brief. */
export const INTERESTS = [
  "reputation",
  "esg",
  "communities",
  "markets",
  "media",
] as const;

export type Interest = (typeof INTERESTS)[number];

export const newsletterSchema = z.object({
  email: z.email("email.invalid").max(254, "email.tooLong"),
  interests: z.array(z.enum(INTERESTS)).default([]),
  // Honeypot — deliberately unvalidated so a failure never names the field.
  website: z.string().optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
