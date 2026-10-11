import {interpolate} from 'remotion';
import {Character, FEET_Y} from '../rig/Character';
import {poseAt} from '../rig/acting';
import {EASE_OUT} from '../motion';
import {LAYLA, OMAR, notebookLinesAt} from './acting';
import type {Layout} from './formats';

// Both characters stay on screen for the whole film with feet planted;
// they fade in once at the start and act through their joints only.
export const Cast: React.FC<{L: Layout; frame: number}> = ({L, frame}) => {
  const {laylaX, omarX, floorY, scale} = L.cast;
  const fadeIn = interpolate(frame, [4, 22], [0, 1], {easing: EASE_OUT, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const top = floorY - FEET_Y * scale;
  return (
    <svg width={L.width} height={L.height} style={{position: 'absolute', inset: 0, opacity: fadeIn}}>
      {[laylaX, omarX].map((x) => (
        <ellipse key={x} cx={x} cy={floorY - 4} rx={118 * scale} ry={15 * scale} fill="#3A0A10" opacity={0.09} />
      ))}
      <g transform={`translate(${laylaX} ${top}) scale(${scale})`}>
        <Character who="Layla" pose={poseAt(LAYLA, frame)} />
      </g>
      <g transform={`translate(${omarX} ${top}) scale(${scale})`}>
        <Character who="Omar" pose={poseAt(OMAR, frame)} notebookLines={notebookLinesAt(frame)} />
      </g>
    </svg>
  );
};
