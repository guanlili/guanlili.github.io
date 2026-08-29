import { defineMdastPlugin } from "satteri";

// Sätteri 版标题降级：文章正文最高只到 h2，与旧 remark 插件行为一致。
export default function satteriShiftHeadings() {
  return defineMdastPlugin({
    name: "shift-headings",
    heading(node, ctx) {
      if (node.depth < 6) ctx.setProperty(node, "depth", node.depth + 1);
    },
  });
}
