"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { lockScroll, setLenis, unlockScroll, whenPageReady } from "@/lib/scroll";

/**
 * Inertial scrolling for the whole site, driven off GSAP's ticker so Lenis
 * and every ScrollTrigger read the same frame — parallax layers stay locked
 * together instead of shimmering against each other.
 *
 * Touch devices keep native scrolling (Lenis default), and Lenis itself
 * disables smoothing under prefers-reduced-motion.
 *
 * Stopping and starting goes exclusively through lockScroll/unlockScroll
 * (see lib/scroll): Lenis's own `autoToggle` rewrites <html> overflow and
 * would fight those locks.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.95,
      anchors: true,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
    });
    setLenis(lenis);

    // The preloader holds the page until it starts to lift. Hold it as an
    // ordinary lock so a menu opened meanwhile is still respected.
    let held = false;
    if (document.documentElement.hasAttribute("data-preloading")) {
      lockScroll();
      held = true;
    }
    const cancelReady = whenPageReady(() => {
      if (held) unlockScroll();
      held = false;
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Web fonts swap in after first layout and shift every trigger position.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      cancelReady();
      if (held) unlockScroll();
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
