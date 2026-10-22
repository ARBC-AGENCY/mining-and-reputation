import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { EXPERTISE_AREAS } from "@/lib/expertise";
import { openGraphBase } from "@/lib/metadata";
import { SITE_NAME, indexable, siteUrl } from "@/lib/site";
import { organizationAndWebsite } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { SanityLive } from "@/sanity/lib/live";
import { Preloader } from "@/components/preloader/Preloader";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import Script from "next/script";
import "../../globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/** Colours the mobile browser chrome to match the dark brand base. */
export const viewport: Viewport = { themeColor: "#05191A" };

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
      template: `%s | ${SITE_NAME}`,
    },
    description: t("home.description"),
    applicationName: SITE_NAME,
    // Pages that don't set their own openGraph inherit this object — and
    // the branded share image beside this layout (opengraph-image.tsx).
    openGraph: {
      ...openGraphBase(locale as Locale),
      type: "website",
    },
    twitter: { card: "summary_large_image" },
    // Previews, staging and local builds stay out of search results.
    ...(indexable
      ? {}
      : { robots: { index: false, follow: false, nocache: true } }),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Required for static rendering — without it every page opts into dynamic.
  setRequestLocale(locale);

  // The two faces the first screen paints with: fetch them with the HTML
  // instead of after the CSS is parsed (faster headline, less layout shift).
  preload("/fonts/toxigenesis/typodermic-toxigenesisrg-bold.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "",
  });
  preload("/fonts/FivoSansModern/FivoSansModern-Regular.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "",
  });

  const t = await getTranslations({ locale, namespace: "metadata" });
  const tAreas = await getTranslations({ locale, namespace: "expertise" });

  return (
    <html
      lang={locale}
      className="h-full antialiased"
      // The inline script below stamps data-preloading on
      // <html> before hydration, so the client attributes intentionally differ
      // from the server's. Scoped to this element only — children are still
      // hydration-checked as normal.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Locks scrolling before first paint, so the page behind the
            preloader cannot be scrolled while it is up. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{document.documentElement.setAttribute('data-preloading','')}catch(e){}",
          }}
        />
        <JsonLd
          data={organizationAndWebsite({
            description: t("home.description"),
            expertise: EXPERTISE_AREAS.map(({ key }) =>
              tAreas(`areas.${key}.title` as "areas.crisis.title"),
            ),
          })}
        />
        <NextIntlClientProvider>
          <Preloader label={t("preloader.label")} />
          <SmoothScroll />
          {children}
        </NextIntlClientProvider>
        <SanityLive />
      </body>
    </html>
  );
}

