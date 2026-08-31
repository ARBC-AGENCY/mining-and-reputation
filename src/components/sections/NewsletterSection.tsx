"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import CurvedInput from "@/components/CurvedInput";
import { INTERESTS, type Interest } from "@/lib/newsletter-schema";

type Status = "idle" | "sending" | "done" | "error";

/**
 * Segmented signup, per the architecture brief.
 *
 * CurvedInput renders its own <form>, so the interest checkboxes sit outside it
 * and their state is lifted here — nesting them would produce invalid HTML.
 * Submission comes through CurvedInput's onSubmit and posts both together.
 */
export function NewsletterSection() {
  const t = useTranslations("home.newsletter");
  const [selected, setSelected] = useState<Interest[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const toggle = (value: Interest) =>
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );

  async function submit(email: string) {
    if (status === "sending") return;
    setStatus("sending");
    setMessage(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, interests: selected }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("done");
        setMessage(t("success"));
        setSelected([]);
        return;
      }
      setStatus("error");
      // Server returns i18n keys, not prose, so errors localise too.
      const code = body?.fields?.email?.[0] as string | undefined;
      setMessage(
        code
          ? t(`errors.${code}` as "errors.email.invalid")
          : body?.error === "unavailable"
            ? t("errors.unavailable")
            : t("errors.generic"),
      );
    } catch {
      setStatus("error");
      setMessage(t("errors.generic"));
    }
  }

  return (
    <section className="bg-dark border-t border-white/5 py-20 md:py-28 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-start lg:gap-16 lg:px-8">
        <div className="max-w-xl">
          <h2 className="font-display text-[1.75rem] leading-[1.15] text-balance text-white sm:text-3xl md:text-4xl lg:text-5xl">
            {t("heading")}
          </h2>
          <p className="text-grey-light/70 mt-6 text-base leading-relaxed text-pretty md:text-lg">
            {t("text")}
          </p>
        </div>

        <div>
          <fieldset>
            <legend className="text-grey-light/60 text-xs font-medium tracking-[0.18em] uppercase">
              {t("interestsLabel")}
            </legend>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {INTERESTS.map((value) => {
                const on = selected.includes(value);
                return (
                  <label
                    key={value}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                      on
                        ? "border-[#F7C15D]/60 bg-[#F7C15D]/12 text-[#F7C15D]"
                        : "text-grey-light/70 border-white/12 bg-white/[0.03] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={on}
                      onChange={() => toggle(value)}
                    />
                    <span
                      aria-hidden="true"
                      className={`grid size-4 place-items-center rounded-[4px] border transition-colors ${
                        on
                          ? "border-[#F7C15D] bg-[#F7C15D]"
                          : "border-white/30"
                      }`}
                    >
                      {on && <Check className="size-3 text-[#05191A]" />}
                    </span>
                    {t(`interests.${value}` as "interests.reputation")}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-8">
            {/* A <span>, not a <label>: CurvedInput owns its own control and is
                labelled via ariaLabel, so a <label> here would point at nothing. */}
            <span className="text-grey-light/60 mb-3 block text-xs font-medium tracking-[0.18em] uppercase">
              {t("emailLabel")}
            </span>
            <CurvedInput
              width="100%"
              bend={0}
              height={62}
              cornerRadius={18}
              borderWidth={1.5}
              type="email"
              name="email"
              ariaLabel={t("emailLabel")}
              placeholder={t("emailPlaceholder")}
              buttonText={status === "sending" ? t("sending") : t("submit")}
              backgroundColor="#0A2325"
              textColor="#E6E6E6"
              placeholderColor="#8C9494"
              borderColor="#353F2C"
              buttonColor="#F7C15D"
              buttonTextColor="#05191A"
              shadowSize="sm"
              shadowColor="#05191A"
              onSubmit={submit}
            />
          </div>

          {message && (
            <p
              role="status"
              aria-live="polite"
              className={`mt-4 text-sm ${status === "done" ? "text-[#8EB467]" : "text-[#F7C15D]"}`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
