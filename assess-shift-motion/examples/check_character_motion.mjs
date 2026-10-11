import assert from 'node:assert/strict';
import {poseAt,characterSVG,frameSVG} from './CharacterMotion.mjs';
for (const name of ['Layla','Omar']){
 for(let f=0;f<240;f++){
  const p=poseAt(f,name);
  assert.deepEqual(p,poseAt(f,name),'Frame state must be reproducible.');
  for(const key of ['upper','forearm','wrist','head','eyeX','blink'])assert(Number.isFinite(p[key]));
  assert.equal(p.rootX,0);assert.equal(p.rootY,0);
  assert(Math.abs(p.upper)<=23 && Math.abs(p.forearm)<=67 && Math.abs(p.head)<=5);
  assert(p.blink>=.07 && p.blink<=1);
  const svg=characterSVG(name,f);
  assert(!/<image|https?:/.test(svg),'Rig must be local editable vector paths.');
  for(const id of ['root','legs','torso','head','L_upperArm','L_forearm','L_hand','R_upperArm','R_forearm','R_hand','eye_L','eye_R'])assert(svg.includes(`id="${name}_${id}"`));
 }
 assert.notEqual(poseAt(0,name).eyeX,poseAt(20,name).eyeX,'Gaze cue must change.');
}
assert(poseAt(80,'Layla').forearm < -60);
assert.equal(poseAt(80,'Omar').forearm,0,'Listener should remain quiet during the coach gesture.');
assert(poseAt(190,'Omar').forearm > 60);
assert.equal(poseAt(190,'Layla').forearm,0);
assert(frameSVG(0).includes('1920'));assert(frameSVG(239).includes('RESPOND WITH INTENT'));
console.log('Passed 480 frame-state checks, joint hierarchy, fixed roots, gesture timing and gaze changes.');
