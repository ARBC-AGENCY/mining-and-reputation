import { getTranslations } from "next-intl/server";
import { HeaderShell, type HeaderStrings } from "./HeaderShell";

export async function Header() {
  const t = await getTranslations("nav");

  const strings: HeaderStrings = {
    home: t("home"),
    primary: t("primary"),
    language: t("language"),
    openMenu: t("openMenu"),
    closeMenu: t("closeMenu"),
    talkToUs: t("talkToUs"),
    links: [
      { href: "/expertise", label: t("expertise") },
      { href: "/about", label: t("about") },
      // Route stays /insights (already wired to Sanity); label is "Blog" for now.
      { href: "/insights", label: t("blog") },
    ],
  };

  return <HeaderShell strings={strings} />;
}
