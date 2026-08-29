"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";

export type NavLink = {
  href: string;
  label: string;
};

export function MobileMenu({ links }: { links: NavLink[] }) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="text-grey-light text-sm uppercase"
      >
        {open ? t("closeMenu") : t("openMenu")}
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="bg-dark border-green-dark absolute inset-x-0 top-full border-t px-6 py-6"
        >
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-grey-light hover:text-gold font-display text-lg transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-green-dark mt-6 border-t pt-6">
            <LocaleSwitcher />
          </div>
        </div>
      )}
    </div>
  );
}
