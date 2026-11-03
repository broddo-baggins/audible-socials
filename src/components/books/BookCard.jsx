import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Rating, Badge } from '../ui';
import Cover from '../ui/Cover';

/**
 * BookCard: a book on a shelf. The cover does the talking; under it the title in
 * the book face, the author, and one line of facts. Progress is a thin ink bar under
 * the cover with the share left in words, so it is never colour alone.
 */
const sizes = {
  sm: { container: 'w-28 md:w-32', title: 'text-[0.875rem]', meta: 'text-xs' },
  md: { container: 'w-36 md:w-40', title: 'text-[0.9375rem]', meta: 'text-[0.8125rem]' },
  lg: { container: 'w-44 md:w-48', title: 'text-base', meta: 'text-sm' },
  fluid: { container: 'w-full', title: 'text-[0.9375rem]', meta: 'text-[0.8125rem]' },
};

const BookCard = ({ book, showProgress = false, size = 'md', className = '' }) => {
  const { id, title, author, rating, duration, cover, contentType, progress = 0 } = book;
  const s = sizes[size] || sizes.md;
  const kind = contentType === 'original' ? 'Original' : contentType === 'podcast' ? 'Podcast' : null;

  return (
    <article className={`${s.container} shrink-0 ${className}`}>
      <Link to={`/book/${id}`} className="group block rounded-sm" aria-label={`${title} by ${author}${kind ? `, ${kind}` : ''}`}>
        <div className="relative transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-y-1">
          <Cover src={cover} title={title} author={author} />
          {kind && (
            <Badge variant={contentType === 'original' ? 'original' : 'podcast'} size="sm" className="absolute left-2 top-2">
              {kind}
            </Badge>
          )}
        </div>
      </Link>
      {showProgress && progress > 0 && (
        <div className="mt-2.5">
          <div className="h-[3px] w-full rounded-full bg-line" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${progress}% listened`}>
            <div className="h-full rounded-full bg-ink" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1 text-xs text-ink-3 tabular">{progress}% listened</p>
        </div>
      )}
      <div className={showProgress && progress > 0 ? 'mt-1.5' : 'mt-3'}>
        <h3 className={`t-title-book ${s.title} text-ink line-clamp-2`}>
          <Link to={`/book/${id}`} className="hover:underline underline-offset-4 decoration-1" tabIndex={-1}>{title}</Link>
        </h3>
        <p className={`${s.meta} mt-0.5 text-ink-2 line-clamp-1`}>{author}</p>
        <div className={`${s.meta} mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-ink-3`}>
          {rating ? <Rating value={rating} size="sm" showValue={false} /> : null}
          {duration && <span className="tabular whitespace-nowrap">{duration}</span>}
        </div>
      </div>
    </article>
  );
};

BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    narrator: PropTypes.string,
    rating: PropTypes.number,
    ratingsCount: PropTypes.number,
    duration: PropTypes.string,
    cover: PropTypes.string,
    contentType: PropTypes.string,
    progress: PropTypes.number,
  }).isRequired,
  showProgress: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'fluid']),
  className: PropTypes.string,
};

export default BookCard;
