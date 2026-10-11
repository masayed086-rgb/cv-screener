# Use the new character motion pack

## Review the visual direction

Open the new model sheet and six acting key poses in brand/. Layla is the coach; Omar is the coachee. Watch preview/Character_Motion_Study.mp4. It demonstrates the mechanism with simpler vector art.

## Give Claude persistent project context

Place CLAUDE.md in the project root, merging existing instructions. Ask Claude to read it and the referenced files, then inspect the actual SVG groups and source. Use the starter prompt in README.md. This is project guidance and iteration, not model-weight training.

## Run the supplied working example

Requirements: Node.js, Python 3, Inkscape and FFmpeg on PATH. Run from this folder:

```bash
node examples/check_character_motion.mjs
python3 examples/render_character_study.py
```

The render script writes 240 SVG frames, rasterizes them at 1920 × 1080 and creates preview/Character_Motion_Study.mp4 at 30 fps. It also regenerates the neutral vector rigs. The source does not require Remotion or npm dependencies. Rendering may take a few minutes.

In a Remotion project, the poseAt(frame, character) and characterSVG(character, frame) exports can be evaluated using the current frame. The returned SVG markup can be placed inside a locally rendered SVG element. Verify integration against the current official documentation, keep font assets local and inspect the exported result. The included standalone renderer is the verified route; no Remotion compilation is claimed here.

## Build toward the full campaign

Review Exercises 1–4, then prepare matching final art for seated acting and props. Review comparison and writing contact before combining the sequence. Use character_scene_roles.json for the provisional 75-second timeline. Add the actual reviewed voiceover from voiceover/ and remap each spoken phrase to a scene. Generate captions from that recording, then hold the end CTA for at least three seconds.

Supply the approved logo, approved font files, live registration destination and any licensed music. Adapt vertical and landscape layouts separately. Ask for the actual MP4, source, render commands and a concise dependency list. Do not accept a slideshow as completion of an articulated character action.
