"use client";

import { useRef, type RefObject } from "react";
import { CrossMark } from "@/components/brand/Pattern";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Rail geometry, shared with the interactive expertise rail. */
export const RAIL = {
  dot: "size-[5px] rounded-full bg-gold/85",
  pill: "h-[18px] w-[5px] rounded-full bg-gold",
  track:
    "relative flex flex-col items-center gap-[10px] rounded-full px-[6px] py-3",
} as const;

type Props = {
  /**
   * Element whose scroll progress moves the pill from top to bottom.
   * Defaults to the enclosing <section>, so server components need no ref.
   */
  progressOf?: RefObject<HTMLElement | null>;
  /** ScrollTrigger start/end for that progress. */
  start?: string;
  end?: string;
  dots?: number;
  /** Track tint: "dark" on photography/dark panels, "light" on green. */
  tone?: "dark" | "light";
  /** Drop the rail (keep the mark) on short phone screens. */
  compactWhenShort?: boolean;
  /** Makes the marker a button (e.g. "scroll to explore"). */
  onActivate?: () => void;
  label?: string;
  className?: string;
};

/**
 * The dotted rail + split cross mark that sits on each section's seam in the
 * redesign. Here the rail is a scroll-progress readout: the elongated pill
 * travels down the dots as you move through its section.
 */
export function SeamMarker({
  progressOf,
  start = "top bottom",
  end = "bottom top",
  dots = 7,
  tone = "dark",
  compactWhenShort = false,
  onActivate,
  label,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const trigger = progressOf
        ? progressOf.current
        : ref.current?.closest("section");
      const track = ref.current?.querySelector<HTMLElement>("[data-rail]");
      const pill = ref.current?.querySelector<HTMLElement>("[data-rail-pill]");
      if (!trigger || !track || !pill) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          pill,
          { y: 0 },
          {
            // Travel the inner height of the track, less the pill itself.
            y: () => track.clientHeight - 24 - pill.offsetHeight,
            ease: "none",
            scrollTrigger: {
              trigger,
              start,
              end,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [start, end] },
  );

  const body = (
    <>
      <span
        data-rail
        className={cn(
          RAIL.track,
          tone === "dark" ? "bg-white/[0.06]" : "bg-dark/[0.07]",
          compactWhenShort && "short:max-lg:hidden",
        )}
      >
        {Array.from({ length: dots }, (_, i) => (
          <span key={i} className={RAIL.dot} />
        ))}
        <span
          data-rail-pill
          className={cn(RAIL.pill, "absolute top-3 left-1/2 -ml-[2.5px]")}
        />
      </span>
      <span data-cross className="block">
        <CrossMark className="h-auto w-10 md:w-12 lg:w-[3.4vw] lg:max-w-16 lg:min-w-11" />
      </span>
    </>
  );

  return (
    <div ref={ref} data-seam className={cn("flex flex-col items-center", className)}>
      {onActivate ? (
        <button
          type="button"
          onClick={onActivate}
          aria-label={label}
          className="group/seam focus-visible:outline-gold flex cursor-pointer flex-col items-center gap-6 rounded-2xl p-2 focus-visible:outline-2 focus-visible:outline-offset-2 md:gap-8"
        >
          {body}
        </button>
      ) : (
        <div aria-hidden="true" className="flex flex-col items-center gap-6 md:gap-8">
          {body}
        </div>
      )}
    </div>
  );
}
