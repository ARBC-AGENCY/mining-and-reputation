import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { contactSchema } from "@/lib/contact-schema";

/** Escapes untrusted input before it goes into the HTML email body. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  // 1. Parse the body defensively — a malformed payload is a 400, not a crash.
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalidJson" }, { status: 400 });
  }

  // 2. Validate.
  const result = contactSchema.safeParse(payload);
  if (!result.success) {
    return NextResponse.json(
      { error: "validation", fields: z.flattenError(result.error).fieldErrors },
      { status: 422 },
    );
  }

  const { name, email, organisation, message, website } = result.data;

  // 3. Honeypot tripped — answer 200 so the bot believes it succeeded, and
  //    send nothing. Never reveal that the field is a trap.
  if (website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // 4. Config is read lazily. Reading it at module scope would throw during
  //    `next build`, which never has these set.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error(
      "[contact] Missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL",
    );
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  // 5. Send.
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Enquiry from ${name}${organisation ? ` (${organisation})` : ""}`,
      html: [
        `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
        `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
        organisation
          ? `<p><strong>Organisation:</strong> ${escapeHtml(organisation)}</p>`
          : "",
        `<hr />`,
        `<p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>`,
      ].join(""),
    });

    if (error) {
      console.error("[contact] Resend rejected the send:", error);
      return NextResponse.json({ error: "sendFailed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (cause) {
    // Log the detail, return a generic code — never leak internals to callers.
    console.error("[contact] Unexpected failure:", cause);
    return NextResponse.json({ error: "sendFailed" }, { status: 502 });
  }
}
