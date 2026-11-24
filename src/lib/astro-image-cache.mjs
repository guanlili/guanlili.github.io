// Astro integration that makes sure the image dimension cache is populated
// before any Markdown is processed. The plugin in satteri-image-attrs.mjs then
// reads dimensions synchronously from it.

import { preheat, IMAGE_CONTENT_DIRS } from "../lib/image-cache.mjs";

export default function imageCacheIntegration() {
  return {
    name: "image-cache",
    hooks: {
      // Not astro:build:start. In Astro 7 the Markdown bodies are already
      // processed before that hook fires, so a cold build (every CI run) found
      // an empty cache and shipped every body image without width/height, lazy
      // loading or a srcset. astro:config:done is the first hook that runs
      // after the config exists and before any content is rendered.
      //
      // `npm run verify` warms the cache first (scripts/preheat-images.mjs), so
      // this hook is a no-op there: probing from inside `astro check` was
      // several times slower on CI. It is what covers a direct `astro build`
      // and the dev server.
      "astro:config:done": async () => {
        await preheat(IMAGE_CONTENT_DIRS);
      },
    },
  };
}
