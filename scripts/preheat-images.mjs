// Probe image dimensions before `astro check` and `astro build` run, so the
// integration hook in src/lib/astro-image-cache.mjs finds a warm cache. Probing
// from inside `astro check` was several times slower on CI and timed out on far
// more images than probing from a plain Node process.
import { preheat, IMAGE_CONTENT_DIRS } from "../src/lib/image-cache.mjs";

await preheat(IMAGE_CONTENT_DIRS);
