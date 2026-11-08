// WebSocket server the plugin UI connects to. Tracks one connection per open
// Figma file and correlates requests with responses by id.
//
// Hub mode (the default for the MCP server): only the first server on the
// machine binds the port and becomes the hub. Every other server joins the hub
// as an agent and sends its commands through it, so one plugin connection
// serves every agent and no extra ports are opened. When the hub exits, the
// agents elect a new one: whoever binds the port first.
import { randomUUID } from 'node:crypto';
import { createServer, type IncomingMessage, type Server } from 'node:http';
import { WebSocket, WebSocketServer } from 'ws';
import {
  DEFAULT_PORT_RANGE,
  HUB_PROTOCOL,
  PROTOCOL_VERSION,
  type AgentToHub,
  type ClientInfo,
  type FileSummary,
  type HubState,
  type HubToAgent,
  type NoticeMessage,
  type PluginToServer,
  type RequestMessage,
} from '../shared/protocol';

export class PluginError extends Error {
  constructor(
    message: string,
    readonly safeToRetryWithoutCanvasRead: boolean,
  ) {
    super(message);
  }
}

interface Client {
  id: string;
  ws: WebSocket;
  info: ClientInfo | null;
  connectedAt: number;
  lastSeen: number;
}

interface Pending {
  resolve(v: unknown): void;
  reject(e: Error): void;
  timer: NodeJS.Timeout;
  client: Client;
}

export interface BridgeOptions {
  port: number;
  host?: string;
  token: string;
  log?: (msg: string) => void;
  /** How many consecutive ports to try when the first ones are busy. */
  portRange?: number;
  /** Commands this server can send to the plugin (used in the "old plugin" error). */
  supportedCommands?: () => string[];
  /**
   * Share one port between every server on the machine: the first one hosts,
   * the others join it as agents. Without it each server takes the next free
   * port in the range (the pre-hub behaviour).
   */
  hub?: boolean;
  /** Build stamp reported to agents and shown in their status. */
  build?: string;
  /** Called whenever this process starts listening (also after a failover). */
  onListening?: (port: number) => void;
  /** How long a joining agent waits for the hub's welcome. */
  joinTimeoutMs?: number;
}

export type BridgeRole = 'hub' | 'agent' | 'none';

interface UpstreamPending {
  resolve(v: unknown): void;
  reject(e: Error): void;
  timer: NodeJS.Timeout;
}

type JoinResult = 'ok' | 'auth' | 'no-hub' | 'refused';

export class Bridge {
  private wss: WebSocketServer | null = null;
  private clients = new Map<string, Client>();
  private pending = new Map<string, Pending>();
  private heartbeat: NodeJS.Timeout | null = null;
  private servers: Server[] = [];
  private actualPort: number | null = null;
  listenError: string | null = null;

  // Hub side: agents that joined (welcomed = sent a valid agent-hello).
  private agents = new Map<WebSocket, { welcomed: boolean }>();
  private stateSignature = '';

  // Agent side: the connection to the hub and what the hub last reported.
  private upstream: WebSocket | null = null;
  private hubState: HubState | null = null;
  private upstreamPending = new Map<string, UpstreamPending>();
  private electTimer: NodeJS.Timeout | null = null;
  private stopped = false;
  role: BridgeRole = 'none';

  constructor(private opts: BridgeOptions) {}

  private get log(): (msg: string) => void {
    return this.opts.log ?? (() => {});
  }

  // Ports this bridge may use. A hub only ever uses its one port (that is the
  // point); without a hub, the requested one and the next ones, so a second
  // MCP client on the same machine can take the next free port.
  private candidates(): number[] {
    if (this.opts.hub) return [this.opts.port];
    const range = Math.max(1, this.opts.portRange ?? DEFAULT_PORT_RANGE);
    // port 0 means "any free port" (tests): bind exactly that, never fall back.
    if (this.opts.port === 0) return [0];
    return Array.from({ length: range }, (_, i) => this.opts.port + i);
  }

  async start(): Promise<void> {
    if (this.opts.hub) {
      await this.elect();
      return;
    }
    if (await this.listen()) this.role = 'hub';
  }

  // Hub election: bind the port, or join whoever holds it. Runs at start and
  // again whenever the hub this agent was using goes away.
  private async elect(): Promise<void> {
    if (this.stopped) return;
    this.clearElect();
    const port = this.opts.port;
    if (await this.listen()) {
      this.role = 'hub';
      return;
    }
    if (this.stopped) return;
    const joined = await this.join();
    if (this.stopped) {
      this.upstream?.terminate();
      return;
    }
    if (joined === 'ok') {
      this.role = 'agent';
      this.listenError = null;
      this.log(`joined the figma-agent hub on ws://localhost:${port} (pid ${this.hubState?.pid ?? '?'})`);
      return;
    }
    this.role = 'none';
    if (joined === 'refused') {
      // The hub was closing while we tried: bind again shortly.
      this.listenError = `Đang chờ hub figma-agent ở cổng ${port}…`;
      this.scheduleElect(200 + Math.random() * 300);
      return;
    }
    this.listenError =
      joined === 'auth'
        ? `Hub figma-agent ở cổng ${port} từ chối token: token của server này khác ~/.figma-agent/token (kiểm tra FIGMA_AGENT_TOKEN).`
        : `Cổng ${port} đang bị chiếm bởi figma-agent bản cũ (chưa có hub) hoặc tiến trình khác. ` +
          `Khởi động lại agent đang giữ cổng để nó chạy bản mới. Kiểm tra: lsof -i :${port}`;
    this.log(this.listenError);
    this.scheduleElect(3000);
  }

  private scheduleElect(ms: number) {
    if (this.stopped) return;
    this.clearElect();
    this.electTimer = setTimeout(() => void this.elect(), ms);
    this.electTimer.unref();
  }

  private clearElect() {
    if (this.electTimer) clearTimeout(this.electTimer);
    this.electTimer = null;
  }

  // Listens on loopback only. The plugin connects to "localhost", which may
  // resolve to either IPv4 or IPv6, so both loopback addresses are bound.
  private async listen(): Promise<boolean> {
    const log = this.log;
    const wss = new WebSocketServer({ noServer: true });
    wss.on('connection', (ws, req) => this.onConnection(ws, req));
    const hosts = this.opts.host ? [this.opts.host] : ['127.0.0.1', '::1'];
    const candidates = this.candidates();
    const tried: number[] = [];

    for (const port of candidates) {
      const servers: Server[] = [];
      let unusable = false;
      for (let i = 0; i < hosts.length; i++) {
        const host = hosts[i];
        const http = createServer((_req, res) => {
          res.writeHead(426).end('figma-agent bridge: WebSocket only');
        });
        http.on('upgrade', (req, socket, head) => wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req)));
        const err = await new Promise<NodeJS.ErrnoException | null>((resolve) => {
          http.once('error', resolve);
          http.listen(port, host, () => resolve(null));
        });
        if (!err) {
          servers.push(http);
          continue;
        }
        if (i === 0) {
          // The primary host failed → this port cannot be used, try the next one.
          unusable = true;
          tried.push(port);
          log(
            this.opts.hub
              ? `port ${port} busy on ${host} (${err.message}) — joining the hub there`
              : `port ${port} unusable on ${host} (${err.message}) — trying the next port`,
          );
          break;
        }
        // A secondary host failing is fine: no IPv6 loopback on this machine,
        // or the IPv6 port is taken while IPv4 works. One of the two is enough.
        log(`warning: ${host}:${port} unavailable (${err.message}) — continuing on ${hosts[0]}`);
      }
      if (unusable || servers.length === 0) continue;
      this.servers = servers;
      this.actualPort = port === 0 ? this.boundPort(servers) : port;
      break;
    }

    if (this.servers.length === 0) {
      // A hub that cannot bind joins the one that did; elect() reports that.
      if (this.opts.hub) return false;
      const first = candidates[0];
      const last = candidates[candidates.length - 1];
      this.listenError =
        `Không tìm được port trống trong ${first}-${last} (đã thử: ${tried.join(', ') || '—'}). ` +
        `Có tiến trình khác đang chiếm port (MCP client khác, figma-agent cũ). ` +
        `Đóng chúng rồi khởi động lại server, hoặc đặt FIGMA_AGENT_PORT. Kiểm tra: lsof -i :${first}-${last}`;
      for (const h of this.servers) h.close();
      this.servers = [];
      log(this.listenError);
      return false;
    }
    this.wss = wss;
    this.listenError = null;
    log(
      this.opts.hub
        ? `hosting the figma-agent hub on ws://localhost:${this.port}`
        : `listening on ws://localhost:${this.port} (candidates ${candidates[0]}-${candidates[candidates.length - 1]})`,
    );
    this.heartbeat = setInterval(() => {
      for (const c of this.clients.values()) {
        if (c.ws.readyState === WebSocket.OPEN) c.ws.ping();
      }
      for (const ws of this.agents.keys()) {
        if (ws.readyState === WebSocket.OPEN) ws.ping();
      }
    }, 20000);
    this.heartbeat.unref();
    this.opts.onListening?.(this.port);
    return true;
  }

  // Joins the hub holding the port. The hub must answer the hello with a
  // welcome; anything else (an old figma-agent, another program) is not a hub.
  private join(): Promise<JoinResult> {
    const host = this.opts.host ?? '127.0.0.1';
    const url = `ws://${host.includes(':') ? `[${host}]` : host}:${this.opts.port}/?token=${encodeURIComponent(this.opts.token)}&role=agent`;
    return new Promise((resolve) => {
      const ws = new WebSocket(url);
      let settled = false;
      const finish = (result: JoinResult) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (result !== 'ok') {
          ws.removeAllListeners();
          ws.on('error', () => {});
          ws.terminate();
        }
        resolve(result);
      };
      const timer = setTimeout(() => finish('no-hub'), this.opts.joinTimeoutMs ?? 1500);
      ws.on('open', () => {
        const hello: AgentToHub = {
          type: 'agent-hello',
          protocol: PROTOCOL_VERSION,
          build: this.opts.build ?? 'unknown',
          pid: process.pid,
        };
        ws.send(JSON.stringify(hello));
      });
      ws.on('message', (data) => {
        let msg: HubToAgent;
        try {
          msg = JSON.parse(String(data));
        } catch {
          return;
        }
        if (!settled) {
          if (msg.type !== 'welcome' || !(msg.protocol >= HUB_PROTOCOL)) return;
          this.upstream = ws;
          this.hubState = msg.state;
          ws.on('close', () => this.onUpstreamClose(ws));
          finish('ok');
          return;
        }
        this.onHubMessage(msg);
      });
      ws.on('close', (code) => finish(code === 4001 ? 'auth' : 'refused'));
      ws.on('error', () => finish('refused'));
    });
  }

  private onHubMessage(msg: HubToAgent) {
    if (msg.type === 'hub-state' || msg.type === 'welcome') {
      this.hubState = msg.state;
      return;
    }
    if (msg.type !== 'agent-response') return;
    const p = this.upstreamPending.get(msg.id);
    if (!p) return;
    clearTimeout(p.timer);
    this.upstreamPending.delete(msg.id);
    if (msg.ok) p.resolve(msg.result);
    else p.reject(new PluginError(msg.error, msg.safeToRetryWithoutCanvasRead));
  }

  private onUpstreamClose(ws: WebSocket) {
    if (this.upstream !== ws) return;
    this.upstream = null;
    this.hubState = null;
    this.role = 'none';
    this.rejectUpstream(
      'Hub figma-agent (server của agent đang giữ cổng) đã thoát trước khi trả lời. ' +
        'Lệnh có thể đã chạy một phần: đọc lại canvas trước khi thử lại.',
    );
    if (this.stopped) return;
    this.listenError = `Hub figma-agent đã thoát, đang bầu hub mới ở cổng ${this.opts.port}…`;
    this.log('the hub went away — electing a new one');
    // Jitter so the agents do not all race for the port at the same instant.
    this.scheduleElect(50 + Math.random() * 250);
  }

  private rejectUpstream(message: string) {
    for (const [id, p] of this.upstreamPending) {
      clearTimeout(p.timer);
      this.upstreamPending.delete(id);
      p.reject(new PluginError(message, false));
    }
  }

  private boundPort(servers: Server[]): number {
    const addr = servers[0]?.address();
    return addr && typeof addr === 'object' ? addr.port : this.opts.port;
  }

  async stop(): Promise<void> {
    this.stopped = true;
    this.clearElect();
    if (this.heartbeat) clearInterval(this.heartbeat);
    this.rejectUpstream('figma-agent server is shutting down.');
    this.upstream?.terminate();
    this.upstream = null;
    for (const ws of this.agents.keys()) ws.terminate();
    this.agents.clear();
    for (const c of this.clients.values()) c.ws.terminate();
    this.wss?.close();
    await Promise.all(this.servers.map((h) => new Promise<void>((r) => h.close(() => r()))));
    this.servers = [];
  }

  private onConnection(ws: WebSocket, req: IncomingMessage) {
    const url = new URL(req.url ?? '/', 'http://localhost');
    if (url.searchParams.get('token') !== this.opts.token) {
      ws.close(4001, 'invalid token');
      return;
    }
    if (url.searchParams.get('role') === 'agent') {
      this.onAgent(ws);
      return;
    }
    const client: Client = { id: randomUUID(), ws, info: null, connectedAt: Date.now(), lastSeen: Date.now() };
    this.clients.set(client.id, client);
    this.opts.log?.(`plugin connected (${client.id.slice(0, 8)})`);
    this.broadcastFiles();

    ws.on('pong', () => (client.lastSeen = Date.now()));
    ws.on('message', (data) => {
      client.lastSeen = Date.now();
      let msg: PluginToServer;
      try {
        msg = JSON.parse(String(data));
      } catch {
        return;
      }
      if (msg.type === 'hello' || msg.type === 'event') {
        // Merge, don't replace: an event must not drop the capability list or
        // the pinned file the plugin reported in its hello.
        client.info = { ...client.info, ...msg.info };
        this.broadcastFiles();
      } else if (msg.type === 'response') this.onResponse(msg);
    });
    ws.on('close', () => {
      this.clients.delete(client.id);
      this.opts.log?.(`plugin disconnected (${client.info?.fileName ?? client.id.slice(0, 8)})`);
      for (const [id, p] of this.pending) {
        if (p.client === client) {
          clearTimeout(p.timer);
          this.pending.delete(id);
          p.reject(new PluginError('The Figma plugin disconnected before answering.', false));
        }
      }
      this.broadcastFiles();
    });
  }

  // Hub side: another MCP server joined. It never counts as a Figma file; its
  // requests run through this hub's own request(), so file picking, pinning
  // and the old-plugin check behave the same for every agent.
  private onAgent(ws: WebSocket) {
    const agent = { welcomed: false };
    this.agents.set(ws, agent);
    ws.on('message', (data) => {
      let msg: AgentToHub;
      try {
        msg = JSON.parse(String(data));
      } catch {
        return;
      }
      if (msg.type === 'agent-hello') {
        agent.welcomed = true;
        this.log(`agent joined (pid ${msg.pid}, build ${msg.build})`);
        const welcome: HubToAgent = { type: 'welcome', protocol: PROTOCOL_VERSION, state: this.hubStateNow() };
        ws.send(JSON.stringify(welcome));
        this.pushState();
      } else if (msg.type === 'agent-request' && agent.welcomed) {
        const reply = (body: HubToAgent) => {
          if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(body));
        };
        this.request(msg.command, msg.params, { file: msg.file, timeoutMs: msg.timeoutMs }).then(
          (result) => reply({ type: 'agent-response', id: msg.id, ok: true, result }),
          (e: unknown) =>
            reply({
              type: 'agent-response',
              id: msg.id,
              ok: false,
              error: e instanceof Error ? e.message : String(e),
              safeToRetryWithoutCanvasRead: e instanceof PluginError ? e.safeToRetryWithoutCanvasRead : true,
            }),
        );
      }
    });
    ws.on('close', () => {
      this.agents.delete(ws);
      if (agent.welcomed) this.log('agent left');
      this.pushState();
    });
  }

  private openClients(): Client[] {
    return [...this.clients.values()].filter((c) => c.ws.readyState === WebSocket.OPEN);
  }

  private hubStateNow(): HubState {
    return {
      pid: process.pid,
      build: this.opts.build ?? 'unknown',
      files: this.openClients().map((c) => ({
        fileName: c.info?.fileName ?? null,
        fileKey: c.info?.fileKey ?? null,
        user: c.info?.user ?? null,
        currentPage: c.info?.currentPage ?? null,
        pluginVersion: c.info?.version ?? null,
        connectedAt: new Date(c.connectedAt).toISOString(),
        commands: Array.isArray(c.info?.commands) ? c.info.commands : [],
      })),
      preferredFile: this.preferredFileKey(),
      agents: [...this.agents.values()].filter((a) => a.welcomed).length,
    };
  }

  // Tells every agent what the hub sees, only when it actually changed (a
  // selection event alone changes nothing here).
  private pushState() {
    if (this.agents.size === 0) {
      this.stateSignature = '';
      return;
    }
    const state = this.hubStateNow();
    const signature = JSON.stringify(state);
    if (signature === this.stateSignature) return;
    this.stateSignature = signature;
    const payload = JSON.stringify({ type: 'hub-state', state } satisfies HubToAgent);
    for (const [ws, a] of this.agents) {
      if (a.welcomed && ws.readyState === WebSocket.OPEN) ws.send(payload);
    }
  }

  // Tells every open plugin which files are connected (the panel file picker).
  // The list is sent only when it actually changes, so a selection event does
  // not flood every panel with the same list.
  private filesSignature = '';
  private broadcastFiles() {
    this.pushState();
    const files: FileSummary[] = [...this.clients.values()]
      .filter((c) => c.ws.readyState === WebSocket.OPEN)
      .map((c) => ({
        fileName: c.info?.fileName ?? 'Unknown file',
        fileKey: c.info?.fileKey ?? null,
        currentPage: c.info?.currentPage?.name ?? '',
      }));
    const signature = JSON.stringify(files);
    if (signature === this.filesSignature) return;
    this.filesSignature = signature;
    const msg: NoticeMessage = { type: 'notice', notice: 'files', files };
    const payload = JSON.stringify(msg);
    for (const c of this.clients.values()) {
      if (c.ws.readyState === WebSocket.OPEN) c.ws.send(payload);
    }
  }

  private onResponse(msg: Extract<PluginToServer, { type: 'response' }>) {
    const p = this.pending.get(msg.id);
    if (!p) return;
    clearTimeout(p.timer);
    this.pending.delete(msg.id);
    if (msg.ok) p.resolve(msg.result);
    else p.reject(new PluginError(msg.error, msg.safeToRetryWithoutCanvasRead));
  }

  // Actual port (differs from opts.port when it is 0, or when a busy port
  // pushed the bridge to the next one).
  get port(): number {
    const addr = this.servers[0]?.address();
    if (addr && typeof addr === 'object') return addr.port;
    return this.actualPort ?? this.opts.port;
  }

  // The file the user pinned in the panel (null when nothing is pinned).
  // Drafts have no fileKey and are pinned by name, so report the name then.
  private preferredFileKey(): string | null {
    const open = [...this.clients.values()].filter((c) => c.ws.readyState === WebSocket.OPEN);
    const pinned = open.find((c) => this.isPinned(c));
    return pinned?.info?.fileKey ?? pinned?.info?.fileName ?? null;
  }

  // A file is "pinned" when the panel named it. Untitled drafts have no
  // fileKey, so the panel pins them by name.
  private isPinned(c: Client): boolean {
    const info = c.info;
    const pin = info?.preferredFileKey;
    if (!info || pin == null) return false;
    if (info.fileKey != null) return pin === info.fileKey;
    return pin === info.fileName;
  }

  status() {
    const common = {
      role: this.role,
      error: this.listenError,
      port: this.port,
      portRange: this.opts.hub ? 1 : (this.opts.portRange ?? DEFAULT_PORT_RANGE),
      ports: this.candidates(),
    };
    if (this.role !== 'hub') {
      // An agent sees the files through the hub; without a hub, nothing.
      const state = this.hubState;
      return {
        listening: false,
        ...common,
        hub: state ? { pid: state.pid, build: state.build } : null,
        agents: state?.agents ?? 0,
        preferredFile: state?.preferredFile ?? null,
        files: (state?.files ?? []).map(({ commands: _commands, ...file }) => file),
      };
    }
    return {
      listening: !!this.wss,
      ...common,
      hub: { pid: process.pid, build: this.opts.build ?? 'unknown' },
      agents: [...this.agents.values()].filter((a) => a.welcomed).length,
      preferredFile: this.preferredFileKey(),
      files: [...this.clients.values()].map((c) => ({
        fileName: c.info?.fileName ?? null,
        fileKey: c.info?.fileKey ?? null,
        user: c.info?.user ?? null,
        currentPage: c.info?.currentPage ?? null,
        pluginVersion: c.info?.version ?? null,
        connectedAt: new Date(c.connectedAt).toISOString(),
      })),
    };
  }

  // Commands this server can send that the connected plugin does not support.
  // Plugins that do not report their command list (protocol v1) are ignored:
  // we cannot tell what they miss, so we do not guess.
  // An agent checks against the commands the hub reports, so an agent built
  // from a newer commit than the hub still names the right missing commands.
  missingCommands(supported: string[]): string[] {
    const lists =
      this.role === 'hub'
        ? this.openClients().map((c) => (Array.isArray(c.info?.commands) ? c.info.commands : []))
        : (this.hubState?.files ?? []).map((f) => f.commands);
    const reporting = lists.filter((l) => l.length > 0);
    if (reporting.length === 0) return [];
    const missing = new Set<string>();
    for (const list of reporting) {
      const known = new Set(list);
      for (const s of supported) if (!known.has(s)) missing.add(s);
    }
    return [...missing];
  }

  // Picks the file to talk to: by fileKey/name when given, otherwise the
  // file pinned in the panel, otherwise the only open connection.
  private pick(file?: string): Client {
    if (!this.wss) throw new PluginError(this.listenError ?? 'Bridge is not listening.', true);
    const open = [...this.clients.values()].filter((c) => c.ws.readyState === WebSocket.OPEN);
    if (open.length === 0) {
      throw new PluginError(
        'No Figma file is connected. Open the "figma-agent-UI" plugin in Figma (Plugins → Development) and enter the token.',
        true,
      );
    }
    if (file) {
      // fileKey first, then the name (two files may share a name).
      const hit = open.find((c) => c.info?.fileKey === file) ?? open.find((c) => c.info?.fileName === file);
      if (!hit) {
        const names = open.map((c) => c.info?.fileName).join(', ');
        throw new PluginError(`File "${file}" is not connected. Connected: ${names}.`, true);
      }
      return hit;
    }
    // The file pinned in the panel wins.
    const pinned = open.filter((c) => this.isPinned(c));
    if (pinned.length === 1) return pinned[0];
    if (open.length === 1) return open[0];
    // Several files and no preference: never guess, ask for the file.
    const names = open.map((c) => c.info?.fileName ?? '(unknown)').join(', ');
    throw new PluginError(
      `Nhiều file Figma đang mở (${names}). Chọn file bằng tham số "file", hoặc ghim file trong panel plugin.`,
      true,
    );
  }

  request<T = unknown>(command: string, params: unknown, opts: { file?: string; timeoutMs?: number } = {}): Promise<T> {
    if (this.role === 'agent') return this.requestViaHub<T>(command, params, opts);
    if (this.opts.hub && this.role === 'none') {
      return Promise.reject(new PluginError(this.listenError ?? 'Đang kết nối hub figma-agent…', true));
    }
    let client: Client;
    try {
      client = this.pick(opts.file);
    } catch (e) {
      return Promise.reject(e);
    }
    // Protocol v2: the plugin tells us which commands it supports. A plugin
    // that reports a list but not this command is an old build.
    const commands = client.info?.commands;
    if (Array.isArray(commands) && commands.length > 0 && !commands.includes(command)) {
      const supported = this.opts.supportedCommands?.() ?? [];
      const missing = [...new Set([command, ...supported.filter((c) => !commands.includes(c))])];
      return Promise.reject(
        new PluginError(
          `Plugin đang mở là bản cũ, chưa hỗ trợ lệnh '${command}'. Thiếu: ${missing.join(', ')}. ` +
            `Đóng và mở lại plugin trong Figma (Plugins → Development → figma-agent-UI) sau khi chạy npm run build.`,
          true,
        ),
      );
    }
    const id = randomUUID();
    const timeoutMs = opts.timeoutMs ?? 30000;
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(
          new PluginError(
            `Timed out after ${timeoutMs} ms waiting for Figma. The command may still be running; read the canvas before retrying.`,
            false,
          ),
        );
      }, timeoutMs);
      this.pending.set(id, { resolve: resolve as (v: unknown) => void, reject, timer, client });
      const msg: RequestMessage = { type: 'request', id, command, params };
      client.ws.send(JSON.stringify(msg));
    });
  }

  // Agent side: the hub runs the command and answers with the same result or
  // error (retry flag included). The local timer only covers a hub that hangs:
  // the hub's own timeout, with its message, normally fires first.
  private requestViaHub<T>(command: string, params: unknown, opts: { file?: string; timeoutMs?: number }): Promise<T> {
    const ws = this.upstream;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return Promise.reject(new PluginError(this.listenError ?? 'Mất kết nối tới hub figma-agent.', true));
    }
    const id = randomUUID();
    const timeoutMs = opts.timeoutMs ?? 30000;
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.upstreamPending.delete(id);
        reject(
          new PluginError(
            `Timed out after ${timeoutMs} ms waiting for the figma-agent hub. The command may still be running; read the canvas before retrying.`,
            false,
          ),
        );
      }, timeoutMs + 5000);
      this.upstreamPending.set(id, { resolve: resolve as (v: unknown) => void, reject, timer });
      const msg: AgentToHub = { type: 'agent-request', id, command, params, file: opts.file, timeoutMs };
      ws.send(JSON.stringify(msg));
    });
  }
}
