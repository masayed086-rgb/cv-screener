# Character motion bible

Animate intent through anatomy. In each shot define what the person wants, what they look at, what changes and what the other person notices. Layla makes space for reflection; Omar takes an active part in the decision. A gesture must carry one readable idea.

## Physical construction

Use joint-based parenting, with each forearm following its upper arm and each hand following its forearm. The shoulder pivot belongs near the arm socket, elbow at the bend and wrist at the hand base. Draw overlapping shapes at joints to avoid gaps. Rotating a complete character layer cannot replace an elbow bend. Read RIG_ASSET_MAP.json for the working SVG study’s actual local coordinates.

The provided SVGs contain editable paths and groups, not embedded character bitmaps. The frame source generates transforms from a deterministic pose function. The simplified study has fixed legs and does not solve inverse kinematics or foot placement for walking. Use a suitable rig and contact constraints before adding locomotion. Do not stretch the body to fake a seated pose.

## Timing at 30 fps

These are proposed starting ranges, not measurements from the linked tutorial.

| Action | Starting range | Purpose |
| --- | --- | --- |
| Gaze lead | 3–5 frames before head/hand | Establish attention |
| Anticipation | 6–10 frames | Prepare a meaningful action |
| Small main gesture | 16–24 frames | Make the intention readable |
| Meaningful hold | 24–45 frames | Let the audience understand |
| Settle | 10–16 frames | Return naturally without a snap |
| Listener response delay | 4–8 frames | Allow one person to finish the cue |
| Blink | Roughly 4–6 frames | Close, brief hold, reopen |

Use different timings when the intention or audio requires it. Smoothstep interpolation in the prototype eases joint movement into and out of a hold. No numerical range guarantees natural acting: inspect the whole body and the listener together.

## Conversational actions

**Listen.** Keep an open posture and eye line toward the speaker. Use a brief glance or small nod at a meaningful moment. Avoid constant bobbing and synchronized blinks. A head tilt should not detach the neck.

**Ask.** Start with a gaze cue, then a small shoulder preparation. Let the forearm open and the palm invite a response. Hold the useful pose, then lower it. Keep the other hand quiet. A finger pointed toward the client changes the tone; prefer an open palm.

**Respond.** Omar raises a restrained explanatory hand while Layla listens. His head and gaze stay related to the conversation. Do not make both characters perform large gestures simultaneously. The prototype staggers their actions.

**Compare.** Use two equally weighted cards or a fixed comparison surface. Gaze lands on a card before the hand approaches. The hand closes onto the correct edge; the card follows the gripping hand after contact. Track contact every frame. Maintain equal option prominence until a justified choice is shown.

**Write.** Prepare a separate seated production pose. One hand supports the notebook; the pen tip remains on its page through short strokes. Move the fingers/wrist modestly, keep the elbow stable and allow a small head-down angle. Do not wiggle an entire arm or make the pen float. The provided study does not implement writing.

**Close.** Both settle. Omar’s response is quietly confident, with no exaggerated transformation or guaranteed outcome. Hold the CTA independently of any character gesture.

## Secondary motion

Use small head turns and eye direction before adding hair or sleeve follow-through. Layer secondary motion after the main action and inspect for collision. Keep feet anchored in a standing conversation. Breathing, if added to a torso, must not make the shoes slide or head inflate. The supplied study deliberately avoids root bobbing.

## Actual study timing

| Study frames | Event |
| --- | --- |
| 0–35 | Establish attention; subtle gaze shift |
| 28–40 | Layla’s arm anticipates the question |
| 36–65 | Layla opens shoulder, elbow and wrist |
| 65–106 | Hold invitation; small head movement and blink |
| 106–134 | Layla settles |
| 134–147 | Omar prepares a response |
| 142–174 | Omar raises his explanatory hand |
| 174–208 | Hold response; Layla reacts subtly |
| 208–239 | Omar settles; closing blink |

Overlapping ranges are intentional: preparation overlaps the start of the main action. The SVG study uses screen-left/right suffixes. Frame 0 and 239 are distinct timing positions, not a seamless loop.

## Review gate

Render and inspect start, anticipation, main extremes, hand swaps, hold, return and blink closure. Check that shoulders and elbows connect, hands clear the body, feet stay fixed, gaze follows intent and text does not become obstructed. If a PNG reference, prototype vector or missing rig is used, label its status honestly. Record accepted corrections in MOTION_PLAYBOOK.md after reviewing the changed render.
