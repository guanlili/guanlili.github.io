import { getCollection, type CollectionEntry } from "astro:content";
import { PLACEHOLDER_HEADING } from "./footprint-placeholder.mjs";

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

// Visible story text: body minus headings and placeholder sections.
export function footprintStoryText(entry: FootprintEntry): string {
  let skipDepth = 0;
  const lines: string[] = [];
  for (const line of (entry.body ?? "").split("\n")) {
    const heading = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (heading) {
      const depth = heading[1].length;
      if (skipDepth && depth <= skipDepth) skipDepth = 0;
      if (!skipDepth && PLACEHOLDER_HEADING.test(heading[2])) skipDepth = depth;
      continue;
    }
    if (!skipDepth) lines.push(line);
  }
  return lines.join("").replace(/\s+/g, "");
}

const THIN_STORY_CHARS = 80;

// No photos and only a line or two of text: the page is a map stub, not
// something worth sending search traffic to. Fills in automatically once
// photos or a real story are added.
export function isThinFootprint(entry: FootprintEntry): boolean {
  return entry.data.photos.length === 0 && !entry.data.cover && footprintStoryText(entry).length < THIN_STORY_CHARS;
}

// Site posts linked from a footprint: explicit `posts` plus internal event links.
export function footprintPostPaths(entry: FootprintEntry): string[] {
  const eventLinks = entry.data.events.map((event) => event.href).filter((href): href is string => !!href?.startsWith("/"));
  return [...new Set([...entry.data.posts, ...eventLinks])];
}
