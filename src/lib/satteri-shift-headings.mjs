import { defineMdastPlugin } from "satteri";

// Sätteri 版标题降级：文章正文最高只到 h2，与旧 remark 插件行为一致。
// 同时钳平层级跳跃（35 篇历史笔记存在 h2→h5 直跳）：每个标题最多比
// 上一个深 1 级，保证 a11y 标题层级连续；prevDepth 每篇文档重置。
export default function satteriShiftHeadings() {
  let prevDepth = 1;
  return defineMdastPlugin({
    name: "shift-headings",
    // `before` runs once per document — reset the clamp state there.
    before() {
      prevDepth = 1;
    },
    heading(node, ctx) {
      let depth = node.depth < 6 ? node.depth + 1 : 6;
      depth = Math.min(depth, prevDepth + 1);
      prevDepth = depth;
      ctx.setProperty(node, "depth", depth);
    },
  });
}
