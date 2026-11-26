export const COS_HOST = "blog-1258476669.cos.ap-beijing.myqcloud.com";

// COS 数据万象：多个处理必须用 `|` 串成管道，`?imageSlim&imageMogr2/...`
// 只会执行后一个。`>` 只缩不放（%3E 便于直接放进 HTML 属性）。
// GIF 不转 WebP，保留动图。
export function cosResized(src, width) {
  if (!src.includes(COS_HOST)) return undefined;
  const base = src.replace(/\?imageSlim$/i, "");
  if (base.includes("?")) return undefined;
  const isGif = /\.gif$/i.test(base);
  return `${base}?imageMogr2/thumbnail/${width}x%3E${isGif ? "" : "/format/webp"}`;
}

// 宽度小于原图的候选 + 顶端一档；候选不足两个时不生成 srcset。
// 顶端一档默认是原图本身。`top: "webp"` 时换成原始尺寸的 WebP（见 coverImage）：
// 封面会被裁切缩放显示，而 PNG 原图往往比同尺寸 WebP 大一个数量级，高分屏上
// 浏览器一旦选中顶端一档就会去下载原图。GIF 仍用原图，保留动图。
export function cosSrcset(src, fullWidth, widths, { top = "original" } = {}) {
  if (!src.includes(COS_HOST) || fullWidth <= 800) return undefined;
  const candidates = widths.filter((w) => w < fullWidth);
  if (candidates.length < 2) return undefined;
  const parts = [];
  for (const w of candidates) {
    const url = cosResized(src, w);
    if (!url) return undefined;
    parts.push(`${url} ${w}w`);
  }
  // 原图比 widths 的最大值还宽时，最宽的缩略档已经在候选里，不再追加。
  const nativeWebp =
    top === "webp" && !/\.gif(\?|$)/i.test(src) && fullWidth <= widths[widths.length - 1]
      ? cosResized(src, fullWidth)
      : undefined;
  if (top === "original" || /\.gif(\?|$)/i.test(src) || nativeWebp) {
    parts.push(nativeWebp ? `${nativeWebp} ${fullWidth}w` : `${src} ${fullWidth}w`);
  }
  return parts.join(", ");
}
