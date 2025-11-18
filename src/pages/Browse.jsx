import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';
import FilterSidebar from '../components/browse/FilterSidebar';
import BookGrid from '../components/books/BookGrid';
import { Tag, Button } from '../components/ui';
import { searchBooks, filterBooks, sortBooks, getFilterOptions, paginateResults } from '../utils/searchFilter';
import { getImageUrl } from '../utils/imageCache';
import booksData from '../data/books.json';

const Browse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Parse query params
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('q') || '';
  const sortParam = searchParams.get('sort') || 'relevance';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  
  // Filters state
  const [filters, setFilters] = useState({
    contentType: [],
    genre: [],
    language: [],
    minRating: null,
    minDuration: null,
    maxDuration: null,
  });
  
  const [sortBy, setSortBy] = useState(sortParam);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [paginatedResults, setPaginatedResults] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    contentTypes: [],
    genres: [],
    languages: [],
  });
  
  // Load books
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const booksWithCovers = await Promise.all(
          booksData.map(async (book) => ({
            ...book,
            cover: await getImageUrl(book.coverQuery || `${book.title} ${book.author} book cover`),
          }))
        );
        
        setBooks(booksWithCovers);
        setFilterOptions(getFilterOptions(booksWithCovers));
        setLoading(false);
      } catch (error) {
        console.error('Error loading books:', error);
        setLoading(false);
      }
    };
    
    loadBooks();
  }, []);
  
  // Apply filters, search, and sort whenever they change
  useEffect(() => {
    if (books.length === 0) return;
    
    let result = books;
    
    // Apply search
    if (queryParam) {
      result = searchBooks(result, queryParam);
    }
    
    // Apply filters
    result = filterBooks(result, filters);
    
    // Apply sorting
    result = sortBooks(result, sortBy);
    
    setFilteredBooks(result);
    
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [books, queryParam, filters, sortBy]);
  
  // Paginate results
  useEffect(() => {
    const paginated = paginateResults(filteredBooks, currentPage, 24);
    setPaginatedResults(paginated);
  }, [filteredBooks, currentPage]);
  
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  const handleClearFilters = () => {
    setFilters({
      contentType: [],
      genre: [],
      language: [],
      minRating: null,
      minDuration: null,
      maxDuration: null,
    });
  };
  
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    navigate(`${location.pathname}?${new URLSearchParams({ ...Object.fromEntries(searchParams), sort: newSort }).toString()}`);
  };
  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.contentType.length > 0) count += filters.contentType.length;
    if (filters.genre.length > 0) count += filters.genre.length;
    if (filters.language.length > 0) count += filters.language.length;
    if (filters.minRating) count += 1;
    if (filters.minDuration || filters.maxDuration) count += 1;
    return count;
  };
  
  const removeFilter = (type, value) => {
    if (type === 'contentType' || type === 'genre' || type === 'language') {
      setFilters(prev => ({
        ...prev,
        [type]: prev[type].filter(v => v !== value)
      }));
    } else if (type === 'rating') {
      setFilters(prev => ({ ...prev, minRating: null }));
    } else if (type === 'duration') {
      setFilters(prev => ({ ...prev, minDuration: null, maxDuration: null }));
    }
  };
  
  const activeFiltersCount = getActiveFiltersCount();
  
  return (
    <div className="min-h-screen bg-echo-cream">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-echo-text-primary mb-2">
            {queryParam ? `Search results for "${queryParam}"` : 'Browse Audiobooks'}
          </h1>
          <p className="text-echo-text-secondary">
            {paginatedResults ? `${paginatedResults.totalItems} books found` : 'Loading...'}
          </p>
        </div>
        
        {/* Active Filters Tags */}
        {activeFiltersCount > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {filters.contentType.map(type => (
              <Tag
                key={type}
                removable
                onRemove={() => removeFilter('contentType', type)}
                variant="primary"
              >
                {type}
              </Tag>
            ))}
            {filters.genre.map(genre => (
              <Tag
                key={genre}
                removable
                onRemove={() => removeFilter('genre', genre)}
                variant="primary"
              >
                {genre}
              </Tag>
            ))}
            {filters.language.map(lang => (
              <Tag
                key={lang}
                removable
                onRemove={() => removeFilter('language', lang)}
                variant="primary"
              >
                {lang}
              </Tag>
            ))}
            {filters.minRating && (
              <Tag
                removable
                onRemove={() => removeFilter('rating')}
                variant="primary"
              >
                {filters.minRating}+ stars
              </Tag>
            )}
            {(filters.minDuration || filters.maxDuration) && (
              <Tag
                removable
                onRemove={() => removeFilter('duration')}
                variant="primary"
              >
                Duration filter
              </Tag>
            )}
          </div>
        )}
        
        {/* Main Content Area */}
        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              filterOptions={filterOptions}
              onClear={handleClearFilters}
            />
          </div>
          
          {/* Books Grid */}
          <div className="flex-1">
            {/* Sort and Filter Controls */}
            <div className="flex items-center justify-between mb-6">
              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                className="lg:hidden"
                leftIcon={<Filter className="w-5 h-5" />}
                onClick={() => setShowMobileFilters(true)}
              >
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
              
              {/* Sort Dropdown */}
              <div className="flex items-center gap-3">
                <label htmlFor="sort" className="text-sm font-medium text-echo-text-primary">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-2 border-2 border-echo-border rounded-lg bg-white text-echo-text-primary focus:outline-none focus:ring-2 focus:ring-echo-orange focus:border-echo-orange"
                >
                  <option value="relevance">Relevance</option>
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                  <option value="duration-asc">Shortest</option>
                  <option value="duration-desc">Longest</option>
                </select>
              </div>
            </div>
            
            {/* Books Grid */}
            <BookGrid
              books={paginatedResults?.items || []}
              loading={loading}
              showViewToggle={true}
              emptyMessage={queryParam ? `No results found for "${queryParam}"` : 'No books match your filters'}
              emptyAction={handleClearFilters}
              emptyActionLabel="Clear filters"
            />
            
            {/* Pagination */}
            {paginatedResults && paginatedResults.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!paginatedResults.hasPrevPage}
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, paginatedResults.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                          page === currentPage
                            ? 'bg-echo-orange text-white'
                            : 'bg-white text-echo-text-primary hover:bg-echo-beige'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  {paginatedResults.totalPages > 5 && (
                    <>
                      <span className="text-echo-text-secondary">...</span>
                      <button
                        onClick={() => handlePageChange(paginatedResults.totalPages)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                          currentPage === paginatedResults.totalPages
                            ? 'bg-echo-orange text-white'
                            : 'bg-white text-echo-text-primary hover:bg-echo-beige'
                        }`}
                      >
                        {paginatedResults.totalPages}
                      </button>
                    </>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!paginatedResults.hasNextPage}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileFilters(false)}>
          <div 
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-echo-text-primary">Filters</h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Close
                </Button>
              </div>
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                filterOptions={filterOptions}
                onClear={handleClearFilters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;
