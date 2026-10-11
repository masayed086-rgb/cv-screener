# Career coaching motion graphics

Act as a motion designer and video engineer. Build editable, reproducible explainer videos for ASSESS SHIFT. Treat these files as project instructions and creative references, not model fine-tuning.

## Read before building

- Read `README.md`, `MOTION_PLAYBOOK.md`, `MOTION_TRAINING.md`, `HOW_TO_USE.md`, `CHARACTER_ROLES.md`, `CHARACTER_APPEARANCE.md`, `PRACTICE_BRIEF.md`, and `REFERENCE_NOTES.md`.
- Read `brand/ASSESS_SHIFT_Claude_Code_Brief.md` for the service, brand, characters and provisional full-video script.
- Inspect supplied character artwork before using it. Samir is the male coach; Nour is the female coach. Both are coaches, with equal status and prominence.
- Inspect the existing repository and preserve its working video framework. For a new project, prefer React + TypeScript + Remotion. Check current official documentation before using unfamiliar APIs.

## Reference handling

- Reference: https://www.youtube.com/watch?v=hAP2QF--2Dg
- Record what you can actually inspect. A link or still frame does not prove motion, easing, sound or transition timing.
- Separate observed facts, published creator statements and proposed adaptations.
- If playback is unavailable, use supplied frames or a rights-cleared local clip. Keep unverified motion details labelled as proposals and continue building a useful draft.
- Create original artwork and transitions suitable for our brand. Do not reuse the reference's logo, illustrations, music or voiceover without permission.

## Visual and character rules

- One main message and one main visual action per shot. Make the story understandable with sound off.
- Palette: burgundy #91212E, deep burgundy #3A0A10, charcoal #242427, ivory #FAF7F2, soft rose #F5E9E9.
- Use Quicksand headlines where approved local font files are available. Document any fallback. Verify Arabic shaping and RTL layout in Arabic versions.
- Preserve each coach's face, hair, complexion, outfit and proportions. Neither coach is a client. Keep both professionally capable.
- Use the updated natural photographic reference in `brand/Realistic_Coach_Reference.png`. It replaces the earlier illustrated appearance. Match skin texture, anatomy, hair strands, fabric, age and lighting.
- Nour leads career questions and option exploration; Samir leads assessment insights and practical planning. Both introduce the service, packages and CTA. Follow `CHARACTER_ROLES.md`; these are creative presentation roles.
- The PNG board and `brand/ASSESS_SHIFT_Realistic_Coaches.svg` are character references. The SVG embeds the same PNG and has no editable vector body parts. Neither is an animation rig. Use identified placeholders if separate approved pose assets are missing.
- Move photographic cutouts as a whole, use limited camera depth, or crossfade compatible poses. Do not bend photographic limbs or simulate talking without suitable mouth assets and reviewed timing. A true articulated gesture needs a rig or a verified video asset.

## Motion and code rules

- Derive animation state from frame number. In Remotion use `useCurrentFrame`, `useVideoConfig`, `interpolate`, `spring` and `Sequence` as appropriate.
- Avoid CSS keyframe animation, elapsed-time timers, unseeded randomness or network-dependent assets in export-critical animation.
- Centralize brand tokens, easing, durations and spacing. Use the playbook's proposed timings until reviewed.
- Stagger related elements. Keep text stationary while it is being read. Use movement to explain relationships.
- Preserve visual continuity across cuts: carry a card, path, shape or focal position between scenes where it helps comprehension.
- Separate scene timing, text, artwork and audio from rendering components. Keep CTA and aspect ratio configurable.

## Production workflow

1. Audit available assets and software. Record specific missing production assets.
2. Write a scene plan with time range, narration, headline, visual, motion and transition.
3. Design key frames before detailed animation.
4. Build the 12-second practice composition first. Render a silent draft and inspect it.
   When asked to learn motion, complete the eight controlled exercises in `MOTION_TRAINING.md` before integrating them. Compare alternative versions with one variable changed.
5. Apply review feedback, then record accepted rules in `MOTION_PLAYBOOK.md` and an approved example in the project.
6. Extend to the full script only when asked. Align final scene timing to actual voiceover.
7. Check every scene, render the final export, and provide commands that were actually used.

## Claims and delivery

- Do not invent assessment scores, testimonials, prices, accreditation, guaranteed jobs or a free Chemistry Session.
- Client owns career decisions. Coaching helps explore options and build a practical plan.
- A missing registration URL must remain a documented dependency. Never create a misleading placeholder booking QR.
- Deliver editable source, a scene timing file, representative preview frames, MP4 if successfully rendered, and a README with working preview/export commands.
- Verify output dimensions, duration, frame rate, clipping, text readability, character identity and sound. State what was checked and what remains unresolved.
- Label a silent draft clearly. Do not claim narration, final captions or an MP4 exists unless the relevant files exist and were inspected.

## Motion learning and review

- Use `examples/MotionRecipes.tsx` as a starter implementation. Integrate it into an existing Remotion project; do not overwrite its entry point.
- Convert seconds to frames with the composition's fps. Record frame ranges as start-inclusive and end-exclusive.
- In a Sequence, use local frame time for local events. Convert global markers explicitly; do not subtract the scene start twice.
- Add anticipation only to explanatory graphic actions, with small offsets. Keep realistic coach movement calm and anatomically plausible.
- Specify every motion by trigger frame, duration, distance, easing, reading hold and exit/transition. Avoid vague requests such as 'make it more dynamic'.
- After review, retain the accepted source, rendered example and rationale. Add only accepted general rules to the playbook. Do not call an unreviewed sample an approved style.
