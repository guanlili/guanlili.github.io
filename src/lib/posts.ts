import { getCollection, type CollectionEntry } from "astro:content";
import { postRoute, type PostRoute } from "./permalink";

export interface LoadedPost {
  entry: CollectionEntry<"blog">;
  route: PostRoute;
}

// Jekyll only publishes `_posts` files named `YYYY-M-D-title.md`. Mirror that:
// files without a valid date-prefixed name were never live, so we skip them.
const VALID = /^\d{4}-\d{1,2}-\d{1,2}-/;

function isPublished(entry: CollectionEntry<"blog">, now = new Date()): boolean {
  return !entry.data.draft && entry.data.date.getTime() <= now.getTime();
}

function rawName(entry: CollectionEntry<"blog">): string {
  return (entry.filePath ?? entry.id)
    .split("/")
    .pop()!
    .replace(/\.(md|markdown)$/i, "");
}

export async function getPosts(): Promise<LoadedPost[]> {
  const all = await getCollection("blog");
  const posts = all
    .filter((e) => VALID.test(rawName(e)) && isPublished(e))
    .map((entry) => ({ entry, route: postRoute(entry.filePath ?? entry.id) }));
  posts.sort(
    (a, b) => b.entry.data.date.getTime() - a.entry.data.date.getTime(),
  );
  return posts;
}

// Files Jekyll (and therefore this site) does not publish — reported, not built.
export async function getSkippedPosts(): Promise<string[]> {
  const all = await getCollection("blog");
  return all
    .filter((e) => !VALID.test(rawName(e)) || !isPublished(e))
    .map((e) => e.filePath ?? e.id);
}

// Sexagenary (干支) year name, e.g. 2026 → 丙午.
const GAN = "甲乙丙丁戊己庚辛壬癸";
const ZHI = "子丑寅卯辰巳午未申酉戌亥";
export function ganzhi(year: number): string {
  const g = ((year - 4) % 10 + 10) % 10;
  const z = ((year - 4) % 12 + 12) % 12;
  return `${GAN[g]}${ZHI[z]}年`;
}

// Plain text from Markdown source for listing pages, RSS, and search.
export function plainText(body: string): string {
  return (body || "")
    .replace(/^---[\s\S]*?---/, "") // stray frontmatter (shouldn't exist)
    .replace(/```[\s\S]*?```/g, " ") // code fences
    .replace(/<[^>]+>/g, " ") // inline HTML
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links → text
    .replace(/^[#>\-*\s]+/gm, " ") // md line markers
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Plain-text preview from Markdown source for listing pages.
export function excerpt(body: string, n = 110): string {
  const text = plainText(body);
  return text.length > n ? text.slice(0, n) + "…" : text;
}

export function firstImage(body: string): string | undefined {
  const imagePattern =
    /!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)|<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  for (const match of body.matchAll(imagePattern)) {
    const src = match[1] || match[2];
    if (!src) continue;
    if (/^\/(?:Users|var|private|tmp)\//.test(src) || /^file:/i.test(src)) continue;
    return src;
  }
  return undefined;
}
