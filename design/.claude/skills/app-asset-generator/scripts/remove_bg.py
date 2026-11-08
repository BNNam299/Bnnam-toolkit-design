#!/usr/bin/env python3
"""Remove a flat chromakey background (green / magenta / blue) from ONE AI-generated image
and save a clean transparent PNG for design work (Figma).

Why this exists: simple keyers threshold the distance to the key color. An edge pixel that is
70% subject + 30% key is "far enough" from the key to be kept fully opaque, so a 1-2px ring of
key color (purple/green) survives. This script instead UNMIXES every edge pixel:

    observed = alpha * subject_color + (1 - alpha) * key_color

It estimates the true subject color from nearby solid pixels, solves for alpha, and removes the
key color in exactly that proportion. Transparent pixels get the nearest subject color (not the
key color) so nothing bleeds back when the image is scaled.

Pipeline
  1. Key color from the image border, refined into a smooth key MAP (handles gradients/vignette).
  2. Background = key-hued pixels connected to the border (flood fill) + large enclosed key holes.
  3. Edge band (N px around the background): solve alpha + decontaminate color (unmixing).
  4. Remove tiny islands, bleed colors into transparent pixels, trim to content.
  5. Verify with real measurements (fringe ring, leftover key, clipping) + preview image.

Usage
  python remove_bg.py input.png -o out/AST-004_mascot.png
  python remove_bg.py input.jpg -o out.png --key FF00FF --edge 8

Exit codes: 0 = pass, 2 = verification failed (file is still written), 1 = error.
Requires: numpy, Pillow, scipy
"""
import argparse
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

# Key-hue classification (relative to the key's own chroma)
HUE_COS = 0.94      # chroma direction within ~20 degrees of the key
SAT_MIN = 0.55      # at least 55% of the key's saturation
AA_PX = 3           # outer anti-aliasing zone (px at ~1024px) that may become semi-transparent
EPS = 1e-6


# ----------------------------------------------------------------------------- helpers
def chroma(rgb):
    """Color minus its gray component (vector orthogonal to the gray axis)."""
    return rgb - rgb.mean(axis=-1, keepdims=True)


def key_similarity(rgb, key):
    c, ck = chroma(rgb), chroma(key)
    nc, nk = np.linalg.norm(c, axis=-1), np.linalg.norm(ck, axis=-1)
    cos = (c * ck).sum(-1) / (nc * nk + EPS)
    sat = nc / (nk + EPS)
    return cos, sat


def key_tint(rgb, key):
    """How much of the key's chroma a color carries (1.0 = as saturated as the key)."""
    ck = chroma(key)
    nk = np.linalg.norm(ck, axis=-1, keepdims=True) + EPS
    return (chroma(rgb) * (ck / nk)).sum(-1) / nk[..., 0]


def border_mask(h, w, width):
    m = np.zeros((h, w), bool)
    m[:width], m[-width:], m[:, :width], m[:, -width:] = True, True, True, True
    return m


def fit_key_map(rgb, mask):
    """Smooth quadratic surface per channel fitted to background pixels."""
    h, w, _ = rgb.shape
    ys, xs = np.nonzero(mask)
    if len(ys) > 40000:
        pick = np.random.default_rng(0).choice(len(ys), 40000, replace=False)
        ys, xs = ys[pick], xs[pick]

    def design(x, y):
        x, y = x / w - 0.5, y / h - 0.5
        return np.stack([np.ones_like(x), x, y, x * x, x * y, y * y], -1)

    coef, *_ = np.linalg.lstsq(design(xs, ys), rgb[ys, xs], rcond=None)
    gy, gx = np.mgrid[0:h, 0:w].astype(np.float32)
    return np.clip(design(gx, gy) @ coef, 0, 255).astype(np.float32)


def touches_border_labels(labels):
    edge = np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]])
    return np.unique(edge[edge > 0])


def parse_hex(s):
    s = s.lstrip("#")
    if len(s) != 6:
        raise ValueError(f"invalid hex color: {s}")
    return np.array([int(s[i:i + 2], 16) for i in (0, 2, 4)], np.float32)


def to_hex(c):
    return "#" + "".join(f"{int(round(v)):02X}" for v in c)


def auto_edge(rgb, key_map, dist_to_bg, lo=3, hi=24):
    """Width of the key spill (anti-aliasing + rim light/glow) measured from the image:
    walk inward from the background and stop where the key tint stops dropping."""
    tint = np.clip(key_tint(rgb, key_map), 0, None)   # only key-ward tint counts as spill
    prof = []
    for d in range(1, 33):
        ring = (dist_to_bg > d - 0.5) & (dist_to_bg <= d + 0.5)
        if ring.sum() < 50:
            break
        prof.append(float(np.median(tint[ring])))
    if len(prof) < 4:
        return lo
    base = min(prof[len(prof) // 2:])
    for d, t in enumerate(prof, start=1):
        if t <= base + 0.02:
            return int(np.clip(d + 1, lo, hi))
    return hi


# ----------------------------------------------------------------------------- core
def remove_background(rgb, key_hex=None, edge=None):
    h, w, _ = rgb.shape
    n = h * w
    S8 = np.ones((3, 3), bool)
    info = {}

    # 1. key color + key map ------------------------------------------------------------
    bmask = border_mask(h, w, max(2, min(h, w) // 100))
    key0 = parse_hex(key_hex) if key_hex else np.median(rgb[bmask], axis=0)
    if np.linalg.norm(chroma(key0)) < 60:
        raise SystemExit(f"error: background {to_hex(key0)} is not a saturated key color. "
                         "Regenerate on pure #00FF00 or #FF00FF.")

    cos, sat = key_similarity(rgb, key0)
    cand = (cos > HUE_COS) & (sat > SAT_MIN)
    lab, _ = ndi.label(cand, S8)
    bg0 = np.isin(lab, touches_border_labels(lab))
    key_map = fit_key_map(rgb, bg0) if bg0.sum() > 500 else np.broadcast_to(key0, rgb.shape).copy()
    info["key"] = to_hex(np.median(key_map[bg0], axis=0) if bg0.any() else key0)

    # 2. background mask ----------------------------------------------------------------
    cos, sat = key_similarity(rgb, key_map)
    dist = np.linalg.norm(rgb - key_map, axis=-1)
    noise = float(np.percentile(dist[bg0], 95)) if bg0.any() else 10.0
    info["bg_noise"] = round(noise, 1)
    cand = ((cos > HUE_COS) & (sat > SAT_MIN)) | (dist < max(1.5 * noise, 10))
    lab, nlab = ndi.label(cand, S8)
    border_ids = touches_border_labels(lab)
    bg = np.isin(lab, border_ids)

    # enclosed key-colored regions (gap between arm and body) — only large, clearly-key ones
    if nlab:
        ids = np.arange(1, nlab + 1)
        area = ndi.sum(np.ones_like(lab), lab, ids)
        mcos = ndi.mean(cos, lab, ids)
        msat = ndi.mean(sat, lab, ids)
        hole_ids = ids[(area >= max(30, 0.0003 * n)) & (mcos > 0.97) & (msat > 0.8)
                       & ~np.isin(ids, border_ids)]
        info["enclosed_holes_removed"] = int(len(hole_ids))
        bg |= np.isin(lab, hole_ids)

    fg = ~bg
    if fg.sum() == 0:
        raise SystemExit("error: no subject found (whole image matches the key color).")

    # 3. edge band: unmix alpha and color -----------------------------------------------
    dist_to_bg = ndi.distance_transform_edt(fg)
    if edge is None:
        edge = auto_edge(rgb, key_map, dist_to_bg)
    info["edge_px"] = int(edge)
    band = fg & (dist_to_bg <= edge)
    core = fg & ~band
    if core.sum() < 20:                       # thin subject: use least key-like pixels as core
        core = fg & ((sat < 0.3) | (cos < 0.8))
        band = fg & ~core
    if core.sum() == 0:
        raise SystemExit("error: subject is too close to the key color to separate. "
                         "Regenerate with a different key color.")

    _, idx = ndi.distance_transform_edt(~core, return_indices=True)
    ref = rgb[idx[0], idx[1]]                  # nearest solid subject color

    alpha = fg.astype(np.float32)
    bi = np.nonzero(band)
    C, K, F = rgb[bi], key_map[bi], ref[bi]

    # 3a. alpha: only the outer anti-aliased pixels are partially transparent.
    #     Deeper spill (rim light / glow) stays opaque and is only color-corrected in 3c.
    aa_px = max(AA_PX, round(min(h, w) / 340))       # wider soft edge on big images
    aa_zone = dist_to_bg[bi] <= aa_px
    u, v = C - K, F - K
    vv = (v * v).sum(-1)
    a = (u * v).sum(-1) / (vv + EPS)                     # projection on the key->subject line
    resid = np.linalg.norm(u - a[:, None] * v, axis=-1)
    a_chroma = np.clip(1 - sat[bi] * np.clip(cos[bi], 0, None), 0, 1)
    unreliable = (np.sqrt(vv) < 40) | (resid > 0.25 * np.sqrt(vv) + 18)
    a = np.clip(np.where(unreliable, a_chroma, a), 0, 1)
    a = np.where(aa_zone, a, 1.0)
    a[a < 0.03], a[a > 0.98] = 0, 1
    alpha[bi] = a

    # 3b. unmix: remove exactly (1 - a) * key from the observed color
    Fc = (C - (1 - a)[:, None] * K) / np.maximum(a, 0.05)[:, None]
    wgt = np.clip((a - 0.1) / 0.2, 0, 1)[:, None]          # tiny alpha is unstable: lean on ref
    Fc = np.clip(wgt * Fc + (1 - wgt) * F, 0, 255)

    # 3c. spill correction along the key's chroma axis only (keeps brightness and other hues).
    #     Spill only ever ADDS key tint, so: if the observed pixel is more key-tinted than the
    #     solid subject next to it, give it the subject's tint. Never push past it
    #     (that over-correction is what turns a green fringe purple and vice versa).
    ck = chroma(K)
    ck_hat = ck / (np.linalg.norm(ck, axis=-1, keepdims=True) + EPS)
    t_obs = (chroma(C) * ck_hat).sum(-1)
    t_ref = (chroma(F) * ck_hat).sum(-1)
    t_key = (ck * ck_hat).sum(-1)
    spill = (t_obs > 0) & (t_obs > t_ref)
    # opaque spill (rim light): observed = (1-s)*true + s*key, with s read from the tint.
    # Unmixing it restores brightness too (a plain chroma shift leaves a darker band).
    deep = spill & (a >= 1)
    s = np.clip((t_obs - t_ref) / (t_key - t_ref + EPS), 0, 0.9)
    deep_fix = (C - s[:, None] * K) / (1 - s)[:, None]
    Fc = np.where(deep[:, None], np.clip(deep_fix, 0, 255), Fc)
    t_now = (chroma(Fc) * ck_hat).sum(-1)
    target = np.where(spill, t_ref, np.maximum(t_now, np.minimum(t_obs, t_ref)))
    Fc = np.clip(Fc + (target - t_now)[:, None] * ck_hat, 0, 255)

    color = rgb.copy()
    color[bi] = Fc

    # 4. cleanup -----------------------------------------------------------------------
    vis = alpha > 0
    lab, nlab = ndi.label(vis, S8)
    if nlab > 1:
        area = ndi.sum(np.ones_like(lab), lab, np.arange(1, nlab + 1))
        tiny = np.arange(1, nlab + 1)[area < max(16, 0.0004 * n)]
        alpha[np.isin(lab, tiny)] = 0
        info["islands_removed"] = int(len(tiny))

    solid = alpha >= 0.5
    if solid.any():                           # transparent pixels take the nearest subject color
        _, idx = ndi.distance_transform_edt(~solid, return_indices=True)
        clear = alpha == 0
        color[clear] = color[idx[0][clear], idx[1][clear]]

    info["subject_touches_border"] = bool(fg[bmask].any())
    return color, alpha, key_map, core, info


# ----------------------------------------------------------------------------- verification
def verify(color, alpha, key_map, core, info):
    transparent = alpha < 0.05
    ring = (~transparent) & (ndi.distance_transform_edt(~transparent) <= 3)
    tint = key_tint(color, key_map)
    hi = float(np.percentile(tint[core], 99)) if core.any() else 0.0
    lo = float(np.percentile(tint[core], 1)) if core.any() else 0.0
    # key-colored ring (under-correction) OR complementary ring (over-correction:
    # purple on a green key, green on a magenta key)
    fringe = ring & ((tint > max(hi + 0.06, 0.10)) | (tint < min(lo - 0.06, -0.10)))
    # dark/light halo: opaque edge pixels far from the brightness of the solid subject nearby
    halo_pct = 0.0
    if core.any():
        _, idx = ndi.distance_transform_edt(~core, return_indices=True)
        lum = color @ np.array([0.299, 0.587, 0.114], np.float32)
        diff = np.abs(lum - lum[idx[0], idx[1]])
        halo = ring & (alpha > 0.5) & (diff > 60)
        halo_pct = round(100 * halo.sum() / max(ring.sum(), 1), 2)
    cos, sat = key_similarity(color, key_map)
    opaque = alpha > 0.5
    key_left = opaque & (cos > HUE_COS) & (sat > SAT_MIN)
    h, w = alpha.shape
    corners = [alpha[0, 0], alpha[0, -1], alpha[-1, 0], alpha[-1, -1]]
    coverage = float((alpha > 0).mean())

    m = {
        **info,
        "size": f"{w}x{h}",
        "coverage_pct": round(100 * coverage, 1),
        "edge_ring_px": int(ring.sum()),
        "fringe_pct": round(100 * fringe.sum() / max(ring.sum(), 1), 2),
        "key_left_pct": round(100 * key_left.sum() / max(opaque.sum(), 1), 3),
        "halo_pct": halo_pct,
        "corners_transparent": all(c == 0 for c in corners),
    }
    reasons = []
    if m["fringe_pct"] >= 1.5:
        reasons.append(f"key-colored fringe on {m['fringe_pct']}% of the edge ring "
                       f"(rerun with --edge {m.get('edge_px', 6) + 6}; if it persists, "
                       "regenerate with the other key color)")
    if m["key_left_pct"] >= 0.2:
        reasons.append("key color left inside the subject (subject contains the key hue: "
                       "regenerate with the other key color)")
    if not m["corners_transparent"]:
        reasons.append("corners are not transparent (background not uniform)")
    if not 0.01 < coverage < 0.95:
        reasons.append(f"subject covers {m['coverage_pct']}% of the image (expected 1-95%)")
    if info.get("subject_touches_border"):
        reasons.append("subject touches the image border (likely cropped: regenerate with more padding)")
    m["pass"] = not reasons
    m["problems"] = reasons
    m["warnings"] = []
    if halo_pct >= 5:
        m["warnings"].append(f"{halo_pct}% of the edge ring is much darker/lighter than the subject: "
                             "fine if the design has a thin outline, otherwise check the zoom")
    return m, fringe


# ----------------------------------------------------------------------------- preview
def make_preview(rgba, fringe, metrics):
    img = Image.fromarray(rgba, "RGBA")
    w, h = img.size
    P = 320
    s = P / max(w, h)
    thumb = img.resize((max(1, int(w * s)), max(1, int(h * s))), Image.LANCZOS)

    def on(bg, im, size):
        c = Image.new("RGBA", size, bg)
        c.alpha_composite(im, ((size[0] - im.width) // 2, (size[1] - im.height) // 2))
        return c

    canvas = Image.new("RGB", (P * 3, P * 2 + 24), (40, 40, 40))
    for i, bg in enumerate([(255, 255, 255, 255), (0, 0, 0, 255), (128, 128, 128, 255)]):
        canvas.paste(on(bg, thumb, (P, P)).convert("RGB"), (i * P, 0))

    # 5x zoom on the worst edge spot (or the top edge if clean)
    a = rgba[..., 3]
    if fringe.any():
        ys, xs = np.nonzero(fringe)
        cy, cx = int(np.median(ys)), int(np.median(xs))
    else:
        ys, xs = np.nonzero((a > 0) & (a < 255)) if ((a > 0) & (a < 255)).any() else np.nonzero(a > 0)
        k = int(np.argmin(ys)) if len(ys) else 0
        cy, cx = (int(ys[k]), int(xs[k])) if len(ys) else (h // 2, w // 2)
    r = 32
    box = (max(0, cx - r), max(0, cy - r), min(w, cx + r), min(h, cy + r))
    crop = img.crop(box).resize(((box[2] - box[0]) * 5, (box[3] - box[1]) * 5), Image.NEAREST)
    for i, bg in enumerate([(255, 255, 255, 255), (0, 0, 0, 255)]):
        canvas.paste(on(bg, crop, (P, P)).convert("RGB"), (i * P, P))

    d = ImageDraw.Draw(canvas)
    lines = ["PASS" if metrics["pass"] else "FAIL",
             f"key {metrics['key']}  noise {metrics['bg_noise']}",
             f"fringe {metrics['fringe_pct']}% of edge ring",
             f"key left {metrics['key_left_pct']}%  halo {metrics['halo_pct']}%",
             f"coverage {metrics['coverage_pct']}%",
             "", "top: white | black | gray", "bottom: 5x zoom of edge"]
    for i, t in enumerate(lines):
        d.text((2 * P + 12, P + 12 + i * 18), t,
               fill=(120, 230, 120) if i == 0 and metrics["pass"] else (255, 120, 120) if i == 0 else (230, 230, 230))
    d.text((8, 2 * P + 5), "Check the zoom: no purple/green ring on either background.", fill=(200, 200, 200))
    return canvas


# ----------------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("input")
    ap.add_argument("-o", "--output", help="output PNG (default: <input>_cutout.png)")
    ap.add_argument("--key", help="key color hex, e.g. 00FF00 (default: detected from the border)")
    ap.add_argument("--edge", type=int, default=None,
                    help="edge band width in px to unmix (default: measured from the image's "
                         "key spill / rim light; set manually only if the report still shows fringe)")
    ap.add_argument("--pad", type=int, default=4, help="transparent padding kept after trimming")
    ap.add_argument("--no-trim", action="store_true", help="keep the original canvas size")
    ap.add_argument("--no-preview", action="store_true")
    args = ap.parse_args()

    src = Path(args.input)
    out = Path(args.output) if args.output else src.with_name(f"{src.stem}_cutout.png")
    if out.suffix.lower() != ".png":
        out = out.with_suffix(".png")
    out.parent.mkdir(parents=True, exist_ok=True)

    im = Image.open(src)               # opened by content: works even if a .png is really JPEG
    im.load()
    im.convert("RGB").save(out.with_name(f"{out.stem}_original.png"))
    rgb = np.asarray(im.convert("RGB"), np.float32)

    color, alpha, key_map, core, info = remove_background(rgb, args.key, args.edge)
    metrics, fringe = verify(color, alpha, key_map, core, info)

    rgba = np.dstack([np.round(color), np.round(alpha * 255)]).clip(0, 255).astype(np.uint8)
    if not args.no_preview:
        pv = out.with_name(f"{out.stem}_preview.png")
        make_preview(rgba, fringe, metrics).save(pv)
        metrics["preview"] = str(pv)

    if not args.no_trim and (rgba[..., 3] > 0).any():
        ys, xs = np.nonzero(rgba[..., 3] > 0)
        p = args.pad
        y0, y1 = max(0, ys.min() - p), min(rgba.shape[0], ys.max() + 1 + p)
        x0, x1 = max(0, xs.min() - p), min(rgba.shape[1], xs.max() + 1 + p)
        rgba = rgba[y0:y1, x0:x1]
        metrics["trimmed_size"] = f"{rgba.shape[1]}x{rgba.shape[0]}"

    Image.fromarray(rgba, "RGBA").save(out, optimize=True)
    metrics["output"] = str(out)
    metrics["original"] = str(out.with_name(f"{out.stem}_original.png"))
    print(json.dumps(metrics, indent=2, ensure_ascii=False))
    sys.exit(0 if metrics["pass"] else 2)


if __name__ == "__main__":
    main()
