import { getCachedImage, cacheImage } from './imageCache';

// Fallback placeholder images based on genre
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
 * Fetches a Google Images cover for a book
 * In a real implementation, this would use the Google Custom Search API
 * For this demo, we'll use the Unsplash Source API with book-related images
 */
export async function fetchGoogleImagesCover(bookId, coverQuery, genre) {
  // Check cache first
  const cached = getCachedImage(bookId);
  if (cached) {
    return cached;
  }
  
  try {
    // In a real implementation, you would use:
    // const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    // const searchEngineId = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID;
    // const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(coverQuery)}&cx=${searchEngineId}&searchType=image&key=${apiKey}&num=1`;
    
    // For demo purposes, we'll use a fallback based on the genre
    // This simulates an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const fallbackUrl = FALLBACK_IMAGES[genre] || FALLBACK_IMAGES.default;
    
    // Add some uniqueness to avoid same images
    const uniqueUrl = `${fallbackUrl}&sig=${bookId}`;
    
    // Cache the result
    cacheImage(bookId, uniqueUrl);
    
    return uniqueUrl;
  } catch (error) {
    console.error('Error fetching book cover:', error);
    return FALLBACK_IMAGES[genre] || FALLBACK_IMAGES.default;
  }
}

/**
 * Preload covers for multiple books
 */
export async function preloadBookCovers(books) {
  const promises = books.map(book => 
    fetchGoogleImagesCover(book.id, book.coverQuery, book.genre)
  );
  
  try {
    await Promise.all(promises);
  } catch (error) {
    console.error('Error preloading book covers:', error);
  }
}

/**
 * Get optimized image URL for mobile
 */
export function getOptimizedImageUrl(url, isMobile = false) {
  if (!url) return FALLBACK_IMAGES.default;
  
  // For Unsplash images, we can adjust the size
  if (url.includes('unsplash.com')) {
    const width = isMobile ? 300 : 400;
    const height = isMobile ? 450 : 600;
    return url.replace(/w=\d+/, `w=${width}`).replace(/h=\d+/, `h=${height}`);
  }
  
  return url;
}

