# ASSESS SHIFT coach and coachee motion pack

This update replaces the previous cast with Layla, the coach, and Omar, the coachee. It includes a detailed character model sheet, six conversational key poses, editable articulated vector prototypes, a rendered eight-second silent study and specific instructions for teaching Claude Code the workflow.

## Start here

1. Extract this folder into your video project. Merge CLAUDE.md with existing project rules.
2. Open brand/Coach_Coachee_Model_Sheet.png and brand/Conversation_Key_Poses.png.
3. Watch preview/Character_Motion_Study.mp4. It uses a simpler vector redraw to demonstrate connected arm joints, head movement, gaze and blinks. It is a movement prototype, not the finished detailed illustration.
4. Read HOW_TO_USE.md and paste the starter prompt below into Claude Code.

```text
Read CLAUDE.md and the files it names. Use Layla as the coach and Omar as the coachee. Inspect the new model and acting sheets, the SVG rigs, RIG_ASSET_MAP.json and the eight-second motion study.

First reproduce the working conversation study with deterministic frame-based movement and connected joints. Then build and review listening, an open question and a response. Keep feet planted, gaze intentional and the listener’s reaction delayed. Use the detailed model sheet as the final appearance target; clearly identify the simplified rig study as prototype art.

Prepare and inspect matching layers for seated poses and prop handling before implementing comparison or writing. Use an existing renderer or verify current official Remotion documentation. Give me a rendered silent draft, editable source, actual commands and a concise list of remaining production dependencies. Continue through a concrete reviewable draft.
```

## Included assets

| Asset | Use |
| --- | --- |
| brand/Coach_Coachee_Model_Sheet.png | Detailed views, expressions and seated references |
| brand/Conversation_Key_Poses.png | Six distinct coaching interaction poses |
| brand/Layla_Rig.svg and Omar_Rig.svg | Editable vector groups and joint hierarchy for the study |
| brand/ASSESS_SHIFT_Coach_Coachee.svg | Combined vector study frame, with original paths |
| preview/Character_Motion_Study.mp4 | Checked 1920 × 1080, 30 fps, eight-second silent study |
| examples/CharacterMotion.mjs | Runnable source for the SVG characters and animation |
| examples/check_character_motion.mjs | Determinism, geometry and frame-state checks |
| examples/render_character_study.py | Reproducible Inkscape and FFmpeg export |
| CHARACTER_MOTION_BIBLE.md | Performance, joint movement and timing rules |
| RIG_ASSET_MAP.json | SVG IDs, pivots, parenting and implementation limits |
| CHARACTER_ROLES.md and character_scene_roles.json | Responsibilities and provisional 75-second timeline |
| MOTION_TRAINING.md and MOTION_PLAYBOOK.md | Character exercises and review criteria |
| brand/ASSESS_SHIFT_Brand_Character_Sheet.docx | Updated brand, character, acting and storyboard document |
| brand/ASSESS_SHIFT_Claude_Code_Brief.md | Complete campaign brief and scripts |
| voiceover/ | Existing English and Arabic TTS scripts and updated ElevenLabs guide |
| examples/MotionRecipes.tsx | Five supporting graphic studies from the earlier pack |

The detailed PNG illustrations are references, not layered production rigs. The vector study does not implement seated poses, prop contact, writing, walking, lip sync, narration or the full introduction. The older Remotion graphic studies remain source examples; they have not been compiled here. Final narration, approved logo, font files and live CTA destination remain production inputs.
