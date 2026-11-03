import { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Waveform: the identity's signature mark (DESIGN.md, "Waveform").
 * Every book, club and listener gets its own deterministic wave from a seed,
 * so the same book always draws the same shape. With `progress`, bars already
 * heard are drawn in `playedClassName` (the highlighter on night, ink on paper).
 */

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function waveHeights(seed, bars) {
  let x = hash(String(seed)) || 1;
  const out = [];
  for (let i = 0; i < bars; i++) {
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5; x >>>= 0;
    const r = (x % 1000) / 1000;
    // a speech-like envelope: phrases swell and fall
    const phrase = 0.55 + 0.45 * Math.sin((i / bars) * Math.PI * 3.2 + (hash(String(seed)) % 7));
    out.push(Math.max(0.12, Math.min(1, 0.25 + r * 0.6 * phrase + 0.15 * phrase)));
  }
  return out;
}

const Waveform = ({
  seed = 'listenable',
  bars = 48,
  height = 40,
  progress = null,
  className = '',
  playedClassName = 'text-current',
  label,
}) => {
  const heights = useMemo(() => waveHeights(seed, bars), [seed, bars]);
  const gap = 2;
  const barW = 3;
  const width = bars * (barW + gap) - gap;
  const playedUntil = progress == null ? bars : Math.round(progress * bars);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {heights.map((h, i) => {
        const bh = Math.max(3, h * height);
        const played = i < playedUntil;
        return (
          <rect
            key={i}
            x={i * (barW + gap)}
            y={(height - bh) / 2}
            width={barW}
            height={bh}
            rx={1.5}
            className={played ? playedClassName : ''}
            fill="currentColor"
            opacity={progress == null || played ? 1 : 0.32}
          />
        );
      })}
    </svg>
  );
};

Waveform.propTypes = {
  seed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bars: PropTypes.number,
  height: PropTypes.number,
  progress: PropTypes.number,
  className: PropTypes.string,
  playedClassName: PropTypes.string,
  label: PropTypes.string,
};

export default Waveform;
