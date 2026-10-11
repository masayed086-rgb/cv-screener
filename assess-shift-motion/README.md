# ASSESS SHIFT — motion graphics project

A code-based motion graphics project for the ASSESS SHIFT career coaching campaign. It uses Remotion 4 (React + TypeScript), and every frame is a pure function of the frame number. Project instructions are in `CLAUDE.md`. The cast and acting rules are in `CHARACTER_ROLES.md`, `CHARACTER_APPEARANCE.md` and `CHARACTER_MOTION_BIBLE.md`, and the rig layout is in `RIG_ASSET_MAP.json`. The pack's own README is kept as `STARTER_README.md`.

**Status: v2.0, silent cut with model-sheet puppets.** Layla (coach) and Omar (coachee) are animated through connected joints. The animation is final, but three inputs are still pending: the narration, the live registration link (the end card says PREVIEW until it is set) and final detailed character layers (see "Character art").

## Outputs

| File | What it is |
| --- | --- |
| `out/assess-shift-intro-reels.mp4` | **Instagram/Facebook Reels**: 1080×1920, 30 fps, 2250 frames, 75.0 s, H.264 (CRF 16), no audio |
| `out/assess-shift-intro-linkedin.mp4` | **LinkedIn**: 1920×1080, 30 fps, 2250 frames, 75.0 s, H.264 (CRF 16), no audio, with its own layout |
| `out/conversation-study-silent.mp4` | The pack's 8 s conversation study, rebuilt on the ported rig: 1920×1080, 30 fps, 240 frames |
| `out/stills/*-storyboard.png` | Key frames from each intro |
| `out/stills/puppet-sheet.png` | Every puppet gesture, for checking seams |
| `out/studies/*.mp4` | The five graphic motion studies from the earlier pack |

## Commands

These are the commands used to produce the outputs above. Run them from this folder.

```bash
npm install
npm run typecheck
npm run check            # rig checks: determinism, joint limits, turn-taking
python3 -I scripts/build_puppets.py brand/Coach_Coachee_Model_Sheet.png public/puppets   # rebuild puppet layers
npm run studio           # live preview / scrubbing
npx remotion render src/index.ts IntroReels out/assess-shift-intro-reels.mp4 --crf=16 --browser-executable=$BROWSER_EXECUTABLE
npx remotion render src/index.ts IntroLinkedIn out/assess-shift-intro-linkedin.mp4 --crf=16 --browser-executable=$BROWSER_EXECUTABLE
npm run render           # -> out/conversation-study-silent.mp4
npx remotion still src/index.ts PoseSheet out/stills/pose-sheet.png --browser-executable=$BROWSER_EXECUTABLE
```

On this machine `BROWSER_EXECUTABLE` is `/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`. Elsewhere, drop the flag and let Remotion download its own browser. The pack's standalone renderer (`examples/render_character_study.py`) needs Inkscape, which is not installed here, so the study was rendered through Remotion instead. The pack's own `node examples/check_character_motion.mjs` passes.

## The characters: jointed puppets of the model-sheet art (v2.0)

Layla and Omar are now **the actual illustrations from `brand/Coach_Coachee_Model_Sheet.png`**, cut into jointed layers. They replace the hand-drawn vector rig, which looked far simpler than the model sheet.

- **Script.** `scripts/build_puppets.py` takes each front view (at 2× the sheet's resolution) and:
  - removes the ivory background
  - cuts out the head (pivoting at the neck), the body, and each arm as upper arm plus forearm-with-hand (pivoting at the shoulder and elbow)
- **Clean cuts:**
  - the sleeve seams were traced from the art, so each arm carries only sleeve and the body keeps its own side contour
  - pants and jacket colours are kept out of the hand cut-outs
  - the hip areas the hands covered are filled from the surrounding fabric
  - the shoulder and elbow cuts are feathered so the joints blend
- **Omar's pocket arm.** His screen-left hand is in his pocket in the sheet. That arm is removed (pants filled behind it) and rebuilt as a mirror of his free arm, with the watch painted out, so both arms can gesture. His watch stays on his left wrist.
- **`src/rig/Puppet.tsx`** renders the layers with nested SVG transforms using the same `Pose` and acting engine as before. It preloads every layer before frames are captured. Blinks are drawn as eyelids over the painted eyes.
- **Review sheet.** `out/stills/puppet-sheet.png` shows every gesture: rest, ask, present, respond, welcome.

**Limits** (the sheet only has standing front views with hands down):
- The eyes are painted, so gaze is carried by head tilts and nods, not pupil movement.
- Hands keep their relaxed shape when the arm lifts.
- The video doesn't attempt poses that need art the sheet lacks: hand to chin, clasped hands, holding a notebook and pen, seated poses. In the plan scene, Omar lays out his steps with an open hand, and each milestone lands as he nods.
- A few hairline edges remain where the original drawing's outline ran along the hands.

Producing the art as separate layers (PSD or layered PNG) would remove all of these limits.

## Full introduction (75 s): `IntroReels` / `IntroLinkedIn`

`src/intro/` contains:
- `script.ts`: copy and scene timing
- `acting.ts`: the full performance for both characters
- `cast.tsx`: the character layer
- `scenes.tsx`: the graphics
- `formats.ts`: the two layouts

| Time | Lead (CHARACTER_ROLES.md) | On screen | Acting |
| --- | --- | --- | --- |
| 0–7 s | Omar | What comes **next?** | Omar looks up and away, then moves his hand to his chin. A burgundy path draws a question mark. Layla listens and nods. |
| 7–16 s | Omar | A new role? **A new direction?** | Omar's head turns card to card while his open hand presents the three options. Then the Income / Family / Experience chips appear. |
| 16–25 s | Both | ASSESS SHIFT · Career Coaching | Layla opens her palm to invite Omar in, and Omar nods after a beat. The name is revealed behind the path, and name tags introduce the coach and the coachee. |
| 25–38 s | Layla | Understand **yourself** at work | Layla presents Interests and Motivation, then Experience. Omar studies the cards and thinks it over, hand at his chin. |
| 38–51 s | Omar | Explore **realistic** directions | Layla asks; Omar answers with an explanatory hand while she listens. The lenses (Skills, Market, Life priorities) visit each option for the same length of time. |
| 51–61 s | Omar | Build a **practical** transition plan | Omar writes in his notebook. Each line he writes lands a milestone: Reflect, Test an option, Take the next step. |
| 61–68 s | Layla | Different levels of **support** | Layla presents the three package cards, all treated identically. Omar looks, then turns back to her. |
| 68–75 s | Both | Start with a Chemistry Session · Submit your registration request | Both settle with open hands and face the viewer, beside a deep burgundy CTA panel. The panel holds still for about 5 s. |

The headlines repeat the approved voiceover (`voiceover/`). There are no scores, prices, durations, guarantees or "free" claims, and Omar makes his own decision. **Timing is provisional:** once the narration is recorded, re-time `script.ts` and `acting.ts` to it.

## Character art

The rig is the pack's simplified vector redraw with some added detail. It is **not** an exact vectorisation of `brand/Coach_Coachee_Model_Sheet.png`. Matching the model sheet's semi-realistic finish needs that illustration split into the layers listed in `CHARACTER_APPEARANCE.md`: torso, head, hair, eyes, upper arms, forearms, hands and so on. Swapping those in would mean replacing the paths in `Character.tsx`, keeping the same pivots.

## What was checked

- `ffprobe` on all outputs: dimensions, 30 fps, frame counts, durations. No audio streams.
- `npm run check`: 4,500 pose-determinism and joint-limit checks, plus turn-taking: the characters never make big gestures at the same time before the end card. This check caught Omar starting to answer 2 frames before Layla had settled, and his response was moved later.
- Puppet sheet and full-resolution close-ups: no gaps at the shoulders or elbows, no blazer or pants pieces carried with the arms, no hand ghosts on the hips. The end-card welcome gesture was reduced because both arms raised exposed the hip fills.
- Frames from every scene in both formats. Fixed during review:
  - Omar's hand touching the third option card in LinkedIn: moved the cast outward
  - Layla's hand touching the first package card in LinkedIn: moved and narrowed the cards
  - name tags inside the Reels bottom UI zone: moved above the heads
  - a backdrop ring reading as a hoop around Layla: removed
- **Not checked:** full-speed playback by a person, and audio (there is none).

## Remaining production inputs

1. **Narration.** Generate it from `voiceover/` (see `voiceover/ElevenLabs_Voiceover_Guide.md`), then re-time to it, add captions and mix. Add music only if it's licensed.
2. **Live registration URL.** Set `END_CARD.url` in `src/intro/script.ts`.
3. **Approved ASSESS logo** for the lockup, and Aptos or another licensed body font (Quicksand is the fallback).
4. **Final detailed character layers** (see "Character art"), plus seated rigs if you want the seated acting poses.
5. **Arabic version**, with RTL layout and Noto Sans Arabic.
