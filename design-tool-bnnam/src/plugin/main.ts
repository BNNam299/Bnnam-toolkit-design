import type { ClientInfo, NoticeMessage, RequestMessage, ResponseMessage } from '../shared/protocol';
import { PROTOCOL_VERSION } from '../shared/protocol';
import { DESIGN_ONLY_TOOLS, designOnlyError as designOnlyErrorFigjam } from '../shared/figjam';
import { executeCode } from './commands/execute';
import { auditDesign } from './commands/audit';
import { managePages } from './commands/pages';
import { createVariables } from './commands/variables';
import { bindVariables } from './commands/bind';
import { createComponentSet } from './commands/components';
import { annotate, exportAssets, setDevStatus } from './commands/handoff';
import { setInteractions } from './commands/interactions';
import { renameByRule } from './commands/rename';
import { searchDesignSystem } from './commands/search';
import { stressTest } from './commands/stress';
import { createStyles } from './commands/styles';
import { importTokens, readTokens, renderFoundations } from './commands/tokens';
import {
  findNodes,
  getDesignSystem,
  getDocumentInfo,
  getNodes,
  getSelection,
  listFontFamilies,
  screenshot,
  setCurrentPage,
} from './commands/read';
import { renderTree } from './commands/render';
import { buildVectors } from './commands/vectors';
import { exportRig } from './commands/rig';
import { cloneNode, deleteNodes, moveNodes, selectNodes, updateNodes } from './commands/write';
import { errorMessage, RolledBackError } from './util';

interface Command {
  mutates: boolean;
  run(params: never): Promise<unknown>;
}

const commands: Record<string, Command> = {
  get_document_info: { mutates: false, run: getDocumentInfo },
  set_current_page: { mutates: false, run: setCurrentPage },
  get_selection: { mutates: false, run: getSelection },
  get_node: { mutates: false, run: getNodes },
  find_nodes: { mutates: false, run: findNodes },
  get_design_system: { mutates: false, run: getDesignSystem },
  list_fonts: { mutates: false, run: listFontFamilies },
  screenshot: { mutates: false, run: screenshot },
  select_nodes: { mutates: false, run: selectNodes },
  render_tree: { mutates: true, run: renderTree },
  update_nodes: { mutates: true, run: updateNodes },
  delete_nodes: { mutates: true, run: deleteNodes },
  move_nodes: { mutates: true, run: moveNodes },
  clone_node: { mutates: true, run: cloneNode },
  execute_code: { mutates: true, run: executeCode },
  audit_design: { mutates: false, run: auditDesign },
  manage_pages: { mutates: true, run: managePages },
  create_variables: { mutates: true, run: createVariables },
  search_design_system: { mutates: false, run: searchDesignSystem },
  create_styles: { mutates: true, run: createStyles },
  import_tokens: { mutates: true, run: importTokens },
  export_tokens: { mutates: false, run: readTokens },
  render_foundations: { mutates: true, run: renderFoundations },
  create_component_set: { mutates: true, run: createComponentSet },
  stress_test: { mutates: true, run: stressTest },
  set_interactions: { mutates: true, run: setInteractions },
  bind_variables: { mutates: true, run: bindVariables },
  rename_by_rule: { mutates: true, run: renameByRule },
  annotate: { mutates: true, run: annotate },
  set_dev_status: { mutates: true, run: setDevStatus },
  export_assets: { mutates: false, run: exportAssets },
  build_vectors: { mutates: true, run: buildVectors },
  export_rig: { mutates: false, run: exportRig },
};

figma.showUI(__html__, { width: 300, height: 300, themeColors: true });

let cachedSettings: Record<string, unknown> = {};

const INSTANCE_KEY = 'figma-agent/instance-id';
function instanceId(): string {
  let id = figma.root.getPluginData(INSTANCE_KEY);
  if (!id) {
    const bytes = new Uint8Array(8);
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    id = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    figma.root.setPluginData(INSTANCE_KEY, id);
  }
  return id;
}

function clientInfo(): ClientInfo {
  return {
    protocol: PROTOCOL_VERSION,
    fileKey: figma.fileKey ?? null,
    fileName: figma.root.name,
    instanceId: instanceId(),
    user: figma.currentUser?.name ?? null,
    currentPage: { id: figma.currentPage.id, name: figma.currentPage.name },
    version: `${__PLUGIN_VERSION__} (${__PLUGIN_BUILD__})`,
    commands: Object.keys(commands),
    preferredFileKey: typeof cachedSettings.preferredFileKey === 'string' ? cachedSettings.preferredFileKey : null,
  };
}

const DESIGN_ONLY = new Set<string>(DESIGN_ONLY_TOOLS);

function designOnlyError(command: string): string {
  return figma.editorType === 'slides'
    ? `${command} is Design-only and has no effect in this Slides deck.`
    : designOnlyErrorFigjam(command);
}

let queue: Promise<unknown> = Promise.resolve();
let pending = 0;

async function run(req: RequestMessage): Promise<ResponseMessage> {
  const cmd = commands[req.command];
  if (!cmd) {
    return { type: 'response', id: req.id, ok: false, error: `Unknown command "${req.command}".`, safeToRetryWithoutCanvasRead: true };
  }
  if (DESIGN_ONLY.has(req.command) && (figma.editorType === 'figjam' || (figma.editorType as string) === 'slides')) {
    return { type: 'response', id: req.id, ok: false, error: designOnlyError(req.command), safeToRetryWithoutCanvasRead: true };
  }
  const raw = (req.params ?? {}) as Record<string, unknown>;
  const target = typeof raw.page === 'string' && req.command !== 'set_current_page' ? raw.page : null;
  const { page: _scope, ...params } = raw;
  let previous: PageNode | null = null;
  try {
    if (target) {
      const page = figma.root.children.find((x) => x.id === target || x.name === target);
      if (!page) {
        throw new Error(`Page "${target}" not found. Pages: ${figma.root.children.map((x) => x.name).join(', ')}.`);
      }
      if (page.id !== figma.currentPage.id) {
        previous = figma.currentPage;
        await figma.setCurrentPageAsync(page);
      }
    }
    const result = await cmd.run(params as never);
    if (cmd.mutates) figma.commitUndo();
    return { type: 'response', id: req.id, ok: true, result };
  } catch (e) {
    if (cmd.mutates) figma.commitUndo();
    return {
      type: 'response',
      id: req.id,
      ok: false,
      error: errorMessage(e),
      safeToRetryWithoutCanvasRead: !cmd.mutates || e instanceof RolledBackError,
    };
  } finally {
    if (previous) {
      try {
        await figma.setCurrentPageAsync(previous);
      // eslint-disable-next-line no-empty
      } catch {
      }
    }
  }
}

type UiMessage =
  | { type: 'ready' }
  | { type: 'save-settings'; settings: Record<string, unknown> }
  | { type: 'resize'; width: number; height: number }
  | NoticeMessage
  | RequestMessage;

figma.ui.onmessage = (msg: UiMessage) => {
  if (msg.type === 'ready') {
    figma.clientStorage.getAsync('settings').then((settings) => {
      cachedSettings = (settings ?? {}) as Record<string, unknown>;
      figma.ui.postMessage({ type: 'init', info: clientInfo(), settings: cachedSettings, defaultToken: __BRIDGE_TOKEN__ });
    });
  } else if (msg.type === 'save-settings') {
    cachedSettings = msg.settings ?? {};
    figma.clientStorage.setAsync('settings', cachedSettings);
  } else if (msg.type === 'resize') {
    try {
      figma.ui.resize(msg.width, msg.height);
      figma.ui.postMessage({ type: 'resize-ok', width: msg.width, height: msg.height });
    } catch (e) {
      figma.ui.postMessage({ type: 'resize-error', message: errorMessage(e) });
    }
  } else if (msg.type === 'notice') {
    figma.ui.postMessage(msg);
  } else if (msg.type === 'request') {
    const started = Date.now();
    const { id, command } = msg;
    const queued = pending > 0;
    pending += 1;
    figma.ui.postMessage({ type: 'activity', requestId: id, command, state: queued ? 'queued' : 'running' });
    queue = queue.then(async () => {
      try {
        if (queued) figma.ui.postMessage({ type: 'activity', requestId: id, command, state: 'running' });
        const res = await run(msg);
        figma.ui.postMessage({ ...res, ms: Date.now() - started, command });
        figma.ui.postMessage({
          type: 'activity',
          requestId: id,
          command,
          state: res.ok ? 'done' : 'failed',
          ms: Date.now() - started,
        });
      } finally {
        pending -= 1;
      }
    });
  }
};

figma.on('currentpagechange', () => figma.ui.postMessage({ type: 'event', event: 'pagechange', info: clientInfo() }));

let selectionTimer: number | null = null;
figma.on('selectionchange', () => {
  if (selectionTimer !== null) clearTimeout(selectionTimer);
  selectionTimer = setTimeout(() => {
    selectionTimer = null;
    let selection: Array<{ id: string; name: string; type: string }> = [];
    try {
      selection = figma.currentPage.selection.slice(0, 20).map((node) => ({
        id: node.id,
        name: node.name,
        type: node.type,
      }));
    } catch {
      selection = [];
    }
    figma.ui.postMessage({ type: 'event', event: 'selectionchange', info: clientInfo(), selection });
  }, 150);
});
