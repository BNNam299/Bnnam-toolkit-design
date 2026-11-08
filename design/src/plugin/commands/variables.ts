// figma-ui-flow Stage 2 — variables in one call: collection, modes, values
// per mode, aliases and scopes. Validation happens in ../../shared/tokens.ts
// before anything is written.
import type { CreateVariablesInput } from '../../shared/schemas';
import { encodeValue, planVariables } from '../../shared/tokens';
import { RolledBackError } from '../util';

export async function createVariables(p: CreateVariablesInput) {
  const [existing, collections] = await Promise.all([
    figma.variables.getLocalVariablesAsync(),
    figma.variables.getLocalVariableCollectionsAsync(),
  ]);
  let collection = collections.find((c) => c.name === p.collection.trim());
  const inCollection = existing.filter((v) => collection && v.variableCollectionId === collection.id);
  const plan = planVariables(p, inCollection.map((v) => v.name), p.onExisting);

  // Aliases may name "variable/path" (any collection) or "Collection/variable/path".
  const collName = new Map(collections.map((c) => [c.id, c.name]));
  const byName = new Map<string, Variable>();
  for (const v of existing) {
    byName.set(`${collName.get(v.variableCollectionId)}/${v.name}`, v);
    if (!byName.has(v.name)) byName.set(v.name, v);
  }
  const known = new Set([...byName.keys(), ...plan.variables.flatMap((v) => [v.name, `${plan.collection}/${v.name}`])]);
  for (const v of plan.variables) {
    for (const [mode, value] of Object.entries(v.values)) {
      if (typeof value === 'object' && value !== null && 'alias' in value && !known.has(value.alias)) {
        plan.problems.push(`variable "${v.name}" (${mode}): alias tới "${value.alias}" không tồn tại`);
      }
    }
  }
  // Nothing has been written yet, so a corrected retry is safe.
  if (plan.problems.length) throw new RolledBackError(plan.problems.join('\n'));

  if (!collection) collection = figma.variables.createVariableCollection(plan.collection);

  const warnings: string[] = [...plan.warnings];
  const modeIds: Record<string, string> = {};
  // A collection created earlier keeps its modes; only missing ones are added.
  const fresh = inCollection.length === 0 && collection.modes.length === 1;
  if (fresh && collection.modes[0].name !== plan.modes[0]) collection.renameMode(collection.modes[0].modeId, plan.modes[0]);
  for (const m of collection.modes) modeIds[m.name] = m.modeId;
  for (const mode of plan.modes) {
    if (modeIds[mode]) continue;
    try {
      modeIds[mode] = collection.addMode(mode);
    } catch (e) {
      warnings.push(`mode "${mode}" bị Figma từ chối (${e instanceof Error ? e.message : String(e)}) — chỉ ghi các mode đã có: ${Object.keys(modeIds).join(', ')}.`);
    }
  }

  // Pass 1: create (or reuse) every variable so aliases can point at siblings.
  const own = new Map(inCollection.map((v) => [v.name, v]));
  const created: { id: string; name: string; type: string }[] = [];
  const updated: { id: string; name: string }[] = [];
  for (const spec of plan.variables) {
    let variable = own.get(spec.name);
    if (variable) {
      if (variable.resolvedType !== spec.type) {
        throw new Error(`variable "${spec.name}" đang là ${variable.resolvedType}, không đổi sang ${spec.type} được`);
      }
      updated.push({ id: variable.id, name: variable.name });
    } else {
      variable = figma.variables.createVariable(spec.name, collection, spec.type);
      created.push({ id: variable.id, name: variable.name, type: spec.type });
    }
    byName.set(spec.name, variable);
    byName.set(`${collection.name}/${spec.name}`, variable);
  }

  // Pass 2: values (and aliases), then scopes.
  let aliased = 0;
  for (const spec of plan.variables) {
    const variable = byName.get(`${collection.name}/${spec.name}`)!;
    for (const [mode, value] of Object.entries(spec.values)) {
      const modeId = modeIds[mode];
      if (!modeId) continue;
      const encoded = encodeValue(spec.type, value);
      if (encoded && typeof encoded === 'object' && 'alias' in encoded) {
        const target = byName.get((encoded as { alias: string }).alias);
        if (!target) continue; // validated above; defensive
        variable.setValueForMode(modeId, figma.variables.createVariableAlias(target));
        aliased++;
      } else {
        variable.setValueForMode(modeId, encoded as VariableValue);
      }
    }
    if (spec.scopes) variable.scopes = spec.scopes as VariableScope[];
  }

  return {
    collection: { id: collection.id, name: collection.name, modes: collection.modes.map((m) => m.name) },
    created,
    updated,
    aliased,
    warnings,
  };
}
