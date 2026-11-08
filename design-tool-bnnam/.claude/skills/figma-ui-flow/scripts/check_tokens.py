#!/usr/bin/env python3
"""
check_tokens.py — Lint a design-token JSON file before importing it into Figma or handing it to developers.

Supported format: W3C Design Tokens (DTCG) — a token is an object with "$value" (and optional "$type"),
nested groups, aliases like "{color.blue.600}". Modes are declared in
"$extensions": {"modes": {"light": <value>, "dark": <value>}}.

Checks:
  1. Names: every name segment is lowercase letters, digits and hyphens (kebab-case).
  2. Aliases: point to an existing token, no cycles.
  3. Tiers: a root group whose name contains "primitive" holds raw values only;
     a root group whose name contains "semantic" should hold aliases (warning on raw values).
  4. Spacing/radius: numeric values sit on the 4-pt grid (0, 1, 2 and 999 allowed).
  5. WCAG contrast for inferred pairs (text/icon/on-action against backgrounds) and pairs given with --pair.

Usage:
  python3 check_tokens.py tokens.json
  python3 check_tokens.py tokens.json --pair color.text.primary color.bg.default 4.5
  python3 check_tokens.py tokens.json --json      # print the result as JSON

Exit code: 0 = no errors (warnings allowed), 1 = errors.
"""
import argparse
import json
import re
import sys

NAME_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
ALIAS_RE = re.compile(r"^\{([^{}]+)\}$")
HEX_RE = re.compile(r"^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$")


def flatten(node, path, out):
    """Return a dict: 'a.b.c' -> token object."""
    if isinstance(node, dict) and "$value" in node:
        out[".".join(path)] = node
        return
    if isinstance(node, dict):
        for k, v in node.items():
            if k.startswith("$"):
                continue
            flatten(v, path + [k], out)


def mode_values(token):
    """Return a dict mode -> value; {'default': $value} when there are no modes."""
    modes = (token.get("$extensions") or {}).get("modes")
    if isinstance(modes, dict) and modes:
        return dict(modes)
    return {"default": token["$value"]}


def resolve(name, mode, tokens, stack=None):
    stack = stack or []
    if name in stack:
        raise ValueError("alias cycle: " + " → ".join(stack + [name]))
    if name not in tokens:
        raise KeyError(name)
    vals = mode_values(tokens[name])
    v = vals.get(mode, vals.get("default", tokens[name]["$value"]))
    m = ALIAS_RE.match(v) if isinstance(v, str) else None
    if m:
        return resolve(m.group(1), mode, tokens, stack + [name])
    return v


def hex_to_rgb(h):
    h = h.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def luminance(rgb):
    def ch(c):
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (ch(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a, b):
    la, lb = luminance(hex_to_rgb(a)), luminance(hex_to_rgb(b))
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def tier_of(name):
    root = name.split(".")[0].lower()
    if "primitive" in root:
        return "primitive"
    if "semantic" in root:
        return "semantic"
    return None


def strip_tier(name):
    parts = name.split(".")
    return ".".join(parts[1:]) if tier_of(name) else name


def auto_pairs(tokens):
    """Infer (fg, bg, threshold) pairs from semantic names."""
    by_short = {strip_tier(n): n for n in tokens}
    bgs = [by_short[s] for s in ("color.bg.default", "color.surface.default", "color.surface.raised") if s in by_short]
    pairs = []
    for short, full in by_short.items():
        if short.startswith("color.text.") and not short.endswith(("disabled", "inverse", "on-action")):
            pairs += [(full, bg, 4.5) for bg in bgs]
        elif short.startswith("color.icon.") and not short.endswith(("disabled", "inverse")):
            pairs += [(full, bg, 3.0) for bg in bgs]
        elif short in ("color.border.strong", "color.border.focus"):
            pairs += [(full, bg, 3.0) for bg in bgs]
    on_action = by_short.get("color.text.on-action")
    for s in ("color.action.primary", "color.action.destructive"):
        if on_action and s in by_short:
            pairs.append((on_action, by_short[s], 4.5))
    return pairs


def main():
    ap = argparse.ArgumentParser(description="Lint a design-token JSON file (DTCG).")
    ap.add_argument("file")
    ap.add_argument("--pair", nargs=3, action="append", metavar=("FG", "BG", "MIN"),
                    help="extra contrast pair to check, e.g. color.text.primary color.bg.default 4.5")
    ap.add_argument("--json", action="store_true", help="print the result as JSON")
    args = ap.parse_args()

    with open(args.file, encoding="utf-8") as f:
        data = json.load(f)

    tokens = {}
    flatten(data, [], tokens)
    errors, warnings, passes = [], [], []

    if not tokens:
        errors.append("No token with \"$value\" found.")

    all_modes = set()
    for t in tokens.values():
        all_modes.update(mode_values(t).keys())

    for name, tok in tokens.items():
        # 1. Names
        bad = [p for p in name.split(".") if not NAME_RE.match(p)]
        if bad:
            errors.append(f"[name] {name}: invalid segment(s) {bad} (use lowercase kebab-case)")

        vals = mode_values(tok)
        tier = tier_of(name)
        for mode, v in vals.items():
            is_alias = isinstance(v, str) and ALIAS_RE.match(v)
            # 2. Alias
            if is_alias:
                try:
                    resolve(name, mode, tokens)
                except KeyError as e:
                    errors.append(f"[alias] {name} ({mode}): points to a missing token {e}")
                    continue
                except ValueError as e:
                    errors.append(f"[alias] {name} ({mode}): {e}")
                    continue
            # 3. Tiers
            if tier == "primitive" and is_alias:
                errors.append(f"[tier] {name}: a primitive must not be an alias")
            if tier == "semantic" and not is_alias:
                warnings.append(f"[tier] {name} ({mode}): semantic should alias a primitive, got raw value {v!r}")

        # Missing modes
        if len(vals) > 1 or "default" not in vals:
            missing = (all_modes - {"default"}) - set(vals)
            if missing:
                warnings.append(f"[mode] {name}: missing value for mode(s) {sorted(missing)}")

        # 4. 4-pt grid
        short = strip_tier(name)
        if short.split(".")[0] in ("space", "spacing", "radius"):
            for mode in vals:
                try:
                    v = resolve(name, mode, tokens)
                except (KeyError, ValueError):
                    continue
                num = None
                if isinstance(v, (int, float)):
                    num = v
                elif isinstance(v, str):
                    m = re.match(r"^(-?\d+(\.\d+)?)(px)?$", v.strip())
                    if m:
                        num = float(m.group(1))
                if num is not None and num not in (0, 1, 2, 999) and num % 4 != 0:
                    warnings.append(f"[grid] {name} = {v}: not on the 4-pt grid")

    # 5. Contrast
    pairs = auto_pairs(tokens)
    for fg, bg, mn in (args.pair or []):
        pairs.append((fg, bg, float(mn)))
    modes_to_check = sorted(all_modes - {"default"}) or ["default"]
    seen = set()
    for fg, bg, mn in pairs:
        for mode in modes_to_check:
            key = (fg, bg, mode)
            if key in seen:
                continue
            seen.add(key)
            try:
                a, b = resolve(fg, mode, tokens), resolve(bg, mode, tokens)
            except (KeyError, ValueError) as e:
                errors.append(f"[contrast] {fg} / {bg} ({mode}): cannot resolve token {e}")
                continue
            if not (isinstance(a, str) and HEX_RE.match(a) and isinstance(b, str) and HEX_RE.match(b)):
                warnings.append(f"[contrast] {fg} / {bg} ({mode}): skipped, only hex is supported ({a!r}, {b!r})")
                continue
            r = contrast(a, b)
            line = f"{fg} on {bg} ({mode}): {r:.2f}:1 (needs ≥ {mn})"
            (passes if r >= mn else errors).append(("[contrast] " if r < mn else "") + line)

    result = {"tokens": len(tokens), "modes": sorted(all_modes),
              "errors": errors, "warnings": warnings, "contrast_pass": passes}
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(f"Token: {len(tokens)} · Modes: {', '.join(sorted(all_modes))}")
        print(f"\nERRORS ({len(errors)}):")
        for e in errors:
            print("  ✗", e)
        print(f"\nWARNINGS ({len(warnings)}):")
        for w in warnings:
            print("  !", w)
        print(f"\nCONTRAST PASSED ({len(passes)}):")
        for p in passes:
            print("  ✓", p)
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
