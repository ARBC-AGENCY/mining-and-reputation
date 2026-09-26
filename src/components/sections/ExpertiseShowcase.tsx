"use client";

import { useEffect, useEffectEvent, useId, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { CrossMark, PatternStrip } from "@/components/brand/Pattern";
import { RAIL } from "@/components/brand/SeamMarker";
import { useParallax } from "@/components/motion/Parallax";
import { SplitLines } from "@/components/motion/SplitLines";
import { Link } from "@/i18n/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

export type ShowcaseSlide = {
  title: string;
  text: string;
  image: string;
  href: string;
  /** Screen-reader position, e.g. "2 of 6". */
  position: string;
};

export type ShowcaseStrings = {
  headingLead: string;
  headingRest: string;
  intro: string;
  /** In-card link label. */
  cardLink: string;
  /** Accessible name of the carousel. */
  label: string;
  previous: string;
  next: string;
  pause: string;
  play: string;
};

type Props = {
  slides: ShowcaseSlide[];
  strings: ShowcaseStrings;
  /**
   * "home" — design p.14: title-led cards, dark subheading, section h2.
   * "page" — design p.16: numbered cards, light subheading, the page's h1.
   */
  variant?: "home" | "page";
};

/** Seconds each card holds while autoplaying. */
const HOLD = 6.5;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The one-sided rounded card carousel on the green gradient (design p.14 on
 * the home page, p.16 as the expertise page hero; mobile p.19).
 *
 * Each expertise is a card; the vertical dots on the seam are its tab list.
 * Ways to move: the tabs (click, or arrow keys / Home / End once focused),
 * the previous/next buttons, or a horizontal swipe / drag on the card.
 *
 * Autoplay (after the WAI-ARIA APG carousel pattern) advances every HOLD
 * seconds with a fill in the active pill. It holds while the card is hovered,
 * off-screen or in a background tab; it stops on any manual navigation or when
 * keyboard focus enters; the visible toggle restarts it (WCAG 2.2.2); and it
 * is off by default under prefers-reduced-motion.
 */
export function ExpertiseShowcase({ slides, strings, variant = "home" }: Props) {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const count = slides.length;

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const transition = useRef<gsap.core.Timeline | null>(null);

  // `null` until the visitor chooses; the default then follows their
  // motion preference.
  const reducedMotion = useReducedMotion();
  const [playChoice, setPlayChoice] = useState<boolean | null>(null);
  const playing = playChoice ?? !reducedMotion;
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const running = playing && inView && !hovering && pageVisible;
  const countdown = useRef<gsap.core.Tween | null>(null);

  useParallax(root);

  // ---------------------------------------------------------------------
  // Slide transition
  // ---------------------------------------------------------------------
  const go = (target: number, direction?: 1 | -1, fromUser = true) => {
    const next = ((target % count) + count) % count;
    const current = activeRef.current;
    if (fromUser) setPlayChoice(false);
    if (next === current || !frame.current) return;

    const dir = direction ?? (next > current ? 1 : -1);
    const els = Array.from(
      frame.current.querySelectorAll<HTMLElement>("[data-slide]"),
    );
    const from = els[current];
    const to = els[next];

    // Land any in-flight transition first so states never interleave.
    transition.current?.progress(1);

    gsap.set(els, { zIndex: 0 });
    gsap.set(from, { zIndex: 1 });
    gsap.set(to, { zIndex: 2, autoAlpha: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(from, { autoAlpha: 0 });
      },
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tl.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: "none" });
    } else {
      const img = (el: HTMLElement) => el.querySelector("[data-slide-img]");
      const bits = (el: HTMLElement) => el.querySelectorAll("[data-slide-anim]");
      tl.fromTo(
        to,
        { clipPath: dir > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15, ease: "expo.inOut" },
        0,
      )
        .fromTo(
          img(to),
          { scale: 1.28, yPercent: dir * 10 },
          { scale: 1, yPercent: 0, duration: 1.6, ease: "expo.out" },
          0.1,
        )
        .to(img(from), { scale: 1.1, yPercent: -dir * 8, duration: 1.15, ease: "expo.inOut" }, 0)
        .to(bits(from), { autoAlpha: 0, y: -dir * 24, duration: 0.45, ease: "power2.in", stagger: 0.03 }, 0)
        .fromTo(
          bits(to),
          { autoAlpha: 0, y: dir * 36 },
          { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.08 },
          0.6,
        )
        // Reset the outgoing slide for the next time it comes round.
        .set(img(from), { scale: 1, yPercent: 0 })
        .set(bits(from), { autoAlpha: 1, y: 0 });
    }

    transition.current = tl;
    activeRef.current = next;
    setActive(next);
  };

  // ---------------------------------------------------------------------
  // Autoplay
  // ---------------------------------------------------------------------
  const advance = useEffectEvent(() => go(activeRef.current + 1, 1, false));

  useEffect(() => {
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    if (frame.current) io.observe(frame.current);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
    };
  }, []);

  // A fresh countdown for every card, drawn into the active pill.
  useEffect(() => {
    const state = { p: 0 };
    const tween = gsap.to(state, {
      p: 1,
      duration: HOLD,
      ease: "none",
      paused: true,
      onUpdate: () => {
        const fill = root.current?.querySelector<HTMLElement>(
          `[data-rail-fill="${active}"]`,
        );
        if (fill) fill.style.transform = `scaleY(${state.p})`;
      },
      onComplete: advance,
    });
    countdown.current = tween;
    return () => {
      tween.kill();
    };
  }, [active]);

  useEffect(() => {
    const tween = countdown.current;
    if (!tween) return;
    if (running) tween.play();
    else tween.pause();
    // Not playing: show the active pill solid rather than part-filled.
    if (!playing) {
      const fill = root.current?.querySelector<HTMLElement>(
        `[data-rail-fill="${active}"]`,
      );
      if (fill) fill.style.transform = "scaleY(1)";
    }
  }, [running, playing, active]);

  // ---------------------------------------------------------------------
  // Entrance: card rises in, pattern shards stagger, rail and mark settle.
  // ---------------------------------------------------------------------
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: frame.current, start: "top 85%", once: true },
          })
          .from(frame.current, { y: 80, autoAlpha: 0, duration: 1.4 }, 0)
          .from("[data-slide]:first-child [data-slide-img]", { scale: 1.25, duration: 2 }, 0)
          .from(
            "[data-card-pattern] [data-pattern-unit]",
            { autoAlpha: 0, yPercent: 70, rotate: -14, transformOrigin: "50% 50%", duration: 0.9, stagger: 0.04, ease: "power3.out" },
            0.35,
          )
          .from("[data-slide]:first-child [data-slide-anim]", { autoAlpha: 0, y: 30, duration: 1, stagger: 0.08 }, 0.45)
          .from("[data-controls] > *", { autoAlpha: 0, y: 16, duration: 0.9, stagger: 0.06 }, 0.5)
          .from("[data-rail-tabs]", { autoAlpha: 0, scaleY: 0, transformOrigin: "50% 0%", duration: 1 }, 0.6)
          .from("[data-cross-half='top']", { x: 10, y: -10, autoAlpha: 0, duration: 1.1 }, 0.75)
          .from("[data-cross-half='bottom']", { x: -10, y: 10, autoAlpha: 0, duration: 1.1 }, 0.75);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // ---------------------------------------------------------------------
  // Swipe / drag on the card
  // ---------------------------------------------------------------------
  const drag = useRef<{ x: number; y: number; id: number } | null>(null);
  const swiped = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    swiped.current = false;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const start = drag.current;
    drag.current = null;
    if (!start || start.id !== e.pointerId) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      swiped.current = true;
      go(activeRef.current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    }
  };
  // A drag that ends on the card link must not also follow it.
  const onClickCapture = (e: React.MouseEvent) => {
    if (swiped.current) {
      e.preventDefault();
      e.stopPropagation();
      swiped.current = false;
    }
  };

  // ---------------------------------------------------------------------
  // Keyboard
  // ---------------------------------------------------------------------
  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const map: Record<string, number> = {
      ArrowDown: i + 1,
      ArrowRight: i + 1,
      ArrowUp: i - 1,
      ArrowLeft: i - 1,
      Home: 0,
      End: count - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = ((map[e.key] % count) + count) % count;
    go(next);
    tabRefs.current[next]?.focus();
  };

  // Keyboard focus arriving anywhere in the carousel stops rotation — except
  // on the toggle itself, which is how rotation is restarted.
  const onFocusIn = (e: React.FocusEvent) => {
    const target = e.target as HTMLElement;
    if (target.dataset.playToggle !== undefined) return;
    if (target.matches(":focus-visible")) setPlayChoice(false);
  };

  const isPage = variant === "page";
  const Heading = isPage ? "h1" : "h2";

  const controls = (className: string) => (
    <Controls
      className={className}
      active={active}
      count={count}
      playing={playing}
      strings={strings}
      onPrev={() => go(activeRef.current - 1, -1)}
      onNext={() => go(activeRef.current + 1, 1)}
      onToggle={() => setPlayChoice(!playing)}
    />
  );

  return (
    <section
      ref={root}
      aria-labelledby={`${uid}-heading`}
      className={cn(
        "bg-expertise relative isolate overflow-hidden",
        isPage ? "pt-28 lg:pt-0" : "pt-20 lg:pt-0",
      )}
      onFocus={onFocusIn}
    >
      {/* ---- Rocks: the ledge sits in front of the card, the cliff behind
          the copy. They rise faster than the page (at different rates, for
          depth) but always land on — and stay on — the bottom edge. ----- */}
      <div
        aria-hidden="true"
        data-rise="0.16"
        className="pointer-events-none absolute right-0 bottom-[-6%] z-0 w-[30%] max-w-xl sm:w-[26%] lg:w-[23.5%]"
      >
        <Image
          src="/images/home/rock-cliff.webp"
          alt=""
          width={1100}
          height={1651}
          sizes="(min-width: 1024px) 24vw, 30vw"
          className="h-auto w-full"
        />
      </div>
      <div
        aria-hidden="true"
        data-rise="0.28"
        className="pointer-events-none absolute bottom-[-4%] left-0 z-20 w-[40%] max-w-184 sm:w-[34%] lg:w-[37.5%]"
      >
        <Image
          src="/images/home/rock-ledge.webp"
          alt=""
          width={1600}
          height={718}
          sizes="(min-width: 1024px) 38vw, 40vw"
          className="h-auto w-full drop-shadow-[0_-10px_30px_rgba(5,25,26,0.25)]"
        />
      </div>

      <div
        className={cn(
          "relative z-10 flex flex-col px-6 pb-20 sm:px-10 lg:min-h-svh lg:flex-row lg:px-0 lg:pb-[7vh]",
          // The page hero carries a longer heading and intro; start higher
          // so the rail and mark still land above the fold (as on p.16).
          isPage ? "lg:pt-[max(7.5rem,20vh)]" : "lg:pt-[max(7.5rem,23.5vh)]",
        )}
      >
        {/* ---- Copy column. Mobile: `contents`, so its two blocks join the
            outer flex order (copy → card → rail). Desktop: a column right of
            the card, the rail centred on its left edge = the 60% seam. ---- */}
        <div className="contents lg:order-2 lg:ml-[2.7%] lg:flex lg:w-[36%] lg:max-w-160 lg:flex-col xl:w-[30%]">
          <div className="order-1">
            <SplitLines
              as={Heading}
              id={`${uid}-heading`}
              className="font-display [text-shadow:0_2px_24px_rgb(5_25_26/0.12)]"
            >
              <span
                data-split
                className="text-gold block text-[clamp(2.5rem,10vw,3.6rem)] leading-[1.02] lg:text-[clamp(2.2rem,3.35vw,4.7rem)]"
              >
                {strings.headingLead}
              </span>{" "}
              <span
                data-split
                className={cn(
                  "mt-1 block",
                  isPage
                    ? "text-grey-light text-[clamp(1.7rem,6.6vw,2.4rem)] lg:max-w-[11.5em] lg:text-[clamp(1.8rem,2.55vw,3.6rem)]"
                    : "text-dark text-[clamp(1.45rem,5.8vw,2rem)] lg:max-w-[12.4em] lg:text-[clamp(1.5rem,1.85vw,2.6rem)]",
                  // After the sizes: tailwind-merge drops a leading-* that
                  // precedes a font-size class.
                  "leading-[1.08]",
                )}
              >
                {strings.headingRest}
              </span>
            </SplitLines>

            <p
              className={cn(
                "text-dark/85 mt-6 max-w-136 text-base leading-relaxed text-pretty lg:mt-[2.2vw] lg:text-[clamp(0.95rem,0.95vw,1.2rem)]",
                isPage ? "lg:leading-[1.62]" : "lg:leading-normal",
              )}
            >
              {strings.intro}
            </p>

            {controls("mt-8 hidden lg:flex xl:mt-10")}
          </div>

          <div className="order-3 mt-12 flex flex-col items-center gap-8 lg:mt-[clamp(2rem,6vh,5rem)] lg:-translate-x-1/2 lg:self-start">
            <div
              data-rail-tabs
              role="tablist"
              aria-orientation="vertical"
              aria-label={strings.label}
              className={cn(RAIL.track, "bg-dark/8 gap-0 px-0.5 py-1.5")}
            >
              {slides.map((slide, i) => {
                const selected = i === active;
                return (
                  <button
                    key={slide.href + i}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    id={`${uid}-tab-${i}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`${uid}-slide-${i}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => go(i)}
                    onKeyDown={(e) => onTabKey(e, i)}
                    className="group/tab focus-visible:outline-dark relative grid size-6 cursor-pointer place-items-center rounded-full focus-visible:outline-2"
                  >
                    <span className="sr-only">{slide.title}</span>
                    {selected ? (
                      <span
                        aria-hidden="true"
                        className={cn(RAIL.pill, "bg-gold/35 relative overflow-hidden")}
                      >
                        <span
                          data-rail-fill={i}
                          className="bg-gold absolute inset-0 origin-top scale-y-0"
                        />
                      </span>
                    ) : (
                      <span
                        aria-hidden="true"
                        className={cn(RAIL.dot, "transition-transform duration-300 group-hover/tab:scale-150")}
                      />
                    )}
                    {/* Hover/focus label, desktop only. */}
                    <span
                      aria-hidden="true"
                      className="bg-dark font-display pointer-events-none absolute top-1/2 left-full ml-3 hidden -translate-x-1 -translate-y-1/2 rounded-lg px-3 py-1.5 text-xs whitespace-nowrap text-white opacity-0 transition-[opacity,translate] duration-300 group-hover/tab:translate-x-0 group-hover/tab:opacity-100 group-focus-visible/tab:translate-x-0 group-focus-visible/tab:opacity-100 lg:block"
                    >
                      {slide.title}
                    </span>
                  </button>
                );
              })}
            </div>
            <CrossMark className="h-auto w-12 lg:w-[3.4vw] lg:max-w-16 lg:min-w-11" />
          </div>
        </div>

        {/* ---- Card column ---------------------------------------------- */}
        {/* @container: the card's corner is sized from its width (cqw), so a
            card that grows taller for long copy on a narrow phone keeps the
            designed curve instead of a deeper one that would eat into text. */}
        <div className="@container relative order-2 mt-16 lg:order-1 lg:mt-0 lg:ml-[7.3%] lg:w-1/2 lg:shrink-0 lg:self-start">
          <div
            data-card-pattern
            className="absolute top-0 left-[11.6%] z-10 w-[53.3%] -translate-y-1/2"
          >
            <PatternStrip units={14} reveal="none" className="block h-auto w-full" />
          </div>

          <div
            ref={frame}
            role="region"
            aria-roledescription="carousel"
            aria-label={strings.label}
            className="grid touch-pan-y grid-cols-[minmax(0,1fr)] overflow-hidden rounded-tr-[22.5cqw_25.5cqw] shadow-[-28px_34px_70px_-10px_rgb(5_25_26/0.55)] select-none"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              drag.current = null;
            }}
            onClickCapture={onClickCapture}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") setHovering(true);
            }}
            onPointerLeave={() => setHovering(false)}
          >
            {/* Sets the designed proportion; taller copy can still grow it.
                The explicit minmax(0,1fr) column matters: with an auto track,
                a card made taller by long copy (narrow phones) would feed
                that height back through this aspect ratio into the column
                width, and the copy would lay out wider than the card. */}
            <div aria-hidden="true" className="col-start-1 row-start-1 aspect-[1.418] w-full" />

            <div
              className="col-start-1 row-start-1 grid grid-cols-[minmax(0,1fr)]"
              aria-live={running ? "off" : "polite"}
            >
              {slides.map((slide, i) => (
                <article
                  key={slide.href + i}
                  id={`${uid}-slide-${i}`}
                  data-slide
                  role="tabpanel"
                  aria-roledescription="slide"
                  aria-label={slide.position}
                  inert={i !== active}
                  className={cn(
                    "bg-dark relative col-start-1 row-start-1 flex min-h-full flex-col overflow-hidden",
                    i !== 0 && "invisible opacity-0",
                  )}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <div data-slide-img className="absolute inset-0 will-change-transform">
                      <Image
                        src={slide.image}
                        alt=""
                        fill
                        draggable={false}
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div
                    aria-hidden="true"
                    className="from-dark/85 via-dark/45 absolute inset-0 bg-linear-to-r to-transparent"
                  />
                  <div
                    aria-hidden="true"
                    className="from-dark/70 absolute inset-0 bg-linear-to-t via-transparent to-transparent"
                  />
                  {/* Below lg the copy runs the full card width, over the
                      photo's bright side too — even the whole card out. */}
                  <div aria-hidden="true" className="bg-dark/40 absolute inset-0 lg:hidden" />

                  <div
                    className={cn(
                      "relative flex flex-1 flex-col px-6 pt-8 pb-6 sm:px-9 sm:pt-10 lg:px-[12.9%] lg:pb-[5.5%]",
                      isPage ? "lg:pt-[10%]" : "lg:pt-[12.5%]",
                    )}
                  >
                    {isPage && (
                      <span
                        data-slide-anim
                        aria-hidden="true"
                        className="font-display -mb-2 block text-[clamp(4.5rem,20vw,7rem)] leading-[0.8] text-white/20 lg:mb-[-1.2vw] lg:text-[clamp(6rem,9.8vw,13.5rem)]"
                      >
                        {pad(i + 1)}
                      </span>
                    )}
                    <h3
                      data-slide-anim
                      className="font-display max-w-[16em] text-[clamp(1.3rem,5.4vw,1.7rem)] leading-[1.08] text-balance text-white lg:text-[clamp(1.35rem,1.75vw,2.45rem)]"
                    >
                      {slide.title}
                    </h3>
                    <p
                      data-slide-anim
                      className="mt-3 max-w-96 text-[0.95rem] leading-snug text-pretty text-white/90 lg:mt-[1.1vw] lg:max-w-[48%] lg:text-[clamp(0.95rem,0.95vw,1.2rem)] lg:leading-[1.45]"
                    >
                      {slide.text}
                    </p>
                    <Link
                      data-slide-anim
                      href={slide.href}
                      draggable={false}
                      className="font-display group/link focus-visible:outline-gold hover:text-gold mt-auto inline-flex items-center gap-2 self-start pt-6 text-sm text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 lg:self-end lg:text-[clamp(0.85rem,0.85vw,1.05rem)] xl:ml-[45%] xl:self-auto"
                    >
                      <span className="min-w-0">{strings.cardLink}</span>
                      <ArrowRight
                        aria-hidden="true"
                        className="text-gold size-4 shrink-0 transition-transform duration-500 group-hover/link:translate-x-1"
                      />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {controls("mt-8 flex lg:hidden")}
        </div>
      </div>
    </section>
  );
}

type ControlsProps = {
  className?: string;
  active: number;
  count: number;
  playing: boolean;
  strings: ShowcaseStrings;
  onPrev: () => void;
  onNext: () => void;
  onToggle: () => void;
};

const ROUND =
  "grid size-11 cursor-pointer place-items-center rounded-full border border-dark/20 text-dark transition-colors duration-300 hover:border-dark hover:bg-dark hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark";

function Controls({
  className,
  active,
  count,
  playing,
  strings,
  onPrev,
  onNext,
  onToggle,
}: ControlsProps) {
  return (
    <div data-controls className={cn("items-center gap-3", className)}>
      <button type="button" onClick={onPrev} aria-label={strings.previous} className={ROUND}>
        <ArrowLeft className="size-4" aria-hidden="true" />
      </button>
      <button type="button" onClick={onNext} aria-label={strings.next} className={ROUND}>
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
      <p aria-hidden="true" className="font-display text-dark ml-2 text-sm tabular-nums">
        {pad(active + 1)}
        <span className="text-dark/45"> / {pad(count)}</span>
      </p>
      <button
        type="button"
        data-play-toggle
        onClick={onToggle}
        aria-label={playing ? strings.pause : strings.play}
        className={cn(ROUND, "ml-auto size-10 border-transparent lg:ml-4")}
      >
        {playing ? (
          <Pause className="size-3.5" aria-hidden="true" />
        ) : (
          <Play className="size-3.5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
