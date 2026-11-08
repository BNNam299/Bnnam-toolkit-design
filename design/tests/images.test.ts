import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { inlineImages, loadImageBase64 } from '../src/server/images';

const PNG = Buffer.from('89504e470d0a1a0a', 'hex');

describe('images', () => {
  it('reads data URIs and local files', async () => {
    expect(await loadImageBase64(`data:image/png;base64,${PNG.toString('base64')}`)).toBe(PNG.toString('base64'));
    const dir = mkdtempSync(join(tmpdir(), 'fa-'));
    const file = join(dir, 'a.png');
    writeFileSync(file, PNG);
    expect(await loadImageBase64(file)).toBe(PNG.toString('base64'));
  });

  it('rejects relative paths', async () => {
    await expect(loadImageBase64('a.png')).rejects.toThrow(/Unsupported image source/);
  });

  it('inlines image paints and image nodes, keeping hash references', async () => {
    const src = `data:image/png;base64,${PNG.toString('base64')}`;
    const out = await inlineImages({
      tree: {
        type: 'frame',
        fill: [{ image: src, scaleMode: 'FIT' }, '#fff'],
        children: [{ type: 'image', src, width: 10 }, { type: 'rect', fill: { image: 'hash:abc' } }],
      },
    });
    expect(out.tree.fill).toEqual([{ imageBase64: PNG.toString('base64'), scaleMode: 'FIT' }, '#fff']);
    expect(out.tree.children[0]).toEqual({ type: 'image', imageBase64: PNG.toString('base64'), width: 10 });
    expect(out.tree.children[1]).toEqual({ type: 'rect', fill: { image: 'hash:abc' } });
  });

  it('inlines images inside component set variants', async () => {
    const src = `data:image/png;base64,${PNG.toString('base64')}`;
    const out = await inlineImages({
      name: 'Card',
      variants: [
        { props: { State: 'Default' }, tree: { type: 'frame', fill: { image: src, scaleMode: 'FILL' }, children: [] } },
        { props: { State: 'Active' }, tree: { type: 'frame', fill: [{ image: src }, { gradient: 'LINEAR', angle: 90, stops: [] }], children: [{ type: 'image', src, width: 10 }] } },
      ],
    });
    expect(out.variants[0].tree.fill).toEqual({ imageBase64: PNG.toString('base64'), scaleMode: 'FILL' });
    expect(out.variants[1].tree.fill[0]).toEqual({ imageBase64: PNG.toString('base64') });
    expect(out.variants[1].tree.children[0]).toEqual({ type: 'image', imageBase64: PNG.toString('base64'), width: 10 });
  });
});
