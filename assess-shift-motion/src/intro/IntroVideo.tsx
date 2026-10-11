import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import '../fonts';
import {COLORS} from '../brand';
import {Cast} from './cast';
import {LAYOUTS, type FormatId} from './formats';
import {SceneBrand, SceneCompare, SceneEnd, SceneOptions, ScenePackages, ScenePlan, SceneQuestion, SceneUnderstand} from './scenes';
import {sceneById} from './script';

const SCENES = [
  ['question', SceneQuestion],
  ['options', SceneOptions],
  ['brand', SceneBrand],
  ['understand', SceneUnderstand],
  ['compare', SceneCompare],
  ['plan', ScenePlan],
  ['packages', ScenePackages],
] as const;

export type IntroProps = {format: FormatId};

// Soft rose backdrop shapes with slow, restrained drift for depth.
const Backdrop: React.FC<{format: FormatId; frame: number}> = ({format, frame}) => {
  const L = LAYOUTS[format];
  const dx = Math.sin(frame / 190) * 14;
  const dy = Math.cos(frame / 230) * 10;
  const r = L.vertical ? 470 : 420;
  return (
    <svg width={L.width} height={L.height} style={{position: 'absolute', inset: 0}}>
      <circle cx={L.stage.x + dx} cy={L.stage.y - (L.vertical ? 40 : 30) + dy} r={r} fill={COLORS.softRose} opacity={0.7} />
      <circle cx={L.stage.x + (L.vertical ? 330 : 640) - dx * 1.6} cy={L.stage.y + (L.vertical ? -470 : -300) - dy} r={L.vertical ? 120 : 110} fill={COLORS.softRose} opacity={0.55} />
    </svg>
  );
};

export const IntroVideo: React.FC<IntroProps> = ({format}) => {
  const L = LAYOUTS[format];
  const frame = useCurrentFrame();
  const end = sceneById('end');
  return (
    <AbsoluteFill style={{background: COLORS.ivory}}>
      <Backdrop format={format} frame={frame} />
      {SCENES.map(([id, Scene]) => {
        const s = sceneById(id);
        return (
          <Sequence key={id} from={s.from} durationInFrames={s.dur} layout="none">
            <Scene L={L} />
          </Sequence>
        );
      })}
      <Cast L={L} frame={frame} />
      <Sequence from={end.from} durationInFrames={end.dur} layout="none">
        <SceneEnd L={L} />
      </Sequence>
    </AbsoluteFill>
  );
};
