"use client";

import type Lenis from "lenis";

/**
 * Shared smooth-scroll state.
 *
 * Lenis is created once by <SmoothScroll /> and parked here so anything that
 * needs to lock or drive the page (menus, dialogs, the hero's scroll cue) can
 * reach it without prop-drilling or a context re-render.
 */
let lenis: Lenis | null = null;
let locks = 0;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
  // A lock taken before Lenis existed (the preloader runs first) still holds.
  if (lenis && locks > 0) lenis.stop();
}

export function getLenis() {
  return lenis;
}

/**
 * Freeze page scrolling. Reference-counted, so a dialog opened from inside
 * the mobile menu (or the preloader) does not unlock the page when it closes.
 *
 * Both halves matter: overflow on <html> (the element that owns the viewport
 * scrollbar) stops touch and native scrolling, and stopping Lenis stops the
 * wheel, which Lenis would otherwise keep turning into programmatic scrolls.
 */
export function lockScroll() {
  locks += 1;
  if (locks === 1) {
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();
  }
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    document.documentElement.style.overflow = "";
    lenis?.start();
  }
}

/** Smooth-scroll to an element or offset, falling back to native scrolling. */
export function scrollToTarget(target: HTMLElement | number) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4 });
    return;
  }
  const top =
    typeof target === "number"
      ? target
      : target.getBoundingClientRect().top + window.scrollY;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
}

/**
 * Run `cb` once the preloader has started leaving (immediately if there is no
 * preloader, e.g. after client-side navigation). Intro animations hang off
 * this so they play as the curtain lifts rather than behind it.
 *
 * Returns a cleanup that cancels a still-pending callback.
 */
export function whenPageReady(cb: () => void) {
  const html = document.documentElement;
  if (!html.hasAttribute("data-preloading")) {
    cb();
    return () => {};
  }
  const observer = new MutationObserver(() => {
    if (!html.hasAttribute("data-preloading")) {
      observer.disconnect();
      cb();
    }
  });
  observer.observe(html, {
    attributes: true,
    attributeFilter: ["data-preloading"],
  });
  return () => observer.disconnect();
}
