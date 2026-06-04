import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Posts migrated 1:1 from Jekyll `_posts`. Content is untouched GFM Markdown.
// Unknown legacy keys (layout, header-style, nav-style, …) are ignored by Zod.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    description: z.string().optional(),
    subtitle: z.string().optional(),
    author: z.string().optional(),
    tags: z
      .union([z.array(z.string()), z.string().transform((s) => [s])])
      .default([]),
    cover: z.string().optional(),
    "header-img": z.string().optional(),
    "header-mask": z.number().optional(),
    mathjax: z.boolean().optional(),
  }),
});

const portfolio = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/portfolio" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    type: z.string(),
    role: z.string(),
    status: z.string().default("In Progress"),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    impact: z.string().optional(),
    featured: z.boolean().default(false),
    links: z
      .object({
        github: z.string().optional(),
        demo: z.string().optional(),
        article: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = { blog, portfolio };
