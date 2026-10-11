import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT} from '../brand';
import {DUR, EASE_IN_OUT, OFFSET, enter} from '../motion';
import type {Layout} from './formats';
import {Card, Chip, Headline, Portrait, Stroke, Sub, clamp01, exitOf, type IconName} from './parts';
import {CRITERIA, END_CARD, FACTORS, MILESTONES, OPTIONS, PACKAGES, sceneById} from './script';

type P = {L: Layout};
const OPTION_ICONS: IconName[] = ['role', 'field', 'way'];

// Card entrance shared by every scene: fade + rise, staggered by index.
const cardIn = (f: number, start: number, i = 0) => enter(f, start + i * DUR.stagger, DUR.card, OFFSET.card);

const Svg: React.FC<{L: Layout; children: React.ReactNode; opacity?: number}> = ({L, children, opacity = 1}) => (
  <svg width={L.width} height={L.height} style={{position: 'absolute', inset: 0, opacity}}>
    {children}
  </svg>
);

/* 1 — the career question */
export const SceneQuestion: React.FC<P> = ({L}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sc = sceneById('question');
  const out = exitOf(f, sc.dur);
  const k = L.vertical ? 1.45 : 1.15;
  const ox = L.stage.x - 100 * k;
  const oy = L.stage.y - 150 * k + (L.vertical ? 0 : 20);
  const draw = clamp01(f, 24, 72, EASE_IN_OUT);
  const dot = spring({frame: f - 70, fps, config: {damping: 16, stiffness: 160}});
  return (
    <AbsoluteFill>
      <Headline L={L} f={f} dur={sc.dur} segs={sc.headline} at={8} />
      <Sub L={L} f={f} dur={sc.dur} text={sc.sub} at={44} />
      <Svg L={L} opacity={1 - out}>
        <g transform={`translate(${ox} ${oy}) scale(${k})`}>
          <circle cx={100} cy={150} r={150} fill={COLORS.softRose} opacity={clamp01(f, 14, 40)} />
          <Stroke d="M40 92 C40 30 160 30 160 95 C160 145 100 140 100 200" drawn={draw} width={22 / k + 6} />
          <circle cx={100} cy={250} r={16} fill={COLORS.burgundy} transform={`translate(100 250) scale(${dot}) translate(-100 -250)`} />
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

/* 2 — possible directions and what is at stake */
export const SceneOptions: React.FC<P> = ({L}) => {
  const f = useCurrentFrame();
  const sc = sceneById('options');
  const out = exitOf(f, sc.dur);
  const v = L.vertical;
  const w = v ? 290 : 300;
  const gap = v ? 15 : 30;
  const cy = L.stage.y - (v ? 70 : 60);
  return (
    <AbsoluteFill>
      <Headline L={L} f={f} dur={sc.dur} segs={sc.headline} />
      <Sub L={L} f={f} dur={sc.dur} text={sc.sub} at={120} />
      {OPTIONS.map((label, i) => {
        const e = cardIn(f, 20, i);
        return (
          <Card
            key={label}
            x={L.stage.x + (i - 1) * (w + gap)}
            y={cy}
            w={w}
            h={v ? 240 : 230}
            label={label}
            icon={OPTION_ICONS[i]}
            fontSize={v ? 36 : 36}
            opacity={e.opacity * (1 - out)}
            dy={e.offset + out * 40}
          />
        );
      })}
      {FACTORS.map((label, i) => {
        const e = enter(f, 140 + i * 6, DUR.card, 24);
        const cw = v ? 250 : 230;
        return (
          <Chip
            key={label}
            x={L.stage.x + (i - 1) * (cw + (v ? 30 : 40))}
            y={cy + (v ? 230 : 210)}
            w={cw}
            label={label}
            fontSize={v ? 34 : 30}
            opacity={e.opacity * (1 - out)}
            dy={e.offset + out * 40}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* 3 — the service, introduced by the path */
export const SceneBrand: React.FC<P> = ({L}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sc = sceneById('brand');
  const out = exitOf(f, sc.dur);
  const v = L.vertical;
  const size = v ? 118 : 124;
  const lockY = v ? L.stage.y - 230 : L.stage.y - 230;
  const lineW = v ? 860 : 1000;
  const x0 = L.stage.x - lineW / 2;
  const reveal = clamp01(f, 10, 46, EASE_IN_OUT);
  const desc = enter(f, 50, DUR.heading, OFFSET.heading);
  const endorse = enter(f, 58, DUR.heading, OFFSET.heading);
  const d = v ? 250 : 200;
  const py = v ? L.stage.y + 230 : L.stage.y + 150;
  const dx = v ? 190 : 210;
  const pop = spring({frame: f - 92, fps, config: {damping: 18, stiffness: 130}});
  const names = enter(f, 106, DUR.heading, 12);
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <Sub L={L} f={f} dur={sc.dur} text={sc.sub} at={128} top={v ? L.sub.top - 150 : L.sub.top - 80} />
      <Svg L={L}>
        <Stroke d={`M${x0} ${lockY + size * 0.72} H${x0 + lineW}`} drawn={reveal} width={8} />
      </Svg>
      <div
        style={{
          position: 'absolute',
          top: lockY - size * 0.62,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT.family,
          fontWeight: 700,
          fontSize: size,
          letterSpacing: 6,
          color: COLORS.burgundy,
          // Revealed left-to-right just behind the head of the path.
          clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
        }}
      >
        ASSESS SHIFT
      </div>
      <div
        style={{
          position: 'absolute',
          top: lockY + size * 0.9,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT.family,
          color: COLORS.charcoal,
        }}
      >
        <div style={{fontWeight: 700, fontSize: v ? 48 : 46, letterSpacing: 10, opacity: desc.opacity, transform: `translateY(${desc.offset}px)`}}>
          CAREER COACHING
        </div>
        <div style={{fontWeight: 500, fontSize: v ? 32 : 28, marginTop: 8, opacity: 0.7 * endorse.opacity, transform: `translateY(${endorse.offset}px)`}}>
          by ASSESS International
        </div>
      </div>
      {(['samir', 'nour'] as const).map((who, i) => (
        <div key={who} style={{opacity: names.opacity > 0 ? 1 : 1}}>
          <Portrait
            who={who}
            x={L.stage.x + (i === 0 ? -dx : dx)}
            y={py}
            d={d}
            scale={pop}
            opacity={Math.min(1, pop * 1.4)}
            label={names.opacity > 0.01 ? (who === 'samir' ? 'Samir' : 'Nour') : undefined}
            caption="Career coach"
            blink={(f + i * 40) % 90 < 3}
          />
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* 4 — understand yourself: Samir presents insights, linked to experience */
export const SceneUnderstand: React.FC<P> = ({L}) => {
  const f = useCurrentFrame();
  const sc = sceneById('understand');
  const out = exitOf(f, sc.dur);
  const v = L.vertical;
  const insights: {label: string; icon: IconName; x: number; y: number}[] = v
    ? [
        {label: 'Interests', icon: 'interests', x: 300, y: 600},
        {label: 'Motivation', icon: 'motivation', x: 780, y: 600},
      ]
    : [
        {label: 'Interests', icon: 'interests', x: 720, y: 430},
        {label: 'Motivation', icon: 'motivation', x: 720, y: 650},
      ];
  const exp = v ? {x: 540, y: 930} : {x: 1220, y: 540};
  const links = v
    ? ['M300 680 C300 800 540 760 540 850', 'M780 680 C780 800 540 760 540 850']
    : ['M880 430 C1000 430 960 540 1050 540', 'M880 650 C1000 650 960 540 1050 540'];
  const drawn = clamp01(f, 150, 190, EASE_IN_OUT);
  const expIn = cardIn(f, 112);
  const emph = clamp01(f, 186, 204);
  return (
    <AbsoluteFill>
      <Headline L={L} f={f} dur={sc.dur} segs={sc.headline} />
      <Sub L={L} f={f} dur={sc.dur} text={sc.sub} at={60} />
      <Svg L={L} opacity={1 - out}>
        {links.map((d) => (
          <Stroke key={d} d={d} drawn={drawn} />
        ))}
      </Svg>
      {insights.map((c, i) => {
        const e = enter(f, 34 + i * DUR.stagger, DUR.card, OFFSET.card);
        return (
          <Card
            key={c.label}
            x={c.x + (1 - e.opacity) * (v ? 0 : -60)}
            y={c.y}
            w={v ? 340 : 320}
            h={v ? 150 : 140}
            label={c.label}
            icon={c.icon}
            variant="rose"
            layout="row"
            fontSize={v ? 40 : 38}
            opacity={e.opacity * (1 - out)}
            dy={v ? e.offset : 0}
          />
        );
      })}
      <Card
        x={exp.x}
        y={exp.y}
        w={v ? 420 : 380}
        h={v ? 160 : 170}
        label="Your experience"
        icon="experience"
        layout="row"
        fontSize={v ? 42 : 38}
        opacity={expIn.opacity * (1 - out)}
        dy={expIn.offset}
        emphasis={emph}
      />
    </AbsoluteFill>
  );
};

/* 5 — compare directions: Nour invites comparison through three lenses */
export const SceneCompare: React.FC<P> = ({L}) => {
  const f = useCurrentFrame();
  const sc = sceneById('compare');
  const out = exitOf(f, sc.dur);
  const v = L.vertical;
  const chipW = v ? 270 : 290;
  const chipGap = v ? 20 : 50;
  const chipY = v ? 590 : 330;
  const optW = v ? 290 : 300;
  const optGap = v ? 15 : 30;
  const optY = v ? 900 : 610;
  const optH = v ? 220 : 210;
  // Each option is held under the lenses for the same length of time.
  const LENS = [150, 196, 242] as const;
  const LENS_LEN = 46;
  const allEqual = clamp01(f, 300, 316);
  return (
    <AbsoluteFill>
      <Headline L={L} f={f} dur={sc.dur} segs={sc.headline} />
      <Sub L={L} f={f} dur={sc.dur} text={sc.sub} at={60} />
      <Svg L={L} opacity={1 - out}>
        {OPTIONS.map((_, oi) => {
          const local = f - LENS[oi];
          const on = local >= 0 && local < LENS_LEN ? 1 : 0;
          const drawn = on ? clamp01(local, 0, 16) : 0;
          const fade = on ? 1 - clamp01(local, LENS_LEN - 10, LENS_LEN) : 0;
          const ox = L.stage.x + (oi - 1) * (optW + optGap);
          return CRITERIA.map((_, ci) => {
            const cx = L.stage.x + (ci - 1) * (chipW + chipGap);
            const y0 = chipY + 34;
            const y1 = optY - optH / 2 - 6;
            return (
              <Stroke
                key={`${oi}-${ci}`}
                d={`M${cx} ${y0} C${cx} ${(y0 + y1) / 2} ${ox} ${(y0 + y1) / 2} ${ox} ${y1}`}
                drawn={drawn}
                width={5}
                opacity={fade}
              />
            );
          });
        })}
      </Svg>
      {CRITERIA.map((label, i) => {
        const e = enter(f, 34 + i * 6, DUR.card, 24);
        return (
          <Chip
            key={label}
            x={L.stage.x + (i - 1) * (chipW + chipGap)}
            y={chipY}
            w={chipW}
            label={label}
            fontSize={v ? 34 : 32}
            opacity={e.opacity * (1 - out)}
            dy={e.offset}
          />
        );
      })}
      {OPTIONS.map((label, i) => {
        const e = cardIn(f, 70, i);
        const local = f - LENS[i];
        const lens = local >= 0 && local < LENS_LEN ? clamp01(local, 0, 10) * (1 - clamp01(local, LENS_LEN - 10, LENS_LEN)) : 0;
        return (
          <Card
            key={label}
            x={L.stage.x + (i - 1) * (optW + optGap)}
            y={optY}
            w={optW}
            h={optH}
            label={label}
            icon={OPTION_ICONS[i]}
            fontSize={36}
            opacity={e.opacity * (1 - out)}
            dy={e.offset}
            emphasis={Math.max(lens, allEqual * 0.6)}
            scale={1 + 0.03 * lens}
          />
        );
      })}
      <Sub L={L} f={f} dur={sc.dur} text={sc.note} at={250} top={optY + optH / 2 + (v ? 40 : 34)} />
    </AbsoluteFill>
  );
};

/* 6 — a practical plan with modest milestones */
export const ScenePlan: React.FC<P> = ({L}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sc = sceneById('plan');
  const out = exitOf(f, sc.dur);
  const v = L.vertical;
  const nodes = v
    ? [
        {x: 330, y: 600},
        {x: 330, y: 790},
        {x: 330, y: 980},
      ]
    : [
        {x: 600, y: 520},
        {x: 960, y: 520},
        {x: 1320, y: 520},
      ];
  const d = v ? 'M330 600 L330 980' : 'M600 520 L1320 520';
  const REACH = [36, 96, 156] as const;
  const drawn = clamp01(f, REACH[0], REACH[2], (t) => t);
  return (
    <AbsoluteFill>
      <Headline L={L} f={f} dur={sc.dur} segs={sc.headline} />
      <Sub L={L} f={f} dur={sc.dur} text={sc.sub} at={50} />
      <Svg L={L} opacity={1 - out}>
        <path d={d} stroke={COLORS.burgundy} strokeOpacity={0.15} strokeWidth={8} strokeLinecap="round" opacity={clamp01(f, 20, 34)} />
        <Stroke d={d} drawn={drawn} width={8} />
        {nodes.map((n, i) => {
          const pop = spring({frame: f - REACH[i], fps, config: {damping: 16, stiffness: 150}});
          return (
            <g key={i} transform={`translate(${n.x} ${n.y}) scale(${pop})`}>
              <circle r={40} fill={COLORS.softRose} />
              <circle r={26} fill={COLORS.burgundy} />
              <text y={10} textAnchor="middle" fontFamily={FONT.family} fontWeight={700} fontSize={28} fill={COLORS.white}>
                {i + 1}
              </text>
            </g>
          );
        })}
      </Svg>
      {MILESTONES.map((label, i) => {
        const e = enter(f, REACH[i] + 6, DUR.heading, 12);
        const n = nodes[i];
        return (
          <div
            key={label}
            style={{
              position: 'absolute',
              left: v ? n.x + 70 : n.x - 200,
              top: v ? n.y - 26 : n.y + 64,
              width: v ? 520 : 400,
              textAlign: v ? 'left' : 'center',
              fontFamily: FONT.family,
              fontWeight: 700,
              fontSize: v ? 44 : 38,
              color: COLORS.charcoal,
              opacity: e.opacity * (1 - out),
              transform: `translate${v ? 'X' : 'Y'}(${e.offset}px)`,
            }}
          >
            {label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* 7 — three journeys, identical treatment */
export const ScenePackages: React.FC<P> = ({L}) => {
  const f = useCurrentFrame();
  const sc = sceneById('packages');
  const out = exitOf(f, sc.dur);
  const v = L.vertical;
  return (
    <AbsoluteFill>
      <Headline L={L} f={f} dur={sc.dur} segs={sc.headline} />
      {PACKAGES.map((label, i) => {
        const e = cardIn(f, 16, i);
        return (
          <Card
            key={label}
            x={v ? L.stage.x : L.stage.x + (i - 1) * 440}
            y={v ? 560 + i * 180 : L.stage.y - 90}
            w={v ? 780 : 400}
            h={v ? 150 : 230}
            label={label}
            icon="path"
            layout={v ? 'row' : 'column'}
            variant="white"
            fontSize={v ? 46 : 40}
            opacity={e.opacity * (1 - out)}
            dy={e.offset}
            emphasis={0.35}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* 8 — end card with the call to action */
export const SceneEnd: React.FC<P> = ({L}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = L.vertical;
  const wipe = clamp01(f, 0, 26, EASE_IN_OUT);
  const R = Math.hypot(L.width, L.height);
  const item = (i: number) => enter(f, 26 + i * 6, DUR.heading + 2, OFFSET.heading);
  const pop = spring({frame: f - 40, fps, config: {damping: 18, stiffness: 130}});
  const textLeft = v ? 90 : 170;
  const textW = v ? L.width - 180 : 1000;
  const align = v ? 'center' : 'left';
  const rows = v
    ? {lock: 330, cta: 980, action: 1180, tag: 1290, preview: 1420}
    : {lock: 150, cta: 430, action: 610, tag: 690, preview: 800};
  const block = (i: number, top: number, style: React.CSSProperties, text: string) => {
    const e = item(i);
    return (
      <div
        style={{
          position: 'absolute',
          top,
          left: textLeft,
          width: textW,
          textAlign: align,
          fontFamily: FONT.family,
          ...style,
          opacity: e.opacity * ((style.opacity as number | undefined) ?? 1),
          transform: `translateY(${e.offset}px)`,
        }}
      >
        {text}
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Svg L={L}>
        <circle cx={L.stage.x} cy={L.stage.y} r={R * wipe} fill={COLORS.deepBurgundy} />
      </Svg>
      {block(0, rows.lock, {fontWeight: 700, fontSize: v ? 104 : 96, letterSpacing: 5, color: COLORS.white}, 'ASSESS SHIFT')}
      {block(1, rows.lock + (v ? 130 : 118), {fontWeight: 700, fontSize: v ? 40 : 36, letterSpacing: 9, color: COLORS.softRose}, 'CAREER COACHING')}
      {block(2, rows.cta, {fontWeight: 700, fontSize: v ? 72 : 66, lineHeight: 1.12, color: COLORS.white}, END_CARD.cta)}
      {block(3, rows.action, {fontWeight: 500, fontSize: v ? 42 : 38, color: COLORS.softRose}, END_CARD.action)}
      {block(4, rows.tag, {fontWeight: 500, fontSize: v ? 34 : 30, color: COLORS.white, opacity: 0.75}, END_CARD.tagline)}
      {block(
        5,
        rows.preview,
        {fontWeight: 700, fontSize: v ? 26 : 22, letterSpacing: 3, color: COLORS.softRose, opacity: 0.6},
        END_CARD.url ?? 'PREVIEW · REGISTRATION LINK TO BE ADDED',
      )}
      {(['samir', 'nour'] as const).map((who, i) => (
        <Portrait
          key={who}
          who={who}
          x={v ? L.stage.x + (i === 0 ? -150 : 150) : 1410 + i * 270}
          y={v ? 740 : 470}
          d={v ? 220 : 220}
          scale={pop}
          opacity={Math.min(1, pop * 1.4)}
          bg={COLORS.ivory}
          ring={COLORS.burgundy}
          label={who === 'samir' ? 'Samir' : 'Nour'}
          labelColor={COLORS.white}
          caption="Career coach"
          blink={(f + i * 50) % 100 < 3}
        />
      ))}
    </AbsoluteFill>
  );
};
