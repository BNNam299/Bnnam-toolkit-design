
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SlotInfo {
  box: Box;
  layout: 'NONE' | 'HORIZONTAL' | 'VERTICAL' | 'GRID';
  primary?: string;
  counter?: string;
  padding?: [number, number, number, number];
}

export const MAX_SLOT = 64;
export const ICON_TOLERANCE = 1;

export function isSlotSize(box: Box): boolean {
  return box.w > 0 && box.h > 0 && box.w <= MAX_SLOT && box.h <= MAX_SLOT;
}

export function glyphOffset(slot: Box, glyph: Box): { dx: number; dy: number } {
  const round = (n: number) => Math.round(n * 10) / 10;
  return {
    dx: round(glyph.x + glyph.w / 2 - (slot.x + slot.w / 2)),
    dy: round(glyph.y + glyph.h / 2 - (slot.y + slot.h / 2)),
  };
}

const direction = (dx: number, dy: number) =>
  [dy < -ICON_TOLERANCE ? 'trên' : dy > ICON_TOLERANCE ? 'dưới' : '', dx < -ICON_TOLERANCE ? 'trái' : dx > ICON_TOLERANCE ? 'phải' : '']
    .filter(Boolean)
    .join(' ');

export function iconProblem(slot: SlotInfo, glyph: Box, inFrame?: { dx: number; dy: number }): string | null {
  const { dx, dy } = glyphOffset(slot.box, glyph);
  if (Math.abs(dx) <= ICON_TOLERANCE && Math.abs(dy) <= ICON_TOLERANCE) return null;
  const where = `glyph lệch ${direction(dx, dy)} (${dx > 0 ? '+' : ''}${dx}, ${dy > 0 ? '+' : ''}${dy} px) so với tâm slot ${Math.round(slot.box.w)}×${Math.round(slot.box.h)}`;
  const causes: string[] = [];
  if (slot.layout === 'NONE' || slot.layout === 'GRID') {
    causes.push('slot không có auto layout nên icon nằm ở (0,0) — đặt layout:"HORIZONTAL", justify:"CENTER", align:"CENTER"');
  } else {
    const bad = [slot.primary !== 'CENTER' ? `justify=${slot.primary}` : '', slot.counter !== 'CENTER' ? `align=${slot.counter}` : ''].filter(Boolean);
    if (bad.length) causes.push(`${bad.join(', ')} — slot icon cần justify:"CENTER" và align:"CENTER" (justify là trục ${slot.layout === 'VERTICAL' ? 'dọc' : 'ngang'} của slot này)`);
    const [t, r, b, l] = slot.padding ?? [0, 0, 0, 0];
    if (t !== b || l !== r) causes.push(`padding không đối xứng [${t}, ${r}, ${b}, ${l}] (trên, phải, dưới, trái) — dùng một số padding hoặc bỏ padding`);
  }
  if (!causes.length && inFrame && (Math.abs(inFrame.dx) > ICON_TOLERANCE || Math.abs(inFrame.dy) > ICON_TOLERANCE)) {
    causes.push('slot căn giữa đúng, nhưng glyph lệch ngay trong khung icon (path SVG không nằm giữa viewBox, hoặc ký tự text) — dùng icon có viewBox cân, hoặc SVG thay cho ký tự');
  }
  return `${where}: ${causes.join('; ') || 'kiểm tra vị trí icon bằng screenshot'}`;
}
