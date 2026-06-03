import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

export const CONTENT_DIR = "src/content/blog";

export async function findMarkdownFiles(dir = CONTENT_DIR) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await findMarkdownFiles(full)));
    else if (/\.(md|markdown)$/i.test(entry.name)) files.push(full);
  }
  return files;
}

export function stripCodeBlocks(text) {
  return text
    .replace(/^```[\s\S]*?^```/gm, "")
    .replace(/^~~~[\s\S]*?^~~~/gm, "");
}

export function readMarkdownFiles(files) {
  return files.map((file) => ({
    file: file.replaceAll("\\", "/"),
    text: readFileSync(file, "utf8"),
  }));
}

export function extractMarkdownLinks(text) {
  const clean = stripCodeBlocks(text);
  const refs = [];
  const markdown = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
  const html = /<(a|img)\b[^>]*\b(?:href|src)=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = markdown.exec(clean)) !== null) {
    refs.push({ url: match[1], kind: match[0].startsWith("!") ? "image" : "link" });
  }
  while ((match = html.exec(clean)) !== null) {
    refs.push({ url: match[2], kind: match[1].toLowerCase() === "img" ? "image" : "link" });
  }
  return refs
    .map((ref) => ({ ...ref, url: ref.url.trim() }))
    .filter((ref) => ref.url && !ref.url.startsWith("#"));
}
