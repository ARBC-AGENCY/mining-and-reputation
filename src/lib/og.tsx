import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ImageResponse } from "next/og";
import { createTranslator } from "next-intl";
import sharp from "sharp";
import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import {
  MARK_GOLD,
  MARK_LIGHT,
  TEXT_GOLD,
  TEXT_LIGHT,
} from "@/components/brand/Logo";

/**
 * Shared pieces for the generated share images (opengraph-image.tsx files).
 *
 * Satori renders these: flexbox only, TTF/OTF fonts, PNG/JPEG images — hence
 * the JPEG crops in /assets/og and the original font files rather than the
 * WOFF2 copies the site itself serves.
 */
export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Translator for image routes. These run at build time with no request, so
 * next-intl's request-scoped getTranslations (which reads headers) can't be
 * used; createTranslator works from the messages directly.
 */
export function ogTranslator(locale: string) {
  const loc = locale === "fr" ? "fr" : "en";
  return createTranslator({
    locale: loc,
    messages: (loc === "fr" ? fr : en) as typeof en,
  });
}
/** JPEG, not Satori's PNG: photographic cards drop from ~1–2 MB to ~150 KB,
 * under the limits WhatsApp and LinkedIn apply to link previews. */
export const OG_TYPE = "image/jpeg";

/** Re-encode an ImageResponse (always PNG) as a compact JPEG. */
export async function asJpeg(image: ImageResponse) {
  const png = Buffer.from(await image.arrayBuffer());
  const jpg = await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpg), {
    headers: { "Content-Type": OG_TYPE },
  });
}

export const DARK = "#05191A";
export const GOLD = "#F7C15D";
export const LIGHT = "#E6E6E6";
export const DOMAIN = "miningreputation.com";

const root = process.cwd();

export async function ogFonts() {
  const [display, text] = await Promise.all([
    readFile(join(root, "public/fonts/toxigenesis/typodermic-toxigenesisrg-bold.ttf")),
    readFile(join(root, "public/fonts/FivoSansModern/FivoSansModern-Medium.otf")),
  ]);
  return [
    { name: "Toxigenesis", data: display, weight: 700 as const, style: "normal" as const },
    { name: "Fivo", data: text, weight: 500 as const, style: "normal" as const },
  ];
}

/** A file from /assets/og as a data URI Satori can draw. */
export async function ogAsset(file: string) {
  const data = await readFile(join(root, "assets/og", file));
  return `data:image/jpeg;base64,${data.toString("base64")}`;
}

/** The V1 logo, from the same path data as the site header. */
export function OgLogo({ width }: { width: number }) {
  return (
    <svg
      width={width}
      height={Math.round((width * 49.49) / 249.56)}
      viewBox="0 0 249.56 49.49"
    >
      <path fill={LIGHT} d={MARK_LIGHT + TEXT_LIGHT} />
      <path fill={GOLD} d={MARK_GOLD + TEXT_GOLD} />
    </svg>
  );
}

/** Photo(s) behind, brand gradient over, logo and domain in fixed places. */
export function OgFrame({
  backgrounds,
  children,
}: {
  backgrounds: { src: string; left: number; width: number }[];
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: DARK,
        fontFamily: "Fivo",
      }}
    >
      {backgrounds.map((bg) => (
        // eslint-disable-next-line @next/next/no-img-element -- Satori, not the DOM
        <img
          key={bg.left}
          src={bg.src}
          alt=""
          width={bg.width}
          height={OG_SIZE.height}
          style={{ position: "absolute", top: 0, left: bg.left, objectFit: "cover" }}
        />
      ))}
      <div
        // Explicit edges: Satori ignores the `inset` shorthand.
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundImage:
            "linear-gradient(90deg, rgba(5,25,26,0.94) 0%, rgba(5,25,26,0.82) 42%, rgba(5,25,26,0.35) 100%)",
        }}
      />
      <div style={{ position: "absolute", left: 72, top: 60, display: "flex" }}>
        <OgLogo width={290} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 64,
          bottom: 52,
          display: "flex",
          fontSize: 22,
          color: GOLD,
          letterSpacing: 1,
        }}
      >
        {DOMAIN}
      </div>
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          bottom: 110,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
}
