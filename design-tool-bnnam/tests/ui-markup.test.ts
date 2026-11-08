// Lightweight checks on ui.html — the panel is a single file that Figma reads
// straight from disk, so a broken marker or a hardcoded port silently breaks
// the plugin. No browser needed.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const uiPath = join(__dirname, '..', 'ui.html');
const html = readFileSync(uiPath, 'utf8');

function countOf(needle: string): number {
  return html.split(needle).length - 1;
}

/** The block between the two ports markers, e.g. the PORTS array literal. */
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

  it('injects 21 contiguous ports from 3055 to 3075', () => {
    const array = portsBlock().match(/\[([^\]]*)\]/);
    expect(array).not.toBeNull();
    const ports = (array![1] ?? '')
      .split(',')
      .map((p) => Number(p.trim()))
      .filter((n) => Number.isFinite(n));
    expect(ports).toHaveLength(21);
    expect(ports[0]).toBe(3055);
    expect(ports[ports.length - 1]).toBe(3075);
    for (const [i, port] of ports.entries()) {
      expect(port).toBe(3055 + i);
    }
  });

  it('never hardcodes a single port in the WebSocket URL', () => {
    expect(html).not.toContain('ws://localhost:3055');
    expect(html).not.toContain('localhost:3056');
    // The URL has to be built from the injected PORTS array.
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
    // No bundler: no module scripts, no external assets.
    expect(html).not.toMatch(/<script[^>]+type=["']module["']/);
    expect(html).not.toMatch(/<link[^>]+rel=["']stylesheet["']/);
    expect(html).not.toMatch(/<script[^>]+src=/);
  });

  it('never positions a block absolutely, so panels cannot overlap', () => {
    // Every panel (menu, token form, toast) sits in the normal flow: it
    // pushes the log down instead of floating over it.
    expect(html, 'ui.html must not use position: absolute').not.toMatch(/position:\s*absolute/);
    expect(html, 'ui.html must not use position: fixed').not.toMatch(/position:\s*fixed/);
  });

  it('opens the panel at a compact 300×300', () => {
    const main = readFileSync(join(__dirname, '..', 'src', 'plugin', 'main.ts'), 'utf8');
    expect(main).toMatch(/showUI\(__html__,\s*\{\s*width:\s*300,\s*height:\s*300/);
    // The default preset has to match the initial size.
    expect(html).toMatch(/\{ label: 'M', width: 300, height: 300 \}/);
  });

  it('hides the optional blocks until they are needed', () => {
    // The log toolbar, the dev footer, the token form and the menu are all
    // hidden by default and revealed by state.
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
    // Only one panel may be open at a time, otherwise two blocks would fight
    // for the same space in the 300x300 panel.
    expect(html).toMatch(/const PANELS = \['token-panel', 'menu'\]/);
    expect(html).toMatch(/function closePanels\(\)/);
  });

  it('retries by itself when no server answers the first probe', () => {
    // Regression guard: the first probe finding no server used to give up
    // for good, so the panel stayed dead until the user pressed "Kết nối".
    const connect = html.match(/async function connect\(\w*\)[\s\S]*?\n\}/);
    expect(connect, 'cannot find connect()').not.toBeNull();
    expect(connect![0]).toMatch(/scheduleRetry\(\)/);
    // The retry has to be armed from the failed-probe path, not only from
    // socket.onclose (which only runs after a successful connection).
    const afterLoop = connect![0].split('for (const port of order)')[1] ?? '';
    expect(afterLoop).toMatch(/scheduleRetry\(\)/);
    expect(html).toMatch(/function scheduleRetry\(\)/);
  });

  it('reconnects when the panel becomes visible again', () => {
    // Chromium throttles timers in a backgrounded panel.
    expect(html).toMatch(/visibilitychange/);
    expect(html).toMatch(/window\.addEventListener\('focus'/);
  });
});
