// Post-build: stamp <lastmod> (build time) into every sitemap <url>.
// Crawlers otherwise see no freshness signal from @astrojs/sitemap.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const dist = new URL("../dist/", import.meta.url);
const lastmod = new Date().toISOString();
let touched = 0;

for (const file of readdirSync(dist)) {
  if (!/^sitemap-\d+\.xml$/.test(file)) continue;
  const path = new URL(file, dist);
  const xml = readFileSync(path, "utf-8");
  const updated = xml.replace(
    /(<loc>[^<]+<\/loc>)(?!<lastmod>)/g,
    `$1<lastmod>${lastmod}</lastmod>`,
  );
  if (updated !== xml) {
    writeFileSync(path, updated);
    touched += (updated.match(/<lastmod>/g) || []).length;
  }
}
console.log(`[sitemap-lastmod] stamped ${touched} urls with ${lastmod}`);
