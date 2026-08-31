import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { EXPERTISE_AREAS } from "@/lib/expertise";
import { alternatesFor } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("contact.title"),
    description: t("contact.description"),
    alternates: alternatesFor(locale, "/contact"),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");
  const te = await getTranslations("expertise");

  return (
    <div className="bg-dark pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Left: the pitch and what happens next, so the form isn't a
              context-free set of boxes. */}
          <div>
            <h1 className="font-display text-[1.9rem] leading-[1.1] text-balance text-white sm:text-4xl md:text-5xl">
              {t("heading")}
            </h1>
            <p className="text-grey-light/75 mt-7 max-w-xl text-base leading-relaxed text-pretty md:text-lg">
              {t("intro")}
            </p>

            <div className="mt-12">
              <h2 className="text-grey-light/60 text-xs font-medium tracking-[0.18em] uppercase">
                {t("expectLabel")}
              </h2>
              <ul className="mt-5 space-y-3">
                {(["reply", "confidential", "noObligation"] as const).map(
                  (key) => (
                    <li
                      key={key}
                      className="text-grey-light/70 flex items-start gap-3 text-sm leading-relaxed md:text-base"
                    >
                      <span
                        aria-hidden="true"
                        className="bg-gold mt-2 size-1.5 shrink-0 rounded-full"
                      />
                      {t(`expect.${key}` as "expect.reply")}
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="mt-12">
              <h2 className="text-grey-light/60 text-xs font-medium tracking-[0.18em] uppercase">
                {t("topicsLabel")}
              </h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {EXPERTISE_AREAS.map(({ key, slug }) => (
                  <li key={key}>
                    <Link
                      href={`/expertise/${slug}`}
                      className="text-grey-light/70 hover:border-gold/50 inline-flex rounded-full border border-white/12 bg-white/3 px-3.5 py-1.5 text-xs transition-colors hover:text-white"
                    >
                      {te(`areas.${key}.title` as "areas.crisis.title")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: the form itself */}
          <Reveal>
            <div className="rounded-[18px] border border-white/10 bg-white/3 p-6 md:p-10">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
