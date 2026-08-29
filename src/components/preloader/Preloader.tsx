"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LOTTIE_SRC = "/animations/preloader.json";
const SESSION_KEY = "mr:preloaded";
/** Floor stops a sub-300ms flash on fast connections reading as a glitch. */
const MIN_VISIBLE_MS = 1200;
const FADE_MS = 600;

export function Preloader({ label }: { label: string }) {
  // Starts true to match the server render. The inline script in the layout
  // has already hidden this via [data-preloaded] for repeat visits, so there
  // is no flash before this mounts.
  const [mounted, setMounted] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [hasLottie, setHasLottie] = useState<boolean | null>(null);
  const startedAt = useRef(Date.now());

  const dismiss = useCallback(() => {
    const elapsed = Date.now() - startedAt.current;
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);

    window.setTimeout(() => {
      setLeaving(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // Private mode / blocked storage: the preloader simply shows again.
      }
      window.setTimeout(() => setMounted(false), FADE_MS);
    }, wait);
  }, []);

  useEffect(() => {
    // Already seen this session — CSS has it hidden; drop it immediately.
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) {
      setMounted(false);
      return;
    }

    document.documentElement.setAttribute("data-preloading", "");

    // Probe for the Lottie only when we are actually going to show it, so a
    // missing file doesn't 404 on every subsequent navigation.
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
