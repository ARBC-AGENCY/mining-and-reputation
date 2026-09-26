"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import { PatternStrip } from "@/components/brand/Pattern";
import { SeamMarker } from "@/components/brand/SeamMarker";
import { RainCanvas } from "@/components/hero/RainCanvas";
import { GlassLink } from "@/components/ui/GlassLink";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { scrollToTarget, whenPageReady } from "@/lib/scroll";

export type HeroStrings = {
  titleLead: string;
  /** "\n" forces the designed line break ("déplacent / des ressources"). */
  titleRest: string;
  statementLead: string;
  statementRest: string;
  description: string;
  cta: string;
  scrollHint: string;
};

/**
 * Desktop seam, as % of the stage width. The forest panel starts at
 * PANEL_LEFT and is clipped back to the seam, which drifts a few percent with
 * the pointer so the split feels alive.
 */
const SEAM = 60;
const PANEL_LEFT = 55;
const insetFor = (seam: number) =>
  `inset(0% 0% 0% ${((seam - PANEL_LEFT) / (100 - PANEL_LEFT)) * 100}%)`;

/** Slanted wipe for the mobile scene — echoes the angled cuts of the mark. */
const wipe = (p: number) => {
  const left = Math.max(0, 100 - p * 118);
  const right = Math.min(100, left + 18);
  return `polygon(0% ${left}%, 100% ${right}%, 100% 100%, 0% 100%)`;
};

const SPLIT = {
  type: "lines",
  mask: "lines",
  linesClass: "split-line",
  aria: "none",
} as const;

/**
 * Home hero (design p.12, mobile p.17–18).
 *
 * Desktop: the two photographs share one screen, split at 60%. They unveil
 * from opposite edges as the preloader lifts, then breathe, follow the
 * pointer and drift apart at different speeds as you scroll away.
 *
 * Mobile: the same statement plays as a two-beat scroll scene. The section
 * is 200svh tall with a sticky stage; the forest wipes up over the rock and
 * the copy hands over while the CTA, rail and mark hold still — exactly how
 * the two mobile boards stack.
 */
export function HomeHero({ strings }: { strings: HeroStrings }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const reputation = q("[data-panel='reputation']")[0] as HTMLElement;
      const mm = gsap.matchMedia();

      mm.add(
        {
          // matchMedia only runs the callback while at least one condition
          // matches; `always` keeps the mobile + reduced-motion case alive.
          always: "all",
          desktop: "(min-width: 1024px)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desktop, motion } = ctx.conditions as Record<string, boolean>;

          // ---------------------------------------------------------------
          // Reduced motion: no intro, no depth. Mobile still needs its second
          // beat, so it becomes a plain scroll-linked crossfade.
          // ---------------------------------------------------------------
          if (!motion) {
            if (desktop) {
              gsap.set(reputation, { clipPath: insetFor(SEAM) });
              return;
            }
            gsap.set(reputation, { clipPath: "none" });
            gsap
              .timeline({
                defaults: { ease: "none" },
                scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: true },
              })
              .to(q("[data-copy='mines']"), { autoAlpha: 0, duration: 0.3 }, 0.2)
              .fromTo(reputation, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0.3)
              .fromTo(q("[data-copy='reputation']"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.5)
              // Rest fully revealed for the last stretch of the scene.
              .to({}, { duration: 0.25 });
            return;
          }

          // ---------------------------------------------------------------
          // Intro — plays as the preloader lifts.
          // ---------------------------------------------------------------
          const minesSplits = q("[data-copy='mines'] [data-split]").map((el) =>
            SplitText.create(el, SPLIT),
          );
          const repSplits = q("[data-copy='reputation'] [data-split]").map(
            (el) => SplitText.create(el, SPLIT),
          );
          const minesLines = minesSplits.flatMap((s) => s.lines);
          const repLines = repSplits.flatMap((s) => s.lines);
          const revertSplits = () =>
            [...minesSplits, ...repSplits].forEach((s) => s.revert());
          const header = document.querySelector("[data-header-bar]");

          gsap.set(reputation, { clipPath: desktop ? insetFor(SEAM) : wipe(0) });

          const intro = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
          intro
            .fromTo(
              q("[data-panel='mines']"),
              { clipPath: "inset(0% 0% 100% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" },
              0,
            )
            .from(q("[data-panel='mines'] [data-zoom]"), { scale: 1.35, duration: 2.6 }, 0)
            .from(minesLines, { yPercent: 115, rotate: 2, transformOrigin: "0% 100%", duration: 1.3, stagger: 0.1 }, 0.75)
            .from(q("[data-cta]"), { autoAlpha: 0, y: 24, duration: 1.1 }, 1.35)
            .from(q("[data-seam] [data-rail]"), { autoAlpha: 0, scaleY: 0, transformOrigin: "50% 0%", duration: 1.1 }, 1.4)
            .from(q("[data-cross-half='top']"), { x: 10, y: -10, autoAlpha: 0, duration: 1.2 }, 1.5)
            .from(q("[data-cross-half='bottom']"), { x: -10, y: 10, autoAlpha: 0, duration: 1.2 }, 1.5);
          if (header) intro.from(header, { y: -24, autoAlpha: 0, duration: 1.2 }, 0.9);

          if (desktop) {
            intro
              .fromTo(
                reputation,
                { clipPath: insetFor(100) },
                { clipPath: insetFor(SEAM), duration: 1.5, ease: "expo.inOut" },
                0.2,
              )
              .from(q("[data-panel='reputation'] [data-zoom]"), { scale: 1.35, duration: 2.6 }, 0.2)
              .from(repLines, { yPercent: 115, rotate: 2, transformOrigin: "0% 100%", duration: 1.2, stagger: 0.08 }, 1.05)
              .from(q("[data-copy='reputation'] [data-fade]"), { autoAlpha: 0, y: 18, duration: 1.1 }, 1.25)
              .from(
                q("[data-copy='reputation'] [data-pattern-unit]"),
                { autoAlpha: 0, yPercent: 60, rotate: -12, transformOrigin: "50% 50%", duration: 0.9, stagger: 0.05, ease: "power3.out" },
                1.3,
              )
              // Lines are only needed for the entrance; unsplit so the copy
              // re-wraps naturally on resize.
              .eventCallback("onComplete", revertSplits);
          }

          const cancelReady = whenPageReady(() => intro.play());

          if (desktop) {
            // -------------------------------------------------------------
            // Desktop: pointer-reactive seam + depth, scroll-out parallax.
            // -------------------------------------------------------------
            const seam = { value: SEAM };
            const setSeam = gsap.quickTo(seam, "value", {
              duration: 1.4,
              ease: "power3.out",
              onUpdate: () => {
                // Leave the clip to the intro until its wipe has landed.
                if (intro.progress() > 0.6) reputation.style.clipPath = insetFor(seam.value);
              },
            });
            const depth = q("[data-depth]").map((el) => ({
              k: Number((el as HTMLElement).dataset.depth),
              x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }),
              y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }),
            }));
            const fine = window.matchMedia("(pointer: fine)").matches;
            const onMove = (e: PointerEvent) => {
              if (!fine) return;
              const r = section.getBoundingClientRect();
              const nx = (e.clientX - r.left) / r.width - 0.5;
              const ny = (e.clientY - r.top) / r.height - 0.5;
              setSeam(SEAM - nx * 6);
              depth.forEach((d) => {
                d.x(nx * d.k);
                d.y(ny * d.k);
              });
            };
            const onLeave = () => {
              setSeam(SEAM);
              depth.forEach((d) => {
                d.x(0);
                d.y(0);
              });
            };
            section.addEventListener("pointermove", onMove);
            section.addEventListener("pointerleave", onLeave);

            gsap
              .timeline({
                defaults: { ease: "none" },
                scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
              })
              .to(q("[data-scroll-layer]"), { yPercent: 16 }, 0)
              .to(q("[data-copy='mines']"), { yPercent: -45 }, 0)
              .to(q("[data-copy='reputation']"), { yPercent: -70 }, 0)
              .to(q("[data-cta]"), { yPercent: -140 }, 0)
              .to(q("[data-shade]"), { opacity: 0.7 }, 0);

            return () => {
              cancelReady();
              section.removeEventListener("pointermove", onMove);
              section.removeEventListener("pointerleave", onLeave);
              revertSplits();
            };
          }

          // ---------------------------------------------------------------
          // Mobile: the two-beat scroll scene on the sticky stage.
          // ---------------------------------------------------------------
          const reveal = { p: 0 };
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.8 },
            })
            .to(q("[data-copy='mines']"), { y: -60, autoAlpha: 0, duration: 0.4 }, 0.05)
            .to(q("[data-panel='mines'] [data-scroll-layer]"), { scale: 1.15, yPercent: -6, duration: 0.8 }, 0)
            .to(
              reveal,
              {
                p: 1,
                duration: 0.6,
                ease: "power2.inOut",
                onUpdate: () => {
                  reputation.style.clipPath = wipe(reveal.p);
                },
              },
              0.15,
            )
            .fromTo(q("[data-panel='reputation'] [data-scroll-layer]"), { scale: 1.25 }, { scale: 1, duration: 0.75 }, 0.15)
            .fromTo(q("[data-copy='reputation']"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 0.52)
            .from(repLines, { yPercent: 115, duration: 0.25, stagger: 0.04 }, 0.55)
            .from(q("[data-copy='reputation'] [data-fade]"), { autoAlpha: 0, y: 24, duration: 0.25 }, 0.62)
            .from(q("[data-copy='reputation'] [data-pattern-unit]"), { autoAlpha: 0, yPercent: 60, duration: 0.2, stagger: 0.02 }, 0.66)
            // Rest fully revealed for the last stretch of the scene.
            .to({}, { duration: 0.2 });

          return () => {
            cancelReady();
            revertSplits();
          };
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  const scrollOn = () => {
    const next = root.current?.nextElementSibling;
    if (next instanceof HTMLElement) scrollToTarget(next);
  };

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="bg-dark relative h-[200svh] lg:h-auto"
    >
      <div className="sticky top-0 flex h-svh min-h-120 flex-col overflow-hidden lg:relative lg:min-h-160">
        {/* ---- Rock panel ---------------------------------------------- */}
        <div data-panel="mines" className="absolute inset-0 overflow-hidden lg:right-[35%]">
          <div data-scroll-layer className="absolute inset-x-0 inset-y-[-6%]">
            <div data-depth="-14" className="absolute -inset-4">
              <div data-zoom className="absolute inset-0">
                <div className="animate-hero-breathe absolute inset-0">
                  <Image
                    src="/images/home/hero-mines.webp"
                    alt=""
                    fill
                    preload
                    sizes="(min-width: 1024px) 65vw, 100vw"
                    className="object-cover object-[72%_50%] lg:object-[60%_50%]"
                  />
                </div>
              </div>
            </div>
          </div>
          <RainCanvas className="absolute inset-0 h-full w-full" />
          <div
            aria-hidden="true"
            className="from-dark/55 via-dark/10 to-dark/70 lg:from-dark/30 lg:to-dark/40 absolute inset-0 bg-linear-to-b lg:via-transparent"
          />
        </div>

        {/* ---- Forest panel -------------------------------------------- */}
        <div
          data-panel="reputation"
          className="absolute inset-0 overflow-hidden [clip-path:polygon(0%_100%,100%_100%,100%_100%,0%_100%)] lg:left-[55%] lg:[clip-path:inset(0%_0%_0%_11.11%)]"
        >
          <div data-scroll-layer className="absolute inset-x-0 inset-y-[-6%]">
            <div data-depth="-22" className="absolute -inset-4">
              <div data-zoom className="absolute inset-0">
                <div className="animate-hero-breathe-alt absolute inset-0">
                  <Image
                    src="/images/home/hero-reputation.webp"
                    alt=""
                    fill
                    loading="eager"
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover object-[40%_50%]"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="from-dark/45 via-dark/25 to-dark/65 lg:from-dark/20 lg:via-dark/10 lg:to-dark/45 absolute inset-0 bg-linear-to-b"
          />
        </div>

        {/* Deepens as the hero scrolls away (desktop). */}
        <div data-shade aria-hidden="true" className="bg-dark pointer-events-none absolute inset-0 opacity-0" />

        {/* ---- Copy ------------------------------------------------------
            Mobile: a flex column (copy stack, CTA, marker) so nothing
            collides on short phones. Desktop: `lg:contents` dissolves the
            wrappers and each block is placed on the stage as designed. */}
        <div className="short:pt-24 relative z-10 flex flex-1 flex-col px-6 pt-[max(6.75rem,15svh)] pb-[4svh] min-[380px]:px-[11vw] lg:contents">
          <div className="grid flex-1 lg:contents">
            <div
              data-copy="mines"
              className="col-start-1 row-start-1 self-start lg:absolute lg:top-[22.5%] lg:left-[10.75%]"
            >
              <div data-depth="6">
                <h1
                  id="hero-title"
                  className="font-display text-grey-light text-[clamp(1.9rem,9.6vw,3.4rem)] leading-[1.02] lg:text-[clamp(3rem,4.45vw,6.4rem)] lg:leading-[0.98]"
                >
                  <span data-split className="text-gold block">
                    {strings.titleLead}
                  </span>{" "}
                  {/* One span per forced line: SplitText normalises "\n"
                      away, so the designed break must be structural. */}
                  {strings.titleRest.split("\n").map((line, i) => (
                    <Fragment key={i}>
                      {i > 0 && " "}
                      <span data-split className="block">
                        {line}
                      </span>
                    </Fragment>
                  ))}
                  {/* The right-hand statement completes the headline for
                      assistive tech; its visual twin is aria-hidden. */}
                  <span className="sr-only">
                    {" "}
                    {strings.statementLead} {strings.statementRest}
                  </span>
                </h1>
              </div>
            </div>

            <div
              data-copy="reputation"
              className="short:pt-0 col-start-1 row-start-1 self-center pt-[6svh] max-lg:invisible max-lg:opacity-0 lg:absolute lg:top-[49.5%] lg:left-[67.9%] lg:w-[27%] lg:max-w-120 lg:pt-0 xl:w-[24%]"
            >
              <div data-depth="9">
                <p
                  aria-hidden="true"
                  className="font-display text-[clamp(1.55rem,6.4vw,2.2rem)] leading-[1.05] lg:text-[clamp(1.55rem,2.1vw,2.8rem)]"
                >
                  <span data-split className="text-gold block">
                    {strings.statementLead}
                  </span>
                  <span data-split className="text-grey-light block">
                    {strings.statementRest}
                  </span>
                </p>
                <p
                  data-fade
                  className="text-grey-light/90 mt-5 max-w-[26rem] text-[0.95rem] leading-relaxed text-pretty lg:mt-[1.1vw] lg:text-[clamp(0.9rem,0.95vw,1.15rem)] lg:leading-[1.3]"
                >
                  {strings.description}
                </p>
                <PatternStrip
                  units={6}
                  reveal="none"
                  className="short:max-lg:hidden mt-6 h-7 w-auto lg:mt-[2vw] lg:h-[3.4vw] lg:max-h-12"
                />
              </div>
            </div>
          </div>

          <div
            data-cta
            className="short:max-lg:mt-5 mt-8 flex justify-center lg:absolute lg:bottom-[9%] lg:left-[67.9%] lg:mt-0"
          >
            <GlassLink href="/expertise">{strings.cta}</GlassLink>
          </div>

          <SeamMarker
            progressOf={root}
            start="top top"
            end="bottom top"
            onActivate={scrollOn}
            label={strings.scrollHint}
            compactWhenShort
            className="mt-[5svh] self-center lg:absolute lg:bottom-[4.5%] lg:left-[60%] lg:mt-0 lg:-translate-x-1/2"
          />
        </div>
      </div>
    </section>
  );
}
