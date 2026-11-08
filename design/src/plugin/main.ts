// Plugin sandbox entry: shows the bridge UI and executes commands relayed by
// it. Commands run one at a time so concurrent requests never interleave.
import type { ClientInfo, NoticeMessage, RequestMessage, ResponseMessage } from '../shared/protocol';
import { PROTOCOL_VERSION } from '../shared/protocol';
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
import { cloneNode, deleteNodes, moveNodes, selectNodes, updateNodes } from './commands/write';
import { errorMessage, RolledBackError } from './util';

interface Command {
  mutates: boolean;
  // Params are validated by the MCP server before they reach the plugin.
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
};

// The panel is deliberately small: it lives in Figma's side panel, so it
// stays out of the way of the canvas. The user can grow it from the menu.
figma.showUI(__html__, { width: 300, height: 300, themeColors: true });

// Settings live in clientStorage under a single "settings" key. The panel
// (ui.html) owns the shape and sends the whole object back on every change;
// the plugin only mirrors it so clientInfo() can report the pinned file.
let cachedSettings: Record<string, unknown> = {};

function clientInfo(): ClientInfo {
  return {
    protocol: PROTOCOL_VERSION,
    fileKey: figma.fileKey ?? null,
    fileName: figma.root.name,
    user: figma.currentUser?.name ?? null,
    currentPage: { id: figma.currentPage.id, name: figma.currentPage.name },
    version: `${__PLUGIN_VERSION__} (${__PLUGIN_BUILD__})`,
    // Lets the server tell "your plugin build is old" instead of "Unknown
    // command" (protocol v2).
    commands: Object.keys(commands),
    // The file the user pinned in the panel (null = no preference).
    preferredFileKey: typeof cachedSettings.preferredFileKey === 'string' ? cachedSettings.preferredFileKey : null,
  };
}

let queue: Promise<unknown> = Promise.resolve();
// Number of requests accepted but not finished yet; >0 means the next
// request has to wait for the running one.
let pending = 0;

async function run(req: RequestMessage): Promise<ResponseMessage> {
  const cmd = commands[req.command];
  if (!cmd) {
    return { type: 'response', id: req.id, ok: false, error: `Unknown command "${req.command}".`, safeToRetryWithoutCanvasRead: true };
  }
  // `page` scopes the command to one page regardless of which page another
  // agent switched to (the current page is file-global state). We switch,
  // run, then hand the previous page back.
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
      } catch {
        // the page may have been deleted by this command; leave the new one
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
      figma.ui.postMessage({ type: 'init', info: clientInfo(), settings: cachedSettings });
    });
  } else if (msg.type === 'save-settings') {
    cachedSettings = msg.settings ?? {};
    figma.clientStorage.setAsync('settings', cachedSettings);
  } else if (msg.type === 'resize') {
    try {
      figma.ui.resize(msg.width, msg.height);
      figma.ui.postMessage({ type: 'resize-ok', width: msg.width, height: msg.height });
    } catch (e) {
      // Figma refuses some sizes (e.g. bigger than the canvas area). Keep the
      // current size and tell the panel so it can show a small toast.
      figma.ui.postMessage({ type: 'resize-error', message: errorMessage(e) });
    }
  } else if (msg.type === 'notice') {
    // Server → panel. The panel renders the file picker from this.
    figma.ui.postMessage(msg);
  } else if (msg.type === 'request') {
    const started = Date.now();
    const { id, command } = msg;
    // A request that arrives while another one is still running has to wait in
    // the queue: tell the panel "queued" so the spinner is honest. The panel
    // gets "running" as soon as the command actually starts.
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

// Selection changes fire on every drag; debounce so the server is not flooded.
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
      // The page may not be loaded (dynamic-page) — report an empty selection.
      selection = [];
    }
    figma.ui.postMessage({ type: 'event', event: 'selectionchange', info: clientInfo(), selection });
  }, 150);
});
