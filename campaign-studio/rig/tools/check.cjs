// Movement and rig checks computed from the same pose functions the renderer uses.
// node rig/tools/check.cjs  -> prints a report and writes out/checks.json
const fs = require('node:fs');
const R = require('../rig.js');
const A = require('../acting.js');
const S = require('../story.js');
const fps = 30, N = S.DURATION * fps;
const res = { failures: [] };
const fail = (m) => res.failures.push(m);
const fk = (id, p) => { const out = {}; R.renderCharacter(id, p, { out }); return out; };
const W = (o, j, x = 0, y = 0) => R.worldPoint(o, j, x, y);
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

// 1. determinism: same t gives identical SVG regardless of order
for (const style of ['flat', 'whiteboard']) {
  const fwd = [], rev = [];
  for (let i = 0; i < N; i++) fwd.push(S.scene(i / fps, { style }));
  for (let i = N - 1; i >= 0; i--) rev[i] = S.scene(i / fps, { style });
  const bad = fwd.filter((s, i) => s !== rev[i]).length;
  res[`determinism_${style}`] = `${N - bad}/${N} frames identical forward vs reverse`;
  if (bad) fail(`${style}: ${bad} frames differ by seek order`);
}

// 2. seated contact and planted feet
for (const [id, poseFn] of [['coach-01', S.coachPose], ['coachee-01', S.coacheePose]]) {
  let maxFoot = 0, maxRootDy = 0, maxThighGap = -1e9, minThighGap = 1e9;
  const sides = R.SIDES[id];
  const p0 = poseFn(0), o0 = fk(id, p0);
  const f0 = ['N', 'F'].map((s) => W(o0, `foot-${sides[s]}`, 0, R.CHAR[id].footDrop));
  for (let i = 0; i < N; i++) {
    const t = i / fps; if (t >= S.END + 0.45) break;
    const p = poseFn(t), o = fk(id, p);
    ['N', 'F'].forEach((s, k) => { maxFoot = Math.max(maxFoot, dist(W(o, `foot-${sides[s]}`, 0, R.CHAR[id].footDrop), f0[k])); });
    maxRootDy = Math.max(maxRootDy, Math.abs(p.y - p0.y));
    // underside of the near thigh at mid-length vs the drawn seat top (seatY - 12*S)
    const seatTop = p.y + 24 * S.SCALE - 12 * S.SCALE;
    const mid = W(o, `thigh-${sides.N}`, (id === 'coach-01' ? -29 : -24), R.CHAR[id].thigh * 0.5);
    const gap = seatTop - mid[1];
    maxThighGap = Math.max(maxThighGap, gap); minThighGap = Math.min(minThighGap, gap);
  }
  res[`${id}_feet_max_drift_px`] = +maxFoot.toFixed(3);
  res[`${id}_pelvis_max_dy_px`] = +maxRootDy.toFixed(3);
  res[`${id}_thigh_to_seat_px`] = `${minThighGap.toFixed(1)}..${maxThighGap.toFixed(1)} (negative = thigh overlaps cushion)`;
  if (maxFoot > 0.5) fail(`${id}: feet drift ${maxFoot.toFixed(2)} px`);
}

// 3. rotation ranges (character bible starting limits: head +/-6, torso +/-3)
for (const [id, poseFn] of [['coach-01', S.coachPose], ['coachee-01', S.coacheePose]]) {
  let h = [1e9, -1e9], tr = [1e9, -1e9];
  for (let i = 0; i < N; i++) { const p = poseFn(i / fps); h = [Math.min(h[0], p.head), Math.max(h[1], p.head)]; tr = [Math.min(tr[0], p.torso), Math.max(tr[1], p.torso)]; }
  res[`${id}_head_deg`] = h.map((v) => +v.toFixed(2));
  res[`${id}_torso_deg`] = tr.map((v) => +v.toFixed(2));
  if (h[0] < -6.01 || h[1] > 6.01) fail(`${id}: head rotation ${h} beyond +/-6`);
  if (tr[0] < -3.01 || tr[1] > 3.01) fail(`${id}: torso rotation ${tr} beyond +/-3`);
}

// 4. eyes lead the head: for each look change, time to 50% of gaze change vs head change
const lead = [];
const looks = S.COACHEE_LOOKS;
for (let k = 1; k < looks.length; k++) {
  const [t0] = looks[k], tEnd = looks[k + 1] ? looks[k + 1][0] : S.DURATION;
  const g0 = S.coacheePose(t0 - 0.001).face, h0 = S.coacheePose(t0 - 0.001).head;
  const g1 = S.coacheePose(Math.min(tEnd, t0 + 0.6) - 0.001).face, h1 = S.coacheePose(Math.min(tEnd, t0 + 0.6) - 0.001).head;
  let tg = null, th = null;
  for (let t = t0; t < Math.min(tEnd, t0 + 0.6); t += 1 / 120) {
    const p = S.coacheePose(t);
    const gd = Math.hypot(p.face.gazeX - g0.gazeX, p.face.gazeY - g0.gazeY) / (Math.hypot(g1.gazeX - g0.gazeX, g1.gazeY - g0.gazeY) || 1);
    const hd = Math.abs(p.head - h0) / (Math.abs(h1 - h0) || 1);
    if (tg == null && gd >= 0.5) tg = t; if (th == null && hd >= 0.5) th = t;
  }
  lead.push({ look: looks[k][1], at: t0, eyes50: tg && +tg.toFixed(3), head50: th && +th.toFixed(3), leadSec: tg && th ? +(th - tg).toFixed(3) : null });
  if (tg && th && th <= tg) fail(`head moves before eyes at ${t0}`);
}
res.coachee_eye_lead = lead;

// 5. chin contact during the hold, 6. pointing accuracy, 7. offer hand height
{
  let maxD = 0;
  for (let t = S.CHIN[1]; t <= S.CHIN[2]; t += 1 / fps) {
    const p = S.coacheePose(t), o = fk('coachee-01', p);
    const chin = W(o, 'head', 18, -30);
    const knuckle = W(o, 'hand-L', 0, 44 * 1.12); // top of the curled fingers in the 'chin' hand
    maxD = Math.max(maxD, dist(chin, knuckle));
  }
  res.coachee_chin_contact_max_px = +maxD.toFixed(1);
  if (maxD > 25) fail(`chin hand ${maxD.toFixed(1)} px from the chin`);
}
{
  const p = S.coacheePose(S.POINT[3] + 0.1), o = fk('coachee-01', p);
  const wr = W(o, 'hand-R'), tip = W(o, 'hand-R', 0, 75), target = S.BRANCH[S.CHOSEN].tip;
  const a1 = Math.atan2(tip[1] - wr[1], tip[0] - wr[0]), a2 = Math.atan2(target[1] - wr[1], target[0] - wr[0]);
  const err = Math.abs(((a1 - a2) * 180 / Math.PI + 540) % 360 - 180);
  res.coachee_point_error_deg = +err.toFixed(1);
  if (err > 12) fail(`pointing misses target by ${err.toFixed(1)} deg`);
}
{
  const p = S.coachPose(S.ASK[3] + 0.2), o = fk('coach-01', p);
  const hand = W(o, 'hand-L'), sh = W(o, 'upper-arm-L'), hip = W(o, 'pelvis');
  res.coach_offer_wrist = { x: +hand[0].toFixed(0), y: +hand[1].toFixed(0), shoulderY: +sh[1].toFixed(0), pelvisY: +hip[1].toFixed(0) };
  if (!(hand[1] > sh[1] && hand[1] < hip[1])) fail('offer hand not between chest and waist height');
}

// 8. blinks are 0.14 s and never synchronised between the two characters
res.blinks = { coach: S.COACH_BLINKS, coachee: S.COACHEE_BLINKS };
for (const a of S.COACH_BLINKS) for (const b of S.COACHEE_BLINKS) if (Math.abs(a - b) < 0.14) fail(`simultaneous blinks at ${a}/${b}`);

// 9. turn taking: large gestures do not overlap
res.gestures = { coachAsk: [S.ASK[0], S.ASK[4]], coachRelax: [S.ASK[4], S.ASK[5]], coacheeChin: [S.CHIN[0], S.CHIN[3]], coacheePoint: [S.POINT[0], S.POINT[3]] };
if (S.CHIN[0] < S.ASK[4]) fail('coachee reaches for his chin before the coach has finished holding the gesture');

fs.mkdirSync('out', { recursive: true });
fs.writeFileSync('out/checks.json', JSON.stringify(res, null, 2));
console.log(JSON.stringify(res, null, 2));
process.exit(res.failures.length ? 1 : 0);
