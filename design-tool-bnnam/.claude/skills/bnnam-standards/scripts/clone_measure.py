"""Measure a clone source image — one command gives a measurement table, so the agent does not write a measuring script every time
(references/clone-from-reference.md).

Without it, the agent rewrote a PIL script on every clone (crop the screen, find edges, pick colours, diff) — about 1 minute before the first write.
Needs Pillow (`pip install pillow`). Every number printed is in the screen's **pt**, origin = top-left corner of the screen.

  python clone_measure.py screens <image>                                # multi-screen image: find each screen's frame (px)
  python clone_measure.py prep <image> --pt-width 393 --out <dir> [--crop x,y,w,h] [--name s1]
        → <dir>/<name>.png (screen image) · <name>.json (px/pt ratio) · <name>_grid.png (8pt grid) · <name>.md (palette + block edges)
  python clone_measure.py px   <dir>/<name> X Y                         # colour at a point (pt)
  python clone_measure.py row  <dir>/<name> Y [--tol 10]                # runs of uniform colour along row Y (pt)
  python clone_measure.py col  <dir>/<name> X [--tol 12]                # colour-change edges down column X (pt)
  python clone_measure.py bbox <dir>/<name> X0 X1 Y0 Y1 [--light|--dark] [--thr 70]   # bounding box of text strokes / shapes inside a region
  python clone_measure.py diff <source screen image> <built screen image> --out <dir>   # % difference · heat map · side-by-side · bands with heavy difference
  python clone_measure.py crop <dir>/<name> X Y W H --out <file.png> [--pad 4]   # crop one element (pt, keeps the original resolution) —
        element crops used when learning a style or as a reference for an image brief
"""
import json
import os
import sys

try:
    from PIL import Image, ImageChops, ImageDraw
except ImportError:
    sys.exit("Needs Pillow: pip install pillow")


def hx(c):
    return "#%02X%02X%02X" % tuple(c[:3])


def far(a, b, tol):
    return max(abs(a[i] - b[i]) for i in range(3)) > tol


def opt(argv, name, default=None):
    return argv[argv.index(name) + 1] if name in argv else default


def load(base):
    meta = json.load(open(base + ".json", encoding="utf-8"))
    im = Image.open(base + ".png").convert("RGB")
    return im, im.load(), meta["px_per_pt"]


# ───────────────────────── find screens in a multi-screen image
def _peaks(prof, k=3.0, merge=2):
    import statistics
    m, sd = statistics.mean(prof), statistics.pstdev(prof)
    xs = [i for i, v in enumerate(prof) if v > m + k * sd]
    out = []
    for x in xs:
        if out and x - out[-1][-1] <= merge:
            out[-1].append(x)
        else:
            out.append([x])
    return [sum(g) / len(g) for g in out]


def screens(path, tol=4):
    """Screen edge = a column / row with many horizontal colour changes (device bezel, drop shadow). Still works when background and screen are equally light."""
    im = Image.open(path).convert("RGB")
    W, H = im.size
    small = im.resize((max(1, W // 4), max(1, H // 4)))
    w, h = small.size
    px = small.load()
    cprof = [0] + [sum(far(px[x, y], px[x - 1, y], tol) for y in range(h)) / h for x in range(1, w)]
    pk = _peaks(cprof)
    spans, used = [], set()
    for i in range(len(pk) - 1):
        if pk[i + 1] - pk[i] >= 0.15 * w:
            spans.append([i, i + 1])
    for sp in spans:
        used.update(sp)
    for sp in spans:                                                    # widen to an adjacent edge (double bezel, shadow) not owned by another screen
        while sp[0] - 1 >= 0 and sp[0] - 1 not in used and pk[sp[0]] - pk[sp[0] - 1] <= 0.03 * w:
            sp[0] -= 1; used.add(sp[0])
        while sp[1] + 1 < len(pk) and sp[1] + 1 not in used and pk[sp[1] + 1] - pk[sp[1]] <= 0.03 * w:
            sp[1] += 1; used.add(sp[1])
    out = []
    for i0, i1 in spans:
        x0, x1 = int(pk[i0]), int(pk[i1])
        rprof = [0] + [sum(far(px[x, y], px[x, y - 1], tol) for x in range(x0, x1)) / max(1, x1 - x0) for y in range(1, h)]
        rk = _peaks(rprof, 2.0)
        y0, y1 = (int(rk[0]), int(rk[-1])) if len(rk) >= 2 else (0, h - 1)
        out.append({"x": x0 * 4, "y": y0 * 4, "w": (x1 - x0) * 4, "h": (y1 - y0) * 4})
    if len(out) < 2:                                                    # 1 "screen" is usually the content edge of a straight screenshot of one screen
        print(f"image {W}×{H}px · no multiple screens found — treating the whole image as one screen: prep needs no --crop"
              + (f" (single-device mockup with a bezel: try --crop {out[0]['x']},{out[0]['y']},{out[0]['w']},{out[0]['h']})" if out else ""))
        return []
    print(f"image {W}×{H}px · {len(out)} screens (px, ±8 error — open the image to check the edges, then pass --crop; rounded device frame → crop just inside the bezel):")
    for i, r in enumerate(out, 1):
        print(f"  s{i}: --crop {r['x']},{r['y']},{r['w']},{r['h']}")
    return out


# ───────────────────────── prepare one screen
def prep(path, pt_width, outdir, crop=None, name="s1"):
    os.makedirs(outdir, exist_ok=True)
    im = Image.open(path).convert("RGB")
    if crop:
        x, y, w, h = [int(float(v)) for v in crop.split(",")]
        im = im.crop((x, y, x + w, y + h))
    W, H = im.size
    k = W / float(pt_width)
    base = os.path.join(outdir, name)
    im.save(base + ".png")
    json.dump({"src": os.path.abspath(path), "crop": crop, "px_per_pt": k, "pt": [pt_width, round(H / k, 1)]}, open(base + ".json", "w", encoding="utf-8"))
    # 8pt grid, label every 40pt — so numbers can be read off the image
    g = im.copy()
    d = ImageDraw.Draw(g)
    for v in range(0, int(W / k) + 1, 8):
        d.line([(v * k, 0), (v * k, H)], fill=(255, 0, 255) if v % 40 == 0 else (255, 150, 255), width=1)
        if v % 40 == 0:
            d.text((v * k + 2, 2), str(v), fill=(255, 0, 255))
    for v in range(0, int(H / k) + 1, 8):
        d.line([(0, v * k), (W, v * k)], fill=(255, 0, 255) if v % 40 == 0 else (255, 150, 255), width=1)
        if v % 40 == 0:
            d.text((2, v * k + 2), str(v), fill=(255, 0, 255))
    g.save(base + "_grid.png")
    px = im.load()
    # palette — quantised to 24 colours, colours under 0.5 % of the area dropped
    q = im.resize((max(1, W // 3), max(1, H // 3))).quantize(colors=24, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()
    cnt = sorted(q.getcolors(), reverse=True)
    tot = sum(c for c, _ in cnt)
    L = [f"# Measurements `{os.path.basename(path)}` · screen {pt_width}×{round(H / k, 1)} pt · {k:.3f} px/pt", "",
         f"Screen image: `{name}.png` · 8pt grid: `{name}_grid.png` · more measurements: `px` / `row` / `col` / `bbox` (unit pt)", "",
         "## Palette (by area)", "", "| colour | % |", "|---|---|"]
    L += [f"| `{hx(pal[i * 3:i * 3 + 3])}` | {100 * c / tot:.1f} |" for c, i in cnt if 100 * c / tot >= 0.5]
    # vertical block edges in 3 columns — at 12 %, 50 %, 88 % of the width
    L += ["", "## Vertical block edges in 3 columns (pt) — the new colour holds for ≥ 3 pt; finer edges: command `col`", ""]
    for f in (0.12, 0.5, 0.88):
        L.append(f"- **x = {round(W * f / k)}**: " + " · ".join(f"{y} ({a}→{b})" for y, a, b in col_edges(px, W, H, int(W * f), k, 16, 3)))
    open(base + ".md", "w", encoding="utf-8").write("\n".join(L) + "\n")
    print("\n".join(L))


def col_edges(px, W, H, x, k, tol=12, stable=0):
    """stable > 0: keep only edges where the new colour still holds after `stable` pt — real block edges, ignoring strokes inside illustrations"""
    out, prev, last = [], px[x, 0], -99
    for y in range(1, H):
        c = px[x, y]
        if far(c, prev, tol) and (not stable or not far(px[x, min(H - 1, y + int(stable * k))], c, tol)):
            yp = round(y / k, 1)
            if yp - last >= 2:                                            # merge edges that are close together (anti-aliasing)
                out.append((yp, hx(prev), hx(c)))
                last = yp
        prev = c
    return out


def row_runs(px, W, y, k, tol=10):
    runs, s = [], 0
    for x in range(1, W):
        if far(px[x, y], px[s, y], tol):
            if x - s > 4:
                runs.append((round(s / k, 1), round(x / k, 1), hx(px[s, y])))
            s = x
    if W - s > 4:
        runs.append((round(s / k, 1), round(W / k, 1), hx(px[s, y])))
    return runs


def bbox(px, k, x0, x1, y0, y1, light=True, thr=70):
    xs, ys = [], []
    for y in range(int(y0 * k), int(y1 * k)):
        for x in range(int(x0 * k), int(x1 * k)):
            v = sum(px[x, y][:3]) / 3
            if (v > thr) if light else (v < thr):
                xs.append(x)
                ys.append(y)
    if not xs:
        return None
    return {"x": round(min(xs) / k, 1), "y": round(min(ys) / k, 1), "w": round((max(xs) - min(xs) + 1) / k, 1), "h": round((max(ys) - min(ys) + 1) / k, 1)}


# ───────────────────────── crop one element (style learning, image-brief references)
def crop(im, k, x, y, w, h, out, pad=4):
    W, H = im.size
    box = (max(0, int((x - pad) * k)), max(0, int((y - pad) * k)), min(W, int((x + w + pad) * k)), min(H, int((y + h + pad) * k)))
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    im.crop(box).save(out)
    print(f"{out} · {w}×{h} pt (+{pad} pt padding) · {box[2] - box[0]}×{box[3] - box[1]} px")


# ───────────────────────── diff the build against the source
def diff(ref_p, mine_p, outdir, thr=60):
    os.makedirs(outdir, exist_ok=True)
    ref = Image.open(ref_p).convert("RGB")
    mine = Image.open(mine_p).convert("RGB")
    if mine.size != ref.size:
        mine = mine.resize(ref.size, Image.LANCZOS)
    g = ImageChops.difference(ref, mine).convert("L")
    W, H = ref.size
    gp = g.load()
    heat = Image.new("RGB", (W, H))
    hp = heat.load()
    rows, bad = [0] * H, 0
    for y in range(H):
        for x in range(W):
            v = gp[x, y]
            hp[x, y] = (255, 40, 40) if v > thr else (90, 90, 0) if v > 25 else (0, 0, 0)
            if v > thr:
                rows[y] += 1
        bad += rows[y]
    stem = os.path.splitext(os.path.basename(mine_p))[0]
    heat.save(os.path.join(outdir, f"diff_{stem}.png"))
    side = Image.new("RGB", (W * 3 + 40, H), (20, 20, 20))
    side.paste(ref, (0, 0))
    side.paste(mine, (W + 20, 0))
    side.paste(heat, (W * 2 + 40, 0))
    side.save(os.path.join(outdir, f"side_{stem}.png"))
    print(f"difference > {thr}/255: {100.0 * bad / (W * H):.2f}% · images: diff_{stem}.png, side_{stem}.png (source | build | heat)")
    band = max(1, H // 20)
    for i in range(20):
        pct = 100.0 * sum(rows[i * band:(i + 1) * band]) / (band * W)
        if pct > 2:
            print(f"  band {100 * i // 20}–{100 * (i + 1) // 20}% of the height: {pct:.1f}% different")


def main(a):
    if len(a) < 2:
        sys.exit(__doc__)
    cmd = a[0]
    if cmd == "screens":
        screens(a[1])
    elif cmd == "prep":
        prep(a[1], float(opt(a, "--pt-width")), opt(a, "--out"), opt(a, "--crop"), opt(a, "--name", "s1"))
    elif cmd == "diff":
        diff(a[1], a[2], opt(a, "--out", os.path.dirname(a[2]) or "."))
    else:
        im, px, k = load(a[1])
        W, H = im.size
        if cmd == "px":
            print(hx(px[int(float(a[2]) * k), int(float(a[3]) * k)]))
        elif cmd == "row":
            for r in row_runs(px, W, int(float(a[2]) * k), k, int(opt(a, "--tol", 10))):
                print(r)
        elif cmd == "col":
            for e in col_edges(px, W, H, int(float(a[2]) * k), k, int(opt(a, "--tol", 12))):
                print(e)
        elif cmd == "crop":
            crop(im, k, *[float(v) for v in a[2:6]], opt(a, "--out"), float(opt(a, "--pad", 4)))
        elif cmd == "bbox":
            print(bbox(px, k, *[float(v) for v in a[2:6]], light="--dark" not in a, thr=int(opt(a, "--thr", 70))))
        else:
            sys.exit(__doc__)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main(sys.argv[1:])
