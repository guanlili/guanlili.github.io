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

// --- 足迹内容校验 ---
const FOOTPRINTS_DIR = "src/content/footprints";
// 与 scripts/build-footprint-prefectures.mjs 的 sources、
// src/components/footprints/FootprintMap.astro 的 prefectureSources 保持同步。
const PREFECTURE_ADCODES = {
  河北省: "130000",
  山西省: "140000",
  内蒙古自治区: "150000",
  辽宁省: "210000",
  吉林省: "220000",
  黑龙江省: "230000",
  江苏省: "320000",
  浙江省: "330000",
  江西省: "360000",
  山东省: "370000",
  河南省: "410000",
  湖南省: "430000",
  广东省: "440000",
  广西壮族自治区: "450000",
  海南省: "460000",
  四川省: "510000",
  贵州省: "520000",
  陕西省: "610000",
  新疆维吾尔自治区: "650000",
};
const MUNICIPALITIES = new Set(["北京市", "天津市", "上海市", "重庆市"]);
const CHINA_BBOX = [73, 3, 136, 54]; // minLon, minLat, maxLon, maxLat

const provinceNames = existsSync("src/data/china-provinces.json")
  ? new Set(
      JSON.parse(readFileSync("src/data/china-provinces.json", "utf8")).features
        .map((feature) => feature.properties.name)
        .filter(Boolean),
    )
  : new Set();
const prefectureNames = new Map(); // adcode -> Set(feature names)

function prefectureSetFor(adcode) {
  if (!prefectureNames.has(adcode)) {
    const dataFile = `public/data/footprints/prefectures/${adcode}.json`;
    if (!existsSync(dataFile)) {
      errors.push(`Missing prefecture boundary data: ${dataFile}; run scripts/build-footprint-prefectures.mjs`);
      prefectureNames.set(adcode, null);
    } else {
      prefectureNames.set(adcode, new Set(
        JSON.parse(readFileSync(dataFile, "utf8")).features.map((feature) => feature.name),
      ));
    }
  }
  return prefectureNames.get(adcode);
}

function checkFootprint(file, text) {
  const fm = frontmatter(text);
  if (!fm) {
    errors.push(`${file}: missing frontmatter`);
    return;
  }
  if (/^draft:\s*true\s*$/m.test(fm)) return;

  for (const key of ["title", "province", "prefecture", "city", "summary", "coordinates"]) {
    if (!hasKey(fm, key)) errors.push(`${file}: missing ${key}`);
  }
  if (!/^visited:/m.test(fm)) errors.push(`${file}: missing visited`);

  const province = readKey(fm, "province");
  if (province && provinceNames.size && !provinceNames.has(province)) {
    errors.push(`${file}: unknown province "${province}" (must match src/data/china-provinces.json)`);
  }

  const coords = fm.match(/^coordinates:\s*\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]/m);
  if (coords) {
    const [lon, lat] = [Number(coords[1]), Number(coords[2])];
    const [minLon, minLat, maxLon, maxLat] = CHINA_BBOX;
    if (lon < minLon || lon > maxLon || lat < minLat || lat > maxLat) {
      errors.push(`${file}: coordinates [${lon}, ${lat}] outside China bounding box (lon/lat swapped or mistyped?)`);
    }
  }

  const prefecture = readKey(fm, "prefecture");
  if (province && prefecture) {
    const adcode = PREFECTURE_ADCODES[province];
    if (adcode) {
      const names = prefectureSetFor(adcode);
      if (names && !names.has(prefecture)) {
        errors.push(`${file}: prefecture "${prefecture}" not found in ${province} boundary data (${adcode}.json)`);
      }
    } else if (MUNICIPALITIES.has(province)) {
      if (prefecture !== province) errors.push(`${file}: municipality prefecture should be "${province}", got "${prefecture}"`);
    } else if (provinceNames.has(province)) {
      warnings.push(`${file}: no prefecture boundary data registered for ${province}; extend scripts/build-footprint-prefectures.mjs`);
    }
  }

  const cover = readKey(fm, "cover");
  if (cover && cover.startsWith("/") && !existsSync(join("public", cover))) {
    errors.push(`${file}: cover image not found: public${cover}`);
  }

  const status = readKey(fm, "status") ?? "visited";
  if (status === "home" && !hasKey(fm, "since")) warnings.push(`${file}: status home without since`);
  if (status === "lived" && !hasKey(fm, "until")) warnings.push(`${file}: status lived without until`);

  const inlineVisited = fm.match(/^visited:\s*\[([^\]]*)\]/m)?.[1] ?? "";
  const blockVisited = fm.match(/^visited:\s*\n((?:\s*-\s*[^\n]+\n?)+)/m)?.[1] ?? "";
  const visitedDates = [...`${inlineVisited} ${blockVisited}`.matchAll(/\d{4}-\d{1,2}-\d{1,2}/g)].length;
  if (/^visited:/m.test(fm) && visitedDates === 0) {
    errors.push(`${file}: visited contains no valid YYYY-MM-DD dates`);
  }
}

if (!existsSync(FOOTPRINTS_DIR)) {
  errors.push(`Missing content directory: ${FOOTPRINTS_DIR}`);
}
const footprintFiles = existsSync(FOOTPRINTS_DIR)
  ? (await findMarkdownFiles(FOOTPRINTS_DIR)).map((file) => relative(".", file).replaceAll("\\", "/"))
  : [];

for (const file of footprintFiles) {
  const text = readFileSync(file, "utf8");
  checkFootprint(file, text);
  checkLocalImages(file, text);
}

for (const warning of warnings) console.warn(`Content warning: ${warning}`);

if (errors.length) {
  for (const error of errors) console.error(`Content error: ${error}`);
  process.exit(1);
}

console.log(`Content health check passed (${files.length} blog + ${footprintFiles.length} footprint markdown files, ${routes.size} routed posts, ${warnings.length} warnings).`);
