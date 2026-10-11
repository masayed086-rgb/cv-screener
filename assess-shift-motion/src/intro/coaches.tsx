import {interpolate} from 'remotion';
import {Coach, type ArmPose} from '../components/Coach';
import {DUR, EASE_IN_OUT, track} from '../motion';
import type {Layout} from './formats';

// Pose presets. Positive arm angles lift outward; "inner" faces frame centre.
type Pose = {inner: ArmPose; outer: ArmPose; tilt: number; notebook: number};
const POSES = {
  rest: {inner: {upper: 6, fore: 0}, outer: {upper: 6, fore: 0}, tilt: 0, notebook: 0},
  listen: {inner: {upper: 4, fore: -74}, outer: {upper: 4, fore: -74}, tilt: 5, notebook: 1},
  present: {inner: {upper: 70, fore: 45}, outer: {upper: 6, fore: 0}, tilt: 3, notebook: 0},
  presentHigh: {inner: {upper: 96, fore: 30}, outer: {upper: 6, fore: 0}, tilt: 2, notebook: 0},
  welcome: {inner: {upper: 32, fore: 14}, outer: {upper: 26, fore: 12}, tilt: 0, notebook: 0},
} satisfies Record<string, Pose>;
type PoseName = keyof typeof POSES;

// Who does what, when (absolute frames). Presenting roles are split across
// the film: Nour leads the question, options and comparison; Samir leads
// self-understanding and the plan. Each pose blends in over DUR.gesture.
const POSE_TIMELINE: Record<'samir' | 'nour', [number, PoseName][]> = {
  nour: [
    [0, 'listen'],
    [60, 'present'],
    [170, 'listen'],
    [236, 'present'],
    [340, 'listen'],
    [1160, 'present'],
    [1290, 'presentHigh'],
    [1450, 'listen'],
    [1850, 'welcome'],
  ],
  samir: [
    [0, 'listen'],
    [780, 'present'],
    [900, 'presentHigh'],
    [1000, 'listen'],
    [1560, 'present'],
    [1680, 'presentHigh'],
    [1790, 'listen'],
    [1850, 'welcome'],
  ],
};

// Visibility: [frame, opacity] and a horizontal slide toward the outside edge.
const VISIBILITY: Record<'samir' | 'nour', [number, number][]> = {
  nour: [[10, 0], [30, 1], [478, 1], [494, 0], [758, 0], [778, 1], [2040, 1], [2054, 0]],
  samir: [[360, 0], [380, 1], [478, 1], [494, 0], [752, 0], [772, 1], [2040, 1], [2054, 0]],
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpArm = (a: ArmPose, b: ArmPose, t: number): ArmPose => ({upper: lerp(a.upper, b.upper, t), fore: lerp(a.fore, b.fore, t)});

const poseAt = (frame: number, keys: [number, PoseName][]): Pose => {
  let i = 0;
  while (i + 1 < keys.length && keys[i + 1][0] <= frame) i++;
  const cur = POSES[keys[i][1]];
  if (i === 0) return cur;
  const prev = POSES[keys[i - 1][1]];
  const t = interpolate(frame, [keys[i][0], keys[i][0] + DUR.gesture], [0, 1], {
    easing: EASE_IN_OUT,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return {
    inner: lerpArm(prev.inner, cur.inner, t),
    outer: lerpArm(prev.outer, cur.outer, t),
    tilt: lerp(prev.tilt, cur.tilt, t),
    notebook: lerp(prev.notebook, cur.notebook, t),
  };
};

// Deterministic blinks, offset so the coaches never blink together.
const blinking = (frame: number, period: number, offset: number) => (frame + offset) % period < 3;

export const Coaches: React.FC<{L: Layout; frame: number}> = ({L, frame}) => (
  <>
    {(['samir', 'nour'] as const).map((who) => {
      const side = who === 'samir' ? 'left' : 'right';
      const opacity = track(frame, VISIBILITY[who], EASE_IN_OUT);
      if (opacity <= 0.001) return null;
      const slide = (1 - opacity) * 50 * (side === 'left' ? -1 : 1);
      const p = poseAt(frame, POSE_TIMELINE[who]);
      // Gentle breathing, a pure function of frame.
      const breathe = Math.sin((frame + (who === 'samir' ? 0 : 40)) / 22) * 2;
      const cx = who === 'samir' ? L.coaches.samirX : L.coaches.nourX;
      const s = L.coaches.scale;
      return (
        <div
          key={who}
          style={{
            position: 'absolute',
            left: cx - 130 * s,
            top: L.coaches.floorY - 520 * s,
            opacity,
            transform: `translate(${slide}px, ${breathe}px) scale(${s})`,
            transformOrigin: '0 0',
          }}
        >
          <Coach
            who={who}
            side={side}
            inner={p.inner}
            outer={p.outer}
            tilt={p.tilt}
            notebook={p.notebook}
            blink={blinking(frame, who === 'samir' ? 97 : 113, who === 'samir' ? 31 : 70)}
          />
        </div>
      );
    })}
  </>
);
