"""Quick PIL preview of the puppet layers: rest pose and test gestures.
Usage: python3 -I scripts/preview_puppet.py public/puppets out.png"""
import json, math, os, sys
from PIL import Image

D = sys.argv[1]
man = json.load(open(os.path.join(D, 'manifest.json')))


def place(canvas, im, pivot, angle, origin=(0, 0)):
    """Rotate `im` (full canvas sized) about `pivot` (canvas coords) by angle
    degrees (SVG convention: positive = clockwise), then paste."""
    rot = im.rotate(-angle, resample=Image.BICUBIC, center=tuple(pivot))
    canvas.alpha_composite(rot, origin)


def rot_pt(p, c, ang):
    r = math.radians(ang)
    x, y = p[0] - c[0], p[1] - c[1]
    return (c[0] + x * math.cos(r) - y * math.sin(r), c[1] + x * math.sin(r) + y * math.cos(r))


def pose(who, armL=(0, 0), armR=(0, 0), head=0):
    m = man[who]
    L = {k: Image.open(os.path.join(D, who, f'{k}.png')) for k in ['body', 'head', 'armL_upper', 'armL_lower', 'armR_upper', 'armR_lower']}
    cv = Image.new('RGBA', (m['width'], m['height']), (250, 247, 242, 255))
    for side, (u, f) in (('L', armL), ('R', armR)):
        pass
    order = ['L', 'R']
    # draw arms behind? draw body first, then arms on top (rest pose matches sheet)
    cv.alpha_composite(L['body'])
    for side, (u, f) in (('L', armL), ('R', armR)):
        p = m['pivots'][f'arm{side}']
        s = 1 if side == 'L' else -1
        # upper arm rotates about shoulder
        tmp = Image.new('RGBA', cv.size, (0, 0, 0, 0))
        place(tmp, L[f'arm{side}_upper'], p['shoulder'], s * u)
        # lower arm: rotate about elbow by u+f, after moving elbow with the upper arm
        el = rot_pt(p['elbow'], p['shoulder'], s * u)
        low = L[f'arm{side}_lower'].rotate(-(s * (u + f)), resample=Image.BICUBIC, center=tuple(p['elbow']),
                                         translate=(el[0] - p['elbow'][0], el[1] - p['elbow'][1]))
        tmp.alpha_composite(low)
        cv.alpha_composite(tmp)
    place(cv, L['head'], m['pivots']['neck'], head)
    return cv


rows = [
    ('layla', {}), ('layla', {'armR': (19, 64), 'head': 2}), ('layla', {'armR': (40, 74), 'armL': (12, 28)}),
    ('omar', {}), ('omar', {'armL': (19, 64), 'head': -2}), ('omar', {'armL': (12, 28), 'armR': (12, 28)}),
]
ims = [pose(w, **kw) for w, kw in rows]
H = max(i.height for i in ims)
sheet = Image.new('RGBA', (sum(i.width for i in ims), H), (250, 247, 242, 255))
x = 0
for i in ims:
    sheet.alpha_composite(i, (x, 0)); x += i.width
sheet.convert('RGB').save(sys.argv[2])
