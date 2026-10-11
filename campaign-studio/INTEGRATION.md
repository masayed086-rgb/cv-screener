# Integration notes: Campaign Studio vs. `assess-shift-motion` v2.0

This folder is the ASSESS SHIFT Campaign Studio kit, copied unchanged (all 28 files match `manifest.json` checksums). Its own `CLAUDE.md` applies when Claude Code works inside `campaign-studio/`. The existing Remotion project in `../assess-shift-motion` (v2.0, Layla & Omar intro) has not been modified.

The two folders describe **different proposed directions**. Until one is chosen, do not mix their tokens, characters or copy in a single video.

## Conflicts to resolve

| Area | Campaign Studio (this folder) | `assess-shift-motion` v2.0 |
| --- | --- | --- |
| Palette | Navy #142C3E, ivory #F7F3EA, teal #217A78, amber #D9A441, ink #253642 | Burgundy #91212E, deep burgundy #3A0A10, charcoal #242427, ivory #FAF7F2, soft rose #F5E9E9 |
| Fonts | Manrope (EN), Noto Sans Arabic | Quicksand headlines, Aptos body, Noto Sans Arabic |
| Coach | `coach-01`: woman, early 40s, navy blazer, teal top, ivory wide-leg trousers, gold earrings | Layla: about 44, burgundy blazer, ivory blouse, charcoal trousers |
| Coachee | `coachee-01`: man, early 30s, short dark curls, amber overshirt, ivory tee, navy trousers, watch | Omar: about 37, side-parted hair, slate teal shirt, taupe chinos, watch |
| Campaign line / CTA | "Your next step starts with clarity." / "Book a Chemistry Session" (احجز جلسة تعارف) | "Start with a Chemistry Session. Submit your registration request." |
| Scope | Career Coaching, Leadership Coaching, Career Advising; six-video series, 30 s Reel 01 | Career Coaching intro, 75 s, Reels + LinkedIn |
| Character assets | Flattened reference PNGs only; rig still to be built (`prompts/01`) | Jointed puppets cut from `brand/Coach_Coachee_Model_Sheet.png` |

Shared ground: Chemistry Session as the only first step, no "free" claim or invented duration, no invented credentials/results/pricing, deterministic frame-driven rendering, coachee owns the decision, separate Arabic versions.

## Reusable from v2.0 if this direction is adopted

- Remotion setup, deterministic rendering and `npm run check` (determinism, joint limits, turn-taking).
- `src/rig/Puppet.tsx` and the acting engine: new layers for `coach-01` / `coachee-01` can reuse the same `Pose` and pivots approach.
- `scripts/build_puppets.py` as a starting point for cutting `assets/reference-sheets/character-system.png`, subject to the character bible's rule that the sheets are references, not rigs.

## Not done in this integration

- `original-toolkit/motion-reel` was **not** installed into `.claude/skills/` (the kit marks it optional, and a `motion-reel` skill already exists in this environment).
- No rigs, reels or renders were produced; see `prompts/01`–`03` for next steps.
- The uploaded standalone `ASSESS_SHIFT_Visual_Bible.pdf` differs byte-wise from the copy inside the zip, but has identical page count and text. The zip copy (matching `manifest.json`) is the one kept here.
