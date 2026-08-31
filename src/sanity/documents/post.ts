import { defineField, defineType } from "sanity";

/**
 * Every editorial format lives in this one type.
 *
 * Articles, interviews, sector news and downloadable resources share almost
 * all of their fields, so they share a document type and differ by `format`.
 * That keeps the hub's "All" tab, per-tab filtering and pagination to a single
 * query, and adding a fifth format is one entry in the list below.
 *
 * Format-specific fields are hidden in the Studio unless they apply.
 */
export const FORMATS = [
  { title: "Article & analysis", value: "article" },
  { title: "Video interview", value: "interview" },
  { title: "Industry news", value: "news" },
  { title: "Report / white paper", value: "resource" },
] as const;

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",

  fields: [
    defineField({
      name: "format",
      title: "Format",
      type: "string",
      options: { list: [...FORMATS], layout: "radio" },
      initialValue: "article",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    }),

    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),

    defineField({
      name: "publishedAt",
      title: "Publication date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: "featured",
      title: "Featured",
      description:
        "Shown as the large featured item on the homepage. Only the most recent featured post is used.",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "videoUrl",
      title: "Video URL",
      description: "YouTube or Vimeo link for the interview.",
      type: "url",
      hidden: ({ parent }) => parent?.format !== "interview",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { format?: string } | undefined;
          if (parent?.format !== "interview") return true;
          if (!value) return "A video URL is required for interviews.";
          return /youtube\.com|youtu\.be|vimeo\.com/i.test(value)
            ? true
            : "Only YouTube or Vimeo links are supported.";
        }),
    }),

    defineField({
      name: "file",
      title: "Downloadable file",
      description: "The PDF for a report or white paper.",
      type: "file",
      hidden: ({ parent }) => parent?.format !== "resource",
    }),

    defineField({
      name: "body",
      title: "Content",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),

    defineField({
      name: "relatedExpertise",
      title: "Related expertise",
      description:
        "Drives the cross-links between editorial content and service pages.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "expertise" }] }],
    }),
  ],

  preview: {
    select: { title: "title", format: "format", media: "coverImage" },
    prepare({ title, format, media }) {
      const label = FORMATS.find((f) => f.value === format)?.title ?? format;
      return { title, subtitle: label, media };
    },
  },
});
