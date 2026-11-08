// Wire protocol between the MCP server (WebSocket server) and the plugin UI
// (WebSocket client). The UI relays requests to the plugin sandbox via
// postMessage and relays responses back unchanged.
//
// Protocol v2 adds: the port range the server may pick from, the list of
// commands a plugin build supports (so the server can say "your plugin is
// old" instead of "Unknown command"), the file the user pinned in the panel,
// and server → plugin notices (the list of connected files).

export const PROTOCOL_VERSION = 3;

/** First port the bridge tries. */
export const DEFAULT_PORT = 3055;
/**
 * How many consecutive ports the bridge may use, starting at DEFAULT_PORT.
 * The plugin panel probes the same range, so a second MCP server (another
 * client on the same machine) can take the next port instead of dying.
 */
export const DEFAULT_PORT_RANGE = 21;

export interface ClientInfo {
  protocol: number;
  fileKey: string | null;
  fileName: string;
  user: string | null;
  currentPage: { id: string; name: string };
  // Stamped at build time, e.g. "1.0.0 (a1b2c3d)" — lets the agent and the
  // plugin panel tell a fresh build from a stale one.
  version?: string;
  /** v2: the commands this plugin build can run. Absent on protocol v1. */
  commands?: string[];
  /** v2: the file the user pinned in the panel (null = no preference). */
  preferredFileKey?: string | null;
}

/** A connected Figma file, as shown in the panel's file picker. */
export interface FileSummary {
  fileName: string;
  fileKey: string | null;
  currentPage: string;
}

/** A selected layer, as shown in the panel. */
export interface SelectionSummary {
  id: string;
  name: string;
  type: string;
}

export interface RequestMessage {
  type: 'request';
  id: string;
  command: string;
  params: unknown;
}

export type ResponseMessage =
  | { type: 'response'; id: string; ok: true; result: unknown }
  | {
      type: 'response';
      id: string;
      ok: false;
      error: string;
      // true when the failed command left the canvas untouched (read-only
      // command, or a write that was rolled back), so it can be retried as is.
      safeToRetryWithoutCanvasRead: boolean;
    };

export type PluginToServer =
  | { type: 'hello'; info: ClientInfo }
  | ResponseMessage
  | {
      type: 'event';
      event: 'pagechange' | 'selectionchange';
      info: ClientInfo;
      /** v2: present on selectionchange. */
      selection?: SelectionSummary[];
    };

/** Server → plugin messages that are not command requests. */
export type NoticeMessage = {
  type: 'notice';
  notice: 'files';
  files: FileSummary[];
};

export type ServerToPlugin = RequestMessage | NoticeMessage;

// ---------------------------------------------------------------------------
// Protocol v3: one hub, many agents.
//
// The first MCP server binds DEFAULT_PORT and becomes the hub; the plugin
// connects to it as before. Every later MCP server (another agent on this
// machine) connects to the hub with `?role=agent` instead of opening a port,
// and sends its commands through the hub.

/** Lowest protocol a hub must speak for an agent to join it. */
export const HUB_PROTOCOL = 3;

/** A connected file as the hub reports it to agents. */
export interface HubFile {
  fileName: string | null;
  fileKey: string | null;
  user: string | null;
  currentPage: { id: string; name: string } | null;
  pluginVersion: string | null;
  connectedAt: string;
  /** Commands the plugin build reports (empty when it does not report them). */
  commands: string[];
}

export interface HubState {
  pid: number;
  build: string;
  files: HubFile[];
  preferredFile: string | null;
  /** Agents connected to the hub, not counting the hub itself. */
  agents: number;
}

export type AgentToHub =
  | { type: 'agent-hello'; protocol: number; build: string; pid: number }
  | { type: 'agent-request'; id: string; command: string; params: unknown; file?: string; timeoutMs: number };

export type HubToAgent =
  | { type: 'welcome'; protocol: number; state: HubState }
  | { type: 'hub-state'; state: HubState }
  | ({ type: 'agent-response' } & (
      | { id: string; ok: true; result: unknown }
      | { id: string; ok: false; error: string; safeToRetryWithoutCanvasRead: boolean }
    ));
