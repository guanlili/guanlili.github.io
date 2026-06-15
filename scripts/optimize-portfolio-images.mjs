// One-shot image optimizer for the portfolio cover PNGs.
// Converts the two in-use covers to webp (max width 1600, quality 82),
// printing a before/after size report. Original PNGs are left in place;
// delete them manually once references are updated.
//
//   npm run images:optimize
import sharp from "sharp";
import { stat } from "node:fs/promises";
import { basename } from "node:path";

const TARGETS = [
  "public/img/portfolio/watch-buddy-wechat-cover.png",
  "public/img/portfolio/watch-buddy-portfolio-cover.png",
];

const MAX_WIDTH = 1600;
const QUALITY = 82;

const kb = (bytes) => `${(bytes / 1024).toFixed(0)}K`;

let totalBefore = 0;
let totalAfter = 0;

for (const input of TARGETS) {
  const output = input.replace(/\.png$/i, ".webp");
  const before = (await stat(input)).size;
  await sharp(input)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(output);
  const after = (await stat(output)).size;
  totalBefore += before;
  totalAfter += after;
  const saved = (((before - after) / before) * 100).toFixed(0);
  console.log(
    `${basename(input)} → ${basename(output)}: ${kb(before)} → ${kb(after)} (−${saved}%)`,
  );
}

const totalSaved = (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0);
console.log(`\ntotal: ${kb(totalBefore)} → ${kb(totalAfter)} (−${totalSaved}%)`);
