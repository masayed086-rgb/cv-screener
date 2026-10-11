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
  const eye = (cx: number) => (
    <g transform={`translate(${cx} 61) scale(1 ${blink})`}>
      <path d="M-8 0 Q0-6 8 0 Q0 5-8 0" fill="#fff7e9" stroke={p.edge} strokeWidth={0.8} />
      <circle cx={ex} cy={ey * 0.8} r={2.7} fill="#38291E" />
      <circle cx={ex - 0.6} cy={ey * 0.8 - 0.8} r={0.7} fill="white" />
    </g>
  );
  return (
    <g id={`${who}_head`} transform={`translate(0 ${pose.nod}) rotate(${pose.head} 0 120)`}>
      {coach && <path d="M-35 26 Q-48 38-43 82 Q-55 104-39 131 Q-22 146 0 130 Q22 145 42 126 Q54 110 42 86 Q50 49 28 22 Z" fill={p.hair} />}
      <path d="M-12 91 L-14 123 Q0 141 15 124 L12 89 Z" fill={p.skin} stroke={p.edge} strokeWidth={0.8} />
      <path d="M-13 95 Q1 108 13 94 L13 108 Q0 119-13 111 Z" fill={p.edge} opacity={0.2} />
      <ellipse cx={-30} cy={67} rx={6} ry={11} fill={p.skin} />
      <ellipse cx={30} cy={67} rx={6} ry={11} fill={p.skin} />
      <path d="M-29 47 Q-30 16 1 15 Q32 16 30 47 L28 76 Q23 97 1 105 Q-23 98-28 78 Z" fill={p.skin} stroke={p.edge} strokeWidth={1} />
      <path d="M19 39 Q30 65 19 82 Q12 94 1 98 Q24 96 29 76 L31 46 Z" fill={p.edge} opacity={0.14} />
      {/* soft cheek warmth */}
      <ellipse cx={-17} cy={76} rx={6} ry={3.5} fill="#C9735E" opacity={0.16} />
      <ellipse cx={18} cy={76} rx={6} ry={3.5} fill="#C9735E" opacity={0.16} />
      {coach ? (
        <>
          <path d="M-31 67 Q-34 38-25 23 Q-6 3 17 15 Q34 15 35 48 Q21 29 6 30 Q-12 48-30 53 Z" fill={p.hair} />
          <path d="M-19 22 Q2 13 15 20 M-26 34 Q-4 34 8 20" fill="none" stroke="#755044" strokeWidth={2} />
          <path d="M29 47 Q37 82 26 104 Q35 98 35 85" fill="none" stroke="#755044" strokeWidth={2} />
        </>
      ) : (
        <>
          <path d="M-31 52 L-34 31 Q-37 11-19 11 Q-20 0-3 4 Q16-3 26 9 Q42 11 32 40 L28 53 L24 34 Q4 39-15 28 L-26 42 Z" fill={p.hair} />
          <path d="M-23 17 Q-4 8 16 13 M-21 23 Q0 18 23 21" stroke="#5B4C42" strokeWidth={2} fill="none" />
          <path d="M-27 75 Q-14 90 0 83 Q15 90 28 75 L23 93 Q0 116-23 93 Z" fill={p.hair} />
        </>
      )}
      <g transform={`translate(0 ${-pose.brow})`}>
        <path d="M-22 52 Q-13 48-6 52 M7 52 Q15 48 23 52" stroke={p.hair} strokeWidth={2.5} strokeLinecap="round" fill="none" />
      </g>
      {eye(-14)}
      {eye(15)}
      <path d="M1 62 L-2 76 Q2 79 6 76" stroke={p.edge} strokeWidth={1.2} fill="none" />
      {coach ? (
        <>
          <path d="M-10 87 Q0 92 11 86 Q0 97-10 87" fill="#A35F58" />
          <path d="M-9 87 Q1 90 10 86" fill="none" stroke="#6E3B34" strokeWidth={1} />
          <circle cx={-32} cy={81} r={2.7} fill="#C9A76B" />
          <circle cx={32} cy={81} r={2.7} fill="#C9A76B" />
        </>
      ) : (
        <>
          <path d="M-11 84 Q0 80 12 84 L11 89 Q0 86-10 89 Z" fill={p.hair} />
          <path d="M-8 91 Q1 95 9 91" fill="none" stroke="#DFA586" strokeWidth={1.1} />
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
