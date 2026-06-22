import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

// Cache-busting version for /js/site.js. Computed once at module load (ES
// modules evaluate once) rather than per page render — the Astro component
// frontmatter runs on every page, this does not. GITHUB_SHA wins in CI so the
// disk read is skipped there entirely.
export const SITE_SCRIPT_VERSION: string =
  process.env.GITHUB_SHA ||
  createHash("sha256").update(readFileSync("public/js/site.js")).digest("hex").slice(0, 10);
