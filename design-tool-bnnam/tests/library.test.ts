import { afterEach, describe, expect, it, vi } from 'vitest';
import { remoteInUse } from '../src/plugin/library';
import { Resources } from '../src/plugin/resources';

const KEY = (c: string) => c.repeat(40);

const labelVar = { id: 'VariableID:lbl/1:1', key: KEY('a'), name: 'Labels/Primary', remote: true, resolvedType: 'COLOR', variableCollectionId: 'C:lib' };
const headline = { id: 'S:hl,1:2', key: KEY('b'), name: 'Headline/Regular', type: 'TEXT', remote: true };
const privateVariant = { type: 'COMPONENT', key: KEY('c'), name: 'Mode=Light', remote: true };
const privateSet = { type: 'COMPONENT_SET', key: KEY('d'), name: '_Button - Symbol', remote: true, children: [privateVariant] };
const statusSet = { type: 'COMPONENT_SET', key: KEY('e'), name: 'Status bar', remote: true, children: [] };

function nodes() {
  const variantMain = { ...privateVariant, parent: privateSet };
  const statusMain = { type: 'COMPONENT', key: KEY('f'), name: 'Type=Horizontal', remote: true, parent: statusSet };
  return [
    { type: 'TEXT', textStyleId: headline.id, boundVariables: { fills: [{ type: 'VARIABLE_ALIAS', id: labelVar.id }] } },
    { type: 'INSTANCE', getMainComponentAsync: async () => variantMain },
    { type: 'INSTANCE', getMainComponentAsync: async () => statusMain },
    { type: 'FRAME', fillStyleId: '' },
  ];
}

function stub(extra: Record<string, unknown> = {}) {
  const page = { findAll: () => nodes(), findAllWithCriteria: () => [] };
  const figma = {
    currentPage: page,
    root: { findAllWithCriteria: () => [] },
    loadAllPagesAsync: async () => {},
    getNodeByIdAsync: async () => null,
    variables: {
      getLocalVariablesAsync: async () => [],
      getLocalVariableCollectionsAsync: async () => [],
      getVariableByIdAsync: async (id: string) => (id === labelVar.id ? labelVar : null),
      importVariableByKeyAsync: vi.fn(async (key: string) => ({ ...labelVar, key, name: `imported ${key.slice(0, 2)}` })),
    },
    teamLibrary: {
      getAvailableLibraryVariableCollectionsAsync: async () => [{ key: 'lc', name: 'Colors', libraryName: 'iOS 26' }],
      getVariablesInLibraryCollectionAsync: async () => [{ key: KEY('9'), name: 'Fills/Tertiary', resolvedType: 'COLOR' }],
    },
    getLocalPaintStylesAsync: async () => [],
    getLocalTextStylesAsync: async () => [],
    getStyleByIdAsync: async (id: string) => (id === headline.id ? headline : null),
    importStyleByKeyAsync: vi.fn(async (key: string) => (key === KEY('b') ? headline : { ...headline, type: 'PAINT', key })),
    importComponentByKeyAsync: vi.fn(async (key: string) => {
      throw new Error(`Could not find a published component with the key "${key}"`);
    }),
    importComponentSetByKeyAsync: vi.fn(async () => {
      throw new Error('component set not found');
    }),
    ...extra,
  };
  vi.stubGlobal('figma', figma);
  return figma;
}

afterEach(() => vi.unstubAllGlobals());

describe('remoteInUse', () => {
  it('collects library variables, styles and components bound on the page', async () => {
    stub();
    const r = await remoteInUse();
    expect(r.variables.map((v) => v.name)).toEqual(['Labels/Primary']);
    expect(r.styles.map((s) => s.name)).toEqual(['Headline/Regular']);
    expect(r.components.map((c) => c.name)).toEqual(['_Button - Symbol', 'Status bar']);
  });
});

describe('Resources with library assets', () => {
  it('binds a library variable used on the page by name, without importing', async () => {
    const figma = stub();
    expect(await new Resources().variable('Labels/Primary')).toBe(labelVar);
    expect(figma.variables.importVariableByKeyAsync).not.toHaveBeenCalled();
  });

  it('imports a library variable by key, and one of an enabled library by name', async () => {
    const figma = stub();
    const res = new Resources();
    expect((await res.variable(KEY('7'))).key).toBe(KEY('7'));
    expect((await res.variable('Colors/Fills/Tertiary')).key).toBe(KEY('9'));
    expect(figma.variables.importVariableByKeyAsync).toHaveBeenCalledTimes(2);
  });

  it('lists the library variables used on the page when a name is unknown', async () => {
    stub();
    await expect(new Resources().variable('nope')).rejects.toThrow(/Library variables used on this page: Labels\/Primary/);
  });

  it('finds a library text style by name, id or key and checks its type', async () => {
    stub();
    const res = new Resources();
    expect(await res.textStyle('Headline/Regular')).toBe(headline);
    expect(await res.textStyle(headline.id)).toBe(headline);
    expect(await res.textStyle(KEY('b'))).toBe(headline);
    await expect(res.textStyle(KEY('8'))).rejects.toThrow(/is a paint style, not a text style/);
    await expect(res.paintStyle('Headline/Regular')).rejects.toThrow(/No paint style/);
  });

  it('keeps the component import error and flags private library components', async () => {
    stub();
    await expect(new Resources().component(KEY('c'))).rejects.toThrow(
      /Could not find a published component.*"_Button - Symbol" starts with "_"/,
    );
  });

  it('uses a library component already on the page by name', async () => {
    stub();
    expect(await new Resources().component('Status bar')).toMatchObject({ key: KEY('e') });
  });
});
