#!/usr/bin/env node
// Builds the plugin bundle and/or the MCP server, stamping each with the
// package version and the current git commit so the Figma panel and
// `figma_status` can tell a new build from a stale one.
//
//   node scripts/build.mjs all
//   node scripts/build.mjs plugin --watch
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { build, context } from 'esbuild';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

// The plugin panel is served straight from disk by Figma (it is not bundled),
// so the port range it probes has to be injected here. src/shared/protocol.ts
// stays the single source of truth; scripts/build.mjs reads the two constants
// and rewrites the marked block in ui.html.
const protocolSrc = readFileSync(new URL('../src/shared/protocol.ts', import.meta.url), 'utf8');
const readConst = (name) => {
  const m = protocolSrc.match(new RegExp(`${name}\\s*=\\s*(\\d+)`));
  if (!m) throw new Error(`Cannot read ${name} from src/shared/protocol.ts`);
  return Number(m[1]);
};
const PORT = readConst('DEFAULT_PORT');
const PORT_RANGE = readConst('DEFAULT_PORT_RANGE');
const PORTS = Array.from({ length: PORT_RANGE }, (_, i) => PORT + i);

const UI_PATH = new URL('../ui.html', import.meta.url);
const PORTS_MARKER = /\/\* @ports-start \*\/[\s\S]*?\/\* @ports-end \*\//;

function injectPorts() {
  const html = readFileSync(UI_PATH, 'utf8');
  const line = `/* @ports-start */const PORTS = ${JSON.stringify(PORTS)};/* @ports-end */`;
  if (!PORTS_MARKER.test(html)) {
    throw new Error('ui.html is missing the /* @ports-start */ … /* @ports-end */ marker block.');
  }
  const next = html.replace(PORTS_MARKER, line);
  if (next !== html) writeFileSync(UI_PATH, next);
  return next !== html;
}
const git = (cmd, fallback) => {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || fallback;
  } catch {
    return fallback;
  }
};
const sha = git('git rev-parse --short HEAD', 'dev');
const dirty = git('git status --porcelain', '') ? '+dirty' : '';
const buildId = `${sha}${dirty}`;

const define = {
  __PLUGIN_VERSION__: JSON.stringify(pkg.version),
  __PLUGIN_BUILD__: JSON.stringify(buildId),
  __SERVER_VERSION__: JSON.stringify(pkg.version),
  __SERVER_BUILD__: JSON.stringify(buildId),
};

const plugin = {
  entryPoints: ['src/plugin/main.ts'],
  bundle: true,
  format: 'iife',
  target: 'es2017',
  outfile: 'code.js',
  define,
  logLevel: 'info',
};

const server = {
  entryPoints: ['src/server/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  packages: 'external',
  outfile: 'dist/server.mjs',
  define,
  logLevel: 'info',
};

const target = process.argv[2] ?? 'all';
const watch = process.argv.includes('--watch');

const jobs = target === 'all' ? [plugin, server] : target === 'plugin' ? [plugin] : target === 'server' ? [server] : null;
if (!jobs) {
  console.error(`usage: node scripts/build.mjs <all|plugin|server> [--watch]`);
  process.exit(2);
}

// The panel HTML is only needed by the plugin bundle, so a server-only build
// leaves ui.html alone.
if (target === 'plugin' || target === 'all') {
  const portsChanged = injectPorts();
  if (portsChanged) console.error(`injected port range ${PORTS[0]}-${PORTS[PORTS.length - 1]} into ui.html`);
}

if (watch) {
  for (const job of jobs) {
    const ctx = await context(job);
    await ctx.watch();
  }
  console.error(`watching (${target}) · ${buildId}`);
} else {
  await Promise.all(jobs.map((job) => build(job)));
  console.error(`built ${target} · ${pkg.version} (${buildId})`);
}
