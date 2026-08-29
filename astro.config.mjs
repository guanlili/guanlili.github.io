// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkImageAttrs from "./src/lib/remark-image-attrs.mjs";
import remarkShiftHeadings from "./src/lib/remark-shift-headings.mjs";
import imageCacheIntegration from "./src/lib/astro-image-cache.mjs";

// https://astro.build
export default defineConfig({
  site: "https://guanlili.github.io",
  // User page served at the domain root.
  base: "/",
  // Astro 7 默认按 JSX 规则压缩空白，会吃掉行内元素间的空格；
  // 中文排版里中英混排依赖这些空格，显式沿用 v6 行为。
  compressHTML: true,
  // Match the old Jekyll `permalink: pretty` URLs: /a/b/c/ → /a/b/c/index.html
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [sitemap(), imageCacheIntegration()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkShiftHeadings, remarkImageAttrs],
    }),
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
