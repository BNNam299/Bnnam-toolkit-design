// Pure QA logic for the figma-ui-flow audit (Stage 7). Kept free of the
// Figma API so it can be unit-tested; the plugin command feeds it node data.
//
// Severity mapping follows figma-ui-flow `handoff-qa.md` §3:
//   🔴 Chặn   – broken behaviour, broken layout, WCAG AA violation, missing state
//   🟡 Nên sửa – inconsistency, system debt (raw values, off-scale spacing)
//   🔵 Gợi ý  – quality improvement

export type RGB = { r: number; g: number; b: number };

export type IssueKind =
  | 'default-name'
  | 'blacklisted-name'
  | 'raw-fill'
  | 'raw-text'
  | 'no-autolayout'
  | 'small-target'
  | 'off-scale-spacing'
  | 'redundant-wrapper'
  | 'contrast'
  | 'detached-instance'
  | 'hidden-layer'
  | 'orphan-token'
  | 'raw-stroke'
  | 'raw-radius'
  | 'primitive-bound'
  | 'stale-paint'
  | 'icon-offcenter'
  | 'lorem'
  | 'outside-section'
  | 'variant-explosion';

export type Severity = 'block' | 'should' | 'nice';

export const SEVERITY: Record<IssueKind, Severity> = {
  contrast: 'block',
  'small-target': 'block',
  'detached-instance': 'should',
  'raw-fill': 'should',
  'raw-text': 'should',
  'no-autolayout': 'should',
  'off-scale-spacing': 'should',
  'default-name': 'should',
  'blacklisted-name': 'should',
  'orphan-token': 'should',
  'redundant-wrapper': 'nice',
  'hidden-layer': 'nice',
  'raw-stroke': 'should',
  'raw-radius': 'should',
  'primitive-bound': 'should',
  // The binding looks right but Figma paints the stale colour: broken render.
  'stale-paint': 'block',
  'icon-offcenter': 'should',
  lorem: 'should',
  'outside-section': 'nice',
  'variant-explosion': 'should',
};

export const SEVERITY_LABEL: Record<Severity, string> = { block: '🔴 Chặn', should: '🟡 Nên sửa', nice: '🔵 Gợi ý' };

// `Frame 12`, `Rectangle 4`… — the names Figma invents.
export const DEFAULT_NAME = /^(Frame|Rectangle|Ellipse|Group|Vector|Text|Line|Polygon|Star|Component|Slice|Boolean|Shape|Union|Subtract|Intersect|Exclude) \d+$/;

// `file-standards.md` §2.4 forbids these outright.
export const BLACKLISTED_NAME = /^(Copy( of .*)?|Final([- ]?final)*([- ]?v\d+)?|Untitled|Group \d+ copy)$/i;

// A bound paint whose own colour is not the variable's value: Figma renders
// the paint colour, so the layer shows the stale one. Within 1/255 is equal.
export function colorsDiffer(paint: RGB, value: RGB): boolean {
  const eps = 1 / 255;
  return Math.abs(paint.r - value.r) > eps || Math.abs(paint.g - value.g) > eps || Math.abs(paint.b - value.b) > eps;
}
const DATE_IN_NAME = /(\d{4}-\d{2}-\d{2})|(\d{1,2}\/\d{1,2}\/\d{2,4})/;

export function nameProblem(name: string): 'default-name' | 'blacklisted-name' | null {
  if (DEFAULT_NAME.test(name)) return 'default-name';
  if (BLACKLISTED_NAME.test(name) || DATE_IN_NAME.test(name)) return 'blacklisted-name';
  return null;
}

// --- colour contrast (WCAG 2.x) -------------------------------------------

export function relativeLuminance(c: RGB): number {
  const f = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
}

export function contrastRatio(a: RGB, b: RGB): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const isBold = (weight: number | string | undefined): boolean => {
  if (typeof weight === 'number') return weight >= 700;
  if (typeof weight === 'string') return /bold|heavy|black|700|800|900/i.test(weight);
  return false;
};

// WCAG: large text (≥24px, or ≥18.66px bold) needs 3:1, everything else 4.5:1.
export function contrastThreshold(fontSize = 14, fontWeight?: number | string): number {
  const large = fontSize >= 24 || (fontSize >= 18.66 && isBold(fontWeight));
  return large ? 3 : 4.5;
}

// Gradient backdrops (B2): the text must pass against every stop, so the
// verdict is the worst stop. Images stay unverifiable (needs-check).
export function worstContrast(fg: RGB, stops: RGB[], fontSize?: number, fontWeight?: number | string) {
  let worst = contrastVerdict(fg, stops[0], fontSize, fontWeight);
  for (const s of stops.slice(1)) {
    const v = contrastVerdict(fg, s, fontSize, fontWeight);
    if (v.ratio < worst.ratio) worst = v;
  }
  return worst;
}

// handoff-qa.md F1: placeholder copy must not reach handoff.
export const LOREM = /lorem ipsum|dolor sit amet|consectetur adipiscing/i;

export function contrastVerdict(fg: RGB, bg: RGB, fontSize?: number, fontWeight?: number | string) {
  const ratio = contrastRatio(fg, bg);
  const need = contrastThreshold(fontSize, fontWeight);
  return { ratio: Math.round(ratio * 100) / 100, need, pass: ratio >= need };
}

// --- spacing scale (file-standards.md §3.3) -------------------------------

// 4/8 rhythm: 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 (+ 0 and the "full" 999).
export const SPACE_SCALE = [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 999];

export function isOffScale(value: number | undefined): boolean {
  if (value === undefined || !Number.isFinite(value)) return false;
  if (value === 0) return false;
  return !SPACE_SCALE.some((s) => Math.abs(s - value) < 0.51);
}

// --- structure ------------------------------------------------------------

// A frame that only wraps a single child and adds nothing visual is noise
// (file-standards.md §3.4).
export function isRedundantWrapper(n: { type?: string; childCount?: number; hasVisual?: boolean; hasPadding?: boolean }): boolean {
  return n.type === 'FRAME' && (n.childCount ?? 0) === 1 && !n.hasVisual && !n.hasPadding;
}

// Tap-target: WCAG 2.5.8 requires ≥24px (AA); the platform standards ask 44/48.
export function targetSeverity(width: number, height: number): Severity | null {
  const min = Math.min(width, height);
  if (min < 24) return 'block';
  if (min < 44) return 'should';
  return null;
}

// --- report ---------------------------------------------------------------

export interface Issue {
  id: string;
  kind: IssueKind;
  name: string;
  detail?: string;
  rect?: { x: number; y: number; w: number; h: number };
  // Per-issue override: e.g. an unverifiable contrast case is "nice", and a
  // 24–43pt tap target is "should" while <24pt is "block".
  severity?: Severity;
}

export interface AuditReport {
  scope: string;
  scanned: number;
  issues: Issue[];
  counts: Record<string, number>;
  severity: Record<Severity, number>;
  samples: Record<string, Issue[]>;
  truncated: boolean;
}

export function buildReport(scope: string, scanned: number, issues: Issue[], limit = 50): AuditReport {
  const counts: Record<string, number> = {};
  const severity: Record<Severity, number> = { block: 0, should: 0, nice: 0 };
  for (const i of issues) {
    counts[i.kind] = (counts[i.kind] ?? 0) + 1;
    severity[i.severity ?? SEVERITY[i.kind]]++;
  }
  const samples: Record<string, Issue[]> = {};
  for (const kind of Object.keys(counts)) samples[kind] = issues.filter((i) => i.kind === kind).slice(0, limit);
  return { scope, scanned, issues, counts, severity, samples, truncated: issues.length > Object.keys(counts).length * limit };
}

// Renders `assets/qa-report.template.md` of the figma-ui-flow skill.
export function toQaMarkdown(report: AuditReport, opts: { file?: string; date?: string; author?: string } = {}): string {
  const rows: string[] = [];
  let n = 0;
  for (const kind of Object.keys(report.counts)) {
    for (const i of report.samples[kind]) {
      rows.push(
        `| QA-${String(++n).padStart(2, '0')} | ${SEVERITY_LABEL[i.severity ?? SEVERITY[i.kind]]} | ${i.kind} | ${escapeCell(i.name)} \`${i.id}\` | ${escapeCell(i.detail ?? '')} | ${fixHint(i.kind)} | Mở |`,
      );
    }
  }
  const verdict = report.severity.block > 0 ? '🔴 Chưa bàn giao được' : '🟢 Sẵn sàng bàn giao';
  const groupOf: Record<string, string> = {
    'default-name': 'A', 'blacklisted-name': 'A', 'hidden-layer': 'A', 'detached-instance': 'A',
    'outside-section': 'A', 'variant-explosion': 'A',
    'raw-fill': 'B', 'raw-text': 'B', 'orphan-token': 'B', 'raw-stroke': 'B', 'raw-radius': 'B', 'primitive-bound': 'B', 'stale-paint': 'B',
    'no-autolayout': 'C', 'redundant-wrapper': 'C', 'off-scale-spacing': 'C', 'icon-offcenter': 'C',
    contrast: 'E', 'small-target': 'E',
    lorem: 'F',
  };
  const groups: Record<string, { block: number; should: number; nice: number }> = {};
  for (const i of report.issues) {
    const g = groupOf[i.kind] ?? '?';
    groups[g] ??= { block: 0, should: 0, nice: 0 };
    groups[g][i.severity ?? SEVERITY[i.kind]]++;
  }
  const label: Record<string, string> = { A: 'A. Cấu trúc', B: 'B. Token', C: 'C. Layout', D: 'D. Trạng thái', E: 'E. Accessibility', F: 'F. Nội dung' };
  return `# Báo cáo QA Figma — ${opts.file ?? report.scope}

- **Ngày:** ${opts.date ?? new Date().toISOString().slice(0, 10)} · **Người kiểm:** ${opts.author ?? 'figma-agent (audit_design)'}
- **Phạm vi:** ${report.scope} · ${report.scanned} layer đã quét
- **Kết luận:** ${verdict}

## Tổng hợp
| Nhóm | 🔴 Chặn | 🟡 Nên sửa | 🔵 Gợi ý |
|---|---|---|---|
${Object.keys(label).map((g) => `| ${label[g]} | ${groups[g]?.block ?? 0} | ${groups[g]?.should ?? 0} | ${groups[g]?.nice ?? 0} |`).join('\n')}

## Chi tiết (tối đa ${Object.keys(report.counts).length ? 'mẫu giới hạn mỗi nhóm' : 'không có'})
| ID | Mức | Nhóm lỗi | Vị trí (layer + node ID) | Mô tả | Đề xuất sửa | Trạng thái |
|---|---|---|---|---|---|---|
${rows.length ? rows.join('\n') : '| – | – | – | – | Không phát hiện lỗi | – | – |'}

## Ghi chú kiểm tra tự động
- B3/D4 (trạng thái, bàn phím) cần người kiểm — audit chỉ đọc được cấu trúc.
- Tương phản: nền màu đặc tính trực tiếp, nền gradient lấy điểm dừng tệ nhất; nền ảnh/blend ghi \`needs-check\`.
- Mục \`raw-fill\` đếm cả trường hợp hợp lệ trong file chưa có design system.
`;
}

const escapeCell = (s: string) => s.replace(/\|/g, '\\|').slice(0, 60);

function fixHint(kind: IssueKind): string {
  switch (kind) {
    case 'default-name':
      return 'Đổi tên theo vai trò (`title`, `icon/…`, `decor/…`)';
    case 'blacklisted-name':
      return 'Đổi tên theo quy tắc `Flow / Screen / State`';
    case 'raw-fill':
      return 'Bind Semantic variable hoặc paint style';
    case 'raw-text':
      return 'Dùng text style thay vì set cỡ/weight trực tiếp';
    case 'no-autolayout':
      return 'Bật Auto Layout (hoặc đổi tên `decor/…` nếu là lớp trang trí)';
    case 'small-target':
      return 'Nới vùng chạm ≥ 44×44 (thêm padding trong suốt)';
    case 'off-scale-spacing':
      return 'Đưa về thang 4/8 (2,4,8,12,16,20,24,32,40,48,64) — bind variable';
    case 'redundant-wrapper':
      return 'Bỏ frame bọc 1 lớp nếu không có padding/fill/stroke riêng';
    case 'contrast':
      return 'Tăng tương phản tới ngưỡng (4.5:1 chữ thường, 3:1 chữ lớn)';
    case 'detached-instance':
      return 'Detach là nợ thiết kế — ghi lý do hoặc gắn lại component';
    case 'hidden-layer':
      return 'Xoá layer ẩn không dùng';
    case 'orphan-token':
      return 'Xoá token mồ côi hoặc ghi chú lý do giữ';
    case 'raw-stroke':
      return 'Bind `color/border/*` variable hoặc paint style';
    case 'raw-radius':
      return 'Bind `radius/*` variable (bind_variables)';
    case 'primitive-bound':
      return 'Đổi sang Semantic token; nếu biến đã ở Semantic mà scopes rỗng thì đặt lại scopes';
    case 'icon-offcenter':
      return 'Slot icon: layout HORIZONTAL + justify/align CENTER, padding đối xứng';
    case 'stale-paint':
      return 'Bind lại bằng update_nodes `{var}` hoặc setBoundVariableForPaint (không gán boundVariables thủ công)';
    case 'lorem':
      return 'Thay bằng nội dung thật';
    case 'outside-section':
      return 'Đưa frame vào Section theo flow';
    case 'variant-explosion':
      return 'Chuyển bớt trục variant sang boolean/instance-swap property hoặc mode';
  }
}
