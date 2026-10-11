import React from 'react';
import {
  AbsoluteFill, Composition, Easing, interpolate, spring,
  useCurrentFrame, useVideoConfig,
} from 'remotion';

type Recipe = 'easing' | 'staging' | 'path' | 'continuity' | 'depth';
const palette = {ivory: '#FAF7F2', rose: '#F5E9E9', burgundy: '#91212E', ink: '#242427'};
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
const cardStyle: React.CSSProperties = {
  position: 'absolute', width: 400, height: 250, borderRadius: 24,
  background: palette.rose, border: `3px solid ${palette.burgundy}`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 42, padding: 25, boxSizing: 'border-box', textAlign: 'center',
};

// All state is a function of frame. Each composition is a silent motion study.
export const MotionRecipe: React.FC<{kind: Recipe}> = ({kind}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = (seconds: number) => Math.round(seconds * fps);
  const progress = (start: number, duration: number) =>
    interpolate(frame, [start, start + duration], [0, 1], {...clamp, easing: easeOut});
  const title = {
    easing: 'Compare easing', staging: 'Explore possible directions',
    path: 'Connect insight to a next step', continuity: 'Carry the idea forward',
    depth: 'Use depth with restraint',
  }[kind];
  const headingOpacity = interpolate(frame, [0, f(0.4)], [0, 1], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: palette.ivory, color: palette.ink, fontFamily: 'Arial, sans-serif'}}>
      <div style={{position: 'absolute', top: 90, left: 150, right: 150, fontSize: 70, fontWeight: 700, opacity: headingOpacity}}>{title}</div>

      {kind === 'easing' && ['Linear', 'Cubic ease out', 'Restrained spring'].map((label, i) => {
        const start = f(1);
        const duration = f(0.6);
        const linear = interpolate(frame, [start, start + duration], [0, 1], clamp);
        const eased = progress(start, duration);
        const sprung = frame < start ? 0 : spring({
          frame: frame - start, fps, durationInFrames: duration,
          config: {damping: 200, stiffness: 100, mass: 1, overshootClamping: true},
        });
        const p = [linear, eased, sprung][i];
        return <div key={label} style={{...cardStyle, left: 200 + i * 550, top: 460 + 60 * (1 - p)}}>{label}</div>;
      })}

      {kind === 'staging' && ['New role', 'New field', 'Way of working'].map((label, i) => {
        const start = f(1) + i * f(4 / 30);
        const p = progress(start, f(16 / 30));
        const opacity = interpolate(frame, [start, start + f(10 / 30)], [0, 1], clamp);
        return <div key={label} style={{...cardStyle, left: 200 + i * 550, top: 460 + 48 * (1 - p), opacity}}>{label}</div>;
      })}

      {kind === 'path' && <>
        <div style={{...cardStyle, left: 230, top: 420}}>Interests and motivation</div>
        <div style={{...cardStyle, left: 1290, top: 420, borderWidth: frame >= f(2.8) ? 6 : 3}}>Next step</div>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <path d="M630 545 C850 390 1070 700 1290 545" pathLength={1}
            stroke={palette.burgundy} strokeWidth={7} fill="none"
            strokeDasharray={1} strokeDashoffset={1 - progress(f(2), f(0.8))} />
        </svg>
      </>}

      {kind === 'continuity' && (() => {
        const p = progress(f(1.5), f(0.4));
        // Fade the first label out before bringing the second in.
        const oldOpacity = interpolate(frame, [f(1.5), f(1.65)], [1, 0], clamp);
        const newOpacity = interpolate(frame, [f(1.75), f(1.9)], [0, 1], clamp);
        return <div style={{...cardStyle, left: 230 + 210 * p, top: 430 - 30 * p, width: 400 + 640 * p, height: 250 + 110 * p}}>
          <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: oldOpacity}}>Possible direction</div>
          <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: newOpacity}}>Test an option. Plan the next step.</div>
        </div>;
      })()}

      {kind === 'depth' && (() => {
        const p = progress(f(1), f(3));
        return <>
          <div style={{position: 'absolute', left: 220 + 8 * p, top: 340, width: 1050, height: 580, borderRadius: 100, backgroundColor: palette.rose}} />
          <div style={{position: 'absolute', left: 400 + 14 * p, top: 380, width: 400, height: 460, borderRadius: 32, backgroundColor: '#D9C5C4', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 30, boxSizing: 'border-box', fontSize: 38}}>Coach cutout placeholder</div>
          <div style={{...cardStyle, left: 1080 + 22 * p, top: 460}}>Insight card</div>
        </>;
      })()}

      <div style={{position: 'absolute', left: 150, bottom: 70, fontSize: 28, color: palette.burgundy}}>ASSESS SHIFT · Silent motion study · Proposed settings</div>
    </AbsoluteFill>
  );
};

// Import this into the existing registered root and include it in that root's JSX.
// These examples do not register or replace a project's entry point.
export const MotionRecipeCompositions: React.FC = () => <>
  <Composition id="EasingStudy" component={MotionRecipe} defaultProps={{kind: 'easing' as const}} durationInFrames={180} fps={30} width={1920} height={1080} />
  <Composition id="CardStaging" component={MotionRecipe} defaultProps={{kind: 'staging' as const}} durationInFrames={180} fps={30} width={1920} height={1080} />
  <Composition id="PathDrawing" component={MotionRecipe} defaultProps={{kind: 'path' as const}} durationInFrames={180} fps={30} width={1920} height={1080} />
  <Composition id="CardContinuity" component={MotionRecipe} defaultProps={{kind: 'continuity' as const}} durationInFrames={180} fps={30} width={1920} height={1080} />
  <Composition id="CameraDepth" component={MotionRecipe} defaultProps={{kind: 'depth' as const}} durationInFrames={180} fps={30} width={1920} height={1080} />
</>;
