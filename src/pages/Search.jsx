import { useState, useEffect, useMemo, useId } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Search as SearchIcon, X, ArrowRight, Clock } from 'lucide-react';
import { PageHeader, Cover, EmptyState } from '../components/ui';
import BookGrid from '../components/books/BookGrid';
import { searchBooks, getAutocompleteSuggestions, debounce } from '../utils/searchFilter';
import booksData from '../data/books.json';

/**
 * Search: one large field. Before a query: your recent searches, popular
 * searches and the genres with their sizes. After: the results grid, or a
 * plain no-results state with a few ways out.
 */
const STORAGE_KEY = 'echoread_recent_searches';

const trendingSearches = [
  'Science Fiction',
  'Mystery & Thriller',
  'Self Development',
  'Fantasy',
  'Memoir',
  'Originals',
];

const slug = (s) => s.toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const readRecent = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeRecent = (list) => {
  try {
    if (list.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    else localStorage.removeItem(STORAGE_KEY);
  } catch { /* storage unavailable: keep it in memory */ }
};

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('q') || '';
  const listboxId = useId();

  const books = booksData;
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [suggestions, setSuggestions] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState(readRecent);

  // When ?q= changes (here, from the header search or the back button), keep the
  // field in step and record the query: adjusting state during render, not in an effect
  const [syncedQuery, setSyncedQuery] = useState(null);
  if (syncedQuery !== queryParam) {
    setSyncedQuery(queryParam);
    setSearchQuery(queryParam);
    const query = queryParam.trim();
    if (query) setRecentSearches((prev) => [query, ...prev.filter((q) => q !== query)].slice(0, 10));
  }

  // Persist recent searches
  useEffect(() => {
    writeRecent(recentSearches);
  }, [recentSearches]);

  const searchResults = useMemo(
    () => (queryParam.trim() ? searchBooks(books, queryParam) : []),
    [books, queryParam],
  );

  const clearRecentSearches = () => setRecentSearches([]);

  const removeRecent = (query) => {
    setRecentSearches((prev) => prev.filter((q) => q !== query));
  };

  // Debounced autocomplete: matching titles become books, then authors and genres
  const debouncedAutocomplete = useMemo(
    () =>
      debounce((query) => {
        if (query.trim()) {
          const results = getAutocompleteSuggestions(books, query);
          const titleBooks = results.titles
            .map((t) => books.find((b) => b.title === t))
            .filter(Boolean);
          setSuggestions({ books: titleBooks, authors: results.authors, genres: results.genres });
        } else {
          setSuggestions(null);
        }
      }, 300),
    [books],
  );

  useEffect(() => () => {
    if (debouncedAutocomplete.cancel) debouncedAutocomplete.cancel();
  }, [debouncedAutocomplete]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
    debouncedAutocomplete(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (query) => {
    setSearchQuery(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setShowSuggestions(false);
  };

  const clearField = () => {
    setSearchQuery('');
    setSuggestions(null);
    if (queryParam) navigate('/search');
  };

  const genres = useMemo(() => {
    const counts = {};
    books.forEach((b) => { if (b.genre) counts[b.genre] = (counts[b.genre] || 0) + 1; });
    return Object.entries(counts).filter(([, n]) => n >= 10).sort((a, b) => b[1] - a[1]);
  }, [books]);

  const hasSuggestions = showSuggestions && suggestions && searchQuery.trim() &&
    (suggestions.books.length + suggestions.authors.length + suggestions.genres.length > 0);

  const suggestionRow = 'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-[0.9375rem] text-ink hover:bg-surface-sunk';

  const chip = 'inline-flex h-10 items-center rounded-full border border-line-strong bg-surface px-4 text-[0.9375rem] font-medium text-ink hover:bg-paper';

  return (
    <div className="page pb-16">
      <PageHeader
        title="Search"
        description="Find a book by its title, author, narrator, series or genre."
      />

      {/* The field */}
      <form onSubmit={handleSearch} role="search" className="relative max-w-3xl">
        <label htmlFor="search-field" className="sr-only">Search the catalogue</label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-3" strokeWidth={1.75} aria-hidden="true" />
          <input
            id="search-field"
            type="search"
            role="combobox"
            aria-autocomplete="list"
            autoComplete="off"
            placeholder="Title, author or narrator"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            aria-controls={hasSuggestions ? listboxId : undefined}
            aria-expanded={Boolean(hasSuggestions)}
            className="h-14 w-full rounded-full border border-line-strong bg-surface pl-13 pr-32 text-lg text-ink [&::-webkit-search-cancel-button]:hidden focus:border-ink focus:shadow-[0_0_0_3px_var(--hl)] focus:outline-none"
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {searchQuery && (
              <button
                type="button"
                onClick={clearField}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-2 hover:bg-surface-sunk hover:text-ink"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            )}
            <button type="submit" className="inline-flex h-10 items-center rounded-full bg-ink px-5 text-[0.9375rem] font-medium text-paper hover:bg-gray-800">
              Search
            </button>
          </div>
        </div>

        {/* Suggestions */}
        {hasSuggestions && (
          <div id={listboxId} className="absolute left-0 right-0 top-full z-20 mt-2 max-h-[26rem] overflow-y-auto rounded-lg border border-line bg-surface p-2 shadow-lg">
            {suggestions.books.length > 0 && (
              <div>
                <p className="px-3 pb-1 pt-2 text-[0.8125rem] font-semibold text-ink-3">Books</p>
                {suggestions.books.map((book) => (
                  <button key={book.id} type="button" onClick={() => navigate(`/book/${book.id}`)} className={suggestionRow}>
                    <span className="w-8 shrink-0"><Cover src={book.cover} title={book.title} shadow={false} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="t-title-book block line-clamp-1">{book.title}</span>
                      <span className="block text-sm text-ink-2 line-clamp-1">{book.author}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
            {suggestions.authors.length > 0 && (
              <div className="mt-1 border-t border-line pt-1">
                <p className="px-3 pb-1 pt-2 text-[0.8125rem] font-semibold text-ink-3">Authors</p>
                {suggestions.authors.map((author) => (
                  <button key={author} type="button" onClick={() => handleSuggestionClick(author)} className={suggestionRow}>{author}</button>
                ))}
              </div>
            )}
            {suggestions.genres.length > 0 && (
              <div className="mt-1 border-t border-line pt-1">
                <p className="px-3 pb-1 pt-2 text-[0.8125rem] font-semibold text-ink-3">Genres</p>
                {suggestions.genres.map((genre) => (
                  <button key={genre} type="button" onClick={() => handleSuggestionClick(genre)} className={suggestionRow}>{genre}</button>
                ))}
              </div>
            )}
          </div>
        )}
      </form>

      {queryParam ? (
        <section aria-labelledby="results-title" className="mt-12">
          {searchResults.length > 0 ? (
            <>
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
                <h2 id="results-title" className="t-h2 text-ink">
                  <span className="tabular">{searchResults.length.toLocaleString()}</span> {searchResults.length === 1 ? 'result' : 'results'} for &ldquo;{queryParam}&rdquo;
                </h2>
                <Link to={`/browse?q=${encodeURIComponent(queryParam)}`} className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:underline underline-offset-4">
                  Filter these in Browse <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </div>
              <BookGrid books={searchResults} showViewToggle={true} />
            </>
          ) : (
            <div className="space-y-10">
              <h2 id="results-title" className="sr-only">No results</h2>
              <EmptyState
                icon={SearchIcon}
                title={`Nothing matches “${queryParam}”`}
                description="Check the spelling, or try an author, a narrator or a genre instead."
                action="Browse the catalogue"
                actionTo="/browse"
              />
              <div>
                <h3 className="text-sm font-semibold text-ink-2">People often search for</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {trendingSearches.map((s) => (
                    <button key={s} type="button" onClick={() => handleSuggestionClick(s)} className={chip}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
          <div className="space-y-10">
            {/* Recent searches */}
            <section aria-labelledby="recent-title">
              <div className="flex items-baseline justify-between">
                <h2 id="recent-title" className="t-h2 text-ink">Recent searches</h2>
                {recentSearches.length > 0 && (
                  <button type="button" onClick={clearRecentSearches} className="h-9 text-sm font-medium text-ink underline underline-offset-4 decoration-1 hover:decoration-2">
                    Clear all
                  </button>
                )}
              </div>
              {recentSearches.length > 0 ? (
                <ul className="mt-4 divide-y divide-line border-y border-line">
                  {recentSearches.map((search) => (
                    <li key={search} className="flex items-center gap-2">
                      <button type="button" onClick={() => handleSuggestionClick(search)} className="flex min-h-12 flex-1 items-center gap-3 text-left text-[0.9375rem] text-ink hover:underline underline-offset-4">
                        <Clock className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={1.75} aria-hidden="true" />
                        {search}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRecent(search)}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-3 hover:bg-surface-sunk hover:text-ink"
                        aria-label={`Remove ${search} from recent searches`}
                      >
                        <X className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-[0.9375rem] text-ink-3">What you search for shows up here, on this device only.</p>
              )}
            </section>

            {/* Popular searches */}
            <section aria-labelledby="popular-title">
              <h2 id="popular-title" className="t-h2 text-ink">Popular searches</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {trendingSearches.map((s) => (
                  <button key={s} type="button" onClick={() => handleSuggestionClick(s)} className={chip}>{s}</button>
                ))}
              </div>
            </section>
          </div>

          {/* Genres with their sizes */}
          <section aria-labelledby="genres-title">
            <h2 id="genres-title" className="t-h2 text-ink">Browse by genre</h2>
            <ul className="mt-4 grid border-t border-line sm:grid-cols-2 sm:gap-x-8">
              {genres.map(([genre, count]) => (
                <li key={genre} className="border-b border-line">
                  <Link to={`/browse?genre=${slug(genre)}`} className="group flex min-h-14 items-center justify-between gap-4 py-3">
                    <span className="font-serif text-lg font-medium text-ink group-hover:underline underline-offset-4 decoration-1">{genre}</span>
                    <span className="text-[0.8125rem] text-ink-3 tabular">{count} titles</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
};

export default Search;
