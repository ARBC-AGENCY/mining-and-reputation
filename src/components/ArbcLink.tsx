import type { ReactNode } from "react";
import { ARBC_URL } from "@/lib/site";

/**
 * Renders the ARBC Agency name as a gold external link.
 *
 * Used as the `arbc` chunk handler for `t.rich(...)`, so the brand name stays
 * inside its sentence and translators control where it falls.
 */
export function ArbcLink(chunks: ReactNode) {
  return (
    <a
      href={ARBC_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gold underline decoration-[#F7C15D]/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
    >
      {chunks}
    </a>
  );
}
