// illustration-helpers.js — Figma Plugin API helpers for figma-vector-illustration.
// Paste the functions you need at the top of the code sent to execute_code (figma-agent), then call them.
// Colours are hex strings; positions are in the parent's coordinate space (groups are transparent to coordinates).
// All helpers return the created / changed nodes so you can read numbers back.

const hexToRgb = (hex) => { const n = parseInt(hex.replace('#', ''), 16); return { r: (n >> 16 & 255) / 255, g: (n >> 8 & 255) / 255, b: (n & 255) / 255 }; };
const rgba = (hex, a) => ({ ...hexToRgb(hex), a });
const DIR = { LR: [[1, 0, 0], [0, 1, 0]], TB: [[0, 1, 0], [-1, 0, 1]] };
const linear = (dir, stops) => ({ type: 'GRADIENT_LINEAR', gradientTransform: DIR[dir] || dir,
  gradientStops: stops.map(([p, hex, a]) => ({ position: p, color: rgba(hex, a) })) });

// ---------------------------------------------------------------- rule 1: shading inside the shape
// Append extra paints on top of the shape's own fill. Nothing can spill past the path.
function addPaints(node, ...paints) { node.fills = [...node.fills, ...paints]; return node; }

// Preset: a cylinder-ish body (pot, cup, can) — left highlight sliver, right side shade, contact shadow under a lip at the top.
function shadeBody(node, dark = '#7A3A1F', { sliver = [0.13, 0.20, 0.22], side = [0.55, 0.28], lip = [0.45, 0.18] } = {}) {
  return addPaints(node,
    linear('LR', [[0, '#FFFFFF', 0], [sliver[0] - 0.001, '#FFFFFF', 0], [sliver[0], '#FFFFFF', sliver[2]], [sliver[1], '#FFFFFF', sliver[2]], [sliver[1] + 0.001, '#FFFFFF', 0], [1, '#FFFFFF', 0]]),
    linear('LR', [[0, dark, 0], [side[0], dark, 0], [1, dark, side[1]]]),
    linear('TB', [[0, dark, lip[0]], [lip[1], dark, 0], [1, dark, 0]]));
}
// Preset: a rim / ledge — light top edge, darker bottom edge.
function shadeRim(node, dark = '#9E4A2A') {
  return addPaints(node, linear('TB', [[0, '#FFFFFF', 0.35], [0.35, '#FFFFFF', 0], [0.7, dark, 0], [1, dark, 0.3]]));
}
// Preset: leaf folded along its vertical axis.
function shadeHalf(node, dark = '#1F4D2E', a = 0.16) {
  return addPaints(node, linear('LR', [[0, dark, 0], [0.5, dark, 0], [0.501, dark, a], [1, dark, a]]));
}

// ---------------------------------------------------------------- rule 1: mask group for details
// Clips `details` (nodes in the same parent as `shape`) to `shape`. Returns the group.
function maskInside(shape, details, name = 'Masked') {
  const parent = shape.parent;
  const m = shape.clone(); parent.appendChild(m);
  m.relativeTransform = shape.relativeTransform;           // clones can land offset in groups: pin the transform
  m.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]; m.strokes = []; m.name = shape.name + ' / mask';
  const g = figma.group([m, ...details], parent);
  g.insertChild(0, m); m.isMask = true; g.name = name; return g;
}

// ---------------------------------------------------------------- rule 1: cast shadow on a receiving surface
// object: the thing casting (its bottom edge = base); surface: the shape receiving it. Same parent space.
function contactShadow(object, surface, { color = '#5A4632', width = null, height = 5, lift = 2.2, peak = 0.30 } = {}) {
  const parent = surface.parent; const cx = object.x + object.width / 2, base = object.y + object.height;
  const w = width || object.width * 1.3;
  const e = figma.createEllipse(); parent.appendChild(e); e.name = object.name + ' / contact shadow';
  e.resize(w, height); e.x = cx - w / 2; e.y = base - lift;
  e.fills = [{ type: 'GRADIENT_RADIAL', gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops: [
    { position: 0, color: rgba(color, peak) }, { position: 0.55, color: rgba(color, peak * 0.47) }, { position: 1, color: rgba(color, 0) }] }];
  return maskInside(surface, [e], object.name + ' shadow (masked by ' + surface.name.toLowerCase() + ')');
}

// ---------------------------------------------------------------- rule 2: rain
// area = {x0, x1, y0 (cloud base), y1 (bottom)} in `parent` space; insertAt = index behind the clouds.
function rainLayers(parent, area, { insertAt = 1, color = '#E8F2FF', slant = 0.24, far = 22, near = 13, splashes = 4, seed = 7 } = {}) {
  let s = seed; const rnd = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const col = hexToRgb(color); const made = { far: [], near: [], splash: [] };
  const streak = (len, w, a) => { const v = figma.createVector();
    v.vectorPaths = [{ windingRule: 'NONE', data: `M 0 0 L ${(-len * slant).toFixed(2)} ${len.toFixed(2)}` }];
    v.fills = []; v.strokeWeight = w; v.strokeCap = 'ROUND'; v.name = 'Streak';
    v.strokes = [{ type: 'GRADIENT_LINEAR', gradientTransform: DIR.TB, gradientStops: [{ position: 0, color: { ...col, a: 0 } }, { position: 1, color: { ...col, a } }] }];
    return v; };
  const place = (n, lenMin, lenVar, w, aMin, aVar, key) => { for (let i = 0; i < n; i++) {
    const len = lenMin + rnd() * lenVar, v = streak(len, w, aMin + rnd() * aVar); parent.appendChild(v);
    v.x = area.x0 + (i + rnd()) * (area.x1 - area.x0) / n; v.y = area.y0 + rnd() * (area.y1 - area.y0 - len); made[key].push(v); } };
  place(far, 3.5, 2.5, 0.7, 0.22, 0.12, 'far');
  place(near, 6.5, 4, 1.1, 0.5, 0.2, 'near');
  for (let i = 0; i < splashes; i++) { const e = figma.createEllipse(); parent.appendChild(e); e.resize(2.6, 0.9);
    e.x = area.x0 + 8 + rnd() * (area.x1 - area.x0 - 16); e.y = area.y1 - 1.2; e.fills = [{ type: 'SOLID', color: col, opacity: 0.35 }]; e.name = 'Splash'; made.splash.push(e); }
  const gFar = figma.group(made.far, parent); gFar.name = 'Rain / far';
  const gNear = figma.group(made.near, parent); gNear.name = 'Rain / near';
  const gSpl = made.splash.length ? figma.group(made.splash, parent) : null; if (gSpl) gSpl.name = 'Rain / splash';
  const rain = figma.group([gFar, gNear, gSpl].filter(Boolean), parent, insertAt); rain.name = 'Rain';
  return rain;
}

// ---------------------------------------------------------------- rule 2: water drop on glass
// (cx, by) = bottom-centre of the drop; r = radius 1.0–1.6; trail = 0 or 3–8.
function glassDrop(parent, cx, by, r, trail = 0) {
  const W = { r: 1, g: 1, b: 1 }, H = r * 2.7, parts = [];
  if (trail > 0) { const t = figma.createVector(); parent.appendChild(t);
    t.vectorPaths = [{ windingRule: 'NONE', data: `M 0 0 C 0.4 ${trail * 0.35} -0.3 ${trail * 0.7} 0 ${trail}` }];
    t.x = cx - 0.2; t.y = by - H - trail + 0.4; t.fills = []; t.strokeWeight = r * 0.55; t.strokeCap = 'ROUND';
    t.strokes = [{ type: 'GRADIENT_LINEAR', gradientTransform: DIR.TB, gradientStops: [{ position: 0, color: { ...W, a: 0 } }, { position: 1, color: { ...W, a: 0.22 } }] }];
    t.name = 'Trail'; parts.push(t); }
  const d = figma.createVector(); parent.appendChild(d);
  d.vectorPaths = [{ windingRule: 'NONZERO', data: `M ${r} 0 C ${r * 1.15} ${H * 0.3} ${2 * r} ${H - r * 1.5} ${2 * r} ${H - r} C ${2 * r} ${H - r * 0.45} ${r * 1.55} ${H} ${r} ${H} C ${r * 0.45} ${H} 0 ${H - r * 0.45} 0 ${H - r} C 0 ${H - r * 1.5} ${r * 0.85} ${H * 0.3} ${r} 0 Z` }];
  d.x = cx - r; d.y = by - H; d.name = 'Drop';
  d.fills = [{ type: 'GRADIENT_LINEAR', gradientTransform: DIR.TB, gradientStops: [{ position: 0, color: { ...W, a: 0.12 } }, { position: 1, color: { ...W, a: 0.42 } }] }];
  d.strokes = [{ type: 'SOLID', color: W, opacity: 0.3 }]; d.strokeWeight = 0.35; d.strokeAlign = 'INSIDE'; parts.push(d);
  const hl = figma.createEllipse(); parent.appendChild(hl); hl.resize(r * 0.33, r * 0.42);
  hl.x = cx - r * 0.45; hl.y = by - r * 1.4; hl.fills = [{ type: 'SOLID', color: W, opacity: 0.7 }]; hl.name = 'Highlight'; parts.push(hl);
  const g = figma.group(parts, parent); g.name = 'Glass drop'; return g;
}

// ---------------------------------------------------------------- rule 3: group by object
function groupAs(nodes, name) { const p = nodes[0].parent; const idx = Math.min(...nodes.map(n => p.children.indexOf(n)));
  const g = figma.group(nodes, p, idx); g.name = name; return g; }
// List layers still carrying default names.
function unnamed(root) { return root.findAll(n => /^(Vector|Group|Frame( \d+)?|Rectangle \d*|Ellipse \d*|Clip path group|Union|Subtract)$/.test(n.name)).map(n => n.id + ' ' + n.type + ' ' + n.name); }

// ---------------------------------------------------------------- rule 4: wrap each child of the Illustration in a plain frame, Center
function wrapInFrames(illustration) {
  const frames = [];
  for (const g of [...illustration.children]) {
    if (g.type === 'FRAME') { g.constraints = { horizontal: 'CENTER', vertical: 'CENTER' }; frames.push(g); continue; }
    const f = figma.createFrame(); illustration.insertChild(illustration.children.indexOf(g), f);
    f.name = g.name; f.fills = []; f.clipsContent = false; f.x = g.x; f.y = g.y; f.resize(Math.max(g.width, 0.01), Math.max(g.height, 0.01));
    f.appendChild(g); g.x = 0; g.y = 0; if (g.type === 'GROUP') figma.ungroup(g);
    f.constraints = { horizontal: 'CENTER', vertical: 'CENTER' }; frames.push(f);
  }
  return frames;
}

// ---------------------------------------------------------------- rule 5: widget = auto layout + Illustration + Content
// Fits the object frames into the Illustration box (uniform scale ≤ 1, centred). Returns the scale used — report it if < 1.
// bleed: true — art that must run past the padding: Illustration absolute, index 0, full widget size, Content aligned to the bottom.
function buildWidget(widget, illustration, content, { pad = [12, 16, 16, 16], gap = 0, bleed = false } = {}) {
  widget.layoutMode = 'VERTICAL'; widget.primaryAxisSizingMode = 'FIXED'; widget.counterAxisSizingMode = 'FIXED';
  [widget.paddingTop, widget.paddingRight, widget.paddingBottom, widget.paddingLeft] = pad;
  widget.itemSpacing = gap; widget.primaryAxisAlignItems = 'MIN'; widget.counterAxisAlignItems = 'MIN'; widget.clipsContent = true;
  const frames = illustration.children;
  const bx = Math.min(...frames.map(f => f.x)), by = Math.min(...frames.map(f => f.y));
  const bw = Math.max(...frames.map(f => f.x + f.width)) - bx, bh = Math.max(...frames.map(f => f.y + f.height)) - by;
  widget.insertChild(0, illustration); illustration.fills = []; illustration.clipsContent = false;
  widget.insertChild(1, content);
  if (bleed) {
    illustration.layoutPositioning = 'ABSOLUTE'; illustration.resize(widget.width, widget.height); illustration.x = 0; illustration.y = 0;
    illustration.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' }; widget.primaryAxisAlignItems = 'MAX';
  } else {
    illustration.layoutPositioning = 'AUTO'; illustration.layoutSizingHorizontal = 'FILL'; illustration.layoutSizingVertical = 'FILL';
  }
  content.layoutMode = 'VERTICAL'; content.primaryAxisSizingMode = 'AUTO'; content.counterAxisSizingMode = 'AUTO'; content.fills = [];
  content.children.forEach(t => { if (t.type === 'TEXT') { t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.layoutSizingHorizontal = 'HUG'; } });
  const W = illustration.width, H = illustration.height, s = Math.min(W / bw, H / bh, 1);
  for (const f of frames) { const nx = (f.x - bx) * s + (W - bw * s) / 2, ny = (f.y - by) * s + (H - bh * s) / 2;
    if (s < 1) f.rescale(s); f.x = nx; f.y = ny; f.constraints = { horizontal: 'CENTER', vertical: 'CENTER' }; }
  return s;
}

// ---------------------------------------------------------------- shape checks (read only — run after every pass)
// Rule 6: a mass built from primitives stacked on each other (circles + rectangles of one colour merged by eye or by a union)
// instead of one pen-tool path. Reusable geometric parts (buttons, dots, pills, rivets) are fine — name them and say so.
function stackedPrimitives(root) {
  const PRIM = new Set(['ELLIPSE', 'RECTANGLE', 'POLYGON', 'STAR']);
  const colour = (n) => { const f = Array.isArray(n.fills) && n.fills.find((p) => p.visible !== false); return f && f.type === 'SOLID' ? `${f.color.r.toFixed(2)},${f.color.g.toFixed(2)},${f.color.b.toFixed(2)}` : f ? f.type : 'none'; };
  const hit = (a, b) => { const A = a.absoluteBoundingBox, B = b.absoluteBoundingBox; return A && B && A.x < B.x + B.width && B.x < A.x + A.width && A.y < B.y + B.height && B.y < A.y + A.height; };
  const out = [];
  for (const g of [root, ...root.findAll((n) => 'children' in n)]) {
    if (!('children' in g)) continue;
    const prims = g.children.filter((c) => PRIM.has(c.type) && !c.isMask);
    if (g.type === 'BOOLEAN_OPERATION' && g.booleanOperation === 'UNION' && prims.length >= 2)
      out.push({ id: g.id, name: g.name, why: `union of ${prims.length} primitives — draw the outline as one path unless the shape really is these primitives` });
    const byColour = {};
    for (const c of prims) (byColour[colour(c)] = byColour[colour(c)] || []).push(c);
    for (const [col, list] of Object.entries(byColour)) {
      const touching = list.filter((a) => list.some((b) => a !== b && hit(a, b)));
      if (touching.length >= 2) out.push({ id: g.id, name: g.name, why: `${touching.length} overlapping primitives of one colour (${touching.map((n) => n.name).join(', ')}) read as one mass — one path` });
    }
  }
  return out;
}

// Rule 1: small details laid on a base shape (the group's bottom child) that stick out past it — bracelet stripes past the arm,
// a highlight past the cap. Report only: an ear or a hand may stick out on purpose; say so in the report.
function spills(root, tol = 0.5) {
  const out = [];
  for (const g of [root, ...root.findAll((n) => n.type === 'GROUP' || n.type === 'FRAME')]) {
    if (!('children' in g) || g.children.length < 2) continue;
    const base = g.children[0], B = base.absoluteBoundingBox;
    if (!B || base.isMask || ('children' in base && base.type !== 'BOOLEAN_OPERATION')) continue;   // a mask already clips its details
    for (const c of g.children.slice(1)) {
      const C = c.absoluteBoundingBox; if (!C || c.isMask) continue;
      if (C.width * C.height > 0.25 * B.width * B.height) continue;               // not a detail
      const overlaps = C.x < B.x + B.width && B.x < C.x + C.width && C.y < B.y + B.height && B.y < C.y + C.height;
      const past = Math.max(B.x - C.x, C.x + C.width - B.x - B.width, B.y - C.y, C.y + C.height - B.y - B.height);
      if (overlaps && past > tol) out.push({ id: c.id, name: c.name, base: base.name, past: Math.round(past * 10) / 10 });
    }
  }
  return out;
}

// A union / subtract that takes a straight side from a plain rectangle — the fake flat edge on a round cap.
function fakeEdges(root, tol = 0.5) {
  const out = [];
  for (const b of root.findAll((n) => n.type === 'BOOLEAN_OPERATION')) {
    const O = b.absoluteBoundingBox; if (!O) continue;
    for (const r of b.children.filter((c) => c.type === 'RECTANGLE')) {
      const R = r.absoluteBoundingBox, sides = [];
      if (Math.abs(R.x - O.x) < tol) sides.push('left'); if (Math.abs(R.x + R.width - O.x - O.width) < tol) sides.push('right');
      if (Math.abs(R.y - O.y) < tol) sides.push('top'); if (Math.abs(R.y + R.height - O.y - O.height) < tol) sides.push('bottom');
      if (sides.length) out.push({ id: b.id, name: b.name, rect: r.name, sides });
    }
  }
  return out;
}

// Everything is attached to what holds it — any subject: a limb to its joint, a hand to its wrist, a prop to the hand, a handle to
// the cup, a lamp to its stand, an object to the surface it rests on. Two checks:
//   isolated — a visible shape that touches no other shape at all (bounds grown by `gap`): a floating piece
//   attach   — pairs from YOUR build plan, [['Hand R', 'Arm R'], ['Bag', 'Hand R'], ['Handle', 'Cup']]: each pair must touch
// Read only. Sparkles, rain, stars float on purpose — leave them out of the pairs and say so if they show up as isolated.
function floating(root, attach = [], gap = 1) {
  const SHAPES = new Set(['VECTOR', 'ELLIPSE', 'RECTANGLE', 'POLYGON', 'STAR', 'BOOLEAN_OPERATION', 'LINE']);
  const leaves = [];
  const walk = (n) => { if (n.visible === false || n.isMask) return;
    if (SHAPES.has(n.type)) { leaves.push(n); return; } if ('children' in n) n.children.forEach(walk); };
  ('children' in root ? root.children : [root]).forEach(walk);
  const bb = (n) => n.absoluteRenderBounds || n.absoluteBoundingBox;
  const touch = (A, Bb) => A && Bb && A.x - gap < Bb.x + Bb.width && Bb.x - gap < A.x + A.width && A.y - gap < Bb.y + Bb.height && Bb.y - gap < A.y + A.height;
  const isolated = leaves.filter((a) => !leaves.some((b) => a !== b && touch(bb(a), bb(b)))).map((n) => ({ id: n.id, name: n.name }));
  const byName = (nm) => root.findOne((n) => n.name === nm);
  const pairs = attach.map(([a, b]) => { const A = byName(a), Bn = byName(b);
    return !A || !Bn ? { pair: `${a} → ${b}`, problem: `missing layer ${!A ? a : b}` } : touch(bb(A), bb(Bn)) ? null : { pair: `${a} → ${b}`, problem: 'not touching — floating or gap' }; }).filter(Boolean);
  return { isolated, pairs };
}

// Joins overlap, they do not butt (rule 9): each pair [front, back] from the join list must OVERLAP by at least `min` px — the
// front part tucks over the back one (sleeve over shoulder, wrist under cuff, leg into hip). Two parts that only touch edge to edge
// read as flat cut-outs standing next to each other and open a hairline gap at any scale. Bounds-based, so a pass here is necessary,
// not sufficient — the compare sheet (scripts/compare-sheet.cjs) shows the real join; a fail here is always a real problem.
function joins(root, pairs = [], min = 2) {
  const byName = (nm) => root.findOne((n) => n.name === nm);
  const bb = (n) => n.absoluteRenderBounds || n.absoluteBoundingBox;
  const out = [];
  for (const [a, b] of pairs) {
    const A = byName(a), B = byName(b);
    if (!A || !B) { out.push({ join: `${a} ↔ ${b}`, problem: `missing layer ${!A ? a : b}` }); continue; }
    const p = bb(A), q = bb(B);
    const w = Math.min(p.x + p.width, q.x + q.width) - Math.max(p.x, q.x), h = Math.min(p.y + p.height, q.y + q.height) - Math.max(p.y, q.y);
    const depth = Math.round(Math.min(w, h) * 10) / 10;
    if (depth < min) out.push({ join: `${a} ↔ ${b}`, depth, problem: depth < 0 ? 'gap — not touching' : 'butted edge to edge — tuck one under the other' });
    else {
      const ia = A.parent.children.indexOf(A), ib = B.parent.children.indexOf(B);
      if (A.parent === B.parent && ia < ib) out.push({ join: `${a} ↔ ${b}`, depth, problem: `${a} is listed as the front part but sits behind ${b}` });
    }
  }
  return out; // empty = every join overlaps the agreed way
}

// ---------------------------------------------------------------- zoom check
// Clones `node` 4× into a temp frame cropped to `area` (node-local {x,y,w,h}); screenshot the returned id, then delete it.
function zoomCheck(nodes, area, scale = 4) {
  const spot = { x: 0, y: -4000 };
  const tmp = figma.createFrame(); tmp.name = 'TMP zoom'; tmp.x = spot.x; tmp.y = spot.y;
  tmp.resize(nodes.length * (area.w * scale + 10) + 10, area.h * scale + 20); tmp.clipsContent = true;
  nodes.forEach((n, i) => { const holder = figma.createFrame(); tmp.appendChild(holder); holder.resize(area.w * scale, area.h * scale);
    holder.x = 10 + i * (area.w * scale + 10); holder.y = 10; holder.clipsContent = true;
    const c = n.clone(); holder.appendChild(c); c.rescale(scale); c.x = -area.x * scale; c.y = -area.y * scale; });
  return tmp.id; // remember to remove: (await figma.getNodeByIdAsync(id)).remove()
}
