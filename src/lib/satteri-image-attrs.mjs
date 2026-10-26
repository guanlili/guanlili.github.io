import { defineMdastPlugin } from "satteri";
import { loadCache, getCached } from "./image-cache.mjs";

const COS_HOST = "blog-1258476669.cos.ap-beijing.myqcloud.com";
const SRCSET_WIDTHS = [480, 800, 1200];
const SIZES_ATTR = "(max-width: 768px) 100vw, 880px";

const escapeAttr = (value) =>
  String(value ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// GIF 缩略会被 COS 输出成静态图（丢动画），一律不缩。
const isGif = (src) => /\.gif(\?|$)/i.test(src);

function buildSrcsetAttrs(src, dim, sizes) {
  const candidates = SRCSET_WIDTHS.filter((w) => w < dim.w);
  if (candidates.length < 2) return null;
  const sep = src.includes("?") ? "&" : "?";
  const parts = candidates.map((w) => `${escapeAttr(`${src}${sep}imageMogr2/thumbnail/${w}x`)} ${w}w`);
  parts.push(`${escapeAttr(src)} ${dim.w}w`);
  return `srcset="${parts.join(", ")}" sizes="${escapeAttr(sizes)}"`;
}

// 手写 <img> 常带 Jekyll 时代的百分比宽度（width="50%"），
// sizes 按显示宽度换算，避免浏览器选过大的档。
function sizesForTag(tag) {
  const pct = tag.match(/\swidth="(\d+(?:\.\d+)?)%"/);
  if (!pct) return SIZES_ATTR;
  const n = Number(pct[1]);
  return `(max-width: 768px) ${n}vw, ${Math.round((880 * n) / 100)}px`;
}

// 在 mdast 阶段把带尺寸缓存的远程图替换为 raw <img>：
// 直接产出 width/height（防 CLS）、COS 大图 srcset/sizes 和
// loading=lazy / decoding=async（文章封面由模板控制，正文图全部懒加载）。
// 走 raw html 而非 hast 属性注入，是因为 Astro 的 image marker
// 插件会把用户设置的属性打包进 __ASTRO_IMAGE_ 再经 getImage
// 白名单恢复，loading/decoding 会被丢弃。
export default function satteriImageAttrs() {
  loadCache();
  return defineMdastPlugin({
    name: "image-attrs",
    image(node) {
      const src = String(node.url ?? "");
      if (!/^https?:\/\//.test(src)) return;
      const dim = getCached(src);
      if (!dim) return;

      const attrs = [
        `src="${escapeAttr(src)}"`,
        `alt="${escapeAttr(node.alt)}"`,
        ...(node.title ? [`title="${escapeAttr(node.title)}"`] : []),
        `width="${dim.w}"`,
        `height="${dim.h}"`,
        'loading="lazy"',
        'decoding="async"',
      ];

      if (src.includes(COS_HOST) && dim.w > 800 && !isGif(src)) {
        const srcset = buildSrcsetAttrs(src, dim, SIZES_ATTR);
        if (srcset) attrs.push(srcset);
      }

      return { type: "html", value: `<img ${attrs.join(" ")}>` };
    },
    // 兜底：Markdown 里手写的裸 <img>（Jekyll 时代遗留，常带 zoom 样式）
    // 不经过 image 节点路径。补 lazy；COS 大图按缓存尺寸上完整 srcset
    // （无缓存时退回固定 1600x 单档止损）。
    html(node) {
      if (typeof node.value !== "string" || !/^<img\s/i.test(node.value.trim())) return;
      let tag = node.value.trim();
      if (!/\sloading=/.test(tag)) {
        tag = tag.replace(/^<img\s/i, '<img loading="lazy" decoding="async" ');
      }
      const srcMatch = tag.match(/src="([^"]+)"/);
      const rawSrc = srcMatch?.[1];
      if (
        rawSrc &&
        rawSrc.includes(COS_HOST) &&
        !rawSrc.includes("imageMogr2") &&
        !isGif(rawSrc) &&
        !/\ssrcset=/.test(tag)
      ) {
        const dim = getCached(rawSrc);
        
        const srcset = dim && dim.w > 800 ? buildSrcsetAttrs(rawSrc, dim, sizesForTag(tag)) : null;
        if (srcset) {
          tag = tag.replace(/^<img\s/i, `<img ${srcset} `);
        } else {
          const sep = rawSrc.includes("?") ? "&" : "?";
          tag = tag.replace(srcMatch[0], `src="${rawSrc}${sep}imageMogr2/thumbnail/1600x"`);
        }
      }
      if (tag !== node.value.trim()) return { type: "html", value: tag };
    },
  });
}
