import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Waveform from './Waveform';

/**
 * EmptyState: a flat line of silence (the waveform at its quietest), one
 * sentence on what goes here and one way to fill it. Never an illustration of a sad face.
 * ErrorState: the same shape with the danger ink and a retry.
 */
export const EmptyState = ({ title, description, action, actionTo, onAction, icon: Icon, className = '' }) => (
  <div className={`flex flex-col items-start gap-4 rounded-lg border border-dashed border-line-strong px-6 py-10 md:px-10 ${className}`}>
    {Icon ? (
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface-sunk text-ink-2"><Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" /></span>
    ) : (
      <svg viewBox="0 0 120 16" className="h-4 w-28 text-line-strong" aria-hidden="true">
        {Array.from({ length: 24 }, (_, i) => (
          <rect key={i} x={i * 5} y={7} width={3} height={2} rx={1} fill="currentColor" />
        ))}
      </svg>
    )}
    <div>
      <h3 className="t-h3 text-ink">{title}</h3>
      {description && <p className="mt-1 text-[0.9375rem] text-ink-2 max-w-[52ch]">{description}</p>}
    </div>
    {action && actionTo && (
      <Link to={actionTo} className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-[0.9375rem] font-medium text-paper hover:bg-gray-800">{action}</Link>
    )}
    {action && onAction && !actionTo && (
      <button type="button" onClick={onAction} className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-[0.9375rem] font-medium text-paper hover:bg-gray-800">{action}</button>
    )}
  </div>
);

EmptyState.propTypes = {
  title: PropTypes.node.isRequired,
  description: PropTypes.node,
  action: PropTypes.string,
  actionTo: PropTypes.string,
  onAction: PropTypes.func,
  icon: PropTypes.elementType,
  className: PropTypes.string,
};

export const ErrorState = ({ title = 'Something went quiet', description, onRetry, backTo = '/', backLabel = 'Back to home', className = '' }) => (
  <div role="alert" className={`flex flex-col items-start gap-5 py-12 ${className}`}>
    <Waveform seed="error" bars={36} height={28} className="w-48 text-line-strong" />
    <div>
      <h2 className="t-h2 text-ink">{title}</h2>
      {description && <p className="mt-2 text-base text-ink-2 max-w-[56ch]">{description}</p>}
    </div>
    <div className="flex flex-wrap gap-3">
      {onRetry && (
        <button type="button" onClick={onRetry} className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-[0.9375rem] font-medium text-paper hover:bg-gray-800">Try again</button>
      )}
      {backTo && (
        <Link to={backTo} className="inline-flex h-11 items-center rounded-full border border-line-strong bg-surface px-5 text-[0.9375rem] font-medium text-ink hover:bg-paper">{backLabel}</Link>
      )}
    </div>
  </div>
);

ErrorState.propTypes = {
  title: PropTypes.node,
  description: PropTypes.node,
  onRetry: PropTypes.func,
  backTo: PropTypes.string,
  backLabel: PropTypes.string,
  className: PropTypes.string,
};

export default EmptyState;
