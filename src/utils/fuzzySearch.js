/**
 * Fuzzy Search Utility
 * Implements fuzzy string matching for better search results
 */

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Edit distance
 */
function levenshteinDistance(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = [];

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Calculate similarity score between two strings (0-1)
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score (0 = no match, 1 = perfect match)
 */
export function calculateSimilarity(str1, str2) {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Exact match
  if (s1 === s2) return 1;
  
  // Contains match (higher score)
  if (s1.includes(s2) || s2.includes(s1)) {
    return 0.8;
  }
  
  // Levenshtein distance
  const maxLen = Math.max(s1.length, s2.length);
  const distance = levenshteinDistance(s1, s2);
  return 1 - (distance / maxLen);
}

/**
 * Fuzzy search through an array of items
 * @param {Array} items - Array of items to search
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Array} Sorted array of matching items with scores
 */
export function fuzzySearch(items, query, options = {}) {
  const {
    keys = ['title', 'name'],
    threshold = 0.3,
    limit = null,
    caseSensitive = false
  } = options;

  if (!query || query.trim() === '') {
    return items;
  }

  const searchQuery = caseSensitive ? query : query.toLowerCase();
  
  // Score each item
  const scoredItems = items.map(item => {
    let maxScore = 0;
    let matchedKey = null;

    // Check each key
    keys.forEach(key => {
      const value = getNestedValue(item, key);
      if (value) {
        const valueStr = caseSensitive ? String(value) : String(value).toLowerCase();
        const score = calculateSimilarity(valueStr, searchQuery);
        
        if (score > maxScore) {
          maxScore = score;
          matchedKey = key;
        }
      }
    });

    return {
      item,
      score: maxScore,
      matchedKey
    };
  });

  // Filter by threshold and sort by score
  let results = scoredItems
    .filter(({ score }) => score >= threshold)
    .sort((a, b) => b.score - a.score);

  // Apply limit if specified
  if (limit && limit > 0) {
    results = results.slice(0, limit);
  }

  return results.map(({ item, score, matchedKey }) => ({
    ...item,
    _searchScore: score,
    _matchedKey: matchedKey
  }));
}

/**
 * Get nested value from object using dot notation
 * @param {Object} obj - Object to search
 * @param {string} path - Dot-notated path (e.g., 'author.name')
 * @returns {any} Value at path
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Highlight matching portions of text
 * @param {string} text - Text to highlight
 * @param {string} query - Search query
 * @returns {Array} Array of text segments with highlight flags
 */
export function highlightMatches(text, query) {
  if (!query || !text) return [{ text, highlight: false }];

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) return [{ text, highlight: false }];

  return [
    { text: text.substring(0, index), highlight: false },
    { text: text.substring(index, index + query.length), highlight: true },
    { text: text.substring(index + query.length), highlight: false }
  ];
}

/**
 * Multi-field search with weighted scoring
 * @param {Array} items - Items to search
 * @param {string} query - Search query
 * @param {Object} fieldWeights - Object mapping field names to weights
 * @returns {Array} Sorted search results
 */
export function weightedSearch(items, query, fieldWeights = {}) {
  if (!query || query.trim() === '') {
    return items;
  }

  const searchQuery = query.toLowerCase();
  
  const scoredItems = items.map(item => {
    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(fieldWeights).forEach(([field, weight]) => {
      const value = getNestedValue(item, field);
      if (value) {
        const valueStr = String(value).toLowerCase();
        const similarity = calculateSimilarity(valueStr, searchQuery);
        totalScore += similarity * weight;
        totalWeight += weight;
      }
    });

    const normalizedScore = totalWeight > 0 ? totalScore / totalWeight : 0;

    return {
      item,
      score: normalizedScore
    };
  });

  return scoredItems
    .filter(({ score }) => score > 0.3)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}

export default {
  fuzzySearch,
  calculateSimilarity,
  highlightMatches,
  weightedSearch
};

