// The Foundations page (figma-ui-flow Stage 2.5): swatches, type specimen,
// spacing ruler, radius and elevation, generated as a render_tree spec that
// binds every sample to the real variable or style. Pure: the plugin passes
// lists of what the file defines.
import type { TreeNode } from './schemas';

export interface FoundationVar {
  id: string;
  name: string;
  collection: string;
  type: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
  display: string; // hex or number in the default mode, for the caption
}

export interface FoundationData {
  variables: FoundationVar[];
  textStyles: { name: string; caption: string }[];
  effectStyles: { name: string }[];
}

const INK = '#0F172A';
const MUTED = '#64748B';
const LINE = '#E2E8F0';

const caption = (text: string, color = MUTED): TreeNode => ({ type: 'text', text, fontSize: 12, color, name: 'caption' });
const heading = (text: string): TreeNode => ({ type: 'text', text, fontSize: 28, fontWeight: 700, color: INK, name: 'title' });

function section(name: string, children: TreeNode[]): TreeNode {
  return {
    type: 'frame',
    name: `section/${name.toLowerCase()}`,
    layout: 'VERTICAL',
    gap: 24,
    widthMode: 'FILL',
    children: [heading(name), ...children],
  };
}

const groupBy = <T>(items: T[], key: (t: T) => string) => {
  const m = new Map<string, T[]>();
  for (const i of items) m.set(key(i), [...(m.get(key(i)) ?? []), i]);
  return m;
};

// "color/text/primary" → group "color/text".
const groupOf = (name: string) => name.split('/').slice(0, -1).join('/') || name;

export function foundationsTree(d: FoundationData): TreeNode {
  const children: TreeNode[] = [];

  const colors = d.variables.filter((v) => v.type === 'COLOR');
  if (colors.length) {
    const rows: TreeNode[] = [];
    for (const [collection, vars] of groupBy(colors, (v) => v.collection)) {
      for (const [group, items] of groupBy(vars, (v) => groupOf(v.name))) {
        rows.push(caption(`${collection} · ${group}`, INK));
        rows.push({
          type: 'frame',
          name: `swatches/${group}`,
          layout: 'HORIZONTAL',
          wrap: true,
          gap: 16,
          counterGap: 16,
          widthMode: 'FILL',
          children: items.map((v) => ({
            type: 'frame',
            name: `swatch/${v.name}`,
            layout: 'VERTICAL',
            gap: 8,
            width: 120,
            children: [
              { type: 'rect', name: 'chip', width: 120, height: 72, radius: 12, fill: { var: v.id }, stroke: { color: LINE, width: 1 } },
              caption(v.name.split('/').pop()!, INK),
              caption(v.display),
            ],
          })),
        });
      }
    }
    children.push(section('Colors', rows));
  }

  if (d.textStyles.length) {
    children.push(
      section(
        'Typography',
        d.textStyles.map((s) => ({
          type: 'frame',
          name: `specimen/${s.name}`,
          layout: 'HORIZONTAL',
          gap: 32,
          align: 'CENTER',
          widthMode: 'FILL',
          children: [
            { type: 'frame', name: 'meta', layout: 'VERTICAL', gap: 4, width: 200, children: [caption(s.name, INK), caption(s.caption)] },
            { type: 'text', name: 'sample', text: 'Thiết kế rõ ràng, dễ dùng', textStyle: s.name, widthMode: 'FILL' },
          ],
        })),
      ),
    );
  }

  const numbers = d.variables.filter((v) => v.type === 'FLOAT');
  const spacing = numbers.filter((v) => /(^|\/)(space|spacing|gap|inset)(\/|$)/.test(v.name));
  if (spacing.length) {
    children.push(
      section(
        'Spacing',
        spacing.map((v) => ({
          type: 'frame',
          name: `ruler/${v.name}`,
          layout: 'HORIZONTAL',
          gap: 16,
          align: 'CENTER',
          children: [
            { type: 'frame', name: 'meta', layout: 'VERTICAL', width: 200, children: [caption(`${v.collection} · ${v.name}`, INK)] },
            { type: 'rect', name: 'bar', width: { var: v.id }, height: 16, fill: '#6366F1' },
            caption(`${v.display}px`),
          ],
        })),
      ),
    );
  }

  const radii = numbers.filter((v) => /(^|\/)radius(\/|$)/.test(v.name));
  if (radii.length) {
    children.push(
      section('Radius', [
        {
          type: 'frame',
          name: 'radius',
          layout: 'HORIZONTAL',
          wrap: true,
          gap: 24,
          widthMode: 'FILL',
          children: radii.map((v) => ({
            type: 'frame',
            name: `radius/${v.name}`,
            layout: 'VERTICAL',
            gap: 8,
            children: [{ type: 'rect', name: 'sample', width: 96, height: 96, radius: { var: v.id }, fill: '#E0E7FF' }, caption(`${v.name} · ${v.display}`)],
          })),
        },
      ]),
    );
  }

  if (d.effectStyles.length) {
    children.push(
      section('Elevation', [
        {
          type: 'frame',
          name: 'elevation',
          layout: 'HORIZONTAL',
          wrap: true,
          gap: 32,
          widthMode: 'FILL',
          children: d.effectStyles.map((s) => ({
            type: 'frame',
            name: `elevation/${s.name}`,
            layout: 'VERTICAL',
            padding: 24,
            width: 160,
            height: 120,
            radius: 12,
            fill: '#FFFFFF',
            effects: { style: s.name },
            children: [caption(s.name, INK)],
          })),
        },
      ]),
    );
  }

  if (!children.length) children.push(caption('File chưa có variable/style nào — chạy create_variables / import_tokens trước.'));

  return {
    type: 'frame',
    name: 'Foundations',
    layout: 'VERTICAL',
    width: 1440,
    padding: 80,
    gap: 64,
    fill: '#FFFFFF',
    children: [
      { type: 'text', name: 'title', text: 'Foundations', fontSize: 48, fontWeight: 700, color: INK },
      caption('Sinh tự động bởi render_foundations — mọi mẫu bind tới variable/style thật.'),
      ...children,
    ],
  };
}
