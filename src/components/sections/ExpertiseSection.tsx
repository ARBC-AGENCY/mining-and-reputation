"use client";

import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import DepthCarousel, {
  type DepthCarouselItem,
} from "@/components/DepthCarousel";
import { Link } from "@/i18n/navigation";

export type ExpertiseCard = {
  eyebrow: string;
  title: string;
  description: string;
  /** Optional photography. Cards render a branded panel without it. */
  image?: string;
  alt?: string;
};

export type ExpertiseStrings = {
  heading: string;
  intro: string;
  cta: string;
  carouselLabel: string;
  cards: ExpertiseCard[];
};

export function ExpertiseSection({ strings }: { strings: ExpertiseStrings }) {
  const items = useMemo<DepthCarouselItem[]>(
    () =>
      strings.cards.map((c) => ({
        image: c.image,
        alt: c.alt ?? "",
        eyebrow: c.eyebrow,
        title: c.title,
        description: c.description,
      })),
    [strings.cards],
  );

  return (
    <section className="bg-dark py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-xl:flex max-lg:flex-col max-xl:items-start grid max-w-7xl items-center gap-12 px-6 xl:grid-cols-2 xl:gap-16 xl:px-8">
        {/* Text first in the DOM, so it also comes first when stacked. */}
        <div className="lg:max-w-sm xl:max-w-lg lg:self-center sm:max-w-none sm:items-center lg:items-start  max-xl:flex max-xl:flex-col ">
          <h2 className="font-display text-[1.75rem] text-balance  leading-[1.1] text-white sm:text-2xl sm:text-center lg:text-left md:text-3xl lg:text-4xl lg:leading-[1.05]">
            {strings.heading}
          </h2>
          <p className="text-grey-light/70 mt-6  text-base text-pretty leading-relaxed md:text-lg sm:text-center lg:text-left">
            {strings.intro}
          </p>
          <Link
            href="/expertise"
            className="text-gold mt-10 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
          >
            {strings.cta}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Fixed height: DepthCarousel is absolutely positioned inside and
            would otherwise collapse to zero. overflow-hidden clips the fanned
            receding cards, which otherwise push ~38px past a phone viewport and
            give the whole page a horizontal scrollbar. */}
        <div className="relative max-[425px]:h-fit h-113 sm:h-139 w-full overflow-hidden md:h-150">
          <DepthCarousel
            items={items}
            cardWidth={350}
            cardHeight={480}
            radius={18}
            tint="#05191A"
            depth={220}
            spread={90}
            tilt={22}
            tiltDirection="right"
            perspective={1400}
            visibleCards={4}
            falloff={0.2}
            blur={6}
            duration={700}
            ease="power3.out"
            loop
            // Wheel off: it called preventDefault() and swallowed page scroll
            // whenever the cursor was over the carousel. Drag, arrows and
            // indicators remain; touch is unaffected.
            enableWheel={false}
            showControls
            showIndicators
            ariaLabel={strings.carouselLabel}
          />
        </div>
      </div>
    </section>
  );
}
