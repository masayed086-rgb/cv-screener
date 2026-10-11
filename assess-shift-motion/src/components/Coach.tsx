import {COLORS, CHARACTERS, FONT} from '../brand';

// PLACEHOLDER coach figure drawn in code from the character sheet's locks
// (burgundy open blazer, ivory shirt, charcoal trousers and shoes, hair and
// beard cues). It is NOT the approved illustration — replace with separate
// approved pose artwork when supplied.

type ArmPose = {upper: number; fore: number};

type Props = {
  who: 'samir' | 'nour';
  // Which side of the frame the coach stands on; the inner arm faces centre.
  side: 'left' | 'right';
  inner: ArmPose;
  blink: boolean;
  showTag?: boolean;
};

const W = 260;
const H = 520;

const Arm: React.FC<{shoulderX: number; mirror: boolean; pose: ArmPose; skin: string}> = ({
  shoulderX,
  mirror,
  pose,
  skin,
}) => {
  // Drawn as a left arm; mirrored for the right arm so the same pose values
  // mean "lift outward" on both sides.
  const s = mirror ? -1 : 1;
  return (
    <g transform={`translate(${shoulderX} 112) scale(${s} 1) rotate(${pose.upper})`}>
      <rect x={-13} y={-6} width={26} height={84} rx={13} fill={COLORS.burgundy} />
      <g transform={`translate(0 72) rotate(${pose.fore})`}>
        <rect x={-12} y={-6} width={24} height={76} rx={12} fill={COLORS.burgundy} />
        <rect x={-11} y={62} width={22} height={8} rx={3} fill={COLORS.ivory} />
        <ellipse cx={0} cy={80} rx={10} ry={13} fill={skin} />
      </g>
    </g>
  );
};

export const Coach: React.FC<Props> = ({who, side, inner, blink, showTag = true}) => {
  const c = CHARACTERS[who];
  const rest: ArmPose = {upper: 6, fore: 0};
  // Viewer-left arm is the inner arm for a coach standing on the right.
  const leftPose = side === 'right' ? inner : rest;
  const rightPose = side === 'left' ? inner : rest;
  const eyeScale = blink ? 0.12 : 1;

  return (
    <div style={{width: W, height: H + 70, position: 'relative'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
        {/* floor shadow */}
        <ellipse cx={130} cy={514} rx={92} ry={12} fill={COLORS.softRose} />

        {/* back hair (Nour) */}
        {who === 'nour' && (
          <path
            d="M90 62 Q86 16 130 16 Q176 16 172 64 Q178 100 170 126 Q162 116 155 128 Q147 114 140 124 L120 124 Q113 114 105 128 Q98 116 90 126 Q82 100 90 62Z"
            fill={c.hair}
          />
        )}

        {/* legs */}
        <path d="M84 278 L129 278 L125 496 L94 496Z" fill={COLORS.charcoal} />
        <path d="M131 278 L176 278 L166 496 L135 496Z" fill={COLORS.charcoal} />
        {/* shoes */}
        <path d="M90 494 L127 494 L128 512 Q104 518 78 512 Q80 498 90 494Z" fill="#151517" />
        <path d="M133 494 L170 494 Q180 498 182 512 Q156 518 132 512Z" fill="#151517" />

        {/* arms behind torso edge */}
        <Arm shoulderX={82} mirror={false} pose={leftPose} skin={c.skin} />
        <Arm shoulderX={178} mirror pose={rightPose} skin={c.skin} />

        {/* neck */}
        <rect x={119} y={86} width={22} height={24} rx={6} fill={c.skin} />

        {/* blazer */}
        <path d="M78 120 Q78 103 96 101 L164 101 Q182 103 182 120 L180 292 L80 292Z" fill={COLORS.burgundy} />
        {/* shirt */}
        <path d="M112 101 L148 101 L144 292 L116 292Z" fill={COLORS.ivory} />
        {who === 'samir' ? (
          <>
            {/* open collar */}
            <path d="M112 101 L130 124 L122 132 L106 106Z" fill={COLORS.white} />
            <path d="M148 101 L130 124 L138 132 L154 106Z" fill={COLORS.white} />
            <path d="M124 101 L130 120 L136 101Z" fill={c.skin} />
          </>
        ) : (
          <path d="M116 101 Q130 114 144 101Z" fill={c.skin} />
        )}
        {/* lapels */}
        <path d="M108 101 L132 200 L118 292 L110 292 L98 118Z" fill={COLORS.burgundyShade} />
        <path d="M152 101 L128 200 L142 292 L150 292 L162 118Z" fill={COLORS.burgundyShade} />
        {who === 'samir' && <rect x={116} y={284} width={28} height={8} fill={COLORS.charcoal} />}

        {/* ears */}
        <ellipse cx={100} cy={62} rx={6} ry={9} fill={c.skin} />
        <ellipse cx={160} cy={62} rx={6} ry={9} fill={c.skin} />
        {/* head */}
        <ellipse cx={130} cy={58} rx={30} ry={37} fill={c.skin} />

        {/* hair front */}
        {who === 'samir' ? (
          <>
            <path d="M99 56 Q95 18 130 17 Q167 18 161 56 Q158 34 130 33 Q104 34 99 56Z" fill={c.hair} />
            {/* subtle grey at the temples */}
            <path d="M100.5 47 Q100 53 101.5 59" stroke={c.grey} strokeWidth={3} fill="none" strokeLinecap="round" />
            <path d="M159.5 47 Q160 53 158.5 59" stroke={c.grey} strokeWidth={3} fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M99 64 Q98 22 124 22 Q110 36 106 66Z" fill={c.hair} />
            <path d="M118 22 Q166 18 162 64 Q152 34 120 30Z" fill={c.hair} />
          </>
        )}

        {/* face */}
        <g transform={`translate(0 60) scale(1 ${eyeScale}) translate(0 -60)`}>
          <ellipse cx={118} cy={60} rx={3.4} ry={3.8} fill="#2A1D18" />
          <ellipse cx={142} cy={60} rx={3.4} ry={3.8} fill="#2A1D18" />
        </g>
        <path d="M111 50 Q118 46 125 49" stroke={c.hair} strokeWidth={2.6} fill="none" strokeLinecap="round" />
        <path d="M135 49 Q142 46 149 50" stroke={c.hair} strokeWidth={2.6} fill="none" strokeLinecap="round" />
        <path d="M130 62 Q127 71 131 73" stroke="#7A4E3A" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        {who === 'samir' ? (
          <>
            <path d="M101 64 Q103 98 130 100 Q157 98 159 64 Q155 92 140 93 Q130 89 120 93 Q105 92 101 64Z" fill={c.hair} />
            <path d="M118 78 Q130 72 142 78 Q130 81 118 78Z" fill={c.hair} />
            <path d="M122 84 Q130 88 138 84" stroke="#6E3A2E" strokeWidth={2.2} fill="none" strokeLinecap="round" />
          </>
        ) : (
          <path d="M121 80 Q130 86 139 80" stroke="#8A3B36" strokeWidth={2.4} fill="none" strokeLinecap="round" />
        )}
      </svg>

      {showTag && (
        <div
          style={{
            position: 'absolute',
            top: H + 18,
            left: -80,
            width: W + 160,
            whiteSpace: 'nowrap',
            textAlign: 'center',
            fontFamily: FONT.family,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 2,
            color: COLORS.charcoal,
            opacity: 0.55,
          }}
        >
          {c.name.toUpperCase()} · PLACEHOLDER ART
        </div>
      )}
    </div>
  );
};
