/* ASSESS SHIFT 10-second character test: "What comes next?"
 *
 * One performance timeline, two looks:
 *   scene(t, { style: 'flat' })        polished flat illustration
 *   scene(t, { style: 'whiteboard' })  navy line drawing; the browser-side
 *                                      revealWhiteboard(svg, t) then draws every
 *                                      stroke in order with real dash reveals.
 *
 * 0-3 s   the coachee considers three possible directions (eyes lead, head follows)
 * 3-7 s   the coach listens, then asks with one open-hand gesture; the coachee
 *         reflects (hand to chin), looks up and points: the teal path is chosen
 * 7-10 s  end card: ASSESS SHIFT, Book a Chemistry Session
 *
 * scene(t) is a pure function of t. Silent, closed-mouth acting: no lip sync.
 */
(function (root) {
  'use strict';
  const isNode = typeof module !== 'undefined' && module.exports;
  const R = isNode ? require('./rig.js') : root.ASRig;
  const A = isNode ? require('./acting.js') : root.ASActing;
  const { renderCharacter, CHAR, COLORS: C } = R;
  const { ikArm, lapArms, offerArm, mixArm, blinkAt, chinArm, ease, inv, ap, track } = A;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const n = (v) => Math.round(v * 100) / 100;
  const W = 1080, H = 1920, FLOOR = 1660, SCALE = 1.05, DURATION = 10;
  const PLACE = { 'coach-01': 200, 'coachee-01': 880 };
  const END = 7.0; // end card transition start
  const FONT = "Manrope, 'Noto Sans', sans-serif";

  /* ---------- the three directions ---------- */
  const NODE = [540, 740]; // decision point (amber once chosen)
  const TANGLE = 'M462,902 C418,922 378,882 418,850 C460,818 500,870 452,880 C400,890 382,842 420,812 C452,788 500,802 520,784 C534,772 540,758 540,740';
  const BRANCH = {
    A: { d: 'M540,740 C470,710 330,660 300,580 C285,540 250,512 214,504', tip: [214, 504], label: 'New role', anchor: 'start', lx: 150, ly: 470 },
    B: { d: 'M540,740 C540,680 520,630 540,580 C556,536 540,494 540,452', tip: [540, 452], label: 'Lead a team', anchor: 'middle', lx: 540, ly: 412 },
    C: { d: 'M540,740 C610,710 760,670 790,590 C806,546 840,518 870,504', tip: [870, 504], label: 'New field', anchor: 'end', lx: 930, ly: 472 },
  };
  const CHOSEN = 'B';
  const PATH_T = { tangle: [0.15, 0.95], A: [0.55, 1.15], B: [0.8, 1.4], C: [1.05, 1.65], teal: [6.05, 6.7], node: 6.2 };

  /* ---------- placement ---------- */
  const footOffset = {};
  function rootY(id) {
    if (footOffset[id] == null) {
      const out = {};
      renderCharacter(id, Object.assign(A.seated(id), { x: 0, y: 0, s: SCALE }), { out });
      const p = R.worldPoint(out, `foot-${R.SIDES[id].N}`, 0, CHAR[id].footDrop);
      footOffset[id] = p[1];
    }
    return FLOOR - footOffset[id];
  }
  function base(id, t, breathPhase, breathPeriod) {
    const p = A.seated(id);
    p.x = PLACE[id]; p.y = rootY(id); p.s = SCALE;
    p.breath = Math.sin((2 * Math.PI * (t + breathPhase)) / breathPeriod);
    return p;
  }

  /* ---------- coachee-01 ---------- */
  // Gaze targets in his own frame: gazeX + = toward the coach, gazeY - = up.
  // head + = chin down, - = chin up.
  const LOOK = {
    down: { gx: 0.15, gy: 0.75, head: 3, pitch: 0.6, turn: 0 },
    A: { gx: 0.95, gy: -0.9, head: -4.5, pitch: -0.7, turn: 0.35 },
    B: { gx: 0.35, gy: -1, head: -6, pitch: -1, turn: 0.1 },
    C: { gx: -0.35, gy: -0.95, head: -5.5, pitch: -0.8, turn: -0.3 },
    coach: { gx: 0.9, gy: 0.05, head: 0, pitch: 0, turn: 0.25 },
  };
  // [eye time, target]; the head follows each eye move 0.14 s later over 0.32 s.
  const COACHEE_LOOKS = [[0, 'down'], [0.86, 'A'], [1.56, 'B'], [2.22, 'C'], [2.86, 'coach'], [4.5, 'down'], [5.56, 'B']];
  const EYE_MOVE = 0.1, HEAD_LAG = 0.14, HEAD_MOVE = 0.32;
  function lookTrack(looks, t, key, lag, dur) {
    let v = LOOK[looks[0][1]][key];
    for (let i = 1; i < looks.length; i++) {
      const t0 = looks[i][0] + lag;
      if (t < t0) break;
      v = lerp(v, LOOK[looks[i][1]][key], ease((t - t0) / dur));
    }
    return v;
  }
  const COACHEE_BLINKS = [0.62, 2.9, 5.28, 6.86, 8.6];
  const CHIN = [4.68, 5.18, 5.74, 6.1]; // reach start, contact, release, back in lap
  const POINT = [5.86, 5.98, 6.33, 6.55]; // anticipation, move, overshoot, settle

  function coacheePose(t) {
    const id = 'coachee-01';
    const p = base(id, t, 1.3, 3.9);
    const gx = lookTrack(COACHEE_LOOKS, t, 'gx', 0, EYE_MOVE), gy = lookTrack(COACHEE_LOOKS, t, 'gy', 0, EYE_MOVE);
    p.head = lookTrack(COACHEE_LOOKS, t, 'head', HEAD_LAG, HEAD_MOVE);
    const pitch = lookTrack(COACHEE_LOOKS, t, 'pitch', HEAD_LAG, HEAD_MOVE);
    const turn = lookTrack(COACHEE_LOOKS, t, 'turn', HEAD_LAG, HEAD_MOVE);
    // torso trails the head: settles back while scanning, leans in to listen and to choose
    p.torso = track([[0, 0.6], [0.9, -0.4], [2.9, -0.4], [3.4, 1.4], [4.5, 1.4], [4.9, 2.4], [5.6, 2.4], [6.0, 0.2], [6.5, -0.6]], t);
    p.face = {
      brow: track([[0, 0.05], [0.86, 0.05], [1.0, 0.3], [2.8, 0.25], [3.2, 0.1], [3.5, 0.3], [3.9, 0.12], [5.56, 0.1], [5.7, 0.35], [6.6, 0.15]], t),
      browIn: track([[0, 0.45], [0.9, 0.55], [2.6, 0.6], [3.1, 0.2], [4.5, 0.2], [4.8, 0.5], [5.5, 0.5], [5.8, 0.05], [6.5, -0.15]], t),
      lid: track([[0, 0.4], [0.86, 0.4], [0.96, 0.1], [2.86, 0.12], [4.5, 0.12], [4.62, 0.48], [5.56, 0.48], [5.66, 0.08], [6.7, 0.16]], t),
      blink: blinkAt(COACHEE_BLINKS, t),
      smile: track([[0, -0.1], [2.8, -0.15], [3.5, 0.08], [4.5, 0.05], [5.0, 0.0], [6.3, 0.05], [6.8, 0.55]], t),
      mouthAsym: track([[0, -0.3], [2.8, -0.3], [3.4, 0], [6.4, 0], [6.8, 0.3]], t),
      gazeX: gx, gazeY: gy, pitch, turn,
    };
    // reflection: near hand to the chin once
    const wc = track([[CHIN[0], 0], [CHIN[1], 1], [CHIN[2], 1], [CHIN[3], 0]], t);
    if (wc > 0) p.armN = mixArm(p.armN, chinArm(id, p), wc);
    // decision: far arm points at the chosen direction
    if (t >= POINT[0]) {
      const rest = p.armF;
      const target = pointArm(id, p, BRANCH[CHOSEN].tip, 0.9);
      const over = pointArm(id, p, BRANCH[CHOSEN].tip, 0.95, -3);
      const ant = { sh: rest.sh - 5, el: rest.el + 8, wr: rest.wr, hand: 'relaxed' };
      if (t < POINT[1]) p.armF = mixArm(rest, ant, ease((t - POINT[0]) / (POINT[1] - POINT[0])));
      else if (t < POINT[2]) p.armF = mixArm(ant, over, ease((t - POINT[1]) / (POINT[2] - POINT[1])));
      else if (t < POINT[3]) p.armF = mixArm(over, target, ease((t - POINT[2]) / (POINT[3] - POINT[2])));
      else p.armF = target;
    }
    return p;
  }
  // Far arm extended toward a world point: two-bone IK with a softly bent elbow.
  function pointArm(id, p, tipW, reachK, extraDeg = 0) {
    const out = {};
    renderCharacter(id, p, { out });
    const side = R.SIDES[id].F;
    const sh = R.worldPoint(out, `upper-arm-${side}`);
    const dx = tipW[0] - sh[0], dy = tipW[1] - sh[1], L = Math.hypot(dx, dy);
    const sp = CHAR[id], reach = (sp.upper + sp.fore) * SCALE * reachK;
    const wristW = [sh[0] + (dx / L) * reach, sh[1] + (dy / L) * reach];
    const wristT = ap(inv(out.mats.torso), wristW);
    // the index finger aims at the target: absolute hand angle in the torso frame
    const tipT = ap(inv(out.mats.torso), tipW);
    const aim = (Math.atan2(-(tipT[0] - wristT[0]), tipT[1] - wristT[1]) * 180) / Math.PI;
    return ikArm(id, 'F', wristT, aim + extraDeg, 'down', 'point');
  }

  /* ---------- coach-01 ---------- */
  const COACH_BLINKS = [1.32, 3.42, 4.96, 6.3, 8.2];
  const ASK = [3.26, 3.38, 3.73, 3.95, 4.62, 5.25]; // anticipation, move, overshoot, settle, hold end, relaxed
  function coachPose(t) {
    const id = 'coach-01';
    const p = base(id, t, 0, 3.6);
    // she follows his look at the directions briefly, then returns to him
    const gazeY = track([[0, 0.12], [1.62, 0.12], [1.72, -0.55], [2.3, -0.55], [2.42, 0.1], [6.12, 0.1], [6.22, -0.6], [6.42, -0.6], [6.52, 0.12]], t);
    const gazeX = track([[0, 0.85], [1.62, 0.85], [1.72, 0.55], [2.3, 0.55], [2.42, 0.85]], t);
    const nod1 = track([[2.62, 0], [2.78, 1], [3.02, 0]], t);
    const nod2 = track([[6.62, 0], [6.8, 1], [7.05, 0]], t);
    p.head = track([[0, 1], [1.86, 1], [2.1, -2], [2.42, -2], [2.6, 1.2], [3.2, 1.2], [3.5, 2.8], [4.7, 2.8], [5.2, 1.4], [6.36, 1.4], [6.5, -1], [6.6, 0.8]], t) + (nod1 + nod2) * 3;
    p.torso = track([[0, 0.4], [1.0, 1.4], [3.2, 1.4], [3.38, 1.0], [3.8, 2.6], [4.7, 2.6], [5.3, 1.6], [6.6, 2.0]], t);
    let a = p.armF;
    const rest = p.armF;
    const ant = { sh: rest.sh + 4, el: rest.el + 6, wr: rest.wr + 4, hand: 'relaxed' };
    const out = offerArm(id, 0), over = offerArm(id, 1);
    if (t >= ASK[0]) {
      if (t < ASK[1]) a = mixArm(rest, ant, ease((t - ASK[0]) / (ASK[1] - ASK[0])));
      else if (t < ASK[2]) a = mixArm(ant, over, ease((t - ASK[1]) / (ASK[2] - ASK[1])));
      else if (t < ASK[3]) a = mixArm(over, out, ease((t - ASK[2]) / (ASK[3] - ASK[2])));
      else if (t < ASK[4]) a = out;
      else a = mixArm(out, rest, ease((t - ASK[4]) / (ASK[5] - ASK[4])));
    }
    p.armF = a;
    p.face = {
      brow: track([[0, 0.15], [3.2, 0.15], [3.45, 0.5], [4.6, 0.42], [5.1, 0.15], [6.5, 0.2], [6.8, 0.3]], t),
      browIn: 0.1,
      lid: track([[0, 0.14], [4.7, 0.14], [5.0, 0.2], [6.6, 0.24]], t),
      blink: blinkAt(COACH_BLINKS, t),
      smile: track([[0, 0.4], [3.2, 0.4], [3.5, 0.28], [4.7, 0.3], [5.3, 0.4], [6.6, 0.4], [6.9, 0.66]], t),
      mouthAsym: track([[0, 0], [3.3, 0.35], [4.7, 0.2], [5.3, 0]], t),
      gazeX, gazeY,
      pitch: track([[0, 0.1], [1.86, 0.1], [2.1, -0.4], [2.42, -0.4], [2.6, 0.1], [3.4, -0.15], [4.7, -0.1], [5.1, 0.1], [6.4, -0.3], [6.6, 0.1]], t) + (nod1 + nod2) * 0.6,
      turn: track([[0, 0.2], [3.3, 0.2], [3.5, 0.38], [4.8, 0.2]], t),
    };
    return p;
  }

  /* ---------- set ---------- */
  function chair(x, seatY, facing, wb) {
    const f = (v) => n(x + v * facing * SCALE);
    const g = (v) => n(seatY + v * SCALE);
    const col = wb ? C.ivory : (facing > 0 ? '#2D6F72' : '#D6CFC2');
    const shade = facing > 0 ? '#1F5457' : '#B9B0A0';
    const ln = wb ? C.navy : C.line, lw = wb ? 5 : 2;
    const leg = (a, b) => `<path data-c="prop" d="M${f(a)},${FLOOR - 4} L${f(b)},${g(60)}" fill="none" stroke="${wb ? C.navy : '#7A5634'}" stroke-width="${wb ? 5 : 9}" stroke-linecap="round"/>`;
    let s = leg(-70, -62) + leg(110, 100);
    s += `<path data-c="prop" d="M${f(-96)},${g(-330)} Q${f(-104)},${g(-370)} ${f(-60)},${g(-372)} L${f(-30)},${g(-370)} Q${f(10)},${g(-366)} ${f(4)},${g(-320)} L${f(-6)},${g(10)} L${f(-96)},${g(20)} Z" fill="${col}" stroke="${ln}" stroke-width="${lw}" stroke-linejoin="round"/>`;
    s += `<path data-c="prop" d="M${f(-100)},${g(-10)} Q${f(-104)},${g(50)} ${f(-80)},${g(62)} L${f(150)},${g(62)} Q${f(170)},${g(50)} ${f(162)},${g(6)} Q${f(150)},${g(-12)} ${f(120)},${g(-12)} Z" fill="${col}" stroke="${ln}" stroke-width="${lw}" stroke-linejoin="round"/>`;
    if (!wb) s += `<path d="M${f(-96)},${g(46)} L${f(160)},${g(46)}" stroke="${shade}" stroke-width="10" opacity=".55"/>`;
    return s;
  }
  function table(x, wb) {
    const top = FLOOR - 190;
    const ln = wb ? C.navy : C.line, lw = wb ? 5 : 2;
    let s = wb ? '' : `<ellipse cx="${x}" cy="${FLOOR}" rx="90" ry="10" fill="${C.navy}" opacity=".08"/>`;
    s += `<path data-c="prop" d="M${x - 50},${FLOOR} L${x - 30},${top + 14} M${x + 50},${FLOOR} L${x + 30},${top + 14}" fill="none" stroke="${wb ? C.navy : '#7A5634'}" stroke-width="${wb ? 5 : 10}" stroke-linecap="round"/>`;
    s += `<path data-c="prop" d="M${x - 92},${top} Q${x},${top - 22} ${x + 92},${top} L${x + 92},${top + 14} Q${x},${top - 6} ${x - 92},${top + 14} Z" fill="${wb ? C.ivory : '#9A6C42'}" stroke="${ln}" stroke-width="${lw}" stroke-linejoin="round"/>`;
    s += `<path data-c="prop" d="M${x - 70},${top - 6} L${x - 8},${top - 10} L${x - 2},${top - 2} L${x - 66},${top + 2} Z" fill="${wb ? C.ivory : C.navy}" stroke="${wb ? C.navy : 'none'}" stroke-width="${lw}" stroke-linejoin="round"/>`;
    s += `<path data-c="prop" d="M${x + 26},${top - 40} L${x + 58},${top - 40} L${x + 56},${top - 6} Q${x + 42},${top} ${x + 28},${top - 6} Z" fill="${C.teal}" stroke="${ln}" stroke-width="${lw}" stroke-linejoin="round"/>`;
    s += `<path data-c="prop" d="M${x + 58},${top - 32} q14,2 12,14 q-2,8 -13,7" fill="none" stroke="${ln}" stroke-width="${wb ? 4 : 3}" stroke-linecap="round"/>`;
    return s;
  }

  /* ---------- the paths graphic ---------- */
  // Progress of a path draw at t (flat style draws with the same timing).
  const prog = (w, t) => clamp((t - w[0]) / (w[1] - w[0]), 0, 1);
  function pathsLayer(t, wb) {
    const lw = 5; // brand: whiteboard stroke width at 1080
    const chosenK = ease(clamp((t - PATH_T.teal[0]) / 0.5, 0, 1));
    let s = '';
    // In flat style the dash reveal is applied here with pathLength=1; in
    // whiteboard style the browser reveal pass does it from real lengths.
    const draw = (d, w, stroke, width, extra = '') => {
      const p = prog(w, t);
      if (wb) return `<path data-c="route" data-t0="${w[0]}" data-t1="${w[1]}" d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
      if (p <= 0) return '';
      return `<path d="${d}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${n(1 - p)}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
    };
    s += draw(TANGLE, PATH_T.tangle, C.navy, lw);
    for (const k of ['A', 'B', 'C']) {
      const b = BRANCH[k];
      const dim = k === CHOSEN ? 1 : 1 - 0.7 * chosenK;
      s += `<g opacity="${n(dim)}">`;
      s += draw(b.d, PATH_T[k], C.navy, lw);
      const p = prog(PATH_T[k], t);
      if (wb || p >= 1) {
        // destination ring and label
        const tip = b.tip;
        const ringT = [PATH_T[k][1], PATH_T[k][1] + 0.18];
        s += wb ? `<path data-c="route" data-t0="${ringT[0]}" data-t1="${ringT[1]}" d="M${tip[0] - 14},${tip[1]} a14,14 0 1 0 28,0 a14,14 0 1 0 -28,0" fill="${C.ivory}" stroke="${C.navy}" stroke-width="${lw}"/>`
          : `<circle cx="${tip[0]}" cy="${tip[1]}" r="${n(14 * ease(prog(ringT, t)))}" fill="${C.ivory}" stroke="${C.navy}" stroke-width="${lw}"/>`;
        const la = wb ? 1 : ease(prog([ringT[0], ringT[0] + 0.3], t));
        const chosen = k === CHOSEN && chosenK > 0;
        s += `<text data-c="label" data-t0="${ringT[0]}" x="${b.lx}" y="${b.ly}" text-anchor="${b.anchor}" font-family="${FONT}" font-weight="${chosen ? 800 : 600}" font-size="40" fill="${chosen ? C.teal : C.navy}" opacity="${n(la)}">${b.label}</text>`;
      }
      s += '</g>';
    }
    // chosen: teal route from the decision point, amber node
    s += draw(BRANCH[CHOSEN].d, PATH_T.teal, C.teal, 9);
    if (wb || t >= PATH_T.teal[1] - 0.05) {
      const tip = BRANCH[CHOSEN].tip;
      const k = wb ? 1 : ease(prog([PATH_T.teal[1] - 0.05, PATH_T.teal[1] + 0.2], t));
      s += wb ? `<path data-c="route" data-fill="${C.teal}" data-t0="${PATH_T.teal[1]}" data-t1="${PATH_T.teal[1] + 0.18}" d="M${tip[0] - 16},${tip[1]} a16,16 0 1 0 32,0 a16,16 0 1 0 -32,0" fill="${C.ivory}" stroke="${C.teal}" stroke-width="${lw}"/>`
        : `<circle cx="${tip[0]}" cy="${tip[1]}" r="${n(16 * k)}" fill="${C.teal}"/>`;
    }
    const nk = ease(clamp((t - PATH_T.node) / 0.3, 0, 1));
    const pop = 1 + 0.25 * Math.sin(Math.PI * clamp((t - PATH_T.node) / 0.3, 0, 1));
    if (wb) s += `<path data-c="route" data-fill="${C.amber}" data-t0="${PATH_T.node}" data-t1="${PATH_T.node + 0.2}" d="M${NODE[0] - 15},${NODE[1]} a15,15 0 1 0 30,0 a15,15 0 1 0 -30,0" fill="${C.ivory}" stroke="${C.navy}" stroke-width="${lw}"/>`;
    else if (nk > 0) s += `<circle cx="${NODE[0]}" cy="${NODE[1]}" r="${n(15 * nk * pop)}" fill="${C.amber}" stroke="${C.navy}" stroke-width="3"/>`;
    return s;
  }

  /* ---------- copy ---------- */
  // Each line holds still while it is read; it appears and leaves as a whole line.
  const LINES = [
    { text: 'What comes next?', t: [0.25, 2.95] },
    { text: 'Space to think', t: [3.3, 5.75] },
    { text: 'A clearer next step', t: [6.35, END + 0.3], teal: true },
  ];
  function copyLayer(t, wb) {
    let s = '';
    for (const L of LINES) {
      const a = clamp((t - L.t[0]) / 0.3, 0, 1) * (1 - clamp((t - L.t[1] + 0.25) / 0.25, 0, 1));
      if (a <= 0) continue;
      const fill = L.teal ? C.teal : C.navy;
      if (wb) {
        // whole-line reveal: a clip widens left to right across the shaped line
        const w = 800 * ease(clamp((t - L.t[0]) / 0.45, 0, 1));
        const out = 1 - clamp((t - L.t[1] + 0.25) / 0.25, 0, 1);
        s += `<clipPath id="cl-${L.t[0]}"><rect x="140" y="180" width="${n(w)}" height="140"/></clipPath>`;
        s += `<text clip-path="url(#cl-${L.t[0]})" x="540" y="282" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="84" fill="${fill}" opacity="${n(out)}" letter-spacing="-1">${L.text}</text>`;
      } else {
        s += `<text x="540" y="282" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="84" fill="${fill}" opacity="${n(ease(a))}" letter-spacing="-1">${L.text}</text>`;
      }
    }
    return s;
  }

  /* ---------- end card ---------- */
  function endCard(t, wb) {
    const k = (a, d = 0.4) => ease(clamp((t - a) / d, 0, 1));
    let s = '';
    const cx = 540;
    // wordmark: ASSESS above SHIFT, amber forward step beside SHIFT (brand/logo-concept.svg)
    const wm = (txt, x, y, a) => {
      if (wb) {
        const w = 660 * k(a, 0.45);
        return `<clipPath id="wm-${y}"><rect x="${x - 10}" y="${y - 150}" width="${n(w)}" height="190"/></clipPath>` +
          `<text clip-path="url(#wm-${y})" x="${x}" y="${y}" font-family="${FONT}" font-weight="800" font-size="168" letter-spacing="-6" fill="${C.navy}">${txt}</text>`;
      }
      return `<text x="${x}" y="${n(y + 24 * (1 - k(a)))}" font-family="${FONT}" font-weight="800" font-size="168" letter-spacing="-6" fill="${C.navy}" opacity="${n(k(a))}">${txt}</text>`;
    };
    s += wm('ASSESS', 225, 760, END + 0.3);
    s += wm('SHIFT', 323, 920, END + 0.48);
    // amber step: the logo's parallelogram, scaled to the wordmark
    const st = 'M225,849 L292,849 L307,825 L257,825 Z';
    if (wb) s += `<path data-c="end" data-fill="${C.amber}" data-t0="${END + 0.85}" data-t1="${END + 1.1}" d="${st}" fill="${C.ivory}" stroke="${C.navy}" stroke-width="5" stroke-linejoin="round"/>`;
    else s += `<path d="${st}" fill="${C.amber}" opacity="${n(k(END + 0.85, 0.3))}" transform="translate(${n(-30 * (1 - k(END + 0.85, 0.35)))} 0)"/>`;
    // the route continues: navy scribble resolves into a teal line with the amber point
    const route = 'M200,1060 C260,1020 300,1100 360,1060 C400,1034 420,1060 460,1060 L880,1060';
    if (wb) s += `<path data-c="end" data-t0="${END + 1.1}" data-t1="${END + 1.7}" d="${route}" fill="none" stroke="${C.teal}" stroke-width="9" stroke-linecap="round"/>`;
    else {
      const p = k(END + 1.0, 0.7);
      if (p > 0) s += `<path d="${route}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${n(1 - p)}" fill="none" stroke="${C.teal}" stroke-width="9" stroke-linecap="round"/>`;
    }
    const nodeK = k(END + 1.45, 0.3);
    if (wb) s += `<path data-c="end" data-fill="${C.amber}" data-t0="${END + 1.6}" data-t1="${END + 1.8}" d="M445,1060 a15,15 0 1 0 30,0 a15,15 0 1 0 -30,0" fill="${C.ivory}" stroke="${C.navy}" stroke-width="5"/>`;
    else if (nodeK > 0) s += `<circle cx="460" cy="1060" r="${n(15 * nodeK)}" fill="${C.amber}" stroke="${C.navy}" stroke-width="3"/>`;
    // campaign line
    const lineA = k(END + 1.2);
    s += `<text x="${cx}" y="1200" text-anchor="middle" font-family="${FONT}" font-weight="500" font-size="50" fill="${C.navy}" opacity="${n(lineA)}">Your next step starts with clarity.</text>`;
    // CTA
    const ctaA = k(END + 1.55);
    const bw = 760, bh = 128, bx = cx - bw / 2, by = 1300;
    const pill = `M${bx + 64},${by} H${bx + bw - 64} A64,64 0 0 1 ${bx + bw - 64},${by + bh} H${bx + 64} A64,64 0 0 1 ${bx + 64},${by} Z`;
    if (wb) {
      s += `<path data-c="end" data-t0="${END + 1.5}" data-t1="${END + 2.1}" d="${pill}" fill="none" stroke="${C.teal}" stroke-width="6" stroke-linejoin="round"/>`;
      s += `<text x="${cx}" y="${by + 82}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="52" fill="${C.teal}" opacity="${n(k(END + 2.0, 0.3))}">Book a Chemistry Session</text>`;
    } else {
      s += `<g opacity="${n(ctaA)}" transform="translate(0 ${n(20 * (1 - ctaA))})"><path d="${pill}" fill="${C.teal}"/>` +
        `<text x="${cx}" y="${by + 82}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="52" fill="${C.ivory}">Book a Chemistry Session</text></g>`;
    }
    return s;
  }

  /* ---------- scene ---------- */
  function scene(t, opts = {}) {
    t = clamp(t, 0, DURATION);
    const wb = opts.style === 'whiteboard';
    const style = wb ? 'whiteboard' : 'flat';
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-t="${t}" data-style="${style}">`;
    s += `<rect width="${W}" height="${H}" fill="${C.ivory}"/>`;
    // scene fades out into the end card (no picture slides)
    const out = 1 - ease(clamp((t - END) / 0.45, 0, 1));
    if (out > 0) {
      const coach = coachPose(t), coachee = coacheePose(t);
      s += `<g opacity="${n(out)}">`;
      if (!wb) {
        s += `<rect y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="#EFE8DA"/>`;
        s += `<ellipse cx="540" cy="${FLOOR + 6}" rx="440" ry="26" fill="${C.navy}" opacity=".05"/>`;
      }
      s += `<g data-group="floor">${wb ? `<path data-c="prop" d="M90,${FLOOR} H990" fill="none" stroke="${C.navy}" stroke-width="5" stroke-linecap="round"/>` : `<path d="M0,${FLOOR} H${W}" stroke="${C.navy}" stroke-opacity=".12" stroke-width="2"/>`}</g>`;
      s += `<g data-group="props">${chair(PLACE['coach-01'], coach.y + 24 * SCALE, 1, wb)}${chair(PLACE['coachee-01'], coachee.y + 24 * SCALE, -1, wb)}${table(540, wb)}</g>`;
      s += `<g data-group="coach" data-t0="0.05" data-t1="1.35">${renderCharacter('coach-01', coach, { prefix: 'coach', style })}</g>`;
      s += `<g data-group="coachee" data-t0="0.35" data-t1="1.7">${renderCharacter('coachee-01', coachee, { prefix: 'coachee', style })}</g>`;
      s += `<g data-group="paths">${pathsLayer(t, wb)}</g>`;
      s += '</g>';
    }
    s += copyLayer(t, wb);
    if (t >= END) s += `<g data-group="end">${endCard(t, wb)}</g>`;
    if (opts.label) s += `<text x="1040" y="1880" text-anchor="end" font-family="${FONT}" font-size="22" fill="${C.navy}" opacity=".45">silent prototype · ${t.toFixed(2)} s</text>`;
    return s + '</svg>';
  }

  /* ---------- whiteboard reveal (browser only) ----------
   * Draws every stroke in order with stroke-dasharray / stroke-dashoffset from
   * its real getTotalLength(). Characters: silhouette -> face -> clothing
   * details -> hands, at a constant pen speed inside the group's window.
   * Props follow the characters; routes and end-card strokes use their own
   * data-t0/data-t1. Colored fills (data-fill, teal/amber/navy accents) appear
   * after their outline. Ivory fills stay on: they are invisible on the ivory
   * ground but hide the lines behind each shape, as on a real board.
   * Pure function of the DOM and t, so any seek order gives the same frame. */
  const RANK = { sil: 0, face: 1, detail: 2, hand: 3 };
  function revealWhiteboard(svg, t) {
    const setDraw = (el, p) => {
      const L = el.getTotalLength ? el.getTotalLength() : 0;
      if (p >= 1) { el.style.strokeDasharray = ''; el.style.strokeDashoffset = ''; el.style.visibility = ''; return; }
      if (p <= 0) { el.style.visibility = 'hidden'; return; }
      el.style.visibility = '';
      el.style.strokeDasharray = `${L} ${L}`;
      el.style.strokeDashoffset = String(L * (1 - p));
    };
    const fillAfter = (el, p, color) => {
      // fill blends in over the last 25% of the stroke and just after it
      const f = clamp((p - 0.75) / 0.4, 0, 1);
      if (color) { el.setAttribute('fill', color); el.style.fillOpacity = String(f); }
    };
    // characters
    for (const g of svg.querySelectorAll('g[data-group="coach"], g[data-group="coachee"]')) {
      const t0 = Number(g.dataset.t0), t1 = Number(g.dataset.t1);
      if (t >= t1) continue;
      const items = [];
      for (const el of g.querySelectorAll('path, circle, ellipse, rect')) {
        if (el.closest('clipPath')) continue;
        const stroke = el.getAttribute('stroke');
        const hasStroke = stroke && stroke !== 'none';
        const grp = el.parentElement.closest('g[data-c]');
        const cat = (grp && grp.dataset.c) || el.dataset.c || 'detail';
        const fill = el.getAttribute('fill');
        const coloredFill = !!fill && fill !== 'none' && fill.toUpperCase() !== C.ivory.toUpperCase();
        if (!hasStroke && !coloredFill) continue; // invisible ivory fills stay on
        const top = el.getBoundingClientRect().top;
        items.push({ el, rank: RANK[cat] ?? 2, top, hasStroke, coloredFill, fill, len: hasStroke ? Math.max(20, el.getTotalLength()) : 30 });
      }
      // the pen works top-down inside each rank (rounded so tiny pose changes keep the order)
      items.sort((a, b) => a.rank - b.rank || Math.round(a.top / 40) - Math.round(b.top / 40));
      const total = items.reduce((a, b) => a + b.len, 0);
      const p = clamp((t - t0) / (t1 - t0), 0, 1) * total;
      let acc = 0;
      for (const it of items) {
        const lp = clamp((p - acc) / it.len, 0, 1);
        acc += it.len;
        if (it.hasStroke) {
          setDraw(it.el, lp);
          if (it.coloredFill) { it.el.style.visibility = lp > 0 ? '' : 'hidden'; it.el.style.fillOpacity = String(clamp((lp - 0.75) / 0.25, 0, 1)); }
        } else {
          it.el.style.visibility = '';
          it.el.style.opacity = String(lp);
        }
      }
    }
    // props: after both characters
    const props = [...svg.querySelectorAll('[data-group="floor"] [data-c="prop"], [data-group="props"] [data-c="prop"]')];
    const pt0 = 1.45, pt1 = 2.2;
    if (t < pt1) {
      const lens = props.map((el) => Math.max(20, el.getTotalLength()));
      const total = lens.reduce((a, b) => a + b, 0);
      const p = clamp((t - pt0) / (pt1 - pt0), 0, 1) * total;
      let acc = 0;
      props.forEach((el, i) => {
        const lp = clamp((p - acc) / lens[i], 0, 1); acc += lens[i];
        setDraw(el, lp);
        const f = el.getAttribute('fill');
        if (f && f !== 'none' && f.toUpperCase() !== C.ivory) el.style.fillOpacity = String(clamp((lp - 0.75) / 0.25, 0, 1));
      });
    }
    // routes and end-card strokes with explicit windows
    for (const el of svg.querySelectorAll('[data-c="route"], [data-c="end"]')) {
      const p = clamp((t - Number(el.dataset.t0)) / (Number(el.dataset.t1) - Number(el.dataset.t0)), 0, 1);
      setDraw(el, p);
      if (el.dataset.fill) fillAfter(el, p, el.dataset.fill);
    }
    for (const el of svg.querySelectorAll('[data-c="label"]')) el.style.opacity = String(ease(clamp((t - Number(el.dataset.t0)) / 0.3, 0, 1)) * Number(el.getAttribute('opacity') || 1));
  }

  const API = { scene, revealWhiteboard, coachPose, coacheePose, DURATION, W, H, END, PATH_T, ASK, POINT, CHIN, COACHEE_LOOKS, COACH_BLINKS, COACHEE_BLINKS, BRANCH, CHOSEN, SCALE, FLOOR, PLACE };
  if (isNode) module.exports = API;
  else root.ASStory = API;
})(typeof window !== 'undefined' ? window : globalThis);
