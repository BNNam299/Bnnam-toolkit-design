// figma-ui-flow rule #3 "search before you create": one ranked search over local
// components, variables and styles (and enabled library variables).
import { rank } from '../../shared/search';
import type { SearchDesignSystemInput } from '../../shared/schemas';
import { toHex } from '../../shared/values';

interface Hit {
  kind: 'component' | 'variable' | 'style';
  name: string;
  id?: string;
  key?: string;
  type: string;
  detail?: string;
  source: 'local' | 'library';
}

export async function searchDesignSystem(p: SearchDesignSystemInput) {
  const kinds = new Set(p.kinds);
  const items: Hit[] = [];
  const notes: string[] = [];

  if (kinds.has('component')) {
    await figma.loadAllPagesAsync();
    // eslint-disable-next-line @figma/figma-plugins/dynamic-page-find-method-advice -- pages loaded just above
    const nodes = figma.root.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] });
    for (const n of nodes) {
      // Variants are found through their set; standalone components directly.
      if (n.type === 'COMPONENT' && n.parent?.type === 'COMPONENT_SET') continue;
      const props = Object.entries(n.componentPropertyDefinitions).map(([k, d]) =>
        d.type === 'VARIANT' ? `${k}=${(d.variantOptions ?? []).join('|')}` : `${k.split('#')[0]}:${d.type}`,
      );
      items.push({ kind: 'component', name: n.name, id: n.id, key: n.key, type: n.type, detail: props.join(', ') || undefined, source: 'local' });
    }
    notes.push('Plugin API không liệt kê được component của team library; component library đã dùng trên page có trong get_design_system.');
  }

  if (kinds.has('variable')) {
    const [vars, collections] = await Promise.all([
      figma.variables.getLocalVariablesAsync(),
      figma.variables.getLocalVariableCollectionsAsync(),
    ]);
    const byId = new Map(collections.map((c) => [c.id, c]));
    for (const v of vars) {
      const c = byId.get(v.variableCollectionId);
      const value = c ? v.valuesByMode[c.defaultModeId] : undefined;
      const shown =
        value && typeof value === 'object' && 'r' in value
          ? toHex(value)
          : value && typeof value === 'object' && 'type' in value
            ? `→ ${vars.find((x) => x.id === (value as VariableAlias).id)?.name ?? 'alias'}`
            : String(value);
      items.push({
        kind: 'variable',
        name: v.name,
        id: v.id,
        type: v.resolvedType,
        detail: `${c?.name ?? '?'} · ${shown}${v.scopes.length === 0 ? ' · primitive (scopes [])' : ''}`,
        source: 'local',
      });
    }
    if (p.includeLibraries) {
      try {
        for (const lc of await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()) {
          for (const lv of await figma.teamLibrary.getVariablesInLibraryCollectionAsync(lc.key)) {
            items.push({ kind: 'variable', name: lv.name, key: lv.key, type: lv.resolvedType, detail: `${lc.libraryName} · ${lc.name}`, source: 'library' });
          }
        }
      } catch (e) {
        notes.push(`Không đọc được library variables: ${String(e)}`);
      }
    }
  }

  if (kinds.has('style')) {
    const [paint, text, effect, grid] = await Promise.all([
      figma.getLocalPaintStylesAsync(),
      figma.getLocalTextStylesAsync(),
      figma.getLocalEffectStylesAsync(),
      figma.getLocalGridStylesAsync(),
    ]);
    for (const s of paint) items.push({ kind: 'style', name: s.name, id: s.id, key: s.key, type: 'PAINT', source: 'local' });
    for (const s of text) {
      items.push({ kind: 'style', name: s.name, id: s.id, key: s.key, type: 'TEXT', detail: `${s.fontName.family} ${s.fontName.style} ${s.fontSize}`, source: 'local' });
    }
    for (const s of effect) items.push({ kind: 'style', name: s.name, id: s.id, key: s.key, type: 'EFFECT', source: 'local' });
    for (const s of grid) items.push({ kind: 'style', name: s.name, id: s.id, key: s.key, type: 'GRID', source: 'local' });
  }

  const hits = rank(p.query, items, p.limit);
  return {
    query: p.query,
    total: hits.length,
    hits,
    hint: hits.length ? undefined : 'Không có gì trùng: có thể tạo mới (create_variables / create_styles / create_component_set).',
    notes,
  };
}
