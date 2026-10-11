import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import './fonts';
import {COLORS, FONT} from './brand';
import {DUR, EASE_IN_OUT, EASE_OUT, OFFSET, enter, track} from './motion';
import {CARDS, PRACTICE_POSES, LAYOUT, LOCKUP, MARK, PATH, SCENES} from './timeline';
import {Card} from './components/Card';
import {PhotoCoach, poseState} from './components/PhotoCoach';
import {Headline} from './components/Headline';


const progress = (frame: number, [a, b]: readonly [number, number], easing = EASE_OUT) =>
  interpolate(frame, [a, b], [0, 1], {easing, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// `drawn` reveals the stroke from its start; `trimmed` removes it from the start.
const Stroke: React.FC<{d: string; drawn: number; trimmed?: number; fade?: number}> = ({d, drawn, trimmed = 0, fade = 1}) => (
  <path
    d={d}
    pathLength={1}
    strokeDasharray={`${Math.max(0, drawn - trimmed)} 2`}
    strokeDashoffset={-trimmed}
    stroke={COLORS.burgundy}
    strokeWidth={8}
    strokeLinecap="round"
    fill="none"
    opacity={drawn > 0 ? fade : 0}
  />
);

export const CareerCoachingPractice: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();

  // Coaches enter together with matched treatment.
  const coachIn = enter(frame, 0, DUR.coach, OFFSET.coach);

  // Option cards share emphasis while both are compared — never one alone.
  const optionEmphasis = progress(frame, [200, 216]) * (1 - progress(frame, [272, 284]));

  const trunk =
    progress(frame, PATH.drawTrunk) * PATH.trunkBranchPoint +
    progress(frame, PATH.extendTrunk) * (1 - PATH.trunkBranchPoint);
  const trunkTrim = progress(frame, PATH.retractTrunk, EASE_IN_OUT) * PATH.trunkRetractTo;
  const branches = progress(frame, PATH.drawBranches);
  // Branches fade (rather than undraw) so they never read as an arrow.
  const branchFade = 1 - progress(frame, PATH.fadeBranches, EASE_IN_OUT);
  const markScale = spring({frame: frame - MARK.pop[0], fps, config: {damping: 18, stiffness: 140}, durationInFrames: MARK.pop[1] - MARK.pop[0]});

  const lockup = SCENES[3];
  const lockName = enter(frame, lockup.from + 4, DUR.heading, OFFSET.heading);
  const lockDesc = enter(frame, lockup.from + 10, DUR.heading, OFFSET.heading);
  const tagline = enter(frame, 302, DUR.heading, OFFSET.heading);

  return (
    <AbsoluteFill style={{background: COLORS.ivory}}>
      {/* headline zone */}
      <div style={{position: 'absolute', top: LAYOUT.headlineY, left: 90, right: 90}}>
        {SCENES.slice(0, 3).map((s) => (
          <div key={s.id} style={{position: 'absolute', width: '100%'}}>
            <Headline scene={s} frame={frame} isLast={false} />
          </div>
        ))}
        {frame >= lockup.from && (
          <div style={{position: 'absolute', width: '100%', textAlign: 'center', fontFamily: FONT.family}}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 112,
                letterSpacing: 6,
                color: COLORS.burgundy,
                opacity: lockName.opacity,
                transform: `translateY(${lockName.offset}px)`,
              }}
            >
              {LOCKUP.name}
            </div>
            <div
              style={{
                marginTop: 4,
                fontWeight: 500,
                fontSize: 46,
                letterSpacing: 10,
                textTransform: 'uppercase',
                color: COLORS.charcoal,
                opacity: lockDesc.opacity,
                transform: `translateY(${lockDesc.offset}px)`,
              }}
            >
              {LOCKUP.descriptor}
            </div>
          </div>
        )}
      </div>

      {/* path layer, under the cards */}
      <svg width={width} height={1920} style={{position: 'absolute', inset: 0}}>
        <Stroke d={PATH.trunk} drawn={trunk} trimmed={trunkTrim} />
        <Stroke d={PATH.branchLeft} drawn={branches} fade={branchFade} />
        <Stroke d={PATH.branchRight} drawn={branches} fade={branchFade} />
        {markScale > 0.001 && (
          <g transform={`translate(${MARK.x} ${MARK.y}) scale(${markScale})`}>
            <circle r={MARK.r + 22} fill={COLORS.softRose} />
            <circle r={MARK.r} fill={COLORS.burgundy} />
            <path d="M-26 0 H26 M6 -20 L26 0 L6 20" stroke={COLORS.white} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}
      </svg>

      {/* cards */}
      {CARDS.map((c) => {
        const x = track(frame, c.x);
        const y = track(frame, c.y);
        const opacity = track(frame, c.opacity);
        const scale = track(frame, c.scale);
        if (opacity <= 0.001) return null;
        return (
          <div
            key={c.id}
            style={{
              position: 'absolute',
              left: x - c.w / 2,
              top: y - c.h / 2,
              opacity,
              transform: `scale(${scale})`,
            }}
          >
            <Card card={c} emphasis={c.kind === 'option' ? optionEmphasis : 0} />
          </div>
        );
      })}

      {/* tagline */}
      <div
        style={{
          position: 'absolute',
          top: 1000,
          left: 90,
          right: 90,
          textAlign: 'center',
          fontFamily: FONT.family,
          fontWeight: 700,
          fontSize: 52,
          color: COLORS.charcoal,
          opacity: tagline.opacity,
          transform: `translateY(${tagline.offset}px)`,
        }}
      >
        Your next move deserves <span style={{color: COLORS.burgundy}}>clarity.</span>
      </div>

      {/* coaches: matched size, mirrored positions */}
      {(
        [
          ['samir', LAYOUT.samirX],
          ['nour', LAYOUT.nourX],
        ] as const
      ).map(([who, cx]) => {
        const p = poseState(frame, PRACTICE_POSES[who]);
        return (
          <div
            key={who}
            style={{
              position: 'absolute',
              left: cx,
              top: LAYOUT.floorY,
              opacity: coachIn.opacity,
              transform: `translateY(${coachIn.offset}px)`,
            }}
          >
            <PhotoCoach bodyHeight={LAYOUT.coachHeight} from={p.from} to={p.to} t={p.t} tag="REFERENCE CROP · NOT FINAL ART" />
          </div>
        );
      })}

      {/* draft label */}
      <div
        style={{
          position: 'absolute',
          bottom: 90,
          width: '100%',
          textAlign: 'center',
          fontFamily: FONT.family,
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: 3,
          color: COLORS.charcoal,
          opacity: 0.4,
        }}
      >
        SILENT DRAFT · PREVIEW · v0.3
      </div>
    </AbsoluteFill>
  );
};
