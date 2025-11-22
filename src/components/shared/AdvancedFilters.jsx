import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * AdvancedFilters Component
 * Provides comprehensive filtering options for books and content
 */
const AdvancedFilters = ({ onFilterChange, initialFilters = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
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
    { label: '5-10 hours', value: '5-10' },
    { label: '10-20 hours', value: '10-20' },
    { label: 'Over 20 hours', value: '20+' }
  ];

  const languages = [
    { label: 'All Languages', value: 'all' },
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' },
    { label: 'German', value: 'de' },
    { label: 'Italian', value: 'it' }
  ];

  const sortOptions = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Rating (High to Low)', value: 'rating-desc' },
    { label: 'Rating (Low to High)', value: 'rating-asc' },
    { label: 'Release Date (Newest)', value: 'date-desc' },
    { label: 'Release Date (Oldest)', value: 'date-asc' },
    { label: 'Title (A-Z)', value: 'title-asc' },
    { label: 'Title (Z-A)', value: 'title-desc' },
    { label: 'Duration (Shortest)', value: 'duration-asc' },
    { label: 'Duration (Longest)', value: 'duration-desc' }
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

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        aria-expanded={isOpen}
        aria-label="Toggle filters"
      >
        <Filter className="w-5 h-5" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 font-semibold">
            {activeFilterCount}
          </span>
        )}
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-[600px] overflow-y-auto"
          >
            <div className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-lg">Advanced Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Clear All
                </button>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilters({ sortBy: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Genres */}
              <div>
                <label className="block text-sm font-medium mb-2">Genres</label>
                <div className="flex flex-wrap gap-2">
                  {genres.map(genre => (
                    <button
                      key={genre}
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        filters.genres.includes(genre)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">Minimum Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => updateFilters({ rating: filters.rating === rating ? null : rating })}
                      className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                        filters.rating === rating
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {rating}★
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <div className="space-y-2">
                  {durations.map(duration => (
                    <label key={duration.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="duration"
                        value={duration.value}
                        checked={filters.duration === duration.value}
                        onChange={(e) => updateFilters({ duration: e.target.value })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{duration.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select
                  value={filters.language}
                  onChange={(e) => updateFilters({ language: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
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
                <label className="block text-sm font-medium mb-2">Release Year</label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={filters.releaseYear || ''}
                  onChange={(e) => updateFilters({ releaseYear: e.target.value ? parseInt(e.target.value) : null })}
                  placeholder="e.g., 2023"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>

              {/* Narrator */}
              <div>
                <label className="block text-sm font-medium mb-2">Narrator</label>
                <input
                  type="text"
                  value={filters.narrator}
                  onChange={(e) => updateFilters({ narrator: e.target.value })}
                  placeholder="Search by narrator name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>

              {/* Apply Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
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

