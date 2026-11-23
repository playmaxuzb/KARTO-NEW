// KARTO brand primitives: mascot, logo lockup, checker band, doodles
export function Mascot({ size = 120, wave = true, className = '' }) {
  return (
    <svg className={className} width={size} height={size * 1.12} viewBox="0 0 200 224" aria-hidden="true">
      <g stroke="#2A1B12" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
        {/* fries hair */}
        <rect x="62" y="10" width="20" height="62" rx="7" fill="#FFD15C" transform="rotate(-16 72 72)" />
        <rect x="88" y="0" width="22" height="70" rx="7" fill="#FFC21A" />
        <rect x="116" y="8" width="20" height="62" rx="7" fill="#FFD15C" transform="rotate(15 126 70)" />
        {/* body */}
        <path d="M100 52c46 0 80 34 80 82 0 50-36 82-82 82-48 0-80-34-80-80 0-50 36-84 82-84Z" fill="#E9A53A" />
        <circle cx="52" cy="112" r="5" fill="#C7832A" stroke="none" />
        <circle cx="150" cy="178" r="6" fill="#C7832A" stroke="none" />
        <circle cx="156" cy="104" r="4" fill="#C7832A" stroke="none" />
        {/* eyes */}
        <ellipse cx="78" cy="122" rx="13" ry="16" fill="#2A1B12" />
        <ellipse cx="124" cy="122" rx="13" ry="16" fill="#2A1B12" />
        <circle cx="82" cy="116" r="4.5" fill="#fff" stroke="none" />
        <circle cx="128" cy="116" r="4.5" fill="#fff" stroke="none" />
        {/* signature black shades with a restrained gold rim */}
        <g fill="#171717" stroke="#D4A62E" strokeWidth="4">
          <path d="M51 109h47v17c0 14-10 23-23 23S53 140 51 126Z" />
          <path d="M102 109h47v17c-2 14-11 23-24 23s-23-9-23-23Z" />
          <path d="M98 116q4-6 8 0" fill="none" />
          <path d="M50 112q-8-4-12 2M149 112q8-4 12 2" fill="none" />
        </g>
        <path d="M60 115l11 3M111 115l11 3" stroke="#A8A8A8" strokeWidth="2.5" strokeLinecap="round" />
        {/* cheeks */}
        <ellipse cx="56" cy="150" rx="11" ry="7" fill="#F0785A" stroke="none" opacity=".75" />
        <ellipse cx="146" cy="150" rx="11" ry="7" fill="#F0785A" stroke="none" opacity=".75" />
        {/* smile */}
        <path d="M76 150q25 30 50 0Z" fill="#7A1E14" />
        <path d="M88 160q13 9 26 0" fill="#F06B5C" stroke="none" />
        {/* arms */}
        {wave && <path className="mascot-arm" d="M176 120q20-10 16-34" fill="none" />}
        <path d="M24 136q-16 6-12 26" fill="none" />
      </g>
    </svg>
  );
}

export function Logo({ size = 40, light = false, mascot = true }) {
  return (
    <span className={'logo' + (light ? ' logo--light' : '')} style={{ fontSize: size }}>
      {mascot && <Mascot size={size * 1.05} wave={false} />}
      <span className="logo__word">KARTO</span>
    </span>
  );
}

export function Checker({ color = 'var(--red)', h = 18 }) {
  return <div className="checker" style={{ '--c': color, height: h }} aria-hidden="true" />;
}

export function Sparkle({ size = 22, color = 'var(--yellow)', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={style}>
      <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12Z" fill={color} />
    </svg>
  );
}

export function Squiggle({ color = 'var(--yellow)', w = 120 }) {
  return (
    <svg width={w} height={w * 0.2} viewBox="0 0 120 24" aria-hidden="true">
      <path d="M2 12q10-12 20 0t20 0 20 0 20 0 20 0 16 0" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export const SIZE_COLORS = { s: 'var(--yellow)', m: 'var(--orange)', l: 'var(--red)' };
