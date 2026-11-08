// Turns an arbitrary execute_code return value into JSON-safe data: nodes
// become summaries, bytes become a size marker, cycles and depth are cut.

export interface SanitizeOptions {
  mixed: symbol;
  maxDepth?: number;
  maxArray?: number;
}

function isNodeLike(v: object): v is { id: string; name: string; type: string } {
  return 'id' in v && 'type' in v && 'parent' in v && typeof (v as { type: unknown }).type === 'string';
}

export function sanitize(value: unknown, opts: SanitizeOptions): unknown {
  const maxDepth = opts.maxDepth ?? 8;
  const maxArray = opts.maxArray ?? 500;
  const seen = new WeakSet<object>();

  const walk = (v: unknown, depth: number): unknown => {
    if (v === opts.mixed) return 'MIXED';
    if (v === undefined || typeof v === 'function') return undefined;
    if (typeof v === 'symbol') return v.toString();
    if (typeof v === 'bigint') return v.toString();
    if (typeof v === 'number') return Number.isFinite(v) ? v : String(v);
    if (v === null || typeof v !== 'object') return v;
    if (v instanceof Uint8Array) return `<${v.length} bytes>`;
    if (v instanceof Error) return { error: v.message };
    if (isNodeLike(v)) {
      try {
        return { id: v.id, name: v.name, type: v.type };
      } catch {
        return { removedNode: true };
      }
    }
    if (seen.has(v)) return '<circular>';
    if (depth >= maxDepth) return '<max depth>';
    seen.add(v);
    if (Array.isArray(v)) {
      const items = v.slice(0, maxArray).map((x) => walk(x, depth + 1));
      if (v.length > maxArray) items.push(`<${v.length - maxArray} more>`);
      return items;
    }
    if (v instanceof Map) return walk(Object.fromEntries(v), depth);
    if (v instanceof Set) return walk([...v], depth);
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) {
      const s = walk(x, depth + 1);
      if (s !== undefined) out[k] = s;
    }
    return out;
  };
  return walk(value, 0);
}
