"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import ScrollExpand from "@/components/ScrollExpand";
import { HeroThreads } from "@/components/hero/HeroThreads";
import SpecularButton from "@/components/SpecularButton";
import { useHeaderReveal } from "@/components/providers/HeaderRevealProvider";
import { useRouter } from "@/i18n/navigation";

export type HeroStrings = {
  brand: string;
  scrollHint: string;
  title: string;
  description: string;
  cta: string;
  imageAlt: string;
};

/** Header appears just before the overlay copy does. */
const HEADER_AT = 0.62;
/** Overlay only becomes interactive once it is essentially opaque. */
const CONTENT_AT = 0.85;

export function HomeHero({ strings }: { strings: HeroStrings }) {
  const { setRevealed } = useHeaderReveal();
  const router = useRouter();
  const [contentActive, setContentActive] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Hide the header until the frame opens; restore it on unmount so other
  // pages are unaffected.
  useEffect(() => {
    setRevealed(false);
    return () => setRevealed(true);
  }, [setRevealed]);

  const handleProgress = useCallback(
    (p: number) => {
      // Flip the attribute directly: CSS reads it, so the header fades without
      // a React render on every animation frame.
      const el = sectionRef.current;
      if (el) {
        if (p >= HEADER_AT) el.setAttribute("data-hero-revealed", "");
        else el.removeAttribute("data-hero-revealed");
      }
      // Still mirrored into state so the header gets inert/aria-hidden.
      setRevealed(p >= HEADER_AT);
      // Functional update bails out when unchanged, so this rAF-rate callback
      // only triggers a render on the two threshold crossings.
      setContentActive((prev) => (prev === p >= CONTENT_AT ? prev : p >= CONTENT_AT));
    },
    [setRevealed],
  );

  return (
    <section ref={sectionRef} data-scroll-hero className="bg-[#05191A]">
      <ScrollExpand
        useWindowScroll
        src="/images/Background-1@2560.webp"
        alt={strings.imageAlt}
        title={
          // The logo replaces the wordmark at rest. drop-shadow rather than the
          // parent's text-shadow, which does not apply to an image.
          <Image
            src="/images/LOGO-WHITE@600.png"
            alt={strings.brand}
            width={600}
            height={167}
            priority
            sizes="(min-width: 768px) 520px, 62vw"
            className="h-auto w-[62%] max-w-[520px] drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]"
          />
        }
        scrollHint={
          <>
            {strings.scrollHint}
            {/* motion-reduce turns the loop off without hiding the arrow. */}
            <ChevronDown
              className="size-4 animate-scroll-hint motion-reduce:animate-none"
              aria-hidden="true"
            />
          </>
        }
        onProgress={handleProgress}
        backdrop={<HeroThreads />}
        startWidth={42}
        startHeight={58}
        startRadius={24}
        endRadius={0}
        mediaZoom={1.35}
        scrollDistance={1.2}
        holdDistance={0.35}
        smoothing={0.1}
        overlayScrim={0.45}
        className="font-display min-h-svh"
      >
        {/* ScrollExpand's overlay stays hit-testable at opacity 0, so gate
            pointer events here or the invisible CTA swallows clicks at rest. */}
        <div
          className={
            contentActive ? "pointer-events-auto" : "pointer-events-none"
          }
          aria-hidden={!contentActive}
        >
          <h1 className="font-display mx-auto max-w-4xl text-balance text-2xl leading-[1.15] text-white lg:text-4xl">
            {strings.title}
          </h1>
          <p className="font-sans mx-auto mt-6 max-w-2xl text-pretty text-base text-white/85 md:text-lg">
            {strings.description}
          </p>
          <div className="mt-10 flex justify-center">
            <SpecularButton
              size="md"
              radius={18}
              textColor="#FFFFFF"
              lineColor="#F7C15D"
              baseColor="#353F2C"
              tint="#FFFFFF"
              tintOpacity={0.08}
              blur={10}
              onClick={() => router.push("/expertise")}
            >
              {strings.cta}
            </SpecularButton>
          </div>
        </div>
      </ScrollExpand>
    </section>
  );
}
