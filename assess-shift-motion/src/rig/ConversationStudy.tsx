import {AbsoluteFill, useCurrentFrame} from 'remotion';
import '../fonts';
import {COLORS, FONT, OMAR_TEAL} from '../brand';
import {Puppet, PUPPETS} from './Puppet';
import type {Pose} from './Character';
import {poseAt, type ActingTrack} from './acting';

// Reproduction of the pack's 8-second study (CHARACTER_MOTION_BIBLE.md,
// "Actual study timing") on the ported rig: Layla asks, Omar responds.
const LAYLA: ActingTrack = {
  defaultLayer: {L: 'back', R: 'front'},
  L: [{at: 0, dur: 1, arm: 'rest'}],
  R: [
    {at: 0, dur: 1, arm: 'rest'},
    {at: 28, dur: 7, arm: 'anticipate'},
    {at: 36, dur: 29, arm: 'ask'},
    {at: 106, dur: 28, arm: 'rest'},
  ],
  look: [
    {at: 0, dur: 1, look: {head: 0, eyeX: 0.3, eyeY: 0}},
    {at: 8, dur: 12, look: {head: 0, eyeX: 1.7, eyeY: 0}},
    {at: 42, dur: 30, look: {head: 2.8, eyeX: 2.3, eyeY: 0}},
    {at: 108, dur: 30, look: {head: 0, eyeX: 1.7, eyeY: 0}},
    {at: 151, dur: 20, look: {head: 2, eyeX: 1.7, eyeY: 0}},
    {at: 188, dur: 17, look: {head: 0, eyeX: 1.7, eyeY: 0}},
  ],
  nods: [180],
  blinks: [99, 221],
};
const OMAR: ActingTrack = {
  defaultLayer: {L: 'back', R: 'front'},
  L: [
    {at: 0, dur: 1, arm: 'rest'},
    {at: 134, dur: 7, arm: 'anticipate'},
    {at: 142, dur: 32, arm: 'ask'},
    {at: 208, dur: 27, arm: 'rest'},
  ],
  R: [{at: 0, dur: 1, arm: 'rest'}],
  look: [
    {at: 0, dur: 1, look: {head: 0, eyeX: -0.3, eyeY: 0}},
    {at: 8, dur: 12, look: {head: 0, eyeX: -1.7, eyeY: 0}},
    {at: 42, dur: 30, look: {head: -2.8, eyeX: -1.7, eyeY: 0}},
    {at: 108, dur: 30, look: {head: 0, eyeX: -1.7, eyeY: 0}},
    {at: 142, dur: 32, look: {head: -2, eyeX: -2.3, eyeY: 0}},
    {at: 208, dur: 27, look: {head: 0, eyeX: -1.7, eyeY: 0}},
  ],
  nods: [84],
  blinks: [58, 121],
};

const beat = (f: number) => (f < 36 ? 'LISTEN' : f < 134 ? 'ASK AN OPEN QUESTION' : f < 142 ? 'GIVE SPACE' : 'RESPOND WITH INTENT');

export const ConversationStudy: React.FC = () => {
  const f = useCurrentFrame();
  const front = (p: Pose): Pose => ({...p, L: {...p.L, layer: 'front'}, R: {...p.R, layer: 'front'}});
  const place = (who: 'layla' | 'omar', x: number) => {
    const m = PUPPETS[who];
    const k = 640 / (m.feetY - 20);
    return `translate(${x - m.pivots.neck[0] * k} ${930 - m.feetY * k}) scale(${k})`;
  };
  return (
    <AbsoluteFill style={{background: COLORS.ivory, fontFamily: FONT.family}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <circle cx={960} cy={490} r={315} fill={COLORS.softRose} opacity={0.65} />
        <ellipse cx={570} cy={928} rx={120} ry={16} fill="#3A0A10" opacity={0.09} />
        <ellipse cx={1350} cy={928} rx={120} ry={16} fill="#3A0A10" opacity={0.09} />
        <g transform={place('layla', 570)}>
          <Puppet who="layla" pose={front(poseAt(LAYLA, f))} />
        </g>
        <g transform={place('omar', 1350)}>
          <Puppet who="omar" pose={front(poseAt(OMAR, f))} />
        </g>
        <path d="M840 459 L1080 459" stroke={COLORS.burgundy} strokeWidth={2} />
        <rect x={780} y={1040} width={360} height={3} rx={1.5} fill="#E6D6D6" />
        <rect x={780} y={1040} width={360 * Math.min(1, f / 239)} height={3} rx={1.5} fill={COLORS.burgundy} />
      </svg>
      <div style={{position: 'absolute', left: 120, top: 76, fontSize: 27, letterSpacing: 5, color: COLORS.burgundy, fontWeight: 700}}>ASSESS SHIFT</div>
      <div style={{position: 'absolute', left: 120, top: 124, fontSize: 42, color: COLORS.charcoal, fontWeight: 700}}>A conversation that helps you move forward.</div>
      <div style={{position: 'absolute', left: 120, top: 184, fontSize: 19, letterSpacing: 2, color: '#6A6160', fontWeight: 500}}>JOINTED MODEL-SHEET PUPPETS · 30 FPS · SILENT</div>
      <div style={{position: 'absolute', width: 400, left: 760, top: 405, textAlign: 'center', fontSize: 18, letterSpacing: 2, color: '#6A6160', fontWeight: 700}}>{beat(f)}</div>
      <div style={{position: 'absolute', width: 600, left: 660, top: 487, textAlign: 'center', fontSize: 24, color: COLORS.charcoal, fontWeight: 500}}>Clarity starts with a question.</div>
      <div style={{position: 'absolute', width: 300, left: 420, top: 972, textAlign: 'center', fontSize: 22, letterSpacing: 3, color: COLORS.burgundy, fontWeight: 700}}>LAYLA · COACH</div>
      <div style={{position: 'absolute', width: 300, left: 1200, top: 972, textAlign: 'center', fontSize: 22, letterSpacing: 3, color: OMAR_TEAL, fontWeight: 700}}>OMAR · COACHEE</div>
    </AbsoluteFill>
  );
};
