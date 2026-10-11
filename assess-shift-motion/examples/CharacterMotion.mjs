/** Original articulated vector rig study. Frame deterministic; no external assets. */
import {writeFileSync, mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const clamp=(x)=>Math.max(0,Math.min(1,x));
const smooth=(x)=>{x=clamp(x);return x*x*(3-2*x)};
const ramp=(f,a,b)=>smooth((f-a)/(b-a));
const gesture=(f,a,b,c,d)=>ramp(f,a,b)*(1-ramp(f,c,d));
const blink=(f,at)=>Math.max(.07,1-gesture(f,at,at+2,at+3,at+5));
const num=x=>Number(x.toFixed(3));
export function poseAt(frame,who){
 const f=clamp(frame/239)*239;
 const ask=gesture(f,36,65,106,134);
 const answer=gesture(f,142,174,208,235);
 const isCoach=who==='Layla';
 const g=isCoach?ask:answer;
 const anticipate=gesture(f,isCoach?28:134,isCoach?33:139,isCoach?35:141,isCoach?41:148);
 return {upper:num((isCoach?-19:20)*g+(isCoach?3:-3)*anticipate),
 forearm:num((isCoach?-64:66)*g),wrist:num((isCoach?14:-14)*g),
 head:num((isCoach?-2.8:2.8)*gesture(f,42,72,108,138)+(isCoach?2:-2)*gesture(f,151,171,188,205)),
 eyeX:num((isCoach?1:-1)*(.3+1.4*ramp(f,8,20)+.6*g)),blink:num(blink(f,isCoach?99:121)*blink(f,isCoach?221:58)),
 openHand:g>.18,rootX:0,rootY:0};
}
function hand(open,skin,outline){
 const shape=open?'M-9 0 Q-14 6-16 19 L-25 27 Q-28 31-24 34 Q-19 36-12 29 L-9 28 L-10 50 Q-10 57-6 57 Q-2 57-2 51 L-2 34 L0 54 Q0 60 4 59 Q8 59 7 53 L6 33 L10 50 Q12 56 16 54 Q19 52 17 47 L12 29 L18 41 Q21 46 24 43 Q27 40 23 35 L13 17 L10 0 Z':'M-10 0 L10 0 Q14 16 12 26 L10 43 Q9 48 5 46 L4 30 L2 47 Q1 52-3 49 L-4 29 L-7 43 Q-10 47-12 42 L-10 23 Q-16 30-20 26 Q-22 24-17 19 Z';
 return `<path d="${shape}" fill="${skin}" stroke="${outline}" stroke-width="1.1"/><path d="M-6 9 Q0 13 7 9" fill="none" stroke="${outline}" stroke-width=".8" opacity=".45"/>`;
}
function arm(id,x,y,colour,shade,skin,outline,pose,active,coach){
 const u=active?pose.upper:0,e=active?pose.forearm:0,w=active?pose.wrist:0;
 return `<g id="${id}_upperArm" transform="translate(${x} ${y}) rotate(${u})">
 <path d="M-14-9 Q0-20 17-6 L19 84 Q12 101-13 96 L-21 26 Z" fill="${colour}" stroke="${shade}" stroke-width="1.2"/>
 <path d="M13 7 L14 73 Q11 86 5 91" fill="none" stroke="${shade}" stroke-width="2" opacity=".5"/>
 <g id="${id}_forearm" transform="translate(0 88) rotate(${e})">
 <path d="M-14-5 Q0-10 16-3 L${coach?12:10} 82 Q0 91-11 83 Z" fill="${coach?colour:skin}" stroke="${coach?shade:outline}" stroke-width="1.2"/>
 ${coach?`<path d="M-11 76 L12 76 L11 88 L-10 88 Z" fill="#f3eee5"/>`:`<path d="M-14-4 L16-4 L16 11 L-14 12 Z" fill="${shade}"/><path d="M-12 2 L13 2" stroke="${colour}" stroke-width="3"/>`}
 <g id="${id}_hand" transform="translate(0 84) rotate(${w})">${hand(active&&pose.openHand,skin,outline)}</g></g></g>`;
}
function face(p,coach,prefix){
 const skin=coach?'#D69E77':'#C28C63',edge='#8A563C',hair=coach?'#3D2923':'#292522';
 return `<g id="${prefix}_head" transform="rotate(${p.head} 0 120)">
 ${coach?`<path d="M-35 26 Q-48 38-43 82 Q-55 104-39 131 Q-22 146 0 130 Q22 145 42 126 Q54 110 42 86 Q50 49 28 22 Z" fill="${hair}"/>`:''}
 <path d="M-12 91 L-14 123 Q0 141 15 124 L12 89 Z" fill="${skin}" stroke="${edge}" stroke-width=".8"/>
 <path d="M-13 95 Q1 108 13 94 L13 108 Q0 119-13 111 Z" fill="${edge}" opacity=".2"/>
 <ellipse cx="-30" cy="67" rx="6" ry="11" fill="${skin}"/><ellipse cx="30" cy="67" rx="6" ry="11" fill="${skin}"/>
 <path d="M-29 47 Q-30 16 1 15 Q32 16 30 47 L28 76 Q23 97 1 105 Q-23 98-28 78 Z" fill="${skin}" stroke="${edge}" stroke-width="1"/>
 <path d="M19 39 Q30 65 19 82 Q12 94 1 98 Q24 96 29 76 L31 46 Z" fill="${edge}" opacity=".14"/>
 ${coach?`<path d="M-31 67 Q-34 38-25 23 Q-6 3 17 15 Q34 15 35 48 Q21 29 6 30 Q-12 48-30 53 Z" fill="${hair}"/><path d="M-19 22 Q2 13 15 20 M-26 34 Q-4 34 8 20" fill="none" stroke="#755044" stroke-width="2"/><path d="M29 47 Q37 82 26 104 Q35 98 35 85" fill="none" stroke="#755044" stroke-width="2"/>`:`<path d="M-31 52 L-34 31 Q-37 11-19 11 Q-20 0-3 4 Q16-3 26 9 Q42 11 32 40 L28 53 L24 34 Q4 39-15 28 L-26 42 Z" fill="${hair}"/><path d="M-23 17 Q-4 8 16 13 M-21 23 Q0 18 23 21" stroke="#5B4C42" stroke-width="2" fill="none"/><path d="M-27 75 Q-14 90 0 83 Q15 90 28 75 L23 93 Q0 116-23 93 Z" fill="${hair}"/>`}
 <path d="M-22 52 Q-13 48-6 52 M7 52 Q15 48 23 52" stroke="${hair}" stroke-width="2.5" stroke-linecap="round" fill="none"/>
 <g id="${prefix}_eye_L" transform="translate(-14 61) scale(1 ${p.blink})"><path d="M-8 0 Q0-6 8 0 Q0 5-8 0" fill="#fff7e9" stroke="${edge}" stroke-width=".8"/><circle cx="${p.eyeX}" cy="0" r="2.7" fill="#38291E"/><circle cx="${p.eyeX-.6}" cy="-.8" r=".7" fill="white"/></g>
 <g id="${prefix}_eye_R" transform="translate(15 61) scale(1 ${p.blink})"><path d="M-8 0 Q0-6 8 0 Q0 5-8 0" fill="#fff7e9" stroke="${edge}" stroke-width=".8"/><circle cx="${p.eyeX}" cy="0" r="2.7" fill="#38291E"/><circle cx="${p.eyeX-.6}" cy="-.8" r=".7" fill="white"/></g>
 <path d="M1 62 L-2 76 Q2 79 6 76" stroke="${edge}" stroke-width="1.2" fill="none"/>
 ${coach?`<path d="M-10 87 Q0 92 11 86 Q0 97-10 87" fill="#A35F58"/><path d="M-9 87 Q1 90 10 86" fill="none" stroke="#6E3B34" stroke-width="1"/><circle cx="-32" cy="81" r="2.7" fill="#C9A76B"/><circle cx="32" cy="81" r="2.7" fill="#C9A76B"/>`:`<path d="M-11 84 Q0 80 12 84 L11 89 Q0 86-10 89 Z" fill="${hair}"/><path d="M-8 91 Q1 95 9 91" fill="none" stroke="#DFA586" stroke-width="1.1"/>`}
 </g>`;
}
export function characterSVG(who,frame=0){
 const coach=who==='Layla',p=poseAt(frame,who),skin=coach?'#D69E77':'#C28C63',edge='#8A563C',c=coach?'#91212E':'#385A61',shade=coach?'#601724':'#29434C',pants=coach?'#343438':'#BDAE97',dark=coach?'#222328':'#94866E';
 return `<g id="${who}_root">
 <g id="${who}_legs"><path d="M-42 313 L-2 317 L-5 436 L-15 562 L-47 562 L-40 433 Z" fill="${pants}" stroke="${dark}" stroke-width="1.3"/><path d="M1 317 L42 313 L40 429 L48 562 L16 562 L5 435 Z" fill="${pants}" stroke="${dark}" stroke-width="1.3"/>
 <path d="M-30 349 L-26 442 L-35 542 M29 349 L23 432 L34 544" stroke="${dark}" fill="none" stroke-width="1.5" opacity=".65"/>
 <path d="M-47 560 L-15 560 L-10 577 Q-25 587-60 583 Q-65 575-47 560 Z M16 560 L48 560 Q66 574 65 582 Q42 589 14 579 Z" fill="#282728" stroke="#141414" stroke-width="1.2"/>
 <path d="M-56 579 Q-35 584-13 577 M18 576 Q42 583 62 580" fill="none" stroke="#5B4C42" stroke-width="1.4"/></g>
 ${arm(who+'_L',-46,149,c,shade,skin,edge,p,!coach,coach)}
 <g id="${who}_torso"><path d="M-44 128 Q-15 116 0 125 Q17 116 43 128 L49 220 L41 321 Q0 334-42 321 L-50 220 Z" fill="${coach?'#EEE6D9':c}" stroke="${shade}" stroke-width="1.2"/>
 ${coach?`<path d="M-44 127 L-16 119 L-4 146 L-9 322 L-43 337 L-49 225 Z M16 119 L43 127 L48 225 L43 337 L9 322 L4 146 Z" fill="${c}"/><path d="M-17 122 L-30 166 L-20 172 L-12 192 L-7 159 M17 122 L29 166 L20 172 L12 192 L7 159" fill="${shade}" stroke="#AC4650" stroke-width="1"/><path d="M-4 146 L0 177 L5 146 M0 177 L0 301" stroke="#CBBDAA" fill="none"/><path d="M-40 278 L-16 275 L-15 284 L-39 287 M16 275 L39 278 L38 287 L16 284" fill="${shade}"/><path d="M-41 172 Q-36 222-39 249 M40 173 Q35 225 39 250" fill="none" stroke="#B34551" stroke-width="1.3"/>`:`<path d="M-15 119 L0 141 L15 119 L25 136 L14 157 L0 145 L-13 157 L-25 136 Z" fill="${shade}" stroke="#688087" stroke-width="1"/><path d="M0 146 L0 312" stroke="${shade}" stroke-width="1.8"/><path d="M-32 185 Q-25 214-33 238 M29 181 Q23 214 33 241 M-29 289 Q-12 279-5 293 M5 293 Q22 279 31 290" stroke="#678089" stroke-width="1.4" fill="none" opacity=".5"/><path d="M-39 312 L39 312 L39 324 L-39 324 Z" fill="#504438"/><rect x="-6" y="312" width="12" height="13" rx="1" fill="none" stroke="#C4B38B" stroke-width="2"/>`}
 </g>
 ${arm(who+'_R',46,149,c,shade,skin,edge,p,coach,coach)}
 ${face(p,coach,who)}
 </g>`;
}
export function frameSVG(frame){
 const beat=frame<36?'LISTEN':frame<134?'ASK AN OPEN QUESTION':frame<142?'GIVE SPACE':'RESPOND WITH INTENT';
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><title>ASSESS SHIFT articulated character motion study</title><rect width="1920" height="1080" fill="#FAF7F2"/>
 <circle cx="980" cy="490" r="315" fill="#F5E9E9" opacity=".65"/>
 <text x="120" y="104" font-family="DejaVu Sans" font-size="27" letter-spacing="5" fill="#91212E">ASSESS SHIFT</text>
 <text x="120" y="164" font-family="DejaVu Sans" font-size="39" fill="#242427">A conversation that helps you move forward.</text>
 <text x="120" y="204" font-family="DejaVu Sans" font-size="19" fill="#6A6160">ARTICULATED VECTOR STUDY · 30 FPS · EXTERNAL NARRATOR</text>
 <ellipse cx="570" cy="933" rx="114" ry="16" fill="#DED5CE"/><ellipse cx="1350" cy="933" rx="114" ry="16" fill="#DED5CE"/>
 <g transform="translate(570 259) scale(1.14)">${characterSVG('Layla',frame)}</g><g transform="translate(1350 259) scale(1.14)">${characterSVG('Omar',frame)}</g>
 <text x="570" y="990" text-anchor="middle" font-family="DejaVu Sans" font-size="22" letter-spacing="3" fill="#91212E">LAYLA · COACH</text><text x="1350" y="990" text-anchor="middle" font-family="DejaVu Sans" font-size="22" letter-spacing="3" fill="#385A61">OMAR · COACHEE</text>
 <text x="960" y="425" text-anchor="middle" font-family="DejaVu Sans" font-size="18" letter-spacing="2" fill="#6A6160">${beat}</text><path d="M840 459 L1080 459" stroke="#91212E" stroke-width="2"/>
 <text x="960" y="511" text-anchor="middle" font-family="DejaVu Sans" font-size="20" fill="#242427">Clarity starts with a question.</text>
 <rect x="780" y="1040" width="360" height="3" rx="1.5" fill="#E6D6D6"/><rect x="780" y="1040" width="${num(360*clamp(frame/239))}" height="3" rx="1.5" fill="#91212E"/>
 </svg>`;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const out=process.argv[2]||'character_frames';mkdirSync(out,{recursive:true});
 for(let f=0;f<240;f++)writeFileSync(`${out}/frame-${String(f).padStart(4,'0')}.svg`,frameSVG(f));
 for(const who of ['Layla','Omar'])writeFileSync(`${out}/${who}_Rig.svg`,`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800" viewBox="-160 -50 320 640"><title>${who} articulated motion prototype</title>${characterSVG(who)}</svg>`);
 writeFileSync(`${out}/ASSESS_SHIFT_Coach_Coachee.svg`,frameSVG(0));
 console.log('Wrote 240 deterministic frames and 3 editable vector assets.');
}
