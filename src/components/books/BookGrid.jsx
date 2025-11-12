import { useState } from 'react';
import { Grid, List } from 'lucide-react';
import PropTypes from 'prop-types';
import BookCard from './BookCard';
import { BookCardSkeleton } from '../ui/Skeleton';
import Button from '../ui/Button';

const BookGrid = ({ 
  books = [],
  loading = false,
  viewMode = 'grid',
  onViewModeChange = null,
  showViewToggle = false,
  emptyMessage = 'No books found',
  emptyAction = null,
  emptyActionLabel = 'Browse books',
  pagination = null,
  className = '' 
}) => {
  const [localViewMode, setLocalViewMode] = useState(viewMode);
  
  const handleViewModeChange = (mode) => {
    setLocalViewMode(mode);
    if (onViewModeChange) onViewModeChange(mode);
  };
  
  const currentViewMode = onViewModeChange ? viewMode : localViewMode;
  
  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {Array.from({ length: 12 }, (_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }
  
  if (!books || books.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-echo-beige flex items-center justify-center">
            <Grid className="w-12 h-12 text-echo-text-tertiary" />
          </div>
          <h3 className="text-xl font-semibold text-echo-text-primary">
            {emptyMessage}
          </h3>
          {emptyAction && (
            <Button onClick={emptyAction}>
              {emptyActionLabel}
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className={className}>
      {/* View Toggle */}
      {showViewToggle && (
        <div className="flex items-center justify-end mb-6">
          <div className="inline-flex items-center bg-echo-beige rounded-lg p-1">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`px-3 py-2 rounded-md transition-all duration-200 ${
                currentViewMode === 'grid'
                  ? 'bg-white text-echo-orange shadow-sm'
                  : 'text-echo-text-secondary hover:text-echo-text-primary'
              }`}
              aria-label="Grid view"
              aria-pressed={currentViewMode === 'grid'}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`px-3 py-2 rounded-md transition-all duration-200 ${
                currentViewMode === 'list'
                  ? 'bg-white text-echo-orange shadow-sm'
                  : 'text-echo-text-secondary hover:text-echo-text-primary'
              }`}
              aria-label="List view"
              aria-pressed={currentViewMode === 'list'}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      
      {/* Grid View */}
      {currentViewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              size="md"
            />
          ))}
        </div>
      )}
      
      {/* List View */}
      {currentViewMode === 'list' && (
        <div className="space-y-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="flex gap-4 p-4 bg-white rounded-xl border border-echo-border hover:shadow-card transition-all duration-250"
            >
              <div className="flex-shrink-0">
                <BookCard
                  book={book}
                  size="sm"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-serif font-semibold text-echo-text-primary mb-2 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-echo-text-secondary mb-1">
                  By {book.author}
                </p>
                {book.narrator && (
                  <p className="text-sm text-echo-text-tertiary mb-3">
                    Narrated by {book.narrator}
                  </p>
                )}
                <p className="text-sm text-echo-text-secondary line-clamp-2">
                  {book.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {pagination && (
        <div className="mt-8 flex justify-center">
          {pagination}
        </div>
      )}
    </div>
  );
};

BookGrid.propTypes = {
  books: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  viewMode: PropTypes.oneOf(['grid', 'list']),
  onViewModeChange: PropTypes.func,
  showViewToggle: PropTypes.bool,
  emptyMessage: PropTypes.string,
  emptyAction: PropTypes.func,
  emptyActionLabel: PropTypes.string,
  pagination: PropTypes.node,
  className: PropTypes.string,
};

export default BookGrid;
