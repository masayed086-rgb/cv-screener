# ASSESS SHIFT — Introduction film (editable project)

Career-coaching introduction film for **ASSESS SHIFT · Career Coaching · By ASSESS International**.
Vertical master 1080×1920 and a separately laid-out 1920×1080 version, 30 fps, nominal 75 s, English and Egyptian Arabic.

**Status: SILENT PREVIEW DRAFT.** Timings and captions are provisional, character art is placeholder, there is no voiceover or music, and the end card carries a PREVIEW label because no registration URL has been supplied. See *Production dependencies*.

## What is in the folder

| Path | What it holds |
|---|---|
| `config/brand.json` | Colour tokens, fonts, logo paths, **CTA URL**, **audio paths**, preview flags |
| `content/en.json`, `content/ar.json` | All on-screen copy and timed captions per language (`*word*` = burgundy emphasis) |
| `timing/scenes.json` | Scene ids, start/end seconds, fps, duration (`"provisional": true`) |
| `src/layout.js` | Per-format positions (vertical / landscape), safe areas, motif paths |
| `src/styles.css` | Type, card, caption and button styling |
| `src/film.js` | The film: builds the scenes and exposes `window.seek(t)` |
| `src/index.html` | Playable preview (scrubber, scene jump, format and language switches) |
| `storyboard.html` | Browser storyboard: two frames per scene + the captions that fall in it |
| `scripts/voiceover_en.md`, `scripts/voiceover_ar.md` | Separate recording scripts with scene windows and direction |
| `captions/*.provisional.vtt / .srt` | Caption files generated from `content/*.json` |
| `assets/` | Logo (crimson + white) and character layers in `assets/characters/` |
| `fonts/` | Local Quicksand and Noto Sans Arabic WOFF2 files (SIL OFL, licences included) |
| `tools/` | `render.mjs` (MP4 + stills), `captions.mjs`, `serve.mjs`, `storyboard_frames.py` |

## Why this workflow
No video framework was present in the repository. Instead of adding one, the film is a plain HTML page whose every frame is a pure function of time (`window.seek(t)`: no timers, no randomness, no CSS transitions). `tools/render.mjs` opens it in headless Chromium with **Playwright**, screenshots each frame at native size and pipes the frames to **ffmpeg** (H.264, yuv420p, CRF 18). That keeps text, tokens, timing and assets in editable files, renders deterministically, and needs only Playwright (tested with 1.56.1, the version installed here: `chromium.launch`, `page.goto`, `page.waitForFunction`, `page.evaluate`, `page.screenshot`) and ffmpeg.

## Commands

Requirements: Node 20+, ffmpeg on PATH, Python 3 + Pillow (only for storyboard thumbnails).

```bash
cd assess-shift-video
npm install                      # installs playwright (or a global playwright is used)
npx playwright install chromium  # first time only, if Chromium is not already installed

npm run preview                  # http://localhost:5173/  (storyboard)  and  /src/index.html (player)
npm run render:v:en              # out/vertical-en-silent.mp4   (~3 min)
npm run render:l:en              # out/landscape-en-silent.mp4
npm run render:v:ar              # out/vertical-ar-silent.mp4
npm run render:l:ar              # out/landscape-ar-silent.mp4
npm run stills:all               # out/stills/*.png + docs/storyboard/*.jpg for storyboard.html
npm run captions                 # captions/<lang>[.provisional].vtt and .srt

# a single scene or range while editing
node tools/render.mjs --format vertical --lang en --from 38 --to 51
```

Player URL parameters: `?format=vertical|landscape&lang=en|ar`.

## Editing
- **Copy:** edit `content/<lang>.json`. Captions must stay at two lines or fewer; check them in the player at the target format.
- **Branding:** colours and logo files in `config/brand.json`; the film reads them at load.
- **CTA:** set `config/brand.json → cta.url` to the live registration URL. The end card then shows it instead of the PREVIEW label. No QR code is generated.
- **Timing:** change scene windows in `timing/scenes.json`; animation beats inside a scene are relative to its start (in `src/film.js`).
- **Layout:** `src/layout.js`, one block per format. Arabic mirrors text and cards automatically; characters keep their side so faces and hair parts are never flipped.

## After recording (narrated final)
1. Record English and Arabic separately from `scripts/voiceover_*.md`. Do not rush the read to hit 75 s.
2. Put the reviewed files in `audio/` (for example `audio/vo_en.wav`), and a licensed music bed if supplied.
3. Re-time every caption in `content/<lang>.json` to the recording, adjust `timing/scenes.json` (duration may change), set `"provisional": false`, run `npm run captions`.
4. Set `config/brand.json → audio.voiceover.en` (and `music`) or pass `--vo audio/vo_en.wav --music audio/bed.wav`, then run the render. It writes `out/<format>-<lang>-final.mp4` with music at about 12% under the voice and loudness normalised to −16 LUFS.
5. Turn off `preview.watermark` once character art, timing and the CTA are final.

## Production dependencies (open)
1. **Character artwork.** `assets/characters/*.png` are cut from the supplied model sheet (1536×1024), upscaled 3× with the background keyed out. They are soft and keep some floor shadow and enclosed background. They are **placeholders, not production art**. Needed: approved, separately drawn layers for poses P01–P06 (P01 laptop, P03 reviewing a profile and P06 writing are approximated with the seated-with-notebook pose) and Samir in the brief's taupe shirt.
2. **Character brief conflict.** The supplied sheet labels Nour and Samir both as *coaches* and dresses Samir in a burgundy blazer. The written brief makes Nour the *client* and Samir the coach in a taupe shirt. The film follows the written brief for story roles and the sheet for appearance. Please confirm which is approved.
3. **Logo.** Extracted raster from the catalogue. Supply the approved vector master and confirm the ASSESS + SHIFT lockup.
4. **Registration URL.** None supplied, so the end card shows PREVIEW. The supplied registration HTML only shows a toast; real submission handling and the privacy wording must be connected and tested before the CTA goes live.
5. **Voiceover.** Not provided; none was synthesised. Captions and timing are provisional.
6. **Music.** None supplied; the draft is silent.
7. **Arabic copy review.** The on-screen labels other than the headline are proposed translations (listed in `scripts/voiceover_ar.md`).
8. **Body font.** Aptos is licensed and not bundled; Quicksand Medium is used for supporting copy.
9. **Chemistry Session details.** No price or duration is stated anywhere in the film, per the brief.

## Validation done on this draft
- Every scene previewed at 1080×1920 and 1920×1080 in both languages (`out/stills`, contact sheets). Checked for clipped text, caption length, overlap with the motif path, and Arabic right-to-left order with English product names isolated (`<bdi>`).
- Rendered MP4s probed with ffprobe for duration, resolution and frame rate (see the delivery notes).
- Not yet checked: real platform UI overlays (Reels/TikTok/Shorts buttons) against the 90/180/300 px margins, playback on a phone, and audio, because there is none yet.

## Content controls built in
Exact package names, assessments and session counts (2 / 4 / 6). No scores, testimonials or outcomes: the assessment cards are abstract lines, and the comparison shows criteria only. Nour makes the choice; Samir listens and helps compare. No job, salary, promotion, "perfect career" or ICF claims. The Chemistry Session is not called free and has no stated length. The plan, not a job offer, is the resolution.
