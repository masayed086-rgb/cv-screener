import {continueRender, delayRender, staticFile} from 'remotion';

// Load bundled Quicksand before any frame is captured, so text never renders
// in a fallback font on early frames.
const weights = [500, 700] as const;

if (typeof document !== 'undefined') {
  const handle = delayRender('Loading Quicksand');
  Promise.all(
    weights.map((w) => {
      const face = new FontFace('Quicksand', `url(${staticFile(`fonts/quicksand-latin-${w}-normal.woff2`)}) format('woff2')`, {
        weight: String(w),
      });
      return face.load().then((f) => document.fonts.add(f));
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}
