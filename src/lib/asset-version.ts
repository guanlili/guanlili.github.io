import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Cache-busting versions, computed once at module load (ES modules evaluate
// once) rather than per page render. Content hashes, not GITHUB_SHA: a commit
// that only adds a post must not invalidate browser or service-worker caches.
function hashFiles(paths: string[]): string {
  const hash = createHash("sha256");
  for (const path of paths) hash.update(path).update(readFileSync(path));
  return hash.digest("hex").slice(0, 10);
}

function listFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((d) => d.isFile())
    .map((d) => join(d.parentPath, d.name))
    .sort();
}

export const SITE_SCRIPT_VERSION = hashFiles(["public/js/site.js"]);
export const ARTICLE_SCRIPT_VERSION = hashFiles(["public/js/site-article.js"]);

// The SW serves these un-fingerprinted public/ dirs cache-first, so its cache
// version must change whenever any of them does (keep in sync with CACHE_FIRST
// in public/sw.js; /_astro/ is fingerprinted and needs no entry here).
export const SW_VERSION = hashFiles([
  "public/sw.js",
  ...["public/js", "public/pwa", "public/img", "public/data"].flatMap(listFiles),
]);
