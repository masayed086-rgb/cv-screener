// Frame-accurate renderer: drives src/index.html with window.seek(t), screenshots every frame,
// pipes JPEG frames into ffmpeg. Also exports scene stills and a contact sheet for review.
//
//   node tools/render.mjs --format vertical --lang en                # silent draft MP4
//   node tools/render.mjs --format landscape --lang ar --stills      # stills only
//   node tools/render.mjs --format vertical --lang en --from 16 --to 25   # partial range
//   node tools/render.mjs --format vertical --lang en --vo audio/vo_en.wav --music audio/bed.wav
import { createServer } from 'node:http';
import { readFile, mkdir, stat } from 'node:fs/promises';
import { spawn, execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, all) => {
  if (v.startsWith('--')) a.push([v.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]);
  return a;
}, []));
const FORMAT = args.format === 'landscape' ? 'landscape' : 'vertical';
const LANG = args.lang === 'ar' ? 'ar' : 'en';

// Prefer a local playwright install, fall back to a global one.
function loadPlaywright() {
  const req = createRequire(path.join(ROOT, 'package.json'));
  try { return req('playwright'); } catch {}
  const g = execSync('npm root -g').toString().trim();
  return createRequire(path.join(g, 'noop.js'))('playwright');
}
const { chromium } = loadPlaywright();

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!p.startsWith(ROOT)) throw new Error('outside');
    const body = await readFile(p);
    res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const timing = JSON.parse(await readFile(path.join(ROOT, 'timing/scenes.json'), 'utf8'));
const brand = JSON.parse(await readFile(path.join(ROOT, 'config/brand.json'), 'utf8'));
const fps = +(args.fps || timing.fps);
const W = FORMAT === 'vertical' ? 1080 : 1920, H = FORMAT === 'vertical' ? 1920 : 1080;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => { console.error('page error:', e.message); process.exitCode = 1; });
await page.goto(`http://127.0.0.1:${port}/src/index.html?format=${FORMAT}&lang=${LANG}&render=1`);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });

const out = path.join(ROOT, 'out');
await mkdir(path.join(out, 'stills'), { recursive: true });
const tag = `${FORMAT}-${LANG}`;
const shot = (t) => page.evaluate((t) => window.seek(t), t).then(() => page.screenshot({ type: 'jpeg', quality: 92 }));

if (args.stills) {
  // two stills per scene: just after the build and just before the exit
  for (const s of timing.scenes) {
    for (const [k, t] of [['a', s.start + (s.end - s.start) * 0.45], ['b', s.end - 0.5]]) {
      await page.evaluate((t) => window.seek(t), t);
      await page.screenshot({ path: path.join(out, 'stills', `${tag}-${s.id}${k}.png`) });
    }
  }
  console.log('stills ->', path.join(out, 'stills'));
} else {
  const from = +(args.from || 0), to = +(args.to || timing.duration);
  const n = Math.round((to - from) * fps);
  const silent = path.join(out, `${tag}${args.from || args.to ? `-${from}-${to}` : ''}-silent.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(fps), '-movflags', '+faststart', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    const buf = await shot(from + i / fps);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`${tag}: frame ${i}/${n} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  }
  ff.stdin.end();
  await new Promise((r, j) => ff.on('close', (c) => (c === 0 ? r() : j(new Error('ffmpeg exit ' + c)))));
  console.log('silent ->', silent);

  // Narrated mix only when a reviewed voiceover file is supplied (CLI flag or config).
  const vo = args.vo || brand.audio.voiceover[LANG];
  const music = args.music || brand.audio.music;
  if (vo) {
    await stat(path.join(ROOT, vo));
    const final = path.join(out, `${tag}-final.mp4`);
    const inputs = ['-i', silent, '-i', path.join(ROOT, vo)];
    let filter = '[1:a]loudnorm=I=-16:TP=-1.5[a]';
    if (music) { inputs.push('-i', path.join(ROOT, music)); filter = '[2:a]volume=0.12[m];[1:a][m]amix=inputs=2:duration=first:dropout_transition=0,loudnorm=I=-16:TP=-1.5[a]'; }
    execSync(['ffmpeg', '-y', '-loglevel', 'error', ...inputs, '-filter_complex', `"${filter}"`, '-map', '0:v', '-map', '"[a]"', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', `"${final}"`].map((a) => (a.includes(' ') && !a.startsWith('"') ? `"${a}"` : a)).join(' '), { stdio: 'inherit' });
    console.log('final ->', final);
  }
}
await browser.close();
server.close();
