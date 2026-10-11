# ASSESS SHIFT | Campaign Studio

A proposed campaign identity and character system for Career Coaching, Leadership Coaching and Career Advising.

## Start here
1. Open `ASSESS_SHIFT_Visual_Bible.pdf` for the brand, character and whiteboard sheets and production rules.
2. Keep this folder together. Open it as your project in Claude Code and start Claude there. `CLAUDE.md` provides persistent project instructions; this is context and a production workflow, not model training or fine-tuning.
3. Paste `prompts/01-build-character-assets.txt`. Establish articulated character assets before requesting full acting animation.
4. Paste `prompts/02-first-motion-reel.txt` or `prompts/03-first-whiteboard-reel.txt`. Both use the first approved concept, “Your next step starts with clarity.”
5. Review the source, reference frames and a short motion test before producing the campaign series. Give concrete corrections (e.g., “coach turns her head before lifting her hand”). Save decisions in the project specs.

The branding here is a proposed creative direction, not an assertion that ASSESS International has adopted a new corporate identity. Keep corporate lockups separate if required.

## What is included
- Three generated visual reference sheets: brand, characters, whiteboard.
- Exact brand tokens, copy, typography recommendations and editable proposed logo SVG.
- Character identity, expressions, gesture timing, layering and animation guidance.
- Six-video campaign sequence, Arabic/English copy, and a 30-second opening reel brief.
- Ready-to-paste Claude Code production prompts.
- Your uploaded motion-reel toolkit unchanged, under `original-toolkit`.
- A tiny browser whiteboard example showing true deterministic SVG path reveals. This demonstrates the technique, not finished character artwork.

## Using the supplied skill in Claude Code
Optional: copy `original-toolkit/motion-reel` to `.claude/skills/motion-reel` inside your local project, without replacing an existing skill. It may then be invoked as `/motion-reel` according to Claude Code's documented skill mechanism. The skill is generic; explicitly tell Claude to apply the campaign-specific CLAUDE.md and production docs. No installation into your current ChatGPT skills has been performed.

## Runtime for actual videos
The original toolkit expects Node.js, Playwright with Chromium, and FFmpeg; its Python beat analyzer additionally needs NumPy/Librosa. Ask Claude to check installed tools first and install only missing dependencies in your local project. Actual speech requires a supplied recording or a separately authorized TTS provider. Keep credentials out of files and prompts.

## Important production distinctions
The PNGs are flattened visual references. They are not layered SVG/PSD files, isolated transparent assets, mouth sprites or animation rigs. The kit describes how to construct those. The logo SVG is editable and has text; install the specified font or convert the wordmark to outlines for final distribution. Production fonts are not bundled.

## Documentation sources
- https://code.claude.com/docs/en/memory
- https://code.claude.com/docs/en/skills

Checked 11 October 2026. Project instructions guide behavior; they do not change Claude Code permissions or guarantee its output.
