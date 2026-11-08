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
