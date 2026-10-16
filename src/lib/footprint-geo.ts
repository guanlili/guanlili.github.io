import china from "../data/china-provinces.json";

// Shared projection for the footprints atlas (viewBox 0 0 960 575) and the
// detail-page locator, so both draw the same shapes at the same coordinates.
const minLon = 73;
const maxLat = 54;
const scale = 14.7;

export type Point = number[];
type Ring = Point[];
type Geometry = { type: string; coordinates: unknown };
export type Bounds = [number, number, number, number];

export const project = ([lon, lat]: number[]): Point => [
  22 + (lon - minLon) * scale,
  18 + (maxLat - lat) * scale,
];

function perpendicularDistance(point: Point, start: Point, end: Point) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  if (dx === 0 && dy === 0) return Math.hypot(point[0] - start[0], point[1] - start[1]);
  const t = Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(point[0] - (start[0] + t * dx), point[1] - (start[1] + t * dy));
}

function simplify(ring: Ring, tolerance = 0.025): Ring {
  if (ring.length <= 4) return ring;
  let maxDistance = 0;
  let splitAt = 0;
  for (let i = 1; i < ring.length - 1; i += 1) {
    const distance = perpendicularDistance(ring[i], ring[0], ring[ring.length - 1]);
    if (distance > maxDistance) {
      maxDistance = distance;
      splitAt = i;
    }
  }
  if (maxDistance <= tolerance) return [ring[0], ring[ring.length - 1]];
  return [
    ...simplify(ring.slice(0, splitAt + 1), tolerance).slice(0, -1),
    ...simplify(ring.slice(splitAt), tolerance),
  ];
}

function ringPath(ring: Ring) {
  const points = simplify(ring).map(project);
  return points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("") + "Z";
}

export function geometryPath(geometry: Geometry) {
  const polygons = geometry.type === "Polygon"
    ? [geometry.coordinates as Ring[]]
    : geometry.coordinates as Ring[][];
  return polygons.flatMap((polygon) => polygon.map(ringPath)).join("");
}

// Bounds of the largest polygon only, so outlying islands don't shrink the
// zoom on the mainland / main island.
export function geometryBounds(geometry: Geometry): Bounds {
  const collectPoints = (value: unknown, coordinates: Point[]) => {
    if (!Array.isArray(value)) return;
    if (typeof value[0] === "number" && typeof value[1] === "number") {
      coordinates.push(value as Point);
      return;
    }
    value.forEach((item) => collectPoints(item, coordinates));
  };
  const shapes = geometry.type === "Polygon"
    ? [geometry.coordinates]
    : geometry.coordinates as unknown[];
  const bounds = shapes.map((shape): Bounds => {
    const coordinates: Point[] = [];
    collectPoints(shape, coordinates);
    const projected = coordinates.map(project);
    const xs = projected.map(([x]) => x);
    const ys = projected.map(([, y]) => y);
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  });
  return bounds.sort((a, b) => (b[2] - b[0]) * (b[3] - b[1]) - (a[2] - a[0]) * (a[3] - a[1]))[0];
}

export interface ProvinceShape {
  name: string;
  path: string;
  bounds: Bounds;
}

let provinceShapes: ProvinceShape[] | undefined;

// Computed once per build process; every page that needs shapes shares it.
export function getProvinceShapes(): ProvinceShape[] {
  provinceShapes ??= china.features
    .map((feature) => ({
      name: feature.properties.name || ((feature.properties as { adchar?: string }).adchar === "JD" ? "南海诸岛" : ""),
      path: geometryPath(feature.geometry),
      bounds: geometryBounds(feature.geometry),
    }))
    .filter((province) => province.name);
  return provinceShapes;
}
