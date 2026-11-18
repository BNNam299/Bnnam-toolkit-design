import { planComponentSet } from '../../shared/components';
import type { CreateComponentSetInput } from '../../shared/schemas';
import type { ApplyCtx } from '../apply';
import { iconWarnings } from '../icons';
import { solid } from '../paints';
import { Resources } from '../resources';
import { CORNER_SMOOTHING } from '../../shared/values';
import { freeSpot, getContainer, RolledBackError } from '../util';
import { build, type BuildState } from './render';

const GAP = 24;

export async function createComponentSet(p: CreateComponentSetInput) {
  const plan = planComponentSet(p.name, p.variants, p.properties);
  if (plan.problems.length) throw new RolledBackError(plan.problems.join('\n'));

  const ctx: ApplyCtx = { res: new Resources(), defaultFont: 'Inter' };
  const parent = p.parentId ? await getContainer(p.parentId) : figma.currentPage;
  const spot = parent.type === 'PAGE' ? freeSpot((parent as PageNode).children) : null;
  const warnings = [...plan.warnings];
  const made: ComponentNode[] = [];
  let set: ComponentSetNode | null = null;

  try {
    for (let i = 0; i < p.variants.length; i++) {
      const tree = { ...p.variants[i].tree, component: true, name: plan.names[i] || p.name };
      const state: BuildState = { root: null, count: 0, created: [], deferred: [] };
      try {
        made.push((await build(tree, parent, undefined, ctx, [], {}, state)) as ComponentNode);
        if (state.deferred.length > 0) {
          throw new Error('Connectors cannot live inside component variants; create the set first, then add connectors with render_tree.');
        }
      } catch (e) {
        for (const n of state.created) {
          try {
            if (!n.removed) n.remove();
          // eslint-disable-next-line no-empty
          } catch {
          }
        }
        if (state.root && !state.root.removed) state.root.remove();
        throw e;
      }
    }

    set = figma.combineAsVariants(made, parent);
    set.name = p.name;
    if (p.description !== undefined) set.description = p.description;

    const lastAxis = plan.axes[plan.axes.length - 1];
    const columns = lastAxis ? new Set(p.variants.map((v) => v.props[lastAxis])).size : made.length;
    const cellW = Math.max(...made.map((m) => m.width));
    set.layoutMode = 'HORIZONTAL';
    set.layoutWrap = 'WRAP';
    set.itemSpacing = GAP;
    set.counterAxisSpacing = GAP;
    set.paddingTop = set.paddingRight = set.paddingBottom = set.paddingLeft = GAP;
    set.resize(Math.ceil(columns * cellW + (columns - 1) * GAP + 2 * GAP) + 2, set.height);
    set.primaryAxisSizingMode = 'FIXED';
    set.counterAxisSizingMode = 'AUTO';
    set.strokes = [solid('#9747FF')];
    set.dashPattern = [10, 5];
    set.strokeWeight = 1;
    set.cornerRadius = 5;
    set.cornerSmoothing = CORNER_SMOOTHING;
    if (spot) {
      set.x = spot.x;
      set.y = spot.y;
    }

    const properties: Record<string, string> = {};
    for (const prop of p.properties) {
      let def: string | boolean = prop.default;
      const options: ComponentPropertyOptions = {};
      if (prop.type === 'INSTANCE_SWAP') {
        const c = await ctx.res.component(String(prop.default));
        def = (c.type === 'COMPONENT_SET' ? c.defaultVariant : c).id;
        if (prop.preferred?.length) {
          options.preferredValues = [];
          for (const ref of prop.preferred) {
            const pc = await ctx.res.component(ref);
            options.preferredValues.push({ type: pc.type === 'COMPONENT_SET' ? 'COMPONENT_SET' : 'COMPONENT', key: pc.key });
          }
        }
      }
      const key = set.addComponentProperty(prop.name, prop.type, def, options);
      let wired = 0;
      const field = prop.type === 'TEXT' ? 'characters' : prop.type === 'BOOLEAN' ? 'visible' : 'mainComponent';
      const wantType = prop.type === 'TEXT' ? 'TEXT' : prop.type === 'INSTANCE_SWAP' ? 'INSTANCE' : null;
      for (const target of prop.targets) {
        let hits = 0;
        for (const variant of set.children as ComponentNode[]) {
          for (const n of variant.findAll((x) => x.name === target)) {
            if (wantType && n.type !== wantType) {
              warnings.push(`property "${prop.name}": layer "${target}" là ${n.type}, cần ${wantType}`);
              continue;
            }
            n.componentPropertyReferences = { ...(n.componentPropertyReferences ?? {}), [field]: key };
            hits++;
          }
        }
        if (!hits) warnings.push(`property "${prop.name}": không variant nào có layer "${target}"`);
        wired += hits;
      }
      if (wired) properties[prop.name] = key;
      else {
        set.deleteComponentProperty(key);
        warnings.push(`property "${prop.name}": đã bỏ vì không gắn được vào layer nào`);
      }
    }

    warnings.push(...iconWarnings([set]));
    return {
      setId: set.id,
      name: set.name,
      variants: Object.fromEntries((set.children as ComponentNode[]).map((c) => [c.name, c.id])),
      properties,
      warnings,
    };
  } catch (e) {
    if (set && !set.removed) set.remove();
    for (const m of made) if (!m.removed) m.remove();
    throw new RolledBackError(`${e instanceof Error ? e.message : String(e)} (nothing was left on the canvas)`);
  }
}
