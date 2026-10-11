// Articulated vector character for Layla (coach) and Omar (coachee).
// Ported from the pack's examples/CharacterMotion.mjs (same group ids, joint
// pivots and paths) and generalised so both arms, head, gaze, brows, blinks
// and props can be posed. This is the pack's simplified vector rig with some
// added detail — not an exact vectorisation of Coach_Coachee_Model_Sheet.png.
//
// Joint chain per arm: shoulder (±46,149) → elbow (0,88) → wrist (0,84).
// Angles are in "outward" convention: positive moves the hand away from the
// body's centre line, so the same pose reads the same on either arm.

export type Who = 'Layla' | 'Omar';
export type ArmLayer = 'back' | 'front' | 'top';
export type HandShape = 'relaxed' | 'open' | 'grip';

export type ArmPose = {u: number; f: number; w: number; hand: HandShape; layer: ArmLayer};

export type Pose = {
  L: ArmPose; // screen-left arm
  R: ArmPose; // screen-right arm
  head: number; // tilt in degrees about the neck (positive = top of head to screen-right)
  nod: number; // px the head dips (small nods)
  eyeX: number; // pupil offset, positive = looking screen-right
  eyeY: number; // pupil offset, positive = looking down
  brow: number; // px brows lift
  blink: number; // 1 = open, 0.07 = closed
  notebook: number; // 0..1, Omar's notebook (held by the L hand)
  pen: number; // 0..1, pen in the R hand
};

export const SHOULDER_Y = 149;
export const UPPER = 88;
export const FORE = 84;
export const FEET_Y = 587; // lowest shoe point in rig units
export const HEAD_TOP_Y = -2;

const PAL = {
  Layla: {skin: '#D69E77', edge: '#8A563C', hair: '#3D2923', cloth: '#91212E', shade: '#601724', pants: '#343438', dark: '#222328'},
  Omar: {skin: '#C28C63', edge: '#8A563C', hair: '#292522', cloth: '#385A61', shade: '#29434C', pants: '#BDAE97', dark: '#94866E'},
} as const;

/** Signed SVG rotation for an arm side from an outward-convention angle. */
const sgn = (side: 'L' | 'R') => (side === 'L' ? 1 : -1);

/** World (root) position of a point given in the hand's local space. */
export const handPoint = (side: 'L' | 'R', a: ArmPose, local: [number, number]): [number, number] => {
  const s = sgn(side);
  const rot = (x: number, y: number, deg: number): [number, number] => {
    const r = (deg * Math.PI) / 180;
    return [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)];
  };
  let [x, y] = local;
  [x, y] = rot(x, y, s * a.w);
  y += FORE;
  [x, y] = rot(x, y, s * a.f);
  y += UPPER;
  [x, y] = rot(x, y, s * a.u);
  return [x + (side === 'L' ? -46 : 46), y + SHOULDER_Y];
};

const Hand: React.FC<{shape: HandShape; skin: string; edge: string; mirror: boolean}> = ({shape, skin, edge, mirror}) => {
  const d =
    shape === 'open'
      ? 'M-9 0 Q-14 6-16 19 L-25 27 Q-28 31-24 34 Q-19 36-12 29 L-9 28 L-10 50 Q-10 57-6 57 Q-2 57-2 51 L-2 34 L0 54 Q0 60 4 59 Q8 59 7 53 L6 33 L10 50 Q12 56 16 54 Q19 52 17 47 L12 29 L18 41 Q21 46 24 43 Q27 40 23 35 L13 17 L10 0 Z'
      : shape === 'grip'
        ? 'M-10 0 L10 0 Q15 12 14 24 Q13 34 5 37 Q-4 39-10 33 Q-14 27-12 18 Q-19 22-21 18 Q-22 14-15 10 Z'
        : 'M-10 0 L10 0 Q14 16 12 26 L10 43 Q9 48 5 46 L4 30 L2 47 Q1 52-3 49 L-4 29 L-7 43 Q-10 47-12 42 L-10 23 Q-16 30-20 26 Q-22 24-17 19 Z';
  return (
    <g transform={mirror ? 'scale(-1 1)' : undefined}>
      <path d={d} fill={skin} stroke={edge} strokeWidth={1.1} />
      <path d="M-6 9 Q0 13 7 9" fill="none" stroke={edge} strokeWidth={0.8} opacity={0.45} />
      {shape === 'grip' && <path d="M-8 22 Q0 26 9 21 M-7 29 Q1 32 8 28" fill="none" stroke={edge} strokeWidth={0.8} opacity={0.5} />}
    </g>
  );
};

const Arm: React.FC<{who: Who; side: 'L' | 'R'; a: ArmPose; pen: number}> = ({who, side, a, pen}) => {
  const p = PAL[who];
  const coach = who === 'Layla';
  const s = sgn(side);
  const id = `${who}_${side}`;
  return (
    <g id={`${id}_upperArm`} transform={`translate(${side === 'L' ? -46 : 46} ${SHOULDER_Y}) rotate(${s * a.u})`}>
      <path d="M-14-9 Q0-20 17-6 L19 84 Q12 101-13 96 L-21 26 Z" fill={p.cloth} stroke={p.shade} strokeWidth={1.2} />
      <path d="M13 7 L14 73 Q11 86 5 91" fill="none" stroke={p.shade} strokeWidth={2} opacity={0.5} />
      <g id={`${id}_forearm`} transform={`translate(0 ${UPPER}) rotate(${s * a.f})`}>
        <path
          d={`M-14-5 Q0-10 16-3 L${coach ? 12 : 10} 82 Q0 91-11 83 Z`}
          fill={coach ? p.cloth : p.skin}
          stroke={coach ? p.shade : p.edge}
          strokeWidth={1.2}
        />
        {coach ? (
          <path d="M-11 76 L12 76 L11 88 L-10 88 Z" fill="#f3eee5" />
        ) : (
          <>
            {/* rolled sleeve */}
            <path d="M-14-4 L16-4 L16 11 L-14 12 Z" fill={p.shade} />
            <path d="M-12 2 L13 2" stroke={p.cloth} strokeWidth={3} />
            {/* forearm shading and, on his left wrist (screen-right), a watch */}
            <path d="M8 14 Q12 46 9 78" fill="none" stroke={p.edge} strokeWidth={1.4} opacity={0.25} />
            {side === 'R' && (
              <>
                <rect x={-11} y={70} width={22} height={9} rx={2.5} fill="#2B2826" />
                <rect x={-5} y={68} width={10} height={13} rx={3} fill="#3B3734" stroke="#9A8C74" strokeWidth={1} />
              </>
            )}
          </>
        )}
        <g id={`${id}_hand`} transform={`translate(0 ${FORE}) rotate(${s * a.w})`}>
          <Hand shape={a.hand} skin={p.skin} edge={p.edge} mirror={side === 'L'} />
          {side === 'R' && pen > 0 && (
            // Pen held between thumb and fingers, drawn over the grip; tip at PEN_TIP.
            <g opacity={pen}>
              <path d="M9 4 L-14 46" stroke="#1F1F22" strokeWidth={4.6} strokeLinecap="round" />
              <path d="M8 6 L-2 24" stroke="#91212E" strokeWidth={5} strokeLinecap="round" />
              <path d="M-12.5 43 L-14 46" stroke="#C9A76B" strokeWidth={2.4} strokeLinecap="round" />
              {/* thumb over the barrel */}
              <path d="M-9 20 Q-3 17 2 22 Q-2 27-9 25 Z" fill={p.skin} stroke={p.edge} strokeWidth={0.9} />
            </g>
          )}
        </g>
      </g>
    </g>
  );
};

/** Pen tip in the R hand's local coordinates (unrotated hand space). */
export const PEN_TIP: [number, number] = [-14, 46];

const Head: React.FC<{who: Who; pose: Pose}> = ({who, pose}) => {
  const p = PAL[who];
  const coach = who === 'Layla';
  const {eyeX: ex, eyeY: ey, blink} = pose;
  const lid = coach ? '#2A1A14' : '#241A15';
  const strand = coach ? '#6B4A3D' : '#4A3E36';
  // Eye: white, brown iris + pupil clipped to the eye shape, upper lid line,
  // crease; blinking squashes the whole eye towards its centre line.
  const eye = (cx: number) => {
    const outer = cx < 0 ? -1 : 1;
    const id = `${who}-eye-${cx < 0 ? 'l' : 'r'}`;
    const shape = 'M-8.5 0.6 Q-1 -6.8 8.5 -0.6 Q1 5.2 -8.5 0.6 Z';
    return (
      <g transform={`translate(${cx} 61) scale(1 ${blink})`}>
        <clipPath id={id}>
          <path d={shape} />
        </clipPath>
        <path d={shape} fill="#FBF4EA" />
        <g clipPath={`url(#${id})`}>
          <circle cx={ex} cy={ey * 0.8} r={3.5} fill="#5B3A24" />
          <circle cx={ex} cy={ey * 0.8} r={1.8} fill="#1C130F" />
          <circle cx={ex - 1} cy={ey * 0.8 - 1.1} r={0.8} fill="white" />
          <path d="M-9 -1 Q-1 -7 9 -1.5 L9 -4 L-9 -4 Z" fill="#000" opacity={0.12} />
        </g>
        <path d={`M-9.2 0.8 Q-1 -7.6 9.2 -0.9`} fill="none" stroke={lid} strokeWidth={coach ? 2.1 : 1.7} strokeLinecap="round" />
        {coach && <path d={`M${outer * 8.6} ${outer > 0 ? -1 : 0.4} l${outer * 1.8} -1.4`} stroke={lid} strokeWidth={1.1} strokeLinecap="round" />}
        <path d="M-6.5 -4.6 Q0 -8.6 7 -4.9" fill="none" stroke={p.edge} strokeWidth={0.7} opacity={0.55} />
        <path d="M-6 3.2 Q0 5 6 3" fill="none" stroke={p.edge} strokeWidth={0.6} opacity={0.35} />
      </g>
    );
  };
  const brow = (cx: number) => {
    const m = cx < 0 ? 1 : -1; // mirror so both brows taper outward
    // Gentle arch, level ends: neutral and attentive rather than stern.
    const d = coach ? 'M-8.5 1 Q-1 -4.2 8.5 1.4 Q-1 -2 -8.5 2.4 Z' : 'M-9.5 0.4 Q-1 -5 9 1.6 L8.6 3.4 Q-1 -2.2 -9.5 2.8 Z';
    return (
      <g transform={`translate(${cx} ${51 - pose.brow}) scale(${-m} 1)`}>
        <path d={d} fill={p.hair} stroke={p.hair} strokeWidth={coach ? 1 : 1.4} strokeLinejoin="round" />
      </g>
    );
  };
  return (
    <g id={`${who}_head`} transform={`translate(0 ${pose.nod}) rotate(${pose.head} 0 120)`}>
      {coach && (
        // Shoulder-length waves behind the face.
        <path
          d="M-36 28 C-55 46 -54 84 -49 104 C-57 120 -50 138 -36 138 C-30 147 -16 146 -10 136 L10 136 C16 146 31 147 37 137 C51 138 57 121 50 105 C56 82 55 44 37 25 C20 8 -18 8 -36 28 Z"
          fill={p.hair}
        />
      )}
      {/* neck */}
      <path d="M-12 91 L-14 123 Q0 141 15 124 L12 89 Z" fill={p.skin} stroke={p.edge} strokeWidth={0.8} />
      <path d="M-13 95 Q1 110 13 94 L13 110 Q0 121 -13 113 Z" fill={p.edge} opacity={0.22} />
      {/* ears */}
      <ellipse cx={-30} cy={67} rx={6} ry={11} fill={p.skin} stroke={p.edge} strokeWidth={0.6} />
      <ellipse cx={30} cy={67} rx={6} ry={11} fill={p.skin} stroke={p.edge} strokeWidth={0.6} />
      <path d="M-31 61 Q-34.5 67 -31 74 M31 61 Q34.5 67 31 74" fill="none" stroke={p.edge} strokeWidth={0.8} opacity={0.5} />
      {/* face */}
      <path d="M-29 47 Q-30 16 1 15 Q32 16 30 47 L28 76 Q23 97 1 105 Q-23 98 -28 78 Z" fill={p.skin} stroke={p.edge} strokeWidth={1} />
      <path d="M19 39 Q30 65 19 82 Q12 94 1 98 Q24 96 29 76 L31 46 Z" fill={p.edge} opacity={0.14} />
      <ellipse cx={-17} cy={77} rx={6.5} ry={3.6} fill="#C9735E" opacity={coach ? 0.2 : 0.12} />
      <ellipse cx={18} cy={77} rx={6.5} ry={3.6} fill="#C9735E" opacity={coach ? 0.2 : 0.12} />
      {/* nose: soft side shadow, bridge line and nostrils */}
      <path d="M3 63 Q7 71 6.5 76.5 Q4 78 2 77 Z" fill={p.edge} opacity={0.16} />
      <path d="M1.5 62 Q-1.5 70 -2.4 75.6 Q1.5 79.4 6.4 76" stroke={p.edge} strokeWidth={1.1} fill="none" strokeLinecap="round" />
      <path d="M-1 77.2 Q0 78.2 1 77.6 M4.2 77.6 Q5.2 78.2 6 77.2" stroke={p.edge} strokeWidth={0.9} fill="none" opacity={0.6} />
      {brow(-14)}
      {brow(15)}
      {eye(-14)}
      {eye(15)}
      {coach ? (
        <>
          {/* lips */}
          <path d="M-9.5 87.4 Q-4 84.4 0 86.2 Q4 84.4 10 86.8 Q2 88.8 -9.5 87.4 Z" fill="#A4524B" />
          <path d="M-8.5 87.8 Q0.5 94.6 9.4 87.2 Q1 89.6 -8.5 87.8 Z" fill="#B8665D" />
          <path d="M-2 91.2 Q1 92 3.6 91" stroke="#E7AA9A" strokeWidth={0.9} fill="none" strokeLinecap="round" />
          <circle cx={-32} cy={81} r={2.7} fill="#C9A76B" />
          <circle cx={32} cy={81} r={2.7} fill="#C9A76B" />
          <circle cx={-32.6} cy={80.3} r={0.9} fill="#F1DCA8" />
          <circle cx={31.4} cy={80.3} r={0.9} fill="#F1DCA8" />
          {/* side-parted hair: crown, a sweep across the forehead, and locks by the cheeks */}
          <path
            d="M-31 66 C-37 42 -30 18 -7 12 C14 6 35 15 37 40 C38 56 36 72 33 88 C30 72 28 56 22 45 C14 33 2 30 -7 34 C-15 39 -23 50 -27 64 Z"
            fill={p.hair}
          />
          <path d="M-7 15 C6 24 19 29 31 44 C22 37 9 35 -2 35 Z" fill={p.hair} />
          <path d="M-29 58 C-35 74 -32 90 -38 104 C-31 98 -27 86 -27 74 Z" fill={p.hair} />
          <path d="M33 60 C38 78 35 96 40 110 C33 102 31 88 31 76 Z" fill={p.hair} />
          <path d="M-20 21 Q2 12 17 19 M-27 36 Q-9 33 4 21 M24 26 Q34 40 33 60 M-33 52 Q-38 76 -34 96 M36 70 Q40 90 37 104" fill="none" stroke={strand} strokeWidth={1.6} strokeLinecap="round" opacity={0.9} />
        </>
      ) : (
        <>
          {/* full beard along the jaw, mustache and lower lip */}
          <path
            d="M-28.5 70 C-29 88 -21 103 0 109 C21 103 29 88 29.5 70 C27 81 21 89 12.5 92.5 C6 88.5 -6 88.5 -12.5 92.5 C-21 89 -27 81 -28.5 70 Z"
            fill={p.hair}
          />
          <path d="M-13.5 86 C-9.5 82.4 -4.5 81.6 0 82.8 C4.5 81.6 9.5 82.4 13.5 86 C9 85.2 4.5 85 0 85.8 C-4.5 85 -9 85.2 -13.5 86 Z" fill={p.hair} />
          <path d="M-6.5 88.6 Q0 93.6 6.5 88.6 Q0 90.4 -6.5 88.6 Z" fill="#A3634F" />
          {/* textured hair with volume on top and faded sides */}
          <path d="M-30 50 C-33 42 -32 33 -29 28 L-29 52 Z M30 50 C33 42 32 33 29 28 L29 52 Z" fill={p.hair} opacity={0.55} />
          <path
            d="M-30 46 C-35 32 -31 16 -20 9 C-12 1 4 -3 17 1 C31 4 39 15 34 32 L31 46 C29 38 26 33 21 30 C9 27 -6 27 -18 30 C-24 33 -28 39 -30 46 Z"
            fill={p.hair}
          />
          <path d="M-22 14 Q-4 3 15 6 M-24 22 Q-2 12 22 15 M-14 28 Q4 20 27 24 M20 6 Q32 12 33 26" stroke={strand} strokeWidth={1.7} fill="none" strokeLinecap="round" />
        </>
      )}
    </g>
  );
};

const Legs: React.FC<{who: Who}> = ({who}) => {
  const p = PAL[who];
  return (
    <g id={`${who}_legs`}>
      <path d="M-42 313 L-2 317 L-5 436 L-15 562 L-47 562 L-40 433 Z" fill={p.pants} stroke={p.dark} strokeWidth={1.3} />
      <path d="M1 317 L42 313 L40 429 L48 562 L16 562 L5 435 Z" fill={p.pants} stroke={p.dark} strokeWidth={1.3} />
      <path d="M-30 349 L-26 442 L-35 542 M29 349 L23 432 L34 544" stroke={p.dark} fill="none" strokeWidth={1.5} opacity={0.65} />
      <path
        d="M-47 560 L-15 560 L-10 577 Q-25 587-60 583 Q-65 575-47 560 Z M16 560 L48 560 Q66 574 65 582 Q42 589 14 579 Z"
        fill={who === 'Omar' ? '#3E2A22' : '#282728'}
        stroke="#141414"
        strokeWidth={1.2}
      />
      <path d="M-56 579 Q-35 584-13 577 M18 576 Q42 583 62 580" fill="none" stroke="#5B4C42" strokeWidth={1.4} />
      {who === 'Layla' && <path d="M-40 566 L-24 566 M24 566 L40 566" stroke="#C9A76B" strokeWidth={2} strokeLinecap="round" />}
    </g>
  );
};

const Torso: React.FC<{who: Who}> = ({who}) => {
  const p = PAL[who];
  const coach = who === 'Layla';
  return (
    <g id={`${who}_torso`}>
      <path
        d="M-44 128 Q-15 116 0 125 Q17 116 43 128 L49 220 L41 321 Q0 334-42 321 L-50 220 Z"
        fill={coach ? '#EEE6D9' : p.cloth}
        stroke={p.shade}
        strokeWidth={1.2}
      />
      {coach ? (
        <>
          <path d="M-44 127 L-16 119 L-4 146 L-9 322 L-43 337 L-49 225 Z M16 119 L43 127 L48 225 L43 337 L9 322 L4 146 Z" fill={p.cloth} />
          <path d="M-17 122 L-30 166 L-20 172 L-12 192 L-7 159 M17 122 L29 166 L20 172 L12 192 L7 159" fill={p.shade} stroke="#AC4650" strokeWidth={1} />
          <path d="M-4 146 L0 177 L5 146 M0 177 L0 301" stroke="#CBBDAA" fill="none" />
          <path d="M-40 278 L-16 275 L-15 284 L-39 287 M16 275 L39 278 L38 287 L16 284" fill={p.shade} />
          <path d="M-41 172 Q-36 222-39 249 M40 173 Q35 225 39 250" fill="none" stroke="#B34551" strokeWidth={1.3} />
          {/* side shading for volume */}
          <path d="M30 140 L43 128 L48 225 L43 337 L34 334 Q40 230 30 140 Z" fill="#000" opacity={0.08} />
          <circle cx={-7} cy={256} r={2.6} fill={p.shade} />
        </>
      ) : (
        <>
          <path d="M-15 119 L0 141 L15 119 L25 136 L14 157 L0 145 L-13 157 L-25 136 Z" fill={p.shade} stroke="#688087" strokeWidth={1} />
          <path d="M0 146 L0 312" stroke={p.shade} strokeWidth={1.8} />
          {[170, 205, 240, 275].map((y) => (
            <circle key={y} cx={2.5} cy={y} r={1.6} fill="#D9D2C4" opacity={0.8} />
          ))}
          <path d="M-32 185 Q-25 214-33 238 M29 181 Q23 214 33 241 M-29 289 Q-12 279-5 293 M5 293 Q22 279 31 290" stroke="#678089" strokeWidth={1.4} fill="none" opacity={0.5} />
          <path d="M30 140 L43 128 L49 220 L41 321 L33 320 Q40 230 30 140 Z" fill="#000" opacity={0.1} />
          <path d="M-39 312 L39 312 L39 324 L-39 324 Z" fill="#504438" />
          <rect x={-6} y={312} width={12} height={13} rx={1} fill="none" stroke="#C4B38B" strokeWidth={2} />
        </>
      )}
    </g>
  );
};

// Open notebook held flat-ish toward camera (a 2D explainer cheat), carried by
// the L hand: its anchor follows the hand's world position after contact.
export const NOTEBOOK = {w: 104, h: 44};
const Notebook: React.FC<{x: number; y: number; opacity: number; lines: number}> = ({x, y, opacity, lines}) => (
  <g transform={`translate(${x} ${y})`} opacity={opacity}>
    <path d={`M${-NOTEBOOK.w / 2} 0 L${NOTEBOOK.w / 2} 0 L${NOTEBOOK.w / 2 - 6} ${NOTEBOOK.h} L${-NOTEBOOK.w / 2 + 6} ${NOTEBOOK.h} Z`} fill="#C9B48E" stroke="#8C7A5B" strokeWidth={1.2} />
    <path d={`M${-NOTEBOOK.w / 2 + 3} -3 L-1 -1 L-1 ${NOTEBOOK.h - 4} L${-NOTEBOOK.w / 2 + 8} ${NOTEBOOK.h - 4} Z`} fill="#FBF6EA" stroke="#B9AA8C" strokeWidth={0.8} />
    <path d={`M1 -1 L${NOTEBOOK.w / 2 - 3} -3 L${NOTEBOOK.w / 2 - 8} ${NOTEBOOK.h - 4} L1 ${NOTEBOOK.h - 4} Z`} fill="#FFFBF2" stroke="#B9AA8C" strokeWidth={0.8} />
    {/* lines already written appear one by one as he writes */}
    {Array.from({length: 4}).map((_, i) => (
      <path
        key={i}
        d={`M7 ${8 + i * 8} L${7 + 36 * Math.max(0, Math.min(1, lines - i))} ${8 + i * 8}`}
        stroke="#385A61"
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={lines - i > 0 ? 0.85 : 0}
      />
    ))}
    {[0, 1, 2, 3].map((i) => (
      <path key={`l${i}`} d={`M-44 ${8 + i * 8} L-8 ${8 + i * 8}`} stroke="#D8CDB6" strokeWidth={1} />
    ))}
  </g>
);

export type CharacterProps = {who: Who; pose: Pose; notebookLines?: number};

export const Character: React.FC<CharacterProps> = ({who, pose, notebookLines = 0}) => {
  const arm = (side: 'L' | 'R') => <Arm key={side} who={who} side={side} a={pose[side]} pen={side === 'R' ? pose.pen : 0} />;
  const layer = (l: ArmLayer) => (['L', 'R'] as const).filter((s) => pose[s].layer === l).map(arm);
  // Notebook rests on the L hand: its bottom edge sits on the palm.
  const nb = notebookAnchor(pose);
  return (
    <g id={`${who}_root`}>
      <Legs who={who} />
      {layer('back')}
      <Torso who={who} />
      {layer('front')}
      {pose.notebook > 0 && <Notebook x={nb.x} y={nb.y} opacity={pose.notebook} lines={notebookLines} />}
      <Head who={who} pose={pose} />
      {layer('top')}
    </g>
  );
};

// Book centre/top from the supporting palm, so the book follows the hand.
export const notebookAnchor = (pose: Pose) => {
  const palm = handPoint('L', pose.L, [0, 26]);
  return {x: palm[0] - 5, y: palm[1] - NOTEBOOK.h - 2};
};

export const notebookPage = (pose: Pose) => {
  const {x, y} = notebookAnchor(pose);
  // Right-hand page (the writing page), in root coordinates.
  return {x1: x + 1, x2: x + NOTEBOOK.w / 2 - 8, y1: y, y2: y + NOTEBOOK.h - 4};
};
