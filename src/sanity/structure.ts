import type { StructureResolver } from "sanity/structure";

const FORMATS: { title: string; value: string }[] = [
  { title: "Articles & analyses", value: "article" },
  { title: "Video interviews", value: "interview" },
  { title: "Industry news", value: "news" },
  { title: "Reports & white papers", value: "resource" },
];

/**
 * All four editorial formats share the `post` type, so the Studio splits them
 * back out into separate lists here — editors get a clean per-format view
 * without the schema having to duplicate shared fields four times.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      ...FORMATS.map(({ title, value }) =>
        S.listItem()
          .title(title)
          .id(value)
          .child(
            S.documentList()
              .title(title)
              .filter('_type == "post" && format == $format')
              .params({ format: value })
              // New documents created from this list start in the right format.
              .initialValueTemplates([])
              .canHandleIntent(
                (intentName, params) =>
                  intentName === "edit" ||
                  (params as { template?: string }).template === undefined,
              ),
          ),
      ),

      S.listItem()
        .title("All posts")
        .id("allPosts")
        .child(S.documentTypeList("post").title("All posts")),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (item) => !["post"].includes(item.getId() ?? ""),
      ),
    ]);
