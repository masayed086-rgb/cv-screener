"""Cut whole poses out of the reference board onto transparency.
Usage: python3 -I matte.py <board.png> <out_dir>
Background: flood-filled from the crop border through pixels close to the
local ivory colour, with a soft ramp at the edge and colour decontamination."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageFilter
from boxes import BOXES

board = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(np.float32)
out = sys.argv[2]
os.makedirs(out, exist_ok=True)
T0, T1 = 7.0, 15.0

def geodesic_fill(mask):
    """Pixels of `mask` connected to the image border."""
    seed = np.zeros_like(mask)
    seed[0, :] = mask[0, :]; seed[-1, :] = mask[-1, :]
    seed[:, 0] = mask[:, 0]; seed[:, -1] = mask[:, -1]
    while True:
        grow = seed.copy()
        grow[1:, :] |= seed[:-1, :]; grow[:-1, :] |= seed[1:, :]
        grow[:, 1:] |= seed[:, :-1]; grow[:, :-1] |= seed[:, 1:]
        grow &= mask
        if (grow == seed).all():
            return seed
        seed = grow

for name, (x0, y0, x1, y1) in BOXES.items():
    c = board[y0:y1, x0:x1].copy()
    # Remove the board's thin grey divider lines (low-saturation mid greys in
    # one or two rows that span most of the crop width).
    sat = c.max(2) - c.min(2)
    grey = (sat < 18) & (c.mean(2) > 120) & (c.mean(2) < 235)
    for r in range(c.shape[0]):
        if grey[r].mean() > 0.35:
            c[r][grey[r]] = np.nan
    border = np.concatenate([c[0], c[-1], c[:, 0], c[:, -1]])
    bg = np.nanmedian(border, axis=0)
    c = np.where(np.isnan(c), bg, c)
    # Distance from the board colour, ignoring a uniform *brightening* so the
    # white floor glow counts as background (shadows and colour still count).
    delta = c - bg
    shift = np.clip(delta.mean(2, keepdims=True), 0, None)
    d = np.sqrt(((delta - shift) ** 2).sum(2))
    region = geodesic_fill(d < T1)
    soft = np.clip((d - T0) / (T1 - T0), 0, 1)
    alpha = np.where(region, soft, 1.0)
    # Keep only pixels near the figure itself: drop the board's floor shading
    # that sits away from the body (the video draws its own floor shadow).
    core = d > 34
    near = core.copy()
    for _ in range(7):
        g = near.copy()
        g[1:] |= near[:-1]; g[:-1] |= near[1:]; g[:, 1:] |= near[:, :-1]; g[:, :-1] |= near[:, 1:]
        near = g
    alpha = np.where(region & ~near, 0.0, alpha)
    # Feather the crop boundary so no hard rectangle edge can show.
    h, w = alpha.shape
    F = 8
    ry = np.clip(np.minimum(np.arange(h), h - 1 - np.arange(h)) / F, 0, 1)
    rx = np.clip(np.minimum(np.arange(w), w - 1 - np.arange(w)) / F, 0, 1)
    alpha = alpha * ry[:, None] * rx[None, :]
    a_img = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
    alpha = np.asarray(a_img).astype(np.float32) / 255
    # Un-mix the ivory from semi-transparent edge pixels.
    a3 = np.clip(alpha, 0.05, 1)[..., None]
    rgb = np.clip((c - (1 - a3) * bg) / a3, 0, 255)
    rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    im = Image.fromarray(rgba, 'RGBA')
    # 2x Lanczos so the browser is not upscaling a tiny source at render time.
    im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS)
    im.save(os.path.join(out, f'{name}.png'), optimize=True)
    print(name, im.size, 'bg', bg.round(1))
