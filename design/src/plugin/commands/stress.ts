// figma-ui-flow Stage 3 Playground / handoff-qa D2: copies of a frame
// under hostile content (long text, large type, narrow/wide, other mode),
// side by side in one Section, plus a cheap overflow check per copy.
import type { StressTestInput } from '../../shared/schemas';
import { loadNodeFonts } from '../fonts';
import { freeSpot, getSceneNode } from '../util';

type Box = { x: number; y: number; width: number; height: number };

const outside = (inner: Box, outer: Box) =>
  inner.x < outer.x - 0.5 ||
  inner.y < outer.y - 0.5 ||
  inner.x + inner.width > outer.x + outer.width + 0.5 ||
  inner.y + inner.height > outer.y + outer.height + 0.5;

// Text that spills out of its clipping ancestor, or past the copy itself.
function overflowing(root: SceneNode): string[] {
  const bad: string[] = [];
  if (!('findAll' in root)) return bad;
  const rootBox = root.absoluteBoundingBox;
  for (const t of root.findAll((n) => n.type === 'TEXT') as TextNode[]) {
    // absoluteRenderBounds is already clipped by the parent, which hides the
    // very overflow we look for: compare the layout box instead.
    const box = t.absoluteBoundingBox;
    if (!box || !rootBox) continue;
    let clip: BaseNode | null = t.parent;
    while (clip && clip !== root && !('clipsContent' in clip && (clip as FrameNode).clipsContent)) clip = clip.parent;
    const limit = clip && 'absoluteBoundingBox' in clip ? (clip as FrameNode).absoluteBoundingBox : rootBox;
    if (limit && outside(box, limit)) bad.push(`${t.name} (${t.id})`);
  }
  return bad;
}

async function mutateTexts(root: SceneNode, fn: (t: TextNode) => void) {
  if (!('findAll' in root)) return;
  for (const t of root.findAll((n) => n.type === 'TEXT') as TextNode[]) {
    await loadNodeFonts(t);
    fn(t);
  }
}

export async function stressTest(p: StressTestInput) {
  const source = await getSceneNode(p.id);
  const explore = figma.root.children.find((x) => x.name === (p.page ?? '🧪 Explore'));
  if (p.page && !explore) throw new Error(`Page "${p.page}" not found.`);
  const page = explore ?? figma.currentPage;
  if (page !== figma.currentPage) await page.loadAsync();

  const section = figma.createSection();
  section.name = `Stress / ${source.name}`;
  page.appendChild(section);
  const spot = freeSpot(page.children.filter((c) => c !== section));
  section.x = spot.x;
  section.y = spot.y;

  const cases: { case: string; id: string; overflow: string[] }[] = [];
  const all = [...p.cases.map((c) => ({ kind: c as string, modes: undefined as Record<string, string> | undefined })),
    ...(p.modes ? [{ kind: 'mode', modes: p.modes }] : [])];
  const pad = 80;
  let x = pad;
  let maxH = 0;
  const collections = p.modes ? await figma.variables.getLocalVariableCollectionsAsync() : [];

  for (const c of [{ kind: 'original', modes: undefined }, ...all]) {
    // Instances of the component under test, not detached copies.
    const copy = source.type === 'COMPONENT' ? source.createInstance() : source.clone();
    section.appendChild(copy);
    copy.name = `${source.name} / ${c.kind}`;
    copy.x = x;
    copy.y = pad;
    if (c.kind === 'long-text') await mutateTexts(copy, (t) => (t.characters = `${t.characters} ${t.characters}`.trim()));
    if (c.kind === 'empty-text') await mutateTexts(copy, (t) => (t.characters = ''));
    if (c.kind === 'large-text') {
      // ≈ iOS AX / Android 200% font scale on body sizes.
      await mutateTexts(copy, (t) => {
        if (typeof t.fontSize === 'number') t.fontSize = Math.round(t.fontSize * 1.5);
      });
    }
    if ((c.kind === 'narrow' || c.kind === 'wide') && 'resize' in copy) {
      const f = c.kind === 'narrow' ? 0.75 : 1.5;
      (copy as FrameNode).resize(Math.round(copy.width * f), copy.height);
    }
    if (c.modes && 'setExplicitVariableModeForCollection' in copy) {
      for (const [name, mode] of Object.entries(c.modes)) {
        const coll = collections.find((x) => x.name === name);
        const m = coll?.modes.find((x) => x.name === mode);
        if (!coll || !m) throw new Error(`Collection/mode "${name}: ${mode}" không tồn tại`);
        copy.setExplicitVariableModeForCollection(coll, m.modeId);
      }
    }
    cases.push({ case: c.kind, id: copy.id, overflow: overflowing(copy) });
    x += copy.width + 120;
    maxH = Math.max(maxH, copy.height);
  }
  section.resizeWithoutConstraints(x - 120 + pad, maxH + 2 * pad);

  return {
    sectionId: section.id,
    page: page.name,
    cases,
    hint: 'Chụp screenshot sectionId để xem; overflow liệt kê text tràn khỏi vùng clip. Xoá section khi đã kiểm xong.',
  };
}
