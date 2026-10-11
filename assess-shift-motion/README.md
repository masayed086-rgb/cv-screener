# ASSESS SHIFT — motion graphics project

A code-based motion graphics project for the ASSESS SHIFT career coaching campaign. It uses Remotion 4 (React + TypeScript), and every frame is a pure function of the frame number. Project instructions are in `CLAUDE.md`. The cast and acting rules are in `CHARACTER_ROLES.md`, `CHARACTER_APPEARANCE.md` and `CHARACTER_MOTION_BIBLE.md`, and the rig layout is in `RIG_ASSET_MAP.json`. The pack's own README is kept as `STARTER_README.md`.

**Status: v1.1, final silent cut.** Layla (coach) and Omar (coachee) are animated through connected joints. The animation is final, but three inputs are still pending: the narration, the live registration link (the end card says PREVIEW until it is set) and final detailed character layers (see "Character art").

## Outputs

| File | What it is |
| --- | --- |
| `out/assess-shift-intro-reels.mp4` | **Instagram/Facebook Reels**: 1080×1920, 30 fps, 2250 frames, 75.0 s, H.264 (CRF 16), no audio |
| `out/assess-shift-intro-linkedin.mp4` | **LinkedIn**: 1920×1080, 30 fps, 2250 frames, 75.0 s, H.264 (CRF 16), no audio, with its own layout |
| `out/conversation-study-silent.mp4` | The pack's 8 s conversation study, rebuilt on the ported rig: 1920×1080, 30 fps, 240 frames |
| `out/stills/*-storyboard.png` | Key frames from each intro |
| `out/stills/pose-sheet.png`, `writing-close-up.png`, `art-close-up.png` | Every acting pose, a close-up of pen-on-page contact, and a close-up of the character art |
| `out/studies/*.mp4` | The five graphic motion studies from the earlier pack |

## Commands

These are the commands used to produce the outputs above. Run them from this folder.

```bash
npm install
npm run typecheck
npm run check            # rig checks: determinism, joint limits, pen-tip contact
npm run studio           # live preview / scrubbing
npx remotion render src/index.ts IntroReels out/assess-shift-intro-reels.mp4 --crf=16 --browser-executable=$BROWSER_EXECUTABLE
npx remotion render src/index.ts IntroLinkedIn out/assess-shift-intro-linkedin.mp4 --crf=16 --browser-executable=$BROWSER_EXECUTABLE
npm run render           # -> out/conversation-study-silent.mp4
npx remotion still src/index.ts PoseSheet out/stills/pose-sheet.png --browser-executable=$BROWSER_EXECUTABLE
```

On this machine `BROWSER_EXECUTABLE` is `/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`. Elsewhere, drop the flag and let Remotion download its own browser. The pack's standalone renderer (`examples/render_character_study.py`) needs Inkscape, which is not installed here, so the study was rendered through Remotion instead. The pack's own `node examples/check_character_motion.mjs` passes.

## The characters: how they move

- **Rig.** `src/rig/Character.tsx` is a port of the pack's `examples/CharacterMotion.mjs`. It keeps the same group ids, pivots and paths: shoulder (±46,149) → elbow (0,88) → wrist (0,84), with the head pivoting at the neck, and pupils and eyelids inside the head.
- **What I added to the rig:**
  - both arms can be posed, not just one gesture arm per character
  - an arm can be drawn behind the torso, in front of it, or above the head, so it can cross the body (clasped hands, hand to chin)
  - nods, a brow lift and vertical gaze
  - a pen grip, with the pen drawn over the fingers
  - Omar's watch on his left wrist, and Layla's loafer buckles
  - light shading on the torso and cheeks
  - **v1.1 faces and hair, redrawn toward the model sheet:**
    - brown irises clipped inside the eye, with eyelid lines, creases and catchlights
    - neutral arched brows that lift with the `brow` channel
    - a shaded nose, real lips (Layla) and a lower lip under a connected mustache (Omar)
    - ear detail
    - Layla: fuller shoulder-length waves, side-parted, with locks framing the face
    - Omar: textured hair with faded sides and a full beard along the jaw
- **v1.1 motion polish:**
  - headlines reveal word by word (3-frame stagger; each word fully settled before it is read, and the layout never shifts)
  - a sub-1° idle head sway, out of phase between the two characters, so they never freeze between gestures (no body bobbing)
- **Acting engine** (`src/rig/acting.ts`). Every channel is keyframed with smoothstep holds and settles, as in the prototype, and blinks follow the prototype's 2-1-2 frame shape. Each gesture is gaze lead, then a 6-frame anticipation, the action (20–24 frames), a hold and a settle. The listener reacts 4+ frames later, usually with a nod. Feet never move, and there is no sliding of whole characters.
- **Writing.** I solved the arm angles with forward kinematics:
  - the notebook rests on Omar's screen-left palm and follows it
  - the pen tip lands on the right-hand page, and the wrist makes small strokes while the elbow stays put
  - `npm run check` verifies the tip is on the page in all 108 writing frames (it never comes closer than 14.5 rig units to the page edge)
  - a written line appears in the notebook with each stroke, and each line lands at the same moment as a plan milestone on screen
- **Not implemented** (from the pack's own list):
  - **Seated poses.** The six acting poses show the characters seated; the video keeps them standing, because there is no seated rig.
  - **Walking and lip sync.** Mouths stay still for the external narrator.
  - **Picking the notebook up.** The notebook and pen fade in as Omar's hand arrives; he isn't shown picking them up.

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
| 7–16 s | Omar | A new role? **A new direction?** | Omar's gaze moves card to card while his open hand presents the three options. Then the Income / Family / Experience chips appear. |
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
- `npm run check`: 4,500 pose-determinism and joint-limit checks, plus pen contact on every writing frame.
- Pose sheet and close-ups at full resolution: joints connected, hands clear of the body, the clasp and chin poses read clearly, and the pen sits on the page.
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
