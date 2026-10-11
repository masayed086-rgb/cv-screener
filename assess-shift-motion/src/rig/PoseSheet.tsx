import {AbsoluteFill} from 'remotion';
import {COLORS} from '../brand';
import {Character, type Pose, type Who} from './Character';
import {ARM, type ArmName} from './acting';

// Static check of every preset: joints connected, hands clear, props in contact.
const arm = (n: ArmName, layer: 'back' | 'front' | 'top') => ({...ARM[n], layer: ('layer' in ARM[n] ? (ARM[n] as {layer: 'back' | 'front' | 'top'}).layer : layer)});
const pose = (L: ArmName, R: ArmName, extra: Partial<Pose> = {}): Pose => ({
  L: arm(L, 'back'),
  R: arm(R, 'front'),
  head: 0,
  nod: 0,
  eyeX: 0,
  eyeY: 0,
  brow: 0,
  blink: 1,
  notebook: 0,
  pen: 0,
  ...extra,
});

const ROWS: [Who, string, Pose][] = [
  ['Layla', 'rest', pose('rest', 'rest')],
  ['Layla', 'clasp', pose('clasp', 'clasp', {head: 3, eyeX: 1.5})],
  ['Layla', 'ask', pose('rest', 'ask', {eyeX: 1.6})],
  ['Layla', 'present', pose('rest', 'present', {eyeX: 1.2, eyeY: -1.2})],
  ['Layla', 'welcome', pose('welcome', 'welcome')],
  ['Omar', 'rest', pose('rest', 'rest')],
  ['Omar', 'chin', pose('rest', 'chin', {eyeX: 1.4, eyeY: -1.8, head: 3})],
  ['Omar', 'respond', pose('ask', 'rest', {eyeX: -1.6})],
  ['Omar', 'write', pose('holdBook', 'write', {notebook: 1, pen: 1, eyeY: 2})],
  ['Omar', 'present', pose('present', 'rest', {eyeX: -1.2, eyeY: -1.2})],
];

export const PoseSheet: React.FC = () => (
  <AbsoluteFill style={{background: COLORS.ivory}}>
    <svg width={1920} height={1080}>
      {ROWS.map(([who, label, p], i) => (
        <g key={i} transform={`translate(${190 + (i % 5) * 385} ${i < 5 ? 30 : 560}) scale(0.78)`}>
          <Character who={who} pose={p} notebookLines={2} />
          <text x={0} y={625} textAnchor="middle" fontSize={26} fill={COLORS.charcoal} fontFamily="sans-serif">
            {who} · {label}
          </text>
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);

// Close-up of the writing pose for checking pen-tip contact.
export const WritingCloseUp: React.FC = () => (
  <AbsoluteFill style={{background: COLORS.ivory}}>
    <svg width={1080} height={1080}>
      <g transform="translate(540 -260) scale(3.2)">
        <Character who="Omar" pose={pose('holdBook', 'write', {notebook: 1, pen: 1, eyeY: 2})} notebookLines={2} />
      </g>
    </svg>
  </AbsoluteFill>
);
