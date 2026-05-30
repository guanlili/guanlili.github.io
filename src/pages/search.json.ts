import { getPosts } from "../lib/posts";

// Index consumed by simple-jekyll-search (see hux-blog.js initSearch).
export async function GET() {
  const posts = await getPosts();
  const pad2 = (n: number) => String(n).padStart(2, "0");
  const data = posts.map((p) => {
    const d = p.entry.data.date;
    return {
      title: p.entry.data.title,
      subtitle: p.entry.data.subtitle ?? "",
      url: p.route.path,
      date: `${d.getFullYear()}.${pad2(d.getMonth() + 1)}.${pad2(d.getDate())}`,
      tags: p.entry.data.tags.join(", "),
    };
  });
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
