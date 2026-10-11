import {COLORS, FONT} from '../brand';
import type {CardTrack} from '../timeline';

const Icon: React.FC<{name: CardTrack['icon']; size: number}> = ({name, size}) => {
  const stroke = {stroke: COLORS.burgundy, strokeWidth: 5, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      {name === 'role' && (
        <>
          <rect x={8} y={20} width={48} height={34} rx={7} {...stroke} />
          <path d="M24 20 V14 Q24 10 28 10 H36 Q40 10 40 14 V20 M8 34 H56" {...stroke} />
        </>
      )}
      {name === 'field' && (
        <>
          <circle cx={16} cy={46} r={6} {...stroke} />
          <circle cx={48} cy={18} r={6} {...stroke} />
          <path d="M22 44 Q40 40 32 30 Q26 22 42 20" {...stroke} />
        </>
      )}
      {name === 'interests' && (
        <path d="M32 8 L38.5 24 L56 25 L42.5 36 L47 53 L32 43.5 L17 53 L21.5 36 L8 25 L25.5 24Z" {...stroke} />
      )}
      {name === 'motivation' && (
        <path d="M32 6 Q36 26 52 32 Q36 38 32 58 Q28 38 12 32 Q28 26 32 6Z" {...stroke} />
      )}
    </svg>
  );
};

type Props = {card: CardTrack; emphasis: number};

// Option cards share one size and treatment so neither reads as "the answer".
export const Card: React.FC<Props> = ({card, emphasis}) => {
  const isOption = card.kind === 'option';
  return (
    <div
      style={{
        width: card.w,
        height: card.h,
        borderRadius: 28,
        background: isOption ? COLORS.white : COLORS.softRose,
        border: `3px solid rgba(145,33,46,${0.18 + 0.62 * emphasis})`,
        boxShadow: '0 18px 40px rgba(58,10,16,0.10)',
        display: 'flex',
        flexDirection: isOption ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isOption ? 18 : 22,
        fontFamily: FONT.family,
        fontWeight: FONT.headlineWeight,
        fontSize: isOption ? 44 : 42,
        color: COLORS.charcoal,
      }}
    >
      <Icon name={card.icon} size={isOption ? 72 : 60} />
      <div>{card.label}</div>
    </div>
  );
};
