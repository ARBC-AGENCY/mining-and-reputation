"use client";

import { useRef, type RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Scroll parallax for the `[data-speed]` / `[data-rise]` descendants of
 * `scope`.
 *
 *   data-speed="0.2"   moves 20% of a viewport height further than the page
 *                      while the scope crosses the screen — i.e. it travels
 *                      faster than its background. Negative values lag.
 *   data-speed-lg="…"  same, but only from the lg breakpoint up (for layers
 *                      that would collide with stacked mobile content).
 *   data-rise="0.3"    one-way: starts 30% of a viewport height low and rises
 *                      faster than the page, landing on its designed spot as
 *                      the scope's bottom reaches the bottom of the screen —
 *                      then stays put. For things that sit on the section's
 *                      bottom edge (rocks): they move, but never lift off it.
 *
 * Offsets are symmetric around the moment the scope is centred on screen, so
 * the layout rests exactly where it was designed when you are looking at it.
 * The scope — not the moving element — is the trigger, which keeps trigger
 * positions stable while the elements themselves are transformed.
 */
export function useParallax(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      const bind = (attr: "speed" | "speedLg") => () => {
        root
          .querySelectorAll<HTMLElement>(
            attr === "speed" ? "[data-speed]" : "[data-speed-lg]",
          )
          .forEach((el) => {
            const speed = Number.parseFloat(el.dataset[attr] ?? "");
            if (!speed) return;
            gsap.fromTo(
              el,
              { y: () => window.innerHeight * speed * 0.5 },
              {
                y: () => -window.innerHeight * speed * 0.5,
                ease: "none",
                scrollTrigger: {
                  trigger: root,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            );
          });
      };

      mm.add("(prefers-reduced-motion: no-preference)", bind("speed"));
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        root.querySelectorAll<HTMLElement>("[data-rise]").forEach((el) => {
          const rise = Number.parseFloat(el.dataset.rise ?? "");
          if (!rise) return;
          gsap.fromTo(
            el,
            { y: () => window.innerHeight * rise },
            {
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom bottom",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });
      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 1024px)",
        bind("speedLg"),
      );
      return () => mm.revert();
    },
    { scope },
  );
}

type ParallaxSectionProps = React.ComponentPropsWithoutRef<"section">;

/**
 * A <section> that applies `useParallax` to itself — lets server components
 * opt in with data attributes alone.
 */
export function ParallaxSection(props: ParallaxSectionProps) {
  const ref = useRef<HTMLElement>(null);
  useParallax(ref);
  return <section ref={ref} {...props} />;
}
