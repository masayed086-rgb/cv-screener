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
- Use slow, subtle movement and a restrained music bed only if licensed audio is supplied.

Character implementation:
- Use the combined Samir and Nour character reference and the consistency locks below. Samir is the male coach and Nour is the female coach. Give them equal professional status and prominence.
- A model sheet is a reference, not a ready-to-animate transparent asset. Obtain or prepare separate approved artwork for the required poses. Preserve identity during preparation.
- If final artwork is missing, build the preview with clearly identified placeholders. Do not silently replace either coach with a new character or call a placeholder production-ready.
- Animate simple layers or pose swaps without distorting body proportions. Avoid simulated lip sync unless appropriate mouth shapes and reviewed timing are available.
- Both coaches listen and help compare options. Career decision ownership remains with the client. Nour must not be depicted as the client.

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

- Use generous ivory space, adult proportions and simple editorial illustrations. Keep one main idea per frame.

- Show options as equally sized cards. Bring them into a comparison before highlighting a preferred direction.

- Use a thin burgundy path as a recurring motif. It moves between options and ends at a next-step plan.

- Show assessment insights as interests, motivation and work-style labels. Use abstract profiles without invented scores or real client data.

- Use consistent line weight, soft shadows and restrained movement. Avoid ladders to success, graduation imagery and dramatic resignation scenes.

## Video composition

Proposed master: 1080 × 1920 vertical, 30 fps, 75 seconds. Keep important copy at least 90 px from the sides, 180 px from the top and 300 px from the bottom as an initial composition guide, then check each platform’s current interface overlay. Adapt separately for 1920 × 1080.

Use large captions, up to two lines, with one thought at a time. Plan gentle 8–12 frame fades and slow movements that support the narration. Keep music below the voice and make the story understandable with sound off.


---


# Male and Female Coach Character Sheet

Samir and Nour are fictional career coaches with equal prominence. Each can lead a campaign video, or they can appear across different scenes. Both support the viewer’s career exploration through attentive listening and clear questions. The client retains ownership of career decisions.

| Attribute | Samir the male coach | Nour the female coach |

| --- | --- | --- |

| Age and presence | Approximately 42–48. Mature, warm and approachable. | Approximately 38–42. Mature, warm and approachable. |

| Face and eyes | Warm medium olive-brown skin, natural brown eyes, neatly trimmed short beard and moustache. | Medium warm olive skin, oval face, natural brown almond-shaped eyes. |

| Hair | Short dark brown hair, neatly groomed, with subtle grey at the temples. | Dark brown shoulder-length wavy hair with a side part. |

| Clothing | Burgundy open blazer, ivory open-collar shirt, charcoal tailored trousers and charcoal leather shoes. No tie. | Burgundy open blazer, ivory crew-neck blouse, charcoal tailored trousers and flat charcoal loafers. |

| Illustration | Refined 2D editorial style with adult proportions, clean contours and minimal shading. | The same editorial style, detail and professional presence as Samir. |

| Props | Ivory notebook, burgundy pen, neutral option cards and a simple light chair. | The same props, scale and visual treatment as Samir. |

| Role | Listens, asks questions and helps the client compare options. | Listens, asks questions and helps the client compare options. |

## Matching views and expressions

Each coach has front, three-quarter and profile views, plus listening, curious and encouraging expressions. Keep emotions subtle. Give both characters the same range of actions and equal visual prominence.

## Shared coaching poses

Active Listening: seated with an open posture and notebook on the lap, attending to the speaker. Exploring Options: standing with two equally sized option cards, inviting reflection. Additional production poses can include reviewing a profile, asking an open question and recording agreed next steps.

## Character continuity

Lock each coach’s facial structure, complexion, hair, outfit, shoes, body proportions and line weight. Keep expressions and gestures consistent with the combined reference sheet on the next page. Neither fictional character carries an accreditation claim or represents an actual facilitator.


---


# Combined Coach Visual Reference

Use this sheet as the shared visual reference for Samir and Nour throughout the ASSESS SHIFT campaign.

## Use in animation

Keep the characters’ appearance consistent with this reference. Prepare separate artwork for each selected pose and transparent layers where movement requires them. The combined board is a reference image; it is not a complete set of animation layers.

## Prompt for further character assets

Use the supplied combined coach reference. Render the specified coach and pose in the same refined editorial style with warm ivory, burgundy and charcoal colours. Preserve the exact face, hair, wardrobe and adult proportions. Use calm, attentive expressions and open gestures. Keep the full body visible. Do not add text, logos, credentials, extra fingers or exaggerated facial features.

Visual reference: use the combined Samir and Nour coach sheet supplied with this brief. Both characters are coaches. Preserve each identity in further assets.


---


# Introduction Video Storyboard

Concept: an experienced professional moves from an unresolved career question to a clearer way of making the decision. Target duration is 75 seconds; final scene lengths follow the recorded voiceover.

| Time | Scene and motion | On screen copy |

| --- | --- | --- |

| 00–07 | Nour appears as a coach beside the viewer’s career question, with an attentive expression. | What comes next? |

| 07–16 | Three neutral option cards appear: a new role, a new field, an independent path. | A new role? A new direction? |

| 16–25 | The path motif introduces the service name. Both coach portraits appear with equal prominence. | ASSESS SHIFT
Career Coaching |

| 25–38 | Samir introduces interests and motivation cards, then adopts an attentive listening pose. | Understand yourself at work |

| 38–51 | Nour invites comparison of options against experience, market and life priorities. | Explore realistic directions |

| 51–61 | A next-step plan appears beside Samir. The path progresses through modest milestones. | Build a practical transition plan |

| 61–68 | Three equal package cards appear briefly. | Career Clarity
Career Direction
Career Transformation |

| 68–75 | End card with a clear action. Hold it long enough to read. | Start with a Chemistry Session
Submit your registration request |

## How SHIFT appears in the story

Use the complete phase names in supporting campaign assets: S Situation Mapping; H Holistic Assessment; I Insight Integration; F Future Career Fit; T Transition & Tracking. In the short introduction, show the practical experience of the journey rather than five dense definitions.

## Story ownership

Nour and Samir are coaches throughout the story. They introduce questions, help interpret evidence and invite the viewer to explore realistic options. The client makes the career decision. The ending offers a Chemistry Session and a structured way to plan next steps.


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

Give Claude Code this brief, both source files, the approved corporate logo and character reference. Ask it to build an editable video project with a scene timeline, local assets, caption files and an export guide. Let it inspect the available project and tools before selecting or installing a video framework.

Start with a storyboard preview. Add a reviewed voice recording and licensed music, then render the final video. Do not replace a character reference sheet with a single animated screenshot: separate character artwork is needed for clean movement.

## Before campaign publication

- Supply the approved logo and the live registration or booking destination. The catalogue contains a booking QR placeholder.

- Connect and test actual submission handling. The attached HTML only displays a success toast; it does not save the form answers or send a request.

- Finalize the registration privacy and confidentiality wording, which the attached form explicitly leaves pending.

- Confirm the Chemistry Session details and any public pricing or credential claims before adding them to copy.

- Check package names, caption accuracy, character continuity, Arabic layout, licensed assets and the final CTA on a phone.

## Source references

ASSESS SHIFT Career Coaching Catalogue: slides 4–8, 16–18 and 20–23. Assess Career Coaching Registration v7: career context questions, package cards, submission section, footer and script. The palette standard, characters, campaign headline, scripts and video treatment are proposed creative directions.