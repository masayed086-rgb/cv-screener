# Career coaching motion graphics

Act as a motion designer and video engineer. Build editable, reproducible explainer videos for ASSESS SHIFT. Treat these files as project instructions and creative references, not model fine-tuning.

## Read before building

- Read `README.md`, `MOTION_PLAYBOOK.md`, `PRACTICE_BRIEF.md`, and `REFERENCE_NOTES.md`.
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
- A combined character sheet is a reference image, not a layered animation rig. Use identified placeholders if separate approved pose assets are missing.
- Use pose swaps or restrained layer animation. Do not distort bodies or simulate talking without suitable mouth assets and reviewed timing.

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
