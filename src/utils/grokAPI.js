/**
 * Grok API Integration
 * 
 * Handles all communication with the Grok AI API
 * Includes error handling, retries, and response formatting
 */

import { GROK_API_CONFIG, API_CONFIG } from '../config/api';

/**
 * Make a request to Grok API
 * @param {Array} messages - Array of message objects {role, content}
 * @param {Object} options - Additional options
 * @returns {Promise<string>} API response
 */
export const callGrokAPI = async (messages, options = {}) => {
  const {
    temperature = GROK_API_CONFIG.temperature,
    maxTokens = GROK_API_CONFIG.maxTokens,
    model = GROK_API_CONFIG.model,
  } = options;

  const requestBody = {
    messages,
    model,
    stream: false,
    temperature,
    max_tokens: maxTokens,
  };

  // Check if API key is configured
  if (!GROK_API_CONFIG.apiKey || GROK_API_CONFIG.apiKey === 'YOUR_GROK_API_KEY_HERE') {
    console.warn('🤖 Grok API key not configured - using intelligent mock responses');
    return getMockResponse(messages);
  }

  try {
    const response = await fetch(`${GROK_API_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROK_API_CONFIG.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Grok API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response from AI';
  } catch (error) {
    console.error('Grok API Error:', error);
    throw error;
  }
};

/**
 * Call Grok API with retry logic
 * @param {Array} messages - Message history
 * @param {Object} options - API options
 * @returns {Promise<string>} API response
 */
export const callGrokAPIWithRetry = async (messages, options = {}) => {
  let lastError;
  
  for (let attempt = 0; attempt < API_CONFIG.retryAttempts; attempt++) {
    try {
      return await callGrokAPI(messages, options);
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error.message.includes('401') || error.message.includes('403')) {
        throw error;
      }
      
      // Wait before retrying
      if (attempt < API_CONFIG.retryAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay * (attempt + 1)));
      }
    }
  }
  
  throw lastError;
};

/**
 * Get book recommendations from Grok AI
 * @param {Object} context - User context (library, preferences, friends)
 * @returns {Promise<Array>} Recommended books with reasoning
 */
export const getAIBookRecommendations = async (context) => {
  const { recentBooks, favoriteGenres, friendsReading, bookClubs } = context;

  const systemPrompt = `You are an expert audiobook recommendation AI for Listenable, a social audiobook platform. 
Your goal is to recommend books that will reduce "Time To Next Book" by providing highly personalized suggestions.

Consider:
- User's listening history and favorite genres
- What their friends are currently reading
- Trending books in their book clubs
- Match score (how well the book fits their taste)

Respond with a JSON array of exactly 3 recommendations. Each should have:
{
  "title": "Book Title",
  "author": "Author Name",
  "reason": "Why this book is perfect for them (max 100 chars)",
  "match_score": 85-98,
  "reason_type": "listening_history|friends_activity|book_club|quick_listen|high_rated"
}`;

  const userPrompt = `User Context:
- Recent books: ${recentBooks.join(', ')}
- Favorite genres: ${favoriteGenres.join(', ')}
- Friends reading: ${friendsReading.join(', ')}
- Book clubs: ${bookClubs.join(', ')}

Recommend 3 audiobooks they'll love:`;

  try {
    const response = await callGrokAPIWithRetry([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], {
      temperature: 0.8,
      maxTokens: 800,
    });

    // Parse JSON response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback if parsing fails
    return [];
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
};

/**
 * Get book-related answer from Grok AI
 * @param {string} question - User's question
 * @param {Object} context - Context (book info, spoiler settings, user progress)
 * @returns {Promise<Object>} Response with content and metadata
 */
export const getAIBookAnswer = async (question, context) => {
  const { allowSpoilers, currentBook, userProgress, conversationHistory } = context;

  const systemPrompt = `You are a knowledgeable book discussion AI assistant for Listenable audiobook platform.

CRITICAL RULES:
1. SPOILER PROTECTION: ${allowSpoilers ? 'User has ENABLED spoilers - you may discuss plot details.' : 'User has DISABLED spoilers - DO NOT reveal plot twists, endings, or major reveals.'}
2. Be conversational and enthusiastic about books
3. Provide 2-3 suggested follow-up questions
4. Keep responses under 200 words
5. If discussing a specific book, reference it naturally

When spoilers are DISABLED:
- Discuss themes, writing style, character types (not fates)
- Explain what makes the book compelling
- Compare to similar books
- Share critical reception
- NO plot specifics beyond the premise

When spoilers are ENABLED:
- You may discuss full plot details
- Explain character arcs and endings
- Analyze plot twists
- Still warn: "⚠️ SPOILER WARNING" at the start`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: question },
  ];

  try {
    const response = await callGrokAPIWithRetry(messages, {
      temperature: 0.7,
      maxTokens: 500,
    });

    // Extract suggested questions if present
    const questionMatches = response.match(/(?:suggested questions?|you might ask|try asking):\s*\n?\s*-?\s*(.+?)(?:\n|$)/gi);
    let suggestedQuestions = [];
    
    if (questionMatches) {
      suggestedQuestions = questionMatches
        .slice(0, 3)
        .map(q => q.replace(/(?:suggested questions?|you might ask|try asking):\s*\n?\s*-?\s*/gi, '').trim())
        .filter(q => q.length > 0 && q.length < 100);
    }

    return {
      content: response,
      hasSpoilerWarning: response.includes('SPOILER WARNING') || response.includes('⚠️'),
      suggestedQuestions: suggestedQuestions.length > 0 ? suggestedQuestions : [
        'What should I read next?',
        'Tell me more about this genre',
        'Any similar books?',
      ],
    };
  } catch (error) {
    console.error('Error getting AI answer:', error);
    throw error;
  }
};

/**
 * Health check for Grok API
 * @returns {Promise<boolean>} True if API is accessible
 */
export const checkGrokAPIHealth = async () => {
  try {
    await callGrokAPI([
      { role: 'user', content: 'Hi' }
    ], { maxTokens: 10 });
    return true;
  } catch (error) {
    console.error('Grok API health check failed:', error);
    return false;
  }
};

