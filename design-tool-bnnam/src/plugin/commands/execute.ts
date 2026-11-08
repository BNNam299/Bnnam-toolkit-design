import type { ExecuteCodeInput } from '../../shared/schemas';
import { parseColor, toHex } from '../../shared/values';
import { loadFont, loadNodeFonts, resolveFont } from '../fonts';
import { solid } from '../paints';
import { sanitize } from '../sanitize';
import { Serializer, summary } from '../serialize';
import { freeSpot, getNode, isAutoLayout } from '../util';

// Helpers exposed to agent code as `h`.
const helpers = {
  solid,
  rgb: (color: string) => {
    const c = parseColor(color);
    return { r: c.r, g: c.g, b: c.b };
  },
  hex: toHex,
  getNode,
  loadFont,
  loadNodeFonts,
  resolveFont,
  isAutoLayout,
  summary,
  freeSpot: () => freeSpot(figma.currentPage.children),
  serialize: (node: BaseNode, depth = 1) => new Serializer(500).node(node, depth),
};

type AsyncFn = (figma: PluginAPI, h: typeof helpers) => Promise<unknown>;
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as new (
  ...args: string[]
) => AsyncFn;

export async function executeCode(p: ExecuteCodeInput) {
  let fn: AsyncFn;
  try {
    fn = new AsyncFunction('figma', 'h', p.code);
  } catch (e) {
    throw new Error(`Syntax error: ${e instanceof Error ? e.message : String(e)}`);
  }
  const value = await fn(figma, helpers);
  return { result: sanitize(value, { mixed: figma.mixed }) };
}
