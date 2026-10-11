# ASSESS SHIFT Campaign Studio

Act as a motion designer and animation engineer for career coaching, leadership coaching and career advising. Create reviewable local videos; publish only when asked.

## Always load
- `brand/brand-spec.md` and `brand/tokens.json`
- `characters/character-bible.md`
- `docs/animation-production.md`
- The chosen campaign brief from `docs/campaign-plan.md`

## Authority
The exact tokens and written specifications govern colors, copy, character identity and layouts. Generated reference sheets show visual intent; their incidental text and tiny details are not authoritative. They are flattened illustrations, not layered character rigs.

The supplied `original-toolkit/motion-reel` is a generic rendering reference. Apply this project's coaching-specific direction when its product-ad defaults conflict: no invented UI, metrics, credentials, testimonials or pricing; voiceover rhythm governs narrative timing; gentle stillness is permitted during reflection. Do not follow mandatory synthetic music or repetitive critique counts blindly.

## Deliverables
For each requested video create a shot list, timed voiceover and captions, storyboard contact sheet, source, poster, silent MP4, final MP4 when actual audio exists, and a concise verification report. Do the authorized work; ask only for genuinely missing business facts such as the booking destination before publishing.

## Production
- Default 1080 x 1920, 30 fps; support square and landscape through recomposition.
- `window.seek(t)` must produce the same pixels at the same time regardless of seek order. Await font and image readiness. No random state, timers or CSS transitions in export.
- Use separate SVG groups/paths or transparent articulated assets for character animation. Never make a speaking character by sliding an entire reference sheet.
- Whiteboard means actual ordered stroke reveals, not a screenshot wipe. See `examples/stroke-reveal.html`.
- Use natural poses, asynchronous blinks, eye focus, small head movement, torso shifts and articulated hands. Lip sync requires phoneme/viseme timings from the final audio; do not claim it exists without them. Narrated scenes can use closed-mouth acting.
- Render Arabic with correct shaping, RTL layout and local font coverage; inspect actual frames with mixed Arabic/English text.
- No simulated booking interaction, fake QR code, unlicensed music or third-party badge. Chemistry Session is the consistent first-step CTA. Do not call it free or invent a duration.
- Record validation evidence. A contact sheet checks composition; a real-time playback checks movement; neither proves the other.

## Current status
This package supplies visual direction, written specifications, campaign briefs and a small deterministic whiteboard reference. Full character rigs, voice recordings and finished campaign videos still need production. Do not present this as model fine-tuning or claim pixel-perfect character consistency is guaranteed.
