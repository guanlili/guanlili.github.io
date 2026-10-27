// Full-text RSS feed: same items as /feed.xml but with rendered HTML bodies.
// Kept as a separate endpoint so existing excerpt-feed subscribers are
// unaffected; readers discover it via the second <link rel="alternate">.
import rss from "@astrojs/rss";
import { render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { APIContext } from "astro";
import { excerpt, getPosts, type LoadedPost } from "../lib/posts";
import { SITE } from "../consts";

const ABSOLUTE = (html: string) =>
  html.replace(/(\s(?:src|href)=")\/(?!\/)/g, `$1${SITE.url}/`);

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const index = i++;
        results[index] = await fn(items[index]);
      }
    }),
  );
  return results;
}

export async function GET(context: APIContext) {
  const posts = await getPosts();
  const container = await AstroContainer.create();

  const items = await mapLimit(posts, 8, async (p: LoadedPost) => {
    let content: string | undefined;
    try {
      const { Content } = await render(p.entry);
      content = ABSOLUTE(await container.renderToString(Content));
    } catch {
      content = undefined; // fall back to the excerpt-only item
    }
    return {
      title: p.entry.data.title,
      pubDate: p.entry.data.date,
      author: p.entry.data.author ?? SITE.author,
      description:
        p.entry.data.description ??
        p.entry.data.subtitle ??
        excerpt(p.entry.body ?? "", 180),
      link: p.route.path,
      categories: p.entry.data.tags,
      ...(content ? { content } : {}),
    };
  });

  return rss({
    title: `${SITE.seoTitle} · 全文 Full-text`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items,
    customData: [
      `<language>zh-cn</language>`,
      `<managingEditor>${SITE.email} (${SITE.author})</managingEditor>`,
      `<webMaster>${SITE.email} (${SITE.author})</webMaster>`,
    ].join(""),
  });
}
