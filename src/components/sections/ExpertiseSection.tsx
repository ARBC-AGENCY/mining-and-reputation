import { getTranslations } from "next-intl/server";
import { ExpertiseShowcase } from "@/components/sections/ExpertiseShowcase";
import { EXPERTISE_AREAS, expertiseImage } from "@/lib/expertise";

/**
 * Home expertise section (design p.14). Every card leads to the expertise
 * index, as in the design ("Découvrir toutes nos expertises"); the expertise
 * page hero uses the same showcase with per-card links.
 */
export async function ExpertiseSection() {
  const t = await getTranslations("home.expertise");
  const tc = await getTranslations("carousel");
  const total = EXPERTISE_AREAS.length;

  return (
    <ExpertiseShowcase
      variant="home"
      strings={{
        headingLead: t("headingLead"),
        headingRest: t("headingRest"),
        intro: t("intro"),
        cardLink: t("cta"),
        label: t("carouselLabel"),
        previous: tc("previous"),
        next: tc("next"),
        pause: tc("pause"),
        play: tc("play"),
      }}
      slides={EXPERTISE_AREAS.map(({ key, slug }, i) => ({
        title: t(`cards.${key}.title`),
        text: t(`cards.${key}.description`),
        image: expertiseImage(slug),
        href: "/expertise",
        position: tc("position", { current: i + 1, total }),
      }))}
    />
  );
}
