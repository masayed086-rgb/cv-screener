import {interpolate} from 'remotion';
import {COLORS, FONT} from '../brand';
import {DUR, EASE_OUT, OFFSET, enter} from '../motion';
import type {Scene} from '../timeline';

type Props = {scene: Scene; frame: number; isLast: boolean; size?: number};

// Enters a few frames after its scene starts, holds still while read, and
// leaves over the last frames of the scene (except the final scene).
export const Headline: React.FC<Props> = ({scene, frame, isLast, size = 74}) => {
  const inStart = scene.from + (scene.from === 0 ? 8 : 4);
  const {opacity: inOpacity, offset} = enter(frame, inStart, DUR.heading, OFFSET.heading);
  const out = isLast
    ? 0
    : interpolate(frame, [scene.to - DUR.headingOut, scene.to], [0, 1], {
        easing: EASE_OUT,
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
  if (frame < scene.from || frame >= scene.to + (isLast ? 1 : 0)) return null;
  return (
    <div
      style={{
        fontFamily: FONT.family,
        fontWeight: FONT.headlineWeight,
        fontSize: size,
        lineHeight: 1.15,
        textAlign: 'center',
        color: COLORS.charcoal,
        opacity: inOpacity * (1 - out),
        transform: `translateY(${offset - out * 10}px)`,
      }}
    >
      {scene.headline.map((seg, i) => (
        <span key={i} style={{color: seg.em ? COLORS.burgundy : undefined}}>
          {seg.text}
        </span>
      ))}
    </div>
  );
};
