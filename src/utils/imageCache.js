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
    return 0;
  }
}

