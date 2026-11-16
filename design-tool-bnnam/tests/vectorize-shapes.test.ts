import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

// figma-vector-illustration, bottle test 16/11: (1) a highlight shaped like a half-moon or a drop is not an ellipse, a real bubble
// still is; (2) where the outline passes from one part to the next with a kink the reference does not have, the build says so.
const require = createRequire(import.meta.url);
const sharp = require('sharp') as typeof import('sharp');
const SCRIPTS = resolve(__dirname, '../.claude/skills/figma-vector-illustration/scripts');
const { components, fitComponent } = require(join(SCRIPTS, 'fit-shapes.cjs'));
const dir = mkdtempSync(join(tmpdir(), 'vz-shapes-'));
const run = (...a: string[]) => execFileSync('node', [join(SCRIPTS, 'vectorize.cjs'), ...a], { encoding: 'utf8', maxBuffer: 1 << 26 });

async function pieceOf(svg: string) {
  const { data, info } = await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, m = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) m[i] = data[i * 4 + 3] > 127 ? 1 : 0;
  const c = components(m, W, H)[0];
  return { m, W, H, c };
}
const svg = (body: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="60">${body}</svg>`;

describe('clean step: a primitive only where the piece is one', () => {
  it('a flat-topped half-moon highlight is not fitted as an ellipse', async () => {
    const { m, W, H, c } = await pieceOf(svg('<path d="M 20 20 L 50 20 C 50 30 43 36 35 36 C 27 36 20 30 20 20 Z" fill="#000"/>'));
    const fit = fitComponent(m, W, H, c, { srcPx: 1, loop: null });
    expect(fit === null || !['ellipse', 'pill'].includes(fit.type)).toBe(true);
  });
  it('a round bubble still is an ellipse', async () => {
    const { m, W, H, c } = await pieceOf(svg('<ellipse cx="40" cy="30" rx="14" ry="11" fill="#000"/>'));
    const fit = fitComponent(m, W, H, c, { srcPx: 1, loop: null });
    expect(fit && fit.type).toBe('ellipse');
  });
});

describe('vectorize build reports kinks between parts (JOINT)', () => {
  // a bottle-like figure: a narrow neck flaring into a wide body along one smooth line
  const ref = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="240"><rect width="200" height="240" fill="#ffffff"/>
    <path d="M 85 20 L 115 20 L 115 70 C 115 95 140 110 150 140 L 150 220 L 50 220 L 50 140 C 60 110 85 95 85 70 Z" fill="#e0862e"/>
    <path d="M 40 120 L 160 120 L 160 230 L 40 230 Z" fill="#2f7d4a" clip-path="url(#b)"/>
    <defs><clipPath id="b"><path d="M 85 20 L 115 20 L 115 70 C 115 95 140 110 150 140 L 150 220 L 50 220 L 50 140 C 60 110 85 95 85 70 Z"/></clipPath></defs></svg>`;
  const plan = (neck: string, body: string) => ({ img: join(dir, 'ref.png').split('\\').join('/'), scale: 1, srcPx: 1,
    palette: ['#ffffff', '#e0862e', '#2f7d4a'],
    groups: [{ name: 'Bottle', parts: [
      { name: 'Neck', color: '#e0862e', tol: 40, seeds: [[100, 40]], box: [80, 15, 40, 110], draw: neck },
      { name: 'Body', color: '#2f7d4a', tol: 40, seeds: [[100, 180]], box: [45, 115, 110, 110], draw: body }] }] });
  beforeAll(async () => { await sharp(Buffer.from(ref)).png().toFile(join(dir, 'ref.png')); }, 30000);

  it('says nothing when the neck ends where the body starts, the curve running on', () => {
    // the body takes the flare over from the point where the neck meets it (y 120), same tangent
    const p = plan('M 85 20 L 115 20 L 115 70 C 115 87 126 100 134 112 L 100 135 L 66 112 C 74 100 85 87 85 70 Z',
      'M 66 112 L 134 112 C 141 122 148 130 150 140 L 150 220 L 50 220 L 50 140 C 52 130 59 122 66 112 Z');
    writeFileSync(join(dir, 'smooth.json'), JSON.stringify(p));
    const out = run('--plan', join(dir, 'smooth.json'), '--out', join(dir, 'smooth-scene.json'));
    expect(out).not.toMatch(/JOINT/);
  });
  it('names the two parts when they only overlap and meet with a kink', () => {
    // the same meeting point, but the body's shoulder leaves it at another angle: the outline breaks there (bottle test: 12° vs 1°)
    const p = plan('M 85 20 L 115 20 L 115 70 C 115 87 126 100 134 112 L 100 135 L 66 112 C 74 100 85 87 85 70 Z',
      'M 66 112 L 134 112 C 146 117 150 128 150 140 L 150 220 L 50 220 L 50 140 C 50 128 54 117 66 112 Z');
    writeFileSync(join(dir, 'kink.json'), JSON.stringify(p));
    const out = run('--plan', join(dir, 'kink.json'), '--out', join(dir, 'kink-scene.json'));
    expect(out).toMatch(/⚠ JOINT — .*(Neck → Body|Body → Neck)/);
    expect(JSON.parse(readFileSync(join(dir, 'kink-scene.json'), 'utf8')).groups[0].parts).toHaveLength(2);
  });
});
