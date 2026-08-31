import { defineField, defineType } from "sanity";

/**
 * A short string in both site locales.
 *
 * Editorial content (posts) is single-language by design, but site-level
 * chrome like the Mining Voices strapline appears on every locale, so it needs
 * both. Leave a field blank and the app falls back to messages/<locale>.json.
 */
export const localeStringType = defineType({
  name: "localeString",
  title: "Text (EN / FR)",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "string" }),
    defineField({ name: "fr", title: "Français", type: "string" }),
  ],
});

export const localeTextType = defineType({
  name: "localeText",
  title: "Paragraph (EN / FR)",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "text", rows: 3 }),
    defineField({ name: "fr", title: "Français", type: "text", rows: 3 }),
  ],
});
