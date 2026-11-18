
export const PROTOCOL_VERSION = 3;

export const DEFAULT_PORT = 3155;
export const DEFAULT_PORT_RANGE = 21;

export interface ClientInfo {
  protocol: number;
  fileKey: string | null;
  fileName: string;
  instanceId?: string | null;
  user: string | null;
  currentPage: { id: string; name: string };
  version?: string;
  commands?: string[];
  preferredFileKey?: string | null;
}

export interface FileSummary {
  fileName: string;
  fileKey: string | null;
  currentPage: string;
  instanceId?: string | null;
}

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
      safeToRetryWithoutCanvasRead: boolean;
    };

export type PluginToServer =
  | { type: 'hello'; info: ClientInfo }
  | ResponseMessage
  | {
      type: 'event';
      event: 'pagechange' | 'selectionchange';
      info: ClientInfo;
      selection?: SelectionSummary[];
    };

export type NoticeMessage = {
  type: 'notice';
  notice: 'files';
  files: FileSummary[];
};

export type ServerToPlugin = RequestMessage | NoticeMessage;


export const HUB_PROTOCOL = 3;

export interface HubFile {
  fileName: string | null;
  fileKey: string | null;
  instanceId?: string | null;
  user: string | null;
  currentPage: { id: string; name: string } | null;
  pluginVersion: string | null;
  connectedAt: string;
  commands: string[];
}

export interface HubState {
  pid: number;
  build: string;
  files: HubFile[];
  preferredFile: string | null;
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
