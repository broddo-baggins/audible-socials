import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import BookCard from './BookCard';

const BookCarousel = ({ 
  title, 
  books = [],
  showProgress = false,
  cardSize = 'md',
  seeAllLink = null,
  className = '' 
}) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  
  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [books]);
  
  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };
  
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container || isScrolling) return;
    
    setIsScrolling(true);
    
    const scrollAmount = container.clientWidth * 0.8;
    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      setIsScrolling(false);
      checkScrollability();
    }, 300);
  };
  
  if (!books || books.length === 0) {
    return null;
  }
  
  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-echo-text-primary">
          {title}
        </h2>
        
        {seeAllLink && (
          <Link 
            to={seeAllLink}
            className="text-sm md:text-base font-medium text-echo-orange hover:text-echo-orange-dark transition-colors"
          >
            See all
          </Link>
        )}
      </div>
      
      {/* Carousel Container */}
      <div className="relative group">
        {/* Left Navigation Button - Hidden on mobile */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg text-echo-text-primary hover:bg-echo-orange hover:text-white transition-all duration-250 opacity-0 group-hover:opacity-100 -translate-x-1/2"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        
        {/* Right Navigation Button - Hidden on mobile */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg text-echo-text-primary hover:bg-echo-orange hover:text-white transition-all duration-250 opacity-0 group-hover:opacity-100 translate-x-1/2"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
        
        {/* Books Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide smooth-scroll px-4 sm:px-6 py-2"
          onScroll={checkScrollability}
          role="region"
          aria-label={`${title} carousel`}
        >
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              showProgress={showProgress}
              size={cardSize}
            />
          ))}
        </div>
        
        {/* Gradient Fade Edges - Hidden on mobile */}
        {canScrollLeft && (
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-16 gradient-fade-left pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-16 gradient-fade-right pointer-events-none" />
        )}
      </div>
    </div>
  );
};

BookCarousel.propTypes = {
  title: PropTypes.string.isRequired,
  books: PropTypes.arrayOf(PropTypes.object),
  showProgress: PropTypes.bool,
  cardSize: PropTypes.oneOf(['sm', 'md', 'lg']),
  seeAllLink: PropTypes.string,
  className: PropTypes.string,
};

export default BookCarousel;
