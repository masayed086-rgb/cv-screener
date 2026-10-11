// Quick look: node rig/preview.cjs <out.png> [t]
const fs = require('node:fs');
const R = require('./rig.js');
const A = require('./acting.js');
const { withPage } = require('./lib/browser.cjs');

const outPng = process.argv[2] || 'out/preview.png';
const t = Number(process.argv[3] || 0);
const W = 2200, H = 1000;
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#F7F3EA"/>`;
svg += R.renderCharacter('coach-01', Object.assign(A.standing('coach-01'), { x: 200, y: 520, s: 1 }), { prefix: 'a' });
svg += R.renderCharacter('coachee-01', Object.assign(A.standing('coachee-01'), { x: 520, y: 500, s: 1 }), { prefix: 'b' });
svg += R.renderCharacter('coach-01', Object.assign(A.standing('coach-01'), { x: 820, y: 520, s: 1 }), { prefix: 'c', style: 'whiteboard' });
svg += R.renderCharacter('coachee-01', Object.assign(A.standing('coachee-01'), { x: 1120, y: 500, s: 1 }), { prefix: 'd', style: 'whiteboard' });
svg += `<g transform="translate(1260 -560) scale(0.5)">${A.scene(t).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>`;
svg += '</svg>';
withPage({ width: W, height: H }, async (page) => {
  await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
  fs.mkdirSync(require('node:path').dirname(outPng), { recursive: true });
  await page.screenshot({ path: outPng });
}).then(() => console.log('wrote', outPng));
