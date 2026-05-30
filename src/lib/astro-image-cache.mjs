// Astro integration that pre-populates the image dimension cache
// before the static build starts. The rehype plugin then reads
// dimensions synchronously from the cache file.

import { preheat } from "../lib/image-cache.mjs";

export default function imageCacheIntegration() {
  return {
    name: "image-cache",
    hooks: {
      "astro:build:start": async () => {
        await preheat("src/content/blog");
      },
    },
  };
}
