import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";
import {
  GOLD,
  LIGHT,
  OG_SIZE,
  OG_TYPE,
  OgFrame,
  asJpeg,
  ogAsset,
  ogFonts,
  ogTranslator,
} from "@/lib/og";

/**
 * Default share image for every page in a locale that doesn't have its own
 * (expertise and blog pages do). Mirrors the home hero: rock and forest, the
 * two-part statement, the logo.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const { locale } = await params;
  const t = ogTranslator(locale);
  return [{ id: "share", alt: t("metadata.og.alt"), size: OG_SIZE, contentType: OG_TYPE }];
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = ogTranslator(locale);
  const [fonts, mines, forest] = await Promise.all([
    ogFonts(),
    ogAsset("hero-mines.jpg"),
    ogAsset("hero-reputation.jpg"),
  ]);

  const line = (text: string) => text.replace(/\s*\n\s*/g, " ");

  return asJpeg(new ImageResponse(
    (
      <OgFrame
        backgrounds={[
          { src: mines, left: 0, width: 720 },
          { src: forest, left: 720, width: 480 },
        ]}
      >
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Toxigenesis", fontSize: 54, lineHeight: 1.08, maxWidth: 900 }}>
          <div style={{ display: "flex", color: GOLD }}>
            {`${t("home.hero.titleLead")} ${line(t("home.hero.titleRest"))}.`}
          </div>
          <div style={{ display: "flex", color: LIGHT, marginTop: 10 }}>
            {`${t("home.hero.statementLead")} ${t("home.hero.statementRest")}.`}
          </div>
        </div>
      </OgFrame>
    ),
    { ...OG_SIZE, fonts },
  ));
}
