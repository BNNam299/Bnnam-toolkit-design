# Plugin API recipes for `execute_code`

These run unchanged in `execute_code` (globals `figma`, `h`) and in the remote Figma MCP's `use_figma`. Prefer the dedicated tools first: `create_variables` / `import_tokens` (§2), `bind_variables` (§3), `render_tree` (§4–5), `create_component_set` (§6), `audit_design` (§7). Reach for these only when a tool does not cover the case.

Helpers available in `execute_code`: `h.solid(hex)`, `h.rgb(hex)`, `h.hex(rgb)`, `h.getNode(id)`, `h.loadFont(fontName)`, `h.loadNodeFonts(text)`, `h.resolveFont(family, style)`, `h.serialize(node, depth)`, `h.summary(node)`, `h.freeSpot()`.

> Reference samples. When the API throws, read the error message and the current Plugin API docs — don't retry the same guess.

## 1. Switch page and get a node
```js
const page = figma.root.children.find(p => p.name === '🧪 Explore');
await figma.setCurrentPageAsync(page);          // do not assign figma.currentPage directly
const node = await figma.getNodeByIdAsync('12:34');
```

## 2. Variables: collection, modes, alias, scopes
```js
// Primitives — 1 mode
const prim = figma.variables.createVariableCollection('Primitives');
prim.renameMode(prim.modes[0].modeId, 'Value');
const blue600 = figma.variables.createVariable('color/blue/600', prim, 'COLOR');
blue600.setValueForMode(prim.modes[0].modeId, { r: 0.145, g: 0.388, b: 0.922, a: 1 });
blue600.scopes = [];                             // primitive: hidden from pickers, alias-only

// Semantic — Light/Dark
const sem = figma.variables.createVariableCollection('Semantic');
const light = sem.modes[0].modeId; sem.renameMode(light, 'Light');
const dark = sem.addMode('Dark');
const actionPrimary = figma.variables.createVariable('color/action/primary', sem, 'COLOR');
actionPrimary.setValueForMode(light, figma.variables.createVariableAlias(blue600));
actionPrimary.setValueForMode(dark,  figma.variables.createVariableAlias(blue400));
actionPrimary.scopes = ['FRAME_FILL', 'SHAPE_FILL'];

// Numbers: spacing / radius
const space4 = figma.variables.createVariable('space/4', sem, 'FLOAT');   // 16
space4.scopes = ['GAP', 'WIDTH_HEIGHT'];
```
Every Semantic variable needs a non-empty `scopes` by role: `space/*` → `GAP`, `radius/*` → `CORNER_RADIUS`, `type/*` (font sizes) → `FONT_SIZE`, `border/width/*` → `STROKE_FLOAT`, `size/*` → `WIDTH_HEIGHT`. `scopes = []` hides it from the pickers and `audit_design` reports every layer bound to it as `primitive-bound`. `import_tokens` infers these scopes; set them yourself when creating variables in code.

Use `v.resolvedType` (not `v.type`), `createVariable(name, collectionNode, type)` (the collection node, not its id), and return `{id, name}` rather than a `Variable` object.
Plugin API colors are 0–1, not 0–255. Converting hex: `r = parseInt(hex.slice(1,3),16)/255`.

## 3. Bind a variable to a node
```js
// Fill / stroke: must create a new paint
const base = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
frame.fills = [figma.variables.setBoundVariableForPaint(base, 'color', actionPrimary)];
// Never write { ...paint, boundVariables: { color: alias } } by hand, and never
// clone a bound paint, change its color and reassign it: when the binding is
// unchanged Figma keeps that colour and renders it (audit: stale-paint).

// Numeric properties
frame.setBoundVariable('itemSpacing', space2);
frame.setBoundVariable('paddingLeft', space4);   // same for paddingRight/Top/Bottom
frame.setBoundVariable('topLeftRadius', radiusMd); // and the other 3 corners
```

## 4. Auto Layout
```js
const f = figma.createFrame();
f.name = 'Card';
f.layoutMode = 'VERTICAL';             // 'HORIZONTAL' | 'VERTICAL' | 'NONE' (| 'GRID' if available)
f.primaryAxisSizingMode = 'AUTO';      // hug along the primary axis
f.counterAxisSizingMode = 'FIXED';
f.itemSpacing = 8;
f.paddingTop = f.paddingBottom = f.paddingLeft = f.paddingRight = 16;
f.primaryAxisAlignItems = 'MIN';       // MIN | CENTER | MAX | SPACE_BETWEEN
f.counterAxisAlignItems = 'MIN';
parent.appendChild(f);
f.layoutSizingHorizontal = 'FILL';     // set only AFTER it is inside an Auto Layout parent
f.clipsContent = true;
```

## 5. Text
```js
await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' }); // style names contain spaces
const t = figma.createText();
t.fontName = { family: 'Inter', style: 'Semi Bold' };
t.characters = 'Title';
t.textAutoResize = 'WIDTH_AND_HEIGHT'; // or 'HEIGHT' when the text fills horizontally
await t.setTextStyleIdAsync(styleHeadingMd.id); // prefer a style over setting each property
```
Always `loadFontAsync` every font before changing `characters` or text properties, even on existing text.

## 6. Component, variants, properties
```js
const make = (state) => {
  const c = figma.createComponent();
  c.name = `Size=md, State=${state}`;
  // ... build Auto Layout, bind tokens
  return c;
};
const set = figma.combineAsVariants(['default','pressed','disabled'].map(make), page);
set.name = 'Button';

// Text property and boolean property
const labelKey = set.addComponentProperty('Label', 'TEXT', 'Button');
const iconKey  = set.addComponentProperty('Has icon', 'BOOLEAN', false);
for (const v of set.children) {
  v.findOne(n => n.name === 'label').componentPropertyReferences = { characters: labelKey };
  v.findOne(n => n.name === 'icon').componentPropertyReferences  = { visible: iconKey };
}
set.description = 'Primary action button. Use one Primary button per screen.';
```

## 7. Read-only audit (Stage 7 — normally `audit_design`)
```js
const page = await figma.getNodeByIdAsync(PAGE_ID);
const issues = [];
const DEFAULT = /^(Frame|Rectangle|Ellipse|Group|Vector|Text|Line|Polygon|Star) \d+$/;
page.findAll(n => {
  if (DEFAULT.test(n.name)) issues.push({ id: n.id, type: 'default-name', name: n.name });
  if ('fills' in n && Array.isArray(n.fills)) {
    n.fills.forEach((p, i) => {
      if (p.type === 'SOLID' && p.visible !== false && !(n.boundVariables?.fills?.[i]) && !n.fillStyleId)
        issues.push({ id: n.id, type: 'raw-fill', name: n.name });
    });
  }
  if (n.type === 'FRAME' && n.layoutMode === 'NONE' && n.children.length > 1 && !n.name.startsWith('decor/'))
    issues.push({ id: n.id, type: 'no-autolayout', name: n.name });
  return false;
});
return { total: issues.length, sample: issues.slice(0, 50) };
```
Return a capped sample (50) to avoid flooding context; the total is for the report.
