# Downscale out/stills/*.png into docs/storyboard/*.jpg for storyboard.html.
import glob, os
from PIL import Image
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.makedirs(os.path.join(root, 'docs/storyboard'), exist_ok=True)
for f in glob.glob(os.path.join(root, 'out/stills/*.png')):
    im = Image.open(f).convert('RGB')
    im.thumbnail((640, 640))
    im.save(os.path.join(root, 'docs/storyboard', os.path.basename(f)[:-4] + '.jpg'), quality=82)
print('docs/storyboard updated')
