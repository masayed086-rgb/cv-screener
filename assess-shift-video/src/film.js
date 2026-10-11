// ASSESS SHIFT introduction film. window.seek(t) paints the exact frame for time t (seconds).
// Pure function of time: no timers, no randomness, no CSS transitions.
import { LAYOUT, CHAR_SIZE } from './layout.js';

const q = new URLSearchParams(location.search);
const FORMAT = q.get('format') === 'landscape' ? 'landscape' : 'vertical';
const LANG = q.get('lang') === 'ar' ? 'ar' : 'en';
const RENDER = q.get('render') === '1';
if (RENDER) document.body.classList.add('render');

const load = (p) => fetch(p).then((r) => r.json());
const [BRAND, TEXT, TIMING] = await Promise.all([
  load('../config/brand.json'), load(`../content/${LANG}.json`), load('../timing/scenes.json')
]);

const L = LAYOUT[FORMAT];
const RTL = TEXT.dir === 'rtl';
const DUR = TIMING.duration;

// ---------- helpers ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const easeOut = (x) => 1 - Math.pow(1 - clamp(x), 3);
const easeInOut = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const FADE = 0.36; // ~11 frames at 30 fps

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// Latin runs inside Arabic are isolated so product names keep their word order.
const bidi = (h) => (RTL ? h.replace(/[A-Za-z][A-Za-z0-9 .+&;-]*[A-Za-z0-9]/g, (m) => `<bdi>${m}</bdi>`) : h);
const rich = (s) => bidi(esc(s)).replace(/\*(.+?)\*/g, '<span class="acc">$1</span>').replace(/\n/g, '<br>');

function el(tag, cls, parent, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  if (parent) parent.appendChild(e);
  return e;
}
// Text and cards mirror for RTL; characters never do.
function place(e, b, { mirror = true } = {}) {
  e.style.top = b.y + 'px';
  if (b.w != null) e.style.width = b.w + 'px';
  if (b.h != null) e.style.height = b.h + 'px';
  if (RTL && mirror) e.style.right = b.x + 'px'; else e.style.left = b.x + 'px';
  if (b.size) e.style.fontSize = b.size + 'px';
  e.classList.add('abs');
  return e;
}
function centered(e, y) {
  Object.assign(e.style, { position: 'absolute', left: '0', right: '0', top: y + 'px', textAlign: 'center' });
  return e;
}
function character(parent, name, b, { mirror = false } = {}) {
  const [w0, h0] = CHAR_SIZE[name];
  const w = b.w, h = Math.round(w * h0 / w0);
  const wrap = el('div', 'char' + (mirror ? ' mirror' : ''), parent);
  Object.assign(wrap.style, { left: b.x + 'px', top: b.y + 'px', width: w + 'px', height: h + 'px' });
  const img = el('img', null, wrap); img.src = `../assets/characters/${name}.png`; img.alt = '';
  return wrap;
}
// Landscape keeps text and art in separate columns, so for RTL the art column swaps sides.
// The group moves as a whole (order and facing kept); images are never flipped.
const SWAP = RTL && FORMAT === 'landscape';
function rtlGroup(...wraps) {
  if (!SWAP) return;
  const xs = wraps.map((w) => [parseFloat(w.style.left), parseFloat(w.style.left) + parseFloat(w.style.width)]);
  const d = L.W - Math.min(...xs.map((x) => x[0])) - Math.max(...xs.map((x) => x[1]));
  wraps.forEach((w) => { w.style.left = parseFloat(w.style.left) + d + 'px'; });
}
function motif(parent, d, { mirror = SWAP } = {}) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'motif');
  svg.setAttribute('viewBox', `0 0 ${L.W} ${L.H}`);
  if (mirror && RTL) svg.style.transform = 'scaleX(-1)';
  const paths = d.split(/(?=M )/).map((seg) => {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', seg.trim()); p.setAttribute('pathLength', '1');
    p.style.strokeDasharray = '1'; p.style.strokeDashoffset = '1';
    svg.appendChild(p); return p;
  });
  parent.appendChild(svg);
  return { svg, paths };
}
function draw(m, p) { m.paths.forEach((path) => { path.style.strokeDashoffset = String(1 - clamp(p)); }); }

// Appear at tin (local s), optional leave at tout. Gentle slide + fade.
function show(e, lt, tin, { dur = 0.7, dy = 26, dx = 0, s0 = 1, tout = null, outDur = FADE, extra = '' } = {}) {
  const p = easeOut((lt - tin) / dur);
  let o = clamp((lt - tin) / Math.max(dur * 0.6, 0.3));
  if (tout != null) o *= 1 - clamp((lt - tout) / outDur);
  e.style.opacity = o.toFixed(3);
  const dxs = RTL && !e.classList.contains('char') ? -dx : dx;
  e.style.transform = `translate(${(dxs * (1 - p)).toFixed(2)}px, ${(dy * (1 - p)).toFixed(2)}px) scale(${(s0 + (1 - s0) * p).toFixed(4)}) ${extra}`;
}

// ---------- stage ----------
const root = document.documentElement.style;
for (const [k, v] of Object.entries(BRAND.colors)) root.setProperty('--' + k, v);

const stage = document.getElementById('stage');
stage.style.width = L.W + 'px'; stage.style.height = L.H + 'px';
stage.setAttribute('lang', TEXT.lang); stage.setAttribute('dir', TEXT.dir);

const S = {}; // scene id -> { node, start, end, anim(lt, d) }
const scene = (id, cls = '') => { const n = el('div', 'scene ' + cls, stage); n.dataset.id = id; return n; };

// S1 — the question
{
  const n = scene('s1'), c = L.s1;
  const m = motif(n, c.path);
  const ring = el('div', null, n);
  Object.assign(ring.style, { position: 'absolute', left: (SWAP ? L.W - c.ring.x : c.ring.x) - 14 + 'px', top: c.ring.y - 14 + 'px', width: '28px', height: '28px', borderRadius: '50%', border: '5px solid var(--burgundy)', boxSizing: 'border-box' });
  const nour = character(n, 'nour_seated', c.nour); rtlGroup(nour);
  const head = place(el('div', 'head', n, rich(TEXT.s1.head)), c.head);
  S.s1 = { node: n, anim(lt, d) {
    show(nour, lt, -1, { dur: 0.01 });
    nour.style.transformOrigin = '50% 100%';
    nour.style.transform = `scale(${(1 + 0.045 * easeInOut(lt / d)).toFixed(4)})`;
    show(head, lt, 0.5, { dy: 30 });
    draw(m, easeInOut((lt - 1.2) / 2.6));
    show(ring, lt, 3.7, { dy: 0, s0: 0.4, dur: 0.5 });
  } };
}

// S2 — the options
{
  const n = scene('s2'), c = L.s2;
  const m = motif(n, c.path);
  const nour = character(n, 'nour_options', c.nour); rtlGroup(nour);
  const head = place(el('div', 'head', n, rich(TEXT.s2.head)), c.head);
  const cards = TEXT.s2.options.map((t, i) => {
    const k = place(el('div', 'card option', n), { x: c.cards.xs[i], y: c.cards.y, w: c.cards.w, h: c.cards.h });
    el('div', 't', k, esc(t)); return k;
  });
  S.s2 = { node: n, anim(lt) {
    show(nour, lt, 0.1, { dx: -30, dy: 0, dur: 0.9 });
    show(head, lt, 0.3);
    draw(m, easeInOut((lt - 0.4) / 3));
    cards.forEach((k, i) => {
      show(k, lt, 1.0 + i * 0.45, { dy: 34 });
      // Nour examines each option in turn: a quiet rose wash, never a ranking.
      const a = clamp((lt - (3.6 + i * 1.5)) / 0.4) * (1 - clamp((lt - (4.9 + i * 1.5)) / 0.4));
      k.style.background = `color-mix(in srgb, var(--softRose) ${Math.round(a * 100)}%, var(--white))`;
      k.style.borderColor = a > 0.01 ? `color-mix(in srgb, var(--burgundy) ${Math.round(a * 45)}%, #E6E1DA)` : '#E6E1DA';
    });
  } };
}

// S3 — service name
{
  const n = scene('s3'), c = L.s3;
  const m = motif(n, c.path);
  const nour = character(n, 'nour_3q', c.nour); rtlGroup(nour);
  const center = c.align === 'center';
  const logo = el('img', null, n); logo.src = '../' + BRAND.logo.onLight; logo.alt = 'ASSESS';
  logo.style.height = c.logo.h + 'px';
  const word = el('div', 'lock-word', n, 'SHIFT'); word.style.fontSize = c.word.size + 'px';
  const desc = el('div', 'lock-desc', n, esc(BRAND.descriptor[LANG]));
  const endo = el('div', 'lock-endo', n, esc(BRAND.endorsement[LANG]));
  const tag = el('div', 'lock-tag', n, esc(TEXT.s3.tagline));
  if (center) {
    const lw = el('div', null, n); centered(lw, c.logo.y); lw.appendChild(logo);
    centered(word, c.word.y); centered(desc, c.desc.y); centered(endo, c.endo.y); centered(tag, c.tag.y);
    S.s3 = { parts: [lw, word, desc, endo, tag] };
  } else {
    place(logo, { x: c.logo.x, y: c.logo.y }); place(word, c.word); place(desc, c.desc); place(endo, c.endo); place(tag, c.tag);
    S.s3 = { parts: [logo, word, desc, endo, tag] };
  }
  const [a, b, d1, e1, f1] = S.s3.parts;
  S.s3 = { node: n, anim(lt) {
    show(nour, lt, -1, { dur: 0.01 });
    draw(m, easeInOut((lt - 0.2) / 2.2));
    show(a, lt, 1.3); show(b, lt, 1.8, { dy: 40 }); show(d1, lt, 2.4); show(e1, lt, 2.8); show(f1, lt, 4.2);
  } };
}

// S4 — understand yourself at work
{
  const n = scene('s4'), c = L.s4;
  const m = motif(n, c.path);
  const nour = character(n, 'nour_seated', c.nour);
  const samir = character(n, 'samir_seated', c.samir, { mirror: true }); rtlGroup(nour, samir);
  const coach = place(el('div', 'tag', n, esc(TEXT.s4.coach)), { x: c.coachTag.x, y: c.coachTag.y }, { mirror: false });
  if (SWAP) coach.style.left = c.coachTag.x + (L.W - c.nour.x - (c.samir.x + c.samir.w)) + 'px';
  const head = place(el('div', 'head', n, rich(TEXT.s4.head)), c.head);
  const skels = [];
  const cards = TEXT.s4.cards.map((cd, i) => {
    const k = place(el('div', 'card', n), { x: c.cards.xs[i], y: c.cards.y, w: c.cards.w, h: c.cards.h });
    k.style.justifyContent = 'flex-start'; k.style.paddingTop = '34px'; k.style.gap = '14px';
    el('div', 't', k, esc(cd.title)); el('div', 's', k, esc(cd.sub));
    const box = el('div', null, k); Object.assign(box.style, { display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' });
    [0.92, 0.7, 0.82].forEach((w, j) => { const s = el('div', 'skel' + (j === 1 ? ' b' : ''), box); skels.push({ s, w, i, j }); });
    return k;
  });
  S.s4 = { node: n, anim(lt) {
    show(head, lt, 0.3);
    show(nour, lt, 0.1, { dy: 0, dx: -24, dur: 0.9 });
    cards.forEach((k, i) => show(k, lt, 1.2 + i * 0.6, { dy: 34 }));
    // abstract profile lines: no scores, no data
    skels.forEach(({ s, w, i, j }) => { s.style.width = (w * 100 * easeOut((lt - (2.0 + i * 0.6 + j * 0.25)) / 1.1)).toFixed(1) + '%'; });
    show(samir, lt, 4.2, { dy: 0, dx: 60, dur: 1.2 });
    show(coach, lt, 5.2, { dy: 14 });
    draw(m, easeInOut((lt - 6.0) / 2.8));
  } };
}

// S5 — compare directions
{
  const n = scene('s5'), c = L.s5;
  const m = motif(n, c.path);
  const nour = character(n, 'nour_options', c.nour);
  const samir = character(n, 'samir_front', c.samir); rtlGroup(nour, samir);
  const head = place(el('div', 'head', n, rich(TEXT.s5.head)), c.head);
  const cards = TEXT.s2.options.map((t, i) => {
    const k = place(el('div', 'card option', n), { x: c.cards.xs[i], y: c.cards.y, w: c.cards.w, h: c.cards.h });
    el('div', 't', k, esc(t)); return k;
  });
  const row = el('div', null, n);
  const rowStyle = { position: 'absolute', top: c.chips.y + 'px', display: 'flex', gap: '18px' };
  if (FORMAT === 'vertical') Object.assign(rowStyle, { left: '0', right: '0', justifyContent: 'center' });
  else Object.assign(rowStyle, RTL ? { right: c.cards.xs[0] + 'px' } : { left: c.cards.xs[0] + 'px' });
  Object.assign(row.style, rowStyle);
  const chips = TEXT.s5.criteria.map((t) => { const ch = el('div', 'chip', row, esc(t)); ch.style.position = 'relative'; return ch; });
  const midX = c.cards.xs[1] + c.cards.w / 2;
  const chosen = el('div', 'tag', n, esc(TEXT.s5.chosen));
  Object.assign(chosen.style, { left: midX + 'px', top: c.chosen.y + 'px', marginLeft: '-200px', width: '400px', textAlign: 'center', boxSizing: 'border-box', background: 'transparent', color: 'var(--burgundy)', padding: '0' });
  S.s5 = { node: n, anim(lt) {
    show(head, lt, 0.3);
    show(nour, lt, 0.1, { dy: 0, dx: -24, dur: 0.9 });
    show(samir, lt, 0.4, { dy: 0, dx: 24, dur: 0.9 });
    // equal cards first, then the comparison, then her highlighted direction
    const pick = easeInOut((lt - 8.6) / 0.9);
    cards.forEach((k, i) => {
      show(k, lt, 0.9 + i * 0.3, { dy: 30, extra: i === 1 ? `scale(${(1 + 0.05 * pick).toFixed(4)})` : '' });
      if (i !== 1) k.style.opacity = (parseFloat(k.style.opacity) * (1 - 0.45 * pick)).toFixed(3);
      k.style.borderColor = i === 1 && pick > 0 ? `color-mix(in srgb, var(--burgundy) ${Math.round(pick * 100)}%, #E6E1DA)` : '#E6E1DA';
      k.style.borderWidth = i === 1 ? (2 + 2 * pick).toFixed(2) + 'px' : '2px';
    });
    chips.forEach((ch, i) => show(ch, lt, 2.8 + i * 0.4, { dy: 20, s0: 0.85 }));
    draw(m, easeInOut((lt - 4.6) / 2.6));
    m.svg.style.opacity = (1 - 0.7 * pick).toFixed(3);
    show(chosen, lt, 9.2, { dy: 12 });
  } };
}

// S6 — transition plan
{
  const n = scene('s6'), c = L.s6;
  const nour = character(n, 'nour_seated', c.nour); rtlGroup(nour);
  const head = place(el('div', 'head', n, rich(TEXT.s6.head)), c.head);
  const xs = RTL ? c.steps.xs.map((x) => L.W - x) : c.steps.xs;
  const x0 = xs[0], x1 = xs[xs.length - 1];
  const m = motif(n, `M ${x0} ${c.steps.y} L ${x1} ${c.steps.y}`, { mirror: false });
  const base = motif(n, `M ${x0} ${c.steps.y} L ${x1} ${c.steps.y}`, { mirror: false });
  base.paths[0].style.stroke = '#E7C9CC'; base.paths[0].style.strokeDashoffset = '0';
  n.insertBefore(base.svg, m.svg);
  const dots = xs.map((x) => { const d = el('div', 'step-dot', n); d.style.left = x + 'px'; d.style.top = c.steps.y + 'px'; return d; });
  const labels = TEXT.s6.steps.map((t, i) => { const l = el('div', 'step-label', n, esc(t)); l.style.left = xs[i] + 'px'; l.style.top = c.steps.y + 36 + 'px'; return l; });
  S.s6 = { node: n, anim(lt) {
    show(head, lt, 0.3);
    show(nour, lt, -1, { dur: 0.01 });
    show(base.svg, lt, 0.8, { dy: 0 });
    const p = easeInOut((lt - 1.4) / 6.4);
    draw(m, p);
    dots.forEach((d, i) => {
      const at = i / (dots.length - 1);
      show(d, lt, 0.9 + i * 0.15, { dy: 0, s0: 0.5, dur: 0.5 });
      d.classList.toggle('on', p >= at - 0.001 && lt > 1.4);
      show(labels[i], lt, 1.4 + at * 6.4 - 0.2, { dy: 16 });
    });
  } };
}

// S7 — three journeys (equal cards)
{
  const n = scene('s7'), c = L.s7;
  const eye = place(el('div', 'eyebrow', n, esc(TEXT.s7.eyebrow)), c.eyebrow);
  const cards = TEXT.s7.packages.map((p, i) => {
    const b = c.cards ? { x: c.cards.x, y: c.cards.ys[i], w: c.cards.w, h: c.cards.h } : { x: c.row.xs[i], y: c.row.y, w: c.row.w, h: c.row.h };
    const k = place(el('div', 'card pkg', n), b);
    el('div', 'l', k, esc(p.label)); el('div', 't', k, esc(p.name)); el('div', 'rule', k); el('div', 's', k, esc(p.sessions));
    if (p.name.match(/[A-Za-z]/)) k.querySelector('.t').setAttribute('dir', 'ltr');
    if (RTL) k.querySelector('.t').style.textAlign = 'right';
    return k;
  });
  S.s7 = { node: n, anim(lt) {
    show(eye, lt, 0.2);
    cards.forEach((k, i) => show(k, lt, 0.6 + i * 0.4, { dy: 36 }));
  } };
}

// S8 — call to action
{
  const n = scene('s8', 'dark'), c = L.s8;
  const m = motif(n, c.path, { mirror: true });
  const center = c.align === 'center';
  const logo = el('img', null, n); logo.src = '../' + BRAND.logo.onDark; logo.alt = 'ASSESS'; logo.style.height = c.logo.h + 'px';
  let logoBox = logo;
  if (center) { logoBox = el('div', null, n); centered(logoBox, c.logo.y); logoBox.appendChild(logo); } else place(logo, { x: c.logo.x, y: c.logo.y });
  const tag = place(el('div', 'head', n, rich(TEXT.s8.tagline)), c.tag);
  const cta = place(el('div', 'head', n, rich(TEXT.s8.cta)), c.cta);
  const btn = el('div', 'button', n, esc(TEXT.s8.button));
  const hasUrl = !!BRAND.cta.url;
  const url = el('div', 'url' + (hasUrl ? '' : ' missing'), n, esc(hasUrl ? BRAND.cta.url : TEXT.s8.noUrl));
  if (center) {
    tag.style.textAlign = cta.style.textAlign = 'center';
    for (const [e, y] of [[btn, c.button.y], [url, c.url.y]]) Object.assign(e.style, { left: '50%', top: y + 'px', translate: '-50% 0' });
  } else { place(btn, { x: c.button.x, y: c.button.y }); place(url, { x: c.url.x, y: c.url.y }); }
  S.s8 = { node: n, anim(lt) {
    draw(m, easeInOut((lt - 0.2) / 2.4));
    show(logoBox, lt, 0.3); show(tag, lt, 0.8, { dy: 34 }); show(cta, lt, 1.7, { dy: 30 });
    show(btn, lt, 2.3, { dy: 24, s0: 0.92 }); show(url, lt, 2.9, { dy: 14 });
  } };
}

// captions + watermark
const cap = el('div', null, stage); cap.id = 'caption';
cap.style.bottom = (L.H - L.caption.bottom) + 'px';
const capText = el('span', null, cap);
capText.style.fontSize = L.caption.size + 'px'; capText.style.maxWidth = L.caption.maxW + 'px';
if (BRAND.preview.watermark) {
  const wm = el('div', null, stage, esc(TEXT.preview)); wm.id = 'watermark'; wm.style.top = L.watermark.y + 'px';
}
const WM = document.getElementById('watermark');

for (const sc of TIMING.scenes) Object.assign(S[sc.id], { start: sc.start, end: sc.end });

// ---------- seek ----------
let lastCap = -1;
function seek(t) {
  t = clamp(t, 0, DUR);
  for (const sc of TIMING.scenes) {
    const s = S[sc.id];
    const first = sc.start === 0, last = sc.end >= DUR;
    const vin = first ? 1 : clamp((t - s.start + FADE / 2) / FADE);
    const vout = last ? 1 : clamp((s.end + FADE / 2 - t) / FADE);
    const v = Math.min(vin, vout);
    s.node.style.opacity = v.toFixed(3);
    s.node.style.visibility = v > 0 ? 'visible' : 'hidden';
    if (v > 0) s.anim(t - s.start, s.end - s.start);
  }
  // captions: one thought at a time, short fades
  let ci = -1, co = 0;
  TEXT.captions.forEach((c, i) => {
    if (t >= c.start - 0.12 && t <= c.end + 0.12) { ci = i; co = Math.min(clamp((t - c.start + 0.12) / 0.24), clamp((c.end + 0.12 - t) / 0.24)); }
  });
  if (ci !== lastCap) { capText.innerHTML = ci >= 0 ? bidi(esc(TEXT.captions[ci].text)) : ''; lastCap = ci; }
  cap.style.opacity = ci >= 0 ? co.toFixed(3) : '0';
  if (WM) WM.style.color = t >= S.s8.start ? 'rgba(255,255,255,.6)' : '';
  window.__t = t;
}
window.seek = seek;
window.__meta = { format: FORMAT, lang: LANG, W: L.W, H: L.H, duration: DUR, fps: TIMING.fps, scenes: TIMING.scenes, captions: TEXT.captions };

// wait for fonts and images before declaring ready
await document.fonts.ready;
await Promise.all([...document.images].map((im) => im.decode().catch(() => {})));
seek(0);
window.__ready = true;

// ---------- interactive preview (not used when rendering) ----------
if (!RENDER) {
  const ui = document.getElementById('ui'), wrap = document.getElementById('wrap');
  const fit = () => { const s = Math.min((innerWidth - 32) / L.W, (innerHeight - ui.offsetHeight - 24) / L.H, 1); stage.style.transform = `scale(${s})`; wrap.style.height = L.H * s + 'px'; };
  addEventListener('resize', fit); fit();
  const range = document.getElementById('t'), lab = document.getElementById('tl'), btn = document.getElementById('play');
  range.max = DUR;
  document.getElementById('fmt').value = FORMAT; document.getElementById('lang').value = LANG;
  const go = () => { const p = new URLSearchParams({ format: document.getElementById('fmt').value, lang: document.getElementById('lang').value }); location.search = p; };
  document.getElementById('fmt').onchange = go; document.getElementById('lang').onchange = go;
  const sel = document.getElementById('scene');
  TIMING.scenes.forEach((s) => { const o = el('option', null, sel, `${s.id} · ${s.name} (${s.start}s)`); o.value = s.start; });
  let playing = false, t0 = 0, p0 = 0;
  const tick = (now) => { if (!playing) return; const t = p0 + (now - t0) / 1000; if (t >= DUR) { playing = false; btn.textContent = 'Play'; } seek(t); range.value = t; lab.textContent = t.toFixed(1) + 's'; requestAnimationFrame(tick); };
  btn.onclick = () => { playing = !playing; btn.textContent = playing ? 'Pause' : 'Play'; if (playing) { p0 = window.__t >= DUR ? 0 : window.__t; t0 = performance.now(); requestAnimationFrame(tick); } };
  range.oninput = () => { playing = false; btn.textContent = 'Play'; seek(+range.value); lab.textContent = (+range.value).toFixed(1) + 's'; };
  sel.onchange = () => { range.value = sel.value; range.oninput(); };
}
