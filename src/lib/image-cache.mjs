// Build-time image dimension cache.
// Pre-populate via `await preheat(markdownDir)` before the Astro build starts.
// The rehype plugin then reads dimensions synchronously from the cache file.

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { readdir } from "node:fs/promises";
import probe from "probe-image-size";

const CACHE_FILE = resolve(".image-dimensions.json");
const TIMEOUT_MS = 8000;
const CONCURRENCY = 12;

let cache = {};

// ── Public sync API (used by rehype plugin) ──────────────────────

export function loadCache() {
  if (existsSync(CACHE_FILE)) {
    try {
      cache = JSON.parse(readFileSync(CACHE_FILE, "utf8"));
    } catch {
      cache = {};
    }
  }
}

export function getCached(url) {
  return cache[url] || null;
}

// ── Pre-build population ─────────────────────────────────────────

/** Recursively find all .md files under a directory */
async function findMarkdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findMarkdownFiles(full)));
    } else if (entry.name.endsWith(".md") || entry.name.endsWith(".markdown")) {
      files.push(full);
    }
  }
  return files;
}

/** Extract all remote image URLs from markdown files */
async function collectImageUrls(dir) {
  const files = await findMarkdownFiles(dir);
  const urls = new Set();
  const imgRe = /!\[.*?\]\((https?:\/\/[^)]+)\)/g;
  for (const f of files) {
    const text = readFileSync(f, "utf8");
    let m;
    while ((m = imgRe.exec(text)) !== null) {
      urls.add(m[1]);
    }
  }
  return [...urls];
}

/** Probe a single URL, return { url, w, h } or null */
async function probeOne(url) {
  if (cache[url]) return cache[url];
  try {
    const r = await probe(url, { timeout: TIMEOUT_MS });
    if (r && r.width && r.height) {
      const entry = { w: r.width, h: r.height };
      cache[url] = entry;
      return entry;
    }
  } catch {
    // timeout, non-image, DNS fail — skip silently
  }
  return null;
}

/** Run probes with bounded concurrency */
async function probeAll(urls) {
  let i = 0;
  const results = [];
  async function worker() {
    while (i < urls.length) {
      const url = urls[i++];
      const r = await probeOne(url);
      if (r) results.push({ url, ...r });
    }
  }
  const workers = Array.from({ length: Math.min(CONCURRENCY, urls.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

/**
 * Pre-build step: scan all markdown, probe remote image dimensions, save cache.
 * Call from an Astro integration hook before the build.
 */
export async function preheat(contentDir) {
  loadCache();
  const cachedCount = Object.keys(cache).length;

  const urls = await collectImageUrls(contentDir);
  const uncached = urls.filter((u) => !cache[u]);

  if (uncached.length === 0) {
    console.log(`[image-cache] All ${urls.length} image dimensions cached (${cachedCount} entries).`);
    return;
  }

  console.log(`[image-cache] Probing ${uncached.length} images (cache has ${cachedCount})...`);
  const results = await probeAll(uncached);
  console.log(`[image-cache] Got ${results.length}/${uncached.length} dimensions. Saving cache.`);

  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}
