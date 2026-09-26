import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/site";

/**
 * /robots.txt. Production only lets crawlers in; every other deployment
 * (previews, staging, local builds) disallows everything — see `indexable`.
 */
export default function robots(): MetadataRoute.Robots {
  if (!indexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The CMS and form endpoints have nothing to index. Share images are
      // not under /api, so social crawlers can still fetch them.
      disallow: ["/studio", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
