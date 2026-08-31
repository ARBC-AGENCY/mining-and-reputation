"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseVideo } from "@/lib/video";

/**
 * Click-to-play facade.
 *
 * Renders a poster until the viewer presses play, then swaps in the iframe.
 * Nothing is requested from YouTube or Vimeo — and no third-party cookie is
 * set — until that click, which keeps the page fast and consent-clean.
 */
export function VideoEmbed({
  url,
  poster,
  title,
}: {
  url: string;
  poster: string | null;
  title: string | null;
}) {
  const t = useTranslations("home.voices");
  const [playing, setPlaying] = useState(false);
  const video = parseVideo(url);

  if (!video) return null;

  const still = poster ?? video.thumbnailUrl;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[18px] border border-white/10 bg-black">
      {playing ? (
        <iframe
          src={video.embedUrl}
          title={title ?? "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={t("cta")}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          {still && (
            <Image
              src={still}
              alt=""
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          )}
          <span className="absolute inset-0 bg-[#05191A]/35 transition-colors group-hover:bg-[#05191A]/20" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-16 place-items-center rounded-full border border-white/30 bg-white/15 backdrop-blur-md transition-colors group-hover:border-[#F7C15D] group-hover:bg-[#F7C15D]/25 md:size-20">
              <Play
                className="size-6 fill-white text-white md:size-7"
                aria-hidden="true"
              />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
