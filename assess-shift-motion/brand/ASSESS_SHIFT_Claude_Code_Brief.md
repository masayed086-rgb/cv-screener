# ASSESS SHIFT Claude Code Video Brief

Paste the following prompt into Claude Code after placing this file and the supplied materials in the project folder.

## Prompt

Build an editable introduction-video project for ASSESS SHIFT career coaching by ASSESS International. Use the attached catalogue, registration HTML and the brand and character specification below. These source files define the service. The creative direction below defines the campaign treatment. Preserve service facts and keep proposals distinct from existing facts.

Work autonomously on reversible implementation choices. First inspect the project, its instructions, installed tools and available assets. Prefer an existing video framework or rendering setup. If starting fresh, choose an appropriate code-based motion-graphics workflow, explain the choice in the README and verify its current official documentation before relying on an API. Avoid installing unnecessary dependencies.

Deliver a complete editable project, a browser-viewable storyboard or scene preview, a rendered silent draft if rendering is available, separate English and Egyptian Arabic scripts, scene timing data and a README with actual preview and export commands. Render the narrated final only when a reviewed voiceover asset is available. Do not claim that an MP4 was produced unless it exists and has been checked.

Production targets:
- Vertical master 1080x1920, 30 fps, nominal duration 75 seconds.
- Independently adapted 1920x1080 version with reflowed layout, not stretched artwork.
- Separate English and Arabic versions. English is the initial implementation language.
- Keep editable text, styling tokens, assets and scene timing in separate files.
- Make branding, CTA text, CTA URL and audio paths configurable.
- The final voiceover determines scene timing. A silent preview may use the provisional storyboard timings. Do not generate a fake voice asset or pretend to provide recorded narration.
- Use readable captions, no more than two lines, tied to narration. Create timed SRT or VTT files from verified narration timing when narration is available. Before then, mark timing as provisional.
- Use local font files and assets for reproducible export. Fall back transparently when licensed fonts are absent.
- Keep key content within the proposed composition margins, then validate with the intended platform interface.
- Use purposeful character gestures, restrained supporting graphic movement and a music bed only if licensed audio is supplied.

Character implementation:
- Layla is the female coach and Omar is the male coachee. Use the new model and acting sheets; they replace the previous cast.
- Preserve mature proportions, face, hair, complexion and wardrobe. Keep decision ownership with Omar.
- Read CHARACTER_MOTION_BIBLE.md, RIG_ASSET_MAP.json and CHARACTER_ROLES.md before animation.
- Inspect the working SVG rig study and CharacterMotion.mjs. It is a simpler vector redraw, not the finished detailed character design.
- Animate connected upper-arm, forearm and hand segments from joint pivots. Use eye direction, head turns and subtle blinks. Do not substitute whole-image sliding for a gesture.
- Prepare matching final layers for the detailed illustration. The PNG sheets are visual references, not rigs. Clearly identify any prototype artwork.
- One external narrator; no simulated lip sync. Writing and prop handling require checked hand-to-prop contact and their own reviewed poses.
- Build the eight-second conversation study first, inspect every important pose, then build the provisional full introduction.

Content controls:
- Maintain the exact package names and facts below. Personality is included only in Career Direction and Career Transformation, with different assessment products.
- Do not claim recruitment, guaranteed employment, a salary increase, a promotion, one perfect career or ICF accreditation.
- Do not invent assessment scores, testimonials, client cases or outcomes.
- Use abstract assessment cards and fictional illustrations.
- CTA: Start with a Chemistry Session. Submit your registration request.
- Use a visible configurable registration URL only when supplied. Until then, label the end card PREVIEW and keep the missing URL as a documented production dependency.
- Never encode a placeholder booking QR as if it were a real destination.
- The supplied HTML is a concept form: it currently only shows a toast. Do not promise successful registration until real submission handling has been connected and tested.
- Do not call the Chemistry Session free or assign its length without confirmation.

Validation:
Preview every scene at the final dimensions. Check text clipping, timing, caption readability, colour contrast, fonts and character consistency. For Arabic, verify right-to-left layout, connected glyphs and mixed Latin product names. Check final video duration, dimensions, frame rate, audio intelligibility and CTA legibility. Document missing logo, character layers, live CTA, voiceover or music as specific production dependencies. Give the user a concrete draft they can review.

Use the following specification and scripts:

# ASSESS SHIFT Brand and Character Sheet

Career coaching campaign and introduction video

Use ASSESS SHIFT as the service brand, endorsed by ASSESS International. The campaign should help experienced professionals recognize their career question, understand the service and request a Chemistry Session before choosing a package.

## Brand foundation

| Element | Campaign direction |

| --- | --- |

| Service name | ASSESS SHIFT |

| Descriptor | Career Coaching |

| Endorsement | By ASSESS International |

| Primary audience | Experienced professionals considering a new role, function, industry or work model. The registration form serves experience bands of 5–10, 10–15 and 15+ years. |

| Core need | Make a thoughtful career decision while accounting for experience, income, family commitments and market reality. |

| Positioning | Psychometric insight combined with professional coaching to explore realistic career directions and build a practical transition plan. |

| Primary action | Request a Chemistry Session through the registration process. |

## Campaign message

Recommended headline: Your next career move deserves clarity.

Supporting copy: Understand what matters to you at work, explore realistic options and plan your next move with ASSESS SHIFT career coaching.

Arabic headline: خطوتك المهنية الجاية تستحق وضوح.

Arabic supporting copy: افهم إيه المهم بالنسبة لك في الشغل، واستكشف اختيارات واقعية، وخطّط لخطوتك الجاية مع ASSESS SHIFT.

## Brand personality and voice

A thoughtful career partner: calm, curious and practical. Acknowledge the client’s experience and ask clear questions. Explain assessments in ordinary language. Keep career ownership with the client.

Use: “Which direction fits your priorities?” and “Let’s explore what your experience can carry into your next role.” Avoid pressure to resign, guaranteed outcomes, invented success stories or claims of ICF accreditation that have not been verified.


---


# Visual Identity Sheet

Retain the burgundy family already present in the catalogue and registration form. Use the following proposed campaign palette consistently across video frames, posts and campaign materials.

| Colour | Hex | Role |

| --- | --- | --- |

| SHIFT Burgundy | #91212E | Primary emphasis, CTA, character jacket and key words |

| Deep Burgundy | #3A0A10 | End card background and strong contrast |

| Charcoal | #242427 | Body copy and outlines |

| Warm Ivory | #FAF7F2 | Primary background |

| Soft Rose | #F5E9E9 | Secondary panels and quiet highlights |

| White | #FFFFFF | Text on dark backgrounds and clean space |

Source alignment: the catalogue uses #91212E prominently; the registration form uses #A71922. #91212E is the proposed campaign standard. Updating the form colour would be a separate implementation decision.

## Typography and service lockup

English: Quicksand for headlines, matching the catalogue. Aptos or a licensed equivalent for supporting copy. Arabic: Noto Sans Arabic is the proposed companion. Bundle approved font files for production and check Arabic shaping and right-to-left order.

Use the approved ASSESS corporate logo. Place “SHIFT” and “Career Coaching” beside or below it with consistent spacing. A typed service-name layout is a temporary design reference until the approved logo asset is supplied.

## Composition and visual language

- Use generous ivory space, mature illustrated characters and clean 2D explanatory graphics. Keep one main idea per frame.

- Show options as equally sized cards. Bring them into a comparison before highlighting a preferred direction.

- Use a thin burgundy path as a recurring motif. It moves between options and ends at a next-step plan.

- Show assessment insights as interests, motivation and work-style labels. Use abstract profiles without invented scores or real client data.

- Use consistent line weight, soft shadows and restrained movement. Avoid ladders to success, graduation imagery and dramatic resignation scenes.

## Video composition

Proposed master: 1080 × 1920 vertical, 30 fps, 75 seconds. Keep important copy at least 90 px from the sides, 180 px from the top and 300 px from the bottom as an initial composition guide, then check each platform’s current interface overlay. Adapt separately for 1920 × 1080.

Use large captions, up to two lines, with one thought at a time. Plan gentle 8–12 frame fades and slow movements that support the narration. Keep music below the voice and make the story understandable with sound off.


---


# Coach and Coachee Character Sheet

Layla is the coach and Omar is the coachee. These original fictional characters show a coaching conversation, with the client actively reflecting, comparing options and choosing next steps. Use the detailed illustrated sheet as the visual target and the separate vector rigs to study articulated movement.

| Attribute | Layla the coach | Omar the coachee |

| --- | --- | --- |

| Age and presence | About 44. Calm, curious and attentive. | About 37. An experienced professional considering a career change. |

| Identity | Warm medium olive complexion; shoulder-length dark wavy hair with a side part; natural brown eyes. | Warm olive complexion; short dark hair with a textured side part; short neatly trimmed beard; brown eyes. |

| Wardrobe | Burgundy blazer, ivory blouse, charcoal trousers, flat dark loafers and small understated earrings. | Slate teal shirt with rolled sleeves, warm taupe chinos and dark leather shoes. |

| Performance | Open questions, attentive pauses, restrained open-palm gestures and quiet encouragement. | Thoughtful pauses, eye contact, explanatory gestures, option comparison and writing next steps. |

| Decision ownership | Helps examine evidence and priorities. | Owns the career decision and the next-step plan. |

| Visual style | Mature semi-realistic 2D illustration, natural anatomy, expressive faces and subtle cel shading. | The same illustration style and light, with a clearly different wardrobe and role. |

## Identity and expression locks

Keep facial proportions, complexion, hair, wardrobe and relative scale consistent. Use front, three-quarter and profile views for design reference. Expressions stay subtle: thoughtful, curious, listening and quietly encouraged. These fictional characters do not represent actual facilitators or an actual client case.

## Who moves and why

Layla invites reflection; Omar responds. Move the eyes toward the person or prop first, then the head and hand. Give the listener time to react. Avoid simultaneous large gestures, exaggerated smiles and repeated generic waving. One external narrator carries the introduction; neither character needs lip sync.

## Character colours

Keep burgundy #91212E as the brand colour. Slate teal #385A61 is a supporting wardrobe colour for Omar, with taupe #BDAE97 for his trousers. It distinguishes the coachee without replacing the ASSESS SHIFT palette.


---


# Character Visual Reference

The detailed model sheet defines Layla and Omar through matching views, expressions and seated coaching poses.

## Use the artwork correctly

The PNG is a visual reference, not a layered rig. The supplied editable SVGs are simpler vector redraws for the motion study. They demonstrate working joints and stable anatomy, but do not reproduce every detail of this sheet. Match the detailed illustration when preparing final production layers.

## Production artwork

Separate the torso, head, eyes, hair, upper arms, forearms and hands. Provide overlap at shoulder and elbow seams. Put pivots at the anatomical joints and parent each hand to its forearm, each forearm to its upper arm and each upper arm to the torso. Keep left and right defined from the character’s perspective in final asset naming.

## Character reference prompt

Preserve the supplied character identity, mature proportions, complexion, hairstyle and wardrobe. Use clean semi-realistic 2D illustration with subtle cel shading. Render the required conversational action with convincing hands, clear eye direction and restrained expression. Keep the full body visible and use a transparent background for individual pose assets.


---


# Conversation Acting Reference

Use these six key poses to plan the coaching interaction. In-between motion must preserve anatomy and contact; switching between still images alone does not create a complete articulated performance.

## Acting sequence

Reflect: Omar considers his question while Layla listens. Ask: Layla offers an open question. Respond: Omar explains his priorities. Compare: both attend to possible directions. Plan: Omar records a manageable next step. Next step: the conversation closes with modest confidence, without suggesting a guaranteed outcome.

## Working movement example

The eight-second silent vector study demonstrates planted feet, independently rotating arm segments, small head turns, gaze shifts and blinks. It covers listening, an open question and a response. It does not implement the seated poses, writing, walking, prop contact or lip sync. Build and review those actions separately before the full video.

## Review the performance

Check the anticipation, main gesture, hold and settle in each action. Watch for joint gaps, sliding feet, changing proportions and hands that miss a prop. Keep gestures purposeful and text still while it is being read.


---


# Introduction Video Storyboard

Concept: Omar moves from a career question to a clearer decision process, supported by Layla. Target duration is 75 seconds; final scene lengths follow the recorded voiceover.

| Time | Character action | On screen copy |

| --- | --- | --- |

| 00–07 | Omar reflects on his next career move. He looks from his notebook toward three possible directions. | What comes next? |

| 07–16 | Omar compares the options. His gaze moves before his head; the cards enter with a controlled stagger. | A new role? A new direction? |

| 16–25 | Layla joins Omar and offers an open-palm invitation. Introduce the service. | ASSESS SHIFT
Career Coaching |

| 25–38 | Layla introduces interests and motivation cards. Omar studies them and reacts thoughtfully. | Understand yourself at work |

| 38–51 | Omar compares directions with experience, market and life priorities. Layla asks and listens. | Explore realistic directions |

| 51–61 | Omar records a manageable next step in his notebook. Layla supports the reflection. | Build a practical transition plan |

| 61–68 | Layla presents three equal package cards. Omar considers the level of support. | Career Clarity
Career Direction
Career Transformation |

| 68–75 | Both settle beside the invitation. Hold the final layout for at least three seconds. | Start with a Chemistry Session
Submit your registration request |

## SHIFT in the story

S Situation Mapping; H Holistic Assessment; I Insight Integration; F Future Career Fit; T Transition and Tracking. Show the practical experience of the journey in the short introduction instead of five dense definitions.

## Story ownership

Layla supports Omar’s reflection. Omar chooses the direction and next steps. The ending offers a Chemistry Session and a structured way to plan, without promising a job, promotion or salary increase.


---


# Introduction Video Voiceover

## English master

You’ve built experience. But what should your next career move be?

A new role? A different field? Or a new way of working?

When income, family and years of experience matter, the decision needs careful thought.

ASSESS SHIFT combines psychometric insight with professional career coaching to help you understand what matters to you at work.

Together with your coach, you explore your interests and motivation, and connect them with your experience.

You compare possible directions against your skills, market opportunities and life priorities. Personality insight is included in selected journeys.

Then you build practical next steps, with room to test an option before making a major move.

Career Clarity, Career Direction and Career Transformation offer different levels of support.

Start by requesting a Chemistry Session. Share your situation, discuss what you need and explore the journey that may suit you.

ASSESS SHIFT. Your next career move deserves clarity.

## Egyptian Arabic alternative

عندك خبرة وسنين شغل، بس لسه بتسأل نفسك: إيه خطوتي المهنية الجاية؟

دور جديد؟ مجال مختلف؟ ولا طريقة تانية للشغل؟

لما يكون في دخل ومسؤوليات وخبرة بنيتها، القرار محتاج تفكير.

ASSESS SHIFT بيجمع بين نتائج تقييمات سيكومترية وكوتشينج مهني، عشان تفهم إيه المهم بالنسبة لك في الشغل.

مع الكوتش، بتستكشف اهتماماتك ودوافعك، وتربطها بخبرتك.

وبتقارن الاختيارات بمهاراتك، وفرص السوق، وأولويات حياتك. وبعض الباقات بتضيف فهم أعمق لشخصيتك وطريقة شغلك.

وبعدين بتحط خطوات عملية، وتستكشف إزاي تختبر الاختيار قبل تغيير كبير.

Career Clarity وCareer Direction وCareer Transformation بيقدّموا مستويات مختلفة من الدعم.

ابدأ بطلب جلسة تعارف، Chemistry Session. شارك وضعك الحالي، واتكلم عن احتياجك، واستكشف الرحلة المناسبة ليك.

ASSESS SHIFT. خطوتك المهنية الجاية تستحق وضوح.

Record each language separately. Time the recording before final animation. Extend the cut or edit the script if needed; do not rush the voice to meet a fixed duration.


---


# Production Brief and Service Facts

## Package accuracy

| Journey | Assessments | Sessions | Selected outputs |

| --- | --- | --- | --- |

| Career Clarity | Career Orientation + Motivation | 2 | Career Insight Summary and Action Plan |

| Career Direction | Career Orientation + Motivation + Personality Basic | 4 | Integrated Profile Pack, Fit Matrix and Structured Transition Action Plan |

| Career Transformation | Career Orientation + Motivation + Personality+ | 6 | Profile Pack, Fit Matrix, Transition Report, PDP and 30/60/90 Roadmap |

Session totals include the debrief. Career Direction includes one complimentary session and Career Transformation includes two. Written outputs differ by package. The introduction should describe a practical plan without promising the most detailed outputs to every client.

## The first step

Use this conversion sequence consistently: registration request, Chemistry Session, journey recommendation, commercial confirmation and booking, then the coaching journey. The Chemistry Session helps clarify the client’s situation and support needs. Its price and duration are not specified in the attached materials, so avoid calling it free or assigning a length.

The catalogue uses “Career Consultation”; the registration form uses “Chemistry Session.” For this campaign, use “Chemistry Session” and explain it as an initial conversation about career context and the suitable level of support.

## Claude Code handoff

Give Claude Code this brief, both source files, the approved corporate logo and new character references. Ask it to build an editable video project with a scene timeline, local assets, caption files and an export guide. Let it inspect the available project and tools before selecting or installing a video framework.

Start with a storyboard preview. Add a reviewed voice recording and licensed music, then render the final video. Do not replace a character reference sheet with a single animated screenshot: separate character artwork is needed for clean movement.

## Before campaign publication

- Supply the approved logo and the live registration or booking destination. The catalogue contains a booking QR placeholder.

- Connect and test actual submission handling. The attached HTML only displays a success toast; it does not save the form answers or send a request.

- Finalize the registration privacy and confidentiality wording, which the attached form explicitly leaves pending.

- Confirm the Chemistry Session details and any public pricing or credential claims before adding them to copy.

- Check package names, caption accuracy, character continuity, Arabic layout, licensed assets and the final CTA on a phone.

## Source references

ASSESS SHIFT Career Coaching Catalogue: slides 4–8, 16–18 and 20–23. Assess Career Coaching Registration v7: career context questions, package cards, submission section, footer and script. The palette standard, characters, campaign headline, scripts and video treatment are proposed creative directions.


---


# Character Roles and Movement

The two characters have distinct responsibilities. Layla facilitates the conversation. Omar represents an experienced professional exploring a decision, with agency throughout the video.

| Character | Role | What the viewer sees |

| --- | --- | --- |

| Layla | Career coach | Listens, asks open questions, introduces assessment insights and supports comparison. |

| Omar | Coachee | Reflects, explains priorities, considers evidence, compares options and records his next step. |

| Narrator | External voice | Explains the service while both characters support the story visually. |

## Movement timing at 30 fps

Use proposed timings as a starting point: gaze leads the head by 3–5 frames; anticipation lasts 6–10 frames; a small conversational gesture takes 16–24 frames; the meaningful hold lasts 24–45 frames; settling takes 10–16 frames. Review against the actual narration instead of forcing every gesture into the same timing.

## Rig and control hierarchy

Root to torso to upper arm to forearm to hand. Torso to neck and head, with pupils and eyelids inside the head. Keep feet planted for the conversation. The provided SVG study uses screen-left and screen-right suffixes; its asset map states that convention explicitly.

## Practice before the full video

First reproduce the eight-second working motion study. Then build the six seated key poses with compatible production layers, clear prop contact and reviewed transitions. Practice listening, an open question, a response, option comparison and writing as separate short shots before combining them.

## Evidence and technical sources

New reference: Nijat Ibrahimli, 2D Explainer Animation A to Z, YouTube video jYKPJuKqBwo. The creator’s Fast Food page links to this tutorial. The page and title were inspected; video frames did not play in this environment. Exact motion and timing matches remain unverified. The timing and performance rules here are proposed ASSESS SHIFT directions.

Adobe Learn, Control animation of multiple layers with parenting: adobe.com/learn/after-effects/web/animating-with-parenting. Use joint anchor points and parented layers for connected rotations. The included vector study implements that hierarchy directly.