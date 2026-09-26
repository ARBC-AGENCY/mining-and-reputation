"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * The ore specimen at the centre of the sectors section (design p.15).
 *
 * Four stacked layers so no two tweens fight over one transform:
 *   [data-ore-scroll]  turns and settles with the section's scroll
 *   [data-ore-float]   a slow idle bob
 *   [data-ore-tilt]    leans towards the pointer (fine pointers only)
 *   image
 * Faint orbit rings behind it carry a single gold point around — the
 * "points around the rock" the sectors hang from.
 */
export function OreRock({ className, alt = "" }: { className?: string; alt?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const section = el?.closest("section");
      if (!el || !section) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-ore-scroll]",
          { rotate: -14, scale: 0.82, autoAlpha: 0.35 },
          {
            rotate: 10,
            scale: 1.04,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );

        gsap.to("[data-ore-float]", {
          y: -14,
          rotate: 1.6,
          duration: 3.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        if (!window.matchMedia("(pointer: fine)").matches) return;
        const tilt = el.querySelector("[data-ore-tilt]");
        const rx = gsap.quickTo(tilt, "rotationX", { duration: 1.2, ease: "power3.out" });
        const ry = gsap.quickTo(tilt, "rotationY", { duration: 1.2, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const nx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
          const ny = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
          ry(nx * 22);
          rx(-ny * 22);
        };
        const onLeave = () => {
          rx(0);
          ry(0);
        };
        section.addEventListener("pointermove", onMove);
        section.addEventListener("pointerleave", onLeave);
        return () => {
          section.removeEventListener("pointermove", onMove);
          section.removeEventListener("pointerleave", onLeave);
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("relative aspect-square", className)}>
      {/* Orbit rings. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="pointer-events-none absolute top-1/2 left-1/2 w-[165%] max-w-none -translate-x-1/2 -translate-y-1/2 overflow-visible"
      >
        <circle cx="100" cy="100" r="99" fill="none" stroke="rgb(142 180 103 / 0.07)" strokeWidth="0.3" />
        {/* The inner ring hugs the rock, so its travelling point never
            crosses the sector copy around it. */}
        <circle cx="100" cy="100" r="64" fill="none" stroke="rgb(230 230 230 / 0.06)" strokeWidth="0.25" strokeDasharray="0.6 2.4" />
        <g className="animate-orbit origin-center motion-reduce:animate-none">
          <circle cx="100" cy="36" r="0.9" fill="#F7C15D" />
          <circle cx="100" cy="36" r="2.6" fill="rgb(247 193 93 / 0.18)" />
        </g>
      </svg>

      <div data-ore-scroll className="absolute inset-0 perspective-[900px]">
        <div data-ore-float className="absolute inset-0">
          <div data-ore-tilt className="absolute inset-0 transform-3d">
            <Image
              src="/images/home/ore.webp"
              alt={alt}
              fill
              sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 80vw"
              className="object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
