// The port range lives in one place: src/shared/protocol.ts. The plugin panel
// (ui.html) and the Figma manifest must list exactly the same ports, or the
// plugin cannot reach the server on a fallback port.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DEFAULT_PORT, DEFAULT_PORT_RANGE } from '../src/shared/protocol';

const ROOT = join(__dirname, '..');
const EXPECTED = Array.from({ length: DEFAULT_PORT_RANGE }, (_, i) => DEFAULT_PORT + i);

function readUiPorts(): number[] {
  const html = readFileSync(join(ROOT, 'ui.html'), 'utf8');
  const block = html.match(/\/\* @ports-start \*\/([\s\S]*?)\/\* @ports-end \*\//);
  expect(block, 'ui.html is missing the /* @ports-start */ … /* @ports-end */ marker').toBeTruthy();
  const array = block![1].match(/(\[[^\]]*\])/);
  expect(array, 'the ports marker does not contain a port array').toBeTruthy();
  return JSON.parse(array![1]) as number[];
}

function readDevDomains(): string[] {
  const manifest = JSON.parse(readFileSync(join(ROOT, 'manifest.json'), 'utf8')) as {
    networkAccess?: { devAllowedDomains?: string[] };
  };
  return manifest.networkAccess?.devAllowedDomains ?? [];
}

describe('port range consistency', () => {
  it('injects the protocol port range into ui.html', () => {
    expect(readUiPorts()).toEqual(EXPECTED);
  });

  it('lists every port of the range in the manifest', () => {
    const domains = readDevDomains();
    for (const port of EXPECTED) {
      expect(domains, `manifest.json is missing ws://localhost:${port}`).toContain(`ws://localhost:${port}`);
    }
  });

  it('does not list ports outside the range in the manifest', () => {
    const entries = readDevDomains().filter((d) => /^wss?:\/\/localhost:\d+$/.test(d));
    expect(entries).toHaveLength(DEFAULT_PORT_RANGE);
    expect(entries.map((e) => Number(e.split(':').pop()))).toEqual(EXPECTED);
  });
});
