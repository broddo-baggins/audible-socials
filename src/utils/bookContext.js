/**
 * Book Context Utilities
 * 
 * Provides book-specific context to AI for intelligent discussions
 */

import booksData from '../data/books.json';

/**
 * Get all books from catalog
 * @returns {Array} All books
 */
export const getAllBooks = () => {
  return booksData || [];
};

/**
 * Find a book by title (fuzzy match)
 * @param {string} title - Book title to search
 * @returns {Object|null} Best matching book or null
 */
export const getBookByTitle = (title) => {
  if (!title) return null;
  
  const books = getAllBooks();
  const lowerTitle = title.toLowerCase();
  
  // Exact match first
  let book = books.find(b => b.title.toLowerCase() === lowerTitle);
  if (book) return book;
  
  // Partial match
  book = books.find(b => b.title.toLowerCase().includes(lowerTitle));
  if (book) return book;
  
  // Very fuzzy match (any word matches)
  const titleWords = lowerTitle.split(' ').filter(w => w.length > 3);
  if (titleWords.length > 0) {
    book = books.find(b => 
      titleWords.some(word => b.title.toLowerCase().includes(word))
    );
  }
  
  return book || null;
};

/**
 * Extract book mentions from text
 * @param {string} text - Text to analyze
 * @returns {Array} Array of matched books
 */
export const detectBookMentions = (text) => {
  const books = getAllBooks();
  const lowerText = text.toLowerCase();
  const matches = [];
  
  for (const book of books) {
    const lowerTitle = book.title.toLowerCase();
    
    // Check for exact title match
    if (lowerText.includes(lowerTitle)) {
      matches.push(book);
      continue;
    }
    
    // Check for major words (3+ characters)
    const titleWords = lowerTitle.split(' ').filter(w => w.length > 3);
    if (titleWords.length > 0 && titleWords.every(word => lowerText.includes(word))) {
      matches.push(book);
      continue;
    }
    
    // Check author name
    if (book.author && lowerText.includes(book.author.toLowerCase())) {
      matches.push(book);
    }
  }
  
  return matches;
};

/**
 * Get book context for AI
 * @param {Object} book - Book object
 * @param {number} userProgress - User's progress percentage (0-100)
 * @returns {string} Formatted book context
 */
export const getBookContextForAI = (book, userProgress = 0) => {
  if (!book) return '';
  
  const context = [];
  
  context.push(`**Book Information:**`);
  context.push(`- Title: "${book.title}"`);
  context.push(`- Author: ${book.author}`);
  
  if (book.narrator) {
    context.push(`- Narrator: ${book.narrator}`);
  }
  
  context.push(`- Genre: ${book.genre}`);
  context.push(`- Duration: ${book.duration || book.durationMinutes ? `${book.durationMinutes} minutes` : 'Unknown'}`);
  context.push(`- Rating: ${book.rating}/5 (${book.ratingsCount || 0} ratings)`);
  context.push(`- Release Date: ${book.releaseDate || 'Unknown'}`);
  
  if (book.description) {
    context.push(`\n**Description:**`);
    context.push(book.description);
  }
  
  if (userProgress > 0) {
    context.push(`\n**User Progress:** ${userProgress}% complete`);
  }
  
  if (book.chapters && book.chapters.length > 0) {
    context.push(`\n**Chapter Count:** ${book.chapters.length} chapters`);
  }
  
  return context.join('\n');
};

