import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, sep } from "node:path";

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

// Article body images on COS get loading="lazy", width/height and a srcset from
// satteri-image-attrs.mjs, but only when the dimension cache is warm. If that
// plugin silently stops running, every post ships eager, dimension-less <img>
// tags again and the build still succeeds. The bar is deliberately low: it only
// has to catch the plugin dropping out entirely (about 5% stayed lazy the last
// time), while tolerating a batch of failed dimension probes. Covers are
// rendered by the post template, not the plugin, and are left out.
const COS_IMAGE_TAG =
  /<img\b[^>]*\bsrc="https:\/\/blog-1258476669\.cos\.ap-beijing\.myqcloud\.com\/[^"]*"[^>]*>/g;
const POST_PAGE = /^\d{4}\/\d{2}\/\d{2}\/[^/]+\/index\.html$/;
const MIN_LAZY_RATIO = 0.5;

function listFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) listFiles(path, out);
    else out.push(path);
  }
  return out;
}

function countLazyPostImages() {
  let total = 0;
  let lazy = 0;
  for (const file of listFiles("dist")) {
    if (!POST_PAGE.test(file.slice("dist".length + 1).split(sep).join("/"))) continue;
    const main = readFileSync(file, "utf8").match(/<main\b[\s\S]*?<\/main>/)?.[0];
    if (!main) continue;
    for (const [tag] of main.matchAll(COS_IMAGE_TAG)) {
      if (/loading="eager"|fetchpriority="/.test(tag)) continue;
      total += 1;
      if (/loading="lazy"/.test(tag)) lazy += 1;
    }
  }
  return { total, lazy };
}

const { total, lazy } = countLazyPostImages();
if (total > 0 && lazy / total < MIN_LAZY_RATIO) {
  console.error(
    `Post body images lost their lazy attributes: only ${lazy}/${total} COS images have ` +
      `loading="lazy" (expected at least ${MIN_LAZY_RATIO * 100}%). ` +
      `Check src/lib/satteri-image-attrs.mjs and the "[image-cache]" preheat step.`,
  );
  process.exit(1);
}

console.log(`Dist health check passed (${required.length} artifacts, ${lazy}/${total} post body images lazy).`);
