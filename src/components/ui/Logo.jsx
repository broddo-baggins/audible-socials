import PropTypes from 'prop-types';

/**
 * Logo: the Listenable wordmark. Literata, lower case, with the "i" dot replaced
 * by three waveform bars on a highlighter swipe: a book you hear.
 */
const Logo = ({ className = '', onNight = false }) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <svg viewBox="0 0 28 28" className="h-7 w-7 shrink-0" aria-hidden="true">
      <rect x="0" y="0" width="28" height="28" rx="6" fill="var(--hl)" />
      <rect x="6" y="10" width="3" height="8" rx="1.5" fill="var(--ink)" />
      <rect x="12.5" y="6" width="3" height="16" rx="1.5" fill="var(--ink)" />
      <rect x="19" y="11.5" width="3" height="5" rx="1.5" fill="var(--ink)" />
    </svg>
    <span className={`font-serif text-[1.375rem] font-medium leading-none tracking-[-0.02em] ${onNight ? 'text-ink-on-night' : 'text-ink'}`}>
      listenable
    </span>
  </span>
);

Logo.propTypes = { className: PropTypes.string, onNight: PropTypes.bool };

export default Logo;
