/**
 * Search and filter utilities for books
 */

/**
 * Search books by query string
 * Searches in title, author, narrator, description, and genre
 */
export const searchBooks = (books, query) => {
  if (!query || query.trim() === '') {
    return books;
  }
  
  const searchTerm = query.toLowerCase().trim();
  const searchWords = searchTerm.split(' ').filter(word => word.length > 0);
  
  return books.filter(book => {
    // Create searchable text from book properties
    const searchableText = [
      book.title,
      book.author,
      book.narrator,
      book.description,
      book.genre,
      book.series,
      book.publisher,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    
    // Check if all search words are present
    return searchWords.every(word => searchableText.includes(word));
  }).map(book => {
    // Calculate relevance score
    let score = 0;
    const titleMatch = book.title.toLowerCase().includes(searchTerm);
    const authorMatch = book.author.toLowerCase().includes(searchTerm);
    const exactMatch = book.title.toLowerCase() === searchTerm;
    
    if (exactMatch) score += 100;
    if (titleMatch) score += 50;
    if (authorMatch) score += 30;
    
    return { ...book, relevanceScore: score };
  }).sort((a, b) => b.relevanceScore - a.relevanceScore);
};

/**
 * Filter books based on multiple criteria
 */
export const filterBooks = (books, filters) => {
  let filtered = [...books];
  
  // Filter by content type
  if (filters.contentType && filters.contentType.length > 0) {
    filtered = filtered.filter(book => 
      filters.contentType.includes(book.contentType)
    );
  }
  
  // Filter by genre
  if (filters.genre && filters.genre.length > 0) {
    filtered = filtered.filter(book => 
      filters.genre.includes(book.genre)
    );
  }
  
  // Filter by duration
  if (filters.duration) {
    filtered = filtered.filter(book => {
      const mins = book.durationMinutes || 0;
      switch (filters.duration) {
        case 'short': return mins < 180; // < 3 hours
        case 'medium': return mins >= 180 && mins < 600; // 3-10 hours
        case 'long': return mins >= 600 && mins < 900; // 10-15 hours
        case 'veryLong': return mins >= 900; // 15+ hours
        default: return true;
      }
    });
  }
  
  // Filter by language
  if (filters.language && filters.language.length > 0) {
    filtered = filtered.filter(book => 
      filters.language.includes(book.language)
    );
  }
  
  // Filter by rating
  if (filters.rating) {
    const minRating = parseFloat(filters.rating);
    filtered = filtered.filter(book => 
      (book.rating || 0) >= minRating
    );
  }
  
  // Filter by release date
  if (filters.releaseDate) {
    const now = new Date();
    filtered = filtered.filter(book => {
      const releaseDate = new Date(book.releaseDate);
      const daysDiff = Math.floor((now - releaseDate) / (1000 * 60 * 60 * 24));
      
      switch (filters.releaseDate) {
        case 'week': return daysDiff <= 7;
        case 'month': return daysDiff <= 30;
        case 'threeMonths': return daysDiff <= 90;
        case 'year': return daysDiff <= 365;
        default: return true;
      }
    });
  }
  
  return filtered;
};

/**
 * Sort books based on criteria
 */
export const sortBooks = (books, sortBy) => {
  const sorted = [...books];
  
  switch (sortBy) {
    case 'relevance':
      // Already sorted by relevance from search
      return sorted;
      
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
      
    case 'author':
      return sorted.sort((a, b) => a.author.localeCompare(b.author));
      
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      
    case 'duration':
      return sorted.sort((a, b) => (a.durationMinutes || 0) - (b.durationMinutes || 0));
      
    case 'releaseDate':
      return sorted.sort((a, b) => 
        new Date(b.releaseDate) - new Date(a.releaseDate)
      );
      
    case 'popular':
      return sorted.sort((a, b) => (b.ratingsCount || 0) - (a.ratingsCount || 0));
      
    default:
      return sorted;
  }
};

/**
 * Get filter options from books
 */
export const getFilterOptions = (books) => {
  const options = {
    contentTypes: [],
    genres: [],
    languages: [],
    durations: [
      { value: 'short', label: 'Under 3 hours' },
      { value: 'medium', label: '3-10 hours' },
      { value: 'long', label: '10-15 hours' },
      { value: 'veryLong', label: '15+ hours' },
    ],
    ratings: [
      { value: '4.5', label: '4.5+ stars' },
      { value: '4.0', label: '4.0+ stars' },
      { value: '3.5', label: '3.5+ stars' },
      { value: '3.0', label: '3.0+ stars' },
    ],
    releaseDates: [
      { value: 'week', label: 'Last 7 days' },
      { value: 'month', label: 'Last 30 days' },
      { value: 'threeMonths', label: 'Last 3 months' },
      { value: 'year', label: 'Last year' },
    ],
  };
  
  // Extract unique content types
  const contentTypeSet = new Set();
  const genreSet = new Set();
  const languageSet = new Set();
  
  books.forEach(book => {
    if (book.contentType) contentTypeSet.add(book.contentType);
    if (book.genre) genreSet.add(book.genre);
    if (book.language) languageSet.add(book.language);
  });
  
  options.contentTypes = Array.from(contentTypeSet).sort();
  options.genres = Array.from(genreSet).sort();
  options.languages = Array.from(languageSet).sort();
  
  return options;
};

/**
 * Paginate results
 */
export const paginateResults = (items, page = 1, perPage = 24) => {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  
  return {
    items: items.slice(start, end),
    currentPage: page,
    totalPages: Math.ceil(items.length / perPage),
    totalItems: items.length,
    hasNextPage: end < items.length,
    hasPreviousPage: page > 1,
  };
};

/**
 * Get autocomplete suggestions
 */
export const getAutocompleteSuggestions = (books, query) => {
  if (!query || query.trim().length < 2) {
    return { titles: [], authors: [], genres: [] };
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  const titles = books
    .filter(book => book.title.toLowerCase().includes(searchTerm))
    .map(book => book.title)
    .slice(0, 5);
  
  const authors = [...new Set(
    books
      .filter(book => book.author.toLowerCase().includes(searchTerm))
      .map(book => book.author)
  )].slice(0, 5);
  
  const genres = [...new Set(
    books
      .filter(book => book.genre.toLowerCase().includes(searchTerm))
      .map(book => book.genre)
  )].slice(0, 3);
  
  return { titles, authors, genres };
};

/**
 * Debounce utility
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
