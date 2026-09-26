import { SOCIAL_LINKS } from "./social";
import { ARBC_URL, SITE_NAME, siteUrl } from "./site";

/**
 * schema.org builders for JSON-LD. Stable `@id`s let every page point back at
 * the one Organization and WebSite instead of redefining them.
 */
export const ORG_ID = `${siteUrl}/#organization`;
export const WEBSITE_ID = `${siteUrl}/#website`;

type Json = Record<string, unknown>;

export function organizationAndWebsite({
  description,
  expertise,
}: {
  description: string;
  /** Localised expertise names — become `knowsAbout`. */
  expertise: string[];
}): Json {
  const sameAs = SOCIAL_LINKS.map((s) => s.href).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": ORG_ID,
        name: SITE_NAME,
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/apple-icon.png`,
          width: 180,
          height: 180,
        },
        image: `${siteUrl}/apple-icon.png`,
        description,
        knowsAbout: expertise,
        parentOrganization: {
          "@type": "Organization",
          name: "ARBC Agency",
          url: ARBC_URL,
        },
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: siteUrl,
        name: SITE_NAME,
        inLanguage: ["en", "fr"],
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

/** Home → … → current page. `items` are [name, absolute URL] pairs. */
export function breadcrumbs(items: [string, string][]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, item], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item,
    })),
  };
}

export function service({
  name,
  description,
  url,
  locale,
}: {
  name: string;
  description: string;
  url: string;
  locale: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    inLanguage: locale,
    serviceType: name,
    category: "Strategic communication for the mining industry",
    provider: { "@id": ORG_ID },
  };
}

export function article({
  headline,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
  locale,
}: {
  headline: string;
  description?: string | null;
  url: string;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  author?: string | null;
  locale: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    ...(description ? { description } : {}),
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(image ? { image: [image] } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified || datePublished
      ? { dateModified: dateModified ?? datePublished }
      : {}),
    author: author
      ? { "@type": "Person", name: author }
      : { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: locale,
  };
}
