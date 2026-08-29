import { defineHastPlugin } from "satteri";
import { loadCache, getCached } from "./image-cache.mjs";

const COS_HOST = "blog-1258476669.cos.ap-beijing.myqcloud.com";
const SRCSET_WIDTHS = [480, 800, 1200];
const SIZES_ATTR = "(max-width: 768px) 100vw, 880px";

// Sätteri 版图片属性注入：在 HAST 阶段直接给 <img> 元素补
// width/height（防 CLS）与 COS 大图的 srcset/sizes，
// 与旧 remark 插件（mdast data.hProperties 转发）产出等价。
export default function satteriImageAttrs() {
  loadCache();
  return defineHastPlugin({
    name: "image-attrs",
    element: {
      filter: ["img"],
      visit(node, ctx) {
        const src = String(node.properties?.src ?? "");
        if (!/^https?:\/\//.test(src)) return;
        const dim = getCached(src);
        if (!dim) return;

        ctx.setProperty(node, "width", dim.w);
        ctx.setProperty(node, "height", dim.h);

        if (src.includes(COS_HOST) && dim.w > 800) {
          const candidates = SRCSET_WIDTHS.filter((w) => w < dim.w);
          if (candidates.length >= 2) {
            const sep = src.includes("?") ? "&" : "?";
            const parts = candidates.map((w) => `${src}${sep}imageMogr2/thumbnail/${w}x ${w}w`);
            parts.push(`${src} ${dim.w}w`);
            ctx.setProperty(node, "srcset", parts.join(", "));
          }
        }
        ctx.setProperty(node, "sizes", SIZES_ATTR);
      },
    },
  });
}
