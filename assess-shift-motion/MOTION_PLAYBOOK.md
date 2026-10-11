# Motion playbook — proposed ASSESS SHIFT adaptation

All numbers below are starting settings for our campaign. They are not measured timings or easing values from the linked video. Review them against an accessible clip and the rendered practice.

## Creative direction

Use clear 2D illustrations, option cards, abstract assessment insights and a recurring burgundy path. Establish a question, show exploration, then clarify the next step. Design illustrations and typography together. Keep professional warmth and the viewer's decision ownership.

The reference creator documents a script → storyboard → visual style → design → voiceover → animation → sound workflow. Adopt that sequence. Establish narration timing before polishing a narrated final.

## Motion settings at 30 fps

| Element | Proposed starting rule | Review criterion |
| --- | --- | --- |
| Heading entry | Opacity 0→1, translate Y 16→0 px over 10–14 frames | Settles before the main message is read |
| Card entry | Translate 40–60 px over 14–18 frames, ease out | Clear direction, no abrupt stop |
| Related cards | Stagger by 3–5 frames | Group is readable; entry feels connected |
| Coach entrance | 14–18 frame fade/short translation | Professional, restrained presence |
| Card emphasis | Border/colour change, optional scale 1→1.03→1 | Highlights a choice without implying guaranteed fit |
| Path draw | Reveal stroke over 20–30 frames | Visually connects the relevant cards |
| Scene transition | 10–16 frames; carry a shared shape or position | Viewer can follow the relationship |
| End card | At least 3 seconds with stable CTA | Action and destination readable |

Use a cubic ease out, such as cubic-bezier(0.22, 1, 0.36, 1), as a proposed translation default. Implement it using the rendering framework's deterministic easing API. For springs, tune the visible result to settle with minimal overshoot; do not add bounce to every element.

Numbers assume a 1080-pixel short edge. Scale offsets sensibly across formats; adapt the layout rather than stretching the scene.

## Choreography

- Establish the focal object, animate its supporting objects, then reveal the explanatory text.
- Give important text a stable reading hold; narration and real preview readability determine its duration.
- Animate the career path only when it shows exploration or a next step.
- Treat comparable options equally before emphasizing one for discussion.
- Let cards travel into a comparison layout rather than making unrelated objects disappear and reappear.
- Keep camera movement subtle. Preserve a stationary reading area.
- Use one dominant transition per scene. Avoid decorative effects that interrupt the explanation.

## Characters

Samir and Nour share prominence, visual scale and authority. Each can ask questions, introduce insight cards and help compare options. Preserve identity from the character sheet. Use matched pose sets and consistent line weight.

For the practice, both remain visible across the sequence. If a full-video scene features one coach, balance presentation roles over the whole video. Do not assign one coach all the expert actions and the other only passive reactions.

## Voice, captions and sound

- Silent practice must communicate through text and visuals.
- When voiceover is supplied, align scene events to meaningful phrases. Adjust the timeline to the recording rather than forcing speech into arbitrary cuts.
- Create caption timing from the real recording; label provisional captions as provisional.
- Add restrained licensed sound cues to meaningful card or transition events. Check that they do not mask speech.
- Check the complete mix by listening. Do not declare audio quality from waveform values alone.

## Review each draft

| Check | Pass condition |
| --- | --- |
| Comprehension | A viewer can explain the scene's one main message |
| Text | Readable at phone viewing size; no clipping; enough hold time |
| Composition | Clear focal point; consistent spacing; character and text stay inside margins |
| Continuity | Coaches retain face, hair, skin tone, clothing and adult proportions |
| Motion | Related elements move coherently; no unexpected pop, jitter or excessive overshoot |
| Reproducibility | Seeking/rendering the same frame produces the same visual state |
| Claims | No invented scores, guarantee, price, accreditation or client story |
| Export | Actual file opens; correct duration, resolution, frame rate and audio state |

Inspect boundary frames, intermediate motion frames and the complete playback. Still frames alone cannot validate motion or audio.

## Accepted correction log

Fill only after a reviewer accepts a change. Preserve exceptions explicitly.

| Date | Scene/time | Correction | Scope | Approved example |
| --- | --- | --- | --- | --- |
| Pending | Practice | No corrections reviewed yet | — | — |
