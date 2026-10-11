// Per-format layout. Each format is laid out on its own — the landscape cut
// is reflowed, not a stretched vertical.

export type FormatId = 'reels' | 'linkedin';

export type Layout = {
  id: FormatId;
  width: number;
  height: number;
  vertical: boolean;
  headline: {top: number; side: number; size: number};
  sub: {top: number; side: number; size: number};
  // Centre of the main stage where cards and diagrams live.
  stage: {x: number; y: number};
  // Layla (coach) stands screen-left, Omar (coachee) screen-right.
  cast: {laylaX: number; omarX: number; floorY: number; scale: number};
};

export const LAYOUTS: Record<FormatId, Layout> = {
  reels: {
    id: 'reels',
    width: 1080,
    height: 1920,
    vertical: true,
    headline: {top: 200, side: 90, size: 80},
    sub: {top: 400, side: 110, size: 38},
    stage: {x: 540, y: 790},
    cast: {laylaX: 285, omarX: 795, floorY: 1668, scale: 1.0},
  },
  linkedin: {
    id: 'linkedin',
    width: 1920,
    height: 1080,
    vertical: false,
    headline: {top: 64, side: 200, size: 68},
    sub: {top: 160, side: 300, size: 32},
    stage: {x: 960, y: 560},
    cast: {laylaX: 250, omarX: 1670, floorY: 1018, scale: 0.92},
  },
};
