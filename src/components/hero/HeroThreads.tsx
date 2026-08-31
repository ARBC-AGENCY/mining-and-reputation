"use client";

import { useEffect, useState } from "react";
import WebThreads from "@/components/WebThreads";

/**
 * Gold filaments behind the hero card.
 *
 * Sits inside ScrollExpand's sticky stage, so it reads as light radiating from
 * the resting image and is progressively covered as the frame opens to full
 * bleed — no extra scroll wiring needed.
 *
 * WebThreads has no reduced-motion handling of its own, so this wrapper stops
 * the animation (and the film grain) when the visitor asks for less motion.
 * The threads still render, just still.
 */
export function HeroThreads() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <WebThreads
      // Brand gold, warming toward a pale core at the brightest points.
      color1="#8EB467"
      color2="#8EB467"
      color3="#8EB467"
      speed={reduced ? 0 : 0.16}
      threadCount={7}
      frequency={4.2}
      spread={0.22}
      taper={1.1}
      position={0.5}
      fanMode="center"
      glow={0.022}
      falloff={0.62}
      thickness={1.05}
      brightness={0.55}
      opacity={0.85}
      mirror
      shimmer={!reduced}
      grain={!reduced}
      grainIntensity={0.04}
      mouseInteraction={!reduced}
      mouseStrength={0.28}
    />
  );
}
