import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { Link } from "@/i18n/navigation";
import { getPublishedExperts } from "@/lib/experts";

export async function ExpertsTeaser() {
  const t = await getTranslations("experts.teaser");
  const experts = getPublishedExperts();
  const featured = experts
    .filter((expert) => expert.featuredOnAbout)
    .slice(0, 1);

  return (
    <section
      aria-labelledby="experts-teaser-title"
      className="bg-dark relative overflow-hidden border-t border-white/10 py-20 md:py-28 lg:py-36"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:px-8">
        {/* Editorial statement */}
        <div>
          <Reveal>
            <p className="text-gold text-xs font-medium tracking-[0.22em] uppercase">
              {t("eyebrow")}
            </p>
          </Reveal>

          <SplitLines
            as="h2"
            id="experts-teaser-title"
            className="font-display mt-7 max-w-2xl text-[clamp(2.5rem,4.8vw,5.4rem)] leading-[1.06] text-balance text-white"
          >
            {t("title")}
          </SplitLines>

          <Reveal delay={0.1}>
            <p className="text-grey-light/70 mt-8 max-w-md text-base leading-[1.8] md:text-lg">
              {t("description")}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <Link
              href="/experts"
              className="group border-gold/40 text-gold hover:border-gold mt-10 inline-flex items-center gap-3 border-b pb-3 text-sm font-medium transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              {t("button")}
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </Reveal>
        </div>

        {/* Expert portraits */}
        <div
          className={[
            "grid gap-3",
            featured.length > 1 ? "grid-cols-2" : "grid-cols-1 max-w-md",
          ].join(" ")}
        >
          {featured.map((expert, index) => (
            <Reveal key={expert.id} delay={index * 0.12} y={45}>
              <Link
                href={
                  expert.profilePublished
                    ? `/experts/${expert.slug}`
                    : "/experts"
                }
                aria-label={expert.name}
                className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
                  <Image
                    src={expert.image}
                    alt={expert.name}
                    fill
                    sizes={
                      featured.length > 1
                        ? "(min-width: 1024px) 25vw, 50vw"
                        : "(min-width: 1024px) 420px, 100vw"
                    }
                    style={{
                      objectPosition: expert.imagePosition,
                    }}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                  />

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-dark/60 via-transparent to-transparent"
                  />
                </div>

                <p className="text-grey-light mt-4 text-xs font-medium tracking-[0.06em] uppercase sm:text-sm">
                  {expert.name}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
