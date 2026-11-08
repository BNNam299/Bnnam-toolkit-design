import type {
  DesignSystemInput,
  FindNodesInput,
  GetNodeInput,
  GetSelectionInput,
  ListFontsInput,
  ScreenshotInput,
  SetPageInput,
} from '../../shared/schemas';
import { toHex } from '../../shared/values';
import { listFonts } from '../fonts';
import { Serializer, summary } from '../serialize';
import { getNode, getSceneNode } from '../util';

export async function getDocumentInfo() {
  const page = figma.currentPage;
  return {
    fileName: figma.root.name,
    user: figma.currentUser?.name ?? null,
    currentPage: { id: page.id, name: page.name },
    pages: figma.root.children.map((p) => ({ id: p.id, name: p.name })),
    selection: page.selection.map(summary),
    topLevel: page.children.slice(0, 150).map(summary),
    topLevelCount: page.children.length,
  };
}

export async function setCurrentPage(p: SetPageInput) {
  const page = figma.root.children.find((x) => x.id === p.page || x.name === p.page);
  if (!page) throw new Error(`Page "${p.page}" not found. Pages: ${figma.root.children.map((x) => x.name).join(', ')}.`);
  await figma.setCurrentPageAsync(page);
  return { currentPage: { id: page.id, name: page.name }, topLevel: page.children.slice(0, 150).map(summary) };
}

export async function getSelection(p: GetSelectionInput) {
  const s = new Serializer(p.maxNodes);
  const nodes = [];
  for (const n of figma.currentPage.selection) nodes.push(await s.node(n, p.depth));
  return { count: nodes.length, nodes, truncated: s.truncated };
}

export async function getNodes(p: GetNodeInput) {
  const s = new Serializer(p.maxNodes);
  const nodes = [];
  for (const id of p.ids) nodes.push(await s.node(await getNode(id), p.depth));
  return { nodes, truncated: s.truncated, hint: s.truncated ? 'Lower depth or query child ids.' : undefined };
}

export async function findNodes(p: FindNodesInput) {
  const root = p.rootId ? await getNode(p.rootId) : figma.currentPage;
  if (!('findAll' in root)) throw new Error(`Node ${root.id} has no children to search.`);
  const name = p.name?.toLowerCase();
  const text = p.text?.toLowerCase();
  const match = (n: SceneNode) =>
    (!name || n.name.toLowerCase().includes(name)) &&
    (!text || (n.type === 'TEXT' && n.characters.toLowerCase().includes(text)));
  const container = root as ChildrenMixin;
  const candidates = p.types?.length
    ? container.findAllWithCriteria({ types: p.types as NodeType[] })
    : container.findAll(() => true);
  const hits = (candidates as SceneNode[]).filter(match);
  return { total: hits.length, nodes: hits.slice(0, p.limit).map(summary) };
}

// get_variable_defs equivalent: tokens actually bound inside one subtree.
async function usedIn(id: string) {
  const root = await getNode(id);
  const nodes: BaseNode[] = [root, ...('findAll' in root ? (root as ChildrenMixin).findAll(() => true) : [])];
  const varUses = new Map<string, number>();
  const styleUses = new Map<string, number>();
  const collect = (value: unknown) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) return value.forEach(collect);
    const alias = value as VariableAlias;
    if (alias.type === 'VARIABLE_ALIAS') varUses.set(alias.id, (varUses.get(alias.id) ?? 0) + 1);
    else Object.values(value).forEach(collect);
  };
  for (const n of nodes) {
    // Paint bindings are mirrored in node.boundVariables.fills/strokes, so
    // reading the paints too would count them twice.
    collect((n as SceneNode & { boundVariables?: unknown }).boundVariables);
    for (const key of ['fillStyleId', 'strokeStyleId', 'effectStyleId', 'textStyleId', 'gridStyleId'] as const) {
      const v = (n as unknown as Record<string, unknown>)[key];
      if (typeof v === 'string' && v) styleUses.set(v, (styleUses.get(v) ?? 0) + 1);
    }
  }
  const variables = [];
  for (const [vid, count] of varUses) {
    const v = await figma.variables.getVariableByIdAsync(vid);
    const c = v ? await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId) : null;
    variables.push({ id: vid, name: v?.name ?? '(library/deleted)', collection: c?.name, type: v?.resolvedType, uses: count });
  }
  const styles = [];
  for (const [sid, count] of styleUses) {
    const s = await figma.getStyleByIdAsync(sid);
    styles.push({ id: sid, name: s?.name ?? '(library/deleted)', type: s?.type, uses: count });
  }
  return { node: { id: root.id, name: root.name }, scanned: nodes.length, variables, styles };
}

export async function getDesignSystem(p: DesignSystemInput) {
  if (p.usedIn) return usedIn(p.usedIn);
  const out: Record<string, unknown> = {};
  const inc = new Set(p.include);

  if (inc.has('variables')) {
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const vars = await figma.variables.getLocalVariablesAsync();
    const byId = new Map(vars.map((v) => [v.id, v]));
    out.variableCollections = collections.map((c) => ({
      id: c.id,
      name: c.name,
      modes: c.modes.map((m) => m.name),
      variables: c.variableIds
        .map((id) => byId.get(id))
        .filter((v): v is Variable => !!v)
        .map((v) => ({
          name: v.name,
          type: v.resolvedType,
          scopes: v.scopes,
          values: Object.fromEntries(
            c.modes.map((m) => [m.name, variableValue(v.valuesByMode[m.modeId], byId)]),
          ),
        })),
    }));
  }

  if (inc.has('styles')) {
    const [paint, text, effect] = await Promise.all([
      figma.getLocalPaintStylesAsync(),
      figma.getLocalTextStylesAsync(),
      figma.getLocalEffectStylesAsync(),
    ]);
    out.styles = {
      paint: paint.map((s) => ({
        name: s.name,
        paints: s.paints.map((x) => (x.type === 'SOLID' ? toHex({ ...x.color, a: x.opacity ?? 1 }) : x.type)),
      })),
      text: text.map((s) => ({
        name: s.name,
        font: `${s.fontName.family} ${s.fontName.style}`,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight.unit === 'AUTO' ? 'AUTO' : s.lineHeight.unit === 'PERCENT' ? `${s.lineHeight.value}%` : s.lineHeight.value,
      })),
      effect: effect.map((s) => ({ name: s.name, effects: s.effects.map((e) => e.type) })),
    };
  }

  if (inc.has('components')) {
    await figma.loadAllPagesAsync();
    // eslint-disable-next-line @figma/figma-plugins/dynamic-page-find-method-advice -- pages loaded just above
    const nodes = figma.root.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] });
    const top = nodes.filter((n) => n.type === 'COMPONENT_SET' || n.parent?.type !== 'COMPONENT_SET');
    out.localComponents = top.slice(0, p.componentLimit).map((n) => ({
      id: n.id,
      name: n.name,
      type: n.type,
      key: n.key,
      page: pageOf(n)?.name,
      description: n.description || undefined,
      properties: Object.fromEntries(
        Object.entries(n.componentPropertyDefinitions).map(([k, d]) => [
          k,
          d.type === 'VARIANT' ? { type: d.type, options: d.variantOptions } : { type: d.type, default: d.defaultValue },
        ]),
      ),
    }));
    out.localComponentCount = top.length;

    // Library components cannot be listed by the Plugin API; report the ones
    // already used on the current page so their keys can be reused.
    const remote = new Map<string, Record<string, unknown>>();
    for (const inst of figma.currentPage.findAllWithCriteria({ types: ['INSTANCE'] })) {
      if (remote.size >= p.componentLimit) break;
      const main = await inst.getMainComponentAsync();
      if (!main?.remote) continue;
      const owner = main.parent?.type === 'COMPONENT_SET' ? main.parent : main;
      if (!remote.has(owner.key)) remote.set(owner.key, { name: owner.name, key: owner.key, type: owner.type });
    }
    out.libraryComponentsUsedOnPage = [...remote.values()];
  }

  if (inc.has('library')) {
    try {
      const libs = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
      out.libraryVariableCollections = libs.map((l) => ({ name: l.name, library: l.libraryName, key: l.key }));
    } catch (e) {
      out.libraryVariableCollections = `unavailable: ${String(e)}`;
    }
  }
  return out;
}

function variableValue(v: VariableValue, byId: Map<string, Variable>): unknown {
  if (typeof v === 'object' && v !== null) {
    if ('r' in v) return toHex(v);
    const alias = v as VariableAlias;
    if (alias.type === 'VARIABLE_ALIAS') return { alias: byId.get(alias.id)?.name ?? alias.id };
  }
  return v;
}

function pageOf(n: BaseNode): PageNode | null {
  let p: BaseNode | null = n;
  while (p && p.type !== 'PAGE') p = p.parent;
  return p as PageNode | null;
}

export async function listFontFamilies(p: ListFontsInput) {
  const fonts = await listFonts();
  const families = new Map<string, string[]>();
  for (const f of fonts) {
    const list = families.get(f.fontName.family) ?? [];
    list.push(f.fontName.style);
    families.set(f.fontName.family, list);
  }
  const q = p.family?.toLowerCase();
  const matched = [...families.entries()].filter(([fam]) => !q || fam.toLowerCase().includes(q));
  return {
    total: matched.length,
    families: matched.slice(0, p.limit).map(([family, styles]) => ({ family, styles })),
  };
}

export async function screenshot(p: ScreenshotInput) {
  const node = p.id ? await getSceneNode(p.id) : figma.currentPage.selection[0];
  if (!node) throw new Error('Nothing to capture: pass id or select a layer.');
  const longest = Math.max(node.width, node.height, 1);
  const scale = Math.min(p.scale, p.maxSize / longest);
  const bytes = await node.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: scale } });
  return {
    nodeId: node.id,
    name: node.name,
    width: Math.round(node.width * scale),
    height: Math.round(node.height * scale),
    scale,
    mimeType: 'image/png',
    base64: figma.base64Encode(bytes),
  };
}
