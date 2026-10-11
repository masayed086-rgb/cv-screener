// Pixel test: the same t must give the same pixels whatever was rendered before it.
// node rig/tools/seek-order.cjs <story|acting> <flat|whiteboard>
const crypto = require('node:crypto');
const { buildPage } = require('../lib/page.cjs');
const { withPage } = require('../lib/browser.cjs');
const [entry, style] = process.argv.slice(2);
const times = [0, 0.4, 1, 1.55, 3, 3.6, 5.2, 6.3, 7, 7.4, 9.5].filter((t) => entry !== 'acting' || t <= 5);
withPage({ width: 1080, height: 1920 }, async (page) => {
  await page.setContent(buildPage(entry, style));
  await page.evaluate(() => window.ready);
  const shot = async (t) => { await page.evaluate((x) => window.seek(x), t); return crypto.createHash('sha1').update(await page.screenshot()).digest('hex'); };
  const fwd = {}; for (const t of times) fwd[t] = await shot(t);
  const order = [...times].reverse(); order.splice(2, 0, ...order.splice(0, 2)); // reverse, then shuffle the first two
  let same = 0; for (const t of order) if ((await shot(t)) === fwd[t]) same++;
  console.log(`${entry}/${style}: ${same}/${times.length} frames pixel-identical across seek orders (${order.join(', ')})`);
  if (same !== times.length) process.exitCode = 1;
});
