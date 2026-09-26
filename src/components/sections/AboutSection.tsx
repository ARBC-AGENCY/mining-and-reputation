import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { PatternStrip } from "@/components/brand/Pattern";
import { SeamMarker } from "@/components/brand/SeamMarker";
import { ParallaxSection } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { GlassLink } from "@/components/ui/GlassLink";

/**
 * About teaser (design p.13).
 *
 * The designer supplied the photo already joined to its coloured half; here
 * the photo is only the left 60% and the right is a plain panel colour, so
 * the text column reflows freely and the photo can move independently of it.
 *
 * Server component: copy is rendered on the server, and the motion pieces
 * (parallax, line reveals, pattern, rail) are small client islands.
 */
export async function AboutSection() {
  const t = await getTranslations("home.about");

  return (
    <ParallaxSection
      aria-labelledby="about-title"
      className="bg-panel relative lg:grid lg:min-h-svh lg:grid-cols-[60%_40%]"
    >
      {/* ---- Photo + headline ----------------------------------------- */}
      <div className="relative isolate flex min-h-144 flex-col justify-end overflow-hidden px-6 pt-40 pb-14 sm:px-10 lg:min-h-0 lg:p-0">
        {/* Lags behind the page: the photo reads as the deepest layer. */}
        <div data-speed="-0.2" className="absolute inset-x-0 inset-y-[-18%] -z-10">
          <Image
            src="/images/home/about-rocks.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover object-[40%_50%]"
          />
        </div>
        <div
          aria-hidden="true"
          className="from-dark/85 via-dark/25 lg:from-dark/40 absolute inset-0 -z-10 bg-linear-to-t to-transparent lg:via-transparent"
        />

        <div data-speed-lg="0.12" className="lg:absolute lg:top-[44%] lg:left-[17%] lg:w-[72%]">
          <SplitLines
            as="h2"
            id="about-title"
            className="font-display text-grey-light text-[clamp(1.9rem,7.4vw,2.8rem)] leading-[1.02] text-balance lg:text-[clamp(2.4rem,3.65vw,5rem)] lg:leading-[0.97]"
          >
            <span data-split className="block">
              {t("titleLine1")}
            </span>
            {/* Completes the statement for assistive tech; the gold twin in
                the right-hand panel is aria-hidden. */}
            <span className="sr-only"> {t("titleLine2")}</span>
          </SplitLines>
          <PatternStrip units={14} className="mt-6 h-6 w-auto max-w-full lg:mt-[2.3vw] lg:h-[2.05vw] lg:max-h-11" />
        </div>
      </div>

      {/* ---- Statement + manifesto ------------------------------------ */}
      <div className="relative flex flex-col px-6 pt-14 pb-16 sm:px-10 lg:pt-[max(8rem,29vh)] lg:pr-[8%] lg:pb-[10.5vh] lg:pl-[11%] xl:pl-[21%]">
        <SplitLines
          as="p"
          aria-hidden="true"
          className="font-display text-gold text-[clamp(1.9rem,7vw,2.6rem)] leading-[1.02] lg:text-[clamp(2.1rem,3.1vw,4.2rem)] lg:leading-[1.05]"
        >
          {t("titleLine2")}
        </SplitLines>

        <div data-speed-lg="0.08" className="mt-8 lg:mt-[7vh] xl:max-w-[21.5vw]">
          <Reveal>
            <p className="text-grey-light/85 text-base leading-relaxed text-pretty lg:text-[clamp(0.95rem,0.95vw,1.15rem)] lg:leading-[1.35] xl:text-justify xl:hyphens-auto">
              {t("description1")}
            </p>
            <p className="text-grey-light/85 mt-5 text-base leading-relaxed text-pretty lg:mt-[1.4em] lg:text-[clamp(0.95rem,0.95vw,1.15rem)] lg:leading-[1.35] xl:text-justify xl:hyphens-auto">
              {t("description2")}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-10 lg:mt-auto lg:pt-10">
          <GlassLink href="/about">{t("cta")}</GlassLink>
        </Reveal>
      </div>

      {/* The seam motif: a progress rail for this section. */}
      <SeamMarker className="absolute bottom-[4.5%] left-[60%] hidden -translate-x-1/2 lg:flex" />
    </ParallaxSection>
  );
}
