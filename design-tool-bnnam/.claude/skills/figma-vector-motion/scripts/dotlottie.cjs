// dotlottie.cjs — figma-vector-motion: pack / unpack a dotLottie (.lottie) file with Node's own zlib (no install).
// A .lottie is a zip: manifest.json + animations/<id>.json (dotLottie 1.0 layout — read by lottie-ios 4.x, lottie-android 6.x,
// dotlottie-ios / -android / -web and LottieFiles). Entries are deflated; the JSON inside is the same Lottie the build writes.
'use strict';
const zlib = require('zlib');

const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };

function zip(entries) { // entries: [{ name, data: Buffer }]
  const parts = [], central = []; let offset = 0;
  for (const e of entries) {
    const name = Buffer.from(e.name, 'utf8'), raw = e.data, comp = zlib.deflateRawSync(raw, { level: 9 }), crc = crc32(raw);
    const h = Buffer.alloc(30);
    h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(0x0800, 6); h.writeUInt16LE(8, 8);
    h.writeUInt32LE(0, 10); h.writeUInt32LE(crc, 14); h.writeUInt32LE(comp.length, 18); h.writeUInt32LE(raw.length, 22);
    h.writeUInt16LE(name.length, 26); h.writeUInt16LE(0, 28);
    parts.push(h, name, comp);
    const c = Buffer.alloc(46);
    c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(0x0800, 8); c.writeUInt16LE(8, 10);
    c.writeUInt32LE(0, 12); c.writeUInt32LE(crc, 16); c.writeUInt32LE(comp.length, 20); c.writeUInt32LE(raw.length, 24);
    c.writeUInt16LE(name.length, 28); c.writeUInt32LE(offset, 42);
    central.push(c, name);
    offset += 30 + name.length + comp.length;
  }
  const cd = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...parts, cd, end]);
}

function unzip(buf) { // → { name: Buffer } (deflate or store, from the central directory)
  let e = buf.length - 22; while (e >= 0 && buf.readUInt32LE(e) !== 0x06054b50) e--;
  if (e < 0) throw new Error('not a zip / .lottie file');
  const n = buf.readUInt16LE(e + 10); let p = buf.readUInt32LE(e + 16); const out = {};
  for (let i = 0; i < n; i++) {
    const method = buf.readUInt16LE(p + 10), size = buf.readUInt32LE(p + 20), nl = buf.readUInt16LE(p + 28), xl = buf.readUInt16LE(p + 30), cl = buf.readUInt16LE(p + 32), off = buf.readUInt32LE(p + 42);
    const name = buf.slice(p + 46, p + 46 + nl).toString('utf8');
    const ln = buf.readUInt16LE(off + 26), lx = buf.readUInt16LE(off + 28), data = buf.slice(off + 30 + ln + lx, off + 30 + ln + lx + size);
    out[name] = method === 8 ? zlib.inflateRawSync(data) : data;
    p += 46 + nl + xl + cl;
  }
  return out;
}

const safeId = (s) => String(s || 'animation').toLowerCase().replace(/[^a-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '') || 'animation';

// a Lottie object → .lottie bytes
function pack(anim, opts = {}) {
  const id = safeId(opts.id || anim.nm);
  const manifest = { version: '1', generator: 'figma-vector-motion', author: opts.author || '', animations: [{ id, loop: !!opts.loop, autoplay: !!opts.autoplay, speed: 1 }] };
  return zip([
    { name: 'manifest.json', data: Buffer.from(JSON.stringify(manifest)) },
    { name: `animations/${id}.json`, data: Buffer.from(JSON.stringify(anim)) },
  ]);
}
// .lottie bytes → the first animation's Lottie object
function unpack(buf) {
  const files = unzip(buf);
  const m = files['manifest.json'] ? JSON.parse(files['manifest.json'].toString('utf8')) : null;
  const id = m?.animations?.[0]?.id;
  const key = (id && files[`animations/${id}.json`]) ? `animations/${id}.json` : Object.keys(files).find((k) => /^animations\/.+\.json$/.test(k));
  if (!key) throw new Error('.lottie has no animations/*.json');
  return JSON.parse(files[key].toString('utf8'));
}
// a path → Lottie object (.json or .lottie)
function readAnim(fs, path) { return /\.lottie$/i.test(path) ? unpack(fs.readFileSync(path)) : JSON.parse(fs.readFileSync(path, 'utf8')); }

module.exports = { pack, unpack, zip, unzip, crc32, readAnim };
