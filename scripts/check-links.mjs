import { existsSync } from "node:fs";
import { relative } from "node:path";
import { CONTENT_DIR, extractMarkdownLinks, findMarkdownFiles, readMarkdownFiles } from "./content-utils.mjs";

const CHECK_REMOTE = process.argv.includes("--remote");
const TIMEOUT_MS = 8000;
const CONCURRENCY = 8;

const errors = [];
const warnings = [];
const remoteUrls = new Map();
let localRefs = 0;

function isRemote(url) {
  return /^https?:\/\//i.test(url);
}

function isSkippable(url) {
  return /^(mailto:|tel:|javascript:)/i.test(url);
}

function localPathFor(url) {
  const raw = url.split(/[?#]/)[0];
  if (!raw || raw.startsWith("#")) return null;
  if (raw.startsWith("/")) return `public${decodeURI(raw)}`;
  if (/^\.\.?\//.test(raw)) return null;
  return null;
}

function addRemote(url, file) {
  if (!remoteUrls.has(url)) remoteUrls.set(url, new Set());
  remoteUrls.get(url).add(file);
}

async function checkRemoteUrl(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "lili-blog-link-checker/1.0" },
    });
    if ([405, 403].includes(res.status)) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "user-agent": "lili-blog-link-checker/1.0" },
      });
    }
    return { url, ok: res.status < 400, status: res.status };
  } catch (error) {
    return { url, ok: false, status: error.name === "AbortError" ? "timeout" : error.message };
  } finally {
    clearTimeout(timeout);
  }
}

async function checkRemoteUrls(urls) {
  let index = 0;
  const failures = [];
  async function worker() {
    while (index < urls.length) {
      const url = urls[index++];
      const result = await checkRemoteUrl(url);
      if (!result.ok) failures.push(result);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker));
  return failures;
}

const files = await findMarkdownFiles(CONTENT_DIR);
for (const { file, text } of readMarkdownFiles(files)) {
  for (const ref of extractMarkdownLinks(text)) {
    if (isSkippable(ref.url)) continue;
    if (isRemote(ref.url)) {
      addRemote(ref.url, relative(".", file).replaceAll("\\", "/"));
      continue;
    }

    const localPath = localPathFor(ref.url);
    if (!localPath) continue;
    localRefs += 1;
    if (!existsSync(localPath)) {
      errors.push(`${relative(".", file).replaceAll("\\", "/")}: missing local ${ref.kind}: ${ref.url}`);
    }
  }
}

if (CHECK_REMOTE) {
  const failures = await checkRemoteUrls([...remoteUrls.keys()]);
  for (const failure of failures) {
    const sources = [...remoteUrls.get(failure.url)].slice(0, 3).join(", ");
    warnings.push(`${failure.url} -> ${failure.status} (${sources})`);
  }
}

for (const warning of warnings) console.warn(`Link warning: ${warning}`);
for (const error of errors) console.error(`Link error: ${error}`);

if (errors.length) process.exit(1);

const remoteMode = CHECK_REMOTE ? `${warnings.length} remote warnings` : `${remoteUrls.size} remote URLs skipped; use --remote to probe`;
console.log(
  `Link check passed (${files.length} markdown files, ${localRefs} local refs, ${remoteMode}).`,
);
