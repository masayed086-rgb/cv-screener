// Generated from public/coaches/manifest.json (measured from the cut-outs).
// INTERIM ASSETS: whole-pose crops from brand/Realistic_Coach_Reference.png with
// the board background removed. Not final art — replace with approved
// high-resolution transparent pose PNGs and re-measure.
export type PoseAsset = {file: string; width: number; height: number; headTop: number; feet: number; faceX: number};
export const POSE_ASSETS = {
  'nour-exploring-options': {file: 'coaches/nour-exploring-options.png', width: 408, height: 530, headTop: 11, feet: 520, faceX: 194.2},
  'nour-standing-3q': {file: 'coaches/nour-standing-3q.png', width: 260, height: 692, headTop: 9, feet: 682, faceX: 129.8},
  'nour-standing-front': {file: 'coaches/nour-standing-front.png', width: 308, height: 692, headTop: 10, feet: 682, faceX: 144.2},
  'samir-exploring-options': {file: 'coaches/samir-exploring-options.png', width: 400, height: 530, headTop: 9, feet: 520, faceX: 168.7},
  'samir-standing-3q': {file: 'coaches/samir-standing-3q.png', width: 340, height: 696, headTop: 9, feet: 686, faceX: 160.9},
  'samir-standing-front': {file: 'coaches/samir-standing-front.png', width: 328, height: 696, headTop: 9, feet: 686, faceX: 153.0},
} as const satisfies Record<string, PoseAsset>;
export type PoseId = keyof typeof POSE_ASSETS;

export const PORTRAITS = {
  'samir-listening': 'coaches/samir-portrait-listening.png',
  'samir-curious': 'coaches/samir-portrait-curious.png',
  'samir-encouraging': 'coaches/samir-portrait-encouraging.png',
  'nour-listening': 'coaches/nour-portrait-listening.png',
  'nour-curious': 'coaches/nour-portrait-curious.png',
  'nour-encouraging': 'coaches/nour-portrait-encouraging.png',
} as const;
