import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Posts migrated 1:1 from Jekyll `_posts`. Content is untouched GFM Markdown.
// Unknown legacy keys (layout, header-style, nav-style, …) are ignored by Zod.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    subtitle: z.string().optional(),
    author: z.string().optional(),
    tags: z
      .union([z.array(z.string()), z.string().transform((s) => [s])])
      .default([]),
    "header-img": z.string().optional(),
    "header-mask": z.number().optional(),
    mathjax: z.boolean().optional(),
  }),
});

export const collections = { blog };
