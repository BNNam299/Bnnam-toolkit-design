import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

// The copy-job script of the figma-vector-illustration skill: it prepares a reference the draft would lose (thin ink + blends,
// heavy grain) and reports areas of the reference no part covers. Clean references must draft exactly as before.
const require = createRequire(import.meta.url);
const sharp = require('sharp') as typeof import('sharp');
const SCRIPT = resolve(__dirname, '../.claude/skills/figma-vector-illustration/scripts/vectorize.cjs');
const dir = mkdtempSync(join(tmpdir(), 'vz-prep-'));
const run = (...a: string[]) => execFileSync('node', [SCRIPT, ...a], { encoding: 'utf8', maxBuffer: 1 << 26 });
const plan = (f: string) => JSON.parse(readFileSync(join(dir, f), 'utf8'));

// a sticker: flat colours framed by a thin (2 px) dark ink, as the thin-ink JPEG in the test run
const sticker = (ink: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><rect width="320" height="320" fill="#ffffff"/>
  ${[0, 1, 2, 3].map((i) => `<rect x="${20 + i * 72}" y="40" width="60" height="230" rx="18" fill="${['#00a5d3', '#ffd654', '#e443dc', '#0175da'][i]}" stroke="#022b5c" stroke-width="${ink}"/>`).join('')}
  ${[0, 1, 2, 3].map((i) => `<circle cx="${50 + i * 72}" cy="120" r="14" fill="#ffffff" stroke="#022b5c" stroke-width="${ink}"/><path d="M ${35 + i * 72} 200 Q ${50 + i * 72} 215 ${65 + i * 72} 200" fill="none" stroke="#022b5c" stroke-width="${ink}"/>`).join('')}</svg>`;

beforeAll(async () => {
  await sharp(Buffer.from(sticker(6))).png().toFile(join(dir, 'clean.png'));
  await sharp(Buffer.from(sticker(2))).jpeg({ quality: 35 }).toFile(join(dir, 'thin.jpg'));
  // grain: a soft figure with heavy per-pixel noise (a painted texture, as the grainy girl)
  const { data, info } = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="#fedda8"/>
    <ellipse cx="150" cy="150" rx="100" ry="120" fill="#cd9d6d"/><circle cx="150" cy="110" r="40" fill="#ecbaad"/></svg>`)).raw().toBuffer({ resolveWithObject: true });
  let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < data.length; i += info.channels) { const n = (rnd() - 0.5) * 34; for (let c = 0; c < 3; c++) data[i + c] = Math.max(0, Math.min(255, data[i + c] + n)); }
  await sharp(data, { raw: info }).png().toFile(join(dir, 'grain.png'));
}, 60000);

describe('vectorize --auto-plan prepares a reference the draft would lose', () => {
  it('leaves a clean reference alone (same draft as before)', () => {
    const out = run('--auto-plan', join(dir, 'clean.json'), '--img', join(dir, 'clean.png'));
    expect(out).not.toMatch(/reference prepared/);
    const p = plan('clean.json');
    expect(p.prep).toBeUndefined();
    expect(p.img).toBe(join(dir, 'clean.png'));
    expect(p.srcPx).toBe(1);
  }, 60000);

  it('thin ink on a compressed image → upscaled, snapped to flat colours, read with srcPx = the factor', () => {
    const out = run('--auto-plan', join(dir, 'thin.json'), '--img', join(dir, 'thin.jpg'), '--scale', '2');
    expect(out).toMatch(/reference prepared \(flat\)/);
    const p = plan('thin.json');
    expect(p.prep.mode).toBe('flat');
    expect(p.prep.from).toBe(join(dir, 'thin.jpg'));
    expect(p.srcPx).toBe(p.prep.factor);
    expect(p.scale).toBeCloseTo(2 / p.prep.factor, 4);
    expect(existsSync(p.img)).toBe(true);
    // the ink survives as its own part
    const ink = p.groups[0].parts.filter((q: { color: string }) => { const n = parseInt(q.color.slice(1), 16); return (n >> 16) + ((n >> 8) & 255) + (n & 255) < 200; });
    expect(ink.length).toBeGreaterThan(0);
  }, 120000);

  it('heavy grain → denoised at its own size', () => {
    const out = run('--auto-plan', join(dir, 'grain.json'), '--img', join(dir, 'grain.png'));
    expect(out).toMatch(/reference prepared \(denoise\)/);
    const p = plan('grain.json');
    expect(p.prep.mode).toBe('denoise');
    expect(p.srcPx).toBe(1);
  }, 60000);

  it('--no-prep keeps the reference as it is', () => {
    const out = run('--auto-plan', join(dir, 'raw.json'), '--img', join(dir, 'thin.jpg'), '--no-prep');
    expect(out).not.toMatch(/reference prepared/);
    expect(plan('raw.json').prep).toBeUndefined();
  }, 60000);

  it('the lock pass carries the prep record', () => {
    const d = plan('thin.json');
    writeFileSync(join(dir, 'names.json'), JSON.stringify({ groups: [{ name: 'All', parts: [{ name: 'All', from: d.groups[0].parts.map((q: { name: string }) => q.name) }] }] }));
    run('--names', join(dir, 'names.json'), '--plan', join(dir, 'thin.json'), '--to', join(dir, 'locked.json'));
    expect(plan('locked.json').prep).toEqual(d.prep);
  }, 60000);
});

describe('vectorize build reports areas no part covers', () => {
  it('a plan that misses a shape gets a NOT DRAWN line with its colour and box', () => {
    const p = plan('clean.json');
    // keep only the first column's parts: the three others are not drawn
    p.groups[0].parts = p.groups[0].parts.filter((q: { box: number[] }) => q.box[0] < 90);
    writeFileSync(join(dir, 'partial.json'), JSON.stringify(p));
    const out = run('--plan', join(dir, 'partial.json'), '--out', join(dir, 'partial-scene.json'));
    expect(out).toMatch(/NOT DRAWN — \d+ area/);
    expect(out).toMatch(/#ffd654|#e443dc|#0175da/);
  }, 60000);

  it('a full draft reports nothing', () => {
    const out = run('--plan', join(dir, 'clean.json'), '--out', join(dir, 'clean-scene.json'));
    expect(out).not.toMatch(/NOT DRAWN/);
  }, 60000);
});

describe('vectorize — layered build (as the designer draws: base whole, shade cut from a duplicate of it)', () => {
  it('a part with "cut" is emitted as a cutter of its base; "also" makes the base whole; "shading": "mask" switches to a mask', async () => {
    // a two-tone box: light left, dark right — the base is the whole box, the dark half is cut from it
    await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#ffffff"/>
      <rect x="40" y="30" width="120" height="140" rx="20" fill="#4b8e49"/><path d="M 110 30 L 140 30 Q 160 30 160 50 L 160 150 Q 160 170 140 170 L 110 170 Z" fill="#246054"/></svg>`)).png().toFile(join(dir, 'box.png'));
    run('--auto-plan', join(dir, 'box.json'), '--img', join(dir, 'box.png'));
    const d = plan('box.json'), parts = d.groups[0].parts as { name: string; color: string }[];
    const light = parts.find((q) => q.color.toLowerCase() === '#4b8e49')!, dark = parts.find((q) => q.color.toLowerCase() === '#246054')!;
    const names = (shading?: string) => JSON.stringify({ ...(shading ? { shading } : {}), groups: [{ name: 'Box', parts: [
      { name: 'Box', from: [light.name], also: [dark.name] }, { name: 'Box shade', from: [dark.name], cut: light.name }] }],
      drop: parts.filter((q) => q !== light && q !== dark).map((q) => q.name) });
    writeFileSync(join(dir, 'box-names.json'), names());
    run('--names', join(dir, 'box-names.json'), '--plan', join(dir, 'box.json'), '--to', join(dir, 'box-plan.json'));
    const locked = plan('box-plan.json');
    expect(locked.groups[0].parts[1].cut).toBe('Box');
    expect(locked.groups[0].parts[0].also).toEqual(['Box shade']);
    run('--plan', join(dir, 'box-plan.json'), '--out', join(dir, 'box-scene.json'));
    const scene = plan('box-scene.json'), [base, shade] = scene.groups[0].parts;
    expect(shade.cutFrom).toBe('Box');
    // the base is the WHOLE box (light + dark), the cutter runs past the base's outer edge
    expect(base.x).toBeLessThanOrEqual(41);
    const [bx1, sx1] = [base.x + Math.max(...base.d.match(/-?[\d.]+/g).filter((_: string, i: number) => i % 2 === 0).map(Number)),
      shade.x + Math.max(...shade.d.match(/-?[\d.]+/g).filter((_: string, i: number) => i % 2 === 0).map(Number))];
    expect(bx1).toBeGreaterThan(155);
    expect(sx1).toBeGreaterThan(bx1);
    writeFileSync(join(dir, 'box-names.json'), names('mask'));
    run('--names', join(dir, 'box-names.json'), '--plan', join(dir, 'box.json'), '--to', join(dir, 'box-plan.json'));
    run('--plan', join(dir, 'box-plan.json'), '--out', join(dir, 'box-scene.json'));
    const masked = plan('box-scene.json').groups[0].parts[1];
    expect(masked.maskOf).toBe('Box');
    expect(masked.cutFrom).toBeUndefined();
  }, 120000);
});
