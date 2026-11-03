import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import FilterSidebar from '../components/browse/FilterSidebar';
import BookGrid from '../components/books/BookGrid';
import { Tag, Button, PageHeader } from '../components/ui';
import { searchBooks, filterBooks, getFilterOptions, paginateResults } from '../utils/searchFilter';
import booksData from '../data/books.json';

/**
 * Browse: the catalogue. One page serves /browse, /originals and /podcasts;
 * the tab row links between them. ?q= searches, ?genre= preselects a genre
 * (a slug such as "science-fiction" or "mystery"), ?sort= picks the order.
 */
const SECTIONS = [
  { to: '/browse', label: 'All', type: null, title: 'Browse', description: 'Every audiobook, original and podcast in the catalogue.' },
  { to: '/originals', label: 'Originals', type: 'original', title: 'Originals', description: 'Made for the ear, only on Listenable.' },
  { to: '/podcasts', label: 'Podcasts', type: 'podcast', title: 'Podcasts', description: 'Shows and series, new episodes every week.' },
];

const SORTS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'popular', label: 'Most popular' },
  { value: 'trending', label: 'Trending' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating-desc', label: 'Highest rated' },
  { value: 'title-asc', label: 'Title, A to Z' },
  { value: 'title-desc', label: 'Title, Z to A' },
  { value: 'duration-asc', label: 'Shortest' },
  { value: 'duration-desc', label: 'Longest' },
];

const EMPTY_FILTERS = {
  contentType: [],
  genre: [],
  language: [],
  minRating: null,
  minDuration: null,
  maxDuration: null,
};

const slug = (s) => s.toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// "science-fiction" -> "Science Fiction"; "mystery" -> "Mystery & Thriller"
const genresFromParam = (param, genres) => {
  if (!param) return [];
  return param.split(',').map((p) => {
    const s = slug(p);
    return genres.find((g) => slug(g) === s) || genres.find((g) => slug(g).startsWith(s)) || null;
  }).filter(Boolean);
};

const sortList = (list, sortBy) => {
  const out = [...list];
  const date = (b) => new Date(b.releaseDate).getTime() || 0;
  switch (sortBy) {
    case 'popular': return out.sort((a, b) => (b.ratingsCount || 0) - (a.ratingsCount || 0));
    case 'trending': {
      // recent and well loved: rating weighted by reach, newer titles first among equals
      const score = (b) => (b.rating || 0) * Math.log((b.ratingsCount || 0) + 1) + date(b) / 3.15e11;
      return out.sort((a, b) => score(b) - score(a));
    }
    case 'newest': return out.sort((a, b) => date(b) - date(a));
    case 'rating-desc': return out.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'title-asc': return out.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc': return out.sort((a, b) => b.title.localeCompare(a.title));
    case 'duration-asc': return out.sort((a, b) => (a.durationMinutes || 0) - (b.durationMinutes || 0));
    case 'duration-desc': return out.sort((a, b) => (b.durationMinutes || 0) - (a.durationMinutes || 0));
    default: return out;
  }
};

// A short window of page numbers around the current one: 1 … 4 5 6 … 17
const pageWindow = (current, total) => {
  const set = new Set([1, total, current - 1, current, current + 1]);
  const pages = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push(`gap-${p}`);
    out.push(p);
  });
  return out;
};

const Browse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const sheetRef = useRef(null);

  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('q') || '';
  const genreParam = searchParams.get('genre') || '';
  const sortBy = searchParams.get('sort') || 'relevance';
  const pageParam = parseInt(searchParams.get('page') || '1', 10) || 1;

  const section = SECTIONS.find((s) => s.to === location.pathname) || SECTIONS[0];
  const books = booksData;

  // The part of the catalogue this tab shows, and the filters that make sense for it
  const baseBooks = useMemo(
    () => (section.type ? books.filter((b) => b.contentType === section.type) : books),
    [books, section.type],
  );
  const filterOptions = useMemo(() => getFilterOptions(baseBooks), [baseBooks]);

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(pageParam);

  // When the tab or the ?genre= link changes, start from that link's filters
  const syncKey = `${location.pathname}|${genreParam}`;
  const [syncedKey, setSyncedKey] = useState(null);
  if (syncedKey !== syncKey) {
    setSyncedKey(syncKey);
    setFilters({ ...EMPTY_FILTERS, genre: genresFromParam(genreParam, filterOptions.genres) });
    if (syncedKey !== null) setCurrentPage(1);
  }

  // A new ?q= search starts from page 1 (a ?page= in the first URL is kept)
  const [syncedQuery, setSyncedQuery] = useState(queryParam);
  if (syncedQuery !== queryParam) {
    setSyncedQuery(queryParam);
    setCurrentPage(1);
  }

  const filteredBooks = useMemo(() => {
    let result = baseBooks;
    if (queryParam) result = searchBooks(result, queryParam);
    result = filterBooks(result, filters);
    if (filters.minRating) result = result.filter((b) => (b.rating || 0) >= filters.minRating);
    if (filters.minDuration) result = result.filter((b) => (b.durationMinutes || 0) >= filters.minDuration);
    if (filters.maxDuration) result = result.filter((b) => (b.durationMinutes || 0) <= filters.maxDuration);
    return sortList(result, sortBy);
  }, [baseBooks, queryParam, filters, sortBy]);

  const paginatedResults = useMemo(() => paginateResults(filteredBooks, currentPage, 24), [filteredBooks, currentPage]);

  // The mobile filter sheet: Escape closes it, focus moves into it
  useEffect(() => {
    if (!showMobileFilters) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setShowMobileFilters(false); };
    document.addEventListener('keydown', onKey);
    sheetRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [showMobileFilters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setCurrentPage(1);
    navigate(`${location.pathname}?${new URLSearchParams({ ...Object.fromEntries(searchParams), sort: newSort }).toString()}`);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeFilter = (type, value) => {
    setCurrentPage(1);
    if (type === 'contentType' || type === 'genre' || type === 'language') {
      setFilters((prev) => ({ ...prev, [type]: prev[type].filter((v) => v !== value) }));
    } else if (type === 'rating') {
      setFilters((prev) => ({ ...prev, minRating: null }));
    } else if (type === 'duration') {
      setFilters((prev) => ({ ...prev, minDuration: null, maxDuration: null }));
    }
  };

  const activeFiltersCount =
    filters.contentType.length + filters.genre.length + filters.language.length +
    (filters.minRating ? 1 : 0) + (filters.minDuration || filters.maxDuration ? 1 : 0);

  const durationLabel = () => {
    const min = filters.minDuration ? Math.floor(filters.minDuration / 60) : null;
    const max = filters.maxDuration ? Math.floor(filters.maxDuration / 60) : null;
    if (min && max) return `${min} to ${max} hours`;
    if (min) return `${min}+ hours`;
    return `Up to ${max} hours`;
  };

  const total = paginatedResults.totalItems;
  const noun = section.type === 'podcast' ? (total === 1 ? 'show' : 'shows') : (total === 1 ? 'title' : 'titles');
  const title = queryParam ? <>Results for &ldquo;{queryParam}&rdquo;</> : section.title;

  const sidebar = (inSheet) => (
    <FilterSidebar
      filters={filters}
      onFiltersChange={handleFiltersChange}
      filterOptions={filterOptions}
      onClear={handleClearFilters}
      hideTitle={inSheet}
    />
  );

  return (
    <div className="page pb-16">
      <PageHeader title={title} description={section.description}>
        <nav aria-label="Catalogue sections">
          <div role="tablist" aria-label="Catalogue sections" className="flex gap-6 border-b border-line">
            {SECTIONS.map((s) => {
              const selected = s.to === section.to;
              return (
                <Link
                  key={s.to}
                  to={s.to}
                  role="tab"
                  aria-selected={selected}
                  aria-current={selected ? 'page' : undefined}
                  className={`relative -mb-px inline-flex h-11 items-center text-[0.9375rem] font-medium ${selected ? 'text-ink' : 'text-ink-2 hover:text-ink'}`}
                >
                  {s.label}
                  {selected && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-hl" aria-hidden="true" />}
                </Link>
              );
            })}
          </div>
        </nav>
      </PageHeader>

      <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
        {/* Filters: a column on desktop */}
        <div className="hidden lg:block">{sidebar(false)}</div>

        <div className="min-w-0">
          {/* Toolbar: count, filters on small screens, sort */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
            <p className="text-[0.9375rem] text-ink-2" aria-live="polite">
              <span className="font-semibold text-ink tabular">{total.toLocaleString()}</span> {noun}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="lg:hidden"
                leftIcon={<SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} />}
                onClick={() => setShowMobileFilters(true)}
                aria-haspopup="dialog"
              >
                {activeFiltersCount > 0 ? `Filters (${activeFiltersCount})` : 'Filters'}
              </Button>
              <label htmlFor="sort" className="sr-only sm:not-sr-only text-sm text-ink-2">Sort by</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="h-9 rounded-full border border-line-strong bg-surface pl-4 pr-8 text-sm font-medium text-ink hover:bg-paper"
              >
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Active filters as removable chips */}
          {activeFiltersCount > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {filters.contentType.map((type) => (
                <Tag key={type} removable onRemove={() => removeFilter('contentType', type)} variant="primary">
                  <span className="capitalize">{type}</span>
                </Tag>
              ))}
              {filters.genre.map((genre) => (
                <Tag key={genre} removable onRemove={() => removeFilter('genre', genre)} variant="primary">{genre}</Tag>
              ))}
              {filters.language.map((lang) => (
                <Tag key={lang} removable onRemove={() => removeFilter('language', lang)} variant="primary">{lang}</Tag>
              ))}
              {filters.minRating && (
                <Tag removable onRemove={() => removeFilter('rating')} variant="primary">{filters.minRating}+ stars</Tag>
              )}
              {(filters.minDuration || filters.maxDuration) && (
                <Tag removable onRemove={() => removeFilter('duration')} variant="primary">{durationLabel()}</Tag>
              )}
              <button type="button" onClick={handleClearFilters} className="ml-1 h-8 px-2 text-sm font-medium text-ink underline underline-offset-4 decoration-1 hover:decoration-2">
                Clear all
              </button>
            </div>
          )}

          <BookGrid
            books={paginatedResults.items}
            loading={false}
            showViewToggle={true}
            emptyMessage={queryParam ? `Nothing matches "${queryParam}"` : 'No titles match these filters'}
            emptyAction={activeFiltersCount > 0 ? handleClearFilters : null}
            emptyActionLabel="Clear filters"
          />

          {/* Pagination */}
          {paginatedResults.totalPages > 1 && (
            <nav aria-label="Pages" className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!paginatedResults.hasPreviousPage}
                leftIcon={<ChevronLeft className="h-4 w-4" strokeWidth={1.75} />}
              >
                Previous
              </Button>
              <ol className="hidden items-center gap-1 sm:flex">
                {pageWindow(currentPage, paginatedResults.totalPages).map((p) => (typeof p === 'string' ? (
                  <li key={p} className="w-6 text-center text-ink-3" aria-hidden="true">…</li>
                ) : (
                  <li key={p}>
                    <button
                      type="button"
                      onClick={() => handlePageChange(p)}
                      aria-current={p === currentPage ? 'page' : undefined}
                      aria-label={`Page ${p}`}
                      className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full px-2 text-sm font-medium tabular ${p === currentPage ? 'bg-ink text-paper' : 'text-ink-2 hover:bg-surface-sunk hover:text-ink'}`}
                    >
                      {p}
                    </button>
                  </li>
                )))}
              </ol>
              <p className="text-sm text-ink-3 tabular sm:hidden">Page {currentPage} of {paginatedResults.totalPages}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!paginatedResults.hasNextPage}
                rightIcon={<ChevronRight className="h-4 w-4" strokeWidth={1.75} />}
              >
                Next
              </Button>
            </nav>
          )}
        </div>
      </div>

      {/* Filters on small screens: a sheet from the right */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close filters"
            className="absolute inset-0 h-full w-full cursor-default bg-ink/40"
            onClick={() => setShowMobileFilters(false)}
          />
          <div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="filters-sheet-title"
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <h2 id="filters-sheet-title" className="t-h2 text-ink">Filters</h2>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-2 hover:bg-surface-sunk hover:text-ink"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">{sidebar(true)}</div>
            <div className="border-t border-line px-5 py-4">
              <Button fullWidth onClick={() => setShowMobileFilters(false)}>
                {`Show ${total.toLocaleString()} ${noun}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;
