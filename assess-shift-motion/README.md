# ASSESS SHIFT — motion graphics project

A code-based motion graphics project for the ASSESS SHIFT career coaching campaign. It uses Remotion 4 (React + TypeScript), and every frame is a pure function of the frame number. Project instructions are in `CLAUDE.md`. The motion rules and correction log are in `MOTION_PLAYBOOK.md`, and the exercises in `MOTION_TRAINING.md`. Coach roles are in `CHARACTER_ROLES.md` (machine-readable copy: `character_scene_roles.json`), and appearance and asset rules in `CHARACTER_APPEARANCE.md`. The pack's own README is kept as `STARTER_README.md`.

**Status: v0.3 silent drafts.** The coaches now use the realistic photographic reference. They are **interim cut-outs cropped from the reference board** and labelled "REFERENCE CROP · NOT FINAL ART" on screen. There is still no voiceover, music or booking link.

## Outputs

| File | What it is |
| --- | --- |
| `out/assess-shift-intro-reels-silent.mp4` | **Reels**: 1080×1920, 30 fps, 2250 frames, 75.0 s, H.264, no audio |
| `out/assess-shift-intro-linkedin-silent.mp4` | **LinkedIn**: 1920×1080, 30 fps, 2250 frames, 75.0 s, H.264, no audio, with its own reflowed layout |
| `out/career-coaching-practice-silent.mp4` | 12 s practice, 1080×1920, 30 fps, 360 frames, no audio |
| `out/studies/*.mp4` | The pack's five motion studies (easing, staging, path, continuity, depth), each 1920×1080, 6 s |
| `out/stills/intro/*-storyboard.png`, `out/stills/contact.png` | Key frames |

## Commands

These are the commands used to produce the outputs above. Run them from this folder.

```bash
npm install
npm run typecheck
npm run studio                       # live preview / scrubbing in the browser
npm run render:reels                 # -> out/assess-shift-intro-reels-silent.mp4
npm run render:linkedin              # -> out/assess-shift-intro-linkedin-silent.mp4
npm run render                       # -> out/career-coaching-practice-silent.mp4
npx remotion render src/index.ts EasingStudy out/studies/easing-study.mp4 --browser-executable=$BROWSER_EXECUTABLE
#   (likewise CardStaging, PathDrawing, CardContinuity, CameraDepth)
python3 -I scripts/matte.py brand/Realistic_Coach_Reference.png public/coaches   # regenerate the interim coach cut-outs
```

The npm render scripts pass `--browser-executable`, which on this machine points at the pre-installed Chromium headless shell. Elsewhere, set `BROWSER_EXECUTABLE`, or drop the flag and let Remotion download its own browser. The `matte.py` command rewrites the cut-out PNGs only. If you change a crop box, re-measure the anchors in `public/coaches/manifest.json` and `src/coachAssets.ts`.

## Coaches: how the photographic characters are used

- **Source.** `scripts/boxes.py` crops 6 full-body poses and 6 portraits from `brand/Realistic_Coach_Reference.png`: standing front, standing three-quarter, and exploring options (holding two blank cards), plus listening / curious / encouraging portraits for each coach. `scripts/matte.py` removes the board's ivory background (a border flood-fill, soft edges, colour decontamination, and removal of floor shading), then upscales ×2 with Lanczos. The output is `public/coaches/*.png`, with measured head, feet and face anchors in `manifest.json`.
- **Motion** follows `CHARACTER_APPEARANCE.md`. Each cut-out moves only as a whole: fade and slide entrances, plus pose changes. No limb is bent, nothing is stretched, there is no fake breathing and no lip movement. All poses share the same body height, floor line and face x-anchor.
- **Pose changes are a 10-frame dip, not a full crossfade.** The old pose fades out over frames 0–6 and the new one fades in over 4–10. The reference poses have different head angles, so a 50/50 crossfade showed a double face (checked at the transition midpoint). This follows MOTION_TRAINING.md exercise 7, which says to prefer a cut over ghosting.
- **Roles** follow `CHARACTER_ROLES.md`:
  - Nour leads the opening question and the option comparison, switching to her open-hand pose at 38.7–48.3 s.
  - Samir leads insights and planning, in the open-hand pose at 26.0–33.3 s and 52.0–59.7 s.
  - The options scene is led by graphics, so neither coach gestures there.
  - Both share the brand, packages and end card at equal size.
- **Limits of the interim crops.** Each figure is about 340 px tall on the board, so it is upscaled about 1.6× on screen and looks soft up close. The edges are clean on the ivory background. They are not suitable for dark backgrounds, which is why only the circular portraits appear on the burgundy end card.

## Full introduction (75 s): `IntroReels` / `IntroLinkedIn`

Both compositions render `src/intro/IntroVideo.tsx` with a layout from `src/intro/formats.ts`. Copy and timing are in `src/intro/script.ts`, coach poses and visibility in `src/intro/coaches.tsx`, and scenes in `src/intro/scenes.tsx`.

| Time | Scene | On screen | Motion |
| --- | --- | --- | --- |
| 0–7 s | Question (Nour) | What comes **next?** | Nour enters, standing still. A burgundy path draws a question mark and the dot pops in. |
| 7–16 s | Options (graphics) | A new role? **A new direction?** | Three equal option cards rise in with a stagger. Income / Family / Experience chips follow. Samir enters. |
| 16–25 s | Brand (both) | ASSESS SHIFT · Career Coaching · by ASSESS International | A path line reveals the name. Samir's and Nour's photo portraits pop in at equal size. |
| 25–38 s | Understand (Samir) | Understand **yourself** at work | Samir changes to the open-hand pose. Interests and Motivation cards appear, and paths link them to "Your experience". |
| 38–51 s | Compare (Nour) | Explore **realistic** directions | Nour's open-hand pose. Skills / Market / Life priorities lenses visit each option for the same 46 frames, then all three hold equally. |
| 51–61 s | Plan (Samir) | Build a **practical** transition plan | Samir's open-hand pose. The path progresses through Reflect, Test an option and Take the next step. |
| 61–68 s | Packages (both) | Different levels of **support** | Career Clarity, Career Direction and Career Transformation, all treated identically. |
| 68–75 s | End card (both) | Start with a Chemistry Session · Submit your registration request | A deep burgundy wipe, then the lockup, both portraits and the CTA. Static for about 4 s. Labelled PREVIEW until `END_CARD.url` is set. |

**Timing is provisional.** It follows the storyboard, not a recording. Re-time `src/intro/script.ts` to the real voiceover and build captions from it.

## Practice (12 s): `CareerCoachingPractice`

This is the same choreography as v0.1, now with the photographic coaches. Nour switches to the open-hand pose at frame 96 and Samir at frame 100, as their insight cards arrive. Both return to standing at frame 272, for the lockup.

## Where things live

| File | Purpose |
| --- | --- |
| `src/brand.ts` / `src/motion.ts` | Brand tokens; easing, durations and keyframe helpers. **Change a timing token here to update every scene that uses it.** |
| `src/coachAssets.ts` / `src/components/PhotoCoach.tsx` | Pose asset table with anchors; the whole-cut-out coach with pose dips |
| `src/intro/*` | The 75 s intro: script, formats, scenes, coaches, shared parts |
| `src/timeline.ts`, `src/CareerCoachingPractice.tsx` | The 12 s practice |
| `src/examples/MotionRecipes.tsx` | The pack's five motion studies, registered under the "MotionStudies" folder. CLAUDE.md refers to this as `examples/MotionRecipes.tsx`. |
| `public/coaches/`, `public/fonts/` | Interim coach cut-outs plus manifest; Quicksand (OFL) |
| `brand/` | Brief, character documents, the realistic reference (PNG and SVG), and the superseded illustrated sheet (`coach-character-sheet-reference.png`) |
| `scripts/` | `boxes.py` crop boxes and `matte.py` background removal |

## What was checked

- All eight MP4s were verified with `ffprobe` (dimensions, 30 fps, frame count, duration). None has an audio stream.
- Each cut-out was checked on ivory at normal contrast and at 4× boosted contrast. A visible light floor box around the feet, and later holes in the cards and Nour's blouse, were found and fixed in `matte.py`.
- Pose changes were checked at frames 1163 / 1165 / 1167 in LinkedIn. There is no double face, only a faint overlap mid-dip.
- Frames from every intro scene were checked in both formats. Text stays inside the margins, and the coaches don't collide with the cards.
- **Not checked:** full-speed playback by a person.

## Production dependencies (missing)

1. **Approved high-resolution transparent pose PNGs** for each coach, per `CHARACTER_APPEARANCE.md`: neutral standing, seated listening, open-hand invitation, reviewing insights, presenting a plan, and portraits. No image-generation tool is connected in this environment, so they could not be created here. To swap them in, drop them into `public/coaches/` and update `src/coachAssets.ts`.
2. **Approved ASSESS logo.** The lockup is typed text.
3. **Voiceover and licensed music, then captions.** Then re-time `src/intro/script.ts`.
4. **Live registration URL.** Set it as `END_CARD.url`.
5. **Supporting typeface.** Aptos is not bundled, so Quicksand 500 is the fallback.
6. **Reference footage** of UpSend (frames or a rights-cleared clip). It could not be played here, so all motion values are proposals.
7. **Arabic version.** Needs Noto Sans Arabic and an RTL layout pass.

## Decisions for review

1. **Pose-change style.** A 10-frame dip (current), or a hard cut hidden behind a card transition?
2. **Coach size.** About 545 px body height in Reels and 520 px in LinkedIn. Larger would look softer until high-resolution poses arrive.
3. **The blank cards held in the exploring pose.** Keep them (they echo the option cards), or request a pose with empty open hands?
4. **Motion studies.** Watch `out/studies/` and pick the easing (exercise 1) and stagger (exercise 2) to adopt. The intro currently uses cubic ease-out with a 4-frame stagger.

Give corrections as *time range + element + change + reason*. Accepted rules then go into the correction log in `MOTION_PLAYBOOK.md`.
