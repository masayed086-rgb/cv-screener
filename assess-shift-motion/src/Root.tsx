import {Composition, Folder} from 'remotion';
import {IntroVideo} from './intro/IntroVideo';
import {LAYOUTS} from './intro/formats';
import {INTRO_DURATION, INTRO_FPS} from './intro/script';
import {MotionRecipeCompositions} from './examples/MotionRecipes';
import {ArtCloseUp, PoseSheet, WritingCloseUp} from './rig/PoseSheet';
import {ConversationStudy} from './rig/ConversationStudy';

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
      <Composition id="ConversationStudy" component={ConversationStudy} width={1920} height={1080} fps={30} durationInFrames={240} />
    </Folder>
    <Folder name="Rig">
      <Composition id="PoseSheet" component={PoseSheet} width={1920} height={1080} fps={30} durationInFrames={1} />
 <Composition id="ArtCloseUp" component={ArtCloseUp} width={1920} height={1080} fps={30} durationInFrames={1} />
      <Composition id="WritingCloseUp" component={WritingCloseUp} width={1080} height={1080} fps={30} durationInFrames={1} />
    </Folder>
    <Folder name="MotionStudies">
      <MotionRecipeCompositions />
    </Folder>
  </>
);
