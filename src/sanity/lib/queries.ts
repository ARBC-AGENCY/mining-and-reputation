import { defineQuery } from "next-sanity";

export const ARTICLES_QUERY = defineQuery(`
  *[
    _type == "article" &&
    defined(slug.current)
  ]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage,
    author->{
      name
    },
    categories[]->{
      title,
      "slug": slug.current
    }
  }
`);

export const ARTICLE_QUERY = defineQuery(`
  *[
    _type == "article" &&
    slug.current == $slug
  ][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage,
    body,
    author->{
      name,
      role,
      image
    },
    categories[]->{
      title,
      "slug": slug.current
    },
    relatedExpertise[]->{
      title,
      "slug": slug.current
    }
  }
`);

export const ARTICLE_SLUGS_QUERY = defineQuery(`
  *[
    _type == "article" &&
    defined(slug.current)
  ].slug.current
`);
