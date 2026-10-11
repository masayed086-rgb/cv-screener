import {continueRender, delayRender, staticFile} from 'remotion';
import manifest from '../../public/puppets/manifest.json';
import type {Pose} from './Character';

// Jointed cut-out puppet built from the model sheet's front views
// (scripts/build_puppets.py). Same Pose interface as the vector rig:
// shoulder -> elbow chains per arm (wrist folded into the forearm layer),
// head tilt/nod about the neck, blink lids over the painted eyes.

export type PuppetWho = 'layla' | 'omar';
type Pt = [number, number];
type ArmPiv = {shoulder: Pt; elbow: Pt; wrist: Pt};
type Entry = {width: number; height: number; feetY: number; eyes: Pt[]; lid: [number, number, number]; pivots: {armL: ArmPiv; armR: ArmPiv; neck: Pt}};
export const PUPPETS = manifest as unknown as Record<PuppetWho, Entry>;

// SVG <image> loads are not awaited by the renderer, so preload every layer
// (decoded) before any frame is captured.
const PARTS = ['body', 'head', 'armL_upper', 'armL_lower', 'armR_upper', 'armR_lower'];
if (typeof window !== 'undefined') {
  const handle = delayRender('Loading puppet layers');
  Promise.all(
    (['layla', 'omar'] as const).flatMap((who) =>
      PARTS.map(
        (part) =>
          new Promise<void>((resolve) => {
            const im = new Image();
            im.onload = () => (im.decode ? im.decode().then(() => resolve(), () => resolve()) : resolve());
            im.onerror = () => resolve();
            im.src = staticFile(`puppets/${who}/${part}.png`);
          }),
      ),
    ),
  ).then(() => continueRender(handle));
}

const img = (who: PuppetWho, part: string, w: number, h: number) => (
  <image href={staticFile(`puppets/${who}/${part}.png`)} x={0} y={0} width={w} height={h} />
);

export const Puppet: React.FC<{who: PuppetWho; pose: Pose}> = ({who, pose}) => {
  const m = PUPPETS[who];
  const {width: w, height: h} = m;
  const arm = (side: 'L' | 'R') => {
    const p = m.pivots[`arm${side}`];
    const s = side === 'L' ? 1 : -1;
    const a = pose[side];
    return (
      <g key={side} transform={`rotate(${s * a.u} ${p.shoulder[0]} ${p.shoulder[1]})`}>
        {img(who, `arm${side}_upper`, w, h)}
        <g transform={`rotate(${s * a.f} ${p.elbow[0]} ${p.elbow[1]})`}>{img(who, `arm${side}_lower`, w, h)}</g>
      </g>
    );
  };
  const [nx, ny] = m.pivots.neck;
  const lid = `rgb(${m.lid.join(',')})`;
  const closed = 1 - (pose.blink - 0.07) / 0.93; // 0 open .. 1 closed
  return (
    <g>
      {(['L', 'R'] as const).filter((s) => pose[s].layer === 'back').map(arm)}
      {img(who, 'body', w, h)}
      <g transform={`translate(0 ${pose.nod}) rotate(${pose.head} ${nx} ${ny})`}>
        {img(who, 'head', w, h)}
        {closed > 0.02 &&
          m.eyes.map(([ex, ey], i) => (
            // Upper lid sweeps down over the painted eye; lash line at its edge.
            <g key={i}>
              <path d={`M${ex - 12} ${ey - 6} Q${ex} ${ey - 9} ${ex + 12} ${ey - 6} L${ex + 12} ${ey - 6 + 10 * closed} Q${ex} ${ey - 4 + 12 * closed} ${ex - 12} ${ey - 6 + 10 * closed} Z`} fill={lid} />
              <path d={`M${ex - 12} ${ey - 6 + 10 * closed} Q${ex} ${ey - 4 + 12 * closed} ${ex + 12} ${ey - 6 + 10 * closed}`} stroke="#2A1A14" strokeWidth={1.8} fill="none" opacity={closed} />
            </g>
          ))}
      </g>
      {(['L', 'R'] as const).filter((s) => pose[s].layer !== 'back').map(arm)}
    </g>
  );
};
