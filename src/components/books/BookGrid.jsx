import { useState } from 'react';
import { Grid, List } from 'lucide-react';
import PropTypes from 'prop-types';
import BookCard from './BookCard';
import { BookCardSkeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import Cover from '../ui/Cover';
import { Link } from 'react-router-dom';

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
      <EmptyState
        className={className}
        title={emptyMessage}
        description="Try a different filter, or browse the full catalogue."
        action={emptyAction ? emptyActionLabel : undefined}
        onAction={emptyAction || undefined}
      />
    );
  }

  return (
    <div className={className}>
      {/* View Toggle */}
      {showViewToggle && (
        <div className="flex items-center justify-end mb-6">
          <div className="inline-flex items-center rounded-full border border-line p-1" role="group" aria-label="View">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`inline-flex h-8 w-9 items-center justify-center rounded-full ${
                currentViewMode === 'grid' ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'
              }`}
              aria-label="Grid view"
              aria-pressed={currentViewMode === 'grid'}
            >
              <Grid className="w-4 h-4" strokeWidth={1.75} />
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`inline-flex h-8 w-9 items-center justify-center rounded-full ${
                currentViewMode === 'list' ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'
              }`}
              aria-label="List view"
              aria-pressed={currentViewMode === 'list'}
            >
              <List className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      )}
      
      {/* Grid View */}
      {currentViewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 md:gap-x-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              size="fluid"
            />
          ))}
        </div>
      )}
      
      {/* List View */}
      {currentViewMode === 'list' && (
        <ul className="divide-y divide-line border-y border-line">
          {books.map((book) => (
            <li key={book.id} className="flex gap-4 py-5 md:gap-6">
              <Link to={`/book/${book.id}`} className="w-20 shrink-0 md:w-24" aria-label={`${book.title} by ${book.author}`}>
                <Cover src={book.cover} title={book.title} author={book.author} />
              </Link>
              <div className="min-w-0 flex-1">
                <h3 className="t-title-book text-lg text-ink line-clamp-2">
                  <Link to={`/book/${book.id}`} className="hover:underline underline-offset-4">{book.title}</Link>
                </h3>
                <p className="mt-1 text-sm text-ink-2">By {book.author}</p>
                {book.narrator && <p className="text-sm text-ink-3">Narrated by {book.narrator}</p>}
                <p className="mt-2 text-sm text-ink-2 line-clamp-2 max-w-[70ch]">{book.description}</p>
              </div>
            </li>
          ))}
        </ul>
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
