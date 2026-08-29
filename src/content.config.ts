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
    // Keep unfinished posts in the repository without exposing them in routes,
    // feeds, search, or related-content lists.
    draft: z.boolean().default(false),
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

const footprints = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/footprints" }),
  schema: z.object({
    title: z.string(),
    province: z.string(),
    prefecture: z.string(),
    city: z.string(),
    coordinates: z.tuple([z.number(), z.number()]),
    status: z.enum(["home", "lived", "visited"]).default("visited"),
    since: z.coerce.date().optional(),
    until: z.coerce.date().optional(),
    precision: z.enum(["day", "month", "year"]).default("month"),
    visited: z.array(z.coerce.date()).min(1),
    events: z
      .array(
        z.object({
          date: z.coerce.date(),
          precision: z.enum(["day", "month", "year"]).default("month"),
          title: z.string(),
          note: z.string().optional(),
          href: z.string().optional(),
        }),
      )
      .default([]),
    journeys: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          order: z.number().int().positive(),
          date: z.coerce.date(),
        }),
      )
      .default([]),
    summary: z.string(),
    cover: z.string().optional(),
    photos: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
          caption: z.string().optional(),
          credit: z.string().optional(),
          creditUrl: z.string().optional(),
        }),
      )
      .default([]),
    tags: z.array(z.string()).default([]),
    sample: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, portfolio, footprints };
