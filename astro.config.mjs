// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeImageAttrs from "./src/lib/rehype-image-attrs.mjs";
import remarkShiftHeadings from "./src/lib/remark-shift-headings.mjs";

// https://astro.build
export default defineConfig({
  site: "https://guanlili.github.io",
  // User page served at the domain root.
  base: "/",
  // Match the old Jekyll `permalink: pretty` URLs: /a/b/c/ → /a/b/c/index.html
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkShiftHeadings],
    rehypePlugins: [rehypeImageAttrs],
    // Leave mermaid blocks un-highlighted so they can be rendered as diagrams
    // client-side (see initMermaid in site.js).
    syntaxHighlight: { type: "shiki", excludeLangs: ["mermaid"] },
    // GFM + SmartyPants are on by default. Dark code blocks on both themes
    // match the editorial design's dark `pre`; .astro-code gets framed in CSS.
    shikiConfig: {
      theme: "github-dark",
      wrap: false,
      // Shiki is case-sensitive; map capitalized fence langs to real ids.
      langAlias: {
        Java: "java",
        Plaintext: "text",
        JavaScript: "javascript",
        Python: "python",
        Go: "go",
        Bash: "bash",
        SQL: "sql",
        XML: "xml",
        JSON: "json",
        HTML: "html",
        YAML: "yaml",
      },
    },
  },
});
