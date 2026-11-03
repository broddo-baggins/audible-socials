import { useState, useId } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, ChevronUp, Star } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * AdvancedFilters Component
 * Provides comprehensive filtering options for books and content
 */
const AdvancedFilters = ({ onFilterChange, initialFilters = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const [filters, setFilters] = useState({
    genres: [],
    rating: null,
    duration: null,
    narrator: '',
    releaseYear: null,
    language: 'all',
    status: 'all',
    sortBy: 'relevance',
    ...initialFilters
  });

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 'Romance',
    'Science Fiction', 'Fantasy', 'Biography', 'History', 'Self-Help',
    'Business', 'Psychology', 'Philosophy', 'Poetry', 'Drama'
  ];

  const durations = [
    { label: 'Under 5 hours', value: '0-5' },
    { label: '5 to 10 hours', value: '5-10' },
    { label: '10 to 20 hours', value: '10-20' },
    { label: 'Over 20 hours', value: '20+' }
  ];

  const languages = [
    { label: 'All languages', value: 'all' },
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' },
    { label: 'German', value: 'de' },
    { label: 'Italian', value: 'it' }
  ];

  const sortOptions = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Rating, high to low', value: 'rating-desc' },
    { label: 'Rating, low to high', value: 'rating-asc' },
    { label: 'Newest first', value: 'date-desc' },
    { label: 'Oldest first', value: 'date-asc' },
    { label: 'Title, A to Z', value: 'title-asc' },
    { label: 'Title, Z to A', value: 'title-desc' },
    { label: 'Shortest first', value: 'duration-asc' },
    { label: 'Longest first', value: 'duration-desc' }
  ];

  const handleGenreToggle = (genre) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter(g => g !== genre)
      : [...filters.genres, genre];
    
    updateFilters({ genres: newGenres });
  };

  const updateFilters = (updates) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      genres: [],
      rating: null,
      duration: null,
      narrator: '',
      releaseYear: null,
      language: 'all',
      status: 'all',
      sortBy: 'relevance'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const activeFilterCount = [
    filters.genres.length > 0,
    filters.rating !== null,
    filters.duration !== null,
    filters.narrator !== '',
    filters.releaseYear !== null,
    filters.language !== 'all',
    filters.status !== 'all'
  ].filter(Boolean).length;

  const label = 'block text-sm font-semibold text-ink mb-2';
  const field = 'w-full h-11 px-3.5 rounded-lg border border-line-strong bg-surface text-ink';
  const pill = (on) => `inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium ${on ? 'bg-hl text-ink' : 'border border-line-strong text-ink hover:bg-surface-sunk'}`;

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-5 text-[0.9375rem] font-medium text-ink hover:bg-paper"
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <Filter className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-xs font-semibold text-paper tabular">
            {activeFilterCount}
          </span>
        )}
        {isOpen ? <ChevronUp className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> : <ChevronDown className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
      </button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <Motion.div
            id={panelId}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 top-full z-50 mt-2 max-h-[600px] w-[min(24rem,calc(100vw-2rem))] overflow-y-auto rounded-lg border border-line bg-surface shadow-lg"
          >
            <div className="space-y-5 p-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="t-h3 text-ink">Filters</h3>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="h-9 text-sm font-medium text-ink underline underline-offset-4 decoration-1 hover:decoration-2"
                >
                  Clear all
                </button>
              </div>

              {/* Sort By */}
              <div>
                <label htmlFor={`${panelId}-sort`} className={label}>Sort by</label>
                <select
                  id={`${panelId}-sort`}
                  value={filters.sortBy}
                  onChange={(e) => updateFilters({ sortBy: e.target.value })}
                  className={field}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Genres */}
              <fieldset>
                <legend className={label}>Genres</legend>
                <div className="flex flex-wrap gap-2">
                  {genres.map(genre => (
                    <button
                      key={genre}
                      type="button"
                      aria-pressed={filters.genres.includes(genre)}
                      onClick={() => handleGenreToggle(genre)}
                      className={pill(filters.genres.includes(genre))}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Rating */}
              <fieldset>
                <legend className={label}>Minimum rating</legend>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      aria-pressed={filters.rating === rating}
                      aria-label={`${rating} stars and up`}
                      onClick={() => updateFilters({ rating: filters.rating === rating ? null : rating })}
                      className={`${pill(filters.rating === rating)} flex-1 justify-center gap-1 px-0`}
                    >
                      <span className="tabular">{rating}</span>
                      <Star className={`h-3.5 w-3.5 ${filters.rating === rating ? 'fill-ink' : ''}`} strokeWidth={1.75} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Duration */}
              <fieldset>
                <legend className={label}>Length</legend>
                <div className="space-y-1">
                  {durations.map(duration => (
                    <label key={duration.value} className="flex min-h-9 cursor-pointer items-center gap-3 text-[0.9375rem] text-ink-2">
                      <input
                        type="radio"
                        name={`${panelId}-duration`}
                        value={duration.value}
                        checked={filters.duration === duration.value}
                        onChange={(e) => updateFilters({ duration: e.target.value })}
                        className="h-4 w-4 accent-ink"
                      />
                      <span>{duration.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Language */}
              <div>
                <label htmlFor={`${panelId}-lang`} className={label}>Language</label>
                <select
                  id={`${panelId}-lang`}
                  value={filters.language}
                  onChange={(e) => updateFilters({ language: e.target.value })}
                  className={field}
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Release Year */}
              <div>
                <label htmlFor={`${panelId}-year`} className={label}>Release year</label>
                <input
                  id={`${panelId}-year`}
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={filters.releaseYear || ''}
                  onChange={(e) => updateFilters({ releaseYear: e.target.value ? parseInt(e.target.value) : null })}
                  placeholder="For example, 2023"
                  className={field}
                />
              </div>

              {/* Narrator */}
              <div>
                <label htmlFor={`${panelId}-narrator`} className={label}>Narrator</label>
                <input
                  id={`${panelId}-narrator`}
                  type="text"
                  value={filters.narrator}
                  onChange={(e) => updateFilters({ narrator: e.target.value })}
                  placeholder="Narrator name"
                  className={field}
                />
              </div>

              {/* Apply Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-ink text-[0.9375rem] font-medium text-paper hover:bg-gray-800"
              >
                Apply filters
              </button>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

AdvancedFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  initialFilters: PropTypes.object
};

export default AdvancedFilters;

