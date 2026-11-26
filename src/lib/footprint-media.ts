import { getCached, getLocalDimensions, loadCache } from "./image-cache.mjs";
import { cosResized, cosSrcset } from "./cos-image.mjs";

export interface ResponsiveImage {
  src: string;
  width?: number;
  height?: number;
  srcset?: string;
  // Large-but-bounded rendition for the lightbox.
  full: string;
}

// Rendition widths for covers rendered by page templates. They go up to 2000 so
// that a wide slot on a high-DPR screen (a 1500px shell at 2x) still lands on a
// thumbnail instead of the original, which cosSrcset keeps as the last candidate.
export const COVER_WIDTHS = [480, 800, 1200, 1600, 2000];

let cacheLoaded = false;

function dimensions(src: string): { w: number; h: number } | null {
  if (src.startsWith("/")) return getLocalDimensions(src);
  if (!cacheLoaded) {
    loadCache();
    cacheLoaded = true;
  }
  return getCached(src);
}

export function responsiveImage(
  src: string,
  widths: number[],
  options: { top?: "original" | "webp" } = {},
): ResponsiveImage {
  const dim = dimensions(src);
  return {
    src,
    width: dim?.w,
    height: dim?.h,
    srcset: dim ? cosSrcset(src, dim.w, widths, options) : undefined,
    full: (dim && dim.w > 2000 ? cosResized(src, 2000) : undefined) ?? src,
  };
}

// A cover rendered by a page template. Its srcset never offers the original
// file, so a high-DPR screen cannot fall back to a multi-megabyte PNG.
export function coverImage(src: string): ResponsiveImage {
  return responsiveImage(src, COVER_WIDTHS, { top: "webp" });
}
