# Motion training through controlled exercises

Teach a repeatable process by giving Claude a small task, checking the render, correcting one variable and retaining the accepted example. Instructions provide context; actual rendered examples establish whether a motion works.

The timings below are proposed starting settings for ASSESS SHIFT, not measurements of the UpSend video. Use 30 fps for these exercises. Convert timings if fps changes.

## Motion specification

Every action needs: subject, trigger frame, duration, displacement, easing, reading hold, exit and purpose. Example: 'At frame 30, move the option card upward 48 px over 16 frames with cubic ease out; fade it over the first 10 frames; keep it still through frame 100 so the label can be read.'

One frame at 30 fps is approximately 33.3 ms. A 16-frame duration is approximately 0.53 s. For a 16-frame interpolation starting at frame 30, use endpoints 30 and 46. A Sequence lasting 90 frames shows local frames 0–89; its next scene begins at the global end-exclusive boundary.

## Eight exercises

### 1 Timing and easing

Build three identical cards moving 60 px over 18 frames: linear, cubic ease out and a restrained spring. Match duration, layout and distance so easing is the only variable. Compare speed at the start, settling and readability. Use the spring's documented duration/configuration controls rather than assuming it finishes at a guessed frame.

Prompt: 'Render a side-by-side easing study. Label each version. Report which version supports calm career-coaching graphics, with evidence from playback. Keep the subject, distance and reading hold identical.'

Pass: no sudden position jump at the start or finish; the viewer can distinguish the variants; the final card position is stable. Retain the selected version as a proposed standard until reviewed.

### 2 Staging and stagger

Reveal three equal option cards. First create a simultaneous version. Then keep the same card animation and delay cards by 4 frames each. Settle the whole group before presenting the comparison question. Do not shrink the reading hold to make room for extra entrances.

Prompt: 'Make A and B versions differing only in stagger: 0 frames versus 4 frames. Keep the card entry 16 frames and the group reading hold at least 60 frames. Inspect both at phone viewing size.'

Pass: clear order without making the group feel disconnected; all labels remain readable.

### 3 Anticipation and settling

Use a graphic card, not a photographic person. Move it 4 px opposite the intended direction over 3 frames, then 48 px toward its final position over 15 frames. Compare with a version without anticipation. If a settle is useful, keep it small; avoid repetitive bounce.

Prompt: 'Compare a simple ease-out entry with a 3-frame, 4-pixel anticipation entry. Explain whether anticipation helps the action or introduces unnecessary decoration. Preserve layout and hold time.'

Pass: purposeful preparation without visible jitter or a distracting rebound. Save exceptions; do not make anticipation mandatory for every entrance.

### 4 Path drawing and emphasis

Connect two insight cards to a next-step card. Reveal an SVG path with strokeDasharray/strokeDashoffset over 24 frames. Emphasize the destination with a border change or restrained scale pulse. Use a normalized pathLength of 1 or an explicitly measured path length; do not guess the stroke length.

Prompt: 'Draw the connection after both cards settle. Emphasize the next-step card once. The path must communicate a relationship, not imply that an assessment automatically chooses a career.'

Pass: the path appears in the correct direction and ends at the intended anchor; emphasis is legible without moving the label while it is read.

### 5 Camera depth and parallax

Use three layers: background shape, coach cutout, foreground insight card. Over 90 frames move the background 8 px, the coach 14 px and the card 22 px in a coordinated direction. Compare with a still version. Keep text stable or sufficiently slow to read. The distances are starting values for a 1080-pixel short edge.

Prompt: 'Create a gentle three-layer parallax study using a supplied realistic coach cutout. Preserve the full body and face. Keep the foot anchor plausible and do not stretch the person. If the cutout is unavailable, use an explicitly labelled placeholder.'

Pass: depth supports focus without making the coach slide implausibly or cutting off the body. Avoid adding parallax to every scene.

### 6 Continuity across scenes

Carry one option card into a plan card. Animate its position and dimensions between two states, while its label crossfades. Keep compatible corner treatment and a clear focal point. If two scene components overlap, explicitly plan the overlap; do not render the same object twice by accident.

Prompt: 'Build a 12-frame transition where the viewer can follow the option card becoming a next-step plan. Render the boundary frame and intermediate frames. Preserve visual continuity and a stable reading hold after the transition.'

Pass: no black gap, duplicate card, one-frame pop or unreadable label overlap. The change has a narrative purpose.

### 7 Realistic character pose changes

Prepare two compatible poses of one coach. Align the face anchor and scale before an 8–12 frame crossfade. Compare the crossfade with a direct cut hidden by an explanatory card transition. Keep identity and lighting consistent. Never force poses to match by distorting anatomy.

Prompt: 'Show Samir moving from reviewing insight to presenting a plan using approved pose assets. Compare a short aligned crossfade and a motivated cut. Inspect the face, hands, shoulders and notebook during the transition.'

Pass: no double face, extra-looking limbs, identity drift or prolonged ghosting. If poses are incompatible, use the cut or request a better pose asset.

### 8 Narration and reading rhythm

With no recording, use a labelled silent timing draft. With a reviewed recording, mark phrase starts and endings. Schedule the relevant card just before or with its phrase, then allow comprehension time before the next idea. Include an end card with a stable CTA hold.

Prompt: 'Map the supplied voiceover to phrase markers and scene events. Produce a timing table and timed captions from the actual recording. Preserve natural speech; adjust the scene rather than speeding up the voice to fit.'

Pass: words and visuals agree; captions remain readable; no abrupt cut before a phrase ends. Final timing requires the actual recording.

## Integration exercise

Use the accepted versions in PRACTICE_BRIEF.md. Apply only the techniques that serve that scene. A short explainer does not need to demonstrate every animation technique at once.

## Review loop

1. Render the baseline and variant with one changed variable.
2. Inspect start, middle, finish and scene boundaries; also watch full playback.
3. Give feedback with time, subject, change and reason.
4. Render the affected segment and check that the fix does not damage adjacent events.
5. Record the accepted value and scope in MOTION_PLAYBOOK.md. Retain source and export as examples.

Suggested feedback: 'At 4.0–4.7 seconds the card rebounds while I read the heading. Use the cubic ease-out version from Exercise 1, retain the 16-frame entry and extend the stable hold to 60 frames.'

## Deterministic rendering

Compute motion from frame number. Read local frame inside a Sequence and convert global events once. Clamp interpolation before and after an action. Use stable assets and fonts. Avoid elapsed-time timers, CSS keyframe animation and unseeded randomness for exported visuals.

`examples/MotionRecipes.tsx` contains five frame-driven graphic recipes. It is an integration starter, not a complete character-animation system. See HOW_TO_USE.md for importing and rendering it. Compilation and export must be verified in the configured video project.

Primary technical sources: [interpolate](https://www.remotion.dev/docs/interpolate), [spring](https://www.remotion.dev/docs/spring), [Sequence](https://www.remotion.dev/docs/sequence), [flickering](https://www.remotion.dev/docs/flickering).
