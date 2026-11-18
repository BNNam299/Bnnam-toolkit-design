# AGENTS.md

## Commands
- `npm install` then `npm run build` (builds `code.js` + `dist/server.mjs`). Targeted: `npm run build:plugin`, `npm run build:server`; `npm run watch` rebuilds `code.js` only.
- Verify: `npm run typecheck` (two projects: `tsconfig.json` plugin + `tsconfig.server.json`), `npm run lint`, `npm test` (`vitest run`). Always `npm run build` before `npm test` — e2e/smoke tests run against `dist/` and `code.js`.
- Single test: `npx vitest run tests/<name>.test.ts` (e.g. `tokens`, `bridge`, `hub`, `mcp.e2e`, `plugin.smoke`).

## Architecture
- `src/shared/` — single source of truth: `protocol.ts` (ports, wire messages), `schemas.ts` (zod input for every MCP tool / render_tree DSL), pure helpers (`tokens.ts`, `audit.ts`, `values.ts`, `color.ts`). Change schema/protocol here, not in callers.
- `src/plugin/` — Figma sandbox (`main.ts` = serialized command dispatcher → `commands/`; `apply.ts`/`serialize.ts`/`paints.ts`/`fonts.ts`). Built IIFE `es2017` → `code.js` (gitignored).
- `src/server/` — MCP stdio server (`index.ts` registers tools, delegates to `bridge.request`) + `bridge.ts` (WebSocket hub) + `images.ts` (URL/local `src` → inline base64 before sending to plugin). Built ESM `node20`, `packages: external` → `dist/server.mjs`.
- `ui.html` — plugin panel, served from disk (not bundled). `scripts/build.mjs` injects `PORTS` into the `/* @ports-start */` block from `DEFAULT_PORT`/`DEFAULT_PORT_RANGE`; never hand-edit that block.
- Flow: MCP client (stdio) → `dist/server.mjs` → WS `ws://localhost:3155` → `ui.html` → `postMessage` → `code.js` (figma API).

## Code Style
- No comments in code: do not write `//`, `/* */`, `<!-- -->`, or JSDoc comments in source files (`src/`, `tests/`, `scripts/`, `ui.html`, `eslint.config.js`). Express intent through names and structure instead.
- Exceptions (functional, must stay): `#!/usr/bin/env node` shebangs, `eslint-disable` directives, and the `/* @ports-start */ … /* @ports-end */` marker block in `ui.html` (used by `scripts/build.mjs`).

## Gotchas
- Stdout belongs to MCP: server must log to stderr only.
- Version stamp: bump `version` in `package.json` on plugin changes; build stamps version+commit into both bundles. `figma_status` warns on mismatch → fix is rebuild + close/reopen plugin in Figma. After editing `manifest.json` (e.g. `devAllowedDomains` ports), re-import the plugin in Figma.
- Hub mode is default: first server binds `3155`, later servers join as agents. `FIGMA_AGENT_HUB=0` restores one-port-per-server. Env: `FIGMA_AGENT_TOKEN` / `FIGMA_AGENT_PORT` (def 3155; port file `~/.figma-agent/port-design`) / `FIGMA_AGENT_PORT_RANGE` (def 21) / `FIGMA_AGENT_PORT_FILE` / `FIGMA_AGENT_MANIFEST` / `FIGMA_AGENT_MAX_OUTPUT` (def 20000). Token file `~/.figma-agent/token` (mode 600); tests must override `FIGMA_AGENT_PORT_FILE`.
- Tool wrapper auto-adds `file` + `page` params — don't add them to `S.*Input` in `src/shared/schemas.ts`. `export_assets`/`export_tokens{path}`/`import_tokens{path}` require absolute paths; server writes files itself.
- `execute_code` cannot be interrupted: an infinite loop kills the plugin sandbox and requires relaunching the plugin (server/bridge survive). Timeouts only stop the MCP wait.
- Manual canvas testing can't run in CI: after touching `src/plugin/`, follow `TESTING.md` checklist in Figma desktop (render_tree DSL quirks, 1-mode collection limit, `setValueForMode` not `setValueByMode`, no `figma.util.solid` — use `h.solid`). `examples/fintech-wallet.json` pastes into the panel's dev-mode test box.
- FigJam: `manifest.json` `editorType` includes `figjam` — editing it requires plugin re-import. FigJam text lives on sublayers (`setSublayerText`), never `TextNode`; `SHAPE_WITH_TEXT.cornerRadius` is readonly; caps vocabulary has no `ARROW` (use `ARROW_EQUILATERAL`); `{var}`/`{style}` rejected in FigJam. Verify on a scratch FigJam board per `TESTING.md` §J.
