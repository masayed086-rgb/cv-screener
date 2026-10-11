// Brand tokens — the only place colours, type and layout margins are defined.
export const COLORS = {
  burgundy: '#91212E',
  burgundyShade: '#74192A',
  deepBurgundy: '#3A0A10',
  charcoal: '#242427',
  ivory: '#FAF7F2',
  softRose: '#F5E9E9',
  white: '#FFFFFF',
} as const;

// Quicksand is bundled locally from @fontsource (OFL). Aptos is not available,
// so Quicksand 500 is the documented fallback for supporting copy.
export const FONT = {
  family: "'Quicksand', sans-serif",
  headlineWeight: 700,
  bodyWeight: 500,
} as const;

// Composition margins for the 1080x1920 master (from the brand brief).
export const SAFE = {left: 90, right: 90, top: 180, bottom: 300} as const;

export const CHARACTERS = {
  samir: {
    name: 'Samir',
    skin: '#A87556',
    hair: '#33241C',
    grey: '#9A948E',
  },
  nour: {
    name: 'Nour',
    skin: '#C48E6C',
    hair: '#3A261E',
    grey: '#3A261E',
  },
} as const;
