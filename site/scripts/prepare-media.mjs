import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { resolve, basename } from "node:path";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const originals = resolve(root, "../images");
const files = await readdir(originals, { recursive: true });
const selection = JSON.parse(await readFile(resolve(root, "src/content/selection.json"), "utf8"));
const output = resolve(root, "public/photos");
await mkdir(output, { recursive: true });
const photos = [];
for (const item of selection) {
  const matches = files.filter((file) => basename(file) === item.source);
  if (matches.length !== 1) throw new Error(`Ambiguous or missing original: ${item.source}`);
  const source = resolve(originals, matches[0]);
  const metadata = await sharp(source).metadata();
  const widths = [...new Set([360, 720, 1200].map((width) => Math.min(width, metadata.width)))];
  for (const width of widths) {
    await sharp(source).rotate().resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 }).toFile(resolve(output, `${item.id}-${width}.webp`));
  }
  photos.push({ ...item, original: `images/${matches[0]}`, width: metadata.width, height: metadata.height, widths });
}
await writeFile(resolve(root, "src/content/photos.json"), JSON.stringify(photos, null, 2) + "\n");
console.log(`Prepared ${photos.length} photographs; originals untouched.`);
