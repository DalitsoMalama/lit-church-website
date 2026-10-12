// Generates the home-screen app icons from the flame mark.
// Run again when the real LIT logo arrives:  node scripts/generate-icons.mjs
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const flame = (scale, cx, cy) => {
  // Flame path is drawn in a 32×40 box; centre it at (cx, cy) at the given scale.
  const w = 32 * scale;
  const h = 40 * scale;
  return `
    <g transform="translate(${cx - w / 2} ${cy - h / 2}) scale(${scale})">
      <path d="M16 2c2 6 9 9 9 18a9 9 0 0 1-18 0c0-5 3-8 5-10 0 3 1 5 3 6-1-5 0-10 1-14z" fill="url(#g)"/>
      <rect x="14.5" y="30" width="3" height="9" rx="1.5" fill="#faf8f4"/>
    </g>`;
};

// `pad` = share of the canvas the flame may use (maskable icons need a safe zone, ~60%).
const svg = (size, pad, rounded) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#f6c21a"/>
      <stop offset="0.55" stop-color="#e8601a"/>
      <stop offset="1" stop-color="#c8231b"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="55%" r="50%">
      <stop offset="0" stop-color="#e8601a" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#e8601a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${rounded ? size * 0.22 : 0}" fill="#1c1a19"/>
  <rect width="${size}" height="${size}" fill="url(#glow)"/>
  ${flame((size * pad) / 40, size / 2, size / 2)}
</svg>`;

const out = [
  ["public/icons/icon-192.png", 192, 0.62, false],
  ["public/icons/icon-512.png", 512, 0.62, false],
  ["public/icons/maskable-512.png", 512, 0.5, false],
  ["src/app/apple-icon.png", 180, 0.6, false], // iOS adds its own rounded corners
];

await mkdir("public/icons", { recursive: true });
for (const [file, size, pad, rounded] of out) {
  await sharp(Buffer.from(svg(size, pad, rounded))).png().toFile(file);
  console.log("wrote", file);
}
// Browser-tab icon (SVG scales crisply)
await writeFile("src/app/icon.svg", svg(64, 0.7, true).trim());
console.log("wrote src/app/icon.svg");
