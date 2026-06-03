import { visit } from "unist-util-visit";
import { loadCache, getCached } from "./image-cache.mjs";

const COS_HOST = "blog-1258476669.cos.ap-beijing.myqcloud.com";
const SRCSET_WIDTHS = [480, 800, 1200];
const SIZES_ATTR = "(max-width: 768px) 100vw, 880px";

/**
 * Remark plugin (mdast). Runs on markdown content including Astro 5
 * content collections. Adds image dimensions from the pre-built cache
 * and generates srcset for COS-hosted images.
 *
 * mdast `image` nodes are converted to hast `element[img]` by remark-rehype.
 * Extra properties are forwarded via `node.data.hProperties`.
 */
export default function remarkImageAttrs() {
  loadCache();

  return (tree) => {
    visit(tree, "image", (node) => {
      const src = node.url;
      if (!src || !/^https?:\/\//.test(src)) return;

      const dim = getCached(src);
      if (!dim) return;

      // Forward to hast via data.hProperties
      node.data ||= {};
      node.data.hProperties ||= {};
      const p = node.data.hProperties;

      // ── width / height ──────────────────────────────────────
      p.width = dim.w;
      p.height = dim.h;

      // ── srcset for wide COS images ──────────────────────────
      if (src.includes(COS_HOST) && dim.w > 800) {
        const candidates = SRCSET_WIDTHS.filter((w) => w < dim.w);
        if (candidates.length >= 2) {
          const sep = src.includes("?") ? "&" : "?";
          const parts = candidates.map((w) => {
            return `${src}${sep}imageMogr2/thumbnail/${w}x ${w}w`;
          });
          parts.push(`${src} ${dim.w}w`);
          p.srcset = parts.join(", ");
          p.sizes = SIZES_ATTR;
        }
      } else {
        p.sizes = SIZES_ATTR;
      }
    });
  };
}
