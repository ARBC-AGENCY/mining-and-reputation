import { type SchemaTypeDefinition } from "sanity";
import { postType } from "../documents/post";
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
    postType,
  ],
};
