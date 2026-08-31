import { defineField, defineType } from "sanity";

/**
 * Singleton for site-level copy that editors need to control but that isn't a
 * post. Every field is optional — anything left blank falls back to the
 * translation files, so the site never renders an empty slot.
 */
export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",

  fields: [
    defineField({
      name: "voices",
      title: "Mining Voices section",
      description:
        "Homepage video series block. Leave blank to use the built-in wording.",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "label", title: "Label", type: "localeString" }),
        defineField({ name: "heading", title: "Heading", type: "localeString" }),
        defineField({ name: "text", title: "Paragraph", type: "localeText" }),
      ],
    }),
  ],

  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
