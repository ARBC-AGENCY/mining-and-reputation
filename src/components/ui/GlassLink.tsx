import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** "dark" for photography and dark panels, "light" for the green panels. */
  tone?: "dark" | "light";
};

/**
 * The frosted pill CTA from the redesign ("Découvrir notre expertise",
 * "Lire notre manifeste").
 *
 * A real link rather than a button + router.push, so it can be opened in a
 * new tab, is prefetched, and is announced as navigation. The hover sheen and
 * arrow nudge are CSS-only.
 */
export function GlassLink({ href, children, className, tone = "dark" }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "group/glass font-display relative isolate inline-flex max-w-full items-center gap-3 overflow-hidden rounded-[14px] border px-5 py-3.5 text-[0.85rem] leading-none tracking-[0.01em] whitespace-nowrap sm:px-6 sm:text-[0.95rem] backdrop-blur-md transition-[background-color,border-color,color] duration-500 ease-out",
        "focus-visible:outline-gold focus-visible:outline-2 focus-visible:outline-offset-4",
        tone === "dark"
          ? "border-white/10 bg-[#0b2527]/55 text-white hover:border-gold/45 hover:bg-[#0b2527]/80"
          : "border-dark/10 bg-dark/10 text-dark hover:border-dark/30 hover:bg-dark/15",
        className,
      )}
    >
      {/* Sheen: a soft band that sweeps across on hover. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/2 -z-10 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/15 to-transparent opacity-0 transition-[translate,opacity] duration-700 ease-out group-hover/glass:translate-x-[300%] group-hover/glass:opacity-100 motion-reduce:hidden"
      />
      {children}
      <ArrowRight
        className="text-gold size-4 shrink-0 transition-transform duration-500 ease-out group-hover/glass:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  );
}
