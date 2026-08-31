"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LOTTIE_SRC = "/animations/preloader.json";
/**
 * Minimum time the preloader stays up, even if the page is ready sooner.
 * Also prevents a sub-300ms flash on fast connections reading as a glitch.
 * Total time on screen is this plus FADE_MS.
 */
const MIN_VISIBLE_MS = 3000;

/**
 * True once the preloader has run for this page load.
 *
 * Module scope is deliberate: it resets on a real page load (refresh, direct
 * entry, hard navigation) but survives client-side navigation, which is
 * exactly the rule wanted here. Switching locale remounts this component
 * because the [locale] segment changes — without this flag, changing language
 * would replay the preloader as though the page had reloaded.
 *
 * Only ever written inside an effect, so server rendering never touches it
 * (module scope is shared across requests on the server).
 */
let shownThisPageLoad = false;
const FADE_MS = 600;

export function Preloader({ label }: { label: string }) {
  // Server always renders it, so the SSR markup matches on first load. On a
  // client remount (locale switch) the flag is already set, so it starts
  // closed and never flashes.
  const [mounted, setMounted] = useState(() =>
    typeof window === "undefined" ? true : !shownThisPageLoad,
  );
  // Tracks whether *this* instance claimed the flag, so React's dev-mode
  // double effect invocation doesn't hide the preloader on a genuine load.
  const claimed = useRef(false);
  const [leaving, setLeaving] = useState(false);
  const [hasLottie, setHasLottie] = useState<boolean | null>(null);
  const startedAt = useRef(Date.now());

  const dismiss = useCallback(() => {
    const elapsed = Date.now() - startedAt.current;
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);

    window.setTimeout(() => {
      setLeaving(true);
      window.setTimeout(() => setMounted(false), FADE_MS);
    }, wait);
  }, []);

  useEffect(() => {
    // A remount from client-side navigation, not a fresh page load.
    if (shownThisPageLoad && !claimed.current) {
      setMounted(false);
      return;
    }
    claimed.current = true;
    shownThisPageLoad = true;

    document.documentElement.setAttribute("data-preloading", "");

    // Probe for the Lottie so a missing file falls back to the logo mark
    // rather than rendering an empty box.
    const controller = new AbortController();
    fetch(LOTTIE_SRC, { method: "HEAD", signal: controller.signal })
      .then((r) => setHasLottie(r.ok))
      .catch(() => setHasLottie(false));

    if (document.readyState === "complete") {
      dismiss();
      return () => controller.abort();
    }
    window.addEventListener("load", dismiss, { once: true });
    return () => {
      controller.abort();
      window.removeEventListener("load", dismiss);
    };
  }, [dismiss]);

  useEffect(() => {
    if (!mounted) document.documentElement.removeAttribute("data-preloading");
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      data-preloader
      role="status"
      aria-live="polite"
      aria-label={label}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05191A] transition-opacity duration-[600ms] ease-out"
      style={{ opacity: leaving ? 0 : 1 }}
    >
      {hasLottie === true ? (
        <DotLottieReact
          src={LOTTIE_SRC}
          autoplay
          loop
          className="h-40 w-40 md:h-56 md:w-56"
        />
      ) : hasLottie === false ? (
        <Image
          src="/images/LOGO-WHITE@600.png"
          alt=""
          width={600}
          height={167}
          priority
          className="w-40 animate-pulse md:w-56"
        />
      ) : null}
    </div>
  );
}
