import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import PropTypes from 'prop-types';
import { Button, Tag } from '../ui';

const FilterSidebar = ({ 
  filters, 
  onFiltersChange, 
  filterOptions,
  onClear,
  className = '' 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    contentType: true,
    genre: true,
    duration: false,
    language: false,
    rating: false,
    releaseDate: false,
  });
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const handleContentTypeChange = (type) => {
    const current = filters.contentType || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    onFiltersChange({ ...filters, contentType: updated });
  };
  
  const handleGenreChange = (genre) => {
    const current = filters.genre || [];
    const updated = current.includes(genre)
      ? current.filter(g => g !== genre)
      : [...current, genre];
    onFiltersChange({ ...filters, genre: updated });
  };
  
  const handleLanguageChange = (language) => {
    const current = filters.language || [];
    const updated = current.includes(language)
      ? current.filter(l => l !== language)
      : [...current, language];
    onFiltersChange({ ...filters, language: updated });
  };
  
  const handleRatingChange = (rating) => {
    onFiltersChange({ ...filters, minRating: rating === filters.minRating ? null : rating });
  };
  
  const hasActiveFilters = () => {
    return (
      (filters.contentType && filters.contentType.length > 0) ||
      (filters.genre && filters.genre.length > 0) ||
      (filters.language && filters.language.length > 0) ||
      filters.minRating ||
      filters.minDuration ||
      filters.maxDuration
    );
  };
  
  const FilterSection = ({ title, section, children }) => (
    <div className="border-b border-echo-divider pb-4">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between py-2 text-left"
      >
        <h3 className="font-semibold text-echo-text-primary">{title}</h3>
        {expandedSections[section] ? (
          <ChevronUp className="w-5 h-5 text-echo-text-secondary" />
        ) : (
          <ChevronDown className="w-5 h-5 text-echo-text-secondary" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
  
  return (
    <aside className={`bg-white rounded-xl border border-echo-border p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-echo-text-primary">Filters</h2>
        {hasActiveFilters() && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClear}
          >
            Clear all
          </Button>
        )}
      </div>
      
      {/* Filter Sections */}
      <div className="space-y-6">
        {/* Content Type */}
        <FilterSection title="Content Type" section="contentType">
          {filterOptions.contentTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(filters.contentType || []).includes(type)}
                onChange={() => handleContentTypeChange(type)}
                className="w-4 h-4 rounded border-echo-border text-echo-orange focus:ring-echo-orange"
              />
              <span className="text-echo-text-primary capitalize">{type}</span>
            </label>
          ))}
        </FilterSection>
        
        {/* Genre */}
        <FilterSection title="Genre" section="genre">
          <div className="max-h-48 overflow-y-auto space-y-2">
            {filterOptions.genres.map((genre) => (
              <label key={genre} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(filters.genre || []).includes(genre)}
                  onChange={() => handleGenreChange(genre)}
                  className="w-4 h-4 rounded border-echo-border text-echo-orange focus:ring-echo-orange"
                />
                <span className="text-echo-text-primary text-sm">{genre}</span>
              </label>
            ))}
          </div>
        </FilterSection>
        
        {/* Duration */}
        <FilterSection title="Duration" section="duration">
          <div className="space-y-3">
            <div>
              <label className="text-sm text-echo-text-secondary mb-1 block">
                Minimum (hours)
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={filters.minDuration ? Math.floor(filters.minDuration / 60) : 0}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  minDuration: parseInt(e.target.value, 10) * 60
                })}
                className="w-full"
              />
              <p className="text-sm text-echo-text-primary mt-1">
                {filters.minDuration ? `${Math.floor(filters.minDuration / 60)}h` : 'Any'}
              </p>
            </div>
            <div>
              <label className="text-sm text-echo-text-secondary mb-1 block">
                Maximum (hours)
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={filters.maxDuration ? Math.floor(filters.maxDuration / 60) : 50}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  maxDuration: parseInt(e.target.value, 10) * 60
                })}
                className="w-full"
              />
              <p className="text-sm text-echo-text-primary mt-1">
                {filters.maxDuration ? `${Math.floor(filters.maxDuration / 60)}h` : 'Any'}
              </p>
            </div>
          </div>
        </FilterSection>
        
        {/* Language */}
        <FilterSection title="Language" section="language">
          {filterOptions.languages.map((language) => (
            <label key={language} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(filters.language || []).includes(language)}
                onChange={() => handleLanguageChange(language)}
                className="w-4 h-4 rounded border-echo-border text-echo-orange focus:ring-echo-orange"
              />
              <span className="text-echo-text-primary text-sm">{language}</span>
            </label>
          ))}
        </FilterSection>
        
        {/* Rating */}
        <FilterSection title="Minimum Rating" section="rating">
          <div className="space-y-2">
            {[4.5, 4.0, 3.5, 3.0].map((rating) => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === rating}
                  onChange={() => handleRatingChange(rating)}
                  className="w-4 h-4 border-echo-border text-echo-orange focus:ring-echo-orange"
                />
                <span className="text-echo-text-primary">{rating}+ stars</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </aside>
  );
};

FilterSidebar.propTypes = {
  filters: PropTypes.object.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  filterOptions: PropTypes.shape({
    contentTypes: PropTypes.array,
    genres: PropTypes.array,
    languages: PropTypes.array,
  }).isRequired,
  onClear: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default FilterSidebar;
