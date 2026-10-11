/* Poses, expressions and the 5-second seated acting test.
 * scene(t) is a pure function of absolute time t (seconds): the same t always
 * yields the same SVG, whatever order frames are requested in.
 */
(function (root) {
  'use strict';
  const R = typeof module !== 'undefined' && module.exports ? require('./rig.js') : root.ASRig;
  const { renderCharacter, solveArm, CHAR, COLORS: C } = R;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (x) => { x = clamp(x, 0, 1); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  // Keyframe track: [[t, value], ...], eased between keys, held outside.
  function track(keys, t) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      if (t <= keys[i][0]) {
        const [t0, v0] = keys[i - 1], [t1, v1] = keys[i];
        return lerp(v0, v1, ease((t - t0) / (t1 - t0)));
      }
    }
    return keys[keys.length - 1][1];
  }
  // Blink: lids close in 0.06 s and reopen in 0.08 s (0.14 s total).
  function blinkAt(times, t) {
    for (const b of times) {
      if (t >= b && t < b + 0.06) return (t - b) / 0.06;
      if (t >= b + 0.06 && t < b + 0.14) return 1 - (t - b - 0.06) / 0.08;
    }
    return 0;
  }
  const inv = (m) => {
    const det = m[0] * m[3] - m[1] * m[2];
    return [m[3] / det, -m[1] / det, -m[2] / det, m[0] / det, (m[2] * m[5] - m[3] * m[4]) / det, (m[1] * m[4] - m[0] * m[5]) / det];
  };
  const ap = (m, p) => [m[0] * p[0] + m[2] * p[1] + m[4], m[1] * p[0] + m[3] * p[1] + m[5]];

  /* ---------- expressions (named in characters/character-bible.md) ---------- */
  const EXPRESSIONS = {
    'coach-01': {
      attentive: { brow: 0.25, browIn: 0.1, lid: 0.14, smile: 0.45, gazeX: 0.85, gazeY: 0.1, pitch: 0.2 },
      curious: { browN: 0.05, browF: 0.75, lid: 0.08, smile: 0.3, mouthAsym: 0.5, gazeX: 0.7, gazeY: -0.5, turn: 0.4 },
      'quietly-confident': { brow: 0, lid: 0.32, smile: 0.62, gazeX: 0.35, gazeY: 0.1, pitch: -0.2 },
    },
    'coachee-01': {
      uncertain: { brow: 0.25, browIn: 0.85, lid: 0.18, smile: -0.35, mouthAsym: -0.4, gazeX: -0.5, gazeY: -0.6, turn: -0.3 },
      reflective: { brow: 0.05, browIn: 0.3, lid: 0.5, smile: 0.08, gazeX: 0.15, gazeY: 0.75, pitch: 0.6 },
      resolved: { brow: 0.1, browIn: -0.15, lid: 0.14, smile: 0.58, gazeX: 0.9, gazeY: 0, pitch: -0.1 },
    },
  };

  /* ---------- base poses ---------- */
  function standing(id) {
    return {
      pelvis: 0, torso: 0, head: 0,
      armN: { sh: 7, el: -6, wr: 2, hand: 'relaxed' },
      armF: { sh: -6, el: 6, wr: -2, hand: 'relaxed' },
      legN: { hip: 3, knee: -2, ankle: -1 },
      legF: { hip: -3, knee: 2, ankle: 1 },
    };
  }
  // Seated: thighs forward toward the facing direction, shins vertical, feet flat.
  function seatedBase(id) {
    return {
      pelvis: 0, torso: -1, head: 0,
      legN: { hip: -84, knee: 84, ankle: 0 },
      legF: { hip: -80, knee: 80, ankle: 0 },
      armN: { sh: 0, el: 0, wr: 0, hand: 'relaxed' },
      armF: { sh: 0, el: 0, wr: 0, hand: 'relaxed' },
    };
  }
  // Two-bone IK that picks the elbow solution on the requested side of the
  // shoulder-wrist line: 'down' (larger y) or 'back' (smaller x, away from the
  // facing direction). handAbs is the hand's absolute angle in the torso frame.
  function ikArm(id, side, wrist, handAbs, prefer, hand) {
    const sp = CHAR[id];
    const sh = side === 'N' ? sp.shN : sp.shF;
    let best = null;
    for (const bend of [1, -1]) {
      const s = solveArm(sh, wrist, sp.upper, sp.fore, bend);
      const r = (s.sh * Math.PI) / 180;
      const elbow = [sh[0] - Math.sin(r) * sp.upper, sh[1] + Math.cos(r) * sp.upper];
      const score = prefer === 'down' ? elbow[1] : -elbow[0];
      if (!best || score > best.score) best = { score, s };
    }
    return { sh: best.s.sh, el: best.s.el, wr: handAbs - best.s.sh - best.s.el, hand: hand || 'relaxed' };
  }
  // Rest hands on the thighs (IK in the torso frame), elbows tucked back by the hips.
  // Seated thigh top is ~ pelvis y -24, i.e. torso y -4; the wrist sits just above it.
  const LAP = { 'coach-01': { N: [44, -14], F: [92, -20] }, 'coachee-01': { N: [40, -12], F: [90, -18] } };
  function lapArms(id, pose) {
    pose.armN = ikArm(id, 'N', LAP[id].N, -100, 'back');
    pose.armF = ikArm(id, 'F', LAP[id].F, -98, 'back');
    return pose;
  }
  function seated(id) { return lapArms(id, seatedBase(id)); }

  // Coach's open-hand question. overshoot = 1 gives the slightly-past pose before the settle.
  function offerArm(id, overshoot) {
    const k = overshoot ? 1.06 : 1;
    return ikArm(id, 'F', [128 * k, -150 - 8 * overshoot], -112 - 6 * overshoot, 'down', 'offer');
  }
  function mixArm(a, b, w) {
    return { sh: lerp(a.sh, b.sh, w), el: lerp(a.el, b.el, w), wr: lerp(a.wr, b.wr, w), hand: w < 0.5 ? a.hand : b.hand };
  }

  /* ---------- the acting test ---------- */
  const W = 1080, H = 1920, FLOOR = 1540, SCALE = 0.92;
  const DURATION = 5;
  const PLACE = { 'coach-01': 236, 'coachee-01': 846 };

  // vertical root offset so feet rest on the floor (from the rig's own FK)
  const footOffset = {};
  function rootY(id) {
    if (footOffset[id] == null) {
      const out = {};
      renderCharacter(id, Object.assign(seated(id), { x: 0, y: 0, s: SCALE }), { out });
      const sp = CHAR[id];
      const side = R.SIDES[id].N;
      const p = R.worldPoint(out, `foot-${side}`, 0, sp.footDrop);
      footOffset[id] = p[1];
    }
    return FLOOR - footOffset[id];
  }

  const COACH_BLINKS = [1.25, 3.55];
  const COACHEE_BLINKS = [1.1, 3.2, 4.72];
  const CUE = {
    coacheeLooksUp: 0.3, coachAsk: 1.7, coacheeReflect: 2.55, coacheeChin: 2.85, coacheeNod: 3.95,
  };

  function coachPose(t) {
    const id = 'coach-01';
    const p = seated(id);
    p.x = PLACE[id]; p.y = rootY(id); p.s = SCALE;
    p.breath = Math.sin((2 * Math.PI * t) / 3.6);
    // listening: slight lean in, one small nod at 1.0 s
    p.torso = track([[0, -1], [1.1, 1.5], [1.7, 1.5], [1.82, 1.0], [2.2, 2.2], [3.3, 2.2], [3.9, 1.2]], t);
    const nod = track([[0.95, 0], [1.12, 1], [1.38, 0]], t);
    p.head = track([[0, 1], [1.6, 1.5], [1.8, 1], [2.1, 3.5], [3.4, 3.5], [3.9, 1.5]], t) + nod * 2.5;
    // ask: 0.12 s anticipation, 0.35 s outward move, 0.22 s settle, hold, relax
    const rest = p.armF;
    const ant = { sh: rest.sh + 4, el: rest.el + 6, wr: rest.wr + 4, hand: 'relaxed' };
    // open hand at waist-to-chest height, elbow bent, palm up toward the coachee
    const out = offerArm(id, 0);
    const over = offerArm(id, 1);
    const t0 = CUE.coachAsk;
    let a;
    if (t < t0) a = rest;
    else if (t < t0 + 0.12) a = mixArm(rest, ant, ease((t - t0) / 0.12));
    else if (t < t0 + 0.47) a = mixArm(ant, over, ease((t - t0 - 0.12) / 0.35));
    else if (t < t0 + 0.69) a = mixArm(over, out, ease((t - t0 - 0.47) / 0.22));
    else if (t < 3.3) a = out;
    else a = mixArm(out, rest, ease((t - 3.3) / 0.6));
    p.armF = a;
    p.face = {
      brow: track([[0, 0.15], [1.75, 0.15], [2.0, 0.45], [3.2, 0.4], [3.7, 0.15]], t),
      browIn: 0.1,
      lid: track([[0, 0.14], [2.6, 0.14], [3.0, 0.2]], t),
      blink: blinkAt(COACH_BLINKS, t),
      smile: track([[0, 0.4], [1.7, 0.4], [2.0, 0.28], [3.4, 0.3], [4.4, 0.5]], t),
      gazeX: 0.85, gazeY: track([[0, 0.15], [2.6, 0.15], [3.0, 0.35], [4.0, 0.1]], t),
      pitch: track([[0, 0.1], [2.0, 0.1], [2.2, -0.15], [3.4, -0.1], [3.9, 0.1]], t) + nod * 0.6,
      turn: track([[0, 0.2], [2.0, 0.2], [2.2, 0.35], [3.5, 0.2]], t),
    };
    return p;
  }

  function chinArm(id, p) {
    // forward kinematics for the current head, then IK the near hand to the chin
    const out = {};
    renderCharacter(id, p, { out });
    const chinHead = id === 'coach-01' ? [16, -35] : [18, -30];
    const chinW = R.worldPoint(out, 'head', chinHead[0], chinHead[1]);
    const toTorso = inv(out.mats.torso);
    const chinT = ap(toTorso, chinW);
    const handAbs = 172; // fingers pointing up toward the jaw
    const r = (handAbs * Math.PI) / 180;
    const reach = 50; // wrist to knuckles of the 'chin' hand at the coachee's hand scale
    const wrist = [chinT[0] + Math.sin(r) * reach, chinT[1] - Math.cos(r) * reach];
    const sp = CHAR[id];
    return Object.assign(ikArm(id, 'N', wrist, handAbs, 'down', 'chin'), { chinT, wrist });
  }

  function coacheePose(t) {
    const id = 'coachee-01';
    const p = seated(id);
    p.x = PLACE[id]; p.y = rootY(id); p.s = SCALE;
    p.breath = Math.sin((2 * Math.PI * (t + 1.3)) / 3.9);
    const up = CUE.coacheeLooksUp, rf = CUE.coacheeReflect, nd = CUE.coacheeNod;
    // eyes lead, then head, then torso
    const gazeY = track([[0, 0.8], [up, 0.8], [up + 0.15, 0.05], [rf, 0.05], [rf + 0.2, 0.65], [nd - 0.05, 0.65], [nd + 0.1, 0.0]], t);
    const gazeX = track([[0, 0.1], [up, 0.1], [up + 0.15, 0.85], [rf, 0.85], [rf + 0.2, 0.2], [nd - 0.05, 0.2], [nd + 0.1, 0.9]], t);
    const look = track([[0, 1], [up + 0.15, 1], [up + 0.5, 0], [rf + 0.2, 0], [rf + 0.5, 0.8], [nd - 0.05, 0.8], [nd + 0.2, 0]], t);
    const nod = track([[nd, 0], [nd + 0.15, 1], [nd + 0.4, 0]], t);
    p.head = look * 3 + nod * 5;
    p.torso = track([[0, -1], [up + 0.3, -1], [up + 0.7, 1.2], [rf + 0.2, 1.2], [rf + 0.6, 0.4], [nd + 0.3, 0.4], [nd + 0.8, 1.4]], t);
    p.face = {
      brow: track([[0, 0.05], [1.95, 0.05], [2.15, 0.25], [rf, 0.2], [rf + 0.3, 0.05], [nd, 0.05], [nd + 0.3, 0.12]], t),
      browIn: track([[0, 0.35], [up + 0.3, 0.1], [rf + 0.1, 0.1], [rf + 0.4, 0.4], [nd, 0.35], [nd + 0.3, -0.1]], t),
      lid: track([[0, 0.38], [up, 0.38], [up + 0.15, 0.12], [rf, 0.12], [rf + 0.25, 0.45], [nd, 0.45], [nd + 0.15, 0.14]], t),
      blink: blinkAt(COACHEE_BLINKS, t),
      smile: track([[0, 0.05], [up + 0.6, 0.18], [rf, 0.15], [rf + 0.4, 0.05], [nd + 0.2, 0.08], [nd + 0.6, 0.5]], t),
      gazeX, gazeY,
      pitch: look * 0.6 + nod * 0.9,
      turn: track([[0, 0], [up + 0.5, 0.25], [rf + 0.4, 0], [nd + 0.3, 0.3]], t),
    };
    // reflection: hand to chin once, then back to the lap after the nod
    const w = track([[CUE.coacheeChin, 0], [CUE.coacheeChin + 0.5, 1], [nd + 0.3, 1], [nd + 0.85, 0]], t);
    if (w > 0) {
      const target = chinArm(id, p);
      p.armN = mixArm(p.armN, target, w);
      p._chin = target; p._chinW = w;
    }
    return p;
  }

  /* ---------- set dressing ---------- */
  function chair(x, seatY, facing, color, shade) {
    // facing +1 = sitter faces screen-right. Drawn behind the sitter.
    const f = (v) => x + v * facing;
    const leg = (a, b) => `<path d="M${f(a)},${FLOOR - 4} L${f(b)},${seatY + 60}" stroke="#7A5634" stroke-width="9" stroke-linecap="round"/>`;
    let s = leg(-70, -62) + leg(110, 100);
    s += `<path d="M${f(-96)},${seatY - 330} Q${f(-104)},${seatY - 370} ${f(-60)},${seatY - 372} L${f(-30)},${seatY - 370} Q${f(10)},${seatY - 366} ${f(4)},${seatY - 320} L${f(-6)},${seatY + 10} L${f(-96)},${seatY + 20} Z" fill="${color}" stroke="${C.line}" stroke-width="2"/>`;
    s += `<path d="M${f(-100)},${seatY - 10} Q${f(-104)},${seatY + 50} ${f(-80)},${seatY + 62} L${f(150)},${seatY + 62} Q${f(170)},${seatY + 50} ${f(162)},${seatY + 6} Q${f(150)},${seatY - 12} ${f(120)},${seatY - 12} Z" fill="${color}" stroke="${C.line}" stroke-width="2"/>`;
    s += `<path d="M${f(-96)},${seatY + 46} L${f(160)},${seatY + 46}" stroke="${shade}" stroke-width="10" opacity=".55"/>`;
    return s;
  }
  function table(x) {
    const top = FLOOR - 190;
    let s = `<ellipse cx="${x}" cy="${FLOOR}" rx="90" ry="10" fill="${C.navy}" opacity=".08"/>`;
    s += `<path d="M${x - 50},${FLOOR} L${x - 30},${top + 14} M${x + 50},${FLOOR} L${x + 30},${top + 14}" stroke="#7A5634" stroke-width="10" stroke-linecap="round"/>`;
    s += `<path d="M${x - 92},${top} Q${x},${top - 22} ${x + 92},${top} L${x + 92},${top + 14} Q${x},${top - 6} ${x - 92},${top + 14} Z" fill="#9A6C42" stroke="${C.line}" stroke-width="2"/>`;
    // notebook and mug
    s += `<path d="M${x - 70},${top - 6} L${x - 8},${top - 10} L${x - 2},${top - 2} L${x - 66},${top + 2} Z" fill="${C.navy}"/>`;
    s += `<path d="M${x + 26},${top - 40} L${x + 58},${top - 40} L${x + 56},${top - 6} Q${x + 42},${top} ${x + 28},${top - 6} Z" fill="${C.teal}" stroke="${C.line}" stroke-width="2"/>`;
    s += `<path d="M${x + 58},${top - 32} q14,2 12,14 q-2,8 -13,7" fill="none" stroke="${C.line}" stroke-width="3"/>`;
    return s;
  }

  function scene(t, opts = {}) {
    t = clamp(t, 0, DURATION);
    const coach = coachPose(t), coachee = coacheePose(t);
    const seatC = coach.y + 24 * SCALE, seatE = coachee.y + 24 * SCALE;
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`;
    s += `<rect width="${W}" height="${H}" fill="${C.ivory}"/>`;
    s += `<rect y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="#EFE8DA"/>`;
    s += `<path d="M0,${FLOOR} H${W}" stroke="${C.navy}" stroke-opacity=".12" stroke-width="2"/>`;
    s += `<ellipse cx="540" cy="${FLOOR + 6}" rx="420" ry="26" fill="${C.navy}" opacity=".05"/>`;
    s += chair(PLACE['coach-01'], seatC, 1, '#2D6F72', '#1F5457');
    s += chair(PLACE['coachee-01'], seatE, -1, '#D6CFC2', '#B9B0A0');
    s += table(540);
    s += renderCharacter('coach-01', coach, { prefix: 'coach' });
    s += renderCharacter('coachee-01', coachee, { prefix: 'coachee' });
    if (opts.label !== false) {
      s += `<text x="90" y="200" font-family="Manrope, Inter, sans-serif" font-size="30" font-weight="700" fill="${C.navy}">Acting test · silent prototype</text>`;
      s += `<text x="90" y="244" font-family="Manrope, Inter, sans-serif" font-size="24" fill="${C.navy}" fill-opacity=".7">coach-01 asks · coachee-01 reflects, nods · ${t.toFixed(2)} s</text>`;
    }
    return s + '</svg>';
  }

  const API = { ikArm, lapArms, offerArm, mixArm, blinkAt, chinArm, ease, inv, ap, EXPRESSIONS, standing, seated, scene, coachPose, coacheePose, DURATION, W, H, FLOOR, SCALE, CUE, COACH_BLINKS, COACHEE_BLINKS, track };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.ASActing = API;
})(typeof window !== 'undefined' ? window : globalThis);
