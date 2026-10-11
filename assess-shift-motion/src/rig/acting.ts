import type {ArmLayer, ArmPose, HandShape, Pose} from './Character';

// Deterministic acting engine. Every channel is a pure function of the frame:
// keys say "starting at frame `at`, move to value over `dur` frames"
// (smoothstep in and out, as in the pack's prototype), so holds and settles
// are explicit keys. Discrete choices (hand shape, draw layer) switch 20% into
// their transition, like the prototype's openHand threshold.

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};

type ArmSpec = {u: number; f: number; w: number; hand: HandShape; layer?: ArmLayer};

// Arm presets, outward convention (positive = away from the body's centre line).
export const ARM = {
  rest: {u: 3, f: 4, w: 0, hand: 'relaxed'},
  anticipate: {u: -2, f: -6, w: 4, hand: 'relaxed'},
  ask: {u: 19, f: 64, w: -14, hand: 'open'},
  present: {u: 40, f: 74, w: -12, hand: 'open'},
  presentLow: {u: 24, f: 48, w: -12, hand: 'open'},
  welcome: {u: 12, f: 28, w: -10, hand: 'open'},
  clasp: {u: -6, f: -40, w: -12, hand: 'relaxed', layer: 'front'},
  chin: {u: -8, f: -158, w: -4, hand: 'relaxed', layer: 'top'},
  holdBook: {u: 18, f: -54, w: 0, hand: 'relaxed', layer: 'front'},
  // Solved with forward kinematics so the pen tip lands on the notebook page
  // (see scripts/check_rig.ts).
  write: {u: 44, f: -88, w: 0, hand: 'grip', layer: 'top'},
} satisfies Record<string, ArmSpec>;
export type ArmName = keyof typeof ARM;

export type Look = {head: number; eyeX: number; eyeY: number; brow?: number};

type ArmKey = {at: number; dur: number; arm: ArmName | ArmSpec};
type NumKey = {at: number; dur: number; v: number};
type LookKey = {at: number; dur: number; look: Look};

export type ActingTrack = {
  L: ArmKey[];
  R: ArmKey[];
  look: LookKey[];
  nods?: number[]; // frame each 14-frame nod starts
  blinks: number[]; // frame each 5-frame blink starts
  notebook?: NumKey[];
  pen?: NumKey[];
  // Small writing strokes: [start, end) ranges where the wrist works.
  writing?: [number, number][];
  defaultLayer: {L: ArmLayer; R: ArmLayer};
  // Phase for the subtle idle head sway (so two characters never sway in sync).
  idlePhase?: number;
};

const spec = (a: ArmName | ArmSpec): ArmSpec => (typeof a === 'string' ? ARM[a] : a);

// Value of a numeric channel at frame t, given keys sorted by `at`.
const channel = <K extends {at: number; dur: number}>(keys: K[], t: number, get: (k: K) => number, init: number): number => {
  let value = init;
  let settledAt = -Infinity;
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (t < k.at) break;
    // Start value is wherever the channel was when this key began.
    const start = i === 0 ? init : channel(keys.slice(0, i), k.at, get, init);
    value = start + (get(k) - start) * smooth((t - k.at) / k.dur);
    settledAt = k.at;
  }
  void settledAt;
  return value;
};

const discrete = <T>(keys: ArmKey[], t: number, get: (s: ArmSpec) => T, init: T): T => {
  let v = init;
  for (const k of keys) {
    if (t >= k.at + 0.2 * k.dur) v = get(spec(k.arm));
  }
  return v;
};

const armAt = (keys: ArmKey[], t: number, defaultLayer: ArmLayer): ArmPose => {
  const rest = ARM.rest;
  return {
    u: channel(keys, t, (k) => spec(k.arm).u, rest.u),
    f: channel(keys, t, (k) => spec(k.arm).f, rest.f),
    w: channel(keys, t, (k) => spec(k.arm).w, rest.w),
    hand: discrete(keys, t, (s) => s.hand, rest.hand as HandShape),
    layer: discrete(keys, t, (s) => s.layer ?? defaultLayer, defaultLayer),
  };
};

const blinkAt = (t: number, starts: number[]) => {
  let open = 1;
  for (const s of starts) {
    // close over 2 frames, hold 1, reopen over 2 (prototype: gesture(at,at+2,at+3,at+5))
    if (t >= s && t < s + 6) {
      const c = smooth((t - s) / 2) * (1 - smooth((t - s - 3) / 2));
      open = Math.min(open, 1 - c);
    }
  }
  return Math.max(0.07, open);
};

const nodAt = (t: number, starts: number[] = []) => {
  let n = 0;
  for (const s of starts) {
    if (t >= s && t < s + 14) n = Math.max(n, Math.sin(((t - s) / 14) * Math.PI));
  }
  return n;
};

export const poseAt = (tr: ActingTrack, t: number): Pose => {
  const head = channel(tr.look, t, (k) => k.look.head, 0);
  const n = nodAt(t, tr.nods);
  let R = armAt(tr.R, t, tr.defaultLayer.R);
  if (tr.writing) {
    for (const [a, b] of tr.writing) {
      if (t >= a && t < b) {
        // Short strokes from the wrist and fingers; elbow stays put.
        const env = smooth((t - a) / 6) * (1 - smooth((t - (b - 6)) / 6));
        R = {...R, w: R.w + env * 5 * Math.sin((t - a) * 0.9), f: R.f + env * 1.2 * Math.sin((t - a) * 0.45)};
      }
    }
  }
  return {
    L: armAt(tr.L, t, tr.defaultLayer.L),
    R,
    // Idle life: <1° head sway on a slow sine, never a bob of the whole body.
    head: head + n * 1.5 + (tr.idlePhase === undefined ? 0 : 0.7 * Math.sin(t / 41 + tr.idlePhase)),
    nod: n * 3,
    eyeX: channel(tr.look, t, (k) => k.look.eyeX, 0),
    eyeY: channel(tr.look, t, (k) => k.look.eyeY, 0) + n * 0.6,
    brow: channel(tr.look, t, (k) => k.look.brow ?? 0, 0),
    blink: blinkAt(t, tr.blinks),
    notebook: tr.notebook ? channel(tr.notebook, t, (k) => k.v, 0) : 0,
    pen: tr.pen ? channel(tr.pen, t, (k) => k.v, 0) : 0,
  };
};
