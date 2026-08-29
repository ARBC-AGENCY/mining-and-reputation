import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";
import { SanityLive } from "@/sanity/lib/live";
import { Preloader } from "@/components/preloader/Preloader";
import "../../globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("home.title"),
      template: `%s · ${t("siteName")}`,
    },
    description: t("home.description"),
    openGraph: {
      siteName: t("siteName"),
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      type: "website",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Required for static rendering — without it every page opts into dynamic.
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "metadata" });

  return (
    <html
      lang={locale}
      className="h-full antialiased"
      // The inline script below stamps data-preloading / data-preloaded on
      // <html> before hydration, so the client attributes intentionally differ
      // from the server's. Scoped to this element only — children are still
      // hydration-checked as normal.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Runs before first paint so repeat visits never flash the preloader. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var d=document.documentElement;" +
              "if(sessionStorage.getItem('mr:preloaded')==='1'){d.setAttribute('data-preloaded','')}" +
              "else{d.setAttribute('data-preloading','')}}catch(e){}",
          }}
        />
        <NextIntlClientProvider>
          <Preloader label={t("preloader.label")} />
          {children}
        </NextIntlClientProvider>
        <SanityLive />
      </body>
    </html>
  );
}

