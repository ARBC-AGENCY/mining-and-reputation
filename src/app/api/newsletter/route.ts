import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { newsletterSchema } from "@/lib/newsletter-schema";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalidJson" }, { status: 400 });
  }

  const result = newsletterSchema.safeParse(payload);
  if (!result.success) {
    return NextResponse.json(
      { error: "validation", fields: z.flattenError(result.error).fieldErrors },
      { status: 422 },
    );
  }

  const { email, interests, website } = result.data;

  // Honeypot tripped: answer 200 so the bot believes it worked, send nothing.
  if (website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !to || !from) {
    console.error("[newsletter] Missing RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL");
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  try {
    const resend = new Resend(apiKey);

    // Resend audiences have no custom fields, so interests can't be stored
    // there. The subscriber is added for sending, and the team is notified with
    // the interest selection so segmentation isn't lost before a proper ESP.
    if (audienceId) {
      try {
        await resend.contacts.create({ email, audienceId, unsubscribed: false });
      } catch (cause) {
        console.error("[newsletter] Audience add failed (continuing):", cause);
      }
    }

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Newsletter signup: ${email}`,
      html: [
        `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
        `<p><strong>Areas of interest:</strong> ${
          interests.length ? interests.map(escapeHtml).join(", ") : "—"
        }</p>`,
        audienceId ? "" : `<p><em>No RESEND_AUDIENCE_ID set — not added to an audience.</em></p>`,
      ].join(""),
    });

    if (error) {
      console.error("[newsletter] Resend rejected the send:", error);
      return NextResponse.json({ error: "sendFailed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (cause) {
    console.error("[newsletter] Unexpected failure:", cause);
    return NextResponse.json({ error: "sendFailed" }, { status: 502 });
  }
}
