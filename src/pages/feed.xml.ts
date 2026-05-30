import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { excerpt, getPosts } from "../lib/posts";
import { SITE } from "../consts";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: SITE.seoTitle,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((p) => ({
      title: p.entry.data.title,
      pubDate: p.entry.data.date,
      author: p.entry.data.author ?? SITE.author,
      description:
        p.entry.data.description ??
        p.entry.data.subtitle ??
        excerpt(p.entry.body ?? "", 180),
      link: p.route.path,
      categories: p.entry.data.tags,
    })),
    customData: [
      `<language>zh-cn</language>`,
      `<managingEditor>${SITE.email} (${SITE.author})</managingEditor>`,
      `<webMaster>${SITE.email} (${SITE.author})</webMaster>`,
    ].join(""),
  });
}
