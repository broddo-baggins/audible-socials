import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search as SearchIcon, TrendingUp, Clock } from 'lucide-react';
import { Input, Tag, Badge } from '../components/ui';
import BookGrid from '../components/books/BookGrid';
import { searchBooks, getAutocompleteSuggestions, debounce } from '../utils/searchFilter';
import booksData from '../data/books.json';

const loadRecentSearches = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('echoread_recent_searches'));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.warn('Error parsing saved searches:', error);
    return [];
  }
};

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('q') || '';
  
  // Books already have cover paths in books.json
  const books = booksData;
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [suggestions, setSuggestions] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState(loadRecentSearches);

  // Results follow the ?q= parameter
  const searchResults = useMemo(
    () => (queryParam.trim() ? searchBooks(books, queryParam) : []),
    [books, queryParam]
  );

  // When ?q= changes (here or from the header search), sync the input and
  // record the query, adjusting state during render rather than in an effect
  const [prevQuery, setPrevQuery] = useState(null);
  if (queryParam !== prevQuery) {
    setPrevQuery(queryParam);
    setSearchQuery(queryParam);
    const query = queryParam.trim();
    if (query) {
      setRecentSearches(prev => [query, ...prev.filter(q => q !== query)].slice(0, 10));
    }
  }

  // Persist recent searches
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem('echoread_recent_searches', JSON.stringify(recentSearches));
    }
  }, [recentSearches]);
  
  const trendingSearches = [
    'Science Fiction',
    'Mystery & Thriller',
    'Self Development',
    'Fantasy',
    'Memoir',
    'Originals',
  ];
  
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('echoread_recent_searches');
  };
  
  // Debounced autocomplete
  const debouncedAutocomplete = useMemo(
    () =>
      debounce((query) => {
        if (query.trim()) {
          const results = getAutocompleteSuggestions(books, query);
          setSuggestions(results);
        } else {
          setSuggestions(null);
        }
      }, 300),
    [books]
  );
  
  useEffect(() => {
    return () => {
      if (debouncedAutocomplete.cancel) {
        debouncedAutocomplete.cancel();
      }
    };
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
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (query) => {
    setSearchQuery(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setShowSuggestions(false);
  };
  
  return (
    <div className="min-h-screen bg-echo-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-echo-text-primary mb-6">
            Search Audiobooks
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <Input
              type="search"
              placeholder="Search books, authors, narrators..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              leftIcon={<SearchIcon className="w-5 h-5" />}
              fullWidth
              className="text-lg"
            />
            
            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions && (searchQuery.trim()) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-echo-border max-h-96 overflow-y-auto z-10">
                {/* Books */}
                {suggestions.books.length > 0 && (
                  <div className="p-2">
                    <p className="px-3 py-2 text-xs font-semibold text-echo-text-tertiary uppercase">
                      Books
                    </p>
                    {suggestions.books.map((book) => (
                      <button
                        key={book.id}
                        onClick={() => navigate(`/book/${book.id}`)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-echo-beige rounded-lg transition-colors text-left"
                      >
                        <div className="w-10 h-14 flex-shrink-0 rounded overflow-hidden bg-echo-beige">
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-echo-text-primary line-clamp-1">
                            {book.title}
                          </p>
                          <p className="text-sm text-echo-text-secondary line-clamp-1">
                            {book.author}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Authors */}
                {suggestions.authors.length > 0 && (
                  <div className="p-2 border-t border-echo-divider">
                    <p className="px-3 py-2 text-xs font-semibold text-echo-text-tertiary uppercase">
                      Authors
                    </p>
                    {suggestions.authors.map((author) => (
                      <button
                        key={author}
                        onClick={() => handleSuggestionClick(author)}
                        className="w-full px-3 py-2 hover:bg-echo-beige rounded-lg transition-colors text-left text-echo-text-primary"
                      >
                        {author}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Genres */}
                {suggestions.genres.length > 0 && (
                  <div className="p-2 border-t border-echo-divider">
                    <p className="px-3 py-2 text-xs font-semibold text-echo-text-tertiary uppercase">
                      Genres
                    </p>
                    {suggestions.genres.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => handleSuggestionClick(genre)}
                        className="w-full px-3 py-2 hover:bg-echo-beige rounded-lg transition-colors text-left text-echo-text-primary"
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
        
        {/* Search Results */}
        {queryParam ? (
          <div>
            <BookGrid
              books={searchResults}
              showViewToggle={true}
              emptyMessage={`No results found for "${queryParam}"`}
              emptyAction={() => navigate('/browse')}
              emptyActionLabel="Browse all books"
            />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-echo-text-primary flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Searches
                  </h2>
                  <button
                    onClick={clearRecentSearches}
                    className="text-sm text-echo-orange hover:text-echo-orange-dark"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Tag
                      key={index}
                      removable
                      onRemove={() => {
                        setRecentSearches(prev => prev.filter((_, i) => i !== index));
                      }}
                      className="cursor-pointer"
                      onClick={() => handleSuggestionClick(search)}
                    >
                      {search}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
            
            {/* Trending Searches */}
            <div>
              <h2 className="text-xl font-bold text-echo-text-primary mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Trending Searches
              </h2>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((search) => (
                  <Tag
                    key={search}
                    variant="primary"
                    className="cursor-pointer"
                    onClick={() => handleSuggestionClick(search)}
                  >
                    {search}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
