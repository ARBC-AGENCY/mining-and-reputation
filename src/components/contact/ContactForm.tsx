"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ContactFieldErrors } from "@/lib/contact-schema";

type Status = "idle" | "sending" | "done" | "error";

const FIELD =
  "w-full rounded-[14px] border border-white/12 bg-white/3 px-4 py-3 text-sm text-white " +
  "placeholder:text-grey-light/35 transition-colors focus:border-gold/60 focus:outline-none md:text-base";

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setStatus("sending");
    setErrors({});
    setMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("done");
        setMessage(t("success"));
        form.reset();
        return;
      }

      setStatus("error");
      if (body?.error === "validation") {
        // The server returns i18n keys, so field errors localise too.
        setErrors(body.fields ?? {});
        setMessage(null);
      } else {
        setMessage(
          body?.error === "unavailable"
            ? t("errors.unavailable")
            : t("errors.generic"),
        );
      }
    } catch {
      setStatus("error");
      setMessage(t("errors.generic"));
    }
  }

  const fieldError = (name: keyof ContactFieldErrors) => {
    const code = errors[name]?.[0];
    return code ? t(`errors.${code}` as "errors.name.tooShort") : null;
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {(["name", "email", "organisation"] as const).map((name) => {
        const err = fieldError(name);
        return (
          <div key={name}>
            <label
              htmlFor={`contact-${name}`}
              className="text-grey-light/60 mb-2 block text-xs font-medium tracking-[0.18em] uppercase"
            >
              {t(`fields.${name}` as "fields.name")}
            </label>
            <input
              id={`contact-${name}`}
              name={name}
              type={name === "email" ? "email" : "text"}
              autoComplete={
                name === "email"
                  ? "email"
                  : name === "name"
                    ? "name"
                    : "organization"
              }
              aria-invalid={err ? true : undefined}
              aria-describedby={err ? `contact-${name}-error` : undefined}
              className={FIELD}
            />
            {err && (
              <p id={`contact-${name}-error`} className="text-gold mt-2 text-sm">
                {err}
              </p>
            )}
          </div>
        );
      })}

      <div>
        <label
          htmlFor="contact-message"
          className="text-grey-light/60 mb-2 block text-xs font-medium tracking-[0.18em] uppercase"
        >
          {t("fields.message")}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          aria-invalid={fieldError("message") ? true : undefined}
          aria-describedby={
            fieldError("message") ? "contact-message-error" : undefined
          }
          className={`${FIELD} resize-y`}
        />
        {fieldError("message") && (
          <p id="contact-message-error" className="text-gold mt-2 text-sm">
            {fieldError("message")}
          </p>
        )}
      </div>

      {/* Honeypot: hidden from people, filled by bots. Never validated, so a
          failure can't name the field. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="border-gold/40 text-gold hover:border-gold hover:bg-gold/10 mt-2 inline-flex cursor-pointer items-center gap-2 rounded-[18px] border px-7 py-3.5 text-sm font-medium transition-colors hover:text-white disabled:cursor-default disabled:opacity-60"
      >
        {status === "sending" ? t("sending") : t("submit")}
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${status === "done" ? "text-green" : "text-gold"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
