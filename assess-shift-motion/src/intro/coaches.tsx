import {PhotoCoach, poseState} from '../components/PhotoCoach';
import type {PoseId} from '../coachAssets';
import {EASE_IN_OUT, track} from '../motion';
import type {Layout} from './formats';

// Pose changes follow CHARACTER_ROLES.md: Nour leads the opening question and
// the option comparison; Samir leads assessment insight and planning; both
// share the service, packages and CTA. The options scene is led by graphics,
// so neither coach gestures there (no coach chooses for the viewer).
const POSE_TIMELINE: Record<'samir' | 'nour', (readonly [number, PoseId])[]> = {
  nour: [
    [0, 'nour-standing-front'],
    [1160, 'nour-exploring-options'],
    [1450, 'nour-standing-front'],
  ],
  samir: [
    [0, 'samir-standing-front'],
    [780, 'samir-exploring-options'],
    [1000, 'samir-standing-front'],
    [1560, 'samir-exploring-options'],
    [1790, 'samir-standing-front'],
  ],
};

// Visibility: [frame, opacity]. Entrances are a whole-cutout slide + fade.
const VISIBILITY: Record<'samir' | 'nour', [number, number][]> = {
  nour: [[10, 0], [30, 1], [478, 1], [494, 0], [758, 0], [778, 1], [2040, 1], [2054, 0]],
  samir: [[360, 0], [380, 1], [478, 1], [494, 0], [752, 0], [772, 1], [2040, 1], [2054, 0]],
};

export const COACH_TAG = 'REFERENCE CROP · NOT FINAL ART';

export const Coaches: React.FC<{L: Layout; frame: number}> = ({L, frame}) => (
  <>
    {(['samir', 'nour'] as const).map((who) => {
      const opacity = track(frame, VISIBILITY[who], EASE_IN_OUT);
      if (opacity <= 0.001) return null;
      const slide = (1 - opacity) * 50 * (who === 'samir' ? -1 : 1);
      const cx = who === 'samir' ? L.coaches.samirX : L.coaches.nourX;
      const p = poseState(frame, POSE_TIMELINE[who]);
      return (
        <div
          key={who}
          style={{position: 'absolute', left: cx, top: L.coaches.floorY, opacity, transform: `translateX(${slide}px)`}}
        >
          <PhotoCoach bodyHeight={L.coaches.bodyHeight} from={p.from} to={p.to} t={p.t} tag={COACH_TAG} />
        </div>
      );
    })}
  </>
);
