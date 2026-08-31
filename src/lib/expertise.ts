/**
 * The six expertise areas.
 *
 * Content lives in the message files rather than Sanity: the `expertise`
 * document type is single-language (title/slug/description), and these pages
 * need EN and FR. Sanity `expertise` documents still exist so posts can be
 * tagged — `sanitySlug` is what `relatedExpertise` is matched against, so it
 * must equal the slug on the corresponding Sanity document.
 */
export const EXPERTISE_AREAS = [
  { key: "crisis", slug: "crisis-communication" },
  { key: "media", slug: "media-relations" },
  { key: "esg", slug: "esg-csr" },
  { key: "community", slug: "community-relations" },
  { key: "financial", slug: "financial-communication" },
  { key: "digital", slug: "digital-reputation" },
] as const;

export type ExpertiseKey = (typeof EXPERTISE_AREAS)[number]["key"];

export function areaBySlug(slug: string) {
  return EXPERTISE_AREAS.find((a) => a.slug === slug);
}
