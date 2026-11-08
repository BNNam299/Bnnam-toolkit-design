import { afterEach, describe, expect, it } from 'vitest';
import { createServer } from 'node:http';
import { WebSocket } from 'ws';
import { Bridge, PluginError } from '../src/server/bridge';
import type { ClientInfo } from '../src/shared/protocol';

const info: ClientInfo = {
  protocol: 1,
  fileKey: null,
  fileName: 'Test file',
  user: 'Tester',
  currentPage: { id: '0:1', name: 'Page 1' },
  version: '1.0.0 (test)',
};

let bridge: Bridge | null = null;
const sockets: WebSocket[] = [];

afterEach(async () => {
  for (const s of sockets.splice(0)) s.terminate();
  await bridge?.stop();
  bridge = null;
});

async function startBridge(opts: Partial<{ port: number; portRange: number; host: string; supportedCommands: () => string[] }> = {}) {
  bridge = new Bridge({ port: 0, host: '127.0.0.1', token: 'secret', ...opts });
  await bridge.start();
  return bridge;
}

// Fake plugin: answers requests with the given handler.
function fakePlugin(
  b: Bridge,
  handler: (cmd: string, params: unknown) => unknown,
  token = 'secret',
  fileName = info.fileName,
  extra: Partial<ClientInfo> = {},
): Promise<WebSocket> {
  const ws = new WebSocket(`ws://127.0.0.1:${b.port}/?token=${token}`);
  sockets.push(ws);
  ws.on('message', async (data) => {
    const msg = JSON.parse(String(data));
    // The bridge also pushes "notice" messages; they are not command replies.
    if (msg.type !== 'request') return;
    try {
      const result = await handler(msg.command, msg.params);
      ws.send(JSON.stringify({ type: 'response', id: msg.id, ok: true, result }));
    } catch (e) {
      ws.send(JSON.stringify({ type: 'response', id: msg.id, ok: false, error: (e as Error).message, safeToRetryWithoutCanvasRead: false }));
    }
  });
  return new Promise((resolve, reject) => {
    ws.on('open', () => {
      ws.send(JSON.stringify({ type: 'hello', info: { ...info, fileName, ...extra } }));
      setTimeout(() => resolve(ws), 30);
    });
    ws.on('error', reject);
  });
}

// Occupies a port so the bridge has to move to the next one.
function occupyPort(): Promise<{ port: number; close: () => Promise<void> }> {
  const server = createServer();
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = address && typeof address === 'object' ? address.port : 0;
      resolve({
        port,
        close: () => new Promise<void>((r) => server.close(() => r())),
      });
    });
  });
}

describe('Bridge', () => {
  it('rejects a wrong token', async () => {
    const b = await startBridge();
    const ws = new WebSocket(`ws://127.0.0.1:${b.port}/?token=nope`);
    sockets.push(ws);
    const code = await new Promise((r) => ws.on('close', (c) => r(c)));
    expect(code).toBe(4001);
  });

  it('errors clearly when no plugin is connected', async () => {
    const b = await startBridge();
    await expect(b.request('get_document_info', {})).rejects.toThrow(/No Figma file is connected/);
  });

  it('round-trips a request and reports connected files', async () => {
    const b = await startBridge();
    await fakePlugin(b, (cmd, params) => ({ cmd, params }));
    await expect(b.request('get_node', { ids: ['1:2'] })).resolves.toEqual({ cmd: 'get_node', params: { ids: ['1:2'] } });
    expect(b.status().files).toMatchObject([{ fileName: 'Test file', user: 'Tester', pluginVersion: '1.0.0 (test)' }]);
  });

  it('propagates plugin errors with the retry flag', async () => {
    const b = await startBridge();
    await fakePlugin(b, () => {
      throw new Error('boom');
    });
    const err = (await b.request('render_tree', {}).catch((e) => e)) as PluginError;
    expect(err).toBeInstanceOf(PluginError);
    expect(err.message).toBe('boom');
    expect(err.safeToRetryWithoutCanvasRead).toBe(false);
  });

  it('times out and rejects pending requests on disconnect', async () => {
    const b = await startBridge();
    const ws = await fakePlugin(b, () => new Promise(() => {}));
    await expect(b.request('x', {}, { timeoutMs: 50 })).rejects.toThrow(/Timed out/);
    const pending = b.request('y', {}, { timeoutMs: 5000 });
    ws.close();
    await expect(pending).rejects.toThrow(/disconnected/);
  });

  it('routes to a file by name when several are connected', async () => {
    const b = await startBridge();
    await fakePlugin(b, () => 'A', 'secret', 'File A', { fileKey: 'key-a' });
    await fakePlugin(b, () => 'B', 'secret', 'File B', { fileKey: 'key-b' });
    await expect(b.request('x', {}, { file: 'File A' })).resolves.toBe('A');
    await expect(b.request('x', {}, { file: 'File B' })).resolves.toBe('B');
    await expect(b.request('x', {}, { file: 'File C' })).rejects.toThrow(/not connected/);
  });

  it('falls back to the next port instead of dying on a busy one', async () => {
    const busy = await occupyPort();
    try {
      bridge = new Bridge({ port: busy.port, portRange: 3, host: '127.0.0.1', token: 'secret' });
      await bridge.start();
      expect(bridge.port).toBe(busy.port + 1);
      expect(bridge.status().port).toBe(busy.port + 1);
      expect(bridge.status().listening).toBe(true);
    } finally {
      await busy.close();
    }
  });

  it('reports the port range and its candidates', async () => {
    const b = await startBridge({ port: 3980, portRange: 3 });
    expect(b.status().portRange).toBe(3);
    expect(b.status().ports).toEqual([3980, 3981, 3982]);
  });

  it('reports an error (and stays up) when the whole range is busy', async () => {
    const first = await startBridge();
    const second = new Bridge({ port: first.port, portRange: 1, host: '127.0.0.1', token: 'secret' });
    await second.start();
    expect(second.status().listening).toBe(false);
    expect(second.listenError).toMatch(/lsof -i :/);
    await expect(second.request('x', {})).rejects.toThrow(/lsof -i :/);
  });

  it('refuses to guess when several files are connected', async () => {
    const b = await startBridge();
    await fakePlugin(b, () => 'A', 'secret', 'File A', { fileKey: 'key-a' });
    await fakePlugin(b, () => 'B', 'secret', 'File B', { fileKey: 'key-b' });
    await expect(b.request('x', {})).rejects.toThrow(/File A.*File B/);
  });

  it('uses the file pinned in the panel', async () => {
    const b = await startBridge();
    await fakePlugin(b, () => 'A', 'secret', 'File A', { fileKey: 'key-a' });
    await fakePlugin(b, () => 'B', 'secret', 'File B', { fileKey: 'key-b', preferredFileKey: 'key-b' });
    await expect(b.request('x', {})).resolves.toBe('B');
    expect(b.status().preferredFile).toBe('key-b');
  });

  it('reports a pinned draft (no fileKey) by name', async () => {
    const b = await startBridge();
    await fakePlugin(b, () => 'A', 'secret', 'Untitled');
    await fakePlugin(b, () => 'B', 'secret', 'file2', { preferredFileKey: 'file2' });
    await expect(b.request('x', {})).resolves.toBe('B');
    expect(b.status().preferredFile).toBe('file2');
  });

  it('tells an old plugin which commands it misses', async () => {
    const b = await startBridge({ supportedCommands: () => ['get_document_info', 'render_tree'] });
    await fakePlugin(b, () => 'ok', 'secret', 'Test file', { commands: ['get_document_info'] });
    const err = (await b.request('render_tree', {}).catch((e) => e)) as PluginError;
    expect(err).toBeInstanceOf(PluginError);
    expect(err.message).toMatch(/render_tree/);
    expect(err.message).toMatch(/bản cũ/);
    expect(err.safeToRetryWithoutCanvasRead).toBe(true);
  });

  it('sends the command to a plugin that does not report its commands', async () => {
    const b = await startBridge({ supportedCommands: () => ['get_document_info', 'render_tree'] });
    await fakePlugin(b, () => 'ok');
    await expect(b.request('render_tree', {})).resolves.toBe('ok');
  });
});
