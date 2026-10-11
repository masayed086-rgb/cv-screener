# ASSESS SHIFT voiceover in ElevenLabs

Use one external narrator for the first video. Layla appears as the coach and Omar as the coachee; their mouths remain still. Generate English and Egyptian Arabic separately. These scripts adapt the current campaign voiceover for speech, without changing the service claims.

The target video is approximately 75 seconds. No audio has been generated or timed here. The recorded voiceover must determine the final scene lengths; punctuation and model settings cannot guarantee a duration.

## Choose the file

| File | Use |
| --- | --- |
| ASSESS_SHIFT_TTS_English.txt | Paste directly into Text to Speech for English narration |
| ASSESS_SHIFT_TTS_Egyptian_Arabic.txt | Paste directly for Egyptian Arabic narration |
| ASSESS_SHIFT_TTS_English_v2_Pauses.txt | Optional pause-controlled version for Eleven Multilingual v2 |
| ASSESS_SHIFT_TTS_Egyptian_Arabic_v2_Pauses.txt | Optional pause-controlled version for Eleven Multilingual v2 |

Only paste the script itself into the speech box. Keep this guide, filenames, scene timings, speaker names and directing notes outside it. The Arabic version says “جلسة تعارف” for Chemistry Session; keep the official English term on screen if needed.

## Generate the voiceover

1. Sign in at [ElevenLabs](https://elevenlabs.io) and open **Text to Speech**.
2. Choose a voice. For this campaign, audition a warm adult narrator with calm, clear delivery. For Arabic, look for a native Egyptian voice and test the actual script. Speaking Arabic does not itself establish an Egyptian accent.
3. Start with **Eleven Multilingual v2** for the controlled narration workflow below. Alternatively, audition Eleven v4 if available in your account; use a plain-text script for that test. The current official guide lists both models.
4. For Multilingual v2, try **Stability 50**, **Similarity 75**, **Style 0** and **Speed 0.95**. These are starting values, not guaranteed results. Keep Speaker Boost at its initial value for the first test. Controls can vary by selected model.
5. Generate a short opening sample first. Include the brand sentence in a pronunciation test. Listen for warmth, pace, accent and natural questions.
6. Paste the full chosen plain-text script and click **Generate**. Keep the voice, model and settings consistent across revisions.
7. Listen from start to finish. Check the brand, package names, “psychometric” or “سيكومترية”, the invitation and the ending. Correct only the wording or settings that need attention.
8. Open the generation **History**, use its download menu and choose **WAV** for the editing master. MP3 is suitable for a quick review copy. Suggested output names: `assess-shift-vo-en.wav` and `assess-shift-vo-ar.wav`.

UI locations may change. The essential flow is script → voice/model → settings → generate → listen → download.

## Test pronunciation

English sample:

> Assess Shift combines psychometric insight with professional career coaching.

Arabic sample:

> Assess Shift بيجمع بين نتائج تقييمات سيكومترية وكوتشينج مهني.

Then test the package-name sentence. The Arabic script includes those official English names, so listen especially carefully around the language switches. If a name is mispronounced, test an alternative spelling in the speech script only, and retain official spelling in captions and on-screen text. No brand pronunciation has been approved by an audio test here.

## Optional pauses

Use the supplied `_v2_Pauses.txt` files only with **Eleven Multilingual v2**. They add four short SSML breaks around major story beats. They are a starting point; inspect the result rather than treating the rendered timing as exact.

Eleven v4 and Eleven v3 use audio tags and punctuation; they do not support SSML break tags. Use the plain versions with those models. Avoid pasting unsupported tags or a directing paragraph into the speech text.

## Fit the audio to the video

Measure the downloaded duration. If it is too long, trim the script or extend the video before forcing a rushed delivery. If it is short, add deliberate visual holds or test a slightly slower delivery. Leave at least three seconds of stable CTA reading time in the final cut.

Keep the narration clean and separate from music. Add the music bed later in the video project and check speech intelligibility by listening.

Give the reviewed audio to Claude with this prompt:

```text
Use the supplied ASSESS SHIFT voiceover file as the timing master. Measure its actual duration and map each spoken phrase to the scene responsibilities in CHARACTER_ROLES.md. Adjust the provisional scene lengths to natural phrase boundaries. Create captions from the actual recording, not the draft time ranges. Keep Layla and Omar as visual coach and coachee with no lip sync in this version. Hold the CTA for at least three seconds, extending the video if necessary. Keep narration separate from music and provide an inspected synchronized draft.
```

## Official references

Instructions checked on 11 October 2026. Voice and model availability depend on the account.

- [ElevenLabs Text to Speech product guide](https://elevenlabs.io/docs/eleven-creative/playground/text-to-speech): generation workflow, controls, models and downloads.
- [ElevenLabs prompting best practices](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices): pronunciation, pacing and model-specific prompting.
