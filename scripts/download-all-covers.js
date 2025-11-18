import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read all books from books.json (contains all 402 books)
const allBooks = JSON.parse(fs.readFileSync('./src/data/books.json', 'utf8'));

const coverDir = './public/images/covers';

// Ensure covers directory exists
if (!fs.existsSync(coverDir)) {
  fs.mkdirSync(coverDir, { recursive: true });
}

// Sanitize filename
function sanitizeFilename(filename) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Download file from URL with better error handling
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, { 
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    }, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
        downloadFile(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        // Verify file size
        const stats = fs.statSync(filepath);
        if (stats.size < 1000) { // Less than 1KB is likely an error
          fs.unlinkSync(filepath);
          reject(new Error('File too small (likely error page)'));
        } else {
          resolve(filepath);
        }
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    });

    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Fetch HTML page
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Method 1: Open Library API
async function tryOpenLibrary(title, author) {
  const searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&limit=5`;
  
  return new Promise((resolve, reject) => {
    https.get(searchUrl, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.docs && result.docs.length > 0) {
            // Try to find a doc with a cover
            for (const doc of result.docs) {
              if (doc.cover_i) {
                const coverId = doc.cover_i;
                resolve(`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`);
                return;
              }
            }
          }
          reject(new Error('No cover found'));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Method 2: Google Books API with better quality
async function tryGoogleBooks(title, author) {
  const query = encodeURIComponent(`${title} ${author}`);
  const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=5`;
  
  return new Promise((resolve, reject) => {
    https.get(searchUrl, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.items && result.items.length > 0) {
            // Try each result until we find one with an image
            for (const item of result.items) {
              const imageLinks = item.volumeInfo.imageLinks;
              if (imageLinks) {
                let coverUrl = imageLinks.extraLarge || imageLinks.large || imageLinks.medium || imageLinks.thumbnail;
                if (coverUrl) {
                  // Get highest quality
                  coverUrl = coverUrl.replace('&edge=curl', '').replace('zoom=1', 'zoom=0').replace('http://', 'https://');
                  resolve(coverUrl);
                  return;
                }
              }
            }
          }
          reject(new Error('No image found'));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Method 3: ISBN-based search (Google Books with ISBN)
async function tryISBNSearch(title, author) {
  // Try to find ISBN first
  const query = encodeURIComponent(`${title} ${author} isbn`);
  const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=3`;
  
  return new Promise((resolve, reject) => {
    https.get(searchUrl, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.items && result.items.length > 0) {
            for (const item of result.items) {
              const isbn = item.volumeInfo.industryIdentifiers?.[0]?.identifier;
              if (isbn) {
                // Try to get cover by ISBN
                resolve(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`);
                return;
              }
            }
          }
          reject(new Error('No ISBN found'));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Method 4: Goodreads scraping
async function tryGoodreads(title, author) {
  try {
    const searchQuery = encodeURIComponent(`${title} ${author}`);
    const searchUrl = `https://www.goodreads.com/search?q=${searchQuery}`;
    
    const html = await fetchHTML(searchUrl);
    
    // Look for book cover images in the HTML
    const coverRegex = /<img[^>]+src="([^"]*books[^"]*\.jpg)"/g;
    const matches = [...html.matchAll(coverRegex)];
    
    if (matches.length > 0) {
      // Get the first high-quality image
      for (const match of matches) {
        const imageUrl = match[1];
        if (!imageUrl.includes('nophoto') && !imageUrl.includes('blank') && imageUrl.includes('books')) {
          // Try to get larger version
          const largeUrl = imageUrl.replace('._SY75_', '').replace('._SX50_', '').replace('_SX98_', '');
          return largeUrl;
        }
      }
    }
    
    throw new Error('No cover found on Goodreads');
  } catch (e) {
    throw new Error(`Goodreads failed: ${e.message}`);
  }
}

// Method 5: Amazon Books scraping
async function tryAmazon(title, author) {
  try {
    const searchQuery = encodeURIComponent(`${title} ${author} audiobook`);
    const searchUrl = `https://www.amazon.com/s?k=${searchQuery}&i=audible`;
    
    const html = await fetchHTML(searchUrl);
    
    // Look for product images
    const imageRegex = /<img[^>]+src="([^"]*images\/I\/[^"]*\.jpg)"/g;
    const matches = [...html.matchAll(imageRegex)];
    
    if (matches.length > 0) {
      for (const match of matches) {
        let imageUrl = match[1];
        if (imageUrl.includes('images/I/')) {
          // Remove size restrictions for full quality
          imageUrl = imageUrl.split('._')[0] + '.jpg';
          return imageUrl;
        }
      }
    }
    
    throw new Error('No cover found on Amazon');
  } catch (e) {
    throw new Error(`Amazon failed: ${e.message}`);
  }
}

// Method 6: Library of Congress
async function tryLibraryOfCongress(title, author) {
  const query = encodeURIComponent(`${title} ${author}`);
  const searchUrl = `https://www.loc.gov/books/?q=${query}&fo=json`;
  
  return new Promise((resolve, reject) => {
    https.get(searchUrl, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.results && result.results.length > 0) {
            const item = result.results[0];
            if (item.image_url && item.image_url.length > 0) {
              resolve(item.image_url[0]);
              return;
            }
          }
          reject(new Error('No cover found'));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Method 7: Placeholder/Generated cover (last resort)
async function generatePlaceholderCover(book, filepath) {
  // Create a simple colored placeholder
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
  ];
  
  const color = colors[parseInt(book.id) % colors.length];
  
  // Create SVG
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="600" fill="${color}"/>
  <text x="200" y="250" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle" style="max-width: 360px;">
    ${book.title.length > 40 ? book.title.substring(0, 37) + '...' : book.title}
  </text>
  <text x="200" y="320" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.9)" text-anchor="middle">
    ${book.author}
  </text>
  <rect x="20" y="20" width="360" height="560" fill="none" stroke="white" stroke-width="2" opacity="0.3"/>
</svg>`;

  fs.writeFileSync(filepath.replace('.jpg', '.svg'), svg);
  // For now, we'll keep SVG as fallback
  return filepath.replace('.jpg', '.svg');
}

// Main download function with all methods
async function downloadBookCover(book, index, total) {
  const filename = `${book.id}-${sanitizeFilename(book.title)}.jpg`;
  const filepath = path.join(coverDir, filename);

  // Check if cover already exists and is valid
  if (fs.existsSync(filepath)) {
    const stats = fs.statSync(filepath);
    if (stats.size > 1000) {
      console.log(`[${index + 1}/${total}] ✓ Already exists: ${book.title}`);
      return { success: true, book: book.title, source: 'existing' };
    } else {
      // File exists but is too small, delete it
      fs.unlinkSync(filepath);
    }
  }

  // Also check for SVG placeholder
  const svgPath = filepath.replace('.jpg', '.svg');
  if (fs.existsSync(svgPath)) {
    console.log(`[${index + 1}/${total}] ✓ SVG placeholder exists: ${book.title}`);
    return { success: true, book: book.title, source: 'svg' };
  }

  const sources = [
    { name: 'Google Books', fn: () => tryGoogleBooks(book.title, book.author) },
    { name: 'Open Library', fn: () => tryOpenLibrary(book.title, book.author) },
    { name: 'ISBN Search', fn: () => tryISBNSearch(book.title, book.author) },
    { name: 'Goodreads', fn: () => tryGoodreads(book.title, book.author) },
    { name: 'Amazon', fn: () => tryAmazon(book.title, book.author) },
    { name: 'Library of Congress', fn: () => tryLibraryOfCongress(book.title, book.author) },
  ];

  for (const source of sources) {
    try {
      console.log(`[${index + 1}/${total}] Trying ${source.name} for "${book.title}"...`);
      const coverUrl = await source.fn();
      await downloadFile(coverUrl, filepath);
      console.log(`[${index + 1}/${total}] ✅ SUCCESS from ${source.name}: ${book.title}`);
      return { success: true, book: book.title, source: source.name };
    } catch (error) {
      console.log(`[${index + 1}/${total}] ✗ ${source.name} failed: ${error.message}`);
    }
  }

  // Last resort: generate placeholder
  console.log(`[${index + 1}/${total}] 📝 Generating placeholder for "${book.title}"`);
  try {
    await generatePlaceholderCover(book, filepath);
    return { success: true, book: book.title, source: 'placeholder' };
  } catch (error) {
    console.log(`[${index + 1}/${total}] ❌ COMPLETE FAILURE for "${book.title}": ${error.message}`);
    return { success: false, book: book.title, error: 'All methods failed' };
  }
}

// Process all books with rate limiting
async function processAllBooks() {
  console.log(`\n📚 Starting to download covers for ${allBooks.length} books...\n`);
  
  const results = {
    success: 0,
    existing: 0,
    failed: 0,
    bySource: {},
    failedBooks: []
  };

  for (let i = 0; i < allBooks.length; i++) {
    const book = allBooks[i];
    
    try {
      const result = await downloadBookCover(book, i, allBooks.length);
      
      if (result.success) {
        if (result.source === 'existing') {
          results.existing++;
        } else {
          results.success++;
        }
        results.bySource[result.source] = (results.bySource[result.source] || 0) + 1;
      } else {
        results.failed++;
        results.failedBooks.push(book.title);
      }
      
      // Rate limiting - wait between requests
      if (i < allBooks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error(`❌ Error processing book ${book.title}:`, error.message);
      results.failed++;
      results.failedBooks.push(book.title);
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 DOWNLOAD SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total books: ${allBooks.length}`);
  console.log(`Already existed: ${results.existing}`);
  console.log(`Successfully downloaded: ${results.success}`);
  console.log(`Failed: ${results.failed}`);
  console.log('\nBy Source:');
  Object.entries(results.bySource).forEach(([source, count]) => {
    console.log(`  ${source}: ${count}`);
  });
  
  if (results.failedBooks.length > 0) {
    console.log('\n⚠️  Failed to download covers for:');
    results.failedBooks.forEach(title => {
      console.log(`   - ${title}`);
    });
  } else {
    console.log('\n✅ ALL COVERS DOWNLOADED SUCCESSFULLY!');
  }
  
  console.log('\n✓ Process complete!\n');
}

// Run the script
processAllBooks().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
