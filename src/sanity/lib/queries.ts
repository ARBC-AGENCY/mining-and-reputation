import { defineQuery } from "next-sanity";

/** Fields every hub listing needs. Kept in one place so cards stay consistent. */
const CARD_FIELDS = `
  _id,
  format,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  coverImage,
  videoUrl,
  author->{ name },
  categories[]->{ title, "slug": slug.current }
`;

/** Hub listing. Pass format = null for the "All" tab. */
export const POSTS_QUERY = defineQuery(`
  *[
    _type == "post" &&
    defined(slug.current) &&
    ($format == null || format == $format)
  ]
  | order(publishedAt desc)
  [$from...$to] {
    ${CARD_FIELDS}
  }
`);

/** Total for pagination, matching POSTS_QUERY's filter. */
export const POSTS_COUNT_QUERY = defineQuery(`
  count(*[
    _type == "post" &&
    defined(slug.current) &&
    ($format == null || format == $format)
  ])
`);

/** Homepage: the large featured item, falling back to the newest post. */
export const FEATURED_POST_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && featured == true]
    | order(publishedAt desc)[0] {
    ${CARD_FIELDS}
  }
`);

/** Homepage: the three cards beside the featured item. */
export const RECENT_POSTS_QUERY = defineQuery(`
  *[
    _type == "post" &&
    defined(slug.current) &&
    _id != $excludeId
  ]
  | order(publishedAt desc)[0...4] {
    ${CARD_FIELDS}
  }
`);

/** Homepage: the Mining Voices reel — newest first, for lightbox prev/next. */
export const INTERVIEWS_QUERY = defineQuery(`
  *[_type == "post" && format == "interview" && defined(slug.current)]
    | order(publishedAt desc)[0...8] {
    ${CARD_FIELDS}
  }
`);

/** Homepage: the Mining Voices section. */
export const LATEST_INTERVIEW_QUERY = defineQuery(`
  *[_type == "post" && format == "interview" && defined(slug.current)]
    | order(publishedAt desc)[0] {
    ${CARD_FIELDS}
  }
`);

export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    ${CARD_FIELDS},
    body,
    file{ asset->{ url, originalFilename, size } },
    relatedExpertise[]->{ title, "slug": slug.current }
  }
`);

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)].slug.current
`);
