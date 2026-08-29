"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  children: React.ReactNode;
  /** Distance in px to travel upward. */
  y?: number;
  /** Seconds to delay, for staggering sibling reveals. */
  delay?: number;
  className?: string;
};

/**
 * Scroll-triggered fade/rise.
 *
 * Uses gsap.from (not fromTo) deliberately: the element's resting state is
 * its visible one, so if JS fails or is blocked the content still renders.
 * Honours prefers-reduced-motion via gsap.matchMedia.
 */
export function Reveal({ children, y = 24, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current, {
          opacity: 0,
          y,
          delay,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            once: true,
          },
        });
      });

      // Reduced motion: no matching media block, so the element simply stays
      // in its resting visible state. Nothing to do.

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
