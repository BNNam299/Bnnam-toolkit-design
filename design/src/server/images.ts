// The plugin sandbox has no network access, so the server resolves image
// sources (URL, data: URI, local path) to base64 before forwarding.
import { readFile } from 'node:fs/promises';
import { isAbsolute } from 'node:path';

const MAX_BYTES = 20 * 1024 * 1024;

export async function loadImageBase64(src: string): Promise<string> {
  if (src.startsWith('data:')) {
    const comma = src.indexOf(',');
    if (comma < 0) throw new Error('Malformed data: URI.');
    const meta = src.slice(5, comma);
    const body = src.slice(comma + 1);
    return meta.endsWith(';base64') ? body : Buffer.from(decodeURIComponent(body)).toString('base64');
  }
  if (/^https?:\/\//i.test(src)) {
    const res = await fetch(src, { redirect: 'follow' });
    if (!res.ok) throw new Error(`Image download failed (${res.status}) for ${src}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > MAX_BYTES) throw new Error(`Image is larger than 20 MB: ${src}`);
    return buf.toString('base64');
  }
  if (isAbsolute(src)) return (await readFile(src)).toString('base64');
  throw new Error(`Unsupported image source "${src}". Use an http(s) URL, data: URI or absolute path.`);
}

// Walks any JSON value and replaces { image: src } paints and
// { type: 'image', src } nodes with base64 data, fetching each source once.
export async function inlineImages<T>(value: T): Promise<T> {
  const cache = new Map<string, Promise<string>>();
  const load = (src: string) => {
    let p = cache.get(src);
    if (!p) {
      p = loadImageBase64(src);
      cache.set(src, p);
    }
    return p;
  };

  const walk = async (v: unknown): Promise<unknown> => {
    if (Array.isArray(v)) return Promise.all(v.map(walk));
    if (!v || typeof v !== 'object') return v;
    const obj = v as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(obj)) out[k] = await walk(x);
    if (typeof obj.image === 'string' && !obj.image.startsWith('hash:')) {
      out.imageBase64 = await load(obj.image);
      delete out.image;
    }
    if (obj.type === 'image' && typeof obj.src === 'string') {
      out.imageBase64 = await load(obj.src);
      delete out.src;
    }
    return out;
  };
  return (await walk(value)) as T;
}
