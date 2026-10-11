import type {PoseId} from './coachAssets';

// Scene timing, copy and choreography data for the 12-second practice.
// Frame ranges are start-inclusive, end-exclusive. Rendering components read
// from here; edit timing or copy in this file, not in the components.

export const VIDEO = {width: 1080, height: 1920, fps: 30, durationInFrames: 360} as const;

export type Scene = {
  id: string;
  from: number;
  to: number;
  // Headline split into segments; `em` segments render in burgundy.
  headline: {text: string; em?: boolean}[];
  visual: string;
  transition: string;
};

export const SCENES: Scene[] = [
  {
    id: 's1-question',
    from: 0,
    to: 90,
    headline: [{text: 'Thinking about your '}, {text: 'next career move?', em: true}],
    visual: 'Both coaches enter together. Two equal option cards arrive between them.',
    transition: 'Option cards stay on stage and step back for the insight cards.',
  },
  {
    id: 's2-understand',
    from: 90,
    to: 180,
    headline: [{text: 'Understand '}, {text: 'what matters', em: true}, {text: ' to you.'}],
    visual: 'Nour presents "Interests", Samir presents "Motivation". No scores.',
    transition: 'Insight cards stay; option cards return to full strength below.',
  },
  {
    id: 's3-explore',
    from: 180,
    to: 270,
    headline: [{text: 'Explore '}, {text: 'realistic options.', em: true}],
    visual: 'Burgundy path links insights to two equal options. Both coaches gesture.',
    transition: 'Branches fade; the path trunk carries on into the next-step mark.',
  },
  {
    id: 's4-lockup',
    from: 270,
    to: 360,
    headline: [{text: 'ASSESS SHIFT', em: true}],
    visual: 'Next-step mark, brand lockup and tagline. Coaches balanced. No booking link.',
    transition: 'End of practice.',
  },
];

export const LOCKUP = {
  name: 'ASSESS SHIFT',
  descriptor: 'Career Coaching',
  tagline: 'Your next move deserves clarity.',
  // Lockup headline settles by this frame; everything is static after LOCKUP.settled.
  settled: 316,
} as const;

// Layout zones (1080x1920). Headline sits in the top zone, cards on the
// stage, coaches stand on a floor line inside the bottom safe margin.
export const LAYOUT = {
  headlineY: 250,
  floorY: 1620,
  samirX: 260,
  nourX: 820,
  coachHeight: 520,
} as const;

type Key = readonly [number, number];
export type CardTrack = {
  id: string;
  label: string;
  kind: 'option' | 'insight';
  icon: 'role' | 'field' | 'interests' | 'motivation';
  w: number;
  h: number;
  x: Key[];
  y: Key[];
  opacity: Key[];
  scale: Key[];
};

// Two equal option cards (same size, same treatment) and two insight cards.
export const CARDS: CardTrack[] = [
  {
    id: 'option-role',
    label: 'A new role',
    kind: 'option',
    icon: 'role',
    w: 380,
    h: 220,
    x: [[0, 320]],
    y: [[24, 810], [40, 760], [180, 760], [196, 900]],
    opacity: [[24, 0], [38, 1], [100, 1], [114, 0.4], [180, 0.4], [196, 1], [272, 1], [286, 0]],
    scale: [[0, 1], [272, 1], [286, 0.92]],
  },
  {
    id: 'option-field',
    label: 'A new field',
    kind: 'option',
    icon: 'field',
    w: 380,
    h: 220,
    x: [[0, 760]],
    y: [[28, 810], [44, 760], [184, 760], [200, 900]],
    opacity: [[28, 0], [42, 1], [100, 1], [114, 0.4], [184, 0.4], [200, 1], [276, 1], [290, 0]],
    scale: [[0, 1], [276, 1], [290, 0.92]],
  },
  {
    // Nour presents Interests first (right side, her side of the frame).
    id: 'insight-interests',
    label: 'Interests',
    kind: 'insight',
    icon: 'interests',
    w: 320,
    h: 150,
    x: [[104, 820], [120, 760]],
    y: [[0, 540]],
    opacity: [[104, 0], [118, 1], [270, 1], [284, 0]],
    scale: [[0, 1], [270, 1], [284, 0.92]],
  },
  {
    // Samir presents Motivation (left side, his side of the frame).
    id: 'insight-motivation',
    label: 'Motivation',
    kind: 'insight',
    icon: 'motivation',
    w: 320,
    h: 150,
    x: [[108, 260], [124, 320]],
    y: [[0, 540]],
    opacity: [[108, 0], [122, 1], [270, 1], [284, 0]],
    scale: [[0, 1], [270, 1], [284, 0.92]],
  },
];

// Photo-coach pose changes (aligned crossfades). Nour presents "Interests",
// Samir "Motivation"; both keep the open-hand pose through the comparison.
export const PRACTICE_POSES = {
  samir: [[0, 'samir-standing-front'], [100, 'samir-exploring-options'], [272, 'samir-standing-front']],
  nour: [[0, 'nour-standing-front'], [96, 'nour-exploring-options'], [272, 'nour-standing-front']],
} as const satisfies Record<'samir' | 'nour', readonly (readonly [number, PoseId])[]>;

// Burgundy path: trunk from insights, two equal branches to the option cards,
// then the trunk extends into the next-step mark.
export const PATH = {
  // One trunk stroke: drawn to the branch point in s3, then extended and
  // retracted from the top in s4 so the path visibly travels into the mark.
  trunk: 'M540 615 L540 800',
  trunkBranchPoint: 0.57,
  branchLeft: 'M540 720 C540 770 320 750 320 790',
  branchRight: 'M540 720 C540 770 760 750 760 790',
  drawTrunk: [200, 212] as const,
  drawBranches: [208, 232] as const,
  fadeBranches: [272, 290] as const,
  extendTrunk: [276, 292] as const,
  retractTrunk: [282, 306] as const,
  trunkRetractTo: 0.6,
};

export const MARK = {x: 540, y: 870, r: 78, pop: [292, 310] as const};
