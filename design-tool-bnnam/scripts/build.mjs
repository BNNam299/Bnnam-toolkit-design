#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { build, context } from 'esbuild';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

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
  __BRIDGE_TOKEN__: JSON.stringify(
    process.env.FIGMA_AGENT_TOKEN?.trim() ||
      (() => {
        try {
          return readFileSync(`${homedir()}/.figma-agent/token`, 'utf8').trim();
        } catch {
          return '';
        }
      })(),
  ),
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
