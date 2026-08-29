import { type SchemaTypeDefinition } from "sanity";
import { articleType } from "../documents/article";
import { authorType } from "../documents/author";
import { categoryType } from "../documents/category";
import { expertiseType } from "../documents/expertise";
//import { sectorType } from "../documents/sector";
import { seoType } from "../objects/seo";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    seoType,
    categoryType,
    authorType,
    expertiseType,
    // sectorType,
    articleType,
  ],
};
