/* ASSESS SHIFT articulated character rig: coach-01 and coachee-01.
 *
 * Pure functions: renderCharacter(id, pose, opts) -> SVG string. The same call
 * records every joint's world matrix in opts.out (forward kinematics), so the
 * checks and IK use exactly what is drawn. No randomness, timers or DOM access.
 *
 * Template space: each figure is authored once in a 3/4 view facing screen-right,
 * y down, origin at the pelvis pivot. "N" = near side (screen-left in the
 * template), "F" = far side. coach-01 renders as authored (dir +1); coachee-01 is
 * mirrored (dir -1) so he faces screen-left. The L/R labels in group ids are the
 * character's own anatomical sides, mapped explicitly in SIDES below; asymmetric
 * details (coachee watch on his left wrist) are attached by anatomical side.
 *
 * Works as a browser global (window.ASRig) and as a CommonJS module.
 */
(function (root) {
  'use strict';

  const C = {
    navy: '#142C3E', navyLight: '#21405B', navyShade: '#0C1E2B',
    ivory: '#F7F3EA', cloth: '#EEE7D7', clothShade: '#D9CFBB',
    teal: '#217A78', tealShade: '#195F5D',
    amber: '#D9A441', amberShade: '#B5822B', amberLight: '#E8BD62',
    tee: '#F5F0E4', teeShade: '#E0D8C7',
    hair: '#211B1F', hairHi: '#4B3F47',
    line: '#2A2027', shoe: '#1B1F28', sole: '#EFE8D8', gold: '#C9952C',
    eyeWhite: '#FBF8F2', iris: '#3A2317', pupil: '#120B08',
    blush: '#E2836F', watch: '#2B2B30', watchFace: '#D8D4CC',
  };

  const CHAR = {
    'coach-01': {
      dir: 1,
      skin: '#D9A07E', skinShade: '#C0815F', skinLine: '#8C5540', lip: '#B45E57',
      hipN: [-24, 6], hipF: [22, 6], thigh: 205, shin: 200,
      waist: [0, -20], shN: [-62, -268], shF: [46, -262], neck: [4, -292],
      upper: 150, fore: 136, footDrop: 18,
    },
    'coachee-01': {
      dir: -1,
      skin: '#B97E5A', skinShade: '#9C6445', skinLine: '#6E4130', lip: '#965446',
      hipN: [-27, 6], hipF: [24, 6], thigh: 214, shin: 206,
      waist: [0, -20], shN: [-70, -284], shF: [52, -278], neck: [4, -308],
      upper: 160, fore: 142, footDrop: 22,
    },
  };

  // Template near/far side -> anatomical side. coach faces screen-right, so her
  // right shoulder is the near one; coachee faces screen-left, so his left is near.
  const SIDES = { 'coach-01': { N: 'R', F: 'L' }, 'coachee-01': { N: 'L', F: 'R' } };

  /* ---------- 2D affine helpers ---------- */
  const mul = (a, b) => [
    a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5],
  ];
  const trs = (x, y, deg, sx = 1, sy = 1) => {
    const r = (deg * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
    return [c * sx, s * sx, -s * sy, c * sy, x, y];
  };
  const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
  const n = (v) => Math.round(v * 100) / 100;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- render context ---------- */
  function makeCtx(id, opts) {
    const wb = opts.style === 'whiteboard';
    const spec = CHAR[id];
    const ctx = {
      id, spec, wb, prefix: opts.prefix || id, pass: 'normal',
      lw: wb ? 6 : 2.2, stack: [[1, 0, 0, 1, 0, 0]], mats: {},
      lineCol: wb ? C.navy : C.line,
    };
    ctx.fillOf = (role) => {
      const s = spec;
      const filled = {
        skin: s.skin, skinShade: s.skinShade, hair: C.hair, navy: C.navy, navyLight: C.navyLight,
        teal: C.teal, cloth: C.cloth, amber: C.amber, amberLight: C.amberLight, tee: C.tee,
        shoe: C.shoe, sole: C.sole, gold: C.gold, eyeWhite: C.eyeWhite, iris: C.iris,
        pupil: C.pupil, lip: s.lip, beard: C.hair, watch: C.watch, watchFace: C.watchFace,
        dark: C.line,
      }[role];
      if (!wb) return filled;
      return ({ teal: C.teal, amber: '#EFD9A8', amberLight: '#EFD9A8', iris: C.navy, pupil: C.navy,
        dark: C.navy, gold: C.amber, watch: C.navy, lip: C.ivory })[role] || C.ivory;
    };
    // Shape kinds: 'body' merges in limb chains (outline pass + fill pass);
    // 'detail' is drawn only in fill/normal passes.
    ctx.shape = (d, role, kind = 'body', extra = '') => {
      if (ctx.pass === 'ol') {
        if (kind !== 'body') return '';
        return `<path d="${d}" fill="${ctx.lineCol}" stroke="${ctx.lineCol}" stroke-width="${n(ctx.lw * 2)}" stroke-linejoin="round"/>`;
      }
      const stroke = ctx.pass === 'fill' && kind === 'body' ? 'none' : ctx.lineCol;
      return `<path d="${d}" fill="${ctx.fillOf(role)}" stroke="${stroke}" stroke-width="${ctx.lw}" stroke-linejoin="round" stroke-linecap="round"${extra}/>`;
    };
    // Unfilled line work (folds, creases). w is relative to the base line width.
    ctx.line = (d, w = 0.7, col) => {
      if (ctx.pass === 'ol') return '';
      return `<path d="${d}" fill="none" stroke="${col || ctx.lineCol}" stroke-width="${n(ctx.lw * (wb ? 0.8 : w))}" stroke-linecap="round" stroke-linejoin="round"/>`;
    };
    // Cel shading: omitted in whiteboard style.
    ctx.shade = (d, col, op = 1) => {
      if (wb || ctx.pass === 'ol') return '';
      return `<path d="${d}" fill="${col}" opacity="${op}"/>`;
    };
    ctx.group = (name, x, y, deg, inner, attrs = '') => {
      const m = mul(ctx.stack[ctx.stack.length - 1], trs(x, y, deg));
      ctx.stack.push(m);
      if (ctx.pass !== 'ol' && name) ctx.mats[name] = m;
      const body = inner();
      ctx.stack.pop();
      const idAttr = name && ctx.pass !== 'ol' ? ` id="${ctx.prefix}-${name}" data-pivot="${n(x)},${n(y)}"` : '';
      return `<g${idAttr} transform="translate(${n(x)} ${n(y)}) rotate(${n(deg)})"${attrs}>${body}</g>`;
    };
    ctx.chain = (build) => {
      const prev = ctx.pass;
      ctx.pass = 'ol'; const a = build();
      ctx.pass = 'fill'; const b = build();
      ctx.pass = prev;
      return a + b;
    };
    return ctx;
  }

  /* ---------- primitive shapes ---------- */
  // Rounded capsule from (x,y) along angle a (deg, 0 = +y) with length len, width w.
  function capsule(x, y, a, len, w) {
    const r = (a * Math.PI) / 180, dx = -Math.sin(r), dy = Math.cos(r);
    const px = -dy * (w / 2), py = dx * (w / 2);
    const ex = x + dx * len, ey = y + dy * len, h = w / 2;
    return `M${n(x + px)},${n(y + py)} L${n(ex + px)},${n(ey + py)} A${n(h)},${n(h)} 0 0 0 ${n(ex - px)},${n(ey - py)} L${n(x - px)},${n(y - py)} A${n(h)},${n(h)} 0 0 0 ${n(x + px)},${n(y + py)} Z`;
  }
  const ellipse = (cx, cy, rx, ry) =>
    `M${n(cx - rx)},${n(cy)} A${n(rx)},${n(ry)} 0 1 0 ${n(cx + rx)},${n(cy)} A${n(rx)},${n(ry)} 0 1 0 ${n(cx - rx)},${n(cy)} Z`;
  const poly = (pts, close = true) =>
    'M' + pts.map((p) => `${n(p[0])},${n(p[1])}`).join(' L') + (close ? ' Z' : '');
  // Smooth closed curve through points (Catmull-Rom -> cubic Bézier).
  function smooth(pts, close = true) {
    const N = pts.length, P = (i) => pts[close ? (i + N) % N : clamp(i, 0, N - 1)];
    let d = `M${n(pts[0][0])},${n(pts[0][1])}`;
    const end = close ? N : N - 1;
    for (let i = 0; i < end; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      d += ` C${n(p1[0] + (p2[0] - p0[0]) / 6)},${n(p1[1] + (p2[1] - p0[1]) / 6)} ${n(p2[0] - (p3[0] - p1[0]) / 6)},${n(p2[1] - (p3[1] - p1[1]) / 6)} ${n(p2[0])},${n(p2[1])}`;
    }
    return d + (close ? ' Z' : '');
  }
  // Scalloped outline: arcs bulging outward between consecutive points (clockwise list).
  function scallop(pts, k = 0.62) {
    let d = `M${n(pts[0][0])},${n(pts[0][1])}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const r = Math.hypot(b[0] - a[0], b[1] - a[1]) * k;
      d += ` A${n(r)},${n(r)} 0 0 1 ${n(b[0])},${n(b[1])}`;
    }
    return d + ' Z';
  }

  /* ---------- hands ----------
   * Hand frame: origin at the wrist joint, fingers extend toward +y at rotation 0.
   * +x is the thumb side for a template near hand. */
  const HAND_POSES = ['relaxed', 'open', 'point', 'chin', 'pen', 'fist'];
  function hand(ctx, poseName, scale = 1, side = 'N') {
    const S = (v) => v * scale;
    const tx = side === 'F' ? -1 : 1; // far hand shows the thumb on the other side
    const fingers = [], extra = [];
    let palm;
    switch (poseName) {
      case 'open':
        palm = smooth([[-15, -2], [15, -2], [18, 22], [13, 40], [-12, 42], [-17, 20]].map(([x, y]) => [S(x * tx), S(y)]));
        [[-12, 38, -22, 30, 8.5], [-4, 41, -8, 34, 8.5], [5, 41, 6, 33, 8.5], [12, 37, 20, 27, 8]].forEach(
          ([x, y, a, l, w]) => fingers.push(capsule(S(x * tx), S(y), a * tx, S(l), S(w))));
        fingers.push(capsule(S(14 * tx), S(10), -62 * tx, S(25), S(10)));
        extra.push([`M${S(-6 * tx)},${S(22)} Q${S(2 * tx)},${S(30)} ${S(10 * tx)},${S(24)}`, 0.5]);
        break;
      case 'point':
        palm = smooth([[-14, -2], [14, -2], [16, 24], [10, 42], [-12, 42], [-16, 22]].map(([x, y]) => [S(x * tx), S(y)]));
        fingers.push(capsule(S(-9 * tx), S(36), -4 * tx, S(38), S(8.5)));
        [[-1, 38], [6, 37], [12, 34]].forEach(([x, y]) => fingers.push(capsule(S(x * tx), S(y), 150 * tx, S(10), S(9))));
        fingers.push(capsule(S(13 * tx), S(10), -30 * tx, S(22), S(9.5)));
        extra.push([`M${S(-4 * tx)},${S(40)} L${S(14 * tx)},${S(36)}`, 0.5]);
        break;
      case 'chin':
        palm = smooth([[-14, -2], [14, -2], [17, 24], [12, 44], [-12, 44], [-17, 22]].map(([x, y]) => [S(x * tx), S(y)]));
        [[-10, 40], [-3, 43], [4, 43], [11, 40]].forEach(([x, y], i) => fingers.push(capsule(S(x * tx), S(y), (160 - i * 6) * tx, S(14), S(9.5))));
        fingers.push(capsule(S(-11 * tx), S(36), -150 * tx, S(16), S(8.5)));
        fingers.push(capsule(S(14 * tx), S(12), 20 * tx, S(22), S(9.5)));
        extra.push([`M${S(-12 * tx)},${S(44)} Q${S(0)},${S(50)} ${S(12 * tx)},${S(44)}`, 0.5]);
        break;
      case 'pen':
        palm = smooth([[-14, -2], [14, -2], [16, 24], [11, 42], [-12, 42], [-16, 22]].map(([x, y]) => [S(x * tx), S(y)]));
        extra.push(['PEN', 0]);
        fingers.push(capsule(S(-9 * tx), S(36), -30 * tx, S(24), S(8.5)));
        [[-1, 40], [6, 39], [12, 35]].forEach(([x, y]) => fingers.push(capsule(S(x * tx), S(y), 140 * tx, S(11), S(9))));
        fingers.push(capsule(S(13 * tx), S(14), -38 * tx, S(24), S(9.5)));
        break;
      case 'fist':
        palm = smooth([[-15, -2], [15, -2], [18, 22], [14, 42], [-13, 42], [-18, 22]].map(([x, y]) => [S(x * tx), S(y)]));
        [[-10, 40], [-3, 42], [4, 42], [11, 39]].forEach(([x, y]) => fingers.push(capsule(S(x * tx), S(y), 170 * tx, S(12), S(10))));
        fingers.push(capsule(S(15 * tx), S(10), 10 * tx, S(24), S(10)));
        extra.push([`M${S(-13 * tx)},${S(42)} L${S(13 * tx)},${S(40)}`, 0.5]);
        break;
      default: // relaxed
        palm = smooth([[-13, -2], [13, -2], [15, 22], [11, 40], [-11, 40], [-15, 20]].map(([x, y]) => [S(x * tx), S(y)]));
        [[-9, 34, 6, 30, 8], [-3, 36, 3, 33, 8.2], [3, 36, 0, 31, 8.2], [9, 33, -4, 26, 7.8]].forEach(
          ([x, y, a, l, w]) => fingers.push(capsule(S(x * tx), S(y), a * tx, S(l), S(w))));
        fingers.push(capsule(S(13 * tx), S(8), -22 * tx, S(26), S(9)));
    }
    let out = '';
    // pen sits behind the fingers
    if (extra.some((e) => e[0] === 'PEN') && ctx.pass !== 'ol') {
      out += `<path d="M${S(-30 * tx)},${S(60)} L${S(20 * tx)},${S(10)}" stroke="${ctx.wb ? C.navy : C.navy}" stroke-width="${S(6)}" stroke-linecap="round"/>`;
      out += `<path d="M${S(16 * tx)},${S(14)} L${S(22 * tx)},${S(8)}" stroke="${C.gold}" stroke-width="${S(6)}" stroke-linecap="round"/>`;
    }
    out += ctx.shape(palm, 'skin');
    fingers.forEach((f) => (out += ctx.shape(f, 'skin')));
    extra.filter((e) => e[0] !== 'PEN').forEach(([d, w]) => (out += ctx.line(d, w, ctx.wb ? null : ctx.spec.skinLine)));
    return out;
  }

  /* ---------- eyes, brows, mouth ---------- */
  function eye(ctx, key, cx, cy, w, h, tilt, f, isFar) {
    const N = 12, top = [], bot = [];
    for (let i = 0; i <= N; i++) {
      const u = -1 + (2 * i) / N, x = cx + (u * w) / 2;
      const lift = tilt * u; // outer corner (+x) lifted
      top.push([x, cy - h * 0.62 * Math.pow(1 - u * u, 0.62) - lift]);
      bot.push([x, cy + h * 0.38 * Math.pow(1 - u * u, 0.85) - lift * 0.6]);
    }
    const shapeD = poly(top.concat(bot.slice().reverse()));
    const clipId = `${ctx.prefix}-clip-${key}`;
    const close = clamp(f.lid + f.blink * (1 - f.lid), 0, 1);
    const edge = top.map((p, i) => [p[0], lerp(p[1], bot[i][1], close)]);
    const lidD = poly(top.map((p) => [p[0], p[1] - h * 0.9]).concat(edge.slice().reverse()));
    const gx = clamp(f.gazeX, -1, 1) * w * 0.2, gy = clamp(f.gazeY, -1, 1) * h * 0.22;
    const ir = h * 0.52, icx = cx + gx + (isFar ? w * 0.06 : w * 0.04), icy = cy + gy;
    let s = `<clipPath id="${clipId}"><path d="${shapeD}"/></clipPath>`;
    s += `<path d="${shapeD}" fill="${ctx.fillOf('eyeWhite')}"/>`;
    s += `<g clip-path="url(#${clipId})">`;
    s += `<circle cx="${n(icx)}" cy="${n(icy)}" r="${n(ir)}" fill="${ctx.fillOf('iris')}"/>`;
    if (!ctx.wb) {
      s += `<circle cx="${n(icx)}" cy="${n(icy)}" r="${n(ir * 0.5)}" fill="${C.pupil}"/>`;
      s += `<circle cx="${n(icx + ir * 0.35)}" cy="${n(icy - ir * 0.4)}" r="${n(ir * 0.26)}" fill="#fff"/>`;
    }
    s += `<path d="${lidD}" fill="${ctx.fillOf('skin')}"/>`;
    s += '</g>';
    // lash line follows the lid edge; a short wing at the outer corner
    const lash = 'M' + edge.map((p) => `${n(p[0])},${n(p[1])}`).join(' L');
    const o = edge[N];
    s += `<path d="${lash} L${n(o[0] + w * 0.12)},${n(o[1] - h * 0.18)}" fill="none" stroke="${ctx.lineCol}" stroke-width="${n(ctx.wb ? ctx.lw * 0.8 : 2.8)}" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (!ctx.wb) s += `<path d="M${n(bot[2][0])},${n(bot[2][1])} Q${n(cx)},${n(bot[6][1] + 1)} ${n(bot[10][0])},${n(bot[10][1])}" fill="none" stroke="${ctx.spec.skinLine}" stroke-width="1" opacity=".6"/>`;
    // crease above the eye, reads as a lid fold when open
    if (!ctx.wb && close < 0.7) s += `<path d="M${n(top[2][0])},${n(top[2][1] - h * 0.32)} Q${n(cx)},${n(top[6][1] - h * 0.45)} ${n(top[11][0])},${n(top[11][1] - h * 0.28)}" fill="none" stroke="${ctx.spec.skinLine}" stroke-width="1" opacity=".55"/>`;
    return s;
  }

  function brow(ctx, xi, yi, xo, yo, ti, to, arch) {
    const mx = (xi + xo) / 2, my = (yi + yo) / 2 - arch;
    const d = `M${n(xi)},${n(yi - ti / 2)} Q${n(mx)},${n(my - (ti + to) / 4)} ${n(xo)},${n(yo - to / 2)} Q${n(mx)},${n(my + (ti + to) / 4)} ${n(xi)},${n(yi + ti / 2)} Z`;
    if (ctx.wb) return `<path d="${d}" fill="${C.navy}" stroke="${C.navy}" stroke-width="2" stroke-linejoin="round"/>`;
    return `<path d="${d}" fill="${C.hair}"/>`;
  }

  function mouth(ctx, mx, my, hwN, hwF, f) {
    const sm = f.smile, asym = f.mouthAsym || 0, op = f.mouthOpen || 0;
    const cN = [mx - hwN, my - sm * 3.2 + asym * 1.5], cF = [mx + hwF, my - sm * 3.2 - asym * 2.2];
    const midY = my + sm * 1.6;
    let s = '';
    const upper = `M${n(cN[0])},${n(cN[1])} Q${n(mx - hwN * 0.4)},${n(my - 4.2)} ${n(mx)},${n(my - 3)} Q${n(mx + hwF * 0.4)},${n(my - 4.4)} ${n(cF[0])},${n(cF[1])}`;
    const lineD = `M${n(cN[0])},${n(cN[1])} Q${n(mx)},${n(midY + op * 2)} ${n(cF[0])},${n(cF[1])}`;
    const lowY = midY + 4.5 + op * 7;
    const lower = `Q${n(mx)},${n(lowY + 2.5)} ${n(cN[0])},${n(cN[1])}`;
    if (!ctx.wb) {
      s += `<path d="${upper} ${lower} Z" fill="${ctx.spec.lip}"/>`;
      if (op > 0.02) s += `<path d="${lineD} Q${n(mx)},${n(midY + op * 9)} ${n(cN[0])},${n(cN[1])} Z" fill="#4A1F1C"/>`;
      s += `<path d="M${n(mx - hwN * 0.3)},${n(lowY - 0.5)} Q${n(mx)},${n(lowY + 0.8)} ${n(mx + hwF * 0.3)},${n(lowY - 0.5)}" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
    }
    s += `<path d="${lineD}" fill="none" stroke="${ctx.wb ? C.navy : '#5A2A26'}" stroke-width="${ctx.wb ? ctx.lw * 0.7 : 2}" stroke-linecap="round"/>`;
    // smile dimple marks at the corners
    if (!ctx.wb && sm > 0.3) s += `<path d="M${n(cF[0] + 1)},${n(cF[1] - 3)} q2,3 0,6" stroke="${ctx.spec.skinLine}" stroke-width="1.1" fill="none" opacity=".7" stroke-linecap="round"/>`;
    return s;
  }

  /* ---------- heads ---------- */
  function face(ctx, f) {
    // Features shift with yaw (turn) and pitch so the head reads as a volume.
    const tx = (f.turn || 0) * 5, py = (f.pitch || 0) * 5;
    const isCoach = ctx.id === 'coach-01';
    let s = '';
    const g = (x, y) => [x + tx, y + py];
    // eyes
    const eN = g(isCoach ? -13 : -14, isCoach ? -69 : -70), eF = g(isCoach ? 22 : 23, isCoach ? -69 : -70);
    const wN = isCoach ? 22 : 21, wF = isCoach ? 17 : 16, h = isCoach ? 11 : 9.5;
    s += eye(ctx, 'eN', eN[0], eN[1], wN, h, isCoach ? 1.6 : 0.6, f, false);
    s += eye(ctx, 'eF', eF[0], eF[1], wF, h * 0.96, isCoach ? 1.4 : 0.5, f, true);
    // brows: raise per side, inner raise (worry, +) / knit (-)
    const bN = f.browN ?? f.brow ?? 0, bF = f.browF ?? f.brow ?? 0, bi = f.browIn || 0;
    const bt = isCoach ? 4.2 : 5.6;
    s += brow(ctx, eN[0] + wN * 0.42, eN[1] - 12 - bN * 4 - bi * 3, eN[0] - wN * 0.58, eN[1] - 13 - bN * 5 + bi * 1.5, bt, bt * 0.55, 3 + bN);
    s += brow(ctx, eF[0] - wF * 0.4, eF[1] - 12 - bF * 4 - bi * 3, eF[0] + wF * 0.66, eF[1] - 11 - bF * 5 + bi * 1.5, bt * 0.9, bt * 0.5, 2.5 + bF);
    // nose: bridge line on the far side, tip and nostril
    const nb = g(isCoach ? 10 : 11, -64), nt = g(isCoach ? 16 : 18, isCoach ? -47 : -46);
    const nlc = ctx.wb ? C.navy : ctx.spec.skinLine;
    s += `<path d="M${n(nb[0])},${n(nb[1])} Q${n(nt[0] + 2)},${n(nt[1] - 8)} ${n(nt[0] + 1)},${n(nt[1] - 1)} Q${n(nt[0] - 1)},${n(nt[1] + 2)} ${n(nt[0] - 6)},${n(nt[1] + 1)}" fill="none" stroke="${nlc}" stroke-width="${ctx.wb ? ctx.lw * 0.6 : 1.7}" stroke-linecap="round"/>`;
    s += `<path d="M${n(nt[0] - 11)},${n(nt[1] - 1)} q2,2.5 5,2" fill="none" stroke="${nlc}" stroke-width="${ctx.wb ? ctx.lw * 0.5 : 1.4}" stroke-linecap="round"/>`;
    // cheeks
    if (!ctx.wb) {
      const ck = g(-20, -48);
      s += `<ellipse cx="${n(ck[0])}" cy="${n(ck[1])}" rx="10" ry="6" fill="${C.blush}" opacity="${n(0.16 + Math.max(0, f.smile) * 0.12)}"/>`;
    }
    // coachee beard sits under the mouth
    if (!isCoach) s += beard(ctx, tx, py, f);
    const m = g(isCoach ? 10 : 11, isCoach ? -32 : -31);
    s += mouth(ctx, m[0], m[1], isCoach ? 12 : 12, isCoach ? 9 : 9, f);
    return s;
  }

  function beard(ctx, tx, py, f) {
    const sh = (pts) => pts.map(([x, y]) => [x + tx * 0.5, y + py * 0.4]);
    const jaw = (f.mouthOpen || 0) * 4;
    const outer = sh([[-48, -74], [-47, -54], [-40, -34], [-28, -18], [-12, -7 + jaw], [6, -3 + jaw], [22, -6 + jaw], [36, -18], [44, -36], [47, -56], [46, -66]]);
    const inner = sh([[42, -60], [38, -46], [31, -36], [24, -41], [16, -43], [8, -42], [0, -41], [-8, -38], [-17, -42], [-27, -50], [-36, -62], [-40, -76]]);
    const d = smooth(outer, false) + ' L' + smooth(inner, false).slice(1) + ' Z';
    let s = '';
    if (ctx.wb) s += `<path d="${d}" fill="${C.ivory}" stroke="${C.navy}" stroke-width="${ctx.lw * 0.7}" stroke-linejoin="round"/>`;
    else {
      s += `<path d="${d}" fill="${C.hair}" opacity=".93"/>`;
      // soft stubble edge on the cheek
      s += `<path d="${smooth(inner, false)}" fill="none" stroke="${C.hair}" stroke-width="3" opacity=".35"/>`;
      // texture flecks (fixed positions)
      [[-30, -36], [-20, -26], [-6, -18], [10, -16], [24, -22], [34, -32], [-38, -50], [40, -46], [0, -26], [16, -28]].forEach(([x, y]) => {
        s += `<path d="M${n(x + tx * 0.5)},${n(y + py * 0.4)} q1.5,3 0,5" stroke="${C.hairHi}" stroke-width="1.1" fill="none" opacity=".7"/>`;
      });
    }
    return s;
  }

  function coachHairBack(ctx) {
    const pts = [[0, -146], [-30, -144], [-58, -128], [-74, -102], [-78, -76], [-86, -58], [-82, -38], [-90, -20], [-80, -2], [-66, 6], [-54, -4], [-44, 4], [-30, -8],
      [40, -8], [52, 2], [66, -6], [72, -22], [68, -40], [74, -58], [66, -78], [64, -104], [48, -132], [24, -146]];
    let s = ctx.shape(smooth(pts), 'hair', 'normal');
    if (!ctx.wb) {
      s += ctx.line('M-70,-80 Q-80,-50 -70,-28 Q-64,-14 -72,-2', 1.1, C.hairHi);
      s += ctx.line('M-60,-110 Q-74,-80 -64,-56', 1, C.hairHi);
      s += ctx.line('M60,-60 Q66,-40 58,-20', 1, C.hairHi);
    }
    return s;
  }
  function coachHairFront(ctx, f) {
    const tx = (f.turn || 0) * 2;
    // side part on the near side; the fringe sweeps across to the far temple
    const pts = [[-44, -76], [-50, -104], [-36, -130], [-10, -142], [20, -140], [44, -126], [56, -100], [56, -72], [62, -50], [56, -32], [48, -26], [50, -42], [44, -62],
      [40, -86], [30, -104], [12, -110], [-8, -116], [-22, -114], [-30, -100], [-38, -86]].map(([x, y]) => [x + tx, y]);
    let s = ctx.shape(smooth(pts), 'hair', 'normal');
    if (!ctx.wb) {
      s += ctx.line(`M${-24 + tx},-132 Q${10 + tx},-126 ${40 + tx},-108`, 1.2, C.hairHi);
      s += ctx.line(`M${-34 + tx},-120 Q${-36 + tx},-104 ${-40 + tx},-90`, 1.1, C.hairHi);
      s += ctx.line(`M${48 + tx},-96 Q${52 + tx},-70 ${48 + tx},-52`, 1.1, C.hairHi);
    } else {
      s += ctx.line(`M${-24 + tx},-132 Q${10 + tx},-126 ${40 + tx},-108`);
    }
    return s;
  }

  // Short dark curls: scalloped silhouette plus fixed curl marks.
  const CURL_DOME = (() => {
    const pts = [];
    for (let i = 0; i <= 16; i++) {
      const a = Math.PI * (1.06 + (0.98 * i) / 16); // from near temple over the top to far temple
      const rx = 56, ry = 60;
      const wob = i % 2 ? 3 : -1;
      pts.push([4 + Math.cos(a) * (rx + wob), -98 + Math.sin(a) * (ry + wob)]);
    }
    return pts;
  })();
  function coacheeHairBack(ctx) {
    const pts = CURL_DOME.map(([x, y]) => [x - 2, y + 4]).concat([[50, -70], [44, -56], [-46, -56], [-52, -76]]);
    return ctx.shape(smooth(pts), 'hair', 'normal');
  }
  function coacheeHairFront(ctx, f) {
    const tx = (f.turn || 0) * 2;
    const dome = CURL_DOME.map(([x, y]) => [x + tx, y]);
    // hairline: from far temple back to near temple, slightly irregular
    const hl = [[48, -88], [38, -104], [24, -112], [8, -114], [-10, -112], [-26, -106], [-40, -94], [-50, -82]].map(([x, y]) => [x + tx, y]);
    const d = scallop(dome, 0.6).replace(/ Z$/, '') + ' L' + hl.map((p) => `${n(p[0])},${n(p[1])}`).join(' L') + ' Z';
    let s = ctx.shape(d, 'hair', 'normal');
    // curl marks, fixed positions
    const curls = [[-30, -136], [-12, -146], [8, -148], [26, -140], [40, -126], [-40, -120], [-22, -126], [-2, -132], [18, -128], [34, -114], [-44, -102], [-28, -112], [-8, -120], [12, -118]];
    curls.forEach(([x, y], i) => {
      const r = 5 + (i % 3);
      const d2 = `M${n(x + tx - r)},${n(y)} a${r},${r} 0 1 1 ${n(r * 1.4)},${n(r * 0.9)}`;
      s += ctx.line(d2, ctx.wb ? 0.6 : 0.9, ctx.wb ? null : C.hairHi);
    });
    // sideburn into the beard
    s += ctx.shape(`M${-50 + tx},-84 L${-47 + tx},-66 L${-40 + tx},-70 L${-42 + tx},-86 Z`, 'hair', 'normal');
    return s;
  }

  function head(ctx, f) {
    const isCoach = ctx.id === 'coach-01';
    const off = [4, -24]; // face origin within the head frame (neck length)
    let s = `<g transform="translate(${off[0]} ${off[1]})">`;
    const faceD = isCoach
      ? 'M-6,-126 C-30,-126 -45,-108 -46,-82 C-47,-58 -42,-40 -32,-28 C-18,-14 0,-10 12,-11 C24,-12 34,-24 40,-40 C45,-52 46,-62 44,-72 C46,-84 44,-100 38,-110 C28,-124 14,-127 -6,-126 Z'
      : 'M-4,-130 C-32,-130 -49,-112 -49,-84 C-49,-58 -45,-38 -33,-23 C-19,-9 0,-5 14,-6 C28,-7 40,-21 44,-39 C48,-53 48,-65 46,-75 C48,-91 46,-105 40,-115 C30,-129 14,-131 -4,-130 Z';
    s += ctx.shape(faceD, 'skin', 'normal');
    // under-hair forehead shadow + jaw shadow are cel shading
    s += ctx.shade(isCoach ? 'M-44,-62 C-44,-44 -36,-30 -24,-22 C-34,-36 -38,-50 -36,-66 Z' : 'M-47,-60 C-46,-42 -38,-28 -26,-18 C-36,-34 -40,-48 -38,-62 Z', ctx.spec.skinShade, 0.6);
    // near ear
    const ear = isCoach ? [-45, -66] : [-48, -68];
    s += ctx.shape(ellipse(ear[0], ear[1], 7.5, 12.5), 'skin', 'normal');
    s += ctx.line(`M${ear[0] + 1},${ear[1] - 6} q-4,5 0,10`, 0.6, ctx.wb ? null : ctx.spec.skinLine);
    s += face(ctx, f);
    if (isCoach) {
      s += coachHairFront(ctx, f);
      // small gold hoop below the near ear
      s += `<circle cx="${ear[0] - 1}" cy="${ear[1] + 17}" r="5" fill="none" stroke="${ctx.fillOf('gold')}" stroke-width="3"/>`;
    } else {
      s += coacheeHairFront(ctx, f);
    }
    return s + '</g>';
  }

  /* ---------- torso & clothing ---------- */
  function coachTorso(ctx) {
    let s = '';
    s += ctx.shape('M-20,-294 L22,-294 L20,-262 Q2,-250 -18,-262 Z', 'skin', 'normal');
    s += ctx.shape('M-38,-272 Q-18,-262 0,-257 Q18,-262 36,-272 L38,-92 Q0,-86 -40,-92 Z', 'teal', 'normal');
    s += ctx.shade('M14,-250 Q24,-180 20,-96 L36,-94 L35,-268 Z', C.tealShade, 0.55);
    s += ctx.line('M-8,-200 Q-2,-150 -10,-110', 0.6);
    // open navy blazer, two panels
    s += ctx.shape('M-24,-294 C-44,-290 -58,-284 -66,-268 C-78,-210 -80,-80 -78,66 L-30,70 C-28,0 -22,-100 -24,-150 C-26,-200 -26,-250 -24,-294 Z', 'navy', 'normal');
    s += ctx.shape('M22,-294 C34,-290 44,-282 48,-264 C58,-200 60,-80 58,66 L28,70 C26,0 22,-100 24,-150 C26,-200 26,-250 22,-294 Z', 'navy', 'normal');
    s += ctx.shade('M44,-240 C52,-180 54,-80 52,62 L58,62 C60,-60 58,-200 48,-262 Z', C.navyShade, 0.8);
    s += ctx.shape('M-24,-294 L-40,-262 L-52,-246 L-43,-238 L-28,-146 L-24,-150 C-26,-200 -26,-250 -24,-294 Z', 'navyLight', 'normal');
    s += ctx.shape('M22,-294 L34,-264 L41,-248 L33,-241 L25,-146 L24,-150 C26,-200 26,-250 22,-294 Z', 'navyLight', 'normal');
    s += ctx.line('M-70,-2 L-40,0', 0.8);
    s += ctx.line('M54,-4 L36,-2', 0.8);
    return s;
  }
  function coachPelvis(ctx) {
    let s = ctx.shape('M-42,-120 Q0,-124 40,-120 L44,-20 Q46,8 40,22 L-44,22 Q-48,8 -46,-20 Z', 'cloth', 'normal');
    s += ctx.line('M-42,-104 Q0,-108 40,-104', 0.8);
    s += ctx.line('M4,-104 Q6,-70 2,-30', 0.7);
    s += `<circle cx="4" cy="-112" r="2.4" fill="${ctx.fillOf('cloth')}" stroke="${ctx.lineCol}" stroke-width="1"/>`;
    return s;
  }
  function coacheeTorso(ctx) {
    let s = '';
    s += ctx.shape('M-24,-310 L24,-310 L22,-282 Q0,-272 -22,-282 Z', 'skin', 'normal');
    // ivory tee, crew neck
    s += ctx.shape('M-44,-290 Q-24,-284 -18,-282 Q0,-268 20,-282 Q28,-286 42,-290 L44,-70 Q0,-62 -46,-70 Z', 'tee', 'normal');
    s += ctx.line('M-20,-282 Q0,-266 20,-282', 0.8);
    s += ctx.shade('M20,-250 Q28,-160 24,-74 L42,-72 L42,-282 Z', C.teeShade, 0.8);
    // amber overshirt, open, longer hem
    s += ctx.shape('M-26,-308 C-46,-304 -64,-298 -72,-282 C-84,-220 -86,-80 -84,78 L-34,84 C-32,0 -26,-100 -28,-160 C-30,-220 -32,-270 -26,-308 Z', 'amber', 'normal');
    s += ctx.shape('M24,-308 C38,-304 50,-296 54,-278 C64,-210 66,-80 64,78 L30,84 C28,0 24,-100 26,-160 C28,-220 30,-270 24,-308 Z', 'amber', 'normal');
    s += ctx.shade('M50,-250 C58,-180 60,-80 58,74 L64,74 C66,-60 64,-200 54,-278 Z', C.amberShade, 0.7);
    // collars
    s += ctx.shape('M-26,-312 L-46,-292 L-54,-270 L-36,-262 L-28,-280 Z', 'amberLight', 'normal');
    s += ctx.shape('M24,-312 L38,-292 L44,-272 L32,-266 L26,-282 Z', 'amberLight', 'normal');
    // chest pocket on the far panel, buttons on the near placket
    s += ctx.shape('M30,-232 L52,-234 L53,-196 L32,-194 Z', 'amber', 'normal');
    s += ctx.line('M30,-224 L52,-226', 0.6);
    [-230, -180, -130, -80, -30, 20].forEach((y) => (s += `<circle cx="-32" cy="${y}" r="2.6" fill="${ctx.fillOf('amberLight')}" stroke="${ctx.lineCol}" stroke-width="1"/>`));
    s += ctx.line('M-78,-140 Q-70,-100 -76,-60', 0.6);
    return s;
  }
  function coacheePelvis(ctx) {
    let s = ctx.shape('M-44,-60 Q0,-64 42,-60 L46,-10 Q48,10 42,24 L-46,24 Q-50,10 -48,-10 Z', 'navy', 'normal');
    s += ctx.line('M-44,-48 Q0,-52 42,-48', 0.8, ctx.wb ? null : C.navyLight);
    s += ctx.line('M4,-48 Q6,-20 2,8', 0.7, ctx.wb ? null : C.navyLight);
    return s;
  }

  /* ---------- limbs ---------- */
  function arm(ctx, side, a) {
    const sp = ctx.spec, isCoach = ctx.id === 'coach-01';
    const anat = SIDES[ctx.id][side];
    const sh = side === 'N' ? sp.shN : sp.shF;
    const U = sp.upper, F = sp.fore;
    const wSh = isCoach ? 21 : 24, wEl = isCoach ? 17 : 20;
    return ctx.group(`upper-arm-${anat}`, sh[0], sh[1], a.sh, () => {
      let s = '';
      // sleeve: rounded cap at the shoulder, overlaps the forearm at the elbow
      s += ctx.shape(`M${-wSh},-4 C${-wSh - 2},${U * 0.35} ${-wEl - 1},${U * 0.75} ${-wEl},${U + 6} L${wEl},${U + 6} C${wEl + 1},${U * 0.75} ${wSh + 2},${U * 0.35} ${wSh},-8 Q0,-${wSh + 4} ${-wSh},-4 Z`, isCoach ? 'navy' : 'amber');
      s += ctx.shape(ellipse(0, U, wEl + 1, wEl * 0.9), isCoach ? 'navy' : 'amber');
      s += ctx.group(`forearm-${anat}`, 0, U, a.el, () => {
        let t = '';
        if (isCoach) {
          t += ctx.shape(`M${-wEl},-6 L${-15},${F - 12} L15,${F - 12} L${wEl},-6 Z`, 'navy');
          t += ctx.shape(`M-12,${F - 16} L-11,${F + 4} L11,${F + 4} L12,${F - 16} Z`, 'skin');
          t += ctx.shape(`M-17,${F - 26} L-16,${F - 10} L16,${F - 10} L17,${F - 26} Z`, 'navy');
          t += ctx.line(`M-16,${F - 26} L16,${F - 26}`, 0.6, ctx.wb ? null : C.navyLight);
        } else {
          // rolled sleeve at the elbow, bare forearm
          t += ctx.shape(`M-15,4 L-12,${F + 4} L12,${F + 4} L15,4 Z`, 'skin');
          t += ctx.shape(`M${-wEl - 2},-8 L${-wEl - 1},26 Q0,32 ${wEl + 1},26 L${wEl + 2},-8 Z`, 'amberLight');
          t += ctx.line(`M${-wEl},10 Q0,15 ${wEl},10`, 0.6);
          if (anat === 'L') {
            // watch on his left wrist
            t += ctx.shape(`M-13,${F - 18} L-13,${F - 6} L13,${F - 6} L13,${F - 18} Z`, 'watch', 'detail');
            t += `<rect x="-6" y="${F - 20}" width="12" height="16" rx="3" fill="${ctx.fillOf('watchFace')}" stroke="${ctx.lineCol}" stroke-width="1.2"/>`;
          }
        }
        t += ctx.group(`hand-${anat}`, 0, F, a.wr || 0, () => hand(ctx, a.hand || 'relaxed', isCoach ? 1 : 1.12, side));
        return t;
      });
      return s;
    });
  }

  function leg(ctx, side, a) {
    const sp = ctx.spec, isCoach = ctx.id === 'coach-01';
    const anat = SIDES[ctx.id][side];
    const hip = side === 'N' ? sp.hipN : sp.hipF;
    const T = sp.thigh, Sh = sp.shin;
    return ctx.chain(() => ctx.group(`thigh-${anat}`, hip[0], hip[1], a.hip, () => {
      let s = '';
      if (isCoach) s += ctx.shape(`M-26,-16 Q-31,${T * 0.5} -29,${T + 4} L29,${T + 4} Q29,${T * 0.5} 25,-16 Z`, 'cloth');
      else s += ctx.shape(`M-24,-16 Q-26,${T * 0.5} -21,${T + 4} L21,${T + 4} Q24,${T * 0.5} 24,-16 Z`, 'navy');
      s += ctx.shape(ellipse(0, T, isCoach ? 29 : 21, isCoach ? 22 : 18), isCoach ? 'cloth' : 'navy');
      s += ctx.line(`M2,10 L1,${T - 10}`, 0.5, ctx.wb ? null : (isCoach ? C.clothShade : C.navyLight));
      s += ctx.group(`shin-${anat}`, 0, T, a.knee, () => {
        let t = '';
        if (isCoach) {
          t += ctx.shape(`M-29,-6 L-36,${Sh + 6} L34,${Sh + 6} L29,-6 Z`, 'cloth');
          t += ctx.line(`M1,6 L0,${Sh}`, 0.5, ctx.wb ? null : C.clothShade);
        } else {
          t += ctx.shape(`M-21,-6 L-18,${Sh - 2} L18,${Sh - 2} L21,-6 Z`, 'navy');
          t += ctx.shape(`M-19,${Sh - 18} L-19,${Sh + 2} L19,${Sh + 2} L19,${Sh - 18} Z`, 'navy');
          t += ctx.line(`M-19,${Sh - 18} L19,${Sh - 18}`, 0.6, ctx.wb ? null : C.navyLight);
        }
        t += ctx.group(`foot-${anat}`, 0, Sh, a.ankle || 0, () => foot(ctx, side));
        return t;
      });
      return s;
    }));
  }

  function foot(ctx, side) {
    const isCoach = ctx.id === 'coach-01';
    const k = side === 'F' ? 0.92 : 1;
    let s = '';
    if (isCoach) {
      s += ctx.shape(`M${-16 * k},-4 L${14 * k},-8 Q${40 * k},-6 ${48 * k},6 Q${50 * k},16 ${42 * k},18 L${-18 * k},18 Q${-22 * k},8 ${-16 * k},-4 Z`, 'shoe');
      if (ctx.pass !== 'ol') s += `<path d="M${18 * k},-2 L${30 * k},0" stroke="${ctx.fillOf('gold')}" stroke-width="3" stroke-linecap="round"/>`;
    } else {
      s += ctx.shape(`M${-18 * k},-6 L${12 * k},-10 Q${42 * k},-4 ${52 * k},10 L${54 * k},16 L${-20 * k},16 Z`, 'shoe');
      s += ctx.shape(`M${-21 * k},12 L${55 * k},12 Q${57 * k},22 ${50 * k},22 L${-20 * k},22 Z`, 'sole');
      s += ctx.line(`M${8 * k},-6 L${20 * k},4 M${14 * k},-8 L${26 * k},2`, 0.6, ctx.wb ? null : '#5A6070');
    }
    return s;
  }

  /* ---------- whole character ---------- */
  const DEFAULT_FACE = { brow: 0, browIn: 0, lid: 0.12, blink: 0, smile: 0.25, mouthOpen: 0, mouthAsym: 0, gazeX: 0.4, gazeY: 0, turn: 0, pitch: 0 };

  function renderCharacter(id, pose, opts = {}) {
    const ctx = makeCtx(id, opts);
    const sp = ctx.spec;
    const p = pose;
    const f = Object.assign({}, DEFAULT_FACE, p.face || {});
    const rootM = trs(p.x || 0, p.y || 0, 0, (p.s || 1) * sp.dir, p.s || 1);
    ctx.stack = [rootM];
    ctx.mats.root = rootM;
    const breath = p.breath || 0;
    const body = () => {
      let s = '';
      s += ctx.group('pelvis', 0, 0, p.pelvis || 0, () => {
        let q = '';
        q += leg(ctx, 'F', p.legF);
        q += leg(ctx, 'N', p.legN);
        q += ctx.id === 'coach-01' ? coachPelvis(ctx) : coacheePelvis(ctx);
        q += ctx.group('torso', sp.waist[0], sp.waist[1] - breath * 1.6, p.torso || 0, () => {
          let t = '';
          t += ctx.chain(() => arm(ctx, 'F', p.armF));
          // back hair hangs behind the torso but follows the head transform
          const hb = () => ctx.group(null, sp.neck[0], sp.neck[1], p.head || 0, () =>
            `<g transform="translate(4 -24)">${ctx.id === 'coach-01' ? coachHairBack(ctx) : coacheeHairBack(ctx)}</g>`);
          t += `<g id="${ctx.prefix}-hair-back">${hb()}</g>`;
          t += `<g id="${ctx.prefix}-wardrobe-front">${ctx.id === 'coach-01' ? coachTorso(ctx) : coacheeTorso(ctx)}</g>`;
          t += `<g id="${ctx.prefix}-neck">` + ctx.shape(ctx.id === 'coach-01' ? 'M-14,-286 L-12,-326 L18,-326 L18,-286 Z' : 'M-17,-300 L-15,-344 L21,-344 L21,-300 Z', 'skin', 'normal') +
            ctx.shade(ctx.id === 'coach-01' ? 'M-13,-320 L18,-322 L18,-306 Q2,-300 -13,-306 Z' : 'M-16,-338 L21,-340 L21,-322 Q2,-316 -16,-322 Z', sp.skinShade, 0.7) + '</g>';
          t += ctx.group('head', sp.neck[0], sp.neck[1], p.head || 0, () => head(ctx, f));
          t += ctx.chain(() => arm(ctx, 'N', p.armN));
          return t;
        });
        return q;
      });
      return s;
    };
    const inner = body();
    if (opts.out) {
      opts.out.mats = ctx.mats;
      opts.out.spec = sp;
    }
    const m = rootM;
    return `<g id="${ctx.prefix}-root" data-character="${id}" transform="matrix(${m.map(n).join(' ')})">${inner}</g>`;
  }

  /* ---------- kinematics helpers ---------- */
  function worldPoint(out, joint, x = 0, y = 0) {
    return apply(out.mats[joint], x, y);
  }
  // Two-bone IK in the parent frame of the upper arm. Returns {sh, el} in degrees.
  // Bone direction for angle t is (-sin t, cos t). bend = +1 / -1 picks the elbow side.
  function solveArm(shoulder, target, a, b, bend) {
    const vx = target[0] - shoulder[0], vy = target[1] - shoulder[1];
    const D = clamp(Math.hypot(vx, vy), Math.abs(a - b) + 1e-3, a + b - 1e-3);
    const phi = Math.atan2(-vx, vy);
    const alpha = Math.acos(clamp((a * a + D * D - b * b) / (2 * a * D), -1, 1));
    const gamma = Math.acos(clamp((a * a + b * b - D * D) / (2 * a * b), -1, 1));
    const sh = phi + bend * alpha;
    const el = -bend * (Math.PI - gamma);
    return { sh: (sh * 180) / Math.PI, el: (el * 180) / Math.PI };
  }

  const API = { renderCharacter, worldPoint, solveArm, CHAR, SIDES, HAND_POSES, COLORS: C, mul, trs, apply, DEFAULT_FACE };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.ASRig = API;
})(typeof window !== 'undefined' ? window : globalThis);
