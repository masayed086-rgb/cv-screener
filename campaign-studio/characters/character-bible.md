# Coach and coachee | Character bible

These are fictional campaign characters, not portraits of Mahmoud or real clients. The coach/coachee roles apply to this initial pair; they are not gender rules for later campaign casting.

## Identity locks
| Property | coach-01 | coachee-01 |
|---|---|---|
| Role | Reflective partner | Professional exploring a choice |
| Appearance | Middle Eastern woman, early 40s | Middle Eastern man, early 30s |
| Face | Almond eyes, expressive brows, attentive smile | Curly dark hair, neat beard, thoughtful brows |
| Hair | Shoulder-length dark wavy bob | Short dark curls |
| Wardrobe | Navy blazer, teal top, ivory wide-leg trousers, dark loafers | Amber overshirt, ivory tee, navy trousers, dark sneakers |
| Accessories | Small gold earrings | Simple watch |
| Signature gesture | Open hand at chest or waist height | Notebook reflection; points to chosen path |
| Emotional range | Attentive, curious, quietly confident | Uncertain, reflective, resolved |

Equal dignity, eye-level conversations. Stable facial proportions, hairstyle silhouette, clothing length, body proportions and skin tone across shots. Use the reference sheet as the visual master; avoid turning the coachee into a passive person rescued by the coach.

## Required production asset set (not yet supplied)
For EACH character: front and 3/4 standing, side and back standing, 3/4 sitting; six face expressions; open/closed eyelids; separate mouth shapes if dialogue requires lip sync; six hand poses. Produce a small camera-turn test before using multi-view interpolation.

Build an SVG rig with named groups or an equivalent layered source: root, pelvis, torso, neck, head, hair-back, hair-front, brow-L/R, eye-L/R, eyelid-L/R, mouth, upper-arm-L/R, forearm-L/R, hand-L/R, thigh-L/R, shin-L/R, foot-L/R, wardrobe-front, accessories. All parts are in one consistent coordinate system, with documented local pivot coordinates. Provide filled and whiteboard variants sharing landmark positions. Screen-left/right labels must be explicit; do not silently flip asymmetric details.

Head pivots near base of neck; shoulders at arm insertion; elbows and wrists on their anatomical joint centers. Hips, knees, ankles remain stable. Keep hands separate and fingers readable. Avoid visible gaps at joints through appropriate overlaps and layer ordering.

## Believable acting rules
1. Eye focus changes first, then head, then torso/hand. The whole figure does not move as one card.
2. Listening: quiet breath, slight body lean, occasional one-time nod and blinks. A blink schedule can be authored at irregular fixed times (e.g., 1.2, 4.8, 8.1 s), not randomized each frame.
3. Question: 0.12 s anticipation, 0.35 s outward arm movement, 0.22 s settle; pause, then relax. These are starting values, adjust to the performance.
4. Reflection: eyes drift toward notebook, head lowers slightly, hand touches chin once; give the thought space. Avoid constant nodding and bobbing.
5. Decision: coachee raises gaze, turns toward choice, points; coach acknowledges. The coachee initiates the next step.
6. Mouth: for narrated scenes use expressive closed-mouth acting. For speaking close-ups use timed audio-aligned visemes; an arbitrary open-close loop is not lip sync.
7. Seated figures: preserve seat contact and foot placement. Do not make chairs float or legs slide through the table.
8. Gentle silhouette changes carry the emotion. Start with rotation limits of head +/-6 degrees, torso +/-3 degrees. Larger gestures need intentional key poses.

## Whiteboard adaptation
Keep head, hair, wardrobe, beard and proportions recognizable. Remove shading/hatching and microdetail. Use round navy strokes with ivory ground, small teal/amber accents. Order paths: silhouette -> face -> clothing -> gesture -> relevant prop -> chosen route. Use true SVG path reveals. Raster versions are look references only.

## Acceptance before a full reel
Deliver layered source, pivot manifest, flat hero frames, silhouette test at thumbnail size, and a 5-second gesture test. Check joint continuity, face consistency, hand anatomy and natural movement in real-time playback. Do not say “animation ready” just because the PNG sheet looks polished.
