import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";
import { EXPERTISE_AREAS, areaBySlug } from "@/lib/expertise";
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
import { SITE_NAME } from "@/lib/site";

type Params = { locale: string; slug: string };

/** Share image for one expertise page: its photograph, number and title. */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    EXPERTISE_AREAS.map(({ slug }) => ({ locale, slug })),
  );
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<Params> | Params;
}) {
  const { locale, slug } = await params;
  const area = areaBySlug(slug);
  const t = ogTranslator(locale);
  const alt = area
    ? `${t(`expertise.areas.${area.key}.metaTitle` as "expertise.areas.crisis.metaTitle")} — ${SITE_NAME}`
    : SITE_NAME;
  return [{ id: "share", alt, size: OG_SIZE, contentType: OG_TYPE }];
}

export default async function Image({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const index = EXPERTISE_AREAS.findIndex((a) => a.slug === slug);
  const area = EXPERTISE_AREAS[Math.max(0, index)];
  const t = ogTranslator(locale);
  const [fonts, photo] = await Promise.all([ogFonts(), ogAsset(`${area.slug}.jpg`)]);

  return asJpeg(new ImageResponse(
    (
      <OgFrame backgrounds={[{ src: photo, left: 0, width: 1200 }]}>
        <div style={{ display: "flex", fontSize: 22, color: GOLD, letterSpacing: 5, textTransform: "uppercase" }}>
          {`${t("nav.expertise")} · ${String(index + 1).padStart(2, "0")}`}
        </div>
        <div style={{ display: "flex", marginTop: 18, fontFamily: "Toxigenesis", fontSize: 62, lineHeight: 1.05, color: "#FFFFFF", maxWidth: 820 }}>
          {t(`expertise.areas.${area.key}.title` as "expertise.areas.crisis.title")}
        </div>
        <div style={{ display: "flex", marginTop: 20, fontSize: 30, color: LIGHT, maxWidth: 760 }}>
          {t(`expertise.areas.${area.key}.tagline` as "expertise.areas.crisis.tagline")}
        </div>
      </OgFrame>
    ),
    { ...OG_SIZE, fonts },
  ));
}
