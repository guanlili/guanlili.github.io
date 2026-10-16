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

let cacheLoaded = false;

function dimensions(src: string): { w: number; h: number } | null {
  if (src.startsWith("/")) return getLocalDimensions(src);
  if (!cacheLoaded) {
    loadCache();
    cacheLoaded = true;
  }
  return getCached(src);
}

export function responsiveImage(src: string, widths: number[]): ResponsiveImage {
  const dim = dimensions(src);
  return {
    src,
    width: dim?.w,
    height: dim?.h,
    srcset: dim ? cosSrcset(src, dim.w, widths) : undefined,
    full: (dim && dim.w > 2000 ? cosResized(src, 2000) : undefined) ?? src,
  };
}
