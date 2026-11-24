// Astro integration that pre-populates the image dimension cache before any
// Markdown is processed. The plugin in satteri-image-attrs.mjs then reads
// dimensions synchronously from the cache file.

import { preheat } from "../lib/image-cache.mjs";

export default function imageCacheIntegration() {
  return {
    name: "image-cache",
    hooks: {
      // Not astro:build:start. In Astro 7 the Markdown bodies are already
      // processed before that hook fires, so a cold build (every CI run) found
      // an empty cache and shipped every body image without width/height, lazy
      // loading or a srcset. astro:config:done is the first hook that runs
      // after the config exists and before any content is rendered. It also
      // fires on dev server start and in `astro check`; with a warm cache that
      // only costs a quick scan, and new images get probed there.
      "astro:config:done": async () => {
        await preheat(["src/content/blog", "src/content/footprints"]);
      },
    },
  };
}
