// Rig checks for the intro performance (run: npm run check).
// 1. Determinism: same frame -> identical pose.
// 2. Joint limits: arm angles stay inside the range the puppet cut-outs
//    were checked at (scripts/build_puppets.py, PuppetSheet).
// 3. Turn-taking: the two characters never make a big gesture at once.
import assert from 'node:assert/strict';
import {poseAt} from '../src/rig/acting';
import {LAYLA, OMAR} from '../src/intro/acting';

let n = 0;
let overlap = 0;
for (let f = 0; f < 2250; f++) {
  const big: boolean[] = [];
  for (const [name, tr] of [['Layla', LAYLA], ['Omar', OMAR]] as const) {
    const p = poseAt(tr, f);
    assert.deepEqual(p, poseAt(tr, f), `${name} frame ${f} not reproducible`);
    for (const side of ['L', 'R'] as const) {
      const a = p[side];
      assert(a.u >= -10 && a.u <= 45, `${name} ${side} upper ${a.u.toFixed(1)} @${f}`);
      assert(a.f >= -10 && a.f <= 80, `${name} ${side} forearm ${a.f.toFixed(1)} @${f}`);
    }
    assert(p.blink >= 0.07 && p.blink <= 1);
    big.push(Math.max(p.L.f, p.R.f) > 50);
    n++;
  }
  // allowed only during the shared closing welcome
  if (big[0] && big[1] && f < 2040) overlap++;
}
assert.equal(overlap, 0, `${overlap} frames with simultaneous big gestures`);
console.log(`Passed ${n} pose checks (determinism, joint limits) and turn-taking: no simultaneous big gestures before the end card.`);
