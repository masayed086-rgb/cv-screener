# Teach Claude Code your motion-graphics workflow

This expanded pack gives Claude Code a repeatable motion workflow for ASSESS SHIFT: eight controlled exercises, five editable Remotion studies, a more realistic coach reference, explicit scene roles and practical setup instructions. This is project guidance and iterative learning; it does not change Claude's model weights.

## Set up

1. Extract this folder into your video project. Keep `CLAUDE.md` in the project root. If you already have one, merge the relevant instructions rather than replacing existing project rules.
2. Open Claude Code in that project. Use `/context` to check that the instruction file loaded.
3. Add your approved logo, separate coach pose assets, fonts and any licensed voiceover/music. The included brand brief and character document are references. They are not a finished character rig.
4. For close visual matching, add a rights-cleared reference clip or 6–10 representative frames in `references/`. Include opening, character, text, explanatory graphic, transition and end-card examples. Frames establish composition; a clip is needed to study motion and sound.
5. Start with HOW_TO_USE.md. Review motion studies and the 12-second result before requesting the full introduction video.

## First task to paste into Claude Code

```text
Read CLAUDE.md and the documents it names. I want a repeatable motion-graphics workflow inspired by the UpSend reference, adapted to ASSESS SHIFT career coaching.

Start with Exercises 1 and 2 in MOTION_TRAINING.md, then integrate reviewed motion into the 12-second practice in PRACTICE_BRIEF.md. Inspect the repository, available references and current brand/character materials. Read CHARACTER_ROLES.md and CHARACTER_APPEARANCE.md. Record observed reference details separately from proposed creative choices. Do not claim to have watched a reference you cannot access.

Use the existing rendering framework, or propose Remotion for a new code-based project and verify its current official documentation. Create a scene plan, key-frame previews, editable source and a silent MP4 if rendering is available. Both Samir and Nour must appear as equally capable coaches. Use placeholders transparently if separate pose artwork is missing.

Preview and check the result. Give me actual preview/render commands, the outputs, and a short list of decisions for review. Continue through a concrete draft without stopping for routine implementation choices. Do not expand into the full 75-second video yet.
```

## Teach through specific corrections

Give feedback with a time range, an element, a change and a reason. For example:

> At 3.0–4.0 seconds, the cards enter too quickly. Change the entry from 8 frames to 16 frames and keep the headline still for two seconds so it is easier to read.

Then ask:

```text
Apply this correction, render the affected sequence, and inspect it. Record the accepted rule in MOTION_PLAYBOOK.md, with its scope and a link to the revised example. Keep CLAUDE.md concise. Do not turn a one-scene exception into a global rule.
```

After the practice is approved:

```text
Use our approved practice composition and motion rules to build the full ASSESS SHIFT introduction from brand/ASSESS_SHIFT_Claude_Code_Brief.md. Start with the provisional 75-second vertical version at 1080x1920 and 30 fps. Reflow the landscape version separately. Keep final narration and caption timing dependent on the actual voiceover. Render and inspect a concrete draft.
```

## What is included

| File | Purpose |
| --- | --- |
| CLAUDE.md | Concise persistent instructions for Claude Code |
| MOTION_PLAYBOOK.md | Proposed motion settings, review criteria and correction log |
| PRACTICE_BRIEF.md | A 12-second exercise with both coaches |
| REFERENCE_NOTES.md | Evidence limits, observation worksheet and sources |
| MOTION_TRAINING.md | Eight motion exercises with concrete prompts and pass criteria |
| HOW_TO_USE.md | Session-by-session workflow and example integration commands |
| CHARACTER_ROLES.md | Each coach's role, actions, screen balance and frame ranges |
| CHARACTER_APPEARANCE.md | Realistic appearance, asset preparation and safe animation methods |
| examples/MotionRecipes.tsx | Five editable Remotion graphic studies |
| brand/Realistic_Coach_Reference.png | Updated natural photographic character board |
| brand/ASSESS_SHIFT_Realistic_Coaches.svg | Self-contained SVG containing the same character board |
| brand/Character_Image_Prompt.txt | Prompt used to update the reference with the built-in image tool |
| brand/ASSESS_SHIFT_Claude_Code_Brief.md | Existing service, brand, character and script brief |
| brand/ASSESS_SHIFT_Brand_Character_Sheet.docx | Existing illustrated character and brand document |

No video has been rendered as part of this instruction pack. The source examples were reviewed, but Remotion is unavailable here, so compilation and export remain to be verified in your project. The combined board is a reference; separate pose assets, narration and CTA assets still need to be available for production.

## Why this works

Claude Code reads a project CLAUDE.md as persistent context. Specific rules, approved working examples and repeated render reviews make the workflow easier to reproduce. Instructions are guidance, not guaranteed enforcement, so inspect each export.

Sources: [Claude Code memory documentation](https://code.claude.com/docs/en/memory), [Remotion fundamentals](https://www.remotion.dev/docs/the-fundamentals), [creator's UpSend case study](https://www.whatastory.agency/case-study/upsend).

## SVG character reference

The updated SVG is included in `brand/ASSESS_SHIFT_Realistic_Coaches.svg`. It embeds the original realistic PNG, so it opens without an external image file. It preserves the artwork but does not provide editable vector body parts, unlimited detail at higher magnification or an animation rig. Use it as a character reference or a single image layer. For pose changes, use the separate transparent assets described in CHARACTER_APPEARANCE.md.
