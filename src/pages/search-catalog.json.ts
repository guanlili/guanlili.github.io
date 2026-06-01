import type { APIContext } from "astro";
import { getPosts } from "../lib/posts";

export async function GET(_context: APIContext) {
  const posts = await getPosts();
  const body = posts.map((p) => ({
    title: p.entry.data.title,
    url: p.route.path,
    tags: p.entry.data.tags.slice(0, 3),
    date: p.entry.data.date.toISOString().slice(0, 10).replace(/-/g, "."),
  }));

  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
