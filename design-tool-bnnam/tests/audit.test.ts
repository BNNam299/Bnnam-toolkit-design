import { describe, expect, it } from 'vitest';
import {
  BLACKLISTED_NAME,
  DEFAULT_NAME,
  SEVERITY,
  buildReport,
  colorsDiffer,
  contrastRatio,
  contrastThreshold,
  contrastVerdict,
  isOffScale,
  isRedundantWrapper,
  nameProblem,
  targetSeverity,
  toQaMarkdown,
  type Issue,
} from '../src/shared/audit';

const rgb = (hex: string) => ({
  r: parseInt(hex.slice(1, 3), 16) / 255,
  g: parseInt(hex.slice(3, 5), 16) / 255,
  b: parseInt(hex.slice(5, 7), 16) / 255,
});

describe('names (file-standards §2.4)', () => {
  it('catches the names Figma invents', () => {
    for (const n of ['Frame 12', 'Rectangle 4', 'Ellipse 1', 'Group 7', 'Vector 2', 'Component 3']) {
      expect(DEFAULT_NAME.test(n), n).toBe(true);
      expect(nameProblem(n)).toBe('default-name');
    }
  });

  it('catches the forbidden names and dates', () => {
    for (const n of ['Copy', 'Copy of Card', 'Final', 'Final-final-v2', 'Untitled', 'Header 2026-10-19', 'v1 12/03/2026']) {
      expect(nameProblem(n), n).toBe('blacklisted-name');
    }
    expect(BLACKLISTED_NAME.test('Finalize')).toBe(false);
  });

  it('accepts meaningful names', () => {
    for (const n of ['Card/Balance', 'icon/chevron-right', 'decor/blob-top', 'Checkout / Payment / Error']) {
      expect(nameProblem(n), n).toBe(null);
    }
  });
});

describe('contrast (WCAG)', () => {
  it('computes the reference ratios', () => {
    expect(contrastRatio(rgb('#000000'), rgb('#FFFFFF'))).toBeCloseTo(21, 1);
    expect(contrastRatio(rgb('#777777'), rgb('#777777'))).toBeCloseTo(1, 5);
  });

  it('picks the threshold by size and weight', () => {
    expect(contrastThreshold(14)).toBe(4.5);
    expect(contrastThreshold(13, 400)).toBe(4.5);
    expect(contrastThreshold(24)).toBe(3);
    expect(contrastThreshold(19, 700)).toBe(3);
    expect(contrastThreshold(18, 700)).toBe(4.5);
  });

  it('reproduces the two real findings from the Mood/Insights audit', () => {
    const weak = contrastVerdict(rgb('#A9A5BF'), rgb('#FFFFFF'), 12);
    expect(weak.ratio).toBeLessThan(3);
    expect(weak.pass).toBe(false);

    const fixed = contrastVerdict(rgb('#6B6785'), rgb('#FFFFFF'), 12);
    expect(fixed.ratio).toBeGreaterThan(4.5);
    expect(fixed.pass).toBe(true);
  });
});

describe('scale and structure', () => {
  it('flags spacing off the 4/8 rhythm', () => {
    for (const ok of [0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 999]) expect(isOffScale(ok), String(ok)).toBe(false);
    for (const bad of [6, 10, 13, 14, 17, 22, 30]) expect(isOffScale(bad), String(bad)).toBe(true);
    expect(isOffScale(undefined)).toBe(false);
  });

  it('grades tap targets by WCAG 2.5.8 and the platform floor', () => {
    expect(targetSeverity(20, 20)).toBe('block');
    expect(targetSeverity(88, 32)).toBe('should');
    expect(targetSeverity(44, 44)).toBe(null);
  });

  it('spots a frame that only wraps one child', () => {
    expect(isRedundantWrapper({ type: 'FRAME', childCount: 1 })).toBe(true);
    expect(isRedundantWrapper({ type: 'FRAME', childCount: 1, hasPadding: true })).toBe(false);
    expect(isRedundantWrapper({ type: 'FRAME', childCount: 2 })).toBe(false);
  });
});

describe('report', () => {
  const issues: Issue[] = [
    { id: '1:1', kind: 'contrast', name: 'date', detail: '3.18:1 < 4.5:1' },
    { id: '1:2', kind: 'contrast', name: 'label', detail: '1.07:1 < 4.5:1' },
    { id: '1:3', kind: 'raw-fill', name: 'Card|Bad' },
    { id: '1:4', kind: 'default-name', name: 'Frame 12' },
    { id: '1:5', kind: 'redundant-wrapper', name: 'Row' },
  ];

  it('groups counts and severity', () => {
    const r = buildReport('Page 1', 42, issues);
    expect(r.counts).toEqual({ contrast: 2, 'raw-fill': 1, 'default-name': 1, 'redundant-wrapper': 1 });
    expect(r.severity).toEqual({ block: 2, should: 2, nice: 1 });
    expect(r.scanned).toBe(42);
    expect(r.samples.contrast).toHaveLength(2);
  });

  it('honours a per-issue severity override', () => {
    const r = buildReport('Page 1', 3, [
      { id: '1:1', kind: 'contrast', name: 'on gradient', severity: 'nice' },
      { id: '1:2', kind: 'small-target', name: '32pt chip', severity: 'should' },
      { id: '1:3', kind: 'small-target', name: '20pt icon', severity: 'block' },
    ]);
    expect(r.severity).toEqual({ block: 1, should: 1, nice: 1 });
  });

  it('writes the skill QA template and blocks handoff on any Chặn', () => {
    const md = toQaMarkdown(buildReport('Page 1', 42, issues), { file: 'Untitled', date: '2026-10-19', author: 'test' });
    expect(md).toContain('# Báo cáo QA Figma — Untitled');
    expect(md).toContain('🔴 Chưa bàn giao được');
    expect(md).toContain('| A. Cấu trúc | 0 | 1 | 0 |');
    expect(md).toContain('| E. Accessibility | 2 | 0 | 0 |');
    expect(md).toContain('QA-01');
    expect(md).toContain('Card\\|Bad'); // pipes escaped
  });

  it('passes handoff when nothing is blocking', () => {
    const md = toQaMarkdown(buildReport('Page 1', 10, [{ id: '1:5', kind: 'redundant-wrapper', name: 'Row' }]));
    expect(md).toContain('🟢 Sẵn sàng bàn giao');
  });

  it('assigns a severity to every issue kind', () => {
    const kinds = Object.keys(SEVERITY);
    expect(kinds).toHaveLength(20);
    for (const k of kinds) expect(['block', 'should', 'nice']).toContain(SEVERITY[k as keyof typeof SEVERITY]);
  });
});

describe('colorsDiffer (stale-paint)', () => {
  it('flags a bound paint that kept its fallback colour', () => {
    // Manual boundVariables left #FFFFFF while the variable is #1A1A26.
    expect(colorsDiffer(rgb('#FFFFFF'), rgb('#1A1A26'))).toBe(true);
    expect(colorsDiffer(rgb('#000000'), rgb('#55556B'))).toBe(true);
  });

  it('accepts the resolved colour, within 1/255 rounding', () => {
    expect(colorsDiffer(rgb('#1A1A26'), rgb('#1A1A26'))).toBe(false);
    const c = rgb('#1A1A26');
    expect(colorsDiffer({ r: c.r + 0.002, g: c.g, b: c.b }, c)).toBe(false);
  });

  it('marks stale-paint as a blocker', () => {
    expect(SEVERITY['stale-paint']).toBe('block');
  });
});
