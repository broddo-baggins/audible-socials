import PropTypes from 'prop-types';

/**
 * Skeleton: shapes only, in the layout of the screen they stand in for.
 * HeroSkeleton mirrors Home's "Now playing" slab; CarouselSkeleton mirrors a shelf.
 */
const variants = {
  text: 'h-4 rounded-sm',
  title: 'h-7 rounded-sm',
  button: 'h-11 w-28 rounded-full',
  avatar: 'rounded-full',
  card: 'h-48 rounded-lg',
  bookCover: 'aspect-book rounded-sm',
  circle: 'rounded-full aspect-square',
};

const widthClasses = { full: 'w-full', '3/4': 'w-3/4', '1/2': 'w-1/2', '1/3': 'w-1/3', '1/4': 'w-1/4' };

const Skeleton = ({ variant = 'text', width = 'full', height = 'auto', count = 1, className = '' }) => {
  const widthClass = typeof width === 'string' && widthClasses[width] ? widthClasses[width] : width;
  const cls = `shimmer ${variants[variant]} ${widthClass} ${height !== 'auto' ? height : ''} ${className}`;
  if (count === 1) return <div className={cls} aria-hidden="true" />;
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => <div key={i} className={cls} />)}
    </div>
  );
};

Skeleton.propTypes = {
  variant: PropTypes.oneOf(['text', 'title', 'button', 'avatar', 'card', 'bookCover', 'circle']),
  width: PropTypes.oneOfType([PropTypes.oneOf(['full', '3/4', '1/2', '1/3', '1/4']), PropTypes.string]),
  height: PropTypes.string,
  count: PropTypes.number,
  className: PropTypes.string,
};

export const BookCardSkeleton = () => (
  <div className="w-full" aria-hidden="true">
    <Skeleton variant="bookCover" className="w-full mb-3" />
    <Skeleton variant="text" width="full" className="mb-2" />
    <Skeleton variant="text" width="1/2" />
  </div>
);

export const HeroSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]" aria-hidden="true">
    <div className="rounded-2xl bg-night p-6 md:p-8 flex gap-6">
      <div className="w-28 md:w-40 aspect-book rounded-sm bg-night-raised" />
      <div className="flex-1 space-y-4 pt-2">
        <div className="h-3 w-24 rounded-sm bg-night-raised" />
        <div className="h-8 w-3/4 rounded-sm bg-night-raised" />
        <div className="h-4 w-1/2 rounded-sm bg-night-raised" />
        <div className="h-12 w-full rounded-sm bg-night-raised mt-8" />
      </div>
    </div>
    <div className="space-y-4">
      <Skeleton variant="title" width="1/2" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex gap-3">
          <Skeleton variant="avatar" className="w-10 h-10" />
          <div className="flex-1 space-y-2"><Skeleton width="3/4" /><Skeleton width="1/2" /></div>
        </div>
      ))}
    </div>
  </div>
);

export const CarouselSkeleton = () => (
  <div className="space-y-4" aria-hidden="true">
    <Skeleton variant="title" width="w-48" />
    <div className="flex gap-5 overflow-hidden">
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} className="w-36 md:w-40 shrink-0">
          <Skeleton variant="bookCover" className="w-full mb-3" />
          <Skeleton variant="text" width="full" className="mb-2" />
          <Skeleton variant="text" width="1/2" />
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
