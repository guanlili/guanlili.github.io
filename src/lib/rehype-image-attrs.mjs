import { visit } from "unist-util-visit";

export default function rehypeImageAttrs() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "img") {
        node.properties ||= {};
        node.properties.loading ||= "lazy";
        node.properties.decoding ||= "async";
      }
    });
  };
}
