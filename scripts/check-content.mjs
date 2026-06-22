import { existsSync, readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";

const CONTENT_DIR = "src/content/blog";
const VALID_NAME = /^(\d{4})-(\d{1,2})-(\d{1,2})-(.+)\.(md|markdown)$/i;
const LOCAL_IMAGE = /!\[[^\]]*\]\((?:file:|\/(?:Users|var|private|tmp)\/)[^)]+\)|<img\b[^>]*\bsrc=["'](?:file:|\/(?:Users|var|private|tmp)\/)[^"']+["'][^>]*>/gi;

const errors = [];
const warnings = [];
const routes = new Map();
const today = new Date();
today.setHours(23, 59, 59, 999);

function slugify(value) {
  return value
    .replace(/[^\p{M}\p{L}\p{Nd}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

async function findMarkdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await findMarkdownFiles(full)));
    else if (/\.(md|markdown)$/i.test(entry.name)) files.push(full);
  }
  return files;
}

function frontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : "";
}

function hasKey(fm, key) {
  return new RegExp(`^${key}:\\s*\\S`, "m").test(fm);
}

function readKey(fm, key) {
  return fm.match(new RegExp(`^${key}:\\s*['"]?([^'"\\n]+)['"]?\\s*$`, "m"))?.[1]?.trim();
}

function validDateParts(year, month, day) {
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return (
    d.getFullYear() === Number(year) &&
    d.getMonth() === Number(month) - 1 &&
    d.getDate() === Number(day)
  );
}

function checkLocalImages(file, text) {
  const matches = text.match(LOCAL_IMAGE) || [];
  for (const match of matches) {
    errors.push(`${file}: contains non-publishable local image reference: ${match}`);
  }
}

function checkRoute(file) {
  const name = file.split("/").pop();
  const match = name.match(VALID_NAME);
  if (!match) {
    warnings.push(`${file}: skipped by site routing because filename is not YYYY-M-D-title.md`);
    return;
  }

  const [, year, monthRaw, dayRaw, title] = match;
  const month = monthRaw.padStart(2, "0");
  const day = dayRaw.padStart(2, "0");
  if (!validDateParts(year, month, day)) {
    errors.push(`${file}: filename contains an invalid date`);
    return;
  }
  const route = `/${year}/${month}/${day}/${slugify(title)}/`;
  const prior = routes.get(route);
  if (prior) errors.push(`Duplicate post route ${route}: ${prior} and ${file}`);
  routes.set(route, file);
}

function checkFrontmatter(file, text) {
  const fm = frontmatter(text);
  if (!fm) {
    errors.push(`${file}: missing frontmatter`);
    return;
  }
  if (!hasKey(fm, "title")) errors.push(`${file}: missing title`);
  if (!hasKey(fm, "date")) errors.push(`${file}: missing date`);
  if (!hasKey(fm, "description")) warnings.push(`${file}: missing description`);
  const dateValue = readKey(fm, "date");
  if (dateValue) {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) errors.push(`${file}: invalid date frontmatter`);
    else if (date > today) warnings.push(`${file}: scheduled for future publication (${dateValue})`);
  }
}

const files = (await findMarkdownFiles(CONTENT_DIR)).map((file) => file.replaceAll("\\", "/"));

if (!existsSync(CONTENT_DIR)) {
  errors.push(`Missing content directory: ${CONTENT_DIR}`);
}

for (const abs of files) {
  const file = relative(".", abs).replaceAll("\\", "/");
  const text = readFileSync(abs, "utf8");
  checkRoute(file);
  checkFrontmatter(file, text);
  checkLocalImages(file, text);
}

for (const warning of warnings) console.warn(`Content warning: ${warning}`);

if (errors.length) {
  for (const error of errors) console.error(`Content error: ${error}`);
  process.exit(1);
}

console.log(`Content health check passed (${files.length} markdown files, ${routes.size} routed posts, ${warnings.length} warnings).`);
