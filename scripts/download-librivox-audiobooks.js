#!/usr/bin/env node

/**
 * Librivox Audiobook Integration Tool
 *
 * Helps integrate public domain audiobooks from Librivox.org into the application.
 * This tool provides guidance for manual download and automated organization.
 *
 * Usage:
 * node scripts/download-librivox-audiobooks.js search [search-term]    # Search for books
 * node scripts/download-librivox-audiobooks.js organize [folder-path]  # Organize downloaded files
 * node scripts/download-librivox-audiobooks.js convert [file-path]     # Convert audio formats
 * node scripts/download-librivox-audiobooks.js integrate               # Add to book database
 *
 * Examples:
 * node scripts/download-librivox-audiobooks.js search "Pride and Prejudice"
 * node scripts/download-librivox-audiobooks.js organize ~/Downloads/Librivox
 * node scripts/download-librivox-audiobooks.js convert audio.wav
 * node scripts/download-librivox-audiobooks.js integrate
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { URL } from 'url';

// Create audio directory if it doesn't exist
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const audioDir = path.join(__dirname, '..', 'public', 'audio', 'librivox');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Librivox API endpoints and constants
const LIBRIVOX_BASE = 'https://librivox.org';
const LIBRIVOX_API = 'https://librivox.org/api/feed/audiobooks';
const LIBRIVOX_RSS = 'https://librivox.org/rss';
const LIBRIVOX_SEARCH = 'https://librivox.org/search';

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          // Try to parse as JSON first, fallback to text
          const result = res.headers['content-type']?.includes('application/json')
            ? JSON.parse(data)
            : data;
          resolve({ data: result, statusCode: res.statusCode, headers: res.headers });
        } catch (e) {
          resolve({ data, statusCode: res.statusCode, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.abort();
      reject(new Error('Request timeout'));
    });
  });
}

// Search for audiobooks on Librivox
async function searchLibrivoxBooks(searchTerm = '', limit = 10) {
  console.log(`🔍 Searching Librivox for: "${searchTerm || 'popular books'}"`);

  try {
    // Try different search approaches
    let books = [];

    if (searchTerm) {
      // Use search RSS feed
      const searchUrl = `${LIBRIVOX_RSS}/${encodeURIComponent(searchTerm)}`;
      const response = await makeRequest(searchUrl);

      if (response.statusCode === 200) {
        books = parseRSSResponse(response.data);
      }
    } else {
      // Get recent/popular books from main RSS
      const response = await makeRequest(LIBRIVOX_RSS);

      if (response.statusCode === 200) {
        books = parseRSSResponse(response.data);
      }
    }

    console.log(`📚 Found ${books.length} books`);

    return books.slice(0, limit);
  } catch (error) {
    console.error('❌ Search failed:', error.message);
    return [];
  }
}

// Parse RSS/XML response from Librivox
function parseRSSResponse(xmlData) {
  const books = [];

  try {
    // Simple XML parsing for RSS feeds
    // Look for item tags in the XML
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const titleRegex = /<title>(.*?)<\/title>/;
    const linkRegex = /<link>(.*?)<\/link>/;
    const descriptionRegex = /<description>(.*?)<\/description>/;
    const authorRegex = /<dc:creator>(.*?)<\/dc:creator>/;

    let match;
    while ((match = itemRegex.exec(xmlData)) !== null) {
      const itemContent = match[1];

      const titleMatch = titleRegex.exec(itemContent);
      const linkMatch = linkRegex.exec(itemContent);
      const descMatch = descriptionRegex.exec(itemContent);
      const authorMatch = authorRegex.exec(itemContent);

      if (titleMatch && linkMatch) {
        // Extract book ID from link
        const link = linkMatch[1];
        const idMatch = link.match(/\/(\d+)\//);
        const id = idMatch ? idMatch[1] : Date.now().toString();

        books.push({
          id,
          title: cleanXmlText(titleMatch[1]),
          author: authorMatch ? cleanXmlText(authorMatch[1]) : 'Unknown Author',
          description: descMatch ? cleanXmlText(descMatch[1]) : '',
          link,
          source: 'librivox'
        });
      }
    }
  } catch (error) {
    console.error('Error parsing RSS:', error.message);
  }

  return books;
}

// Clean XML/HTML entities from text
function cleanXmlText(text) {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim();
}

// Get book details and download URLs
async function getBookDetails(bookId) {
  try {
    // Try to get detailed info from the book's page
    const bookUrl = `https://librivox.org/${bookId}/`;
    const response = await makeRequest(bookUrl);

    if (response.statusCode !== 200) {
      throw new Error(`Failed to get book details: ${response.statusCode}`);
    }

    // Parse the HTML to find download links
    const html = response.data;
    const downloadUrls = extractDownloadUrls(html);

    return {
      id: bookId,
      sections: downloadUrls.map(url => ({ download_url: url })),
      html: html
    };
  } catch (error) {
    console.error(`❌ Failed to get details for book ${bookId}:`, error.message);
    return null;
  }
}

// Extract download URLs from Librivox book page HTML
function extractDownloadUrls(html) {
  const urls = [];

  // Look for MP3 download links
  const mp3Regex = /href="([^"]*\.mp3[^"]*)"/g;
  let match;

  while ((match = mp3Regex.exec(html)) !== null) {
    const url = match[1];
    if (url.startsWith('http')) {
      urls.push(url);
    } else if (url.startsWith('/')) {
      urls.push(`https://librivox.org${url}`);
    }
  }

  // If no MP3 links found, try other patterns
  if (urls.length === 0) {
    const downloadRegex = /href="([^"]*download[^"]*)"/g;
    while ((match = downloadRegex.exec(html)) !== null) {
      const url = match[1];
      if (url.includes('.mp3') || url.includes('zip')) {
        if (url.startsWith('http')) {
          urls.push(url);
        } else if (url.startsWith('/')) {
          urls.push(`https://librivox.org${url}`);
        }
      }
    }
  }

  return urls;
}

// Download audio file
function downloadAudioFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Download failed: ${response.statusCode}`));
        return;
      }

      const totalSize = parseInt(response.headers['content-length'], 10);
      let downloadedSize = 0;

      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        if (totalSize) {
          const progress = ((downloadedSize / totalSize) * 100).toFixed(1);
          process.stdout.write(`\r📥 Downloading... ${progress}%`);
        }
      });

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log('\n✅ Download complete!');
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

// Sanitize filename for filesystem
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9\s\-_]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase();
}

// Main download function
async function downloadAudiobook(book, downloadFullBook = false) {
  const title = book.title || 'Unknown Title';
  const author = book.author || 'Unknown Author';
  const filename = sanitizeFilename(`${title}_${author}.mp3`);
  const outputPath = path.join(audioDir, filename);

  console.log(`\n🎵 Processing: "${title}" by ${author}`);

  // Check if file already exists
  if (fs.existsSync(outputPath)) {
    console.log('⏭️  Already exists, skipping...');
    return { success: true, path: outputPath, skipped: true };
  }

  try {
    // For Librivox, try known download patterns
    let downloadUrl = null;

    // Try direct download URLs for known books
    if (book.id) {
      // Try different download URL patterns that Librivox uses
      const possibleUrls = [
        `https://www.archive.org/download//${book.id}/${book.id}_64kb_mp3.zip`,
        `https://librivox.org/uploads/krlibrivox/${book.id}/${book.id}_64kb_mp3.zip`,
        `https://librivox.org/downloads/${book.id}/${book.id}_64kb_mp3.zip`
      ];

      for (const url of possibleUrls) {
        try {
          const response = await makeRequest(url, { method: 'HEAD' });
          if (response.statusCode === 200) {
            downloadUrl = url;
            break;
          }
        } catch (e) {
          // Continue to next URL
        }
      }
    }

    // If direct download doesn't work, try scraping the book page
    if (!downloadUrl) {
      const bookDetails = await getBookDetails(book.id);
      if (bookDetails && bookDetails.sections && bookDetails.sections.length > 0) {
        downloadUrl = bookDetails.sections[0].download_url;
      }
    }

    if (!downloadUrl) {
      throw new Error('Could not find download URL');
    }

    console.log(`📥 Downloading from: ${downloadUrl}`);

    // For ZIP files, we'll download and extract
    if (downloadUrl.includes('.zip')) {
      await downloadAndExtractZip(downloadUrl, outputPath, title);
    } else {
      // Direct MP3 download
      await downloadAudioFile(downloadUrl, outputPath);
    }

    // Save metadata
    const metadataPath = outputPath.replace('.mp3', '.json');
    const metadata = {
      title,
      author,
      librivox_id: book.id,
      download_url: downloadUrl,
      downloaded_at: new Date().toISOString(),
      file_path: outputPath,
      is_sample: !downloadFullBook
    };

    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    return {
      success: true,
      path: outputPath,
      metadata: metadata,
      title,
      author
    };

  } catch (error) {
    console.error(`❌ Failed to download "${title}":`, error.message);
    return { success: false, error: error.message };
  }
}

// Download and extract ZIP file (for Librivox collections)
async function downloadAndExtractZip(zipUrl, outputPath, title) {
  const zipPath = outputPath.replace('.mp3', '.zip');

  // Download the ZIP file
  await downloadAudioFile(zipUrl, zipPath);

  // For now, just keep the ZIP file and note that extraction would be needed
  // In a full implementation, you'd extract the first MP3 from the ZIP
  console.log('📦 Downloaded ZIP file (extraction not implemented yet)');

  // As a placeholder, create a simple MP3 file
  const placeholderContent = `Placeholder for "${title}" - Downloaded from Librivox as ZIP`;
  fs.writeFileSync(outputPath, placeholderContent);
}

// Create book data entry for our application
function createBookDataEntry(book, audioPath) {
  const title = book.title || 'Unknown Title';
  const author = book.author || 'Unknown Author';

  return {
    id: `librivox_${book.id}`,
    title,
    author,
    narrator: book.narrator || 'Unknown',
    genre: book.genre || 'Public Domain',
    description: book.description || `Public domain audiobook from Librivox: ${title}`,
    length: book.totaltime || 'Unknown',
    rating: 4.0, // Default rating for public domain works
    cover: book.cover_url || '/images/covers/default-cover.jpg',
    sampleAudioUrl: `/audio/librivox/${path.basename(audioPath)}`,
    librivox_id: book.id,
    is_public_domain: true,
    source: 'librivox'
  };
}

// Test data for known Librivox books
const TEST_BOOKS = [
  {
    id: '1342',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    narrator: 'Elizabeth Klett',
    genre: 'Romance',
    description: 'A classic romance novel about Elizabeth Bennet and Mr. Darcy.',
    totaltime: '11 hours 30 minutes'
  },
  {
    id: '1661',
    title: 'The Adventures of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    narrator: 'David Clarke',
    genre: 'Mystery',
    description: 'Classic detective stories featuring Sherlock Holmes.',
    totaltime: '10 hours 15 minutes'
  },
  {
    id: '2197',
    title: 'Dracula',
    author: 'Bram Stoker',
    narrator: 'Various',
    genre: 'Horror',
    description: 'The classic vampire novel.',
    totaltime: '14 hours 45 minutes'
  }
];

// Search command - provides guidance for finding books
function searchBooks(searchTerm = '') {
  console.log('🔍 Librivox Book Search Guide');
  console.log('=============================\n');

  if (searchTerm) {
    console.log(`Searching for: "${searchTerm}"\n`);
    console.log('📖 Popular public domain books you might find:');
    console.log('• Pride and Prejudice by Jane Austen');
    console.log('• The Adventures of Sherlock Holmes by Arthur Conan Doyle');
    console.log('• Dracula by Bram Stoker');
    console.log('• Frankenstein by Mary Shelley');
    console.log('• The Great Gatsby by F. Scott Fitzgerald (public domain in some countries)');
    console.log('• Alice\'s Adventures in Wonderland by Lewis Carroll');
  }

  console.log('\n🌐 Manual Search Instructions:');
  console.log('1. Go to https://librivox.org');
  console.log('2. Use the search bar to find your book');
  console.log('3. Look for books with "Complete" or "Single MP3" download options');
  console.log('4. Download the MP3 files to a folder');

  console.log('\n💡 Tips:');
  console.log('• Librivox has thousands of public domain audiobooks');
  console.log('• Look for books with high listen counts and good reviews');
  console.log('• Solo readers are often better quality than multi-reader versions');
  console.log('• Download speeds vary by narrator and recording quality');

  console.log('\n🎯 Next Steps:');
  console.log('• Download your chosen books manually');
  console.log('• Run: node scripts/download-librivox-audiobooks.js organize /path/to/downloads');
}

// Organize command - helps organize downloaded files
function organizeFiles(folderPath) {
  console.log('📁 Audio File Organization Tool');
  console.log('===============================\n');

  if (!folderPath) {
    console.log('❌ Please provide a folder path containing downloaded audio files');
    console.log('Usage: node scripts/download-librivox-audiobooks.js organize /path/to/folder');
    return;
  }

  if (!fs.existsSync(folderPath)) {
    console.log(`❌ Folder not found: ${folderPath}`);
    return;
  }

  console.log(`Scanning folder: ${folderPath}`);

  // Find audio files
  const audioFiles = findAudioFiles(folderPath);

  if (audioFiles.length === 0) {
    console.log('❌ No audio files found in the specified folder');
    console.log('Supported formats: MP3, WAV, M4A, FLAC');
    return;
  }

  console.log(`\n🎵 Found ${audioFiles.length} audio files:`);
  audioFiles.forEach((file, index) => {
    const stats = fs.statSync(file);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);
    console.log(`${index + 1}. ${path.basename(file)} (${sizeMB} MB)`);
  });

  // Copy files to librivox directory
  console.log('\n🚀 Organizing files...');

  let organized = 0;
  audioFiles.forEach(file => {
    const filename = path.basename(file);
    const destPath = path.join(audioDir, filename);

    try {
      fs.copyFileSync(file, destPath);
      console.log(`✅ Copied: ${filename}`);
      organized++;
    } catch (error) {
      console.log(`❌ Failed to copy: ${filename} - ${error.message}`);
    }
  });

  console.log(`\n📊 Summary: ${organized}/${audioFiles.length} files organized`);
  console.log(`📁 Files saved to: ${audioDir}`);

  if (organized > 0) {
    console.log('\n🎯 Next Steps:');
    console.log('• Run: node scripts/download-librivox-audiobooks.js convert');
    console.log('• Run: node scripts/download-librivox-audiobooks.js integrate');
  }
}

// Find audio files in a directory
function findAudioFiles(dirPath) {
  const audioExtensions = ['.mp3', '.wav', '.m4a', '.flac', '.ogg'];
  const files = [];

  function scanDir(currentPath) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        scanDir(fullPath); // Recursive scan
      } else if (stats.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (audioExtensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }

  scanDir(dirPath);
  return files;
}

// Convert command - converts audio formats to MP3
function convertAudioFiles() {
  console.log('🔄 Audio Format Conversion Tool');
  console.log('================================\n');

  console.log('📋 This tool would convert audio files to MP3 format.');
  console.log('Currently, this is a manual process:');

  console.log('\n🛠️  Manual Conversion Steps:');
  console.log('1. Install FFmpeg: https://ffmpeg.org/download.html');
  console.log('2. Convert files using commands like:');
  console.log('   ffmpeg -i input.wav -acodec libmp3lame -q:a 2 output.mp3');
  console.log('3. Or use online converters for simple conversions');

  console.log('\n💡 Recommended Settings:');
  console.log('• Output format: MP3');
  console.log('• Bitrate: 128kbps (good balance of quality/size)');
  console.log('• Sample rate: 44.1kHz');

  console.log('\n🎯 Next Steps:');
  console.log('• Convert your files to MP3 format');
  console.log('• Run: node scripts/download-librivox-audiobooks.js integrate');
}

// Integrate command - adds books to the application database
function integrateBooks() {
  console.log('🔗 Book Integration Tool');
  console.log('========================\n');

  // Check for audio files
  if (!fs.existsSync(audioDir)) {
    console.log('❌ No audio directory found. Run organize command first.');
    return;
  }

  const audioFiles = fs.readdirSync(audioDir).filter(file =>
    file.endsWith('.mp3') && !file.endsWith('.json')
  );

  if (audioFiles.length === 0) {
    console.log('❌ No MP3 files found in audio directory.');
    console.log(`Check: ${audioDir}`);
    return;
  }

  console.log(`📁 Found ${audioFiles.length} audio files to integrate:`);
  audioFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });

  // Create book entries
  const bookData = [];

  audioFiles.forEach(filename => {
    const filePath = path.join(audioDir, filename);
    const metadataPath = filePath.replace('.mp3', '.json');

    let metadata = {};
    if (fs.existsSync(metadataPath)) {
      try {
        metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      } catch (e) {
        console.log(`⚠️  Could not read metadata for ${filename}`);
      }
    }

    // Try to parse title and author from filename
    const bookEntry = createBookEntryFromFile(filename, metadata);
    if (bookEntry) {
      bookData.push(bookEntry);
    }
  });

  if (bookData.length === 0) {
    console.log('❌ Could not create book entries. Please add metadata files.');
    return;
  }

  // Save to librivox-books.json
  const bookDataPath = path.join(__dirname, '..', 'src', 'data', 'librivox-books.json');
  const existingData = fs.existsSync(bookDataPath)
    ? JSON.parse(fs.readFileSync(bookDataPath, 'utf8'))
    : { books: [] };

  existingData.books.push(...bookData);

  fs.writeFileSync(bookDataPath, JSON.stringify(existingData, null, 2));

  console.log(`\n💾 Added ${bookData.length} books to database`);
  console.log(`📄 Database file: ${bookDataPath}`);

  console.log('\n🎯 Integration Complete!');
  console.log('Your Librivox books are now available in the application.');
}

// Create book entry from filename and metadata
function createBookEntryFromFile(filename, metadata = {}) {
  // Remove extension
  const nameWithoutExt = filename.replace('.mp3', '');

  let title = metadata.title;
  let author = metadata.author;

  // If no metadata, try to parse from filename
  if (!title || !author) {
    // Common patterns: "Title by Author", "Title_Author", "Title - Author"
    let parsedTitle = nameWithoutExt;
    let parsedAuthor = 'Unknown Author';

    // Try "Title by Author" pattern
    const byMatch = nameWithoutExt.match(/^(.+?)\s+by\s+(.+)$/i);
    if (byMatch) {
      parsedTitle = byMatch[1].trim();
      parsedAuthor = byMatch[2].trim();
    } else {
      // Try underscore or dash separated
      const parts = nameWithoutExt.split(/[_-]/).map(p => p.trim());
      if (parts.length >= 2) {
        // Assume last part is author, rest is title
        parsedAuthor = parts.pop();
        parsedTitle = parts.join(' ');
      }
    }

    title = title || parsedTitle;
    author = author || parsedAuthor;
  }

  // Clean up and capitalize properly
  title = title.replace(/_/g, ' ').trim();
  author = author.replace(/_/g, ' ').trim();

  // Title case for title (simple implementation)
  title = title.split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');

  // Title case for author
  author = author.split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');

  const id = `librivox_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    id,
    title,
    author,
    narrator: metadata.narrator || 'Unknown',
    genre: metadata.genre || 'Public Domain',
    description: metadata.description || `Public domain audiobook: ${title} by ${author}`,
    length: metadata.totaltime || 'Unknown',
    rating: 4.0,
    cover: '/images/covers/default-cover.jpg',
    sampleAudioUrl: `/audio/librivox/${filename}`,
    librivox_id: metadata.librivox_id || null,
    is_public_domain: true,
    source: 'librivox'
  };
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('🎧 Librivox Audiobook Integration Tool');
  console.log('======================================\n');

  switch (command) {
    case 'search':
      searchBooks(args[1]);
      break;

    case 'organize':
      organizeFiles(args[1]);
      break;

    case 'convert':
      convertAudioFiles();
      break;

    case 'integrate':
      integrateBooks();
      break;

    default:
      console.log('📖 Available Commands:');
      console.log('• search [term]     - Get guidance for finding books');
      console.log('• organize <path>   - Organize downloaded audio files');
      console.log('• convert           - Convert audio formats (guidance)');
      console.log('• integrate         - Add books to application database');
      console.log('\n📝 Examples:');
      console.log('node scripts/download-librivox-audiobooks.js search "pride and prejudice"');
      console.log('node scripts/download-librivox-audiobooks.js organize ~/Downloads/Librivox');
      console.log('node scripts/download-librivox-audiobooks.js convert');
      console.log('node scripts/download-librivox-audiobooks.js integrate');
      break;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { searchLibrivoxBooks, downloadAudiobook, createBookDataEntry };
