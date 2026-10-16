import { defineMdastPlugin } from "satteri";
import { PLACEHOLDER_HEADING } from "./footprint-placeholder.mjs";

// 渲染时剔除占位段落：标题及其后直到下一个同级或更高级标题的内容。
export default function satteriStripPlaceholders() {
  return defineMdastPlugin({
    name: "strip-placeholders",
    before(root, ctx) {
      let depth = 0;
      for (const node of root.children) {
        if (node.type === "heading") {
          if (depth && node.depth <= depth) depth = 0;
          if (!depth && PLACEHOLDER_HEADING.test(ctx.textContent(node).trim())) depth = node.depth;
        }
        if (depth) ctx.removeNode(node);
      }
    },
  });
}
