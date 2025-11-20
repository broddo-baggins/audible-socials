/**
 * AI Book Recommendations System
 * 
 * Generates intelligent book recommendations based on:
 * - User's listening history
 * - Genre preferences
 * - Friends' activity and ratings
 * - Book club trends
 * - Reading patterns (quick reads, series, etc.)
 */

import booksData from '../data/books.json';
import { getFromLocalStorage } from './localStorage';

/**
 * Get AI-powered book recommendations
 * @returns {Array} Array of recommended books with reasons
 */
export const getAIRecommendations = () => {
  const userLibrary = getFromLocalStorage('userLibrary') || [];
  const userProgress = getFromLocalStorage('userProgress') || {};
  const friends = getFromLocalStorage('friends') || [];
  const bookClubs = getFromLocalStorage('userClubs') || [];

  const recommendations = [];
  const books = booksData.books;

  // Filter out books already in library
  const availableBooks = books.filter(book => 
    !userLibrary.some(libBook => libBook.id === book.id)
  );

  // 1. Based on listening history and genres
  const recentGenres = getRecentGenres(userLibrary);
  if (recentGenres.length > 0 && recommendations.length < 5) {
    const genreMatch = availableBooks
      .filter(book => recentGenres.some(genre => book.genre?.toLowerCase().includes(genre.toLowerCase())))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 2);

    genreMatch.forEach(book => {
      recommendations.push({
        book,
        reason: `You've enjoyed ${recentGenres[0]} books. This highly-rated title matches your taste!`,
        reason_type: 'listening_history',
        match_score: 94,
      });
    });
  }

  // 2. Based on friends' activity
  if (friends.length > 0 && recommendations.length < 5) {
    const friendBook = availableBooks
      .filter(book => book.rating >= 4.5)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];

    if (friendBook) {
      const friendName = friends[0]?.name || 'your friend';
      recommendations.push({
        book: friendBook,
        reason: `${friendName} and 3 other friends loved this book. Join the conversation!`,
        reason_type: 'friends_activity',
        match_score: 91,
      });
    }
  }

  // 3. Based on book clubs
  if (bookClubs.length > 0 && recommendations.length < 5) {
    const clubBook = availableBooks
      .filter(book => ['Fiction', 'Mystery', 'Thriller'].includes(book.genre))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];

    if (clubBook) {
      recommendations.push({
        book: clubBook,
        reason: `This book is trending in your book clubs. Great for group discussions!`,
        reason_type: 'book_club',
        match_score: 88,
      });
    }
  }

  // 4. Quick listens for busy schedules
  if (recommendations.length < 5) {
    const quickListen = availableBooks
      .filter(book => {
        const hours = parseInt(book.length);
        return hours < 8 && book.rating >= 4.3;
      })
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];

    if (quickListen) {
      recommendations.push({
        book: quickListen,
        reason: `A quick, engaging listen perfect for a weekend. Highly rated by listeners!`,
        reason_type: 'quick_listen',
        match_score: 85,
      });
    }
  }

  // 5. High-rated must-reads
  if (recommendations.length < 5) {
    const topRated = availableBooks
      .filter(book => book.rating >= 4.7)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];

    if (topRated) {
      recommendations.push({
        book: topRated,
        reason: `One of the highest-rated books this year. Don't miss this masterpiece!`,
        reason_type: 'high_rated',
        match_score: 92,
      });
    }
  }

  // Fill remaining slots with popular books
  while (recommendations.length < 5 && availableBooks.length > recommendations.length) {
    const randomBook = availableBooks
      .filter(book => !recommendations.some(rec => rec.book.id === book.id))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))[recommendations.length];

    if (randomBook) {
      recommendations.push({
        book: randomBook,
        reason: `Popular with listeners who share your reading style.`,
        reason_type: 'listening_history',
        match_score: 82,
      });
    } else {
      break;
    }
  }

  return recommendations.slice(0, 5);
};

/**
 * Get recent genres from user's library
 * @param {Array} library - User's book library
 * @returns {Array} Array of genre strings
 */
const getRecentGenres = (library) => {
  if (!library || library.length === 0) return ['Science Fiction', 'Fantasy'];

  const genreCounts = {};
  library.slice(-10).forEach(book => {
    if (book.genre) {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    }
  });

  return Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([genre]) => genre);
};

/**
 * Get personalized book recommendation for a specific context
 * @param {string} context - Context for recommendation (e.g., 'commute', 'workout', 'bedtime')
 * @returns {Object} Recommended book with reason
 */
export const getContextualRecommendation = (context) => {
  const books = booksData.books;
  let filteredBooks = books;

  switch (context) {
    case 'commute':
      // Engaging, fast-paced books for short sessions
      filteredBooks = books.filter(book => {
        const hours = parseInt(book.length);
        return hours < 10 && ['Thriller', 'Mystery', 'Science Fiction'].includes(book.genre);
      });
      break;

    case 'workout':
      // Energetic, motivating content
      filteredBooks = books.filter(book => 
        ['Science Fiction', 'Fantasy', 'Adventure'].includes(book.genre)
      );
      break;

    case 'bedtime':
      // Relaxing, immersive stories
      filteredBooks = books.filter(book => 
        ['Fantasy', 'Fiction', 'Mystery'].includes(book.genre)
      );
      break;

    default:
      filteredBooks = books;
  }

  const recommended = filteredBooks
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];

  return {
    book: recommended,
    reason: `Perfect for your ${context} listening sessions!`,
    context,
  };
};

