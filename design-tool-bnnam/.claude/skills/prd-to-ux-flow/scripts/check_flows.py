#!/usr/bin/env python3
"""check_flows.py — the mechanical half of the cross-check in references/ux-flow.md §14, run before asking for "approve flows".

Python standard library only. Read-only: prints problems, never edits flows.md.

    python <skill>/scripts/check_flows.py design/flows.md                     # flows.md alone
    python <skill>/scripts/check_flows.py design/flows.md --prd design/prd.md # + every FR has a screen

Checks
  errors   · a flow step that is not a screen heading under ## Screens (exact match)
           · a screen that appears in no flow's `sequence` (orphan)
           · two screen headings with the same name
           · an FR in prd.md that no screen `answers` (with --prd)
           · an app-wide situation without `user sees`, or whose `how the app knows` has no A-##
           · a permission overlay (screen type "system alert — permission") whose notes carry neither popup text quoted
             from the PRD nor a "draft" mark
  warnings · `entered from` / `leads to` naming something that looks like a screen (has - or _) but is not one
           · a screen with empty `entered from` or `leads to` and no reason in notes
           · an A-## used in a screen or situation but missing under ## Technical assumptions

How `sequence` is read (references/ux-flow.md §13): steps joined by → · "·" starts another branch · text in (parentheses) is a
comment · a short label ending in ":" before a branch ("denied:") is ignored.

Exit code 1 when there is at least one error — the agent fixes flows.md and runs it again.
"""
import re, sys, argparse
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

FIELD = re.compile(r"^\s*-\s*([a-zA-Z][a-zA-Z /]*?):\s*(.*)$")
LOOKS_LIKE_SCREEN = re.compile(r"^[A-Z][\w ]*(?:[-_][\w ]+)+$")
SITUATION_REF = re.compile(r"\bAW-\d+\b|^App-wide\b")


def section(text, name):
    m = re.search(r"^## " + re.escape(name) + r"\s*$", text, re.M)
    if not m:
        return ""
    rest = text[m.end():]
    n = re.search(r"^## ", rest, re.M)
    return rest[: n.start()] if n else rest


def entries(block):
    out, cur = [], None
    for line in block.splitlines():
        h = re.match(r"^### (.+?)\s*$", line)
        if h:
            cur = {"name": h.group(1), "fields": {}, "raw": ""}
            out.append(cur)
            continue
        if cur is None:
            continue
        line = re.sub(r"\s+#\s.*$", "", line)
        cur["raw"] += line + "\n"
        for part in re.split(r"\s+·\s+(?=[a-z][a-z /]*?:\s)", line.strip().lstrip("- ")):
            f = FIELD.match("- " + part)
            if f:
                cur["fields"].setdefault(f.group(1).strip().lower(), f.group(2).strip())
    return out


def steps_of(seq):
    seq = re.sub(r"\([^)]*\)", " ", seq)
    seq = re.sub(r"(?:^|·)\s*[^·→:]{1,40}:\s", "· ", seq)
    return [s.strip() for s in re.split(r"→|·", seq) if s.strip()]


def items_of(value):
    value = re.sub(r"\([^)]*\)", " ", value)
    return [s.strip() for s in re.split(r"·|,|;|\bor\b|\bhoặc\b", value) if s.strip()]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("flows")
    ap.add_argument("--prd")
    a = ap.parse_args()
    text = open(a.flows, encoding="utf-8").read()
    errors, warnings = [], []

    screens = entries(section(text, "Screens"))
    names = [s["name"] for s in screens]
    seen = set()
    for n in names:
        if n in seen:
            errors.append(f"duplicate screen name: {n}")
        seen.add(n)
    nameset = set(names)

    in_flow = set()
    for fl in entries(section(text, "Flows")):
        seq = fl["fields"].get("sequence", "")
        if not seq:
            errors.append(f"flow without sequence: {fl['name']}")
        for st in steps_of(seq):
            if st in nameset:
                in_flow.add(st)
            else:
                errors.append(f"flow '{fl['name']}' step is not a screen: {st}")
    for n in names:
        if n not in in_flow:
            errors.append(f"screen in no flow (orphan): {n}")

    used_a = set()
    for s in screens:
        f, raw = s["fields"], s["raw"]
        used_a |= set(re.findall(r"\bA-\d+\b", raw))
        notes = f.get("notes", "")
        for key in ("entered from", "leads to"):
            v = f.get(key, "")
            if v in ("", "—", "-") and "no " + key not in notes.lower():
                warnings.append(f"{s['name']}: empty '{key}' without a reason in notes")
            for it in items_of(v):
                if LOOKS_LIKE_SCREEN.match(it) and it not in nameset and not SITUATION_REF.search(it):
                    warnings.append(f"{s['name']}: '{key}' names '{it}', which is not a screen")
        if "system alert — permission" in f.get("screen type", "") and "denied" not in f.get("screen type", ""):
            if not re.search(r"[\"“«][^\"”»]{8,}[\"”»]", raw) and "draft" not in raw.lower() and "nháp" not in raw.lower():
                errors.append(f"{s['name']}: permission popup without PRD text or a draft mark")

    for sit in entries(section(text, "App-wide situations")):
        f, raw = sit["fields"], sit["raw"]
        used_a |= set(re.findall(r"\bA-\d+\b", raw))
        if f.get("user sees", "") in ("", "—"):
            errors.append(f"app-wide situation without 'user sees': {sit['name']}")
        if not re.search(r"\bA-\d+\b", f.get("how the app knows", "")):
            errors.append(f"app-wide situation without an A-## in 'how the app knows': {sit['name']}")

    declared = {re.match(r"(A-\d+)", e["name"]).group(1) for e in entries(section(text, "Technical assumptions"))
                if re.match(r"A-\d+", e["name"])}
    for x in sorted(used_a - declared, key=lambda v: int(v[2:])):
        warnings.append(f"{x} is used but not listed under ## Technical assumptions")

    if a.prd:
        prd = open(a.prd, encoding="utf-8").read()
        frs = set(re.findall(r"^### (FR-\d+)", prd, re.M))
        answered = set()
        for s in screens:
            answered |= set(re.findall(r"FR-\d+", s["fields"].get("answers", "") + " " + s["raw"]))
        for fr in sorted(frs - answered):
            errors.append(f"{fr} has no screen (no 'answers' names it)")

    for e in errors:
        print("ERROR   " + e)
    for w in warnings:
        print("warning " + w)
    print(f"✓ {len(names)} screens · {len(in_flow)} in flows · {len(errors)} errors · {len(warnings)} warnings")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
