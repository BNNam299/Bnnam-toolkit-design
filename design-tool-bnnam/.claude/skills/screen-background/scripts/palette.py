"""Generate a color ramp from one base color — OKLCH (tonal ramps for primitives: even lightness steps, gamut-clamped chroma).

Python standard library only. The anchor numbers are HEURISTIC (AgentsORG CRAFT.md) — the designer reviews the output table;
never write it straight into Figma.

  python palette.py ramp "#2F6BFF" [--steps 50,100,200,300,400,500,600,700,800,900,950] [--light 0.97] [--dark 0.22] [--keep 500]
        → table of step · hex · L C H · contrast against white / black · which step keeps the exact base color
  python palette.py match "#2F6BFF" "#12B76A" "#F79009" …    → sibling ramps with the same L per step (brand, success, warning)
  python palette.py contrast "#FFFFFF" "#2F6BFF"             → WCAG ratio + suggested L shift if < 4.5
  python palette.py dark 50,100,…,950                         → mirrored steps for the Dark mode (50↔950, 200↔800…)
"""
import math
import sys

DEFAULT_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]


# ───────────────────────── color conversion (Björn Ottosson, OKLab)
def _lin(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def _gam(c):
    return 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055


def hex_to_rgb(h):
    h = h.strip().lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def rgb_to_hex(rgb):
    return "#" + "".join(f"{round(max(0, min(1, c)) * 255):02X}" for c in rgb)


def rgb_to_oklch(rgb):
    r, g, b = (_lin(c) for c in rgb)
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l, m, s = (x ** (1 / 3) if x >= 0 else -((-x) ** (1 / 3)) for x in (l, m, s))
    L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
    a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
    bb = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
    return L, math.hypot(a, bb), math.degrees(math.atan2(bb, a)) % 360


def oklch_to_rgb(L, C, H):
    a, b = C * math.cos(math.radians(H)), C * math.sin(math.radians(H))
    l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
    m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
    s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
    r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    return tuple(_gam(x) if x >= 0 else 0.0 for x in (r, g, bl))


def in_gamut(L, C, H):
    a, b = C * math.cos(math.radians(H)), C * math.sin(math.radians(H))
    l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
    m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
    s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
    rgb = (4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
           -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
           -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)
    return all(-1e-4 <= x <= 1 + 1e-4 for x in rgb)


def max_chroma(L, H):
    """chroma ceiling inside sRGB at L, H — binary search. The clamp keeps L and H unchanged (CRAFT)."""
    lo, hi = 0.0, 0.4
    for _ in range(30):
        mid = (lo + hi) / 2
        lo, hi = (mid, hi) if in_gamut(L, mid, H) else (lo, mid)
    return lo


def lum(rgb):
    r, g, b = (_lin(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


# ───────────────────────── ramp
def ramp(base_hex, steps=DEFAULT_STEPS, light=0.97, dark=0.22, keep=None):
    """L spaced evenly from `light` (first step) to `dark` (last step); chroma = share of the gamut ceiling: ~30 % at both ends → ~85 % in
    the middle (CRAFT, heuristic). keep = the step that keeps the exact base color (default: the step whose L is closest to the base)."""
    L0, C0, H = rgb_to_oklch(hex_to_rgb(base_hex))
    n = len(steps)
    Ls = [light + (dark - light) * i / (n - 1) for i in range(n)]
    if keep is None:
        keep = steps[min(range(n), key=lambda i: abs(Ls[i] - L0))]
    k = steps.index(keep)
    # the base color's chroma as a share of the ceiling at its L → keeps the brand's "vividness" in the middle steps
    base_frac = C0 / max(max_chroma(L0, H), 1e-6)
    rows = []
    for i, (st, L) in enumerate(zip(steps, Ls)):
        t = i / (n - 1)
        frac = 0.30 + (0.85 - 0.30) * math.sin(math.pi * t)                     # curve: low at both ends, high in the middle
        frac = min(frac, base_frac * 1.05) if base_frac < 0.85 else frac
        if st == keep:
            L, C = L0, C0                                                          # the base step keeps the exact color the designer gave
        else:
            C = frac * max_chroma(L, H)
        rgb = oklch_to_rgb(L, C, H)
        rows.append({"step": st, "hex": rgb_to_hex(rgb), "L": round(L, 3), "C": round(C, 3), "H": round(H, 1),
                     "white": round(ratio(rgb, (1, 1, 1)), 2), "black": round(ratio(rgb, (0, 0, 0)), 2), "base": st == keep})
    return rows


def show(rows, title):
    print(f"\n{title}")
    print("| step | hex | L | C | H | contrast / white | / black | |")
    print("|---|---|---|---|---|---|---|---|")
    for r in rows:
        print(f"| {r['step']} | `{r['hex']}` | {r['L']} | {r['C']} | {r['H']} | {r['white']} | {r['black']} | {'← base color' if r['base'] else ''} |")


def dark_map(steps):
    """Dark mode: each role points to the mirrored step (50↔950, 200↔800…)"""
    s = sorted(steps)
    return {a: b for a, b in zip(s, reversed(s))}


def main(a):
    if len(a) < 2:
        sys.exit(__doc__)
    opt = lambda k, d=None: a[a.index(k) + 1] if k in a else d
    steps = [int(x) for x in opt("--steps", ",".join(map(str, DEFAULT_STEPS))).split(",")]
    light, dark = float(opt("--light", 0.97)), float(opt("--dark", 0.22))
    if a[0] == "ramp":
        keep = opt("--keep"); keep = int(keep) if keep else None
        show(ramp(a[1], steps, light, dark, keep), f"Ramp from {a[1]} — OKLCH, L {light} → {dark} (CRAFT heuristic, designer reviews)")
    elif a[0] == "match":
        bases = [x for x in a[1:] if x.startswith("#")]
        hues = [rgb_to_oklch(hex_to_rgb(b))[2] for b in bases]
        for b, h in zip(bases, hues):
            near = [x for x, hh in zip(bases, hues) if x != b and min(abs(h - hh), 360 - abs(h - hh)) < 20]
            show(ramp(b, steps, light, dark), f"Sibling ramp {b} (same L per step)" + (f" — WARNING: hue close to {', '.join(near)} (< 20°)" if near else ""))
    elif a[0] == "contrast":
        fg, bg = hex_to_rgb(a[1]), hex_to_rgb(a[2])
        r = ratio(fg, bg)
        print(f"{a[1]} on {a[2]}: {r:.2f} — {'passes 4.5' if r >= 4.5 else 'passes 3 (large text)' if r >= 3 else 'FAILS'}")
        if r < 4.5:
            L, C, H = rgb_to_oklch(fg)
            Lb = rgb_to_oklch(bg)[0]
            for d in [i / 100 for i in range(1, 80)]:
                L2 = L - d if Lb > 0.5 else L + d
                if not 0 <= L2 <= 1:
                    break
                c2 = min(C, max_chroma(L2, H))
                rgb2 = oklch_to_rgb(L2, c2, H)
                if ratio(rgb2, bg) >= 4.5:
                    print(f"  shift the text's L {L:.3f} → {L2:.3f} (hue kept): {rgb_to_hex(rgb2)} = {ratio(rgb2, bg):.2f}")
                    break
    elif a[0] == "dark":
        for k, v in dark_map([int(x) for x in a[1].split(",")]).items():
            print(f"{k} → {v}")
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main(sys.argv[1:])
