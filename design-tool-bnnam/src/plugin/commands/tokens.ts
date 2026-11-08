// figma-ui-flow Stage 2 + 8: import a DTCG token file, read every token
// back for export, and draw the Foundations page from them. The server parses
// and lints the JSON (../../shared/tokens.ts); the plugin only writes.
import { foundationsTree, type FoundationVar } from '../../shared/foundations';
import type { CreateVariablesInput, ExportTokensInput, RenderFoundationsInput } from '../../shared/schemas';
import { VARIABLE_TYPES, type ExportCollection, type ExportTextStyle, type TokenValue, type VariableType } from '../../shared/tokens';
import { toHex } from '../../shared/values';
import { renderTree } from './render';
import { createVariables } from './variables';

// Newer Figma types (e.g. EASING) have no token equivalent yet.
const exportable = (v: Variable): v is Variable & { resolvedType: VariableType } =>
  (VARIABLE_TYPES as string[]).includes(v.resolvedType);

interface ImportParams {
  collections: Omit<CreateVariablesInput, 'onExisting'>[];
  onExisting: CreateVariablesInput['onExisting'];
  dryRun: boolean;
  skipped: string[];
  lint: unknown;
}

export async function importTokens(p: ImportParams) {
  if (p.dryRun) {
    return {
      dryRun: true,
      collections: p.collections.map((c) => ({ collection: c.collection, modes: c.modes, variables: c.variables.length })),
      skipped: p.skipped,
      lint: p.lint,
    };
  }
  const results = [];
  for (const c of p.collections) results.push(await createVariables({ ...c, onExisting: p.onExisting }));
  return {
    collections: results.map((r) => ({
      ...r.collection,
      created: r.created.length,
      updated: r.updated.length,
      aliased: r.aliased,
      warnings: r.warnings,
    })),
    skipped: p.skipped,
    lint: p.lint,
  };
}

function encode(v: VariableValue, byId: Map<string, Variable>, collName: Map<string, string>): TokenValue {
  if (typeof v === 'object' && v !== null) {
    if ('r' in v) return toHex(v);
    const alias = v as VariableAlias;
    const target = byId.get(alias.id);
    if (!target) throw new Error(`Alias tới variable ${alias.id} không có trong file (library?)`);
    return { alias: `${collName.get(target.variableCollectionId)}/${target.name}` };
  }
  return v as TokenValue;
}

const WEIGHT: Record<string, number> = { thin: 100, extralight: 200, light: 300, regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900 };

export async function readTokens(p: Pick<ExportTokensInput, 'collections'>) {
  const [vars, collections, textStyles] = await Promise.all([
    figma.variables.getLocalVariablesAsync(),
    figma.variables.getLocalVariableCollectionsAsync(),
    figma.getLocalTextStylesAsync(),
  ]);
  const byId = new Map(vars.map((v) => [v.id, v]));
  const collName = new Map(collections.map((c) => [c.id, c.name]));
  const wanted = p.collections?.length ? collections.filter((c) => p.collections!.includes(c.name)) : collections;
  if (p.collections?.length && wanted.length !== p.collections.length) {
    const missing = p.collections.filter((n) => !collections.some((c) => c.name === n));
    throw new Error(`Không có collection: ${missing.join(', ')}. Có: ${collections.map((c) => c.name).join(', ')}.`);
  }
  const out: ExportCollection[] = wanted.map((c) => ({
    name: c.name,
    modes: c.modes.map((m) => m.name),
    variables: c.variableIds
      .map((id) => byId.get(id))
      .filter((v): v is Variable => !!v)
      .filter(exportable)
      .map((v) => ({
        name: v.name,
        type: v.resolvedType,
        values: Object.fromEntries(c.modes.map((m) => [m.name, encode(v.valuesByMode[m.modeId], byId, collName)])),
      })),
  }));
  const styles: ExportTextStyle[] = textStyles.map((s) => ({
    name: s.name,
    fontFamily: s.fontName.family,
    fontStyle: s.fontName.style,
    fontWeight: WEIGHT[s.fontName.style.toLowerCase().replace(/[\s_-]/g, '')] ?? 400,
    fontSize: s.fontSize,
    lineHeight: s.lineHeight.unit === 'AUTO' ? 'AUTO' : s.lineHeight.unit === 'PERCENT' ? `${s.lineHeight.value}%` : s.lineHeight.value,
    letterSpacing: s.letterSpacing.unit === 'PERCENT' ? `${s.letterSpacing.value}%` : s.letterSpacing.value,
  }));
  return { collections: out, textStyles: styles };
}

export async function renderFoundations(p: RenderFoundationsInput) {
  const [vars, collections, textStyles, effectStyles] = await Promise.all([
    figma.variables.getLocalVariablesAsync(),
    figma.variables.getLocalVariableCollectionsAsync(),
    figma.getLocalTextStylesAsync(),
    figma.getLocalEffectStylesAsync(),
  ]);
  const byId = new Map(vars.map((v) => [v.id, v]));
  const wanted = collections.filter((c) => !p.collections?.length || p.collections.includes(c.name));
  // Resolve aliases to the default-mode value for the caption only; the
  // sample itself binds the variable, so it shows the real token.
  const display = (v: Variable, modeId: string, depth = 0): string => {
    const raw = v.valuesByMode[modeId] ?? Object.values(v.valuesByMode)[0];
    if (typeof raw === 'object' && raw !== null && 'r' in raw) return toHex(raw);
    if (typeof raw === 'object' && raw !== null && 'id' in raw && depth < 10) {
      const t = byId.get((raw as VariableAlias).id);
      if (!t) return 'alias';
      const tc = collections.find((c) => c.id === t.variableCollectionId);
      return `→ ${t.name} (${display(t, tc?.defaultModeId ?? '', depth + 1)})`;
    }
    return String(raw);
  };
  const variables: FoundationVar[] = [];
  for (const c of wanted) {
    for (const id of c.variableIds) {
      const v = byId.get(id);
      if (!v || !exportable(v)) continue;
      variables.push({ id: v.id, name: v.name, collection: c.name, type: v.resolvedType, display: display(v, c.defaultModeId) });
    }
  }
  const tree = foundationsTree({
    variables,
    textStyles: textStyles.map((s) => ({
      name: s.name,
      caption: `${s.fontName.family} ${s.fontName.style} · ${s.fontSize}/${s.lineHeight.unit === 'PIXELS' ? s.lineHeight.value : s.lineHeight.unit === 'PERCENT' ? `${s.lineHeight.value}%` : 'auto'}`,
    })),
    effectStyles: effectStyles.map((s) => ({ name: s.name })),
  });
  const r = await renderTree({ tree, select: true });
  // The id map of a Foundations page runs to hundreds of entries; callers need the root.
  return { rootId: r.rootId, created: r.created, bounds: r.bounds, variables: variables.length, textStyles: textStyles.length, effectStyles: effectStyles.length };
}
