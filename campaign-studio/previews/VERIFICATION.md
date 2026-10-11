# Character previews: verification report

Silent prototypes. There is no audio, no lip sync and no voiceover yet, and every scene uses closed-mouth acting.

## Deliverables

| File | What it is |
| --- | --- |
| `acting-test-5s.mp4` | The existing 5 s seated acting test, corrected. 1080×1920, 30 fps, 150 frames, H.264, no audio |
| `assess-shift-test-flat-10s.mp4` | 10 s flat-illustration test. 1080×1920, 30 fps, 300 frames, H.264, no audio |
| `assess-shift-test-whiteboard-10s.mp4` | 10 s whiteboard test, same performance. 1080×1920, 30 fps, 300 frames, H.264, no audio |
| `contact-sheet-flat.png`, `contact-sheet-whiteboard.png`, `contact-sheet-acting-test.png` | Frames decoded from the MP4s themselves |
| `poster-flat.png`, `poster-whiteboard.png` | Frame at 6.9 s (the chosen path) |

Editable source is in `../rig/`:
- `rig.js`: the articulated SVG characters, with named joint groups and pivots
- `acting.js`: poses, IK and the 5 s test
- `story.js`: the 10 s performance and both looks, including the whiteboard reveal
- `tools/`: rendering and checks

Fonts are Manrope (OFL), bundled in `../fonts/`.

## Rebuilding

```bash
cd campaign-studio
node rig/tools/render.cjs story flat previews/assess-shift-test-flat-10s.mp4 10
node rig/tools/render.cjs story whiteboard previews/assess-shift-test-whiteboard-10s.mp4 10
node rig/tools/render.cjs acting flat previews/acting-test-5s.mp4 5
node rig/tools/check.cjs                       # movement checks -> out/checks.json
node rig/tools/seek-order.cjs story whiteboard  # pixel determinism
```

## Corrections made to the existing 5 s test

These were seen in rendered frames, then fixed and re-rendered.

1. **Chin gesture.** The IK picked the wrong elbow solution, so the coachee's arm went up over his face and the hand covered his forehead. The IK now chooses the elbow below the shoulder–wrist line, and the hand lands at the chin.
2. **Arms too short.** The arms couldn't reach the lap with a bent elbow, so they crossed the chest almost straight. Arms are now about 11% longer (coach 168/150, coachee 176/156), and the lap targets were moved so the elbows tuck back by the hips.
3. **Neck seams.** There was a hard line at the jaw and at the collar. The neck now extends under the jaw and is drawn beneath the clothing, and the patch of skin at the collar has no outline.
4. **Coach gesture.** It reached almost to the coachee as a stiff, straight arm. It's now a smaller palm-up open hand at chest-to-waist height with the elbow bent, using a new `offer` hand shape.
5. **Spacing.** The knees nearly touched and the table was hidden. The characters were moved apart and scaled up.

## Checks actually performed

**Pixel determinism in Chromium.** Frames were rendered forward, then reversed and shuffled, and every screenshot's hash was compared:
- flat: 11 of 11 identical
- whiteboard: 11 of 11 identical
- acting test: 6 of 6 identical

**SVG determinism.** For all 300 frames of each style, rendering forward and in reverse gave identical SVG output (`check.cjs`).

**Planted feet and seat contact**, computed from the rig's own forward kinematics for every frame up to the end card:
- Feet drift is 0 px for both characters.
- The pelvis moves 0 px, so the seat contact is constant.
- The thigh overlaps the cushion by a constant 35 px (coach) and 30 px (coachee), so the thighs sit into the cushion and never float above it.

**Eyes lead the head.** For each of the coachee's six look changes, the eyes reach 50% of their move 0.25 s before the head does.

**Rotation ranges** against the bible's starting limits:

| | Head | Torso |
| --- | --- | --- |
| coach | −2.0° to +4.2° | +0.4° to +2.6° |
| coachee | −6.0° to +3.0° | −0.6° to +2.4° |

The first check found the coachee's head at −9°. It was reduced to stay within the ±6° limit.

**Hand contact and aim:**
- The chin hand stays within 0.8 px of the chin during the hold.
- The coachee's index finger points within 0° of the chosen path's tip. It had been 24° off, which the check caught, and the aim was fixed.

**Coach's open hand.** At the hold, the wrist is at y = 1229, between the shoulder (1107) and the pelvis (1402), which is chest-to-waist height.

**Blinks.** Each blink lasts 0.14 s at fixed, irregular times, and the two characters never blink within 0.14 s of each other. The first check found a 0.12 s overlap, which was moved.

**Turn-taking:**
- The coach's anticipation, move, overshoot and settle take 0.12 s, 0.35 s, 0.22 s and 0.22 s, and she holds until 4.62 s.
- The coachee begins reaching for his chin at 4.68 s, while her arm is relaxing.
- He points from 5.86 s to 6.55 s.

**Frames inspected:**
- the contact sheets above
- zoomed crops of both faces across each look change, and of the coach's gesture
- crops of the pointing arm, which led to moving the navy tangle out of the arm's path
- the end card and two story frames downscaled to 360 px wide: all copy is legible

**Whiteboard technique.** Every character outline, prop, route and end-card shape is drawn with `stroke-dasharray`/`stroke-dashoffset` from its real `getTotalLength()`:
- The pen draws silhouette first, then face, then clothing details, then hands, top-down within each.
- Props come next, then the routes.
- Teal and amber fills appear only after their outline.
- Text appears as whole shaped lines, not letter by letter.
- No raster image is used anywhere.

**Files.** `ffprobe` confirmed the dimensions, 30 fps, frame counts, durations and that there's no audio stream. The render page reported no console errors (the renderer fails if it does).

## Not verified, or limits

- **Real-time playback by a person.** I checked frames, crops and numbers, but I can't watch the MP4s at full speed, so the overall rhythm and feel still need your review.
- **Seated look.** The chairs are drawn in a straight side view while the characters are in 3/4 view. Seat contact is constant, but whether the chairs look right is a judgement for you.
- **Wrists in the flat style.** Hands are separate pieces, and at some wrist angles the cuff-to-hand overlap could show a small notch. I didn't see one in the crops I inspected, but I didn't inspect every frame at full size.
- **Likeness to the reference sheet.** These are original vector characters that follow the character bible's identity locks: hair, beard, wardrobe colors, the earrings and the watch on his left wrist. They are not a reproduction of `character-system.png`, and I haven't made a side-by-side comparison.
- **Hands.** There are seven hand shapes (relaxed, open, offer, point, chin, pen, fist). Fingers don't articulate individually.
- **Arabic version.** Not built or checked.
- **Copy.** The labels "New role", "Lead a team" and "New field" are placeholder directions for the test. They aren't approved copy.
- **Not done:** audio, captions, lip sync, square and landscape versions, and publishing.
