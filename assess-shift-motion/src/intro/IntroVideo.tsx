import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import '../fonts';
import {COLORS, FONT} from '../brand';
import {Coaches} from './coaches';
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

export const IntroVideo: React.FC<IntroProps> = ({format}) => {
  const L = LAYOUTS[format];
  const frame = useCurrentFrame();
  const end = sceneById('end');
  const onEndCard = frame >= end.from + 20;
  return (
    <AbsoluteFill style={{background: COLORS.ivory}}>
      {SCENES.map(([id, Scene]) => {
        const s = sceneById(id);
        return (
          <Sequence key={id} from={s.from} durationInFrames={s.dur} layout="none">
            <Scene L={L} />
          </Sequence>
        );
      })}
      <Coaches L={L} frame={frame} />
      <Sequence from={end.from} durationInFrames={end.dur} layout="none">
        <SceneEnd L={L} />
      </Sequence>
      <div
        style={{
          position: 'absolute',
          bottom: L.draftLabel.bottom,
          width: '100%',
          textAlign: 'center',
          fontFamily: FONT.family,
          fontWeight: 700,
          fontSize: L.draftLabel.size,
          letterSpacing: 3,
          color: onEndCard ? COLORS.softRose : COLORS.charcoal,
          opacity: 0.4,
        }}
      >
        SILENT DRAFT · PLACEHOLDER COACHES · v0.2
      </div>
    </AbsoluteFill>
  );
};
