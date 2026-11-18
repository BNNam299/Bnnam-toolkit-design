
import { enabledLibraryVariables, errorText, isPrivateName, KEY_RE, remoteInUse } from './library';
import type { LibraryVariableRef, RemoteInUse } from './library';
import { findNode } from './util';

export class Resources {
  private variables?: Promise<Map<string, Variable>>;
  private remote?: Promise<RemoteInUse>;
  private libVars?: Promise<LibraryVariableRef[]>;
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
    if (v) return v;
    if (KEY_RE.test(ref)) {
      try {
        return await figma.variables.importVariableByKeyAsync(ref);
      } catch (e) {
        throw new Error(`No published library variable with key "${ref}": ${errorText(e)}`);
      }
    }
    const used = (await this.inUse()).variables.find((x) => x.name === ref);
    if (used) return used;
    const libs = await this.libraryVariables();
    const lib = libs.find((x) => x.name === ref || `${x.collection}/${x.name}` === ref);
    if (lib) return figma.variables.importVariableByKeyAsync(lib.key);
    const local = [...map.keys()].filter((k) => !k.includes('::')).slice(0, 30);
    const remote = (await this.inUse()).variables.map((x) => x.name).slice(0, 20);
    throw new Error(
      `Variable "${ref}" not found. Some local variables: ${local.join(', ') || '(none)'}. ` +
        `Library variables used on this page: ${remote.join(', ') || '(none)'}. A library variable can also be given by its published key.`,
    );
  }

  private inUse(): Promise<RemoteInUse> {
    if (!this.remote) this.remote = remoteInUse();
    return this.remote;
  }

  private libraryVariables(): Promise<LibraryVariableRef[]> {
    if (!this.libVars) this.libVars = enabledLibraryVariables().catch(() => []);
    return this.libVars;
  }

  private async loadVariables(): Promise<Map<string, Variable>> {
    const [vars, collections] = await Promise.all([
      figma.variables.getLocalVariablesAsync(),
      this.collectionList(),
    ]);
    const byId = new Map(collections.map((c) => [c.id, c.name]));
    const map = new Map<string, Variable>();
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

  async paintStyle(ref: string): Promise<PaintStyle> {
    if (!this.paintStyles) this.paintStyles = figma.getLocalPaintStylesAsync();
    return this.style(await this.paintStyles, ref, 'PAINT');
  }

  async textStyle(ref: string): Promise<TextStyle> {
    if (!this.textStyles) this.textStyles = figma.getLocalTextStylesAsync();
    return this.style(await this.textStyles, ref, 'TEXT');
  }

  async effectStyle(ref: string): Promise<EffectStyle> {
    if (!this.effectStyles) this.effectStyles = figma.getLocalEffectStylesAsync();
    return this.style(await this.effectStyles, ref, 'EFFECT');
  }

  async gridStyle(ref: string): Promise<GridStyle> {
    if (!this.gridStyles) this.gridStyles = figma.getLocalGridStylesAsync();
    return this.style(await this.gridStyles, ref, 'GRID');
  }

  private async style<T extends BaseStyle>(local: T[], ref: string, type: StyleType): Promise<T> {
    const kind = type.toLowerCase();
    const hit = local.find((x) => x.name === ref || x.id === ref);
    if (hit) return hit;
    let s: BaseStyle | null = null;
    if (ref.startsWith('S:')) s = await figma.getStyleByIdAsync(ref);
    else if (KEY_RE.test(ref)) {
      try {
        s = await figma.importStyleByKeyAsync(ref);
      } catch (e) {
        throw new Error(`No published library ${kind} style with key "${ref}": ${errorText(e)}`);
      }
    } else s = (await this.inUse()).styles.find((x) => x.type === type && x.name === ref) ?? null;
    if (s && s.type !== type) throw new Error(`Style "${ref}" is a ${s.type.toLowerCase()} style, not a ${kind} style.`);
    if (s) return s as T;
    const names = local.map((x) => x.name).slice(0, 30);
    const remote = (await this.inUse()).styles.filter((x) => x.type === type).map((x) => x.name).slice(0, 20);
    throw new Error(
      `No ${kind} style "${ref}". Local: ${names.join(', ') || '(none)'}. ` +
        `Library styles used on this page: ${remote.join(', ') || '(none)'}. A library style can also be given by its published key.`,
    );
  }

  component(ref: string): Promise<ComponentNode | ComponentSetNode> {
    let p = this.components.get(ref);
    if (!p) {
      p = this.findComponent(ref);
      this.components.set(ref, p);
    }
    return p;
  }

  private async findComponent(ref: string): Promise<ComponentNode | ComponentSetNode> {
    if (/^I?\d+:\d+/.test(ref)) {
      const node = await findNode(ref);
      if (node && (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET')) return node;
      throw new Error(`Node ${ref} is not a component or component set.`);
    }
    if (KEY_RE.test(ref)) return this.importComponent(ref);
    const types: ('COMPONENT' | 'COMPONENT_SET')[] = ['COMPONENT_SET', 'COMPONENT'];
    const onPage = figma.currentPage.findAllWithCriteria({ types });
    const hit = pickByName(onPage, ref);
    if (hit) return hit;
    await figma.loadAllPagesAsync();
    // eslint-disable-next-line @figma/figma-plugins/dynamic-page-find-method-advice -- pages loaded just above
    const all = figma.root.findAllWithCriteria({ types });
    const hitAll = pickByName(all, ref);
    if (hitAll) return hitAll;
    const remote = (await this.inUse()).components;
    const lib = remote.find((x) => x.name === ref);
    if (lib) return lib;
    throw new Error(
      `Component "${ref}" not found locally or among the library components used on this page` +
        `${remote.length ? ` (${remote.map((x) => x.name).slice(0, 20).join(', ')})` : ''}. Use its id or published key (see get_design_system).`,
    );
  }

  private async importComponent(key: string): Promise<ComponentNode | ComponentSetNode> {
    let first: unknown;
    try {
      return await figma.importComponentByKeyAsync(key);
    } catch (e) {
      first = e;
    }
    try {
      return await figma.importComponentSetByKeyAsync(key);
    // eslint-disable-next-line no-empty
    } catch {
    }
    const owner = (await this.inUse()).components.find(
      (c) => c.key === key || (c.type === 'COMPONENT_SET' && c.children.some((v) => (v as ComponentNode).key === key)),
    );
    const hint =
      owner && isPrivateName(owner.name)
        ? ` "${owner.name}" starts with "${owner.name[0]}", so its library does not publish it; use the public component that contains it.`
        : '';
    throw new Error(`No published component or component set with key "${key}": ${errorText(first)}.${hint}`);
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

function pickByName<T extends ComponentNode | ComponentSetNode>(nodes: T[], name: string): T | undefined {
  return (
    nodes.find((n) => n.name === name && (n.type === 'COMPONENT_SET' || n.parent?.type !== 'COMPONENT_SET')) ??
    nodes.find((n) => n.name === name)
  );
}
