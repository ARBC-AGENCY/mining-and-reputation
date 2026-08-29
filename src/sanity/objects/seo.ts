import { defineField, defineType } from "sanity";

export const seoType = defineType({
  name: "seo",
  title: "SEO",
  type: "object",

  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
    }),

    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "socialImage",
      title: "Social sharing image",
      type: "image",
    }),

    defineField({
      name: "noIndex",
      title: "Prevent search engine indexing",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
