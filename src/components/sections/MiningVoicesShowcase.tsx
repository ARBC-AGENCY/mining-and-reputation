"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { MediaLightbox, type MediaItem } from "@/components/media/MediaLightbox";
import { Link } from "@/i18n/navigation";

export type VoicesItem = {
  slug: string | null;
  title: string | null;
  /** Already resolved server-side: cover image, else the video's own thumbnail. */
  poster: string | null;
  videoUrl: string | null;
};

export type VoicesCopy = {
  label: string;
  heading: string;
  text: string;
};

export function MiningVoicesShowcase({
  items,
  fallbackPoster,
  copy,
}: {
  items: VoicesItem[];
  fallbackPoster: string;
  /** Resolved server-side: CMS value if set, else the translation file. */
  copy: VoicesCopy;
}) {
  const t = useTranslations("home.voices");
  const [openAt, setOpenAt] = useState<number | null>(null);

  const latest = items[0] ?? null;
  const poster = latest?.poster ?? fallbackPoster;
  const playable = items.filter((i) => i.videoUrl);

  const media: MediaItem[] = playable.map((i) => ({
    kind: "video",
    title: i.title,
    videoUrl: i.videoUrl,
    image: i.poster,
  }));

  return (
    <>
      <div className="group relative block overflow-hidden rounded-[18px] border border-white/10">
        <div className="relative min-h-[440px] w-full md:min-h-[520px] lg:min-h-[600px]">
          <Image
            src={poster}
            alt=""
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,25,26,0.94)_0%,rgba(5,25,26,0.72)_45%,rgba(5,25,26,0.35)_100%)]" />

          <div className="relative flex h-full min-h-[440px] flex-col justify-end p-7 md:min-h-[520px] md:p-12 lg:min-h-[600px] lg:p-16">
            <div className="flex items-center gap-3">
              {/* A real button when there is something to play, so it is
                  keyboard reachable and announces itself correctly. */}
              {media.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setOpenAt(0)}
                  aria-label={t("cta")}
                  className="grid size-11 cursor-pointer place-items-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md transition-colors duration-500 hover:border-[#F7C15D] hover:bg-[#F7C15D]/20 md:size-14"
                >
                  <Play
                    className="size-4 fill-white text-white md:size-5"
                    aria-hidden="true"
                  />
                </button>
              ) : (
                <span
                  aria-hidden="true"
                  className="grid size-11 place-items-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md md:size-14"
                >
                  <Play className="size-4 fill-white text-white md:size-5" />
                </span>
              )}
              <span className="text-xs font-medium tracking-[0.25em] text-[#F7C15D] uppercase">
                {copy.label}
              </span>
            </div>

            <h2 className="font-display mt-7 max-w-3xl text-2xl leading-tight text-balance text-white md:text-4xl lg:text-5xl">
              {copy.heading}
            </h2>
            <p className="text-grey-light/80 mt-5 max-w-2xl text-sm leading-relaxed text-pretty md:text-base">
              {copy.text}
            </p>

            {latest?.title && (
              <p className="text-grey-light/60 mt-6 text-sm">
                <span className="text-grey-light/40">{t("series")} — </span>
                {latest.title}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              {media.length > 0 && (
                <button
                  type="button"
                  onClick={() => setOpenAt(0)}
                  className="text-gold inline-flex cursor-pointer items-center gap-2 text-sm font-medium transition-colors hover:text-white"
                >
                  {t("cta")}
                  <Play className="size-3.5 fill-current" aria-hidden="true" />
                </button>
              )}
              <Link
                href="/insights?type=interview"
                className="text-gold inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
              >
                {t("ctaFallback")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <MediaLightbox
        items={media}
        openAt={openAt}
        onClose={() => setOpenAt(null)}
      />
    </>
  );
}
