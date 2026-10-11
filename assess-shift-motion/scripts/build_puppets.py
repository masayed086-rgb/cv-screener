"""Cut the model-sheet front views of Layla and Omar into a jointed puppet.

Usage: python3 -I scripts/build_puppets.py <Coach_Coachee_Model_Sheet.png> <out_dir>

Layers per character (all in one shared 2x canvas so they align at rest):
  body (torso + legs + neck), head (pivots at the neck),
  armL_upper / armL_lower and armR_upper / armR_lower (lower = forearm + hand).
Arms are found by following each arm's outer silhouette at sleeve width;
pants-coloured pixels are kept out of the hands. Omar's screen-left hand is
in his pocket in the sheet, so that arm is removed (pants filled behind it)
and replaced with a mirrored copy of his free arm, watch painted out.
Writes <out_dir>/<who>/*.png and <out_dir>/manifest.json with pivots.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageFilter

SHEET = sys.argv[1]
OUT = sys.argv[2]
SCALE = 2  # work at 2x the sheet for smoother edges after Lanczos

CHARS = {
    'layla': dict(crop=(40, 100, 260, 640), cx=250, neck=200,
                  arm=dict(top=212, elbow=385, cuff=505, end=660, w_top=46, w_cuff=44, hand_w=56),
                  pants='dark', eyes=[(236, 104), (281, 104)],
                  # Sleeve inner seams traced from the art (y, x) at 2x.
                  inner={'L': [(222, 150), (290, 152), (370, 153), (410, 145), (440, 142), (463, 132), (497, 125), (505, 124)],
                         'R': [(222, 360), (290, 358), (343, 355), (383, 348), (410, 348), (440, 355), (463, 367), (497, 372), (505, 373)]}),
    'omar': dict(crop=(815, 95, 1030, 640), cx=230, neck=178,
                 arm=dict(top=214, elbow=392, cuff=468, end=660, w_top=58, w_cuff=60, hand_w=58),
                 pants='khaki', eyes=[(222, 104), (267, 104)], pocket_side='L',
                 inner={'R': [(224, 368), (260, 358), (290, 350), (350, 340), (383, 333), (443, 337), (468, 340)],
                        'L': [(224, 92), (260, 102), (290, 110), (350, 120), (383, 127), (443, 123), (468, 120)]}),
}

sheet = Image.open(SHEET).convert('RGB')


def flood_bg(rgb):
    """Alpha via border flood-fill through near-ivory pixels (soft edge)."""
    c = rgb.astype(np.float32)
    border = np.concatenate([c[0], c[-1], c[:, 0], c[:, -1]])
    bg = np.median(border, axis=0)
    delta = c - bg
    shift = np.clip(delta.mean(2, keepdims=True), 0, None)
    d = np.sqrt(((delta - shift) ** 2).sum(2))
    mask = d < 16
    seed = np.zeros_like(mask)
    seed[0], seed[-1], seed[:, 0], seed[:, -1] = mask[0], mask[-1], mask[:, 0], mask[:, -1]
    while True:
        g = seed.copy()
        g[1:] |= seed[:-1]; g[:-1] |= seed[1:]; g[:, 1:] |= seed[:, :-1]; g[:, :-1] |= seed[:, 1:]
        g &= mask
        if (g == seed).all():
            break
        seed = g
    alpha = np.where(seed, np.clip((d - 7) / 9, 0, 1), 1.0)
    # drop faint floor shading far from the figure
    core = d > 30
    near = core.copy()
    for _ in range(6):
        g = near.copy()
        g[1:] |= near[:-1]; g[:-1] |= near[1:]; g[:, 1:] |= near[:, :-1]; g[:, :-1] |= near[:, 1:]
        near = g
    alpha = np.where(seed & ~near, 0, alpha)
    a3 = np.clip(alpha, 0.05, 1)[..., None]
    rgb_dec = np.clip((c - (1 - a3) * bg) / a3, 0, 255)
    return rgb_dec, alpha


def is_pants(px, kind):
    r, g, b = px[..., 0], px[..., 1], px[..., 2]
    if kind == 'dark':
        return (np.maximum(np.maximum(r, g), b) < 95) & (np.abs(r - b) < 18)
    # khaki: light, low saturation, warm grey
    mx = np.maximum(np.maximum(r, g), b); mn = np.minimum(np.minimum(r, g), b)
    return (mx > 140) & ((mx - mn) < 48) & (r >= b)


def outer_edge(alpha, y, cx, side):
    xs = np.where(alpha[y] > 0.5)[0]
    xs = xs[xs < cx] if side == 'L' else xs[xs > cx]
    if len(xs) == 0:
        return None
    return float(xs.min() if side == 'L' else xs.max())


def smooth1d(d, win=21):
    ys = sorted(d)
    v = np.array([d[y] for y in ys])
    pad = win // 2
    vp = np.pad(v, pad, mode='edge')
    k = np.ones(win) / win
    sm = np.convolve(vp, k, mode='valid')
    return dict(zip(ys, sm))


def dilate(m, n):
    m = m.copy()
    for _ in range(n):
        g = m.copy()
        g[1:] |= m[:-1]; g[:-1] |= m[1:]; g[:, 1:] |= m[:, :-1]; g[:, :-1] |= m[:, 1:]
        m = g
    return m


def is_jacket(px, kind):
    r, g, b = px[..., 0].astype(int), px[..., 1].astype(int), px[..., 2].astype(int)
    if kind == 'dark':  # Layla: burgundy blazer
        return (r > g + 40) & (r > b + 25) & (g < 90)
    return (b > r + 5) & (g > r) & (r < 120)  # Omar: slate teal shirt


def arm_layers(alpha, rgb, cfg, side, pants_kind):
    """Soft arm weights (upper, lower), the body keep-weight for the sleeve
    rows, the covered hand region below the cuff, the body edge and pivots.
    Cut lines follow the *smoothed* outer silhouette so edges are clean."""
    h, w = alpha.shape
    a = cfg['arm']
    s = 1 if side == 'L' else -1
    X = np.arange(w)[None, :].repeat(1, 0)
    raw = {}
    for y in range(a['top'], a['cuff'] + 1):
        xo = outer_edge(alpha, y, cfg['cx'], side)
        if xo is not None:
            raw[y] = xo
    xo_s = smooth1d(raw, 25)
    upper = np.zeros((h, w)); lower = np.zeros((h, w)); keep = np.ones((h, w))
    xb, centres = {}, {}
    for y in range(a['top'], a['cuff'] + 1):
        t = (y - a['top']) / (a['cuff'] - a['top'])
        width = a['w_top'] + (a['w_cuff'] - a['w_top']) * t
        if 'inner' in cfg and side in cfg['inner']:
            pts = cfg['inner'][side]
            inner = float(np.interp(y, [p[0] for p in pts], [p[1] for p in pts]))
            cut = inner - s * 1.5  # body keeps its side contour at the seam
            inner = inner + s * 1.5  # sleeve overlaps the seam slightly: no gap
        else:
            inner = xo_s[y] + s * width
            cut = xo_s[y] + s * 0.62 * width
        xs = np.arange(w)
        # weight 1 on the arm side of `inner`, 2px anti-aliased ramp
        wa = np.clip((inner - xs) * s / 2 + 0.5, 0, 1)
        # don't reach across the body centre
        wa *= ((xs - cfg['cx']) * s < 0)
        keep[y] = np.clip((xs - cut) * s / 2 + 0.5, 0, 1)
        xb[y] = cut
        centres[y] = (xo_s[y] + inner) / 2
        if y < a['elbow'] + 14:
            upper[y] = wa
        if y >= a['elbow'] - 16:
            lower[y] = wa
    # Hand rows: the hand's own silhouette (not pants), dilated 2px so no
    # anti-aliased ghost of it stays on the body.
    hand = np.zeros((h, w), bool)
    for y in range(a['cuff'] + 1, a['end']):
        xo = outer_edge(alpha, y, cfg['cx'], side)
        if xo is None:
            continue
        xo = int(xo)
        x0, x1 = (xo, xo + a['hand_w']) if side == 'L' else (xo - a['hand_w'] + 1, xo + 1)
        x0, x1 = max(0, x0), min(w, x1)
        seg = np.zeros(w, bool)
        seg[x0:x1] = alpha[y, x0:x1] > 0.02
        seg &= ~is_pants(rgb[y], pants_kind) & ~is_jacket(rgb[y], pants_kind)
        hand[y] = seg
        lower[y] = np.maximum(lower[y], seg.astype(float))
    # The cuff rows (blouse/shirt cuff sits over the hip) are removed like the
    # hand so no sliver of cuff stays on the body when the arm lifts.
    for y in range(a['cuff'] - 16, a['cuff'] + 1):
        xo = xo_s[y]
        x0, x1 = (int(xo), int(xo + a['w_cuff'] + 4)) if side == 'L' else (int(xo - a['w_cuff'] - 4), int(xo) + 1)
        hand[y, max(0, x0):min(w, x1)] = alpha[y, max(0, x0):min(w, x1)] > 0.02
    # dilate 4px so the illustration's pale rim around the hand goes too
    hand = dilate(hand, 4)
    # Body edge below the cuff: from the cut line at the cuff to the real
    # silhouette just below the hand.
    yb = a['end'] + 6
    e_end = outer_edge(alpha, yb, cfg['cx'], side)
    for y in range(a['cuff'] + 1, a['end']):
        t = (y - a['cuff']) / (yb - a['cuff'])
        xb[y] = xb[a['cuff']] + (e_end - xb[a['cuff']]) * t
    def c(y):
        ys = min(centres, key=lambda k: abs(k - y))
        return [round(float(centres[ys]), 1), y]
    piv = {'shoulder': c(a['top'] + 30), 'elbow': c(a['elbow']), 'wrist': c(a['cuff'])}
    return upper, lower, keep, hand, xb, piv


def fill_hand_region(body_rgb, body_alpha, hand, xb, side):
    """Where the hand covered the body (inside the body edge), extend the
    fabric from further in; outside the edge, make it transparent."""
    s = 1 if side == 'L' else -1
    W = body_alpha.shape[1]
    for y in range(hand.shape[0]):
        xs = np.where(hand[y])[0]
        if len(xs) == 0 or y not in xb:
            continue
        e = xb[y]
        inside = xs[(xs - e) * s >= 0]
        body_alpha[y, xs[(xs - e) * s < 0]] = 0
        if len(inside):
            k = (inside.max() + 1) if side == 'L' else (inside.min() - 1)
            while 0 <= k < W and (hand[y, k] or body_alpha[y, k] < 0.9):
                k += s
            if 0 <= k < W:
                for x in inside:
                    src = int(min(max(k + (k - x) // 2, 0), W - 1))
                    body_rgb[y, x] = body_rgb[y, src] if body_alpha[y, src] > 0.9 else body_rgb[y, k]
                    body_alpha[y, x] = 1
        # soft anti-aliased body edge with a faint outline
        ei = int(round(e))
        for dx in range(-1, 2):
            x = ei + dx
            if 0 <= x < W and body_alpha[y, x] > 0:
                body_rgb[y, x] = body_rgb[y, x] * 0.85


def rgba(rgb, alpha):
    alpha = np.where(alpha < 0.25, 0, alpha)  # no faint background slivers
    return Image.fromarray(np.dstack([rgb, alpha * 255]).astype(np.uint8), 'RGBA')


manifest = {}
for who, cfg in CHARS.items():
    crop = sheet.crop(cfg['crop'])
    crop = crop.resize((crop.width * SCALE, crop.height * SCALE), Image.LANCZOS)
    rgb, alpha = flood_bg(np.asarray(crop))
    H, W = alpha.shape
    out = os.path.join(OUT, who)
    os.makedirs(out, exist_ok=True)
    layers = {}
    pivots = {}
    body_alpha = alpha.copy()
    body_rgb = rgb.copy()

    for side in ('L', 'R'):
        up, lo, keep, hand, xb, piv = arm_layers(alpha, rgb, cfg, side, cfg['pants'])
        a = cfg['arm']
        if cfg.get('pocket_side') == side:
            # The sheet's arm is in the pocket: also remove the forearm skin
            # running across the hip into the pocket.
            for y in range(a['cuff'] - 40, 580):
                r = rgb[y]
                skin = (r[:, 0] > r[:, 2] + 35) & (r[:, 0] > 120) & (alpha[y] > 0.5)
                xs = np.where(skin[: cfg['cx'] - 70])[0]
                if len(xs):
                    hand[y, xs.min(): xs.max() + 3] = True
            hand = dilate(hand, 2)
        body_alpha = body_alpha * keep
        if cfg.get('pocket_side') == side:
            # Body edge on the pocket side: straight from the cut line above
            # the removed forearm down to the pants silhouette below it.
            y0, y1 = a['cuff'] - 44, a['end'] + 6
            e0 = xb[y0]
            e1 = outer_edge(alpha, y1, cfg['cx'], side)
            for y in range(y0, a['end']):
                xb[y] = e0 + (e1 - e0) * (y - y0) / (y1 - y0)
                # restore the body inside the new edge, then fill it
                xs = np.arange(body_alpha.shape[1])
                inside = (xs - xb[y]) * (1 if side == 'L' else -1) >= 0
                gone = inside & (keep[y] < 0.5) & (alpha[y] > 0.5)
                hand[y] |= gone
                keep[y][gone] = 1
            body_alpha = body_alpha * keep
        fill_hand_region(body_rgb, body_alpha, hand, xb, side)
        if cfg.get('pocket_side') == side:
            continue
        up_a = alpha * up
        sh = slice(a['top'], a['top'] + 30)
        up_a[sh] *= (np.linspace(0, 1, 30) ** 0.8)[:, None]
        lo_a = alpha * lo
        band = slice(a['elbow'] - 16, a['elbow'] + 8)
        lo_a[band] *= np.linspace(0, 1, band.stop - band.start)[:, None]
        layers[f'arm{side}_upper'] = rgba(rgb, up_a)
        layers[f'arm{side}_lower'] = rgba(rgb, lo_a)
        pivots[f'arm{side}'] = piv

    if cfg.get('pocket_side'):
        ps = cfg['pocket_side']
        src = 'R' if ps == 'L' else 'L'
        mirror_x = 2 * cfg['cx']
        for part in ('upper', 'lower'):
            im = layers[f'arm{src}_{part}']
            arr = np.asarray(im).copy()
            if part == 'lower':
                # paint the watch out: dark pixels at the wrist -> skin from just above
                a = cfg['arm']
                for y in range(a['cuff'] + 60, a['cuff'] + 112):
                    row = arr[y]
                    dark = (row[:, :3].max(1) < 95) & (row[:, 3] > 128)
                    if dark.any():
                        arr[y, dark, :3] = arr[a['cuff'] + 56, dark, :3]
            flipped = np.zeros_like(arr)
            # mirror about the body centre line x = cx
            for x in range(W):
                xm = mirror_x - x
                if 0 <= xm < W:
                    flipped[:, xm] = arr[:, x]
            layers[f'arm{ps}_{part}'] = Image.fromarray(flipped, 'RGBA')
        p = pivots[f'arm{src}']
        pivots[f'arm{ps}'] = {k: [round(mirror_x - v[0], 1), v[1]] for k, v in p.items()}

    # Head: everything above the neck cut, fading out over 12px; body keeps
    # the neck and loses what is above it.
    n = cfg['neck']
    head_a = alpha.copy()
    head_a[n + 6:] = 0
    head_a[n - 6: n + 6] *= np.linspace(1, 0, 12)[:, None]
    head_a[:, : cfg['cx'] - 120] = 0
    head_a[:, cfg['cx'] + 120:] = 0
    body_alpha[: n - 6] = 0
    layers['head'] = rgba(rgb, head_a)
    layers['body'] = rgba(body_rgb, body_alpha)
    pivots['neck'] = [cfg['cx'], n]

    for k, im in layers.items():
        im.save(os.path.join(out, f'{k}.png'), optimize=True)
    # skin colour near the eyes, for blink lids
    ey = cfg['eyes'][0]
    # lid colour: skin just above the eye, under the brow
    skin = rgb[ey[1] - 8: ey[1] - 5, ey[0] - 4: ey[0] + 4].reshape(-1, 3).mean(0)
    feet = int(np.where((alpha > 0.5).any(1))[0].max())
    manifest[who] = {'width': W, 'height': H, 'pivots': pivots, 'eyes': cfg['eyes'], 'lid': [round(v) for v in skin], 'feetY': feet}
    print(who, W, H, 'feet', feet, json.dumps(pivots))
json.dump(manifest, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=2)
