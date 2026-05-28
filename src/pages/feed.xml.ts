import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts } from "../lib/posts";
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
      description: p.entry.data.subtitle ?? "",
      link: p.route.path,
      categories: p.entry.data.tags,
    })),
    customData: `<language>zh-cn</language>`,
  });
}
