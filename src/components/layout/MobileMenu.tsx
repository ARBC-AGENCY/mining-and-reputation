"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
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
        aria-label={open ? t("closeMenu") : t("openMenu")}
        className="text-grey-light hover:text-gold -mr-2 p-2 transition-colors"
      >
        {open ? (
          <X className="size-6" aria-hidden="true" />
        ) : (
          <Menu className="size-6" aria-hidden="true" />
        )}
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
