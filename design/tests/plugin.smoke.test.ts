// Loads the built code.js in a VM with a minimal fake `figma` global to check
// the bundle evaluates and the dispatcher answers requests. Real rendering is
// verified manually in Figma (see TESTING.md).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';

interface Posted {
  type: string;
  id?: string;
  ok?: boolean;
  result?: Record<string, unknown>;
  error?: string;
  safeToRetryWithoutCanvasRead?: boolean;
  requestId?: string;
  command?: string;
  state?: string;
  notice?: string;
  files?: Array<{ fileName: string; fileKey: string | null; currentPage: string }>;
  width?: number;
  height?: number;
  message?: string;
}

function loadPlugin() {
  const posted: Posted[] = [];
  let onmessage: (msg: unknown) => void = () => {};
  const page = { id: '0:1', name: 'Page 1', type: 'PAGE', children: [], selection: [] };
  const figma = {
    mixed: Symbol('mixed'),
    fileKey: undefined,
    root: { name: 'Smoke file', children: [page] },
    currentPage: page,
    currentUser: { name: 'Tester' },
    showUI: () => {},
    commitUndo: () => {},
    on: () => {},
    clientStorage: { getAsync: async () => ({ token: 't' }), setAsync: async () => {} },
    ui: {
      set onmessage(fn: (msg: unknown) => void) {
        onmessage = fn;
      },
      postMessage: (m: Posted) => posted.push(m),
      resize: () => {},
    },
    getNodeByIdAsync: async () => null,
  };
  const code = readFileSync(join(__dirname, '..', 'code.js'), 'utf8');
  vm.runInNewContext(code, { figma, __html__: '<html></html>', console, setTimeout, Promise });
  const send = async (msg: object) => {
    onmessage(msg);
    await new Promise((r) => setTimeout(r, 20));
  };
  return { posted, send };
}

describe('plugin bundle', () => {
  it('sends init with client info and stored settings', async () => {
    const { posted, send } = loadPlugin();
    await send({ type: 'ready' });
    expect(posted[0]).toMatchObject({
      type: 'init',
      info: { fileName: 'Smoke file', user: 'Tester', currentPage: { name: 'Page 1' } },
      settings: { token: 't' },
    });
  });

  it('answers read commands and reports unknown ones', async () => {
    const { posted, send } = loadPlugin();
    await send({ type: 'request', id: 'a', command: 'get_document_info', params: {} });
    await send({ type: 'request', id: 'b', command: 'nope', params: {} });
    expect(posted.find((m) => m.id === 'a')).toMatchObject({ ok: true, result: { fileName: 'Smoke file', pages: [{ name: 'Page 1' }] } });
    expect(posted.find((m) => m.id === 'b')).toMatchObject({ ok: false, safeToRetryWithoutCanvasRead: true });
  });

  it('runs execute_code with figma and helpers in scope', async () => {
    const { posted, send } = loadPlugin();
    const code = 'const p = figma.currentPage; await null; return { page: p.name, rgb: h.rgb("#FF0000"), mixed: figma.mixed };';
    await send({ type: 'request', id: 'c', command: 'execute_code', params: { code } });
    expect(posted.find((m) => m.id === 'c')).toMatchObject({
      ok: true,
      result: { result: { page: 'Page 1', rgb: { r: 1, g: 0, b: 0 }, mixed: 'MIXED' } },
    });
  });

  it('reports execute_code failures as not safe to retry', async () => {
    const { posted, send } = loadPlugin();
    await send({ type: 'request', id: 'd', command: 'execute_code', params: { code: 'throw new Error("bad")' } });
    await send({ type: 'request', id: 'e', command: 'execute_code', params: { code: 'return (' } });
    expect(posted.find((m) => m.id === 'd')).toMatchObject({ ok: false, error: 'bad', safeToRetryWithoutCanvasRead: false });
    expect(posted.find((m) => m.id === 'e')?.error).toMatch(/Syntax error/);
  });

  it('dispatches every figma-ui-flow command (none is "Unknown command")', async () => {
    const { posted, send } = loadPlugin();
    const commands = [
      'search_design_system', 'create_styles', 'import_tokens', 'export_tokens', 'render_foundations',
      'create_component_set', 'stress_test', 'set_interactions', 'bind_variables', 'rename_by_rule',
      'annotate', 'set_dev_status', 'export_assets', 'audit_design', 'manage_pages', 'create_variables',
    ];
    for (const [i, command] of commands.entries()) await send({ type: 'request', id: `m${i}`, command, params: {} });
    for (const [i, command] of commands.entries()) {
      const res = posted.find((m) => m.id === `m${i}`);
      expect(res, command).toBeDefined();
      expect(res?.error ?? '', command).not.toMatch(/Unknown command/);
    }
  });

  it('advertises the supported commands in client info', async () => {
    const { posted, send } = loadPlugin();
    await send({ type: 'ready' });
    const info = (posted[0] as { info?: { commands?: string[]; preferredFileKey?: string | null } }).info;
    expect(Array.isArray(info?.commands)).toBe(true);
    expect(info?.commands).toContain('render_tree');
    expect(info?.commands).toContain('get_document_info');
    expect(info?.preferredFileKey).toBeNull();
  });

  it('reports activity while a command runs and when it finishes', async () => {
    const { posted, send } = loadPlugin();
    await send({ type: 'request', id: 'act', command: 'get_document_info', params: {} });
    const activity = posted.filter((m) => m.type === 'activity');
    expect(activity.length).toBeGreaterThanOrEqual(2);
    expect(activity[0]).toMatchObject({ requestId: 'act', command: 'get_document_info', state: 'running' });
    expect(activity[activity.length - 1]).toMatchObject({ requestId: 'act', state: 'done' });
  });

  it('relays a server notice to the panel', async () => {
    const { posted, send } = loadPlugin();
    await send({
      type: 'notice',
      notice: 'files',
      files: [{ fileName: 'Untitled', fileKey: 'k1', currentPage: 'Screens' }],
    });
    expect(posted.find((m) => m.type === 'notice')).toMatchObject({
      notice: 'files',
      files: [{ fileName: 'Untitled', fileKey: 'k1' }],
    });
  });

  it('confirms a resize and reports a rejected one', async () => {
    const { posted, send } = loadPlugin();
    await send({ type: 'resize', width: 520, height: 760 });
    expect(posted.find((m) => m.type === 'resize-ok')).toMatchObject({ width: 520, height: 760 });
  });
});

