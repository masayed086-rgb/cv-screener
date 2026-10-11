// ASSESS SHIFT introduction — scene timing and on-screen copy.
// Provisional storyboard timing (silent draft). Re-time to the recorded
// voiceover before the narrated final; do not squeeze the voice to fit.
// Frames are at 30 fps, start-inclusive / end-exclusive.

export const INTRO_FPS = 30;

export type IntroScene = {
  id: string;
  from: number;
  dur: number;
  headline?: {text: string; em?: boolean}[];
  // Supporting line paraphrased from the approved English voiceover.
  sub?: string;
  note?: string;
};

export const INTRO_SCENES = [
  {
    id: 'question',
    from: 0,
    dur: 210,
    headline: [{text: 'What comes '}, {text: 'next?', em: true}],
    sub: 'You’ve built experience. But what should your next career move be?',
  },
  {
    id: 'options',
    from: 210,
    dur: 270,
    headline: [{text: 'A new role?\n'}, {text: 'A new direction?', em: true}],
    sub: 'When income, family and years of experience matter, the decision needs careful thought.',
  },
  {
    id: 'brand',
    from: 480,
    dur: 270,
    sub: 'Psychometric insight combined with professional career coaching.',
  },
  {
    id: 'understand',
    from: 750,
    dur: 390,
    headline: [{text: 'Understand '}, {text: 'yourself', em: true}, {text: ' at work'}],
    sub: 'Explore your interests and motivation, and connect them with your experience.',
  },
  {
    id: 'compare',
    from: 1140,
    dur: 390,
    headline: [{text: 'Explore '}, {text: 'realistic', em: true}, {text: ' directions'}],
    sub: 'Compare possible directions against your skills, market opportunities and life priorities.',
    note: 'Personality insight is included in selected journeys.',
  },
  {
    id: 'plan',
    from: 1530,
    dur: 300,
    headline: [{text: 'Build a '}, {text: 'practical', em: true}, {text: ' transition plan'}],
    sub: 'Practical next steps, with room to test an option before a major move.',
  },
  {
    id: 'packages',
    from: 1830,
    dur: 210,
    headline: [{text: 'Different levels of '}, {text: 'support', em: true}],
  },
  {
    id: 'end',
    from: 2040,
    dur: 210,
  },
] as const satisfies readonly IntroScene[];

export const INTRO_DURATION = 2250;

export type SceneId = (typeof INTRO_SCENES)[number]['id'];
export const sceneById = (id: SceneId): IntroScene => INTRO_SCENES.find((s) => s.id === id)!;

export const OPTIONS = ['A new role', 'A new field', 'A new way of working'] as const;
export const FACTORS = ['Income', 'Family', 'Experience'] as const;
export const CRITERIA = ['Skills', 'Market', 'Life priorities'] as const;
export const MILESTONES = ['Reflect', 'Test an option', 'Take the next step'] as const;
// Exact package names from the service brief. All three get identical treatment.
export const PACKAGES = ['Career Clarity', 'Career Direction', 'Career Transformation'] as const;

export const END_CARD = {
  cta: 'Start with a Chemistry Session',
  action: 'Submit your registration request',
  tagline: 'Your next career move deserves clarity.',
  // Set to the live registration URL when supplied. While null, the end card
  // shows a PREVIEW label instead of a link (never a placeholder QR/URL).
  url: null as string | null,
};
