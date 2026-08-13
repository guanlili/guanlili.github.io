import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const sources = [
  { adcode: "370000", province: "山东省" },
  { adcode: "460000", province: "海南省" },
  { adcode: "650000", province: "新疆维吾尔自治区" },
];

const outputDirectory = path.resolve("public/data/footprints/prefectures");
const minLon = 73;
const maxLat = 54;
const scale = 14.7;
const project = ([lon, lat]) => [22 + (lon - minLon) * scale, 18 + (maxLat - lat) * scale];

function perpendicularDistance(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  if (dx === 0 && dy === 0) return Math.hypot(point[0] - start[0], point[1] - start[1]);
  const ratio = Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(point[0] - (start[0] + ratio * dx), point[1] - (start[1] + ratio * dy));
}

function simplify(ring, tolerance = 0.01) {
  if (ring.length <= 4) return ring;
  let maxDistance = 0;
  let splitAt = 0;
  for (let index = 1; index < ring.length - 1; index += 1) {
    const distance = perpendicularDistance(ring[index], ring[0], ring.at(-1));
    if (distance > maxDistance) {
      maxDistance = distance;
      splitAt = index;
    }
  }
  if (maxDistance <= tolerance) return [ring[0], ring.at(-1)];
  return [
    ...simplify(ring.slice(0, splitAt + 1), tolerance).slice(0, -1),
    ...simplify(ring.slice(splitAt), tolerance),
  ];
}

function ringPath(ring) {
  return simplify(ring)
    .map(project)
    .map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join("") + "Z";
}

function geometryPath(geometry) {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons.flatMap((polygon) => polygon.map(ringPath)).join("");
}

function shortName(name) {
  const aliases = {
    克孜勒苏柯尔克孜自治州: "克州",
    博尔塔拉蒙古自治州: "博尔塔拉",
    巴音郭楞蒙古自治州: "巴音郭楞",
    伊犁哈萨克自治州: "伊犁",
    昌吉回族自治州: "昌吉",
  };
  if (aliases[name]) return aliases[name];
  return name
    .replace(/(黎族苗族|黎族|苗族|蒙古族|哈萨克族|回族)?自治(州|县)$/, "")
    .replace(/(特别行政区|地区|市|县)$/, "");
}

await mkdir(outputDirectory, { recursive: true });

for (const source of sources) {
  const sourceUrl = `https://geo.datav.aliyun.com/areas_v3/bound/${source.adcode}_full.json`;
  const response = await fetch(sourceUrl);
  if (!response.ok) throw new Error(`Failed to download ${sourceUrl}: ${response.status}`);
  const sourceText = await response.text();
  const geoJson = JSON.parse(sourceText);
  const features = geoJson.features.map((feature) => {
    const labelCoordinate = feature.properties.centroid ?? feature.properties.center;
    return {
      name: feature.properties.name,
      shortName: shortName(feature.properties.name),
      adcode: String(feature.properties.adcode),
      label: project(labelCoordinate).map((value) => Number(value.toFixed(1))),
      path: geometryPath(feature.geometry),
    };
  });
  const output = {
    province: source.province,
    source: sourceUrl,
    sourceSha256: createHash("sha256").update(sourceText).digest("hex"),
    features,
  };
  await writeFile(path.join(outputDirectory, `${source.adcode}.json`), `${JSON.stringify(output)}\n`);
  console.log(`${source.province}: ${features.length} regions`);
}
