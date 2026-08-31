import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArbcLink } from "@/components/ArbcLink";
import { Reveal } from "@/components/motion/Reveal";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";

const PILLARS = ["understand", "position", "engage"] as const;
const DIFFERENCE = ["mining", "reputation", "stakeholder", "content"] as const;

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("about.title"),
    description: t("about.description"),
    alternates: alternatesFor(locale, "/about"),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");

  return (
    <>
      {/* 1. Hero: image-led, echoing the homepage opening. The rest of the page
             is typographic so the sections do not all read alike. */}
      <section className="relative">
        <div className="absolute inset-0">
          <Image
            src="/images/Background-2@2560.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,#05191A_6%,rgba(5,25,26,0.55)_45%,rgba(5,25,26,0.68)_100%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pt-[60%] pb-20 md:pt-82 md:pb-28 lg:px-8">
          <h1 className="font-display max-w-4xl text-2xl leading-[1.1] text-balance text-white sm:text-4xl ">
            {t("hero.heading")}
          </h1>
          <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-10 lg:mt-14">
            <p className="text-grey-light/80 text-base  text-pretty md:text-lg">
              {t("hero.p1")}
            </p>
            <p className="text-grey-light/80 text-base  text-pretty md:text-lg">
              {t("hero.p2")}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Mission: one centred statement, the quietest block on the page so it
             reads as a declaration rather than another card grid. */}
      <section className="bg-dark border-t border-white/5 py-20 md:py-28 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <Reveal>
            <p className="text-xs font-medium tracking-[0.25em] text-[#F7C15D] uppercase">
              {t("mission.label")}
            </p>
            <h2 className="font-display mt-6 text-2xl leading-[1.15] text-balance text-white md:text-4xl ">
              {t("mission.heading")}
            </h2>
            <p className="text-grey-light/70 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pretty md:text-lg">
              {t("mission.text")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3. Approach: a sequence, not a set. Numbered and joined by a rule so the
             three pillars read as steps. */}
      <section className="bg-dark border-t border-white/5 py-20 md:py-28 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <p className="text-xs font-medium tracking-[0.25em] text-[#F7C15D] uppercase">
              {t("approach.label")}
            </p>
            <h2 className="font-display mt-5 text-2xl leading-[1.15] text-balance text-white sm:text-4xl ">
              {t("approach.heading")}
            </h2>
          </Reveal>

          <ol className="mt-14 grid list-none gap-10 md:mt-20 md:grid-cols-3 md:gap-8">
            {PILLARS.map((key, i) => (
              <Reveal key={key} delay={i * 0.1} className="h-full">
                <li className="relative h-full">
                  {/* Connector sits between items, so never after the last. */}
                  {i < PILLARS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute top-5 left-16 hidden h-px w-[calc(100%-3rem)] bg-gradient-to-r from-[#F7C15D]/40 to-transparent md:block"
                    />
                  )}
                  <span className="border-gold/40 text-gold grid size-11 place-items-center rounded-full border text-sm font-medium">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display mt-6 text-xl text-white md:text-2xl">
                    {t(
                      `approach.pillars.${key}.title` as "approach.pillars.understand.title",
                    )}
                  </h3>
                  <p className="text-grey-light/70 mt-3 text-sm leading-relaxed text-pretty md:text-base">
                    {t(
                      `approach.pillars.${key}.text` as "approach.pillars.understand.text",
                    )}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. Differentiators: a divided list rather than cards, so the texture
             differs from the sector grid on the homepage. */}
      <section className="bg-dark border-t border-white/5 py-20 md:py-28 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl leading-[1.15] text-balance text-white  md:text-4xl">
              {t("difference.heading")}
            </h2>
          </Reveal>

          <dl className="divide-y divide-white/10 border-t border-white/10">
            {DIFFERENCE.map((key, i) => (
              <Reveal key={key} delay={i * 0.06}>
                <div className="grid gap-2 py-6 md:grid-cols-[0.7fr_1.3fr] md:gap-8 md:py-7">
                  <dt className="font-display text-gold text-base md:text-lg">
                    {t(
                      `difference.items.${key}.title` as "difference.items.mining.title",
                    )}
                  </dt>
                  <dd className="text-grey-light/70 text-sm leading-relaxed text-pretty md:text-base">
                    {t(
                      `difference.items.${key}.text` as "difference.items.mining.text",
                    )}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* 5. ARBC: a contained panel. Copy stays narrow on purpose, since the
             brief only establishes that ARBC backs the initiative. */}
      <section className="bg-dark border-t border-white/5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-7 py-10 text-center md:px-14 md:py-14">
              <h2 className="font-display text-xl text-balance text-white md:text-3xl">
                {t.rich("arbc.heading", { arbc: ArbcLink })}
              </h2>
              <p className="text-grey-light/70 mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-pretty md:text-base">
                {t.rich("arbc.text", { arbc: ArbcLink })}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. Shared closing CTA, same component as the homepage. */}
      <FinalCtaSection />
    </>
  );
}
