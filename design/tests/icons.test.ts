import { describe, expect, it } from 'vitest';
import { glyphOffset, iconProblem, isSlotSize, type SlotInfo } from '../src/shared/icons';

// A 44×44 slot at the origin; a 20×20 glyph placed where Figma put it in the
// reproduced cases (Forge, 2026-10-20).
const slot = (over: Partial<SlotInfo> = {}): SlotInfo => ({
  box: { x: 0, y: 0, w: 44, h: 44 },
  layout: 'HORIZONTAL',
  primary: 'CENTER',
  counter: 'CENTER',
  padding: [0, 0, 0, 0],
  ...over,
});
const glyphAt = (x: number, y: number) => ({ x, y, w: 20, h: 20 });

describe('icon slots', () => {
  it('only treats small frames as slots', () => {
    expect(isSlotSize({ x: 0, y: 0, w: 44, h: 44 })).toBe(true);
    expect(isSlotSize({ x: 0, y: 0, w: 361, h: 8 })).toBe(false);
  });

  it('accepts a centred glyph, within a pixel', () => {
    expect(iconProblem(slot(), glyphAt(12, 12))).toBeNull();
    expect(iconProblem(slot(), glyphAt(12.8, 11.4))).toBeNull();
  });

  it('measures the offset from the slot centre', () => {
    expect(glyphOffset({ x: 0, y: 0, w: 44, h: 44 }, glyphAt(24, 0))).toEqual({ dx: 12, dy: -12 });
  });

  it('blames a slot without auto layout (icon stuck at 0,0)', () => {
    const p = iconProblem(slot({ layout: 'NONE' }), glyphAt(0, 0));
    expect(p).toMatch(/trên trái/);
    expect(p).toMatch(/không có auto layout/);
  });

  it('blames justify/align swapped between axes (top-right)', () => {
    const p = iconProblem(slot({ primary: 'MAX', counter: 'MIN' }), glyphAt(24, 0));
    expect(p).toMatch(/trên phải/);
    expect(p).toMatch(/justify=MAX, align=MIN/);
  });

  it('names the vertical axis for a vertical slot given justify only', () => {
    const p = iconProblem(slot({ layout: 'VERTICAL', primary: 'CENTER', counter: 'MIN' }), glyphAt(0, 12));
    expect(p).toMatch(/align=MIN/);
    expect(p).toMatch(/trục dọc/);
  });

  it('blames uneven padding (pushed up-right)', () => {
    const p = iconProblem(slot({ padding: [0, 0, 8, 8] }), glyphAt(16, 8));
    expect(p).toMatch(/trên phải/);
    expect(p).toMatch(/padding không đối xứng \[0, 0, 8, 8\]/);
  });

  it('blames the glyph itself when the slot is right (text arrow, off-centre viewBox)', () => {
    const p = iconProblem(slot(), glyphAt(12, 15), { dx: 0, dy: 3 });
    expect(p).toMatch(/dưới/);
    expect(p).toMatch(/trong khung icon/);
  });
});
