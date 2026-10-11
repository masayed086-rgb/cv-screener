import {interpolate} from 'remotion';
import {Puppet, PUPPETS, type PuppetWho} from '../rig/Puppet';
import {poseAt} from '../rig/acting';
import type {Pose} from '../rig/Character';
import {EASE_OUT} from '../motion';
import {LAYLA, OMAR} from './acting';
import type {Layout} from './formats';

// Both characters are jointed cut-outs of the model-sheet illustrations
// (scripts/build_puppets.py). They stay on screen with feet planted, fade in
// once, and act through shoulder/elbow/head joints only.
const BODY_PX = {reels: 640, linkedin: 560};

const front = (p: Pose): Pose => ({...p, L: {...p.L, layer: 'front'}, R: {...p.R, layer: 'front'}});

export const Cast: React.FC<{L: Layout; frame: number}> = ({L, frame}) => {
  const {laylaX, omarX, floorY} = L.cast;
  const fadeIn = interpolate(frame, [4, 22], [0, 1], {easing: EASE_OUT, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const place = (who: PuppetWho, x: number) => {
    const m = PUPPETS[who];
    const k = BODY_PX[L.id] / (m.feetY - 20);
    return `translate(${x - m.pivots.neck[0] * k} ${floorY - m.feetY * k}) scale(${k})`;
  };
  return (
    <svg width={L.width} height={L.height} style={{position: 'absolute', inset: 0, opacity: fadeIn}}>
      {[laylaX, omarX].map((x) => (
        <ellipse key={x} cx={x} cy={floorY - 4} rx={L.vertical ? 120 : 108} ry={14} fill="#3A0A10" opacity={0.08} />
      ))}
      <g transform={place('layla', laylaX)}>
        <Puppet who="layla" pose={front(poseAt(LAYLA, frame))} />
      </g>
      <g transform={place('omar', omarX)}>
        <Puppet who="omar" pose={front(poseAt(OMAR, frame))} />
      </g>
    </svg>
  );
};
