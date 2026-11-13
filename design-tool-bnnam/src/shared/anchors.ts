// Anchor-point audit (team hard rule: the shape first, then the fewest anchors). Pure — no Figma API — so it is unit-tested.
// The full fidelity-checked simplifier lives in the skill: .claude/skills/figma-vector-illustration/scripts/anchors.js.
// This file only spots waste cheaply for audit_design; it never rewrites a path.

type P = { x: number; y: number };
type Seg = { t: 'L' | 'C'; c1?: P; c2?: P; p: P };
type Sub = { start: P; segs: Seg[]; closed: boolean };

const sub = (a: P, b: P): P => ({ x: a.x - b.x, y: a.y - b.y });
const add = (a: P, b: P): P => ({ x: a.x + b.x, y: a.y + b.y });
const mul = (a: P, s: number): P => ({ x: a.x * s, y: a.y * s });
const dot = (a: P, b: P) => a.x * b.x + a.y * b.y;
const dist = (a: P, b: P) => Math.hypot(a.x - b.x, a.y - b.y);
const norm = (a: P): P => {
  const l = Math.hypot(a.x, a.y);
  return l < 1e-12 ? { x: 0, y: 0 } : { x: a.x / l, y: a.y / l };
};

function distToLine(p: P, a: P, b: P): number {
  const ab = sub(b, a);
  const l2 = dot(ab, ab);
  if (l2 < 1e-12) return dist(p, a);
  return Math.abs(ab.x * (p.y - a.y) - ab.y * (p.x - a.x)) / Math.sqrt(l2);
}

export function parsePath(d: string): Sub[] {
  const tok = String(d).match(/[MLHVCQZmlhvcqz]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) ?? [];
  const subs: Sub[] = [];
  let cur: Sub | null = null;
  let cmd: string | null = null;
  let last: P = { x: 0, y: 0 };
  let i = 0;
  const num = () => parseFloat(tok[i++]);
  while (i < tok.length) {
    if (/^[A-Za-z]$/.test(tok[i])) cmd = tok[i++];
    else if (!cmd || cmd === 'Z' || cmd === 'z') {
      i++;
      continue;
    }
    const c = cmd as string;
    const rel = c === c.toLowerCase();
    const C = c.toUpperCase();
    const pt = (): P => {
      const x = num();
      const y = num();
      return rel ? { x: last.x + x, y: last.y + y } : { x, y };
    };
    if (C === 'Z') {
      if (cur) {
        if (dist(last, cur.start) > 1e-6) cur.segs.push({ t: 'L', p: { ...cur.start } });
        cur.closed = true;
        last = cur.start;
        cur = null;
      }
      continue;
    }
    if (C === 'M') {
      const p = pt();
      cur = { start: p, segs: [], closed: false };
      subs.push(cur);
      last = p;
      cmd = rel ? 'l' : 'L';
      continue;
    }
    if (!cur) {
      cur = { start: { ...last }, segs: [], closed: false };
      subs.push(cur);
    }
    if (C === 'L') {
      const p = pt();
      cur.segs.push({ t: 'L', p });
      last = p;
    } else if (C === 'H') {
      const x = num();
      const p = { x: rel ? last.x + x : x, y: last.y };
      cur.segs.push({ t: 'L', p });
      last = p;
    } else if (C === 'V') {
      const y = num();
      const p = { x: last.x, y: rel ? last.y + y : y };
      cur.segs.push({ t: 'L', p });
      last = p;
    } else if (C === 'C') {
      const c1 = pt();
      const c2 = pt();
      const p = pt();
      cur.segs.push({ t: 'C', c1, c2, p });
      last = p;
    } else if (C === 'Q') {
      const q = pt();
      const p = pt();
      const p0 = last;
      cur.segs.push({ t: 'C', c1: add(p0, mul(sub(q, p0), 2 / 3)), c2: add(p, mul(sub(q, p), 2 / 3)), p });
      last = p;
    }
  }
  return subs;
}

const subAnchors = (s: Sub) => (s.segs.length === 0 ? 1 : s.segs.length + (s.closed ? 0 : 1));
const segFrom = (s: Sub, k: number): P => (k === 0 ? s.start : s.segs[k - 1].p);
const isStraight = (from: P, g: Seg, eps = 0.05) =>
  g.t === 'L' || (distToLine(g.c1 as P, from, g.p) < eps && distToLine(g.c2 as P, from, g.p) < eps);

export interface AnchorStats {
  anchors: number;
  /** anchors on a straight line between their neighbours (within tol) or duplicates */
  removable: number;
  /** curves drawn as ≥ 5 short straight pieces turning the same way */
  polylineRuns: number;
  polylineAnchors: number;
}

export function analyzeAnchors(d: string, tol = 0.5): AnchorStats {
  let anchors = 0;
  let removable = 0;
  let polylineRuns = 0;
  let polylineAnchors = 0;
  for (const s of parsePath(d)) {
    anchors += subAnchors(s);
    const n = s.segs.length;
    if (n < 2) continue;
    const xs = [s.start.x, ...s.segs.map((g) => g.p.x)];
    const ys = [s.start.y, ...s.segs.map((g) => g.p.y)];
    const diag = Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) || 1;
    const turns: (number | null)[] = [];
    let keep = s.start;
    for (let k = 0; k < n; k++) {
      const next = k + 1 < n ? k + 1 : s.closed ? 0 : -1;
      if (next < 0) break;
      const a = segFrom(s, k);
      const g1 = s.segs[k];
      const v = g1.p;
      const g2 = s.segs[next];
      if (dist(a, v) < 0.05) {
        removable++;
        turns.push(null);
        continue;
      }
      const st = isStraight(a, g1) && isStraight(v, g2);
      if (st && distToLine(v, keep, g2.p) <= tol && dot(sub(v, keep), sub(g2.p, v)) > 0) removable++;
      else keep = v;
      if (st && dist(a, v) < 0.15 * diag && dist(v, g2.p) < 0.15 * diag) {
        const t1 = norm(sub(v, a));
        const t2 = norm(sub(g2.p, v));
        const ang = (Math.atan2(t1.x * t2.y - t1.y * t2.x, dot(t1, t2)) * 180) / Math.PI;
        turns.push(Math.abs(ang) > 2 && Math.abs(ang) < 40 ? Math.sign(ang) : null);
      } else turns.push(null);
    }
    let run = 0;
    let sign = 0;
    const flush = () => {
      if (run >= 4) {
        polylineRuns++;
        polylineAnchors += run;
      }
      run = 0;
    };
    for (const t of turns) {
      if (t !== null && (run === 0 || t === sign)) {
        sign = t;
        run++;
      } else {
        flush();
        if (t !== null) {
          sign = t;
          run = 1;
        }
      }
    }
    flush();
  }
  return { anchors, removable, polylineRuns, polylineAnchors };
}

/** Above this many anchors in one vector the audit asks for a look even without other signals (traced / flattened art). */
export const ANCHOR_LOOK_AT = 150;

/**
 * Audit verdict for one vector: a Vietnamese detail line when anchors look wasted, else null.
 * Signals, not caps — a detailed shape may need many anchors; the fix tool keeps any anchor the shape needs.
 */
export function anchorFinding(stats: AnchorStats): string | null {
  const why: string[] = [];
  if (stats.polylineRuns > 0) why.push(`${stats.polylineRuns} đoạn cong vẽ bằng ${stats.polylineAnchors} điểm thẳng`);
  if (stats.removable >= 2) why.push(`${stats.removable} điểm thẳng hàng / trùng`);
  if (!why.length && stats.anchors >= ANCHOR_LOOK_AT) why.push('nhiều điểm bất thường — xem có phải hình trace / flatten');
  return why.length ? `${stats.anchors} điểm neo: ${why.join(' · ')}` : null;
}
