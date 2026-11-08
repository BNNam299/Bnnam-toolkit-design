import { afterEach, describe, expect, it } from 'vitest';
import { createServer } from 'node:http';
import { WebSocket, WebSocketServer } from 'ws';
import { Bridge, PluginError } from '../src/server/bridge';
import type { ClientInfo } from '../src/shared/protocol';

const info: ClientInfo = {
  protocol: 3,
  fileKey: 'key-a',
  fileName: 'File A',
  user: 'Tester',
  currentPage: { id: '0:1', name: 'Page 1' },
  version: '1.0.0 (test)',
};

const bridges: Bridge[] = [];
const sockets: WebSocket[] = [];
const closers: (() => Promise<void>)[] = [];

afterEach(async () => {
  for (const s of sockets.splice(0)) s.terminate();
  await Promise.all(bridges.splice(0).map((b) => b.stop()));
  await Promise.all(closers.splice(0).map((c) => c()));
});

// A port nothing listens on right now (bind 0, read it, release it).
function freePort(): Promise<number> {
  const server = createServer();
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = address && typeof address === 'object' ? address.port : 0;
      server.close(() => resolve(port));
    });
  });
}

async function startHubBridge(port: number, extra: Partial<ConstructorParameters<typeof Bridge>[0]> = {}) {
  const b = new Bridge({ port, host: '127.0.0.1', token: 'secret', hub: true, build: 'test', joinTimeoutMs: 300, ...extra });
  bridges.push(b);
  await b.start();
  return b;
}

function fakePlugin(port: number, handler: (cmd: string, params: unknown) => unknown, extra: Partial<ClientInfo> = {}) {
  const ws = new WebSocket(`ws://127.0.0.1:${port}/?token=secret`);
  sockets.push(ws);
  ws.on('message', async (data) => {
    const msg = JSON.parse(String(data));
    if (msg.type !== 'request') return;
    try {
      ws.send(JSON.stringify({ type: 'response', id: msg.id, ok: true, result: await handler(msg.command, msg.params) }));
    } catch (e) {
      ws.send(JSON.stringify({ type: 'response', id: msg.id, ok: false, error: (e as Error).message, safeToRetryWithoutCanvasRead: false }));
    }
  });
  return new Promise<WebSocket>((resolve, reject) => {
    ws.on('open', () => {
      ws.send(JSON.stringify({ type: 'hello', info: { ...info, ...extra } }));
      setTimeout(() => resolve(ws), 50);
    });
    ws.on('error', reject);
  });
}

async function until(check: () => boolean, ms = 3000) {
  const end = Date.now() + ms;
  while (!check()) {
    if (Date.now() > end) throw new Error('condition not met in time');
    await new Promise((r) => setTimeout(r, 20));
  }
}

describe('Hub', () => {
  it('opens one port: the first server hosts, the next ones join', async () => {
    const port = await freePort();
    const a = await startHubBridge(port);
    const b = await startHubBridge(port);
    const c = await startHubBridge(port);
    expect([a.role, b.role, c.role]).toEqual(['hub', 'agent', 'agent']);
    expect(b.status().listening).toBe(false);
    expect(b.status().port).toBe(port);
    await until(() => a.status().agents === 2);
  });

  it('relays every agent command to the one plugin, results back to the sender', async () => {
    const port = await freePort();
    const hub = await startHubBridge(port);
    const agent1 = await startHubBridge(port);
    const agent2 = await startHubBridge(port);
    await fakePlugin(port, (cmd, params) => ({ cmd, params }));
    const results = await Promise.all([
      hub.request('get_node', { from: 'hub' }),
      agent1.request('get_node', { from: 'agent1' }),
      agent2.request('render_tree', { from: 'agent2' }),
    ]);
    expect(results).toEqual([
      { cmd: 'get_node', params: { from: 'hub' } },
      { cmd: 'get_node', params: { from: 'agent1' } },
      { cmd: 'render_tree', params: { from: 'agent2' } },
    ]);
  });

  it('keeps agents out of the file list and mirrors the hub status to them', async () => {
    const port = await freePort();
    const hub = await startHubBridge(port);
    const agent = await startHubBridge(port);
    await fakePlugin(port, () => 'ok', { commands: ['get_node'], preferredFileKey: 'key-a' });
    expect(hub.status().files).toHaveLength(1);
    await until(() => agent.status().files.length === 1);
    expect(agent.status()).toMatchObject({
      role: 'agent',
      preferredFile: 'key-a',
      hub: { pid: process.pid, build: 'test' },
      files: [{ fileName: 'File A', fileKey: 'key-a', pluginVersion: '1.0.0 (test)' }],
    });
    // The agent works out missing commands from what the hub reports.
    expect(agent.missingCommands(['get_node', 'render_tree'])).toEqual(['render_tree']);
  });

  it('passes plugin errors and the retry flag through the hub', async () => {
    const port = await freePort();
    await startHubBridge(port);
    const agent = await startHubBridge(port);
    await fakePlugin(port, () => {
      throw new Error('boom');
    });
    const err = (await agent.request('render_tree', {}).catch((e) => e)) as PluginError;
    expect(err).toBeInstanceOf(PluginError);
    expect(err.message).toBe('boom');
    expect(err.safeToRetryWithoutCanvasRead).toBe(false);
    await expect(agent.request('x', {}, { file: 'Nope' })).rejects.toThrow(/not connected/);
  });

  it('elects a new hub when the hub exits, and the plugin can reconnect to it', async () => {
    const port = await freePort();
    const hub = await startHubBridge(port);
    const agent1 = await startHubBridge(port);
    const agent2 = await startHubBridge(port);
    await fakePlugin(port, () => new Promise(() => {}));
    const pending = agent1.request('render_tree', {}, { timeoutMs: 5000 });
    await new Promise((r) => setTimeout(r, 50));
    await hub.stop();
    const err = (await pending.catch((e) => e)) as PluginError;
    expect(err.message).toMatch(/Hub figma-agent/);
    expect(err.safeToRetryWithoutCanvasRead).toBe(false);

    await until(() => [agent1.role, agent2.role].sort().join() === 'agent,hub');
    const next = agent1.role === 'hub' ? agent1 : agent2;
    const other = next === agent1 ? agent2 : agent1;
    await fakePlugin(port, () => 'again');
    await expect(other.request('get_node', {})).resolves.toBe('again');
    await expect(next.request('get_node', {})).resolves.toBe('again');
  });

  it('reports a port held by something that is not a hub, without opening another port', async () => {
    const port = await freePort();
    // Accepts WebSockets but never welcomes, like a pre-hub figma-agent.
    const wss = new WebSocketServer({ port, host: '127.0.0.1' });
    closers.push(() => new Promise<void>((r) => wss.close(() => r())));
    const b = await startHubBridge(port);
    expect(b.role).toBe('none');
    expect(b.status()).toMatchObject({ listening: false, port, ports: [port] });
    expect(b.listenError).toMatch(/bản cũ/);
    await expect(b.request('x', {})).rejects.toThrow(/bản cũ/);
  });

  it('refuses an agent with the wrong token', async () => {
    const port = await freePort();
    await startHubBridge(port);
    const b = new Bridge({ port, host: '127.0.0.1', token: 'other', hub: true, joinTimeoutMs: 300 });
    bridges.push(b);
    await b.start();
    expect(b.role).toBe('none');
    expect(b.listenError).toMatch(/token/);
  });
});
