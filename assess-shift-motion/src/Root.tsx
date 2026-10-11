import {Composition} from 'remotion';
import {CareerCoachingPractice} from './CareerCoachingPractice';
import {VIDEO} from './timeline';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="CareerCoachingPractice"
    component={CareerCoachingPractice}
    width={VIDEO.width}
    height={VIDEO.height}
    fps={VIDEO.fps}
    durationInFrames={VIDEO.durationInFrames}
  />
);
