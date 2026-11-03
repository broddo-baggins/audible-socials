import { useRef, useState, useEffect, useCallback, useId } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import BookCard from './BookCard';

/**
 * BookCarousel: a shelf. A serif title on the left, "See all" and two arrow
 * buttons on the right (always visible, so keyboard and touch users get them too),
 * and the books on a scroll-snapping row that bleeds to the page edge on phones.
 */
const BookCarousel = ({ title, description, books = [], showProgress = false, cardSize = 'md', seeAllLink = null, className = '' }) => {
  const ref = useRef(null);
  const headingId = useId();
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const check = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    // Measure after layout, once the new books have rendered
    const frame = requestAnimationFrame(check);
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return () => cancelAnimationFrame(frame);
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [books, check]);

  const scroll = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: (dir === 'left' ? -1 : 1) * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  if (!books || books.length === 0) return null;

  const arrow = 'inline-flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-ink hover:bg-surface disabled:opacity-30 disabled:hover:bg-transparent';

  return (
    <section className={`w-full ${className}`} aria-labelledby={headingId}>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 id={headingId} className="t-h2 text-ink">{title}</h2>
          {description && <p className="mt-1 text-[0.9375rem] text-ink-2">{description}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {seeAllLink && (
            <Link to={seeAllLink} className="mr-1 inline-flex h-9 items-center gap-1 rounded-full px-2 text-sm font-medium text-ink hover:underline underline-offset-4">
              See all <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              <span className="sr-only">{title}</span>
            </Link>
          )}
          <button type="button" onClick={() => scroll('left')} disabled={!canLeft} className={`${arrow} hidden md:inline-flex`} aria-label={`Scroll ${title} left`}>
            <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <button type="button" onClick={() => scroll('right')} disabled={!canRight} className={`${arrow} hidden md:inline-flex`} aria-label={`Scroll ${title} right`}>
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        onScroll={check}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 pt-1 scrollbar-hide md:mx-0 md:snap-none md:gap-6 md:px-0"
      >
        {books.map((book) => (
          <div key={book.id} className="snap-start">
            <BookCard book={book} showProgress={showProgress} size={cardSize} />
          </div>
        ))}
      </div>
    </section>
  );
};

BookCarousel.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  books: PropTypes.arrayOf(PropTypes.object),
  showProgress: PropTypes.bool,
  cardSize: PropTypes.oneOf(['sm', 'md', 'lg']),
  seeAllLink: PropTypes.string,
  className: PropTypes.string,
};

export default BookCarousel;
