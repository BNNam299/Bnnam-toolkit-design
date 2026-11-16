// joints.cjs — where the drawing's outer outline passes from one part to the next (neck → shoulder, arm → hand, leg → shorts), does it
// turn more than the reference does at that spot? A designer ends one shape exactly where the next begins: one shared point, the
// curve running on. Two shapes that merely overlap meet with a kink or a small step — the bottle test (16/11) showed the neck's flare
// and the shoulder meeting 12° apart where the reference turns 4°, invisible in every score but the first thing the designer saw.
//
// jointCheck(scene, ref, W, H) → [{ a, b, x, y, drawing, reference }] sorted worst first
//   scene: vectorize scene (frame px); ref: { at(x, y) → [r, g, b, a] } at crop px, W × H = crop size; backdrop: Uint8Array W × H
//   (1 = the reference's backdrop, as vectorize floods it). Points are crop px.
// Turning = the angle between the outline ARC px before and ARC px after a point (contour.cjs outline: sub-pixel, no pixel stairs).
'use strict';
const path = require('path');
const sharp = require('sharp');
const { blur, marching } = require(path.join(__dirname, 'contour.cjs'));
const { pathBounds } = require(path.join(__dirname, 'anchors.js'));

const ARC = 5, NEAR = 5, MORE = 8, MIN = 10;

function turnsOf(L) {
  const n = L.length, cum = [0];
  for (let i = 1; i <= n; i++) cum.push(cum[i - 1] + Math.hypot(L[i % n].x - L[i - 1].x, L[i % n].y - L[i - 1].y));
  const tot = cum[n];
  const at = (s) => { s = ((s % tot) + tot) % tot; let lo = 0, hi = n; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] <= s) lo = m; else hi = m; } return L[lo % n]; };
  return L.map((p, i) => { const a = at(cum[i] - ARC), b = at(cum[i] + ARC), v1 = [p.x - a.x, p.y - a.y], v2 = [b.x - p.x, b.y - p.y];
    return { x: p.x, y: p.y, ang: Math.abs(Math.atan2(v1[0] * v2[1] - v1[1] * v2[0], v1[0] * v2[0] + v1[1] * v2[1])) * 180 / Math.PI }; });
}

async function ownerMap(scene, W, H) {
  // each part rendered alone inside its own box, laid down in z order: the pixel belongs to the topmost part covering it
  const parts = scene.groups.flatMap((g) => g.parts), byName = new Map(parts.map((p) => [p.name, p]));
  const sc = W / scene.frame.width, owner = new Int32Array(W * H);
  for (let k = 0; k < parts.length; k++) { const p = parts[k], base = byName.get(p.cutFrom || p.maskOf), bb = pathBounds(p.d);
    const x0 = Math.max(0, Math.floor((p.x + bb.x0) * sc) - 1), y0 = Math.max(0, Math.floor((p.y + bb.y0) * sc) - 1);
    const x1 = Math.min(W, Math.ceil((p.x + bb.x1) * sc) + 1), y1 = Math.min(H, Math.ceil((p.y + bb.y1) * sc) + 1), w = x1 - x0, h = y1 - y0;
    if (w <= 0 || h <= 0 || (p.opacity !== undefined && p.opacity < 0.5)) continue;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><g transform="scale(${sc}) translate(${-x0 / sc},${-y0 / sc})">`, clip = '';
    if (base) { clip = ' clip-path="url(#c)"';
      svg += `<defs><clipPath id="c"><path transform="translate(${base.x},${base.y})" clip-rule="${base.windingRule === 'EVENODD' ? 'evenodd' : 'nonzero'}" d="${base.d}"/></clipPath></defs>`; }
    svg += `<path${clip} transform="translate(${p.x},${p.y})" fill-rule="${p.windingRule === 'EVENODD' ? 'evenodd' : 'nonzero'}" fill="#000" d="${p.d}"/></g></svg>`;
    const A = await sharp(Buffer.from(svg)).ensureAlpha().extractChannel(3).raw().toBuffer();
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (A[y * w + x] > 127) owner[(y + y0) * W + x + x0] = k + 1; }
  return { owner, parts };
}

async function jointCheck(scene, ref, W, H, backdrop) {
  const { owner, parts } = await ownerMap(scene, W, H);
  // the reference's silhouette: 0 on the backdrop, rising over the anti-aliased rim
  const c0 = ref.at(0, 0), refFig = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) { if (backdrop[i]) continue; const [r, g, b] = ref.at(i % W, (i / W) | 0); refFig[i] = Math.min(1, Math.max(0, (Math.hypot(r - c0[0], g - c0[1], b - c0[2]) - 8) / 40)); }
  const grid = new Map();
  for (const L of marching(blur(refFig, W, H), W, H)) if (L.length > 12) for (const p of turnsOf(L)) { const k = `${(p.x / 4) | 0},${(p.y / 4) | 0}`; if (!grid.has(k)) grid.set(k, []); grid.get(k).push(p); }
  // the reference's turn where its outline passes closest (the sharpest within 1.5 px of that distance): a real corner a few px
  // along the outline (the tip of a collar next to the neck) must not excuse a kink here
  const refAng = (x, y) => { const near = [];
    for (let gx = Math.floor((x - NEAR) / 4); gx <= Math.floor((x + NEAR) / 4); gx++) for (let gy = Math.floor((y - NEAR) / 4); gy <= Math.floor((y + NEAR) / 4); gy++)
      for (const p of grid.get(`${gx},${gy}`) || []) { const d = Math.hypot(p.x - x, p.y - y); if (d <= NEAR) near.push([d, p.ang]); }
    if (!near.length) return -1; const d0 = Math.min(...near.map((q) => q[0]));
    return Math.max(...near.filter((q) => q[0] <= d0 + 1.5).map((q) => q[1])); };
  const ownAt = (x, y) => { let best = 0, bd = 9;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const xx = Math.floor(x + dx), yy = Math.floor(y + dy); if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
      const o = owner[yy * W + xx], d = (xx + 0.5 - x) ** 2 + (yy + 0.5 - y) ** 2; if (o && d < bd) { bd = d; best = o; } }
    return best; };
  const fig = new Float32Array(W * H); for (let i = 0; i < W * H; i++) fig[i] = owner[i] ? 1 : 0;
  const out = [];
  for (const L of marching(blur(fig, W, H), W, H)) { if (L.length < 12) continue;
    const T = turnsOf(L), own = T.map((p) => ownAt(p.x, p.y)), n = T.length;
    for (let i = 0; i < n; i++) { const a = own[(i - 1 + n) % n], b = own[i]; if (!a || !b || a === b) continue;
      let pk = T[i]; for (let j = -6; j <= 6; j++) { const q = T[(i + j + n) % n]; if (q.ang > pk.ang) pk = q; }
      const r = refAng(pk.x, pk.y);
      if (r < 0 || pk.ang < MIN || pk.ang - r < MORE) continue;
      if (out.some((o) => Math.hypot(o.x - pk.x, o.y - pk.y) <= 4)) continue;   // A → B and B → A at one joint: once
      out.push({ a: parts[a - 1].name, b: parts[b - 1].name, x: Math.round(pk.x), y: Math.round(pk.y), drawing: Math.round(pk.ang), reference: Math.round(r) }); } }
  return out.sort((p, q) => (q.drawing - q.reference) - (p.drawing - p.reference));
}

module.exports = { jointCheck };
