/**
 * Mining & Reputation — Expert registry.
 *
 * Locale-independent information lives here.
 * Display copy will come from next-intl.
 *
 * Only approved and published experts appear on the website.
 */

export type ExpertId = "thomas" | "commsOfAfrica";

export type Expert = {
  id: ExpertId;
  slug: string;
  name: string;
  image: string;
  imagePosition: string;
  order: number;
  published: boolean;
  profilePublished: boolean;
  featuredOnAbout?: boolean;
  experienceYears?: number;
};

export const EXPERTS: readonly Expert[] = [
  {
    id: "thomas",
    slug: "thomas-daquin-moanang",
    name: "Thomas d'Aquin MOANANG",
    image: "/images/experts/thomas-daquin-moanang.webp",
    imagePosition: "center 25%",
    order: 1,
    published: true,
    profilePublished: true,
    featuredOnAbout: false,
    experienceYears: 15,
  },

  {
    id: "commsOfAfrica",
    slug: "cyril-djami",
    // The name has not yet been supplied.
    // Replace this before enabling publication.
    name: "Cyril DJAMI",
    image: "/images/experts/mining-reputation-crisis-expert.webp",
    imagePosition: "center 28%",
    order: 2,
    featuredOnAbout: true,
    published: true,
    profilePublished: true,
  },
];

/**
 * Experts eligible to appear in the directory.
 */
export function getPublishedExperts(): Expert[] {
  return EXPERTS.filter(
    (expert) => expert.published && expert.name.trim().length > 0,
  ).sort((a, b) => a.order - b.order);
}

/**
 * Find an approved and published expert profile by slug.
 */
export function expertBySlug(slug: string): Expert | undefined {
  return EXPERTS.find(
    (expert) =>
      expert.slug === slug &&
      expert.published &&
      expert.profilePublished &&
      expert.name.trim().length > 0,
  );
}

/**
 * Profiles that can be generated as static routes.
 */
export function getPublishedProfiles(): Expert[] {
  return getPublishedExperts().filter((expert) => expert.profilePublished);
}
