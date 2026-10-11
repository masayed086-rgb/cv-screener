// Builds the deterministic render page: local Manrope webfonts, the rig scripts
// inlined, and window.seek(t) / window.ready. Nothing is fetched from the network.
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.join(__dirname, '..');
const FONTS = path.join(ROOT, '..', 'fonts');

function fontFace(weight) {
  const b64 = fs.readFileSync(path.join(FONTS, `manrope-latin-${weight}-normal.woff2`)).toString('base64');
  return `@font-face{font-family:Manrope;font-weight:${weight};font-style:normal;src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
}

// entry: 'story' (10 s test, style flat|whiteboard) or 'acting' (5 s seated test)
function buildPage(entry, style) {
  const js = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
  const sceneCall = entry === 'acting'
    ? 'ASActing.scene(t, { label: false })'
    : `ASStory.scene(t, { style: ${JSON.stringify(style)} })`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${[500, 600, 700, 800].filter((w) => fs.existsSync(path.join(FONTS, `manrope-latin-${w}-normal.woff2`))).map(fontFace).join('\n')}
html,body{margin:0;padding:0;background:#F7F3EA;overflow:hidden}
#stage svg{display:block}
</style></head><body><div id="stage"></div>
<script>${js('rig.js')}</script>
<script>${js('acting.js')}</script>
<script>${js('story.js')}</script>
<script>
  const stage = document.getElementById('stage');
  window.seek = (t) => {
    stage.innerHTML = ${sceneCall};
    ${style === 'whiteboard' ? 'ASStory.revealWhiteboard(stage.firstElementChild, t);' : ''}
    return true;
  };
  window.ready = Promise.all([
    document.fonts.load('800 80px Manrope'), document.fonts.load('700 80px Manrope'),
    document.fonts.load('600 80px Manrope'), document.fonts.load('500 80px Manrope'),
  ]).then(() => document.fonts.ready).then(() => { window.seek(0); return true; });
</script></body></html>`;
}

function exePath() {
  const p = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
  return fs.existsSync(p) ? p : undefined;
}

module.exports = { buildPage, exePath };
