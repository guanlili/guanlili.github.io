import { getCollection, type CollectionEntry } from "astro:content";

export type FootprintEntry = CollectionEntry<"footprints">;

export async function getFootprints(): Promise<FootprintEntry[]> {
  const entries = await getCollection("footprints", ({ data }) => !data.draft);
  return entries.sort((a, b) => {
    const latestA = latestVisit(a);
    const latestB = latestVisit(b);
    const dateOrder = latestB.getTime() - latestA.getTime();
    if (dateOrder !== 0) return dateOrder;

    const journeyA = a.data.journeys.find((journey) => journey.date.getTime() === latestA.getTime());
    const journeyB = b.data.journeys.find((journey) => journey.date.getTime() === latestB.getTime());
    if (journeyA && journeyB && journeyA.id === journeyB.id) return journeyA.order - journeyB.order;

    return a.data.city.localeCompare(b.data.city, "zh-CN");
  });
}

export function footprintSlug(entry: FootprintEntry): string {
  return entry.id.replace(/\.(md|markdown)$/i, "");
}

export function footprintPath(entry: FootprintEntry): string {
  return `/footprints/${footprintSlug(entry)}/`;
}

export function latestVisit(entry: FootprintEntry): Date {
  return new Date(Math.max(...entry.data.visited.map((date) => date.getTime())));
}

export function yearRange(entry: FootprintEntry): string {
  const years = entry.data.visited.map((date) => date.getFullYear());
  const first = Math.min(...years);
  const last = Math.max(...years);
  return first === last ? String(first) : `${first}—${last}`;
}

export function footprintDateLabel(date: Date, precision: "day" | "month" | "year" = "month"): string {
  const year = date.getFullYear();
  if (precision === "year") return `${year}年`;
  const month = String(date.getMonth() + 1).padStart(2, "0");
  if (precision === "month") return `${year}.${month}`;
  return `${year}.${month}.${String(date.getDate()).padStart(2, "0")}`;
}
