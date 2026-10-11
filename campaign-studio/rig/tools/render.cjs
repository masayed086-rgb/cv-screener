// Render an MP4 by seeking the page frame by frame and piping PNGs into FFmpeg.
// node rig/tools/render.cjs <story|acting> <flat|whiteboard> <out.mp4> <seconds> [fps]
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { buildPage } = require('../lib/page.cjs');
const { withPage } = require('../lib/browser.cjs');

const [entry, style, out, secs, fpsArg] = process.argv.slice(2);
const fps = Number(fpsArg || 30), frames = Math.round(Number(secs) * fps);
fs.mkdirSync(path.dirname(out), { recursive: true });

withPage({ width: 1080, height: 1920 }, async (page) => {
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.setContent(buildPage(entry, style));
  await page.evaluate(() => window.ready);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg exit ' + c)))));
  ff.stdin.on('error', (e) => { throw e; });
  for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => window.seek(t), i / fps);
    const buf = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await done;
  if (errors.length) throw new Error('page errors:\n' + errors.join('\n'));
  console.log(`wrote ${out}: ${frames} frames @ ${fps} fps`);
}).catch((e) => { console.error(e); process.exit(1); });
