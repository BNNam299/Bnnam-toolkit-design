// Ranking for `search_design_system` (figma-ui-flow rule #3: search before you
// create). Pure so the scoring stays unit-testable; the plugin feeds it names.

// Lowercase, strip Vietnamese diacritics and split on the separators Figma
// names use: "Button/Primary", "color/text/primary", "Size=md, State=Default".
export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .trim();
}

export const tokensOf = (s: string): string[] => normalize(s).split(/[\s/=,._-]+/).filter(Boolean);

// 100 exact · 90 last segment exact · 80 prefix · 60 every query word is a
// segment · 40 every query word is a substring · 20 subsequence · 0 no match.
export function scoreName(query: string, name: string): number {
  const q = normalize(query);
  const n = normalize(name);
  if (!q) return 1;
  if (n === q) return 100;
  const segments = n.split('/');
  if (segments[segments.length - 1] === q) return 90;
  if (n.startsWith(q)) return 80;
  const words = tokensOf(query);
  const parts = tokensOf(name);
  if (words.every((w) => parts.includes(w))) return 60;
  if (words.every((w) => n.includes(w))) return 40;
  let i = 0;
  for (const ch of n) if (ch === q[i]) i++;
  return i === q.length ? 20 : 0;
}

export function rank<T extends { name: string }>(query: string, items: T[], limit = 20): (T & { score: number })[] {
  return items
    .map((item) => ({ ...item, score: scoreName(query, item.name) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.name.length - b.name.length || a.name.localeCompare(b.name))
    .slice(0, limit);
}
