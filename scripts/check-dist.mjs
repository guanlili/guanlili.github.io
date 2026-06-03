import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const required = [
  "index.html",
  "feed.xml",
  "search-catalog.json",
  "sitemap-index.xml",
  "offline/index.html",
  "pagefind/pagefind.js",
  "pagefind/pagefind-ui.css",
  "pwa/manifest.json",
  "sw.js",
];

const missing = [];
const empty = [];

for (const file of required) {
  const path = join("dist", file);
  if (!existsSync(path)) {
    missing.push(file);
    continue;
  }
  if (statSync(path).size === 0) empty.push(file);
}

if (missing.length || empty.length) {
  if (missing.length) console.error(`Missing build artifacts: ${missing.join(", ")}`);
  if (empty.length) console.error(`Empty build artifacts: ${empty.join(", ")}`);
  process.exit(1);
}

console.log(`Dist health check passed (${required.length} artifacts).`);
