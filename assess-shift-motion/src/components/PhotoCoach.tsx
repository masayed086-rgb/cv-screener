import {Img, interpolate, staticFile} from 'remotion';
import {COLORS, FONT} from '../brand';
import {POSE_ASSETS, type PoseId} from '../coachAssets';
import {EASE_IN_OUT} from '../motion';

// Photographic coach cut-out. Moves as a whole image only: poses change by a
// short aligned dip (feet on the same floor line, face over the same x),
// never by bending or stretching the photograph. The reference poses have
// different head angles, so a full crossfade shows a double face; instead the
// old pose fades out over frames 0–6 and the new one in over 4–10, with only a
// brief low-opacity overlap (MOTION_TRAINING.md ex. 7: prefer a cut to ghosting).

export const POSE_CROSSFADE = 10; // frames for the whole pose change

type Props = {
  // Body height on screen (head top to soles), px.
  bodyHeight: number;
  // Pose change: `from` dips out, then `to` dips in; t in 0..1.
  from: PoseId;
  to: PoseId;
  t: number;
  tag?: string;
};

const PoseImage: React.FC<{id: PoseId; bodyHeight: number; opacity: number}> = ({id, bodyHeight, opacity}) => {
  const a = POSE_ASSETS[id];
  const s = bodyHeight / (a.feet - a.headTop);
  if (opacity <= 0.001) return null;
  return (
    <Img
      src={staticFile(a.file)}
      style={{
        position: 'absolute',
        // Anchor: face x at 0, soles at 0 (the component's origin).
        left: -a.faceX * s,
        top: -a.feet * s,
        width: a.width * s,
        height: a.height * s,
        opacity,
      }}
    />
  );
};

// The component's origin is the point on the floor under the coach's face.
export const PhotoCoach: React.FC<Props> = ({bodyHeight, from, to, t, tag}) => {
  const c = {easing: EASE_IN_OUT, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
  const outOpacity = interpolate(t, [0, 0.6], [1, 0], c);
  const inOpacity = interpolate(t, [0.4, 1], [0, 1], c);
  return (
    <div style={{position: 'absolute', left: 0, top: 0}}>
      {/* soft floor shadow */}
      <div
        style={{
          position: 'absolute',
          left: -bodyHeight * 0.17,
          top: -bodyHeight * 0.012,
          width: bodyHeight * 0.34,
          height: bodyHeight * 0.03,
          borderRadius: '50%',
          background: 'rgba(58,10,16,0.10)',
          filter: 'blur(6px)',
        }}
      />
      {from === to ? (
        <PoseImage id={to} bodyHeight={bodyHeight} opacity={1} />
      ) : (
        <>
          <PoseImage id={from} bodyHeight={bodyHeight} opacity={outOpacity} />
          <PoseImage id={to} bodyHeight={bodyHeight} opacity={inOpacity} />
        </>
      )}
      {tag && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: -200,
            width: 400,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            fontFamily: FONT.family,
            fontWeight: 700,
            fontSize: Math.round(bodyHeight * 0.034),
            letterSpacing: 2,
            color: COLORS.charcoal,
            opacity: 0.5,
          }}
        >
          {tag}
        </div>
      )}
    </div>
  );
};

// Resolve a pose timeline [[startFrame, pose], ...] into a crossfade state.
export const poseState = (frame: number, keys: readonly (readonly [number, PoseId])[]) => {
  let i = 0;
  while (i + 1 < keys.length && keys[i + 1][0] <= frame) i++;
  const to = keys[i][1];
  if (i === 0) return {from: to, to, t: 1};
  const from = keys[i - 1][1];
  const t = (frame - keys[i][0]) / POSE_CROSSFADE;
  return t >= 1 ? {from: to, to, t: 1} : {from, to, t: Math.max(0, t)};
};
