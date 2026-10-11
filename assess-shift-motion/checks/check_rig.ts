// Rig checks for the intro performance (run: npm run check).
// 1. Determinism: same frame -> identical pose.
// 2. Pen contact: while writing, the pen tip stays inside the notebook's
//    writing page on every frame.
// 3. Joint limits: no arm angle outside the ranges the rig was drawn for.
import assert from 'node:assert/strict';
import {PEN_TIP, handPoint, notebookPage} from '../src/rig/Character';
import {poseAt} from '../src/rig/acting';
import {LAYLA, OMAR, WRITING} from '../src/intro/acting';

let n = 0;
for (const [name, tr] of [['Layla', LAYLA], ['Omar', OMAR]] as const) {
  for (let f = 0; f < 2250; f++) {
    const p = poseAt(tr, f);
    assert.deepEqual(p, poseAt(tr, f), `${name} frame ${f} not reproducible`);
    for (const side of ['L', 'R'] as const) {
      const a = p[side];
      assert(a.u >= -15 && a.u <= 50, `${name} ${side} upper ${a.u} @${f}`);
      assert(a.f >= -165 && a.f <= 80, `${name} ${side} forearm ${a.f} @${f}`);
      assert(Math.abs(a.w) <= 25, `${name} ${side} wrist ${a.w} @${f}`);
    }
    assert(p.blink >= 0.07 && p.blink <= 1);
    n++;
  }
}

let contact = 0;
let worst = Infinity;
for (const [a, b] of WRITING) {
  for (let f = a; f < b; f++) {
    const p = poseAt(OMAR, f);
    const [x, y] = handPoint('R', p.R, PEN_TIP);
    const pg = notebookPage(p);
    const margin = Math.min(x - pg.x1, pg.x2 - x, y - pg.y1, pg.y2 - y);
    worst = Math.min(worst, margin);
    assert(margin >= 0, `pen tip off the page at frame ${f}: (${x.toFixed(1)}, ${y.toFixed(1)}) page ${JSON.stringify(pg)}`);
    assert(p.notebook > 0.99 && p.pen > 0.99, `notebook/pen not fully present while writing at ${f}`);
    contact++;
  }
}
console.log(`Passed ${n} pose checks; pen tip on the page for all ${contact} writing frames (closest edge ${worst.toFixed(1)} rig units).`);
