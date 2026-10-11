import {Easing, interpolate} from 'remotion';

// Motion tokens at 30 fps. Starting values from MOTION_PLAYBOOK.md — change
// them here and every scene that uses them follows.
export const EASE_OUT = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

export const DUR = {
  heading: 12,
  headingOut: 8,
  card: 16,
  stagger: 4,
  coach: 16,
  gesture: 16,
  path: 26,
  transition: 12,
} as const;

export const OFFSET = {
  heading: 16,
  card: 50,
  coach: 30,
} as const;

type Key = readonly [frame: number, value: number];

// Piecewise keyframe track: holds the first/last value outside the range and
// eases each segment. Pure function of frame, so seeking is deterministic.
export const track = (frame: number, keys: readonly Key[], easing = EASE_OUT): number => {
  if (frame <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [f0, v0] = keys[i - 1];
    const [f1, v1] = keys[i];
    if (frame <= f1) {
      return interpolate(frame, [f0, f1], [v0, v1], {
        easing,
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }
  }
  return keys[keys.length - 1][1];
};

// Fade + rise in at `start` over `dur` frames.
export const enter = (frame: number, start: number, dur: number, distance: number) => {
  const t = interpolate(frame, [start, start + dur], [0, 1], {
    easing: EASE_OUT,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return {opacity: t, offset: (1 - t) * distance};
};
