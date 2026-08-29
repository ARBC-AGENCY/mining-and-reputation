import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");
  const tMeta = await getTranslations("metadata");

  return (
    <footer className="bg-dark border-green-dark border-t">
      <div className="text-grey-light/60 mx-auto max-w-6xl px-6 py-10 text-sm">
        &copy; {new Date().getFullYear()} {tMeta("siteName")}. {t("rights")}
      </div>
    </footer>
  );
}
