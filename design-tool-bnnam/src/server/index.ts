#!/usr/bin/env node
// MCP server (stdio) exposing Figma tools. It hosts the WebSocket bridge the
// plugin connects to. stdout belongs to MCP: log to stderr only.
import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { DEFAULT_PORT, DEFAULT_PORT_RANGE, PROTOCOL_VERSION } from '../shared/protocol';
import * as S from '../shared/schemas';
import { exportTokens, planTokenImport, type DtcgTree, type ExportCollection, type ExportTextStyle } from '../shared/tokens';
import { slug } from '../shared/rename';
import sharp from 'sharp';
import { Bridge, PluginError } from './bridge';
import { inlineImages } from './images';

const log = (msg: string) => process.stderr.write(`[figma-agent] ${msg}\n`);
const MAX_TEXT = Number(process.env.FIGMA_AGENT_MAX_OUTPUT ?? 20000);

function loadToken(): string {
  if (process.env.FIGMA_AGENT_TOKEN) return process.env.FIGMA_AGENT_TOKEN;
  const dir = join(homedir(), '.figma-agent');
  const file = join(dir, 'token');
  try {
    return readFileSync(file, 'utf8').trim();
  } catch {
    const token = randomBytes(12).toString('hex');
    mkdirSync(dir, { recursive: true });
    writeFileSync(file, token + '\n', { mode: 0o600 });
    return token;
  }
}

const token = loadToken();
const port = Number(process.env.FIGMA_AGENT_PORT ?? DEFAULT_PORT);
const portRange = Number(process.env.FIGMA_AGENT_PORT_RANGE ?? DEFAULT_PORT_RANGE);

// Commands the server sends to the plugin (one per tool registered with
// `tool()`). Used to tell the user which commands their plugin build misses.
const PLUGIN_COMMANDS = new Set<string>();

// One port for every agent on the machine: the first server hosts the hub,
// later ones join it. FIGMA_AGENT_HUB=0 restores one port per server.
const hub = process.env.FIGMA_AGENT_HUB !== '0';

const bridge = new Bridge({
  port,
  portRange,
  token,
  log,
  hub,
  build: `${__SERVER_VERSION__} (${__SERVER_BUILD__})`,
  supportedCommands: () => [...PLUGIN_COMMANDS],
  onListening: (actualPort) => {
    try {
      writePortFile(actualPort);
    } catch (e) {
      log(`warning: could not write ~/.figma-agent/port (${e instanceof Error ? e.message : String(e)})`);
    }
  },
});

const INSTRUCTIONS = `Tools that read, create, edit and screenshot designs in the Figma file where the "figma-agent-UI" plugin is open.
Workflow: (1) inspect first: get_document_info, get_design_system, get_selection; reuse existing components, variables and styles instead of hardcoding values.
(2) build screens outside-in in three passes: layout = screen frame + named regions + sized placeholder blocks in one render_tree → fill = components for repeated blocks, then placeholders filled by cluster (render_tree{parentId}) and content in batches (update_nodes) → lock = audit_design + stress_test; auto layout everywhere; execute_code only for what no tool covers.
(3) check numbers after every write (write bounds or get_node: fixed sizes kept, children fit, FILL/HUG as planned) and look once per pass (screenshot the screen; extra screenshots only for unusual blocks); fix the specific node; finish a screen (audit_design + stress_test clean) before starting the next one, and build similar screens by cloning it.
Flow and quality bar: skill figma-ui-flow; tool details: skill figma-agent-tools. Design-system work: search_design_system before creating anything; manage_pages{template} for the file skeleton; import_tokens / create_variables / create_styles for foundations; create_component_set for variants; set_interactions for prototypes; audit_design → bind_variables / rename_by_rule to fix; annotate / set_dev_status / export_tokens / export_assets for handoff.
Every write returns node ids: keep them, there is no other state. If a write fails with safeToRetryWithoutCanvasRead=false, read the canvas before retrying.`;

const server = new McpServer({ name: 'figma-agent', version: __SERVER_VERSION__ }, { instructions: INSTRUCTIONS });
const SERVER_STAMP = `${__SERVER_VERSION__} (${__SERVER_BUILD__})`;

const fileParam = {
  file: z.string().optional().describe('Target file name or key when several Figma files are connected'),
};
// Scopes a command to one page even when another agent switches the current
// page mid-flight (the current page is global file state).
const pageParam = z
  .string()
  .optional()
  .describe('Run on this page (id or exact name), then restore the previous page');

type Content = { type: 'text'; text: string } | { type: 'image'; data: string; mimeType: string };

function text(value: unknown): Content {
  let s = JSON.stringify(value, null, 1);
  if (s.length > MAX_TEXT) {
    s = s.slice(0, MAX_TEXT) + `\n…[truncated ${s.length - MAX_TEXT} chars: narrow the query (depth, ids, limit)]`;
  }
  return { type: 'text', text: s };
}

function failure(e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  const safe = e instanceof PluginError ? e.safeToRetryWithoutCanvasRead : true;
  return {
    isError: true,
    content: [{ type: 'text' as const, text: `Error: ${msg}\nsafeToRetryWithoutCanvasRead: ${safe}` }],
  };
}

interface ToolDef<T extends z.ZodObject> {
  description: string;
  input: T;
  readOnly?: boolean;
  noPage?: boolean;
  timeoutMs?: (args: z.infer<T>) => number;
  prepare?: (args: z.infer<T>) => Promise<unknown>;
  format?: (result: unknown, args: z.infer<T>) => Content[] | Promise<Content[]>;
}

function tool<T extends z.ZodObject>(name: string, def: ToolDef<T>) {
  PLUGIN_COMMANDS.add(name);
  let input = def.input.extend(fileParam);
  if (!def.noPage && !('page' in def.input.shape)) input = input.extend({ page: pageParam });
  server.registerTool(
    name,
    {
      description: def.description,
      inputSchema: input,
      annotations: { readOnlyHint: def.readOnly ?? false, openWorldHint: false },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- the SDK infers args from the schema
    (async (args: any) => {
      try {
        const { file, page, ...rest } = args as z.infer<T> & { file?: string; page?: string };
        const base = def.prepare ? await def.prepare(rest as z.infer<T>) : (rest as z.infer<T>);
        const params = page ? { ...(base as object), page } : base;
        const result = await bridge.request(name, params, {
          file,
          timeoutMs: def.timeoutMs?.(rest as z.infer<T>) ?? 30000,
        });
        return { content: def.format ? await def.format(result, rest as z.infer<T>) : [text(result)] };
      } catch (e) {
        return failure(e);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any,
  );
}

server.registerTool(
  'figma_status',
  {
    description:
      'Bridge status and connected Figma files. Call first if any tool reports no connection. The token is masked; pass includeToken: true to get it in full.',
    inputSchema: z.object({
      includeToken: z.boolean().optional().describe('Return the full token (masked by default)'),
    }),
    annotations: { readOnlyHint: true },
  },
  async (args) => {
    const status = bridge.status();
    // A plugin built from another commit is still running in Figma: new tools
    // will be "Unknown command" until it is reopened.
    const stale = status.files.filter((f) => f.pluginVersion !== SERVER_STAMP);
    const missingCommands = bridge.missingCommands([...PLUGIN_COMMANDS]);
    return {
      content: [
        text({
          ...status,
          server: { version: __SERVER_VERSION__, build: __SERVER_BUILD__ },
          protocol: PROTOCOL_VERSION,
          versionCheck: stale.length
            ? `⚠️ Plugin khác phiên bản server ${SERVER_STAMP}: ${stale.map((f) => `${f.fileName} = ${f.pluginVersion ?? 'unknown'}`).join(', ')}. Đóng plugin rồi mở lại (Plugins → Development → figma-agent-UI).`
            : status.files.length
              ? `✅ Plugin và server cùng phiên bản ${SERVER_STAMP}`
              : undefined,
          missingCommands,
          // The token is a secret: only the last 4 characters are shown unless
          // the caller explicitly asks for the full value.
          token: args?.includeToken === true ? token : maskToken(token),
          howToConnect:
            'Figma desktop → Plugins → Development → figma-agent-UI. Paste the token in the plugin and press Connect.',
        }),
      ],
    };
  },
);

type DoctorCheckId = 'server' | 'port' | 'token' | 'plugin' | 'version' | 'capability' | 'manifest';

interface DoctorCheck {
  id: DoctorCheckId;
  ok: boolean;
  title: string;
  detail: string;
  fix?: string;
}

function maskToken(value: string): string {
  return `…${value.slice(-4)}`;
}

// manifest.json sits next to the server bundle (dist/server.mjs → ../).
function manifestPath(): string | null {
  const override = process.env.FIGMA_AGENT_MANIFEST;
  if (override) return override;
  for (const rel of ['../manifest.json', '../../manifest.json']) {
    const p = fileURLToPath(new URL(rel, import.meta.url));
    if (existsSync(p)) return p;
  }
  return null;
}

// Does the manifest allow a WebSocket to this port?
function coversPort(entries: string[], target: number): { covered: boolean; note?: string } {
  for (const entry of entries) {
    if (entry === '*') return { covered: true, note: 'wildcard "*" — mọi domain được phép' };
    if (entry.includes('*')) return { covered: true, note: `wildcard "${entry}" — mọi domain được phép` };
    const m = entry.match(/^wss?:\/\/[^/]*?(?::(\d+))?(?:\/|$)/);
    if (!m) continue;
    if (!m[1]) return { covered: true, note: `"${entry}" không chỉ định port — phủ mọi port` };
    if (Number(m[1]) === target) return { covered: true };
  }
  return { covered: false };
}

server.registerTool(
  'figma_doctor',
  {
    description:
      'Diagnose the link between the MCP server and the Figma plugin: port, token, connected files, plugin build, missing commands and manifest. Never fails — every problem comes back as a check with a fix.',
    inputSchema: z.object({}),
    annotations: { readOnlyHint: true },
  },
  async () => {
    const checks: DoctorCheck[] = [];
    const status = bridge.status();
    const missing = bridge.missingCommands([...PLUGIN_COMMANDS]);

    checks.push({
      id: 'server',
      ok: true,
      title: 'MCP server',
      detail: `figma-agent ${__SERVER_VERSION__} (build ${__SERVER_BUILD__}), protocol v${PROTOCOL_VERSION}.`,
    });

    const first = status.ports[0] ?? port;
    const last = status.ports[status.ports.length - 1] ?? port;
    checks.push(
      status.role === 'agent'
        ? {
            id: 'port',
            ok: true,
            title: 'WebSocket bridge',
            detail: `Dùng chung hub ở ws://localhost:${status.port} (pid ${status.hub?.pid ?? '?'}, build ${status.hub?.build ?? '?'}); server này không mở cổng riêng.`,
          }
        : status.listening
        ? {
            id: 'port',
            ok: true,
            title: 'WebSocket bridge',
            detail: hub
              ? `Đang làm hub ở ws://localhost:${status.port}, ${status.agents} agent khác dùng chung.`
              : `Đang listen ở ws://localhost:${status.port} (dải candidate ${first}-${last}).`,
          }
        : {
            id: 'port',
            ok: false,
            title: 'WebSocket bridge',
            detail: status.error ?? 'Bridge chưa listen.',
            fix: hub
              ? `Khởi động lại agent đang giữ cổng ${first} (figma-agent bản cũ chưa có hub), hoặc đóng tiến trình đang chiếm nó. Kiểm tra: lsof -i :${first}`
              : `Đóng các tiến trình đang chiếm port ${first}-${last} rồi khởi động lại server (hoặc đặt FIGMA_AGENT_PORT). Kiểm tra: lsof -i :${first}-${last}`,
          },
    );

    const tokenCheck: DoctorCheck = {
      id: 'token',
      ok: token.length > 0,
      title: 'Token',
      detail: `Token đã lưu tại ~/.figma-agent/token (${maskToken(token)}). Dán vào panel plugin để kết nối.`,
    };
    if (!tokenCheck.ok) tokenCheck.fix = 'Xoá ~/.figma-agent/token rồi khởi động lại server để sinh token mới.';
    checks.push(tokenCheck);

    const files = status.files;
    checks.push(
      files.length
        ? {
            id: 'plugin',
            ok: true,
            title: 'Plugin đang mở',
            detail: files
              .map((f) => `${f.fileName} · ${f.currentPage?.name ?? '?'} · ${f.pluginVersion ?? 'unknown'}`)
              .join(' | '),
          }
        : {
            id: 'plugin',
            ok: false,
            title: 'Plugin đang mở',
            detail: 'Chưa có file Figma nào kết nối.',
            fix: 'Mở plugin trong Figma: Plugins → Development → figma-agent-UI, dán token rồi bấm Connect.',
          },
    );

    const stale = files.filter((f) => f.pluginVersion !== SERVER_STAMP);
    checks.push(
      stale.length === 0
        ? {
            id: 'version',
            ok: true,
            title: 'Phiên bản plugin',
            detail: files.length ? `Plugin và server cùng build ${SERVER_STAMP}.` : 'Chưa có plugin nào để so sánh.',
          }
        : {
            id: 'version',
            ok: false,
            title: 'Phiên bản plugin',
            detail: `Plugin khác build server (${SERVER_STAMP}): ${stale.map((f) => `${f.fileName} = ${f.pluginVersion ?? 'unknown'}`).join(', ')}.`,
            fix: 'Chạy npm run build, rồi đóng và mở lại plugin trong Figma (Plugins → Development → figma-agent-UI).',
          },
    );

    checks.push(
      missing.length === 0
        ? {
            id: 'capability',
            ok: true,
            title: 'Lệnh của plugin',
            detail: files.length
              ? 'Plugin hỗ trợ đủ các lệnh của server.'
              : 'Chưa có plugin nên chưa kiểm tra được lệnh nào thiếu.',
          }
        : {
            id: 'capability',
            ok: false,
            title: 'Lệnh của plugin',
            detail: `Plugin chưa hỗ trợ: ${missing.join(', ')}.`,
            fix: 'Đóng và mở lại plugin trong Figma sau khi chạy npm run build.',
          },
    );

    const path = manifestPath();
    let manifestCheck: DoctorCheck;
    if (!path) {
      manifestCheck = {
        id: 'manifest',
        ok: false,
        title: 'manifest.json',
        detail: 'Không đọc được manifest.json.',
        fix: 'Kiểm tra manifest.json cạnh dist/server.mjs (hoặc đặt FIGMA_AGENT_MANIFEST).',
      };
    } else {
      try {
        const manifest = JSON.parse(readFileSync(path, 'utf8')) as {
          networkAccess?: { devAllowedDomains?: string[] };
        };
        const entries = manifest.networkAccess?.devAllowedDomains ?? [];
        const target = status.listening ? status.port : port;
        const cover = coversPort(entries, target);
        const listed = entries.length > 4 ? `${entries.slice(0, 4).join(', ')}… (+${entries.length - 4})` : entries.join(', ');
        manifestCheck = {
          id: 'manifest',
          ok: cover.covered,
          title: 'manifest.json',
          detail: cover.covered
            ? `devAllowedDomains phủ port ${target}${cover.note ? ` (${cover.note})` : ''}.`
            : `devAllowedDomains (${listed || 'rỗng'}) chưa phủ port ${target}.`,
        };
        if (!manifestCheck.ok) {
          manifestCheck.fix =
            'Sửa manifest.json (devAllowedDomains) rồi Plugins → Development → figma-agent-UI → Import lại manifest.json trong Figma.';
        }
      } catch (e) {
        manifestCheck = {
          id: 'manifest',
          ok: false,
          title: 'manifest.json',
          detail: `Không đọc được manifest.json (${e instanceof Error ? e.message : String(e)}).`,
          fix: 'Sửa manifest.json (JSON hỏng) rồi import lại vào Figma.',
        };
      }
    }
    checks.push(manifestCheck);

    const ok = checks.every((c) => c.ok);
    const nextSteps = checks.filter((c) => !c.ok && c.fix).map((c) => c.fix!);
    return {
      content: [
        text({
          ok,
          checks,
          nextSteps: nextSteps.length ? nextSteps : ['Mọi thứ ổn — gọi get_document_info để bắt đầu.'],
        }),
      ],
    };
  },
);

tool('get_document_info', {
  description: 'File name, pages, current page, selection and top-level layers of the current page.',
  input: z.object({}),
  readOnly: true,
});

tool('set_current_page', {
  description: 'Switch the current page (by id or exact name). Other tools work on the current page.',
  input: S.SetPageInput,
});

tool('get_selection', {
  description: 'Serialize the selected layers (layout, sizing, fills as hex or variable names, text, components).',
  input: S.GetSelectionInput,
  readOnly: true,
});

tool('get_node', {
  description:
    'Serialize nodes by id in the same vocabulary as render_tree/update_nodes. Use depth to control how many child levels are returned.',
  input: S.GetNodeInput,
  readOnly: true,
});

tool('find_nodes', {
  description: 'Search layers under a root (default current page) by type, name substring or text content.',
  input: S.FindNodesInput,
  readOnly: true,
});

tool('get_design_system', {
  description:
    'Local variables (with modes and values), paint/text/effect styles, local components with their properties, library components already used on the page, and optionally library variable collections. Check this before building so you reuse tokens and components.',
  input: S.DesignSystemInput,
  readOnly: true,
  timeoutMs: () => 120000,
});

tool('list_fonts', {
  description: 'Installed font families and their exact style names (e.g. "Semi Bold" vs "SemiBold").',
  input: S.ListFontsInput,
  readOnly: true,
});

tool('screenshot', {
  description:
    'WebP screenshot of a node (default: first selected). Use it to verify your work: look for clipped text, overlaps, misalignment and spacing issues.',
  input: S.ScreenshotInput,
  readOnly: true,
  timeoutMs: () => 60000,
  format: async (r) => {
    const { base64, ...meta } = r as { base64: string; mimeType: string };
    const webp = await sharp(Buffer.from(base64, 'base64')).webp({ quality: 85 }).toBuffer();
    return [{ type: 'image', data: webp.toString('base64'), mimeType: 'image/webp' }, text(meta)];
  },
});

tool('select_nodes', {
  description: 'Select layers on the current page and optionally zoom to them, to show the user a result.',
  input: S.SelectNodesInput,
});

tool('render_tree', {
  description: `Create a layout from a nested JSON tree (frames with auto layout, text, rect, ellipse, svg icons, images, component instances, sections).
Build screens level by level: first the screen frame with empty named regions, then one render_tree{parentId: <region id>} per region, checking each with screenshot before the next.
Rules: one wrapper frame per call; use layout HORIZONTAL/VERTICAL with gap/padding instead of x/y; widthMode FILL needs an auto-layout parent; text wraps when it has a width or widthMode FILL; colors are hex or {var:"name"} to bind variables; text styles/paint styles/effect styles by name.
Images (src / {image}) may be URLs or local paths: the server downloads them. If anything fails, the partial result is removed.
Returns rootId and an ids map "Root/Child/Grandchild" → node id.`,
  input: S.RenderTreeInput,
  timeoutMs: () => 120000,
  prepare: (args) => inlineImages(args),
});

tool('update_nodes', {
  description:
    'Patch properties of existing nodes in a batch, using the same properties as render_tree (text, fonts, fills, stroke, radius, effects, layout, padding, gap, sizing, variables, instance variant/properties/texts, component swap). Returns updated and failed ids.',
  input: S.UpdateNodesInput,
  timeoutMs: () => 60000,
  prepare: (args) => inlineImages(args),
});

tool('delete_nodes', { description: 'Delete layers by id.', input: S.DeleteNodesInput });

tool('move_nodes', {
  description: 'Reparent and/or reorder layers (parentId, index) or set x/y for absolutely positioned layers.',
  input: S.MoveNodesInput,
});

tool('clone_node', {
  description: 'Duplicate a layer, optionally into another parent or position. Returns the copy.',
  input: S.CloneNodeInput,
});

tool('execute_code', {
  description: `Run JavaScript against the Figma Plugin API for anything the other tools do not cover (components/variants, variables and modes, styles, prototyping, constraints, boolean ops, vector edits, bulk edits...).
The code is the body of an async function with globals \`figma\` and \`h\`; use top-level await and \`return\` a JSON-friendly value (nodes are summarized automatically). console.log output is not returned.
Rules: colors are 0..1 RGB with opacity on the paint; fills/strokes arrays are immutable (clone, edit, reassign); load fonts before editing text (await h.loadNodeFonts(textNode) or figma.loadFontAsync); use figma.getNodeByIdAsync and await figma.setCurrentPageAsync; resize() before setting layoutSizing*; FILL only inside auto layout. Do not call figma.closePlugin(). Return every created/changed id.
Helpers h: solid(hex) → SolidPaint, rgb(hex), hex(rgb), getNode(id), loadFont(fontName), loadNodeFonts(text), resolveFont(family, style), serialize(node, depth), summary(node), freeSpot() → {x,y} for new top-level nodes.`,
  input: S.ExecuteCodeInput,
  timeoutMs: (a) => a.timeoutMs,
});

tool('audit_design', {
  description: `Read-only QA audit of a page or subtree (figma-ui-flow Stage 7). Returns counts + samples per issue kind and a severity roll-up (Chặn / Nên sửa / Gợi ý).
Checks: default/blacklisted layer names, fills not bound to a variable or style, text without a text style, frames with children but no auto layout, redundant wrappers, spacing off the 4/8 scale, contrast below WCAG (background gradient/image is reported as needs-check instead of a wrong ratio), interactive targets under 44pt, hidden layers, orphan styles.
Use format: "markdown" to get the skill's QA report template ready to paste into the repo.`,
  input: S.AuditInput,
  readOnly: true,
  timeoutMs: () => 60000,
});

tool('create_variables', {
  description: `Create or extend a variable collection: modes, values per mode, aliases and scopes (figma-ui-flow Stage 2).
Names use slash paths ("color/blue/600", "space/4"). COLOR values are "#RRGGBB"/"#RRGGBBAA", numbers for FLOAT, or { alias: "other/name" } to point at another variable. Set scopes: [] on primitives so they stay out of pickers; bind Semantic tokens to layers.
If the file/plan allows one mode only, Figma rejects addMode: the call still creates the variables with the default mode and returns that as a warning.`,
  input: S.CreateVariablesInput,
  noPage: true,
  timeoutMs: () => 120000,
});

tool('manage_pages', {
  description: `Create, rename, delete and reorder pages (figma-ui-flow Stage 1). template: true creates the missing pages of the standard skeleton (Cover / Brief / Explore / Foundations / Components / Screens / Prototype / Ready for dev / Archive).
Safety: never deletes the last page, refuses name collisions, reports unknown page refs in problems, and dryRun returns the plan without touching the file.`,
  input: S.ManagePagesInput,
  noPage: true,
  timeoutMs: () => 60000,
});

tool('search_design_system', {
  description: `Ranked search over local components (with their properties), variables (collection, value, primitive or not) and paint/text/effect/grid styles — figma-ui-flow rule #3 "search before you create". Call it before creating any component, token or style.
includeLibraries also searches variables of enabled team libraries (library components cannot be listed by the Plugin API).`,
  input: S.SearchDesignSystemInput,
  readOnly: true,
  noPage: true,
  timeoutMs: () => 120000,
});

tool('create_styles', {
  description: `Create or update text, paint, effect and grid styles in one call (figma-ui-flow Stage 2).
text: fontFamily + fontStyle/fontWeight + fontSize (number or {var}) + lineHeight/letterSpacing. paint: fill (hex, {var}, gradient). effect: shadow list or preset sm/md/lg/xl. grid: [{pattern, count, gutter, margin}] or {preset: mobile|tablet|desktop|baseline}.
New styles are removed again if any entry fails.`,
  input: S.CreateStylesInput,
  noPage: true,
  timeoutMs: () => 120000,
});

tool('import_tokens', {
  description: `Import a DTCG design-token JSON (figma-ui-flow assets/tokens.example.json format) as variable collections: each top-level group becomes a collection ("primitives" → "Primitives"), $extensions.modes become modes, "{primitives.color.white}" becomes an alias, scopes are inferred (primitives get []).
The JSON is first linted with the same rules as scripts/check_tokens.py (names, aliases, tiers, 4-grid, WCAG contrast); errors stop the import unless allowLintErrors. Pass tokens (the JSON) or path (a file on this machine). dryRun returns the plan only.`,
  input: S.ImportTokensInput,
  noPage: true,
  timeoutMs: () => 180000,
  prepare: async (args) => {
    let tree: unknown = args.tokens;
    if (!tree && args.path) {
      if (!isAbsolute(args.path)) throw new Error('path phải là đường dẫn tuyệt đối');
      tree = JSON.parse(readFileSync(args.path, 'utf8'));
    }
    if (!tree || typeof tree !== 'object') throw new Error('Cần tokens (JSON) hoặc path tới file JSON');
    const plan = planTokenImport(tree as DtcgTree);
    if (plan.lint.errors.length && !args.allowLintErrors) {
      throw new Error(`Token JSON có ${plan.lint.errors.length} lỗi (check_tokens):\n${plan.lint.errors.join('\n')}\nSửa JSON hoặc gọi lại với allowLintErrors: true.`);
    }
    if (!plan.collections.length) throw new Error('Không có token nào thành variable được (cần $type color/dimension/number/string/boolean).');
    return { collections: plan.collections, skipped: plan.skipped, lint: plan.lint, dryRun: args.dryRun, onExisting: args.onExisting };
  },
});

tool('export_tokens', {
  description: `Export local variables (and text styles for json/css) as code (figma-ui-flow Stage 8, handoff-qa §5): json = DTCG with $extensions.modes, css = custom properties with [data-theme] blocks per extra mode, swift = SwiftUI Color/CGFloat with dark appearance, kotlin = Compose Color objects per mode + dp values.
Aliases stay aliases in json/css (var(--…)) and are resolved in swift/kotlin. path also writes the file.`,
  input: S.ExportTokensInput,
  readOnly: true,
  noPage: true,
  timeoutMs: () => 60000,
  format: (result, args) => {
    const r = result as { collections: ExportCollection[]; textStyles: ExportTextStyle[] };
    const out = exportTokens(r.collections, r.textStyles, args.format);
    if (args.path) {
      if (!isAbsolute(args.path)) throw new Error('path phải là đường dẫn tuyệt đối');
      mkdirSync(dirname(args.path), { recursive: true });
      writeFileSync(args.path, out);
    }
    const summary = { format: args.format, collections: r.collections.map((c) => `${c.name} (${c.variables.length})`), textStyles: r.textStyles.length, written: args.path };
    return [text(summary), { type: 'text', text: out.length > MAX_TEXT ? out.slice(0, MAX_TEXT) + '\n…[truncated: use path to get the whole file]' : out }];
  },
});

tool('render_foundations', {
  description: 'Draw the Foundations page content (figma-ui-flow Stage 2): colour swatches per collection/group, type specimen per text style, spacing ruler, radius and elevation samples — every sample bound to the real variable/style. Pass page: "🎨 Foundations". Returns the render_tree result.',
  input: S.RenderFoundationsInput,
  timeoutMs: () => 180000,
});

tool('create_component_set', {
  description: `Create a component set in one call (figma-ui-flow Stage 3). Each variant = { props: { Size: "md", State: "Default" }, tree: <render_tree frame> }; names become "Size=md, State=Default". properties add TEXT / BOOLEAN / INSTANCE_SWAP component properties and wire them to layers by name (targets), e.g. { name: "Label", type: "TEXT", default: "Button", targets: ["label"] }.
Validates duplicate/missing variant values, mixed size vocabularies and the 50-variant budget before drawing; on any failure nothing is left on the canvas. Search first (search_design_system) — create only when nothing fits.`,
  input: S.CreateComponentSetInput,
  timeoutMs: () => 180000,
  prepare: (args) => inlineImages(args),
});

tool('stress_test', {
  description: `Playground check (figma-ui-flow Stage 3, handoff-qa D2): copies a frame/component into a Section "Stress / <name>" (default on page 🧪 Explore) with long text (×2), large text (×1.5), narrow (−25%), wide (+50%), empty text and/or other variable modes, and reports text that overflows its clip area. Screenshot the returned sectionId to review; delete it afterwards.`,
  input: S.StressTestInput,
  noPage: true,
  timeoutMs: () => 120000,
});

tool('set_interactions', {
  description: `Prototype reactions (figma-ui-flow Stage 6): trigger ON_CLICK/ON_HOVER/ON_PRESS/ON_DRAG/{afterTimeout} → action NAVIGATE/OVERLAY/SWAP/SCROLL_TO/CHANGE_TO (variant → interactive component)/BACK/CLOSE/URL/SET_VARIABLE/SET_VARIABLE_MODE, with transition { type: SMART_ANIMATE|DISSOLVE|PUSH|SLIDE_IN…, duration: ms or { var: "duration/base" }, easing: standard|decelerate|accelerate|spring|… }. flowStart marks a prototype starting frame.`,
  input: S.SetInteractionsInput,
  timeoutMs: () => 60000,
});

tool('bind_variables', {
  description: `Fix raw values in bulk (figma-ui-flow Stage 7): binds solid fills/strokes, auto-layout gap/padding and corner radius under rootId to Semantic variables — the nearest in-scope colour within tolerance ΔE, exact numbers for spacing/radius, or an explicit map {"#2563EB": "color/action/primary", "16": "space/4"}. Primitives (scopes []) are never used. Ambiguous matches are listed, not guessed.
dryRun defaults to true: review, then call again with dryRun: false.`,
  input: S.BindVariablesInput,
  timeoutMs: () => 120000,
});

tool('rename_by_rule', {
  description: `Rename layers under rootId (figma-ui-flow rule #4): explicit RegExp rules first, then (auto) role names for Figma default/blacklisted names only — text → label/<words>, vector frames → icon/glyph, image fills → image/placeholder, auto-layout → row/stack. Instance sublayers are skipped. dryRun defaults to true.`,
  input: S.RenameByRuleInput,
  timeoutMs: () => 120000,
});

tool('annotate', {
  description: 'Dev Mode annotations (figma-ui-flow Stage 8): markdown label for behaviour, logic, edge cases, motion specs and a11y labels, optionally pinning node properties (fills, itemSpacing, padding, …) and a category. Appends unless replace.',
  input: S.AnnotateInput,
  timeoutMs: () => 60000,
});

tool('set_dev_status', {
  description: 'Mark sections or top-level frames "Ready for dev" / "Completed" (or NONE to clear) in Dev Mode (figma-ui-flow Stage 8). Only nodes directly on a page or in a section accept a status.',
  input: S.SetDevStatusInput,
});

tool('export_assets', {
  description: 'Export nodes as files into outDir (figma-ui-flow Stage 8): PNG/JPG at each scale (name@2x.png…), or SVG/PDF once. The server writes the files and returns their paths.',
  input: S.ExportAssetsInput,
  readOnly: true,
  timeoutMs: () => 180000,
  format: (result, args) => {
    if (!isAbsolute(args.outDir)) throw new Error('outDir phải là đường dẫn tuyệt đối');
    mkdirSync(args.outDir, { recursive: true });
    const written: string[] = [];
    const used = new Set<string>();
    for (const f of (result as { files: { id: string; name: string; scale?: number; format: string; base64: string }[] }).files) {
      const base = slug(f.name.replace(/\//g, ' '), 8) || f.id.replace(/[:;]/g, '-');
      let name = `${base}${f.scale && f.scale !== 1 ? `@${f.scale}x` : ''}.${f.format.toLowerCase()}`;
      for (let i = 2; used.has(name); i++) name = `${base}-${i}${f.scale && f.scale !== 1 ? `@${f.scale}x` : ''}.${f.format.toLowerCase()}`;
      used.add(name);
      const path = join(args.outDir, name);
      writeFileSync(path, Buffer.from(f.base64, 'base64'));
      written.push(path);
    }
    return [text({ written })];
  },
});

// The real port is written atomically (tmp file → rename) so a reader never
// sees a half-written file if the server is killed mid-write. Tests point
// FIGMA_AGENT_PORT_FILE somewhere else so they never touch the real file.
function writePortFile(actualPort: number) {
  const target = process.env.FIGMA_AGENT_PORT_FILE ?? join(homedir(), '.figma-agent', 'port');
  mkdirSync(dirname(target), { recursive: true });
  const tmp = target + '.tmp';
  writeFileSync(tmp, `${actualPort}\n`);
  renameSync(tmp, target);
}

async function main() {
  await bridge.start();
  log(`token: ${token}  (stored in ~/.figma-agent/token, override with FIGMA_AGENT_TOKEN)`);
  log('copy the token: pbcopy < ~/.figma-agent/token');
  await server.connect(new StdioServerTransport());
}

main().catch((e) => {
  log(`fatal: ${e instanceof Error ? e.stack : String(e)}`);
  process.exit(1);
});

// Exit with the MCP client: the WebSocket server would otherwise keep the
// process (and the port) alive.
const shutdown = () => void bridge.stop().finally(() => process.exit(0));
process.stdin.on('close', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
