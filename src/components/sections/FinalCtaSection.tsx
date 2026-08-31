import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";

export async function FinalCtaSection() {
  const t = await getTranslations("home.finalCta");

  return (
    <section className="bg-dark border-t border-white/5 py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <Reveal>
          <h2 className="font-display text-[1.75rem] leading-[1.15] text-balance text-white sm:text-3xl md:text-4xl lg:text-5xl">
            {t("heading")}
          </h2>
          <p className="text-grey-light/70 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pretty md:text-lg">
            {t("text")}
          </p>
          <Link
            href="/contact"
            className="border-gold/40 text-gold hover:border-gold mt-10 inline-flex items-center gap-2 rounded-[18px] border px-7 py-3.5 text-sm font-medium transition-colors hover:bg-[#F7C15D]/10 hover:text-white"
          >
            {t("cta")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
