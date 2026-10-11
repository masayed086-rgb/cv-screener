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
  coaches: {samirX: number; nourX: number; floorY: number; scale: number};
  draftLabel: {bottom: number; size: number};
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
    coaches: {samirX: 260, nourX: 820, floorY: 1620, scale: 1},
    draftLabel: {bottom: 90, size: 22},
  },
  linkedin: {
    id: 'linkedin',
    width: 1920,
    height: 1080,
    vertical: false,
    headline: {top: 64, side: 200, size: 68},
    sub: {top: 160, side: 300, size: 32},
    stage: {x: 960, y: 560},
    coaches: {samirX: 240, nourX: 1680, floorY: 1000, scale: 0.98},
    draftLabel: {bottom: 22, size: 18},
  },
};
