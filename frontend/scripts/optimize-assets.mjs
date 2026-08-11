import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const MEDIA_DIR = path.resolve(import.meta.dirname, "../public/media");
const MAX_WIDTH = 2320;
const QUALITY = 90;

const isSource = (name) => name.startsWith("hero-") && name.endsWith(".png");
const skip = (name) => name.startsWith("hero-old.");

const files = (await readdir(MEDIA_DIR)).filter((f) => isSource(f) && !skip(f));

for (const file of files) {
  const src = path.join(MEDIA_DIR, file);
  const out = path.join(MEDIA_DIR, file.replace(/\.png$/, ".webp"));
  const { size } = await stat(src);
  const image = sharp(src);
  const meta = await image.metadata();

  if (meta.width > MAX_WIDTH) image.resize({ width: MAX_WIDTH, withoutEnlargement: true });

  const { size: outSize } = await image.webp({ quality: QUALITY, effort: 6 }).toFile(out);

  console.log(
    `${file} ${meta.width}x${meta.height} ${(size / 1024).toFixed(0)}KiB -> ` +
      `${path.basename(out)} ${(outSize / 1024).toFixed(0)}KiB`,
  );
}
