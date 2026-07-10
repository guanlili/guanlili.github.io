import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

// Cache-busting version for a public JS file. Computed once at module load (ES
// modules evaluate once) rather than per page render — Astro component
// frontmatter runs on every page, this does not. GITHUB_SHA wins in CI so the
// disk read is skipped there entirely.
function scriptVersion(path: string): string {
  return (
    process.env.GITHUB_SHA ||
    createHash("sha256").update(readFileSync(path)).digest("hex").slice(0, 10)
  );
}

export const SITE_SCRIPT_VERSION = scriptVersion("public/js/site.js");
export const ARTICLE_SCRIPT_VERSION = scriptVersion("public/js/site-article.js");
