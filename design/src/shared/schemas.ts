// Single source of truth for tool inputs and the render_tree DSL. The server
// validates with these schemas; the plugin only imports the inferred types.
import { z } from 'zod';

// ---------------------------------------------------------------- primitives

export const VarRef = z.strictObject({
  var: z
    .string()
    .describe('Local variable name ("color/primary"), "Collection/name", or a "VariableID:..." id'),
});
export const NumOrVar = z.union([z.number(), VarRef]);

const ColorString = z.string().describe('#RGB, #RRGGBB, #RRGGBBAA, rgb() or rgba()');
const ScaleMode = z.enum(['FILL', 'FIT', 'CROP', 'TILE']);

export const PaintInput = z.union([
  ColorString,
  VarRef,
  z.strictObject({ style: z.string().describe('Local paint style name') }),
  z.strictObject({
    gradient: z.enum(['LINEAR', 'RADIAL', 'ANGULAR', 'DIAMOND']),
    angle: z.number().optional().describe('CSS degrees for LINEAR; default 180 (top → bottom)'),
    stops: z.array(z.strictObject({ color: ColorString, position: z.number().min(0).max(1) })).min(2),
  }),
  z.strictObject({
    image: z.string().describe('http(s) URL, data: URI or absolute local file path (PNG/JPEG/GIF)'),
    scaleMode: ScaleMode.optional(),
  }),
  z.strictObject({ imageBase64: z.string(), scaleMode: ScaleMode.optional() }),
]);
export const Fill = z.union([PaintInput, z.array(PaintInput)]);

const Side4 = <T extends z.ZodType>(t: T) => z.union([t, z.tuple([t, t, t, t])]);

export const Stroke = z.strictObject({
  color: Fill,
  width: Side4(NumOrVar).optional().describe('Number, or [top, right, bottom, left]'),
  align: z.enum(['INSIDE', 'OUTSIDE', 'CENTER']).optional(),
  dash: z.array(z.number()).optional(),
});

export const Shadow = z.strictObject({
  type: z.enum(['DROP', 'INNER']).optional(),
  color: ColorString.optional().describe('Default #0000001A'),
  x: z.number().optional(),
  y: z.number().optional(),
  blur: z.number().optional(),
  spread: z.number().optional(),
});
export const Effects = z.union([
  z.enum(['none', 'sm', 'md', 'lg', 'xl']).describe('Shadow preset (Tailwind-like)'),
  z.strictObject({ style: z.string().describe('Local effect style name') }),
  z.array(
    z.union([
      Shadow,
      z.strictObject({ layerBlur: z.number() }),
      z.strictObject({ backgroundBlur: z.number().describe('Frosted glass') }),
    ]),
  ),
]);

const Sizing = z.enum(['FIXED', 'HUG', 'FILL']);

export const GridSpec = z.strictObject({
  pattern: z.enum(['COLUMNS', 'ROWS', 'GRID']),
  count: z.union([z.number().int().min(1), z.literal('auto')]).optional().describe('Columns/rows; default 4 columns, "auto" = Infinity'),
  margin: z.number().min(0).optional().describe('Outer margin (STRETCH) or offset; default 16'),
  size: z.number().min(1).optional().describe('Column/row width for non-STRETCH alignment, or GRID cell size'),
  alignment: z.enum(['STRETCH', 'CENTER', 'MIN', 'MAX']).optional(),
  color: z.string().optional(),
  visible: z.boolean().optional(),
});
export const LayoutGrids = z.union([
  z.strictObject({ style: z.string().describe('Local grid style name') }),
  z.strictObject({ preset: z.enum(['mobile', 'tablet', 'desktop', 'baseline']).describe('file-standards §4 presets') }),
  z.array(GridSpec),
]);

// ---------------------------------------------------------------- property groups

const baseProps = {
  name: z.string().optional(),
  x: z.number().optional().describe('Only for absolute children, non-auto-layout parents or the root'),
  y: z.number().optional(),
  width: NumOrVar.optional(),
  height: NumOrVar.optional(),
  widthMode: Sizing.optional().describe('FILL needs an auto-layout parent; HUG needs auto layout or text'),
  heightMode: Sizing.optional(),
  minWidth: NumOrVar.optional(),
  maxWidth: NumOrVar.optional(),
  minHeight: NumOrVar.optional(),
  maxHeight: NumOrVar.optional(),
  absolute: z.boolean().optional().describe('Absolute position inside an auto-layout parent'),
  locked: z.boolean().optional().describe('Lock layer against canvas selection/drag'),
  rotation: z.number().optional().describe('Degrees, counter-clockwise'),
  opacity: NumOrVar.optional().describe('0..1'),
  visible: z.boolean().optional(),
  fill: Fill.optional(),
  stroke: Stroke.optional(),
  radius: Side4(NumOrVar).optional().describe('Number, or [topLeft, topRight, bottomRight, bottomLeft]'),
  effects: Effects.optional(),
};

const frameProps = {
  layout: z.enum(['HORIZONTAL', 'VERTICAL', 'NONE']).optional().describe('Auto layout direction'),
  gap: z.union([NumOrVar, z.literal('AUTO')]).optional().describe('"AUTO" = space between'),
  counterGap: NumOrVar.optional().describe('Gap between wrapped rows'),
  wrap: z.boolean().optional(),
  padding: z
    .union([NumOrVar, z.tuple([NumOrVar, NumOrVar]), z.tuple([NumOrVar, NumOrVar, NumOrVar, NumOrVar])])
    .optional()
    .describe('All, [vertical, horizontal] or [top, right, bottom, left]'),
  paddingTop: NumOrVar.optional(),
  paddingRight: NumOrVar.optional(),
  paddingBottom: NumOrVar.optional(),
  paddingLeft: NumOrVar.optional(),
  justify: z.enum(['START', 'CENTER', 'END', 'SPACE_BETWEEN']).optional().describe('Primary axis'),
  align: z.enum(['START', 'CENTER', 'END', 'BASELINE']).optional().describe('Counter axis'),
  clip: z.boolean().optional(),
  variableModes: z.record(z.string(), z.string()).optional().describe('{ "Collection": "Mode" }, e.g. dark mode'),
  layoutGrids: LayoutGrids.optional().describe('Layout grids: [{pattern, count, gutter, margin}], { preset } or { style }'),
};

const textProps = {
  text: z.string(),
  fontFamily: z.string().optional().describe('Default: render_tree defaultFont, else Inter'),
  fontStyle: z.string().optional().describe('Exact style, e.g. "Semi Bold"'),
  fontWeight: z.union([z.number(), z.string()]).optional().describe('100-900, mapped to a style'),
  fontSize: NumOrVar.optional(),
  color: Fill.optional().describe('Text fill (alias of fill)'),
  lineHeight: z.union([z.number(), z.string()]).optional().describe('px number, "150%" or "AUTO"'),
  letterSpacing: z.union([z.number(), z.string()]).optional().describe('px number or "-2%"'),
  textAlign: z.enum(['LEFT', 'CENTER', 'RIGHT', 'JUSTIFIED']).optional(),
  verticalAlign: z.enum(['TOP', 'CENTER', 'BOTTOM']).optional(),
  textCase: z.enum(['ORIGINAL', 'UPPER', 'LOWER', 'TITLE']).optional(),
  decoration: z.enum(['NONE', 'UNDERLINE', 'STRIKETHROUGH']).optional(),
  maxLines: z.number().int().positive().optional().describe('Truncate with ellipsis'),
  textStyle: z.string().optional().describe('Local text style name'),
};

const instanceProps = {
  component: z.string().describe('Component or component set: node id, published key, or local name'),
  variant: z.record(z.string(), z.string()).optional().describe('{ "Size": "Large" }'),
  properties: z
    .record(z.string(), z.union([z.string(), z.boolean()]))
    .optional()
    .describe('Component properties by name (the "#id" suffix is optional)'),
  texts: z.record(z.string(), z.string()).optional().describe('{ "text layer name": "new text" }'),
};

// ---------------------------------------------------------------- tree DSL

const FrameBase = z.strictObject({
  type: z.literal('frame'),
  ...baseProps,
  ...frameProps,
  component: z.boolean().optional().describe('Create a COMPONENT instead of a frame'),
  description: z.string().optional().describe('Component description'),
});
export const TextSpec = z.strictObject({ type: z.literal('text'), ...baseProps, ...textProps });
export const RectSpec = z.strictObject({ type: z.literal('rect'), ...baseProps });
export const EllipseSpec = z.strictObject({ type: z.literal('ellipse'), ...baseProps });
export const SvgSpec = z.strictObject({
  type: z.literal('svg'),
  ...baseProps,
  svg: z.string().describe('Full <svg> markup, e.g. a Lucide icon'),
  color: ColorString.optional().describe('Recolor every solid fill/stroke inside the SVG'),
});
export const ImageSpec = z.strictObject({
  type: z.literal('image'),
  ...baseProps,
  src: z.string().optional().describe('http(s) URL, data: URI or absolute local path'),
  imageBase64: z.string().optional(),
  scaleMode: ScaleMode.optional(),
});
export const InstanceSpec = z.strictObject({ type: z.literal('instance'), ...baseProps, ...instanceProps });
// Sections group screens of one flow (file-standards.md §5). Only valid on a
// page or inside another section; children without x/y flow left → right.
const SectionBase = z.strictObject({
  type: z.literal('section'),
  name: z.string().optional().describe('Flow name, e.g. "Checkout"'),
  x: z.number().optional(),
  y: z.number().optional(),
  width: z.number().optional().describe('Default: fit the children'),
  height: z.number().optional(),
  fill: Fill.optional(),
  gap: z.number().min(0).optional().describe('Space between auto-placed children; default 200'),
  padding: z.number().min(0).optional().describe('Default 80'),
});

export type FrameSpec = z.infer<typeof FrameBase> & { children?: TreeNode[] };
export type TextSpec = z.infer<typeof TextSpec>;
export type SvgSpec = z.infer<typeof SvgSpec>;
export type ImageSpec = z.infer<typeof ImageSpec>;
export type InstanceSpec = z.infer<typeof InstanceSpec>;
export type SectionSpec = z.infer<typeof SectionBase> & { children?: TreeNode[] };
export type TreeNode =
  | FrameSpec
  | TextSpec
  | z.infer<typeof RectSpec>
  | z.infer<typeof EllipseSpec>
  | SvgSpec
  | ImageSpec
  | InstanceSpec
  | SectionSpec;

// Recursive: declared through z.lazy with an explicit type to break the cycle.
export const TreeNode: z.ZodType<TreeNode> = z.lazy(() => TreeNodeUnion);
export const FrameSpec = FrameBase.extend({ children: z.array(TreeNode).optional() });
export const SectionSpec = SectionBase.extend({ children: z.array(TreeNode).optional() });
const TreeNodeUnion = z.discriminatedUnion('type', [
  SectionSpec,
  FrameSpec,
  TextSpec,
  RectSpec,
  EllipseSpec,
  SvgSpec,
  ImageSpec,
  InstanceSpec,
]);

export type PaintInput = z.infer<typeof PaintInput>;
export type FillInput = z.infer<typeof Fill>;
export type NumOrVar = z.infer<typeof NumOrVar>;

// Every property the update tool can patch onto an existing node.
export const UpdateProps = z.strictObject({
  ...baseProps,
  ...frameProps,
  ...textProps,
  text: z.string().optional(),
  ...instanceProps,
  component: z.string().optional().describe('Instances only: swap to this component'),
  description: z.string().optional(),
});
export type UpdateProps = z.infer<typeof UpdateProps>;

// Union of every spec's properties, used internally by the plugin appliers.
export type AnyProps = Partial<UpdateProps> & {
  type?: TreeNode['type'];
  svg?: string;
  src?: string;
  imageBase64?: string;
  scaleMode?: z.infer<typeof ScaleMode>;
  children?: TreeNode[];
};

// ---------------------------------------------------------------- tool inputs

const NodeId = z.string().describe('Node id, e.g. "12:34"');

export const GetNodeInput = z.object({
  ids: z.array(NodeId).min(1),
  depth: z.number().int().min(0).max(12).default(2).describe('Child levels to include'),
  maxNodes: z.number().int().min(1).max(2000).default(300),
});
export const GetSelectionInput = z.object({
  depth: z.number().int().min(0).max(12).default(1),
  maxNodes: z.number().int().min(1).max(2000).default(300),
});
export const FindNodesInput = z.object({
  rootId: NodeId.optional().describe('Default: current page'),
  types: z.array(z.string()).optional().describe('e.g. ["FRAME","TEXT","INSTANCE"]'),
  name: z.string().optional().describe('Case-insensitive substring of the layer name'),
  text: z.string().optional().describe('Case-insensitive substring of text content'),
  limit: z.number().int().min(1).max(1000).default(50),
});
export const SetPageInput = z.object({
  page: z.string().describe('Page id or exact page name'),
});
export const DesignSystemInput = z.object({
  include: z
    .array(z.enum(['variables', 'styles', 'components', 'library']))
    .default(['variables', 'styles', 'components']),
  componentLimit: z.number().int().min(1).max(2000).default(200),
  usedIn: NodeId.optional().describe('Only the variables/styles bound inside this node (like get_variable_defs)'),
});
export const ListFontsInput = z.object({
  family: z.string().optional().describe('Filter families by case-insensitive substring'),
  limit: z.number().int().min(1).max(5000).default(200),
});
export const ScreenshotInput = z.object({
  id: NodeId.optional().describe('Default: first selected node'),
  scale: z.number().min(0.05).max(4).default(0.5),
  maxSize: z.number().int().min(64).max(4096).default(1024).describe('Longest side in px'),
});
export const RenderTreeInput = z.object({
  tree: TreeNode,
  parentId: NodeId.optional().describe('Append into this frame instead of the page'),
  index: z.number().int().min(0).optional().describe('Insert position inside parentId'),
  defaultFont: z.string().optional().describe('Font family for text nodes without fontFamily'),
  select: z.boolean().default(true).describe('Select and zoom to the result'),
});
export const UpdateNodesInput = z.object({
  updates: z.array(z.object({ id: NodeId, props: UpdateProps })).min(1),
});
export const DeleteNodesInput = z.object({ ids: z.array(NodeId).min(1) });
export const MoveNodesInput = z.object({
  ids: z.array(NodeId).min(1),
  parentId: NodeId.optional().describe('New parent frame/page; omit to keep the parent'),
  index: z.number().int().min(0).optional(),
  x: z.number().optional(),
  y: z.number().optional(),
});
export const CloneNodeInput = z.object({
  id: NodeId,
  parentId: NodeId.optional(),
  index: z.number().int().min(0).optional(),
  x: z.number().optional(),
  y: z.number().optional(),
});
export const SelectNodesInput = z.object({
  ids: z.array(NodeId),
  zoom: z.boolean().default(true),
});
export const ExecuteCodeInput = z.object({
  code: z
    .string()
    .describe('Body of an async function. Globals: figma, h (helpers). Use top-level await and `return`.'),
  timeoutMs: z.number().int().min(1000).max(300000).default(30000),
});

// figma-ui-flow Stage 7: one read-only call returns the QA report.
export const AuditInput = z.object({
  rootId: NodeId.optional().describe('Audit this subtree; default: the current page'),
  checks: z
    .array(z.enum(['names', 'tokens', 'layout', 'a11y', 'hygiene', 'content']))
    .optional()
    .describe('Groups to run; default: all of them'),
  limit: z.number().int().min(1).max(500).default(50).describe('Sample size per issue kind'),
  format: z.enum(['json', 'markdown']).default('json').describe('markdown = the skill QA report template'),
});

// figma-ui-flow Stage 2: variables in one call (collection, modes,
// aliases, scopes). Figma rejects addMode when the plan allows one mode only;
// that case is reported as a warning, not a failure.
export const CreateVariablesInput = z.object({
  collection: z.string().min(1).describe('Collection name; created when missing'),
  modes: z.array(z.string().min(1)).optional().describe('Mode names; the first is the default. Default: ["Default"]'),
  variables: z
    .array(
      z.strictObject({
        name: z.string().min(1).describe('Slash path, e.g. "color/blue/600" or "space/4"'),
        type: z.enum(['COLOR', 'FLOAT', 'STRING', 'BOOLEAN']),
        scopes: z.array(z.string()).optional().describe('e.g. ["FRAME_FILL","SHAPE_FILL"]; [] hides it from pickers (primitive)'),
        values: z
          .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.strictObject({ alias: z.string() })]))
          .describe('One value per mode name: hex/number/string/boolean, or { alias: "other/name" }'),
      }),
    )
    .min(1),
  onExisting: z
    .enum(['error', 'skip', 'update'])
    .default('error')
    .describe('A variable with the same name already in this collection: fail, keep it, or overwrite its values/scopes'),
});

// figma-ui-flow Stage 1: the standard page skeleton and page maintenance.
export const ManagePagesInput = z.object({
  template: z.boolean().optional().describe('Create the missing pages of the 9-page master skeleton'),
  create: z.array(z.string().min(1)).optional(),
  rename: z.array(z.strictObject({ page: z.string(), to: z.string().min(1) })).optional(),
  delete: z.array(z.string()).optional(),
  order: z.array(z.string()).optional().describe('These pages first, in this order; the rest follow'),
  dryRun: z.boolean().default(false).describe('Return the plan without touching the file'),
});

// figma-ui-flow rule #3 "search before you create".
export const SearchDesignSystemInput = z.object({
  query: z.string().describe('Name or words, e.g. "button primary", "text/secondary", "elevation"'),
  kinds: z
    .array(z.enum(['component', 'variable', 'style']))
    .default(['component', 'variable', 'style']),
  includeLibraries: z.boolean().default(false).describe('Also search variables of enabled team libraries'),
  limit: z.number().int().min(1).max(200).default(20),
});

const StyleName = z.string().min(1).describe('Slash path, e.g. "body/md" or "elevation/2"');
export const StyleSpec = z.discriminatedUnion('kind', [
  z.strictObject({
    kind: z.literal('text'),
    name: StyleName,
    fontFamily: z.string().default('Inter'),
    fontStyle: z.string().optional().describe('Exact style, e.g. "Semi Bold"'),
    fontWeight: z.union([z.number(), z.string()]).optional(),
    fontSize: NumOrVar,
    lineHeight: z.union([z.number(), z.string()]).optional().describe('px, "150%" or "AUTO"'),
    letterSpacing: z.union([z.number(), z.string()]).optional().describe('px or "-2%"'),
    textCase: z.enum(['ORIGINAL', 'UPPER', 'LOWER', 'TITLE']).optional(),
    decoration: z.enum(['NONE', 'UNDERLINE', 'STRIKETHROUGH']).optional(),
    description: z.string().optional(),
  }),
  z.strictObject({ kind: z.literal('paint'), name: StyleName, fill: Fill, description: z.string().optional() }),
  z.strictObject({ kind: z.literal('effect'), name: StyleName, effects: Effects, description: z.string().optional() }),
  z.strictObject({ kind: z.literal('grid'), name: StyleName, grids: LayoutGrids, description: z.string().optional() }),
]);
const OnExisting = z.enum(['error', 'skip', 'update']).default('error').describe('When a style/variable with the same name exists');
export const CreateStylesInput = z.object({
  styles: z.array(StyleSpec).min(1),
  onExisting: OnExisting,
});

export const ImportTokensInput = z.object({
  tokens: z.record(z.string(), z.unknown()).optional().describe('DTCG JSON tree (figma-ui-flow assets/tokens.example.json format)'),
  path: z.string().optional().describe('Absolute path of a DTCG JSON file on this machine (read by the server)'),
  dryRun: z.boolean().default(false).describe('Return the plan and lint result without touching the file'),
  onExisting: z.enum(['error', 'skip', 'update']).default('skip'),
  allowLintErrors: z.boolean().default(false).describe('Import even when check_tokens rules report errors'),
});

export const ExportTokensInput = z.object({
  format: z.enum(['json', 'css', 'swift', 'kotlin']).default('json'),
  collections: z.array(z.string()).optional().describe('Default: every local collection'),
  path: z.string().optional().describe('Also write the result to this absolute file path'),
});

export const RenderFoundationsInput = z.object({
  collections: z.array(z.string()).optional().describe('Default: every local collection'),
});

const ComponentPropertySpec = z.strictObject({
  name: z.string().min(1).describe('e.g. "Label", "Has icon", "Icon"'),
  type: z.enum(['TEXT', 'BOOLEAN', 'INSTANCE_SWAP']),
  default: z.union([z.string(), z.boolean()]).describe('TEXT: text · BOOLEAN: true/false · INSTANCE_SWAP: component id/key/name'),
  targets: z.array(z.string()).default([]).describe('Layer names in every variant this property drives'),
  preferred: z.array(z.string()).optional().describe('INSTANCE_SWAP preferred components (ids/keys/names)'),
});
export const CreateComponentSetInput = z.object({
  name: z.string().min(1).describe('e.g. "Button"'),
  description: z.string().optional().describe('When to use / not use, link to docs'),
  variants: z
    .array(
      z.strictObject({
        props: z.record(z.string(), z.string()).describe('{ "Size": "md", "State": "Default" }'),
        tree: FrameSpec.describe('Variant content as a render_tree frame (auto layout, tokens)'),
      }),
    )
    .min(1),
  properties: z.array(ComponentPropertySpec).default([]),
  parentId: NodeId.optional().describe('Section/frame to place the set in; default the page'),
});

export const StressTestInput = z.object({
  id: NodeId.describe('Frame or component to stress'),
  cases: z
    .array(z.enum(['long-text', 'large-text', 'narrow', 'wide', 'empty-text']))
    .default(['long-text', 'large-text', 'narrow']),
  modes: z.record(z.string(), z.string()).optional().describe('Also render one copy with these variable modes, e.g. { "Semantic": "Dark" }'),
  page: z.string().optional().describe('Page for the copies; default "🧪 Explore" when it exists, else the current page'),
});

const Trigger = z.union([
  z.enum(['ON_CLICK', 'ON_HOVER', 'ON_PRESS', 'ON_DRAG']),
  z.strictObject({ afterTimeout: z.number().min(0).describe('ms') }),
]);
const Reaction = z.strictObject({
  trigger: Trigger.default('ON_CLICK'),
  action: z.enum(['NAVIGATE', 'OVERLAY', 'SWAP', 'SCROLL_TO', 'CHANGE_TO', 'BACK', 'CLOSE', 'URL', 'SET_VARIABLE', 'SET_VARIABLE_MODE']),
  destination: NodeId.optional().describe('Frame (NAVIGATE/OVERLAY/SWAP/SCROLL_TO) or variant (CHANGE_TO)'),
  url: z.string().optional(),
  variable: z.string().optional().describe('SET_VARIABLE target (name or id)'),
  value: z.union([z.string(), z.number(), z.boolean()]).optional(),
  collection: z.string().optional().describe('SET_VARIABLE_MODE collection'),
  mode: z.string().optional(),
  transition: z
    .strictObject({
      type: z.enum(['INSTANT', 'DISSOLVE', 'SMART_ANIMATE', 'MOVE_IN', 'MOVE_OUT', 'PUSH', 'SLIDE_IN', 'SLIDE_OUT']).default('SMART_ANIMATE'),
      direction: z.enum(['LEFT', 'RIGHT', 'TOP', 'BOTTOM']).optional(),
      duration: NumOrVar.default(250).describe('ms, or a motion token { var: "duration/base" }'),
      easing: z.string().default('standard').describe('standard | decelerate | accelerate | spring | linear | Figma easing | cubic-bezier()'),
    })
    .optional(),
});
export const SetInteractionsInput = z.object({
  items: z.array(z.strictObject({ id: NodeId, reactions: z.array(Reaction), replace: z.boolean().default(true) })).min(1),
  flowStart: z.strictObject({ id: NodeId, name: z.string() }).optional().describe('Mark a frame as a prototype flow starting point'),
});

export const BindVariablesInput = z.object({
  rootId: NodeId.describe('Subtree to fix'),
  fields: z.array(z.enum(['fills', 'strokes', 'spacing', 'radius'])).default(['fills', 'strokes', 'spacing', 'radius']),
  map: z
    .record(z.string(), z.string())
    .optional()
    .describe('Explicit "#2563EB" → "color/action/primary" or "16" → "space/4"; wins over auto matching'),
  auto: z.boolean().default(true).describe('Match the nearest in-scope Semantic variable'),
  tolerance: z.number().min(0).max(10).default(2).describe('Max colour distance ΔE for auto matching'),
  dryRun: z.boolean().default(true).describe('Report what would change; set false to apply'),
  limit: z.number().int().min(1).max(500).default(100),
});

export const RenameByRuleInput = z.object({
  rootId: NodeId.describe('Subtree to rename'),
  rules: z
    .array(z.strictObject({ match: z.string().describe('RegExp on the layer name'), to: z.string().describe('Replacement, $1 for groups'), types: z.array(z.string()).optional() }))
    .default([]),
  auto: z.boolean().default(true).describe('Give role names (label/…, icon/…, row, stack) to layers with Figma default names'),
  dryRun: z.boolean().default(true),
  limit: z.number().int().min(1).max(1000).default(200),
});

export const AnnotateInput = z.object({
  items: z
    .array(
      z.strictObject({
        id: NodeId,
        label: z.string().describe('Markdown: behaviour, logic, edge case, motion, a11y label'),
        properties: z.array(z.string()).optional().describe('Pinned properties, e.g. ["fills","itemSpacing","padding"]'),
        category: z.string().optional().describe('Annotation category label, e.g. "Interaction"'),
      }),
    )
    .min(1),
  replace: z.boolean().default(false).describe('Replace the node annotations instead of appending'),
});

export const SetDevStatusInput = z.object({
  ids: z.array(NodeId).min(1).describe('Sections or top-level frames'),
  status: z.enum(['READY_FOR_DEV', 'COMPLETED', 'NONE']),
  description: z.string().optional(),
});

export const ExportAssetsInput = z.object({
  ids: z.array(NodeId).min(1),
  format: z.enum(['PNG', 'JPG', 'SVG', 'PDF']).default('PNG'),
  scales: z.array(z.number().min(0.5).max(4)).default([1, 2, 3]).describe('PNG/JPG only'),
  outDir: z.string().describe('Absolute directory to write the files into'),
});

export type GetNodeInput = z.infer<typeof GetNodeInput>;
export type GetSelectionInput = z.infer<typeof GetSelectionInput>;
export type FindNodesInput = z.infer<typeof FindNodesInput>;
export type SetPageInput = z.infer<typeof SetPageInput>;
export type DesignSystemInput = z.infer<typeof DesignSystemInput>;
export type ListFontsInput = z.infer<typeof ListFontsInput>;
export type ScreenshotInput = z.infer<typeof ScreenshotInput>;
export type RenderTreeInput = z.infer<typeof RenderTreeInput>;
export type UpdateNodesInput = z.infer<typeof UpdateNodesInput>;
export type DeleteNodesInput = z.infer<typeof DeleteNodesInput>;
export type MoveNodesInput = z.infer<typeof MoveNodesInput>;
export type CloneNodeInput = z.infer<typeof CloneNodeInput>;
export type SelectNodesInput = z.infer<typeof SelectNodesInput>;
export type ExecuteCodeInput = z.infer<typeof ExecuteCodeInput>;
export type AuditInput = z.infer<typeof AuditInput>;
export type ManagePagesInput = z.infer<typeof ManagePagesInput>;
export type CreateVariablesInput = z.infer<typeof CreateVariablesInput>;
export type SearchDesignSystemInput = z.infer<typeof SearchDesignSystemInput>;
export type StyleSpec = z.infer<typeof StyleSpec>;
export type CreateStylesInput = z.infer<typeof CreateStylesInput>;
export type ImportTokensInput = z.infer<typeof ImportTokensInput>;
export type ExportTokensInput = z.infer<typeof ExportTokensInput>;
export type RenderFoundationsInput = z.infer<typeof RenderFoundationsInput>;
export type CreateComponentSetInput = z.infer<typeof CreateComponentSetInput>;
export type StressTestInput = z.infer<typeof StressTestInput>;
export type SetInteractionsInput = z.infer<typeof SetInteractionsInput>;
export type BindVariablesInput = z.infer<typeof BindVariablesInput>;
export type RenameByRuleInput = z.infer<typeof RenameByRuleInput>;
export type AnnotateInput = z.infer<typeof AnnotateInput>;
export type SetDevStatusInput = z.infer<typeof SetDevStatusInput>;
export type ExportAssetsInput = z.infer<typeof ExportAssetsInput>;
