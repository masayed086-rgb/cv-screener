# Two video styles, one identity

## Motion graphic production
Use character performance, composition and typography together. Build around a situation, an exploratory question, a visible choice and a modest next action. Permit 2-4 second visual developments but do not replace reflective moments with constant transitions. A person thinking can be active through gaze and posture.

Use a single deterministic timeline for character transforms, text, path geometry and audio cues. Every property is derived from absolute time. A live preview may use requestAnimationFrame to call seek; export must stop that loop and call seek directly. Test frames at 0, 1, 3 and 7 seconds in forward and reverse order and compare pixels.

## Real whiteboard production
An SVG path draws through `stroke-dasharray=L` and `stroke-dashoffset=L*(1-progress)` where L is `getTotalLength()`. Sequence individually authored paths with a path ID, start and duration. The entire scene must recompute every reveal and fill at every seek. Avoid one giant wipe over the final PNG.
Filled accents appear after their outlines. Text reveals by word or whole shaped line, not individual Arabic letters. Show a pen tip only when it follows the actual path endpoint; a floating hand disconnected from the line is worse than no hand.
Use ordered path clusters for character silhouettes and props. Do not autotrace the raster sheet into thousands of noisy paths and call that a rig. Rebuild selectively with human-readable paths and keep the reference beside the drawing.

## Rendering and audio
The supplied renderer is a useful prototype. Before long exports, check FFmpeg exit codes, catch input pipe failures, close browser in a finally block, expose configurable dimensions and await `window.ready` plus fonts. It hardcodes portrait dimensions and does not by itself prove square/landscape support. Its SFX script creates short audio extending only beyond the last cue: do not use `-shortest` to combine that with a longer video unless audio has first been padded to the intended duration. It may otherwise cut the ending.
For the first prototype use 30 fps, sub=1. Optional motion blur can follow after verifying quality and FFmpeg filters. Recompose each aspect ratio; do not stretch or blindly crop portrait frames.
Use actual final VO timing for captions and shot lengths. Suggested audio finishing target: around -16 to -14 LUFS integrated and <= -1.5 dBTP. Measure the actual output. Keep music subdued under speech; obtain licensed music or leave it absent. Synthetic effects are not a substitute for a warm human voice.

## QA evidence
- Accurate service and CTA, no unconfirmed claims.
- Hero faces, clothing, skin tone and body shape consistent.
- Natural articulated movement; no joint gaps or sliding feet.
- Actual path drawing for whiteboard scenes.
- Text legible at 360-pixel portrait preview; Arabic joins/RTL intact.
- No missing glyphs, image loading errors or export console failures.
- Final frame includes readable end card; video duration matches timeline.
- Audio/VO/subtitles synchronized, no silent tail accidentally cut.
- Inspect a contact sheet and complete real-time playback. Fix observed defects and repeat only affected checks.

For final publishing, obtain the actual booking URL and current placement requirements. A missing destination does not prevent making a reviewable end card without a QR code.
