import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Cover: a book cover the way a book is: 2:3, nearly square corners, a soft
 * cast shadow and a spine highlight on the left edge. While the image loads,
 * or if it fails, the title is set on a paper plate so the shelf never shows a hole.
 */
const Cover = ({ src, title, author, className = '', loading = 'lazy', shadow = true }) => {
  const [state, setState] = useState(src ? 'loading' : 'error');

  return (
    <div className={`relative aspect-book overflow-hidden rounded-sm bg-surface-sunk ${shadow ? 'cover-shadow' : ''} ${className}`}>
      {state !== 'loaded' && (
        <div className={`absolute inset-0 flex flex-col justify-between p-[9%] ${state === 'loading' ? 'shimmer' : 'bg-surface-sunk'}`} aria-hidden="true">
          {state === 'error' && (
            <>
              <span className="t-title-book text-ink text-[clamp(0.7rem,0.9vw,1rem)] line-clamp-4">{title}</span>
              {author && <span className="text-[0.625rem] text-ink-3 line-clamp-1">{author}</span>}
            </>
          )}
        </div>
      )}
      {src && state !== 'error' && (
        <img
          src={src}
          alt={title ? `${title} cover` : ''}
          loading={loading}
          decoding="async"
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${state === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {/* spine: a 1px light edge and a soft fold, as on a printed jacket */}
      <span className="pointer-events-none absolute inset-y-0 left-0 w-[6%] bg-gradient-to-r from-black/20 via-white/10 to-transparent" aria-hidden="true" />
    </div>
  );
};

Cover.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string,
  author: PropTypes.string,
  className: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  shadow: PropTypes.bool,
};

export default Cover;
