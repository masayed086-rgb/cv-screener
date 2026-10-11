// Render scene(t) stills from a scene module into one contact sheet PNG.
// node rig/tools/stills.cjs <module.js> <out.png> <t1,t2,...> [scale] [cols]
const path = require('node:path');
const fs = require('node:fs');
const { withPage } = require('../lib/browser.cjs');
const mod = require(path.resolve(process.argv[2]));
const out = process.argv[3];
const times = process.argv[4].split(',').map(Number);
const scale = Number(process.argv[5] || 0.4);
const cols = Number(process.argv[6] || times.length);
const W = mod.W, H = mod.H, cw = W * scale, ch = H * scale + 40;
const rows = Math.ceil(times.length / cols);
let html = `<html><body style="margin:0;background:#ddd;width:${cols * cw}px">`;
times.forEach((t) => {
  html += `<div style="display:inline-block;width:${cw}px;height:${ch}px;vertical-align:top;font:20px Inter;text-align:center">` +
    mod.scene(t).replace('<svg ', `<svg style="width:${cw}px;height:${H * scale}px;display:block" `) + `${t.toFixed(2)} s</div>`;
});
html += '</body></html>';
withPage({ width: Math.ceil(cols * cw), height: Math.ceil(rows * ch) }, async (page) => {
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out, fullPage: true });
}).then(() => console.log('wrote', out));
