"""Render the standalone 8-second vector study. Run from the pack root.
Requires Node, Inkscape, FFmpeg and Python 3. Pillow is optional for PNG normalization.
"""
from pathlib import Path
import os, subprocess, shutil, json, io

ROOT=Path(__file__).resolve().parent.parent
FRAMES=ROOT/'render-work'/'character-frames';FRAMES.mkdir(parents=True,exist_ok=True)
NODE=os.environ.get('CODEX_PRIMARY_RUNTIME_NODE','node')
subprocess.run([NODE,str(ROOT/'examples'/'CharacterMotion.mjs'),str(FRAMES)],check=True)
try:
 from PIL import Image
except ImportError:
 Image=None
paths=sorted(FRAMES.glob('frame-*.svg'))
# One process handles all files: concurrent Inkscape sessions can forward work
# to a shared application instance and return before another export completes.
result=subprocess.run(['inkscape','--batch-process','--export-type=png','--export-width=1920','--export-overwrite',*[str(p) for p in paths]],stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
if result.returncode:raise RuntimeError(result.stderr.decode())
if Image:
 for path in paths:
  try:
   with Image.open(path.with_suffix('.png')) as im: clean=im.convert('RGB')
  except OSError:
   # Retry a failed disk export through stdout so bytes are complete before use.
   retry=subprocess.run(['inkscape',str(path),'--export-type=png','--export-width=1920','--export-filename=-'],stdout=subprocess.PIPE,stderr=subprocess.PIPE,check=True)
   with Image.open(io.BytesIO(retry.stdout)) as im: clean=im.convert('RGB')
  tmp=path.with_suffix('.normalized.png');clean.save(tmp,format='PNG');tmp.replace(path.with_suffix('.png'))
for name in ['Layla_Rig.svg','Omar_Rig.svg','ASSESS_SHIFT_Coach_Coachee.svg']:
 shutil.copy2(FRAMES/name,ROOT/'brand'/name)
out=ROOT/'preview'/'Character_Motion_Study.mp4';out.parent.mkdir(exist_ok=True)
subprocess.run(['ffmpeg','-y','-loglevel','error','-xerror','-framerate','30','-i',str(FRAMES/'frame-%04d.png'),'-frames:v','240','-c:v','libx264','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(out)],check=True)
meta=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height,r_frame_rate,nb_frames,duration','-of','json',str(out)]))['streams'][0]
assert (meta['width'],meta['height'],meta['r_frame_rate'],int(meta['nb_frames']))==(1920,1080,'30/1',240),meta
assert abs(float(meta['duration'])-8)<.001,meta
print('Verified 1920x1080, 30 fps, 240 frames, 8 seconds:',out)
