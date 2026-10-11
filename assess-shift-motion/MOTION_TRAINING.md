# Character motion exercises for Claude Code

Complete and review one exercise at a time. Use Layla as coach and Omar as coachee. Inspect current assets and choose a compatible renderer. The existing CharacterMotion.mjs is a working reference for connected joints and deterministic frame state.

| Exercise | Deliverable | Pass criteria |
| --- | --- | --- |
| 1 Rig integrity | Static neutral and gesture extreme frames | Shoulder, elbow and wrist stay connected; no hidden bitmap rig |
| 2 Listening | 3-second shot | Eye direction and one subtle reaction; fixed feet; no repetitive bobbing |
| 3 Open question | 3-second Layla gesture | Anticipation, shoulder/forearm rotation, readable open palm, hold and settle |
| 4 Response | 3-second Omar gesture | Clear intent, delayed turn-taking, quiet listener |
| 5 Compare cards | 4-second production-art shot | Gaze leads reach; visible grip; card follows hand after contact |
| 6 Write next step | 4-second seated shot | Notebook support and continuous pen-tip contact, modest wrist movement |
| 7 Pose transition | 2-second compatible transition | Constant proportions and eyeline; no seated-to-standing stretch |
| 8 Conversation | 8–12-second combined study | Readable turn-taking, purposeful holds, no simultaneous big gestures |
| 9 Scene continuity | Two short linked scenes | One card/path or attention target carries across the cut clearly |

Exercises 1–4 can start from the supplied vector prototype. Exercises 5–7 require the corresponding artwork and contact controls; do not treat them as implemented just because they are described. Prepare those layers first, then render.

Prompt for each exercise:

```text
Implement Exercise [number]. Explain the intention and write a frame schedule before animating. Use connected joint pivots and deterministic frame state. Preserve character identity and decision ownership. Inspect neutral, anticipation, action extreme, hold, settle and any prop contact. Render a silent clip and provide actual commands and outputs. Fix visible defects before moving to the next exercise.
```

Give feedback as a time range, character/body part, change and reason. Example: “At 1.5–2.0 seconds, Layla’s forearm opens before her gaze reaches Omar. Advance the gaze cue four frames and hold the open palm twelve frames longer.” Ask Claude to render the corrected section and record only accepted rules in MOTION_PLAYBOOK.md.

Use examples/MotionRecipes.tsx for supporting card staging, path drawing, scene continuity and camera depth. Those are graphic studies; they do not implement articulated characters and still require verification in a Remotion project.
