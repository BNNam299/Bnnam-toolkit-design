// Name-based lookups for design-system assets. One instance lives for the
// duration of a single command so repeated references hit a cache.

import { findNode } from './util';

export class Resources {
  private variables?: Promise<Map<string, Variable>>;
  private collections?: Promise<VariableCollection[]>;
  private paintStyles?: Promise<PaintStyle[]>;
  private textStyles?: Promise<TextStyle[]>;
  private effectStyles?: Promise<EffectStyle[]>;
  private gridStyles?: Promise<GridStyle[]>;
  private components = new Map<string, Promise<ComponentNode | ComponentSetNode>>();
  private images = new Map<string, string>();

  async variable(ref: string): Promise<Variable> {
    if (ref.startsWith('VariableID:')) {
      const v = await figma.variables.getVariableByIdAsync(ref);
      if (!v) throw new Error(`Variable ${ref} not found.`);
      return v;
    }
    if (!this.variables) this.variables = this.loadVariables();
    const map = await this.variables;
    const v = map.get(ref);
    if (!v) {
      const names = [...map.keys()].filter((k) => !k.includes('::')).slice(0, 40);
      throw new Error(`Variable "${ref}" not found. Some local variables: ${names.join(', ') || '(none)'}.`);
    }
    return v;
  }

  private async loadVariables(): Promise<Map<string, Variable>> {
    const [vars, collections] = await Promise.all([
      figma.variables.getLocalVariablesAsync(),
      this.collectionList(),
    ]);
    const byId = new Map(collections.map((c) => [c.id, c.name]));
    const map = new Map<string, Variable>();
    // A bare name shared by Primitives and Semantic ("space/9") must bind the
    // Semantic one: layers never bind primitives, and Primitives is usually
    // created first. "Collection/name" still reaches either.
    const isPrimitive = (v: Variable) => /primitive/i.test(byId.get(v.variableCollectionId) ?? '');
    for (const v of vars) {
      map.set(`${byId.get(v.variableCollectionId)}/${v.name}`, v);
      const seen = map.get(v.name);
      if (!seen || (isPrimitive(seen) && !isPrimitive(v))) map.set(v.name, v);
    }
    return map;
  }

  private collectionList(): Promise<VariableCollection[]> {
    if (!this.collections) this.collections = figma.variables.getLocalVariableCollectionsAsync();
    return this.collections;
  }

  async collection(name: string): Promise<VariableCollection> {
    const all = await this.collectionList();
    const c = all.find((x) => x.name === name || x.id === name);
    if (!c) throw new Error(`Variable collection "${name}" not found. Available: ${all.map((x) => x.name).join(', ')}.`);
    return c;
  }

  async paintStyle(name: string): Promise<PaintStyle> {
    if (!this.paintStyles) this.paintStyles = figma.getLocalPaintStylesAsync();
    return findStyle(await this.paintStyles, name, 'paint');
  }

  async textStyle(name: string): Promise<TextStyle> {
    if (!this.textStyles) this.textStyles = figma.getLocalTextStylesAsync();
    return findStyle(await this.textStyles, name, 'text');
  }

  async effectStyle(name: string): Promise<EffectStyle> {
    if (!this.effectStyles) this.effectStyles = figma.getLocalEffectStylesAsync();
    return findStyle(await this.effectStyles, name, 'effect');
  }

  async gridStyle(name: string): Promise<GridStyle> {
    if (!this.gridStyles) this.gridStyles = figma.getLocalGridStylesAsync();
    return findStyle(await this.gridStyles, name, 'grid');
  }

  // id ("12:34"), published key (hex string), or local name.
  component(ref: string): Promise<ComponentNode | ComponentSetNode> {
    let p = this.components.get(ref);
    if (!p) {
      p = findComponent(ref);
      this.components.set(ref, p);
    }
    return p;
  }

  imageHash(base64: string): string {
    let hash = this.images.get(base64);
    if (!hash) {
      hash = figma.createImage(figma.base64Decode(base64)).hash;
      this.images.set(base64, hash);
    }
    return hash;
  }
}

function findStyle<T extends BaseStyle>(styles: T[], name: string, kind: string): T {
  const s = styles.find((x) => x.name === name || x.id === name);
  if (!s) {
    const names = styles.map((x) => x.name).slice(0, 40);
    throw new Error(`No local ${kind} style "${name}". Available: ${names.join(', ') || '(none)'}.`);
  }
  return s;
}

async function findComponent(ref: string): Promise<ComponentNode | ComponentSetNode> {
  if (/^I?\d+:\d+/.test(ref)) {
    const node = await findNode(ref);
    if (node && (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET')) return node;
    throw new Error(`Node ${ref} is not a component or component set.`);
  }
  if (/^[0-9a-f]{20,}$/i.test(ref)) {
    try {
      return await figma.importComponentByKeyAsync(ref);
    } catch {
      return await figma.importComponentSetByKeyAsync(ref);
    }
  }
  const types: ('COMPONENT' | 'COMPONENT_SET')[] = ['COMPONENT_SET', 'COMPONENT'];
  const onPage = figma.currentPage.findAllWithCriteria({ types });
  const hit = pickByName(onPage, ref);
  if (hit) return hit;
  await figma.loadAllPagesAsync();
  // eslint-disable-next-line @figma/figma-plugins/dynamic-page-find-method-advice -- pages loaded just above
  const all = figma.root.findAllWithCriteria({ types });
  const hitAll = pickByName(all, ref);
  if (hitAll) return hitAll;
  throw new Error(`Component "${ref}" not found locally. Use its id or published key (see get_design_system).`);
}

function pickByName<T extends ComponentNode | ComponentSetNode>(nodes: T[], name: string): T | undefined {
  // Variants inside a set are named "Size=Large, State=Default"; prefer sets
  // and standalone components over individual variants.
  return (
    nodes.find((n) => n.name === name && (n.type === 'COMPONENT_SET' || n.parent?.type !== 'COMPONENT_SET')) ??
    nodes.find((n) => n.name === name)
  );
}
