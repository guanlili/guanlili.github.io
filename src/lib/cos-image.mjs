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

// 宽度小于原图的候选 + 原图本身；候选不足两个时不生成 srcset。
export function cosSrcset(src, fullWidth, widths) {
  if (!src.includes(COS_HOST) || fullWidth <= 800) return undefined;
  const candidates = widths.filter((w) => w < fullWidth);
  if (candidates.length < 2) return undefined;
  const parts = [];
  for (const w of candidates) {
    const url = cosResized(src, w);
    if (!url) return undefined;
    parts.push(`${url} ${w}w`);
  }
  parts.push(`${src} ${fullWidth}w`);
  return parts.join(", ");
}
