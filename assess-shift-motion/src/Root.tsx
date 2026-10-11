import {Composition, Folder} from 'remotion';
import {CareerCoachingPractice} from './CareerCoachingPractice';
import {VIDEO} from './timeline';
import {IntroVideo} from './intro/IntroVideo';
import {LAYOUTS} from './intro/formats';
import {INTRO_DURATION, INTRO_FPS} from './intro/script';
import {MotionRecipeCompositions} from './examples/MotionRecipes';

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Intro">
      <Composition
        id="IntroReels"
        component={IntroVideo}
        width={LAYOUTS.reels.width}
        height={LAYOUTS.reels.height}
        fps={INTRO_FPS}
        durationInFrames={INTRO_DURATION}
        defaultProps={{format: 'reels' as const}}
      />
      <Composition
        id="IntroLinkedIn"
        component={IntroVideo}
        width={LAYOUTS.linkedin.width}
        height={LAYOUTS.linkedin.height}
        fps={INTRO_FPS}
        durationInFrames={INTRO_DURATION}
        defaultProps={{format: 'linkedin' as const}}
      />
    </Folder>
    <Folder name="Practice">
      <Composition
        id="CareerCoachingPractice"
        component={CareerCoachingPractice}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={VIDEO.durationInFrames}
      />
    </Folder>
    <Folder name="MotionStudies">
      <MotionRecipeCompositions />
    </Folder>
  </>
);
