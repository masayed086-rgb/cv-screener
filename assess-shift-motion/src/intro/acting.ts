import type {ActingTrack, Look} from '../rig/acting';

// Performance for the 75 s introduction (absolute frames, 30 fps).
// Roles follow CHARACTER_ROLES.md: Layla is the coach (inner arm = screen-
// right R), Omar the coachee and decision owner (inner arm = screen-left L;
// his watch is on the screen-right wrist). Every gesture is
// gaze → anticipation → action → hold → settle, and the listener reacts
// 4–8+ frames after the speaker's cue. Retime to the recorded narration.

const L_OMAR: Look = {head: 2, eyeX: 1.5, eyeY: 0}; // Layla looking at Omar
const O_LAYLA: Look = {head: -2, eyeX: -1.5, eyeY: 0}; // Omar looking at Layla
const VIEWER: Look = {head: 0, eyeX: 0, eyeY: 0};
const L_STAGE: Look = {head: 1, eyeX: 1.2, eyeY: -1.4};
const O_STAGE: Look = {head: -1, eyeX: -1.2, eyeY: -1.4};

const lk = (at: number, look: Look, dur = 8) => ({at, dur, look});

export const LAYLA: ActingTrack = {
  defaultLayer: {L: 'back', R: 'front'},
  L: [
    {at: 0, dur: 1, arm: 'clasp'},
    {at: 2056, dur: 22, arm: 'welcome'},
  ],
  R: [
    {at: 0, dur: 1, arm: 'clasp'},
    // 16–25 s: invites Omar into the conversation (service introduction)
    {at: 506, dur: 6, arm: 'anticipate'},
    {at: 512, dur: 22, arm: 'ask'},
    {at: 604, dur: 16, arm: 'clasp'},
    // 25–38 s: explains insight — presents the insight cards, then experience
    {at: 782, dur: 6, arm: 'anticipate'},
    {at: 788, dur: 22, arm: 'present'},
    {at: 918, dur: 18, arm: 'presentLow'},
    {at: 1060, dur: 16, arm: 'clasp'},
    // 38–51 s: asks an open question, then listens
    {at: 1156, dur: 6, arm: 'anticipate'},
    {at: 1162, dur: 20, arm: 'ask'},
    {at: 1222, dur: 16, arm: 'clasp'},
    // 61–68 s: presents the three equal package cards
    {at: 1846, dur: 6, arm: 'anticipate'},
    {at: 1852, dur: 22, arm: 'present'},
    {at: 1990, dur: 16, arm: 'clasp'},
    {at: 2056, dur: 22, arm: 'welcome'},
  ],
  look: [
    lk(0, L_OMAR, 1),
    lk(150, L_STAGE),
    lk(186, L_OMAR),
    lk(266, {head: 1, eyeX: 1.3, eyeY: -1.2}),
    lk(332, L_OMAR),
    lk(498, L_OMAR),
    lk(640, {head: 0, eyeX: 0.8, eyeY: -1.6}),
    lk(778, {head: 1, eyeX: 1.2, eyeY: -1.6, brow: 1}),
    lk(912, {head: 1, eyeX: 1.4, eyeY: -0.6}),
    lk(1000, L_OMAR),
    lk(1150, L_OMAR),
    lk(1290, {head: 1, eyeX: 1.2, eyeY: -0.8}),
    lk(1450, L_OMAR),
    lk(1578, {head: 3, eyeX: 1.4, eyeY: 0.9}),
    lk(1736, L_OMAR),
    lk(1840, {head: 1, eyeX: 1.0, eyeY: -1.2}),
    lk(1984, L_OMAR),
    lk(2050, VIEWER, 12),
  ],
  nods: [128, 396, 1272, 1744, 2000],
  blinks: [57, 160, 262, 371, 470, 560, 690, 803, 905, 1015, 1118, 1214, 1330, 1421, 1520, 1630, 1716, 1810, 1920, 2030, 2117, 2203],
};

// Writing strokes and the matching notebook lines / plan milestones.
export const WRITING: [number, number][] = [
  [1590, 1626],
  [1640, 1676],
  [1690, 1726],
];

export const OMAR: ActingTrack = {
  defaultLayer: {L: 'back', R: 'front'},
  L: [
    {at: 0, dur: 1, arm: 'rest'},
    // 7–16 s: compares three possible directions
    {at: 254, dur: 6, arm: 'anticipate'},
    {at: 260, dur: 20, arm: 'presentLow'},
    {at: 318, dur: 20, arm: 'present'},
    {at: 426, dur: 18, arm: 'rest'},
    // 38–51 s: responds — explains his priorities
    {at: 1204, dur: 6, arm: 'anticipate'},
    {at: 1210, dur: 22, arm: 'ask'},
    {at: 1276, dur: 18, arm: 'rest'},
    // 51–61 s: supports the notebook while he writes his next step
    {at: 1548, dur: 22, arm: 'holdBook'},
    {at: 1776, dur: 18, arm: 'rest'},
    {at: 2060, dur: 22, arm: 'welcome'},
  ],
  R: [
    {at: 0, dur: 1, arm: 'rest'},
    // 0–7 s: reflects, hand to chin
    {at: 32, dur: 6, arm: 'anticipate'},
    {at: 38, dur: 24, arm: 'chin'},
    {at: 176, dur: 20, arm: 'rest'},
    // 25–38 s: thinks the insight over
    {at: 958, dur: 24, arm: 'chin'},
    {at: 1074, dur: 20, arm: 'rest'},
    // 51–61 s: writes
    {at: 1556, dur: 22, arm: 'write'},
    {at: 1770, dur: 18, arm: 'rest'},
    {at: 2060, dur: 22, arm: 'welcome'},
  ],
  look: [
    lk(0, {head: -1, eyeX: -0.6, eyeY: 0}, 1),
    lk(26, {head: 3, eyeX: 1.4, eyeY: -1.8, brow: 1}, 10),
    lk(150, {head: -1, eyeX: -1.2, eyeY: -1.4}),
    lk(246, {head: -1, eyeX: -1.6, eyeY: -1.2}),
    lk(298, {head: -1, eyeX: -1.0, eyeY: -1.3}),
    lk(348, {head: 0, eyeX: -0.4, eyeY: -1.3}),
    lk(430, O_LAYLA),
    lk(502, O_LAYLA),
    lk(644, {head: 0, eyeX: -0.8, eyeY: -1.6}),
    lk(786, O_STAGE),
    lk(920, {head: -1, eyeX: -1.4, eyeY: -0.6}),
    lk(952, {head: 3, eyeX: 1.2, eyeY: -1.6, brow: 1}, 10),
    lk(1078, O_LAYLA),
    lk(1150, O_LAYLA),
    lk(1286, {head: -1, eyeX: -1.2, eyeY: -0.6}),
    lk(1544, {head: 1, eyeX: -0.4, eyeY: 2.2}, 10),
    lk(1736, {head: -2, eyeX: -1.5, eyeY: 0, brow: 1}, 10),
    lk(1840, O_STAGE),
    lk(1986, O_LAYLA),
    lk(2052, VIEWER, 12),
  ],
  nods: [552, 1004, 1996],
  blinks: [88, 199, 305, 402, 517, 628, 741, 858, 969, 1060, 1170, 1268, 1372, 1475, 1590, 1700, 1792, 1888, 1988, 2079, 2165],
  notebook: [
    {at: 1552, dur: 14, v: 1},
    {at: 1772, dur: 14, v: 0},
  ],
  pen: [
    {at: 1560, dur: 12, v: 1},
    {at: 1768, dur: 12, v: 0},
  ],
  writing: WRITING,
};

// Lines appear in the notebook as each stroke range completes.
export const notebookLinesAt = (t: number) =>
  WRITING.reduce((n, [a, b]) => n + Math.max(0, Math.min(1, (t - a) / (b - a))), 0);
