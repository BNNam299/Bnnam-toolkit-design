// figma-ui-flow Stage 6 — prototype reactions with durations and easings
// taken from motion tokens (design-system.md §2.5, creative-process.md §7).
import { transitionFor } from '../../shared/motion';
import type { SetInteractionsInput } from '../../shared/schemas';
import { Resources } from '../resources';
import { getSceneNode } from '../util';

type ReactionSpec = SetInteractionsInput['items'][number]['reactions'][number];

async function durationMs(d: NonNullable<ReactionSpec['transition']>['duration'], res: Resources): Promise<number> {
  if (typeof d === 'number') return d;
  const v = await res.variable(d.var);
  const collection = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId);
  let value = v.valuesByMode[collection?.defaultModeId ?? Object.keys(v.valuesByMode)[0]];
  for (let i = 0; i < 10 && typeof value === 'object' && value !== null && 'id' in value; i++) {
    const t = await figma.variables.getVariableByIdAsync((value as VariableAlias).id);
    if (!t) break;
    value = Object.values(t.valuesByMode)[0];
  }
  if (typeof value !== 'number') throw new Error(`Motion token "${d.var}" không phải số (ms)`);
  return value;
}

async function toAction(r: ReactionSpec, res: Resources): Promise<Action> {
  switch (r.action) {
    case 'BACK':
    case 'CLOSE':
      return { type: r.action };
    case 'URL':
      if (!r.url) throw new Error('URL cần url');
      return { type: 'URL', url: r.url };
    case 'SET_VARIABLE': {
      if (!r.variable || r.value === undefined) throw new Error('SET_VARIABLE cần variable và value');
      const v = await res.variable(r.variable);
      return { type: 'SET_VARIABLE', variableId: v.id, variableValue: { resolvedType: v.resolvedType, type: v.resolvedType, value: r.value } as VariableData };
    }
    case 'SET_VARIABLE_MODE': {
      if (!r.collection || !r.mode) throw new Error('SET_VARIABLE_MODE cần collection và mode');
      const c = await res.collection(r.collection);
      const m = c.modes.find((x) => x.name === r.mode);
      if (!m) throw new Error(`Collection "${c.name}" không có mode "${r.mode}"`);
      return { type: 'SET_VARIABLE_MODE', variableCollectionId: c.id, variableModeId: m.modeId };
    }
    default: {
      if (!r.destination) throw new Error(`${r.action} cần destination (node id)`);
      await getSceneNode(r.destination);
      const t = r.transition;
      const transition =
        !t || t.type === 'INSTANT' ? null : (transitionFor({ type: t.type, direction: t.direction, easing: t.easing }, await durationMs(t.duration, res)) as Transition);
      return { type: 'NODE', destinationId: r.destination, navigation: r.action, transition, resetScrollPosition: r.action === 'NAVIGATE' };
    }
  }
}

function toTrigger(t: ReactionSpec['trigger']): Trigger {
  if (typeof t === 'object') return { type: 'AFTER_TIMEOUT', timeout: t.afterTimeout / 1000 };
  return { type: t };
}

export async function setInteractions(p: SetInteractionsInput) {
  const res = new Resources();
  const done: { id: string; reactions: number }[] = [];
  for (const item of p.items) {
    const node = await getSceneNode(item.id);
    if (!('setReactionsAsync' in node)) throw new Error(`${node.type} ${node.id} không nhận được prototype reaction`);
    const reactions: Reaction[] = [];
    for (const r of item.reactions) reactions.push({ trigger: toTrigger(r.trigger), actions: [await toAction(r, res)] });
    const next = item.replace ? reactions : [...node.reactions, ...reactions];
    await node.setReactionsAsync(next);
    done.push({ id: node.id, reactions: next.length });
  }
  let flowStart: { id: string; name: string } | undefined;
  if (p.flowStart) {
    const node = await getSceneNode(p.flowStart.id);
    if (node.parent?.type !== 'PAGE' && node.parent?.type !== 'SECTION') {
      throw new Error('Flow starting point phải là frame top-level (trên page hoặc trong section)');
    }
    const page = figma.currentPage;
    const others = page.flowStartingPoints.filter((f) => f.nodeId !== node.id);
    page.flowStartingPoints = [...others, { nodeId: node.id, name: p.flowStart.name }];
    flowStart = { id: node.id, name: p.flowStart.name };
  }
  return { updated: done, flowStart, hint: 'Kiểm tra bằng Present (▶) trong Figma; Reduce Motion: đổi transition sang DISSOLVE ngắn hoặc INSTANT.' };
}
