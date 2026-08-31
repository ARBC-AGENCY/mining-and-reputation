"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import SpecularButton from "@/components/SpecularButton";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { useHeaderReveal } from "@/components/providers/HeaderRevealProvider";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { gsap, useGSAP } from "@/lib/gsap";

export type HeaderStrings = {
  home: string;
  primary: string;
  language: string;
  openMenu: string;
  closeMenu: string;
  talkToUs: string;
  links: { href: string; label: string }[];
};

/** Matches the SpecularButton's glass treatment so the nav reads as one system. */
const GLASS =
  "rounded-[18px] border border-white/10 bg-white/[0.06] backdrop-blur-xl " +
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.25)]";

export function HeaderShell({ strings }: { strings: HeaderStrings }) {
  const { revealed } = useHeaderReveal();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // usePathname() from @/i18n/navigation is already locale-stripped, so these
  // compare against plain hrefs. Prefix match so /blog/<slug> keeps the
  // "Blog" item lit.
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);

  // Close on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape, and lock the page behind the open panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Staggered open/close.
  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const items = gsap.utils.toArray<HTMLElement>(".mobile-menu-item");

      // Cancel anything in flight. Without this, the close tween's onComplete
      // can land *after* a quick re-open and re-hide the panel, leaving an
      // invisible overlay that still locks scrolling.
      gsap.killTweensOf([panel, ...items]);

      // On mount the panel is already closed via CSS — nothing to animate, and
      // animating here is what schedules the stale onComplete above.
      if (firstRun.current) {
        firstRun.current = false;
        return;
      }

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const d = reduced ? 0 : 1;

      if (open) {
        gsap.set(panel, { visibility: "visible", pointerEvents: "auto" });
        gsap.to(panel, { opacity: 1, duration: 0.28 * d, ease: "power2.out" });
        gsap.fromTo(
          items,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45 * d,
            ease: "power3.out",
            stagger: 0.06 * d,
            delay: 0.06 * d,
          },
        );
      } else {
        gsap.to(items, {
          opacity: 0,
          y: 10,
          duration: 0.18 * d,
          ease: "power2.in",
          stagger: { each: 0.04 * d, from: "end" },
        });
        gsap.to(panel, {
          opacity: 0,
          duration: 0.22 * d,
          delay: 0.08 * d,
          onComplete: () =>
            gsap.set(panel, { visibility: "hidden", pointerEvents: "none" }),
        });
      }
    },
    { dependencies: [open], scope: panelRef },
  );

  return (
    <header
      data-site-header
      // Visual state is driven by CSS (see globals.css) rather than an inline
      // style, so the header can be hidden from the very first server paint on
      // hero pages — an inline style would only apply after hydration and the
      // header would visibly flash in and out.
      data-revealed={revealed ? "true" : "false"}
      // Fixed rather than absolute so the nav stays reachable past the hero.
      className="pointer-events-none fixed inset-x-0 top-0 z-50 transition-opacity duration-700 ease-out"
      inert={!revealed}
      aria-hidden={!revealed}
    >
      {/* relative z-50 keeps the bar above the open panel (z-40) inside the
          header's stacking context — otherwise the panel covers the X and
          the menu can only be closed with Escape, which phones lack. */}
      {/* Mobile: the bar itself is the glass pill, since there is no nav
          pill to carry it. Reset at md, where the nav pill takes over. */}
      <div className="pointer-events-auto relative z-50 mx-4 mt-4 flex items-center justify-between gap-4 rounded-[18px] border border-white/10 bg-white/6 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-xl md:mx-auto md:mt-0 md:max-w-7xl md:rounded-none md:border-0 md:bg-transparent md:px-8 md:py-5 md:shadow-none md:backdrop-blur-none">
        <Link href="/" aria-label={strings.home} className="shrink-0">
          <Image
            src="/images/LOGO-WHITE@600.png"
            alt="Mining &amp; Reputation"
            width={600}
            height={167}
            priority
            className="h-8 w-auto md:h-9"
          />
        </Link>

        <nav
          aria-label={strings.primary}
          className={`hidden items-center gap-1 px-2 py-2 md:flex ${GLASS}`}
        >
          {strings.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-[12px] px-4 py-2 text-sm transition-colors ${
                isActive(link.href)
                  ? "bg-white/10 text-[#F7C15D]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <span className="mx-1 h-5 w-px bg-white/15" aria-hidden="true" />
          <div className="px-2">
            <LocaleSwitcher />
          </div>
        </nav>

        <div className="hidden shrink-0 md:block">
          <SpecularButton
            size="sm"
            radius={18}
            textColor="#E6E6E6"
            lineColor="#F7C15D"
            baseColor="#353F2C"
            tint="#E6E6E6"
            tintOpacity={0.06}
            blur={12}
            onClick={() => router.push("/contact")}
          >
            {strings.talkToUs}
          </SpecularButton>
        </div>

        <div className="md:hidden">
          <SpecularButton
            size="icon"
            radius={14}
            textColor="#E6E6E6"
            lineColor="#F7C15D"
            baseColor="#353F2C"
            tint="#E6E6E6"
            tintOpacity={0.06}
            blur={8}
            onClick={() => setOpen((v) => !v)}
            ariaExpanded={open}
            ariaControls="mobile-menu"
            ariaLabel={open ? strings.closeMenu : strings.openMenu}
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </SpecularButton>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        className="pointer-events-none invisible fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-[#05191A]/95 px-8 opacity-0 backdrop-blur-xl md:hidden"
      >
        {strings.links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            aria-current={isActive(link.href) ? "page" : undefined}
            className={`mobile-menu-item font-display py-3 text-3xl transition-colors ${
              isActive(link.href)
                ? "text-[#F7C15D]"
                : "text-white hover:text-[#F7C15D]"
            }`}
          >
            {link.label}
          </Link>
        ))}

        {/* The CTA joins the list once the nav collapses. */}
        <Link
          href="/contact"
          onClick={() => setOpen(false)}
          aria-current={isActive("/contact") ? "page" : undefined}
          className={`mobile-menu-item mt-6 inline-flex w-fit px-6 py-3 text-base ${
            isActive("/contact") ? "text-[#F7C15D]" : "text-white"
          } ${GLASS}`}
        >
          {strings.talkToUs}
        </Link>

        <div className="mobile-menu-item mt-8 border-t border-white/10 pt-6">
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
