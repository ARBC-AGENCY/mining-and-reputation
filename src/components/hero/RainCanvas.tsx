"use client";

import { useEffect, useRef } from "react";

type Drop = { x: number; y: number; len: number; speed: number; alpha: number };

/** Streak slant, as dx per unit of fall — matches the photograph's rain. */
const SLANT = 0.1;

/**
 * Fine rain over the dark hero panel. The photograph already carries static
 * streaks; animating a sparse layer over it makes the image feel filmed
 * rather than printed.
 *
 * Cheap by construction: a few hundred 1px strokes, DPR capped at 2, and the
 * loop only runs while the canvas is on screen and the tab is visible.
 * Nothing is drawn under prefers-reduced-motion.
 */
export function RainCanvas({
  className,
  /** Drops per CSS pixel of area. */
  density = 0.00007,
}: {
  className?: string;
  density?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let w = 0;
    let h = 0;
    let drops: Drop[] = [];
    let raf = 0;
    let last = 0;
    let onScreen = false;

    const spawn = (anywhere: boolean): Drop => ({
      x: Math.random() * w * 1.15 - w * 0.15,
      y: anywhere ? Math.random() * h : -Math.random() * h * 0.25,
      len: 10 + Math.random() * 26,
      speed: 420 + Math.random() * 520,
      alpha: 0.04 + Math.random() * 0.16,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drops = Array.from({ length: Math.round(w * h * density) }, () =>
        spawn(true),
      );
    };

    const frame = (t: number) => {
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
      last = t;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      for (const d of drops) {
        d.y += d.speed * dt;
        d.x += d.speed * dt * SLANT;
        if (d.y - d.len > h) Object.assign(d, spawn(false));
        ctx.strokeStyle = `rgba(214, 228, 228, ${d.alpha})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.len * SLANT, d.y - d.len);
        ctx.stroke();
      }
      raf = requestAnimationFrame(frame);
    };

    const sync = () => {
      const run = onScreen && document.visibilityState === "visible";
      if (run && !raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    const ro = new ResizeObserver(resize);
    io.observe(canvas);
    ro.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none ${className ?? ""}`}
    />
  );
}
