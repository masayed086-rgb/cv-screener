# ASSESS SHIFT — motion graphics project

A code-based motion graphics project for the ASSESS SHIFT career coaching campaign. It uses Remotion 4 (React + TypeScript), and every frame is a pure function of the frame number. The project instructions live in `CLAUDE.md`, the motion rules in `MOTION_PLAYBOOK.md` and the practice brief in `PRACTICE_BRIEF.md`. The starter pack's original README is kept as `STARTER_README.md`.

**Status: v0.1 silent practice draft (12 s).** The coach figures are placeholders, and the end card has no booking link.

## Outputs

| File | What it is |
| --- | --- |
| `out/career-coaching-practice-silent.mp4` | 1080×1920, 30 fps, 360 frames, 12.0 s, H.264, **no audio track** |
| `out/stills/frame-{60,150,240,345}.png` | One key frame per scene |
| `out/stills/contact.png` | All four key frames side by side |

## Commands

These are the commands used to produce the outputs above. Run them from this folder.

```bash
npm install
npm run typecheck
npm run studio                                   # live preview / scrubbing in the browser
npm run still -- out/stills/frame-150.png --frame=150
npm run render                                   # -> out/career-coaching-practice-silent.mp4
```

The `still` and `render` scripts pass `--browser-executable`. On this machine it points at the pre-installed Chromium headless shell. Elsewhere, set `BROWSER_EXECUTABLE`, or drop the flag and let Remotion download its own browser.

## Where things live

| File | Purpose |
| --- | --- |
| `src/brand.ts` | Colours, fonts, safe margins, character colour locks |
| `src/motion.ts` | Easing, durations, offsets, plus the `track()` / `enter()` helpers. **Change a timing token here to update every scene that uses it.** |
| `src/timeline.ts` | Scene timing table, headlines, card keyframes, coach arm poses, path and mark timings |
| `src/CareerCoachingPractice.tsx` | Scene composition (layers: headline → path → cards → tagline → coaches) |
| `src/components/` | `Coach` (placeholder vector figure), `Card`, `Headline` |
| `public/fonts/` | Quicksand 500/700, bundled locally from @fontsource (OFL) |
| `brand/` | Brand brief, character sheet document, and the extracted character-sheet image |

## Scene plan (silent practice)

| Frames | Headline | Visual / motion | Transition |
| --- | --- | --- | --- |
| 0–90 | Thinking about your **next career move?** | Both coaches fade and rise in together (16 f). Two equal option cards ("A new role", "A new field") rise in with a 4 f stagger. | The option cards stay on stage and dim to 40%. |
| 90–180 | Understand **what matters** to you. | Nour raises her arm and "Interests" slides in from her side. Samir does the same with "Motivation", 4 f later. No scores. | The insight cards stay in place, and the option cards return to full strength below. |
| 180–270 | Explore **realistic options.** | A burgundy path draws from the insight cards and branches equally to both option cards. Both coaches gesture higher, and both option cards get the same emphasis border. | The branches fade and the path trunk carries on downward. |
| 270–360 | **ASSESS SHIFT** · Career Coaching | Cards fade out. The trunk extends and retracts from the top, travelling into the next-step mark (spring pop, minimal overshoot). The tagline "Your next move deserves clarity." follows. Coaches lower their arms, balanced. | Static from frame 316 onward. |

## What was checked

- MP4 verified with `ffprobe`: 1080×1920, 30/1 fps, 360 frames, duration 12.000 s, no audio stream.
- I looked at stills at frames 0, 45, 60, 120, 150, 210, 230, 240, 285, 300, 345 and 359. Text stays inside the 90 px side and 180 px top margins, with no clipping, and every headline fits in two lines or fewer.
- Fixed during review: the branch paths used to undraw into a shape that read as an upward arrow (frame 285), so they now fade instead. Samir's temple greys looked like headphones and were redrawn. The placeholder tags were wrapping onto two lines.
- **Not yet checked:** full-speed playback by a person. Stills cannot show motion feel, so please watch the MP4 and review the timing.

## Production dependencies (missing)

1. **Approved coach pose artwork.** The character sheet is a single flattened image (1536×1024), not a layered rig. Both coaches here are code-drawn **placeholders**, labelled "PLACEHOLDER ART" on screen. Each coach needs a transparent, layered SVG or PNG set: front standing pose, plus a "presenting" pose with a separate upper arm, forearm and hand.
2. **Approved ASSESS logo.** The lockup is typed text until the logo is supplied.
3. **Supporting typeface.** Aptos is not bundled, so Quicksand 500 is used as the fallback.
4. **Reference footage.** The UpSend video could not be played in this environment. All motion values are the playbook's proposals, not measurements. Put 6–10 frames or a rights-cleared clip in `references/` to calibrate them.
5. **Voiceover, music and registration URL.** Not needed for the practice, but required for the full 75 s video.

## Decisions for review

1. **Pace.** Each headline holds for about 2.3 s before it leaves. Is that long enough to read on a phone?
2. **Coach gesture.** Arms rise to shoulder height in scene 2, then higher in scene 3. Keep this, or use one pose throughout?
3. **Option card treatment.** White cards for options and soft rose for insights. Should both be soft rose?
4. **End card.** The lockup is stable for about 1.5 s (frames 316–360). The playbook asks for ≥ 3 s, so the full video should extend this.
5. **Coach scale.** The coaches are 520 px tall. Should they be larger, and the cards smaller?

Give corrections as *time range + element + change + reason*. Accepted rules then go into the correction log in `MOTION_PLAYBOOK.md`.
