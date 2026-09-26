import { getTranslations } from "next-intl/server";
import { LogoMark } from "@/components/brand/Logo";
import { ParallaxSection } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { OreRock } from "@/components/sections/OreRock";
import { cn } from "@/lib/utils";

/** Order drives the 01–04 numerals. */
const SECTOR_KEYS = ["gold", "industrial", "critical", "emerging"] as const;

/**
 * Where each sector hangs around the rock from xl up, measured off the design
 * (p.15) as % of the stage: 01 and 02 down the left, 03 and 04 on the right.
 * Below xl they fall back to a card grid (mobile: p.20).
 */
const ORBIT = [
  "xl:left-[9%] xl:top-[50%]",
  "xl:left-[11.5%] xl:top-[73.5%]",
  "xl:left-[69.5%] xl:top-[35.5%]",
  "xl:left-[63.1%] xl:top-[65%]",
] as const;

/**
 * Sectors (design p.15, mobile p.20). Server component — the rock, the line
 * reveals and the parallax are client islands.
 */
export async function SectorsSection() {
  const t = await getTranslations("home.sectors");

  return (
    <ParallaxSection
      aria-labelledby="sectors-title"
      className="bg-sectors relative overflow-hidden"
    >
      <div className="relative mx-auto grid max-w-480 gap-y-12 px-6 pt-24 pb-20 sm:px-10 md:grid-cols-2 md:items-center md:gap-x-10 md:py-28 lg:px-16 xl:block xl:aspect-video xl:min-h-184 xl:p-0">
        <SplitLines
          as="h2"
          id="sectors-title"
          className="font-display text-[clamp(1.9rem,7.8vw,2.8rem)] leading-[1.1] text-white md:text-[clamp(2rem,4.4vw,2.8rem)] xl:absolute xl:top-[19.5%] xl:left-[10.75%] xl:max-w-[25%] xl:text-[clamp(2.2rem,2.6vw,3.9rem)] xl:leading-[1.06]"
        >
          <span data-split className="block">
            {t("headingLead")}
          </span>{" "}
          <span data-split className="text-gold block">
            {t("headingAccent")}
          </span>{" "}
          <span data-split className="block">
            {t("headingRest")}
          </span>
        </SplitLines>

        <OreRock className="z-10 mx-auto w-[82%] max-w-md md:w-full xl:absolute xl:top-[26.5%] xl:left-[35%] xl:w-[29.5%] xl:max-w-none" />

        <ol className="grid gap-4 md:col-span-2 md:mt-6 md:grid-cols-2 md:gap-5 xl:contents">
          {SECTOR_KEYS.map((key, i) => (
            <li
              key={key}
              className={cn(
                "group relative xl:absolute xl:w-[27%] xl:max-w-lg",
                ORBIT[i],
              )}
            >
              <Reveal delay={i * 0.08} y={36} className="h-full">
                {/* Cards (below xl): numeral and title share the top row and
                    the description runs the full width underneath, rather
                    than being squeezed into a column beside the numeral.
                    Orbit (xl): numeral left, title over description beside
                    it, as designed. */}
                <div className="grid h-full grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-4 max-[379px]:grid-cols-1 max-[379px]:gap-y-3 rounded-[28px] border border-white/6 bg-white/2 p-5 transition-colors duration-500 group-hover:border-white/12 min-[400px]:p-6 sm:gap-x-6 sm:p-8 xl:grid-cols-[auto_clamp(11rem,12.5vw,17rem)] xl:items-start xl:gap-x-[1.5vw] xl:gap-y-0 xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0 xl:group-hover:border-transparent">
                  <span
                    aria-hidden="true"
                    data-speed-lg="0.16"
                    className="font-display text-green/12 group-hover:text-green/20 text-[clamp(3.5rem,16vw,4.75rem)] leading-[0.82] transition-colors duration-700 xl:row-span-2 xl:text-[clamp(6rem,8.7vw,12rem)]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-green flex items-start gap-2.5 text-[1.02rem] leading-[1.15] sm:text-lg xl:gap-[0.6vw] xl:pt-[0.9vw] xl:text-[clamp(0.95rem,1.05vw,1.4rem)]">
                    <LogoMark className="mt-0.5 h-auto w-6 shrink-0 transition-transform duration-500 group-hover:-rotate-6 xl:w-[1.55vw] xl:min-w-5" />
                    {/* min-w-0 + hyphens: "intermédiaires" must break
                        rather than push past the card on a 320px phone. */}
                    <span className="min-w-0 hyphens-auto text-balance wrap-break-word">
                      {t(`cards.${key}.title`)}
                    </span>
                  </h3>
                  <p className="text-grey-light/65 col-span-full text-sm leading-relaxed text-pretty sm:text-[0.95rem] xl:col-span-1 xl:col-start-2 xl:mt-[0.7vw] xl:text-[clamp(0.8rem,0.78vw,1.05rem)] xl:leading-[1.35]">
                    {t(`cards.${key}.description`)}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </ParallaxSection>
  );
}
