"""Contact sheet from frame PNGs: python3 -I rig/tools/contact.py out.png cols scale frame1.png ..."""
import sys
from PIL import Image, ImageDraw, ImageFont
out, cols, scale, files = sys.argv[1], int(sys.argv[2]), float(sys.argv[3]), sys.argv[4:]
ims = [Image.open(f).convert('RGB') for f in files]
w, h = int(ims[0].width * scale), int(ims[0].height * scale)
pad, lab = 12, 40
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (w + pad) + pad, rows * (h + lab + pad) + pad), (226, 222, 214))
try:
    font = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-SemiBold.otf', 24)
except OSError:
    font = ImageFont.load_default()
d = ImageDraw.Draw(sheet)
for i, (im, f) in enumerate(zip(ims, files)):
    x, y = pad + (i % cols) * (w + pad), pad + (i // cols) * (h + lab + pad)
    sheet.paste(im.resize((w, h), Image.LANCZOS), (x, y))
    name = f.rsplit('/', 1)[-1].rsplit('.', 1)[0]
    d.text((x + 4, y + h + 8), name.split('-', 1)[-1] + ' s', fill=(20, 44, 62), font=font)
sheet.save(out)
print('wrote', out, sheet.size)
