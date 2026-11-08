"""Compare two kit snapshots (scripts/kit-snapshot.js) — what the project changed vs the base kit (references/kit-setup.md).

Standard library only. Outputs markdown: ADDED / REMOVED / CHANGED for variables (value per mode, alias, scope, description), text styles,
components (variant count, properties) + a NEEDS REVIEW flag when a change can break places in use (removed variables, changed types,
removed properties / variants).

  python kit_diff.py <kit-goc.json> <kit-du-an.json> [--out design/kit/chenh-lech.md]
"""
import json
import sys


def key_vars(snap):
    out = {}
    for c in snap.get("collections", []):
        for v in c.get("variables", []):
            out[f"{c['name']}/{v['name']}"] = v
    return out


def show(v):
    return json.dumps(v, ensure_ascii=False) if isinstance(v, (dict, list)) else str(v)


def diff(a, b):
    L, risk = [], []
    va, vb = key_vars(a), key_vars(b)
    add = sorted(set(vb) - set(va)); rem = sorted(set(va) - set(vb)); mod = []
    for k in sorted(set(va) & set(vb)):
        x, y = va[k], vb[k]
        ch = []
        if x.get("$type") != y.get("$type"):
            ch.append(f"type {x.get('$type')} → {y.get('$type')}"); risk.append(f"variable `{k}` changed type — places bound to it may break")
        for m in sorted(set(x.get("$value", {})) | set(y.get("$value", {}))):
            p, q = x.get("$value", {}).get(m), y.get("$value", {}).get(m)
            if p != q:
                ch.append(f"{m}: {show(p)} → {show(q)}")
        if sorted(x.get("scopes", [])) != sorted(y.get("scopes", [])):
            ch.append(f"scope {','.join(x.get('scopes', [])) or 'empty'} → {','.join(y.get('scopes', [])) or 'empty'}")
        if x.get("$description", "") != y.get("$description", ""):
            ch.append("description")
        if ch:
            mod.append((k, ch))
    for k in rem:
        risk.append(f"variable `{k}` removed — instances / screens bound to it lose the link")
    for k, v in vb.items():                                              # aliases pointing at a variable missing from the new snapshot
        for m, val in (v.get("$value") or {}).items():
            if isinstance(val, dict) and "$alias" in val and val["$alias"] not in vb:
                risk.append(f"`{k}` · {m} points at `{val['$alias']}` — that variable no longer exists (broken alias)")
    ma = {m for c in a.get("collections", []) for m in [f"{c['name']}:{x}" for x in c.get("modes", [])]}
    mb = {m for c in b.get("collections", []) for m in [f"{c['name']}:{x}" for x in c.get("modes", [])]}
    L.append(f"# Kit diff — `{a.get('file', '?')}` → `{b.get('file', '?')}`\n")
    L.append(f"Variables: **+{len(add)} · −{len(rem)} · ~{len(mod)}** · modes: +{len(mb - ma)} · −{len(ma - mb)}\n")
    if mb - ma or ma - mb:
        L.append("## Modes\n" + "".join(f"- + `{m}`\n" for m in sorted(mb - ma)) + "".join(f"- − `{m}`\n" for m in sorted(ma - mb)))
    if add:
        L.append("## Variables added\n" + "".join(f"- `{k}` · {vb[k].get('$type')} · {show(vb[k].get('$value'))}\n" for k in add))
    if rem:
        L.append("## Variables removed\n" + "".join(f"- `{k}`\n" for k in rem))
    if mod:
        L.append("## Variables changed\n" + "".join(f"- `{k}` — " + " · ".join(ch) + "\n" for k, ch in mod))
    # text styles
    sa = {s["name"]: s for s in a.get("textStyles", [])}; sb = {s["name"]: s for s in b.get("textStyles", [])}
    smod = [(k, [f"{f}: {sa[k].get(f)} → {sb[k].get(f)}" for f in ("font", "size", "lineHeight", "letterSpacing") if sa[k].get(f) != sb[k].get(f)]) for k in sorted(set(sa) & set(sb))]
    smod = [x for x in smod if x[1]]
    if set(sb) - set(sa) or set(sa) - set(sb) or smod:
        L.append("## Text styles\n" + "".join(f"- + `{k}`\n" for k in sorted(set(sb) - set(sa))) + "".join(f"- − `{k}`\n" for k in sorted(set(sa) - set(sb)))
                 + "".join(f"- ~ `{k}` — " + " · ".join(ch) + "\n" for k, ch in smod))
        risk += [f"text style `{k}` removed" for k in sorted(set(sa) - set(sb))]
    # components
    ca = {c["name"]: c for c in a.get("components", [])}; cb = {c["name"]: c for c in b.get("components", [])}
    cmod = []
    for k in sorted(set(ca) & set(cb)):
        x, y = ca[k], cb[k]; ch = []
        if x.get("variants") != y.get("variants"):
            ch.append(f"variants {x.get('variants')} → {y.get('variants')}")
        px, py = x.get("properties", {}), y.get("properties", {})
        for p in sorted(set(px) - set(py)):
            ch.append(f"removed property `{p}`"); risk.append(f"component `{k}` removed property `{p}` — instances in use lose their override")
        for p in sorted(set(py) - set(px)):
            ch.append(f"added property `{p}`")
        for p in sorted(set(px) & set(py)):
            ox, oy = set(px[p].get("options") or []), set(py[p].get("options") or [])
            if ox - oy:
                ch.append(f"`{p}` removed {', '.join(sorted(ox - oy))}"); risk.append(f"component `{k}` removed variant `{p}={', '.join(sorted(ox - oy))}`")
            if oy - ox:
                ch.append(f"`{p}` added {', '.join(sorted(oy - ox))}")
        if ch:
            cmod.append((k, ch))
    if set(cb) - set(ca) or set(ca) - set(cb) or cmod:
        L.append("## Components\n" + "".join(f"- + `{k}`\n" for k in sorted(set(cb) - set(ca))) + "".join(f"- − `{k}`\n" for k in sorted(set(ca) - set(cb)))
                 + "".join(f"- ~ `{k}` — " + " · ".join(ch) + "\n" for k, ch in cmod))
        risk += [f"component `{k}` removed" for k in sorted(set(ca) - set(cb))]
    if risk:
        L.append("## NEEDS REVIEW — may break places in use\n" + "".join(f"- {r}\n" for r in risk))
    L.append(f"\nBack to the base kit: pick which rows are worth keeping for the next project — the designer decides (`references/kit-setup.md` §8).\n")
    return "\n".join(L)


def main(a):
    if len(a) < 2:
        sys.exit(__doc__)
    A = json.load(open(a[0], encoding="utf-8")); B = json.load(open(a[1], encoding="utf-8"))
    md = diff(A, B)
    if "--out" in a:
        open(a[a.index("--out") + 1], "w", encoding="utf-8").write(md)
    print(md)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main(sys.argv[1:])
