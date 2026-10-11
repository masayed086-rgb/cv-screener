// Loads Playwright from the project or, failing that, from the global install.
const path = require('node:path');
function loadPlaywright() {
  try { return require('playwright'); } catch (_) { /* fall through */ }
  const { execSync } = require('node:child_process');
  const globalRoot = execSync('npm root -g').toString().trim();
  return require(path.join(globalRoot, 'playwright'));
}
async function withPage(viewport, fn) {
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    return await fn(page);
  } finally {
    await browser.close();
  }
}
module.exports = { withPage };
