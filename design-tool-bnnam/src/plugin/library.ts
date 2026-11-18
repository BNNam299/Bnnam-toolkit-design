
export const KEY_RE = /^[0-9a-f]{20,}$/i;

export function isPrivateName(name: string): boolean {
  return /^[_.]/.test(name);
}

export interface RemoteInUse {
  variables: Variable[];
  styles: BaseStyle[];
  components: (ComponentNode | ComponentSetNode)[];
}

const STYLE_FIELDS = ['fillStyleId', 'strokeStyleId', 'effectStyleId', 'textStyleId', 'gridStyleId'] as const;

export async function remoteInUse(root: BaseNode & ChildrenMixin = figma.currentPage): Promise<RemoteInUse> {
  const varIds = new Set<string>();
  const styleIds = new Set<string>();
  const collect = (value: unknown) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) return value.forEach(collect);
    const alias = value as VariableAlias;
    if (alias.type === 'VARIABLE_ALIAS') varIds.add(alias.id);
    else Object.values(value).forEach(collect);
  };
  const components = new Map<string, ComponentNode | ComponentSetNode>();
  // eslint-disable-next-line @figma/figma-plugins/dynamic-page-find-method-advice
  for (const n of root.findAll(() => true)) {
    collect((n as SceneNode & { boundVariables?: unknown }).boundVariables);
    for (const key of STYLE_FIELDS) {
      const v = (n as unknown as Record<string, unknown>)[key];
      if (typeof v === 'string' && v) styleIds.add(v);
    }
    if (n.type === 'INSTANCE') {
      const main = await n.getMainComponentAsync();
      if (!main?.remote) continue;
      const owner = main.parent?.type === 'COMPONENT_SET' ? main.parent : main;
      if (!components.has(owner.key)) components.set(owner.key, owner);
    }
  }
  const variables: Variable[] = [];
  for (const id of varIds) {
    const v = await figma.variables.getVariableByIdAsync(id);
    if (v?.remote) variables.push(v);
  }
  const styles: BaseStyle[] = [];
  for (const id of styleIds) {
    const s = await figma.getStyleByIdAsync(id);
    if (s?.remote) styles.push(s);
  }
  return { variables, styles, components: [...components.values()] };
}

export interface LibraryVariableRef {
  name: string;
  key: string;
  resolvedType: VariableResolvedDataType;
  collection: string;
  library: string;
}

export async function enabledLibraryVariables(): Promise<LibraryVariableRef[]> {
  const out: LibraryVariableRef[] = [];
  for (const lc of await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()) {
    for (const lv of await figma.teamLibrary.getVariablesInLibraryCollectionAsync(lc.key)) {
      out.push({ name: lv.name, key: lv.key, resolvedType: lv.resolvedType, collection: lc.name, library: lc.libraryName });
    }
  }
  return out;
}

export function errorText(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
