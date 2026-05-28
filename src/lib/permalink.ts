// Reproduce Jekyll's default slugify + `permalink: pretty` URLs so migrated
// posts keep their existing addresses (/:year/:month/:day/:title/).
//
// Jekyll's default mode: replace runs of non-(Mark|Letter|DecimalNumber) with a
// single hyphen, strip leading/trailing hyphens, downcase. CJK letters are kept.
export function jekyllSlugify(s: string): string {
  return s
    .replace(/[^\p{M}\p{L}\p{Nd}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export interface PostRoute {
  year: string;
  month: string;
  day: string;
  slug: string;
  /** params value for [...slug] (no leading/trailing slash) */
  param: string;
  /** full path with leading + trailing slash */
  path: string;
}

// Derive the URL from the RAW file path (Astro slugifies entry.id differently
// than Jekyll, so we must parse the original filename). Dates may be written
// without zero-padding (e.g. 2025-8-20); Jekyll pads them in `pretty` URLs.
export function postRoute(filePathOrName: string): PostRoute {
  const base = (filePathOrName.split("/").pop() || filePathOrName).replace(
    /\.(md|markdown)$/i,
    "",
  );
  const m = base.match(/^(\d{4})-(\d{1,2})-(\d{1,2})-(.+)$/);
  if (!m) throw new Error(`Unexpected post filename (need YYYY-M-D-…): ${base}`);
  const year = m[1];
  const month = m[2].padStart(2, "0");
  const day = m[3].padStart(2, "0");
  const slug = jekyllSlugify(m[4]);
  const param = `${year}/${month}/${day}/${slug}`;
  return { year, month, day, slug, param, path: `/${param}/` };
}

// Rough reading metrics for CJK-heavy text: count non-whitespace characters.
export function readingStats(body: string): { chars: number; minutes: number } {
  const chars = body.replace(/\s+/g, "").length;
  return { chars, minutes: Math.max(1, Math.round(chars / 350)) };
}
