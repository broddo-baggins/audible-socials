import { useState } from 'react';
import PropTypes from 'prop-types';

/** Avatar: the person's photo, or their initials on paper when there is none. */
const sizes = { xs: 'h-6 w-6 text-[0.625rem]', sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-base', xl: 'h-20 w-20 text-xl' };

const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase() || '?';

const Avatar = ({ src, name, size = 'md', className = '' }) => {
  const [failed, setFailed] = useState(!src);
  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-sunk font-semibold text-ink-2 ring-1 ring-line ${sizes[size]} ${className}`}>
      {failed ? (
        <span aria-hidden="true">{initials(name)}</span>
      ) : (
        <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" onError={() => setFailed(true)} />
      )}
      <span className="sr-only">{name}</span>
    </span>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
};

export default Avatar;
