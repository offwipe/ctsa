/**
 * Writes a minimal valid 32x32 icon.ico so Tauri Windows build succeeds.
 * Run once: node scripts/create-icon.cjs
 */
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'src-tauri', 'icons');
const outPath = path.join(outDir, 'icon.ico');

const w = 32;
const h = 32;
const xorSize = w * h * 4;
const andSize = Math.ceil((w * h) / 8);
const imageSize = 40 + xorSize + andSize;
const imageOffset = 6 + 16;

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);

const entry = Buffer.alloc(16);
entry[0] = w;
entry[1] = h;
entry[2] = 0;
entry[3] = 0;
entry.writeUInt16LE(1, 4);
entry.writeUInt16LE(32, 6);
entry.writeUInt32LE(imageSize, 8);
entry.writeUInt32LE(imageOffset, 12);

const dib = Buffer.alloc(40);
dib.writeUInt32LE(40, 0);
dib.writeInt32LE(w, 4);
dib.writeInt32LE(h * 2, 8);
dib.writeUInt16LE(1, 12);
dib.writeUInt16LE(32, 14);

const xor = Buffer.alloc(xorSize);
for (let i = 0; i < w * h; i++) {
  xor[i * 4 + 0] = 139;
  xor[i * 4 + 1] = 92;
  xor[i * 4 + 2] = 246;
  xor[i * 4 + 3] = 255;
}

const and = Buffer.alloc(andSize, 0);
const ico = Buffer.concat([header, entry, dib, xor, and]);
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, ico);
console.log('Written:', outPath);
