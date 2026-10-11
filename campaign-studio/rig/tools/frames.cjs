// Seek the render page to given times and save PNG frames (also used for posters).
// node rig/tools/frames.cjs <story|acting> <flat|whiteboard> <outDir> <t1,t2,...> [prefix]
const fs = require('node:fs');
const path = require('node:path');
const { buildPage } = require('../lib/page.cjs');
const { withPage } = require('../lib/browser.cjs');
const [entry, style, dir, list, prefix = 'f'] = process.argv.slice(2);
fs.mkdirSync(dir, { recursive: true });
withPage({ width: 1080, height: 1920 }, async (page) => {
  await page.setContent(buildPage(entry, style));
  await page.evaluate(() => window.ready);
  for (const t of list.split(',').map(Number)) {
    await page.evaluate((x) => window.seek(x), t);
    await page.screenshot({ path: path.join(dir, `${prefix}-${t.toFixed(2)}.png`) });
  }
  console.log('frames written to', dir);
}).catch((e) => { console.error(e); process.exit(1); });
