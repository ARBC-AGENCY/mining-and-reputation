"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { whenPageReady } from "@/lib/scroll";

type Props = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  as?: ElementType;
  children: React.ReactNode;
  /** Seconds before the first line moves. */
  delay?: number;
  /**
   * "scroll" — when the heading enters the viewport.
   * "ready"  — as soon as the preloader lifts (above-the-fold headings).
   */
  trigger?: "scroll" | "ready";
};

/**
 * Headline reveal: every rendered line rises out of its own mask.
 *
 * Lines are measured by SplitText at the size they actually render and are
 * re-split on resize, so the effect survives any wrap and any locale. Mark
 * sub-parts with `data-split` to split them independently (e.g. a gold lead
 * line in a different size from the rest); otherwise the whole element is
 * split.
 *
 * Accessibility: aria "none" leaves the words themselves exposed rather than
 * relying on an aria-label, which screen readers ignore on generic elements.
 * Reduced motion: never split, never hidden.
 */
export function SplitLines({
  as: Tag = "div",
  children,
  delay = 0,
  trigger = "scroll",
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const parts = el.querySelectorAll<HTMLElement>("[data-split]");
        const targets = parts.length ? Array.from(parts) : [el];
        let cancelReady = () => {};

        const split = SplitText.create(targets, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          aria: "none",
          autoSplit: true,
          onSplit(self) {
            const tween = gsap.from(self.lines, {
              yPercent: 115,
              rotate: 2,
              transformOrigin: "0% 100%",
              duration: 1.15,
              ease: "expo.out",
              stagger: 0.085,
              delay,
              paused: trigger === "ready",
              scrollTrigger:
                trigger === "scroll"
                  ? { trigger: el, start: "top 88%", once: true }
                  : undefined,
            });
            if (trigger === "ready") {
              cancelReady();
              cancelReady = whenPageReady(() => tween.play());
            }
            return tween;
          },
        });

        return () => {
          cancelReady();
          split.revert();
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
