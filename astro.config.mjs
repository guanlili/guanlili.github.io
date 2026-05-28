// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

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
    // GFM + SmartyPants are on by default. Dark code blocks on both themes
    // match the editorial design's dark `pre`; .astro-code gets framed in CSS.
    shikiConfig: {
      theme: "github-dark",
      wrap: false,
    },
  },
});
