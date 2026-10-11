// Writes captions/<lang>.{vtt,srt} from content/<lang>.json.
// While timing/scenes.json says "provisional": true, files are named *.provisional.* and carry a NOTE.
// After recording: re-time content/<lang>.json captions to the reviewed voiceover, set provisional:false, re-run.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const timing = JSON.parse(await readFile(path.join(ROOT, 'timing/scenes.json'), 'utf8'));
const suffix = timing.provisional ? '.provisional' : '';
await mkdir(path.join(ROOT, 'captions'), { recursive: true });

const ts = (s, sep) => {
  const ms = Math.round(s * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, sec = Math.floor(ms / 1000) % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}${sep}${String(ms % 1000).padStart(3, '0')}`;
};

for (const lang of ['en', 'ar']) {
  const { captions } = JSON.parse(await readFile(path.join(ROOT, `content/${lang}.json`), 'utf8'));
  const note = timing.provisional ? 'NOTE PROVISIONAL timing from the storyboard. Re-time to the reviewed voiceover before publishing.\n\n' : '';
  const vtt = 'WEBVTT\n\n' + note + captions.map((c, i) => `${i + 1}\n${ts(c.start, '.')} --> ${ts(c.end, '.')}\n${c.text}\n`).join('\n');
  const srt = captions.map((c, i) => `${i + 1}\n${ts(c.start, ',')} --> ${ts(c.end, ',')}\n${c.text}\n`).join('\n');
  await writeFile(path.join(ROOT, `captions/${lang}${suffix}.vtt`), vtt);
  await writeFile(path.join(ROOT, `captions/${lang}${suffix}.srt`), srt);
  console.log(`captions/${lang}${suffix}.vtt, .srt (${captions.length} cues)`);
}
