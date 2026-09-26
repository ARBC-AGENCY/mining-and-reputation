import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";
import {
  GOLD,
  OG_SIZE,
  OG_TYPE,
  OgFrame,
  asJpeg,
  ogAsset,
  ogFonts,
  ogTranslator,
} from "@/lib/og";
import { SITE_NAME } from "@/lib/site";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { POST_OG_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";

type Params = { locale: string; slug: string };

/**
 * Share image for a post. An editor-supplied SEO social image is used as-is;
 * otherwise the cover photo (or the brand rock) carries the format and title.
 */
export async function generateStaticParams() {
  const slugs = await client.fetch(POST_SLUGS_QUERY).catch(() => []);
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<Params> | Params;
}) {
  const { slug } = await params;
  const post = await client.fetch(POST_OG_QUERY, { slug }).catch(() => null);
  return [
    {
      id: "share",
      alt: post?.title ? `${post.title} — ${SITE_NAME}` : SITE_NAME,
      size: OG_SIZE,
      contentType: OG_TYPE,
    },
  ];
}

const sanityJpeg = (source: unknown) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  urlFor(source as any).width(OG_SIZE.width).height(OG_SIZE.height).fit("crop").format("jpg").quality(80).url();

export default async function Image({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const [post, fonts] = await Promise.all([
    client.fetch(POST_OG_QUERY, { slug }).catch(() => null),
    ogFonts(),
  ]);

  if (post?.socialImage) {
    return asJpeg(new ImageResponse(
      (
        // eslint-disable-next-line @next/next/no-img-element -- Satori, not the DOM
        <img src={sanityJpeg(post.socialImage)} alt="" width={OG_SIZE.width} height={OG_SIZE.height} />
      ),
      { ...OG_SIZE, fonts },
    ));
  }

  const t = ogTranslator(locale);
  const background = post?.coverImage ? sanityJpeg(post.coverImage) : await ogAsset("hero-mines.jpg");
  const title = post?.title ?? SITE_NAME;
  const label = post?.format ? t(`formats.${post.format}` as "formats.article") : "";

  return asJpeg(new ImageResponse(
    (
      <OgFrame backgrounds={[{ src: background, left: 0, width: OG_SIZE.width }]}>
        {label && (
          <div style={{ display: "flex", fontSize: 22, color: GOLD, letterSpacing: 5, textTransform: "uppercase" }}>
            {label}
          </div>
        )}
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontFamily: "Toxigenesis",
            fontSize: title.length > 70 ? 46 : 56,
            lineHeight: 1.08,
            color: "#FFFFFF",
            maxWidth: 900,
          }}
        >
          {title}
        </div>
      </OgFrame>
    ),
    { ...OG_SIZE, fonts },
  ));
}
