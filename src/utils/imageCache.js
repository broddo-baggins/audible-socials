const CACHE_KEY = 'audible_image_cache';
const CACHE_EXPIRY_DAYS = 30;

export function getCachedImage(bookId) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const cached = cache[bookId];
    
    if (cached) {
      const expiryDate = new Date(cached.timestamp);
      expiryDate.setDate(expiryDate.getDate() + CACHE_EXPIRY_DAYS);
      
      if (new Date() < expiryDate) {
        return cached.url;
      } else {
        // Expired, remove from cache
        delete cache[bookId];
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      }
    }
  } catch (error) {
    console.error('Error reading image cache:', error);
  }
  
  return null;
}

export function cacheImage(bookId, url) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    cache[bookId] = {
      url,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Error caching image:', error);
  }
}

export function clearImageCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.error('Error clearing image cache:', error);
  }
}

export function getCacheSize() {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    return Object.keys(cache).length;
  } catch (error) {
    console.error('Error calculating image cache size:', error);
    return 0;
  }
}

// Fallback placeholder images
const FALLBACK_IMAGES = {
  'Science Fiction': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop',
  'Fiction': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
  'Fantasy': 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop',
  'Mystery & Thriller': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
  'Self Development': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop',
  'Memoir & Biography': 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop',
  'History': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=600&fit=crop',
  'Historical Fiction': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop',
  'Romance': 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&h=600&fit=crop',
  'Horror': 'https://images.unsplash.com/photo-1509266272358-7701da638078?w=400&h=600&fit=crop',
  'default': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop'
};

/**
 * Get image URL for a book cover
 * Returns a placeholder image URL for demo purposes
 */
export async function getImageUrl(query, genre = 'default') {
  // For demo purposes, return a fallback image based on genre or default
  // In a real implementation, this would fetch from an API
  await new Promise(resolve => setTimeout(resolve, 10));
  
  const fallbackUrl = FALLBACK_IMAGES[genre] || FALLBACK_IMAGES.default;
  return fallbackUrl + '&sig=' + Math.random().toString(36).substring(7);
}
