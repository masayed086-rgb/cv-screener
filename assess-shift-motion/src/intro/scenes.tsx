import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT, OMAR_TEAL} from '../brand';
import {DUR, EASE_IN_OUT, OFFSET, enter} from '../motion';
import type {Layout} from './formats';
import {Card, Chip, Headline, Stroke, Sub, clamp01, exitOf, type IconName} from './parts';
import {CRITERIA, END_CARD, FACTORS, MILESTONES, OPTIONS, PACKAGES, sceneById} from './script';
import {WRITING} from './acting';

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
  const lockY = v ? L.stage.y - 90 : L.stage.y - 150;
  const lineW = v ? 860 : 1000;
  const x0 = L.stage.x - lineW / 2;
  const reveal = clamp01(f, 10, 46, EASE_IN_OUT);
  const desc = enter(f, 50, DUR.heading, OFFSET.heading);
  const endorse = enter(f, 58, DUR.heading, OFFSET.heading);
  void fps;
  // Name tags under the characters introduce who is who.
  const tags = [
    {x: L.cast.laylaX, name: 'LAYLA', role: 'Career coach', color: COLORS.burgundy, at: 96},
    {x: L.cast.omarX, name: 'OMAR', role: 'Coachee', color: OMAR_TEAL, at: 104},
  ];
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
      {tags.map((t) => {
        const e = enter(f, t.at, DUR.heading, 10);
        return (
          <div
            key={t.name}
            style={{
              position: 'absolute',
              left: t.x - 160,
              width: 320,
              // Vertical: above the heads, clear of the Reels UI at the bottom.
              top: v ? L.cast.floorY - 600 - 40 : L.cast.floorY + 10,
              textAlign: 'center',
              fontFamily: FONT.family,
              opacity: e.opacity,
              transform: `translateY(${e.offset}px)`,
            }}
          >
            <span style={{fontWeight: 700, fontSize: v ? 26 : 20, letterSpacing: 4, color: t.color}}>{t.name}</span>
            <span style={{fontWeight: 500, fontSize: v ? 24 : 19, color: COLORS.charcoal, opacity: 0.75}}> · {t.role}</span>
          </div>
        );
      })}
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
  // Each milestone lands as Omar finishes a line in his notebook (acting.ts WRITING).
  const REACH = WRITING.map(([, b]) => b - sceneById('plan').from) as [number, number, number];
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
            x={v ? L.stage.x : L.stage.x + (i - 1) * 350}
            y={v ? 560 + i * 180 : L.stage.y - 150}
            w={v ? 780 : 320}
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

/* 8 — end card: both characters settle beside the call to action */
export const SceneEnd: React.FC<P> = ({L}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = L.vertical;
  // Panel sits clear of both characters so they stay visible beside the CTA.
  const panel = v ? {x: 70, y: 210, w: 940, h: 820} : {x: 530, y: 110, w: 860, h: 800};
  const grow = spring({frame: f, fps, config: {damping: 200, stiffness: 120}, durationInFrames: 24});
  const item = (i: number) => enter(f, 18 + i * 6, DUR.heading + 2, OFFSET.heading);
  const k = v ? 1 : 0.92;
  const rows = [
    {top: 70, size: 100 * k, weight: 700, color: COLORS.white, spacing: 5, text: 'ASSESS SHIFT'},
    {top: 70 + 118 * k, size: 36 * k, weight: 700, color: COLORS.softRose, spacing: 9, text: 'CAREER COACHING'},
    {top: 330 * k, size: 68 * k, weight: 700, color: COLORS.white, spacing: 0, text: END_CARD.cta},
    {top: 330 * k + 180 * k, size: 40 * k, weight: 500, color: COLORS.softRose, spacing: 0, text: END_CARD.action},
    {top: 330 * k + 260 * k, size: 32 * k, weight: 500, color: 'rgba(255,255,255,0.78)', spacing: 0, text: END_CARD.tagline},
    {top: panel.h - 70, size: 22 * k, weight: 700, color: 'rgba(245,233,233,0.6)', spacing: 3, text: END_CARD.url ?? 'PREVIEW · REGISTRATION LINK TO BE ADDED'},
  ];
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: panel.x,
          top: panel.y,
          width: panel.w,
          height: panel.h,
          borderRadius: 44,
          background: COLORS.deepBurgundy,
          boxShadow: '0 30px 80px rgba(58,10,16,0.25)',
          opacity: Math.min(1, grow * 1.5),
          transform: `scale(${0.94 + 0.06 * grow})`,
          overflow: 'hidden',
        }}
      >
        {/* the burgundy path arrives as the panel's accent line */}
        <svg width={panel.w} height={panel.h} style={{position: 'absolute', inset: 0}}>
          <circle cx={panel.w - 60} cy={70} r={220} fill={COLORS.burgundy} opacity={0.35} />
          <Stroke d={`M${panel.w / 2 - 150} ${(70 + 118 * k + 70)} H${panel.w / 2 + 150}`} drawn={clamp01(f, 24, 48, EASE_IN_OUT)} width={5} color={COLORS.burgundy} />
        </svg>
        {rows.map((r, i) => {
          const e = item(i);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: r.top,
                left: 50,
                right: 50,
                textAlign: 'center',
                fontFamily: FONT.family,
                fontWeight: r.weight,
                fontSize: r.size,
                letterSpacing: r.spacing,
                lineHeight: 1.12,
                color: r.color,
                opacity: e.opacity,
                transform: `translateY(${e.offset}px)`,
              }}
            >
              {r.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
