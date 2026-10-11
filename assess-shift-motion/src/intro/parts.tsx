import {interpolate} from 'remotion';
import {COLORS, FONT} from '../brand';
import {DUR, EASE_IN_OUT, EASE_OUT, OFFSET, enter} from '../motion';
import type {Layout} from './formats';

export const clamp01 = (frame: number, a: number, b: number, easing = EASE_OUT) =>
  interpolate(frame, [a, b], [0, 1], {easing, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// Shared scene exit: everything a scene owns fades over its last frames.
export const EXIT = 12;
export const exitOf = (f: number, dur: number) => clamp01(f, dur - EXIT, dur, EASE_IN_OUT);

type Seg = {text: string; em?: boolean};

export const Headline: React.FC<{L: Layout; f: number; dur: number; segs?: readonly Seg[]; at?: number}> = ({L, f, dur, segs, at = 6}) => {
  if (!segs) return null;
  const out = exitOf(f, dur);
  return (
    <div
      style={{
        position: 'absolute',
        top: L.headline.top,
        left: L.headline.side,
        right: L.headline.side,
        textAlign: 'center',
        fontFamily: FONT.family,
        fontWeight: 700,
        fontSize: L.headline.size,
        lineHeight: 1.12,
        color: COLORS.charcoal,
        opacity: 1 - out,
        transform: `translateY(${-out * 10}px)`,
      }}
    >
      {/* Word-by-word reveal: each word rises in 3 frames after the previous one. */}
      {(() => {
        let w = 0;
        return segs.map((sg, i) => {
          const text = L.vertical ? sg.text : sg.text.replace('\n', ' ');
          return (
            <span key={i} style={{color: sg.em ? COLORS.burgundy : undefined}}>
              {text.split(/(\s+)/).map((tok, j) => {
                if (/^\s+$/.test(tok)) return tok.includes('\n') ? <br key={j} /> : ' ';
                const we = enter(f, at + 3 * w++, DUR.heading, OFFSET.heading);
                return (
                  <span key={j} style={{display: 'inline-block', opacity: we.opacity, transform: `translateY(${we.offset}px)`}}>
                    {tok}
                  </span>
                );
              })}
            </span>
          );
        });
      })()}
    </div>
  );
};

export const Sub: React.FC<{L: Layout; f: number; dur: number; text?: string; at?: number; top?: number}> = ({L, f, dur, text, at = 30, top}) => {
  if (!text) return null;
  const e = enter(f, at, DUR.heading + 4, 12);
  const out = exitOf(f, dur);
  return (
    <div
      style={{
        position: 'absolute',
        top: top ?? L.sub.top,
        left: L.sub.side,
        right: L.sub.side,
        textAlign: 'center',
        fontFamily: FONT.family,
        fontWeight: 500,
        fontSize: L.sub.size,
        lineHeight: 1.3,
        color: COLORS.charcoal,
        opacity: 0.82 * e.opacity * (1 - out),
        transform: `translateY(${e.offset}px)`,
      }}
    >
      {text}
    </div>
  );
};

export type IconName = 'role' | 'field' | 'way' | 'interests' | 'motivation' | 'experience' | 'path';

export const Icon: React.FC<{name: IconName; size: number; color?: string}> = ({name, size, color = COLORS.burgundy}) => {
  const st = {stroke: color, strokeWidth: 5, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{flexShrink: 0}}>
      {name === 'role' && (
        <>
          <rect x={8} y={20} width={48} height={34} rx={7} {...st} />
          <path d="M24 20 V14 Q24 10 28 10 H36 Q40 10 40 14 V20 M8 34 H56" {...st} />
        </>
      )}
      {name === 'field' && (
        <>
          <circle cx={16} cy={46} r={6} {...st} />
          <circle cx={48} cy={18} r={6} {...st} />
          <path d="M22 44 Q40 40 32 30 Q26 22 42 20" {...st} />
        </>
      )}
      {name === 'way' && (
        <>
          <rect x={10} y={14} width={44} height={28} rx={4} {...st} />
          <path d="M4 50 H60 M26 42 L24 50 M38 42 L40 50" {...st} />
        </>
      )}
      {name === 'interests' && <path d="M32 8 L38.5 24 L56 25 L42.5 36 L47 53 L32 43.5 L17 53 L21.5 36 L8 25 L25.5 24Z" {...st} />}
      {name === 'motivation' && <path d="M32 6 Q36 26 52 32 Q36 38 32 58 Q28 38 12 32 Q28 26 32 6Z" {...st} />}
      {name === 'experience' && (
        <path d="M32 10 L56 22 L32 34 L8 22Z M8 32 L32 44 L56 32 M8 42 L32 54 L56 42" {...st} />
      )}
      {name === 'path' && (
        <>
          <circle cx={12} cy={48} r={5} {...st} />
          <circle cx={52} cy={16} r={5} {...st} />
          <path d="M16 45 C30 40 22 24 47 19" {...st} />
        </>
      )}
    </svg>
  );
};

type CardProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  icon?: IconName;
  variant?: 'white' | 'rose';
  layout?: 'column' | 'row';
  fontSize?: number;
  opacity?: number;
  dy?: number;
  scale?: number;
  emphasis?: number;
};

export const Card: React.FC<CardProps> = ({
  x,
  y,
  w,
  h,
  label,
  icon,
  variant = 'white',
  layout = 'column',
  fontSize = 38,
  opacity = 1,
  dy = 0,
  scale = 1,
  emphasis = 0,
}) => {
  if (opacity <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        borderRadius: 26,
        background: variant === 'white' ? COLORS.white : COLORS.softRose,
        border: `3px solid rgba(145,33,46,${0.16 + 0.7 * emphasis})`,
        boxShadow: `0 ${14 + 10 * emphasis}px ${34 + 10 * emphasis}px rgba(58,10,16,${0.09 + 0.05 * emphasis})`,
        display: 'flex',
        flexDirection: layout,
        alignItems: 'center',
        justifyContent: 'center',
        gap: layout === 'column' ? 14 : 18,
        padding: '0 22px',
        boxSizing: 'border-box',
        textAlign: 'center',
        fontFamily: FONT.family,
        fontWeight: 700,
        fontSize,
        lineHeight: 1.12,
        color: COLORS.charcoal,
        opacity,
        transform: `translateY(${dy}px) scale(${scale})`,
      }}
    >
      {icon && <Icon name={icon} size={Math.round(fontSize * 1.6)} />}
      <div>{label}</div>
    </div>
  );
};

export const Chip: React.FC<{x: number; y: number; w: number; label: string; fontSize?: number; opacity?: number; dy?: number; active?: number}> = ({
  x,
  y,
  w,
  label,
  fontSize = 32,
  opacity = 1,
  dy = 0,
  active = 0,
}) => {
  if (opacity <= 0.001) return null;
  const h = fontSize * 2.1;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        borderRadius: h / 2,
        background: active > 0.5 ? COLORS.burgundy : COLORS.softRose,
        color: active > 0.5 ? COLORS.white : COLORS.burgundy,
        border: `2px solid rgba(145,33,46,0.35)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT.family,
        fontWeight: 700,
        fontSize,
        opacity,
        transform: `translateY(${dy}px)`,
      }}
    >
      {label}
    </div>
  );
};

// Stroke that draws from its start (`drawn`) and can be trimmed from its start.
export const Stroke: React.FC<{d: string; drawn: number; trimmed?: number; width?: number; color?: string; opacity?: number}> = ({
  d,
  drawn,
  trimmed = 0,
  width = 8,
  color = COLORS.burgundy,
  opacity = 1,
}) =>
  drawn <= 0 ? null : (
    <path
      d={d}
      pathLength={1}
      strokeDasharray={`${Math.max(0, drawn - trimmed)} 2`}
      strokeDashoffset={-trimmed}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity={opacity}
    />
  );
