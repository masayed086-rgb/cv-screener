# Realistic appearance and asset preparation

The new visual reference is `brand/Realistic_Coach_Reference.png`. It replaces the earlier cartoon-like appearance for this campaign. The characters remain fictional coaches; their faces do not represent named employees or establish credentials.

## Appearance specification

| Attribute | Samir | Nour |
| --- | --- | --- |
| Age | Approximately 42–48 | Approximately 38–42 |
| Face | Olive-brown complexion, natural brown eyes, short neat beard, subtle age detail | Warm olive complexion, natural brown eyes, oval face, subtle age detail |
| Hair | Short dark brown hair, subtle grey at temples | Shoulder-length dark brown waves, side part |
| Wardrobe | Burgundy blazer, ivory open-collar shirt, charcoal trousers, dark leather shoes | Burgundy blazer, ivory softly open-neck blouse, charcoal trousers, flat dark loafers |
| Finish | Natural skin, individual hair strands, realistic adult proportions, fabric folds | Same finish, lighting and level of detail |
| Expression | Attentive, curious, encouraging | Attentive, curious, encouraging |

Use soft, warm studio light from the same direction in all assets. Avoid oversized eyes, porcelain skin, extreme beauty retouching, wide fixed smiles and anatomy that changes between poses. Do not change a face to produce an expression.

## Required separate assets for each coach

1. Neutral full-body standing pose, front or three-quarter.
2. Seated listening pose with notebook.
3. Open-hand invitation toward option cards.
4. Reviewing insights pose.
5. Presenting a next-step plan pose.
6. Head-and-shoulders portrait with neutral, curious and encouraging variants.

Export each needed pose on genuine transparency as a separate high-resolution PNG. Keep the same canvas, approximate body scale and grounded foot position across standing poses. Record a foot anchor and face anchor in an asset manifest. Ensure source resolution is sufficient for the largest on-screen scale.

Suggested filenames: `samir-standing-3q.png`, `samir-listening-seated.png`, `samir-presenting-plan.png`, `nour-standing-3q.png`, `nour-listening-seated.png`, `nour-exploring-options.png`. These names are planned assets, not claims that those files are included.

## Asset prompt for Claude to pass to an image tool

```text
Use the supplied Realistic_Coach_Reference.png as the identity reference. Generate [Samir or Nour] in [specified pose]. Preserve the recognizable face, age, complexion, hair, outfit and adult proportions. Match natural photographic detail and soft warm studio lighting. Keep full body and shoes visible. Use genuine transparent background. No text, logos, credentials, added people or props beyond [specified props]. Anatomically correct hands and natural expression. Do not redesign the character.
```

Claude Code needs a connected image-generation tool or supplied artwork to create photographic raster assets. If that capability is absent, it should build with clearly marked placeholders and document the missing pose files.

## How to move realistic characters

| Method | Suitable use | Limit |
| --- | --- | --- |
| Whole-cutout translation | Entrance and layout change | Does not create a physical gesture |
| Gentle scale and camera move | Focus and depth | Keep scale small; do not imply body movement |
| Compatible pose crossfade | Listening → inviting; reviewing → presenting | Keep face position stable; watch for ghosting |
| Layered rig | Hand, arm, head or body articulation | Requires prepared joint layers and anatomy review |
| Verified character video | Talking or a complex gesture | Requires consistent identity and checked frames |

For the first code-based video, use cutouts, compatible pose changes and an external narrator. Do not animate breathing by stretching the whole person. Do not make a still photograph appear to talk by scaling the mouth.

## Included SVG

`brand/ASSESS_SHIFT_Realistic_Coaches.svg` contains the complete realistic reference sheet as an embedded PNG. Claude can use it as an image/reference layer; it cannot manipulate individual arms, faces or poses as vector paths. Keep separate pose PNGs or prepared rigs for character animation.
