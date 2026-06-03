import { visit } from "unist-util-visit";

export default function remarkShiftHeadings() {
  return (tree) => {
    visit(tree, "heading", (node) => {
      if (node.depth < 6) node.depth += 1;
    });
  };
}
