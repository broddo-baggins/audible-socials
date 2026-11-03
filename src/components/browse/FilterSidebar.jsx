import { useState, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * FilterSidebar: the catalogue's filters as a quiet column of ruled sections.
 * Each section folds; checkboxes and radios are native, inked with accent-color.
 */
const FilterSection = ({ title, open, onToggle, children }) => {
  const id = useId();
  return (
    <div className="border-t border-line py-2">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
          className="flex h-11 w-full items-center justify-between rounded-md text-left text-[0.9375rem] font-semibold text-ink"
        >
          {title}
          <ChevronDown className={`h-4 w-4 text-ink-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </h3>
      {open && <div id={id} className="pb-3">{children}</div>}
    </div>
  );
};

FilterSection.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  children: PropTypes.node,
};

const Check = ({ type = 'checkbox', name, checked, onChange, children }) => (
  <label className="flex min-h-9 cursor-pointer items-center gap-3 rounded-md text-[0.9375rem] text-ink-2 hover:text-ink">
    <input
      type={type}
      name={name}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 shrink-0 accent-ink"
    />
    <span className={checked ? 'font-medium text-ink' : ''}>{children}</span>
  </label>
);

Check.propTypes = {
  type: PropTypes.oneOf(['checkbox', 'radio']),
  name: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  children: PropTypes.node,
};

const TYPE_LABELS = { audiobook: 'Audiobooks', original: 'Originals', podcast: 'Podcasts' };

const FilterSidebar = ({
  filters,
  onFiltersChange,
  filterOptions,
  onClear,
  hideTitle = false,
  className = '',
}) => {
  const [expandedSections, setExpandedSections] = useState({
    contentType: true,
    genre: true,
    duration: false,
    language: false,
    rating: false,
  });
  const minId = useId();
  const maxId = useId();

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleIn = (key, value) => {
    const current = filters[key] || [];
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onFiltersChange({ ...filters, [key]: updated });
  };

  const handleRatingChange = (rating) => {
    onFiltersChange({ ...filters, minRating: rating === filters.minRating ? null : rating });
  };

  const hasActiveFilters =
    (filters.contentType && filters.contentType.length > 0) ||
    (filters.genre && filters.genre.length > 0) ||
    (filters.language && filters.language.length > 0) ||
    filters.minRating ||
    filters.minDuration ||
    filters.maxDuration;

  const minHours = filters.minDuration ? Math.floor(filters.minDuration / 60) : 0;
  const maxHours = filters.maxDuration ? Math.floor(filters.maxDuration / 60) : 50;

  const section = (key, title, children) => (
    <FilterSection title={title} open={expandedSections[key]} onToggle={() => toggleSection(key)}>
      {children}
    </FilterSection>
  );

  return (
    <aside aria-label="Filters" className={className}>
      <div className={`flex min-h-9 items-center justify-between pb-2 ${hideTitle && !hasActiveFilters ? 'hidden' : ''}`}>
        {!hideTitle && <h2 className="text-sm font-semibold text-ink-2">Filters</h2>}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="ml-auto h-9 px-1 text-sm font-medium text-ink underline underline-offset-4 decoration-1 hover:decoration-2"
          >
            Clear all
          </button>
        )}
      </div>

      {filterOptions.contentTypes.length > 1 && section('contentType', 'Format', (
        <div className="space-y-0.5">
          {filterOptions.contentTypes.map((type) => (
            <Check key={type} checked={(filters.contentType || []).includes(type)} onChange={() => toggleIn('contentType', type)}>
              {TYPE_LABELS[type] || type}
            </Check>
          ))}
        </div>
      ))}

      {filterOptions.genres.length > 0 && section('genre', 'Genre', (
        <div className="space-y-0.5">
          {filterOptions.genres.map((genre) => (
            <Check key={genre} checked={(filters.genre || []).includes(genre)} onChange={() => toggleIn('genre', genre)}>
              {genre}
            </Check>
          ))}
        </div>
      ))}

      {section('duration', 'Length', (
        <div className="space-y-4 pt-1">
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor={minId} className="text-sm text-ink-2">At least</label>
              <span className="text-sm font-medium text-ink tabular">{filters.minDuration ? `${minHours} h` : 'Any'}</span>
            </div>
            <input
              id={minId}
              type="range"
              min="0"
              max="50"
              step="1"
              value={minHours}
              onChange={(e) => onFiltersChange({ ...filters, minDuration: parseInt(e.target.value, 10) * 60 })}
              className="mt-2 w-full accent-ink"
            />
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor={maxId} className="text-sm text-ink-2">At most</label>
              <span className="text-sm font-medium text-ink tabular">{filters.maxDuration ? `${maxHours} h` : 'Any'}</span>
            </div>
            <input
              id={maxId}
              type="range"
              min="0"
              max="50"
              step="1"
              value={maxHours}
              onChange={(e) => onFiltersChange({ ...filters, maxDuration: parseInt(e.target.value, 10) * 60 })}
              className="mt-2 w-full accent-ink"
            />
          </div>
        </div>
      ))}

      {filterOptions.languages.length > 0 && section('language', 'Language', (
        <div className="space-y-0.5">
          {filterOptions.languages.map((language) => (
            <Check key={language} checked={(filters.language || []).includes(language)} onChange={() => toggleIn('language', language)}>
              {language}
            </Check>
          ))}
        </div>
      ))}

      {section('rating', 'Rating', (
        <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Minimum rating">
          {[4.5, 4.0, 3.5, 3.0].map((rating) => {
            const on = filters.minRating === rating;
            return (
              <button
                key={rating}
                type="button"
                aria-pressed={on}
                onClick={() => handleRatingChange(rating)}
                className={`inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium tabular ${on ? 'bg-ink text-paper' : 'border border-line-strong text-ink hover:bg-surface-sunk'}`}
              >
                {rating.toFixed(1)}+
              </button>
            );
          })}
        </div>
      ))}
      <div className="border-t border-line" />
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
  hideTitle: PropTypes.bool,
  className: PropTypes.string,
};

export default FilterSidebar;
