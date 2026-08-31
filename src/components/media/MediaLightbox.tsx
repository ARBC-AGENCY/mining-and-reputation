"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseVideo } from "@/lib/video";

export type MediaItem = {
  /** "video" plays an embed; "image" shows the still. */
  kind: "video" | "image";
  title: string | null;
  /** YouTube or Vimeo URL, for kind === "video". */
  videoUrl?: string | null;
  /** Poster for video, or the image itself for kind === "image". */
  image?: string | null;
};

type Props = {
  items: MediaItem[];
  /** Index to open at, or null when closed. */
  openAt: number | null;
  onClose: () => void;
};

export function MediaLightbox({ items, openAt, onClose }: Props) {
  const t = useTranslations("lightbox");
  const [index, setIndex] = useState(openAt ?? 0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);
  // Portalling is not optional here: any transformed ancestor (GSAP's Reveal
  // leaves an identity matrix behind) becomes the containing block for
  // position: fixed, which clipped this dialog to the section instead of the
  // viewport. Rendering into <body> escapes that entirely.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const open = openAt !== null;
  const count = items.length;
  const item = items[index];

  useEffect(() => {
    if (openAt !== null) setIndex(openAt);
  }, [openAt]);

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + count) % count),
    [count],
  );

  // Keyboard: Escape closes, arrows navigate, Tab is trapped in the dialog.
  useEffect(() => {
    if (!open) return;
    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (count > 1 && e.key === "ArrowLeft") return go(-1);
      if (count > 1 && e.key === "ArrowRight") return go(1);
      if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          "button, [href], iframe, [tabindex]:not([tabindex='-1'])",
        );
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      restoreFocusTo.current?.focus?.();
    };
  }, [open, count, go, onClose]);

  if (!open || !item || !mounted) return null;

  const video = item.kind === "video" ? parseVideo(item.videoUrl) : null;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t("dialog")}
      className="fixed inset-0 z-[120] flex flex-col bg-[#05191A]/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 py-4 md:px-8">
        <p className="text-grey-light/70 text-sm">
          {count > 1 && t("counter", { current: index + 1, total: count })}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="text-grey-light hover:text-gold rounded-full p-2 transition-colors"
        >
          <X className="size-6" aria-hidden="true" />
        </button>
      </div>

      {/* Stop propagation so clicking the media itself doesn't close. */}
      <div
        className="flex flex-1 items-center justify-center px-4 pb-8 md:px-16"
        onClick={(e) => e.stopPropagation()}
      >
        {count > 1 && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={t("previous")}
            className="mr-2 grid size-11 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:border-[#F7C15D] hover:text-[#F7C15D] md:mr-6"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
        )}

        <figure className="flex w-full max-w-5xl flex-col items-center">
          <div className="relative w-full overflow-hidden rounded-[14px] bg-black">
            {video ? (
              <div className="aspect-video w-full">
                <iframe
                  key={video.id}
                  src={video.embedUrl}
                  title={item.title ?? t("dialog")}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>
            ) : item.image ? (
              <div className="relative aspect-video w-full">
                <Image
                  src={item.image}
                  alt={item.title ?? ""}
                  fill
                  sizes="(min-width: 768px) 80vw, 100vw"
                  className="object-contain"
                />
              </div>
            ) : null}
          </div>
          {item.title && (
            <figcaption className="text-grey-light/80 mt-4 text-center text-sm md:text-base">
              {item.title}
            </figcaption>
          )}
        </figure>

        {count > 1 && (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={t("next")}
            className="ml-2 grid size-11 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:border-[#F7C15D] hover:text-[#F7C15D] md:ml-6"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
}
