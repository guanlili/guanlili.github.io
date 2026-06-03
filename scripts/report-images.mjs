import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { relative } from "node:path";
import { CONTENT_DIR, extractMarkdownLinks, findMarkdownFiles, readMarkdownFiles } from "./content-utils.mjs";

const WRITE_REPORT = process.argv.includes("--write");
const REPORT_FILE = "BROKEN-IMAGES.generated.md";
const CACHE_FILE = ".image-dimensions.json";

const cache = existsSync(CACHE_FILE) ? JSON.parse(readFileSync(CACHE_FILE, "utf8")) : {};
const failedCache = cache.__failed || {};
const files = await findMarkdownFiles(CONTENT_DIR);
const remoteImages = new Map();
const missingLocal = [];
let localImages = 0;

function isRemote(url) {
  return /^https?:\/\//i.test(url);
}

function localPathFor(url) {
  const raw = url.split(/[?#]/)[0];
  if (raw.startsWith("/")) return `public${decodeURI(raw)}`;
  return null;
}

function addRemote(url, file) {
  if (!remoteImages.has(url)) remoteImages.set(url, new Set());
  remoteImages.get(url).add(file);
}

for (const { file, text } of readMarkdownFiles(files)) {
  const source = relative(".", file).replaceAll("\\", "/");
  for (const ref of extractMarkdownLinks(text).filter((item) => item.kind === "image")) {
    if (isRemote(ref.url)) {
      addRemote(ref.url, source);
      continue;
    }
    const localPath = localPathFor(ref.url);
    if (!localPath) continue;
    localImages += 1;
    if (!existsSync(localPath)) missingLocal.push({ url: ref.url, file: source });
  }
}

const cached = [];
const failed = [];
const unprobed = [];

for (const [url, sources] of remoteImages) {
  const entry = cache[url];
  const record = { url, sources: [...sources] };
  if (entry && typeof entry.w === "number" && typeof entry.h === "number") cached.push({ ...record, size: `${entry.w}x${entry.h}` });
  else if (failedCache[url]) failed.push({ ...record, failedAt: new Date(failedCache[url]).toISOString() });
  else unprobed.push(record);
}

function lineFor(record) {
  return `- ${record.url} (${record.sources.slice(0, 2).join(", ")})`;
}

const lines = [
  "# Image Report",
  "",
  `- Markdown files: ${files.length}`,
  `- Local images: ${localImages}`,
  `- Missing local images: ${missingLocal.length}`,
  `- Remote images: ${remoteImages.size}`,
  `- Cached dimensions: ${cached.length}`,
  `- Recently failed probes: ${failed.length}`,
  `- Unprobed remote images: ${unprobed.length}`,
  "",
  "## Missing Local Images",
  "",
  ...(missingLocal.length ? missingLocal.map((item) => `- ${item.url} (${item.file})`) : ["None"]),
  "",
  "## Recently Failed Remote Probes",
  "",
  ...(failed.length ? failed.slice(0, 80).map(lineFor) : ["None"]),
  "",
  "## Unprobed Remote Images",
  "",
  ...(unprobed.length ? unprobed.slice(0, 80).map(lineFor) : ["None"]),
  "",
];

if (WRITE_REPORT) writeFileSync(REPORT_FILE, `${lines.join("\n")}\n`);

console.log(
  `Image report: ${files.length} files, ${localImages} local (${missingLocal.length} missing), ` +
    `${remoteImages.size} remote (${cached.length} cached, ${failed.length} failed, ${unprobed.length} unprobed).`,
);

if (failed.length) {
  console.log("Top failed remote image probes:");
  for (const item of failed.slice(0, 10)) console.log(`- ${item.url}`);
}

if (WRITE_REPORT) console.log(`Wrote ${REPORT_FILE}.`);
