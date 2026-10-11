# How to use the expanded pack in Claude Code

## Prepare the project

Extract the folder into the video project's root. Merge CLAUDE.md if one already exists. Keep the `brand/`, `examples/` and documentation folders beside it. Add approved logo files, transparent character poses, fonts and reviewed audio when available.

Open Claude Code in that directory. Use `/context` to confirm the project instructions loaded. Use `/memory` to inspect persistent instructions and notes. CLAUDE.md is context, not model-weight training or guaranteed enforcement.

If you are using Claude's chat interface rather than Claude Code, upload the relevant markdown files and image, then paste the task prompt. Executing and rendering the code needs an environment with the project and dependencies; do not assume chat can run the local project.

## Session 1 Teach the motion vocabulary

```text
Read CLAUDE.md, MOTION_TRAINING.md, MOTION_PLAYBOOK.md and the current brand references. Inspect the existing project and video framework. Start with Exercises 1 and 2. Build concrete A/B motion studies with one variable changed. Create editable source, preview frames, and silent renders if rendering is available. Inspect the actual outputs and document results. Keep reference observations separate from proposals. Use labelled placeholders where production assets are missing.
```

Review the studies. Ask for a specific change and retain the accepted example. Then repeat with Exercises 3–6. Work on Exercises 7–8 when the appropriate coach assets and voiceover are available.

## Session 2 Prepare realistic coach assets

```text
Read CHARACTER_APPEARANCE.md and inspect brand/Realistic_Coach_Reference.png. Inventory the separate pose files needed for CHARACTER_ROLES.md. If an image-generation tool is connected, create identity-consistent transparent assets using the documented prompt. Otherwise create an asset manifest and clearly labelled placeholders, then build the composition around the planned poses. Do not claim the combined board is a rig. Keep the coaches realistic and use a single external narrator in the first version.
```

Check faces, hands, body scale and lighting across the pose set before character motion review.

## Session 3 Build the practice

```text
Use the reviewed motion studies, realistic coach assets and CHARACTER_ROLES.md to build the 12-second practice. Produce a timeline, key frames, editable source and a silent render. Follow PRACTICE_BRIEF.md. Keep both coaches equally capable. Check phone-size text, transition boundaries, character continuity and deterministic seeking. Record accepted rules only after review.
```

## Session 4 Build the full video

```text
Build the full introduction using the current brand brief and CHARACTER_ROLES.md. Use the provisional 75-second plan at 1080x1920, 30 fps, then reflow the landscape version. Reuse accepted motion patterns selectively. Align final scene and caption timing to supplied voiceover. Preserve service facts and client decision ownership. Deliver an inspected draft, editable source, actual commands and specific missing production assets.
```

## Use the code examples

The pack includes a TypeScript/React file with five Remotion compositions: easing comparison, card staging, path drawing, card continuity and camera depth. The recipes demonstrate graphics; they do not implement photographic character articulation.

Ask Claude to copy `examples/MotionRecipes.tsx` into your existing Remotion source directory and import `MotionRecipeCompositions` into the project's existing registered root. Add `<MotionRecipeCompositions />` alongside existing compositions. Do not overwrite registration or delete existing compositions.

In a configured Remotion project, these are intended CLI commands, to be verified against that project's actual entry point and installed version:

```bash
npx remotion studio
npx remotion render src/index.ts EasingStudy out/easing-study.mp4
npx remotion render src/index.ts CardStaging out/card-staging.mp4
npx remotion render src/index.ts PathDrawing out/path-drawing.mp4
npx remotion render src/index.ts CardContinuity out/card-continuity.mp4
npx remotion render src/index.ts CameraDepth out/camera-depth.mp4
```

`src/index.ts` is an example entry path; use the actual project's registered entry file. The source examples were reviewed here, but compilation and rendering were not run because Remotion is unavailable in this environment. A new project must first be scaffolded and configured with compatible React, TypeScript, Remotion and CLI dependencies. Ask Claude to use current official setup documentation and the project's package manager.

## Save learning accurately

Ask Claude to record accepted global rules in MOTION_PLAYBOOK.md, scene exceptions in the scene notes, and working build commands in the project README. Keep CLAUDE.md concise. Use accepted render examples as comparison references on the next task.

Sources: [Claude Code memory](https://code.claude.com/docs/en/memory), [Remotion fundamentals](https://www.remotion.dev/docs/the-fundamentals), [Remotion render CLI](https://www.remotion.dev/docs/cli/render).

## Included SVG

`brand/ASSESS_SHIFT_Realistic_Coaches.svg` contains the complete realistic reference sheet as an embedded PNG. Claude can use it as an image/reference layer; it cannot manipulate individual arms, faces or poses as vector paths. Keep separate pose PNGs or prepared rigs for character animation.
