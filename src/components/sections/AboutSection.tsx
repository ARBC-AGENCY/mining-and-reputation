import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Server component — static copy and one link, so it ships no client JS.
 */
export async function AboutSection() {
  const t = await getTranslations("home.about");

  return (
    <section className="flex lg:justify-center bg-dark border-b border-white/5 py-20 md:py-28 lg:py-32">
      <div className="  grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        {/* First in the DOM, so it stays on top once the grid collapses. */}
        <Reveal>
          <h2 className="font-display text-[1.75rem] leading-[1.1] tracking-tight text-white sm:text-2xl sm:text-center lg:text-left md:text-3xl lg:text-4xl lg:leading-[1.05]">
            {/* Two keys rather than a hardcoded <br>, so the break survives
                translation — the second line is the emphatic one. */}
            <span className="block text-balance">{t("titleLine1")}</span>
            <span className="block text-balance text-gold">
              {t("titleLine2")}
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="lg:pt-3 w-full sm:flex sm:flex-col sm:items-center lg:items-start">
            <p className="text-grey-light/70 text-base leading-relaxed text-pretty md:text-lg sm:text-center lg:text-left">
              {t("description1")}
            </p>
            <p className="text-grey-light/70 text-base leading-relaxed text-pretty md:text-lg sm:text-center lg:text-left mt-5">
              {t("description2")}
            </p>
            <Link
              href="/about"
              className="text-gold mt-8 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white md:mt-10"
            >
              {t("cta")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
