/**
 * AI Book Chat System
 * 
 * Provides context-aware responses about books with intelligent spoiler protection:
 * - Analyzes user questions for spoiler risk
 * - Checks user's reading progress
 * - Provides detailed responses when safe
 * - Warns before revealing spoilers
 */

import booksData from '../data/books.json';
import { getFromLocalStorage } from './localStorage';

/**
 * Get AI response to user's book question
 * @param {string} question - User's question
 * @param {boolean} allowSpoilers - Whether user has enabled spoilers
 * @returns {Object} Response object with content and metadata
 */
export const getAIBookResponse = (question, allowSpoilers = false) => {
  const lowerQuestion = question.toLowerCase();
  
  // Detect question type
  const isAboutPlot = /what happens|who dies|ending|plot|spoiler/i.test(question);
  const isAboutRecommendation = /recommend|suggest|next|should i read/i.test(question);
  const isAboutCharacter = /character|who is|protagonist|main character/i.test(question);
  const isAboutTheme = /theme|meaning|about|message/i.test(question);
  const isAboutSimilar = /similar|like|reminds|compared to/i.test(question);

  // Get user's library for context
  const userLibrary = getFromLocalStorage('userLibrary') || [];
  const books = booksData.books;

  let response = {
    content: '',
    hasSpoilerWarning: false,
    suggestedQuestions: [],
  };

  // Handle recommendation questions
  if (isAboutRecommendation) {
    const topBook = books
      .filter(book => !userLibrary.some(lib => lib.id === book.id))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];

    response.content = `Based on your listening history, I'd recommend "${topBook?.title}" by ${topBook?.author}. It's a ${topBook?.genre} masterpiece with a ${topBook?.rating} rating!\n\nReaders love it for its compelling characters and immersive world-building. Would you like to know more about it?`;
    
    response.suggestedQuestions = [
      'What is this book about?',
      'How long is this book?',
      'What are similar books?',
    ];

    return response;
  }

  // Handle similar book requests
  if (isAboutSimilar) {
    const similarBooks = books
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);

    response.content = `Here are some similar books you might enjoy:\n\n` +
      similarBooks.map((book, i) => 
        `${i + 1}. "${book.title}" by ${book.author} - ${book.genre} (${book.rating}⭐)`
      ).join('\n\n') +
      `\n\nWant to know more about any of these?`;

    response.suggestedQuestions = [
      `Tell me about "${similarBooks[0]?.title}"`,
      'What makes these books similar?',
      'Any other recommendations?',
    ];

    return response;
  }

  // Handle plot/spoiler questions
  if (isAboutPlot) {
    if (!allowSpoilers) {
      response.content = `🛡️ I notice you're asking about plot details! To avoid spoilers, I've hidden the answer.\n\nIf you'd like me to discuss plot points and story details, please toggle "Spoilers OK" above. I'm here to enhance your reading experience, not ruin it! 😊\n\nWould you like to know something spoiler-free instead?`;
      
      response.suggestedQuestions = [
        'What themes does this book explore?',
        'What genre is this book?',
        'What do readers say about this book?',
      ];

      return response;
    } else {
      response.hasSpoilerWarning = true;
      response.content = `Since you've enabled spoilers, I can discuss plot details!\n\n[Demo Note: In a real implementation, I would provide detailed plot analysis based on the specific book and your reading progress. For example, discussing character arcs, plot twists, and story outcomes while being mindful of your current position in the book.]\n\nThe story explores complex themes of identity, choice, and consequence through its intricate plot structure.`;
      
      response.suggestedQuestions = [
        'What happens to the main character?',
        'How does the book end?',
        'What about the sequel?',
      ];

      return response;
    }
  }

  // Handle character questions
  if (isAboutCharacter) {
    const randomBook = books[Math.floor(Math.random() * Math.min(5, books.length))];
    
    response.content = `The main character in "${randomBook?.title}" is a complex, well-developed protagonist who undergoes significant growth throughout the story.\n\nTheir journey explores themes of ${getRandomThemes()} while navigating challenges that test their core beliefs and values.\n\nReaders particularly praise the authentic character development and emotional depth.`;
    
    response.suggestedQuestions = [
      'What other characters are important?',
      'How does the character change?',
      'What motivates the main character?',
    ];

    return response;
  }

  // Handle theme questions
  if (isAboutTheme) {
    response.content = `This book explores several profound themes:\n\n📖 **Identity & Self-Discovery**: Characters grapple with questions of who they are and who they want to become.\n\n🌍 **Society & Change**: The narrative examines how individuals navigate and influence their world.\n\n💡 **Choice & Consequence**: Every decision ripples through the story, showing the weight of our choices.\n\nThese themes are woven naturally into the story, creating layers of meaning that enrich multiple readings.`;
    
    response.suggestedQuestions = [
      'How are these themes developed?',
      'What do critics say about these themes?',
      'Are there any other interpretations?',
    ];

    return response;
  }

  // Default response for general questions
  response.content = `I'm here to help you explore books! I can:\n\n📚 Recommend your next great listen\n🎭 Discuss characters and themes (spoiler-free!)\n🔍 Find similar books you'll love\n⭐ Share what readers are saying\n\nWhat would you like to know? Feel free to ask about any book in your library or our collection!`;
  
  response.suggestedQuestions = [
    'What should I read next?',
    'Tell me about trending books',
    'Recommend a quick listen',
  ];

  return response;
};

/**
 * Get random themes for demo purposes
 * @returns {string} Comma-separated theme list
 */
const getRandomThemes = () => {
  const themes = [
    'identity and belonging',
    'power and corruption',
    'love and sacrifice',
    'truth and deception',
    'hope and resilience',
    'freedom and responsibility',
  ];
  
  const selected = themes.sort(() => Math.random() - 0.5).slice(0, 2);
  return selected.join(' and ');
};

/**
 * Check if question might contain spoilers
 * @param {string} question - User's question
 * @returns {boolean} True if question might reveal spoilers
 */
export const hasSpoilerRisk = (question) => {
  const spoilerKeywords = [
    'dies', 'death', 'killed', 'ending', 'end', 'final', 'conclusion',
    'reveal', 'twist', 'surprise', 'happens', 'what if', 'why did',
    'spoiler', 'plot', 'outcome', 'result', 'fate', 'becomes',
  ];

  const lowerQuestion = question.toLowerCase();
  return spoilerKeywords.some(keyword => lowerQuestion.includes(keyword));
};

/**
 * Get reading progress for a book
 * @param {string} bookId - Book ID
 * @returns {number} Progress percentage (0-100)
 */
export const getReadingProgress = (bookId) => {
  const userProgress = getFromLocalStorage('userProgress') || {};
  return userProgress[bookId]?.progress || 0;
};

/**
 * Determine if spoilers are safe based on progress
 * @param {string} bookId - Book ID
 * @param {number} spoilerChapter - Chapter where spoiler occurs
 * @returns {boolean} True if user has passed spoiler point
 */
export const isSpoilerSafe = (bookId, spoilerChapter) => {
  const progress = getReadingProgress(bookId);
  // Assume book has 20 chapters, calculate percentage
  const chapterProgress = (spoilerChapter / 20) * 100;
  return progress >= chapterProgress;
};

