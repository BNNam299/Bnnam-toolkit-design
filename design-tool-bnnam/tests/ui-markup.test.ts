import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const uiPath = join(__dirname, '..', 'ui.html');
const html = readFileSync(uiPath, 'utf8');

function countOf(needle: string): number {
  return html.split(needle).length - 1;
}

function portsBlock(): string {
  const match = html.match(/\/\* @ports-start \*\/[\s\S]*?\/\* @ports-end \*\//);
  if (!match) return '';
  return match[0];
}

describe('ui.html markup', () => {
  it('keeps exactly one ports marker block', () => {
    expect(countOf('/* @ports-start */')).toBe(1);
    expect(countOf('/* @ports-end */')).toBe(1);
    expect(portsBlock()).not.toBe('');
  });

  it('injects 21 contiguous ports from 3155 to 3175', () => {
    const array = portsBlock().match(/\[([^\]]*)\]/);
    expect(array).not.toBeNull();
    const ports = (array![1] ?? '')
      .split(',')
      .map((p) => Number(p.trim()))
      .filter((n) => Number.isFinite(n));
    expect(ports).toHaveLength(21);
    expect(ports[0]).toBe(3155);
    expect(ports[ports.length - 1]).toBe(3175);
    for (const [i, port] of ports.entries()) {
      expect(port).toBe(3155 + i);
    }
  });

  it('never hardcodes a single port in the WebSocket URL', () => {
    expect(html).not.toContain('ws://localhost:3155');
    expect(html).not.toContain('localhost:3156');
    expect(html).toContain('ws://localhost:');
  });

  it('exposes the ids the panel wires up', () => {
    for (const id of ['status', 'log', 'token', 'zoom', 'zoom-in', 'zoom-out', 'size', 'files']) {
      expect(html, `missing #${id}`).toContain(`id="${id}"`);
    }
  });

  it('announces connection state to assistive tech', () => {
    expect(html).toContain('aria-live');
    expect(html).toContain('role="status"');
  });

  it('uses the Figma theme variables and the token accent', () => {
    expect(html).toContain('--figma-color-');
    expect(html).toContain('#3DD6F5');
  });

  it('keeps the panel a single self-contained file', () => {
    expect(html).not.toMatch(/<script[^>]+type=["']module["']/);
    expect(html).not.toMatch(/<link[^>]+rel=["']stylesheet["']/);
    expect(html).not.toMatch(/<script[^>]+src=/);
  });

  it('never positions a block absolutely, so panels cannot overlap', () => {
    expect(html, 'ui.html must not use position: absolute').not.toMatch(/position:\s*absolute/);
    expect(html, 'ui.html must not use position: fixed').not.toMatch(/position:\s*fixed/);
  });

  it('opens the panel at a compact 300×300', () => {
    const main = readFileSync(join(__dirname, '..', 'src', 'plugin', 'main.ts'), 'utf8');
    expect(main).toMatch(/showUI\(__html__,\s*\{\s*width:\s*300,\s*height:\s*300/);
    expect(html).toMatch(/\{ label: 'M', width: 300, height: 300 \}/);
  });

  it('hides the optional blocks until they are needed', () => {
    for (const id of ['toolbar', 'footer', 'token-panel', 'menu']) {
      const tag = html.match(new RegExp(`id="${id}"[^>]*`));
      expect(tag, `missing #${id}`).not.toBeNull();
      expect(tag![0], `#${id} must start hidden`).toMatch(/hidden/);
    }
  });

  it('wires every id the script touches to an element that exists', () => {
    const ids = new Set<string>();
    for (const match of html.matchAll(/\$\('([a-z0-9-]+)'\)/g)) ids.add(match[1]);
    expect(ids.size, 'no $() calls found — the parser is broken').toBeGreaterThan(10);
    for (const id of ids) {
      expect(html, `the script uses $('#${id}') but no such element exists`).toContain(`id="${id}"`);
    }
  });

  it('keeps the panels mutually exclusive', () => {
    expect(html).toMatch(/const PANELS = \['token-panel', 'menu'\]/);
    expect(html).toMatch(/function closePanels\(\)/);
  });

  it('retries by itself when no server answers the first probe', () => {
    const connect = html.match(/async function connect\(\w*\)[\s\S]*?\n\}/);
    expect(connect, 'cannot find connect()').not.toBeNull();
    expect(connect![0]).toMatch(/scheduleRetry\(\)/);
    const afterLoop = connect![0].split('for (const port of order)')[1] ?? '';
    expect(afterLoop).toMatch(/scheduleRetry\(\)/);
    expect(html).toMatch(/function scheduleRetry\(\)/);
  });

  it('reconnects when the panel becomes visible again', () => {
    expect(html).toMatch(/visibilitychange/);
    expect(html).toMatch(/window\.addEventListener\('focus'/);
  });
});
