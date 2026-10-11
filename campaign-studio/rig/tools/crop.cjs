// Render one scene frame and crop a region: node rig/tools/crop.cjs <module> <out> <t> x,y,w,h [zoom]
const path = require('node:path');
const { withPage } = require('../lib/browser.cjs');
const mod = require(path.resolve(process.argv[2]));
const [x, y, w, h] = process.argv[5].split(',').map(Number);
const z = Number(process.argv[6] || 1);
withPage({ width: Math.round(w * z), height: Math.round(h * z) }, async (page) => {
  const svg = mod.scene(Number(process.argv[4])).replace(/viewBox="[^"]*" width="\d+" height="\d+"/, `viewBox="${x} ${y} ${w} ${h}" width="${w * z}" height="${h * z}"`);
  await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
  await page.screenshot({ path: process.argv[3] });
}).then(() => console.log('wrote', process.argv[3]));
