import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";

/** Order drives the 01–04 numerals. */
const SECTOR_KEYS = ["gold", "industrial", "critical", "emerging"] as const;

/**
 * Server component — the only client JS is the Reveal wrappers.
 *
 * Deliberately typographic rather than image-led: the expertise section above
 * is photography-heavy, so carrying the weight here with large ghosted numerals
 * gives the page rhythm instead of a second wall of pictures.
 */
export async function SectorsSection() {
  const t = await getTranslations("home.sectors");

  return (
    <section className="bg-dark border-t border-white/5 py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Full-width intro block — a deliberate break from the two
            side-by-side sections above it. */}
        <Reveal className="max-w-3xl">
          <h2 className="font-display text-[1.75rem] leading-[1.15] text-balance text-white sm:text-3xl md:text-4xl lg:text-5xl">
            {t("heading")}
          </h2>
          <p className="text-grey-light/70 mt-6 text-base leading-relaxed text-pretty md:text-lg">
            {t("intro")}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-2 md:gap-6">
          {SECTOR_KEYS.map((key, i) => (
            <Reveal key={key} delay={i * 0.08} className="h-full">
              <article className="group relative flex h-full min-h-[240px] flex-col justify-end overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.03] p-7 transition-[border-color,background-color,translate] duration-500 hover:-translate-y-1 hover:border-[#F7C15D]/40 hover:bg-white/[0.05] md:min-h-[300px] md:p-10">
                {/* Decorative numeral: aria-hidden so it is never read out. */}
                <span
                  aria-hidden="true"
                  className="font-display pointer-events-none absolute top-3 right-6 text-[4.5rem] leading-none text-white/[0.06] transition-colors duration-500 group-hover:text-[#F7C15D]/20 md:text-[6rem]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="font-display relative text-lg leading-snug text-balance text-white md:text-2xl">
                  {t(`cards.${key}.title`)}
                </h3>
                <p className="text-grey-light/70 relative mt-3 text-sm leading-relaxed text-pretty md:mt-4 md:text-base">
                  {t(`cards.${key}.description`)}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
