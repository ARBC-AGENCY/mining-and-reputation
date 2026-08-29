import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu, type NavLink } from "./MobileMenu";

export async function Header() {
  const t = await getTranslations("nav");

  const links: NavLink[] = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/insights", label: t("insights") },
  ];

  return (
    <header className="bg-dark border-green-dark relative border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-gold text-xl tracking-wide">
          Mining Reputation
        </Link>

        <nav aria-label={t("primary")} className="hidden md:block">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-grey-light hover:text-gold text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <LocaleSwitcher />
        </div>

        <MobileMenu links={links} />
      </div>
    </header>
  );
}
