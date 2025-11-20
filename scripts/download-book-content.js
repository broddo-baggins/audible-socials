#!/usr/bin/env node

/**
 * Book Content Downloader and Manager
 *
 * Downloads and manages book content from various legal sources
 * Supports multiple formats and content types
 *
 * Usage:
 * node scripts/download-book-content.js search [title]    # Search for books
 * node scripts/download-book-content.js download [bookId] # Download specific book
 * node scripts/download-book-content.js organize [path]   # Organize downloaded content
 * node scripts/download-book-content.js metadata          # Update book metadata
 *
 * Legal Sources Supported:
 * - Project Gutenberg (public domain)
 * - Open Library
 * - Internet Archive
 * - Author's official websites
 * - Legal preview content
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Configuration
const CONTENT_DIR = path.join(process.cwd(), 'public', 'content', 'books');
const METADATA_DIR = path.join(process.cwd(), 'src', 'data');

// Ensure directories exist
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

// Supported legal sources
const LEGAL_SOURCES = {
  gutenberg: {
    name: 'Project Gutenberg',
    baseUrl: 'https://www.gutenberg.org',
    searchUrl: 'https://www.gutenberg.org/ebooks/search/?query=',
    contentUrl: 'https://www.gutenberg.org/files/',
    formats: ['txt', 'html', 'epub'],
    legal: true,
    description: 'Public domain books'
  },
  openlibrary: {
    name: 'Open Library',
    baseUrl: 'https://openlibrary.org',
    searchUrl: 'https://openlibrary.org/search.json?q=',
    contentUrl: 'https://archive.org/download/',
    formats: ['pdf', 'epub', 'txt'],
    legal: true,
    description: 'Public domain and open access books'
  },
  archive: {
    name: 'Internet Archive',
    baseUrl: 'https://archive.org',
    searchUrl: 'https://archive.org/search.php?query=',
    contentUrl: 'https://archive.org/download/',
    formats: ['pdf', 'epub', 'txt'],
    legal: true,
    description: 'Public domain and Creative Commons content'
  },
  preview: {
    name: 'Book Previews',
    baseUrl: 'https://books.google.com',
    searchUrl: 'https://books.google.com/books?uid=0&q=',
    formats: ['preview'],
    legal: true,
    description: 'Legal book previews and samples'
  }
};

// Load existing books data
function loadBooksData() {
  const booksPath = path.join(METADATA_DIR, 'books.json');
  const librivoxPath = path.join(METADATA_DIR, 'librivox-books.json');

  let books = [];
  let librivoxBooks = [];

  try {
    if (fs.existsSync(booksPath)) {
      const data = JSON.parse(fs.readFileSync(booksPath, 'utf8'));
      books = data.books || [];
    }
  } catch (error) {
    console.warn('Could not load books.json:', error.message);
  }

  try {
    if (fs.existsSync(librivoxPath)) {
      const data = JSON.parse(fs.readFileSync(librivoxPath, 'utf8'));
      librivoxBooks = data.books || [];
    }
  } catch (error) {
    console.warn('Could not load librivox-books.json:', error.message);
  }

  return { books, librivoxBooks, allBooks: [...books, ...librivoxBooks] };
}

// Search for books across legal sources
async function searchBooks(query, source = 'all') {
  console.log(`🔍 Searching for "${query}"...`);

  const results = [];

  try {
    if (source === 'all' || source === 'gutenberg') {
      console.log('📚 Searching Project Gutenberg...');
      const gutenbergResults = await searchGutenberg(query);
      results.push(...gutenbergResults);
    }

    if (source === 'all' || source === 'openlibrary') {
      console.log('📖 Searching Open Library...');
      const olResults = await searchOpenLibrary(query);
      results.push(...olResults);
    }

    console.log(`\n✅ Found ${results.length} books:`);
    results.slice(0, 10).forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author}`);
      console.log(`   Source: ${book.source}`);
      console.log(`   Format: ${book.format}`);
      console.log(`   Legal: ${book.legal ? '✅ Yes' : '❌ No'}`);
      console.log('');
    });

    return results;
  } catch (error) {
    console.error('❌ Search failed:', error.message);
    return [];
  }
}

// Search Project Gutenberg
async function searchGutenberg(query) {
  try {
    const searchUrl = `${LEGAL_SOURCES.gutenberg.searchUrl}${encodeURIComponent(query)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'BookContentDownloader/1.0 (Educational Project)'
      }
    });

    const $ = cheerio.load(response.data);
    const results = [];

    $('.booklink').each((index, element) => {
      if (results.length >= 5) return false;

      const $el = $(element);
      const title = $el.find('.title').text().trim();
      const author = $el.find('.subtitle').text().trim();
      const bookId = $el.attr('href')?.split('/').pop();

      if (title && author && bookId) {
        results.push({
          id: `gutenberg_${bookId}`,
          title,
          author,
          source: 'Project Gutenberg',
          format: 'txt',
          legal: true,
          downloadUrl: `${LEGAL_SOURCES.gutenberg.contentUrl}${bookId}/${bookId}.txt.utf-8`,
          bookId
        });
      }
    });

    return results;
  } catch (error) {
    console.warn('Gutenberg search failed:', error.message);
    return [];
  }
}

// Search Open Library
async function searchOpenLibrary(query) {
  try {
    const searchUrl = `${LEGAL_SOURCES.openlibrary.searchUrl}${encodeURIComponent(query)}`;
    const response = await axios.get(searchUrl);
    const data = response.data;

    const results = [];
    const docs = data.docs || [];

    for (const doc of docs.slice(0, 3)) {
      if (doc.title && doc.author_name && doc.ia) {
        results.push({
          id: `openlibrary_${doc.key.replace('/works/', '')}`,
          title: doc.title,
          author: doc.author_name[0],
          source: 'Open Library',
          format: 'pdf',
          legal: true,
          downloadUrl: `${LEGAL_SOURCES.archive.contentUrl}${doc.ia}/${doc.ia}.pdf`,
          archiveId: doc.ia
        });
      }
    }

    return results;
  } catch (error) {
    console.warn('Open Library search failed:', error.message);
    return [];
  }
}

// Download book content
async function downloadBook(bookId, format = 'txt') {
  const { allBooks } = loadBooksData();
  const book = allBooks.find(b => b.id === bookId);

  if (!book) {
    console.error(`❌ Book with ID "${bookId}" not found in database`);
    return false;
  }

  console.log(`📥 Downloading: "${book.title}" by ${book.author}`);

  try {
    // Find legal download source
    const downloadUrl = await findDownloadUrl(book, format);

    if (!downloadUrl) {
      console.error('❌ No legal download URL found');
      return false;
    }

    const filename = sanitizeFilename(`${book.title}_${book.author}.${format}`);
    const filepath = path.join(CONTENT_DIR, filename);

    console.log(`📁 Saving to: ${filepath}`);

    await downloadFile(downloadUrl, filepath);

    // Create metadata
    const metadata = {
      ...book,
      contentPath: `/content/books/${filename}`,
      downloadedAt: new Date().toISOString(),
      format,
      source: 'legal_download',
      fileSize: fs.statSync(filepath).size
    };

    const metadataPath = filepath.replace(`.${format}`, '.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    console.log('✅ Download complete!');
    return true;

  } catch (error) {
    console.error('❌ Download failed:', error.message);
    return false;
  }
}

// Find appropriate download URL for a book
async function findDownloadUrl(book, format) {
  // For existing books, try to find legal alternatives
  const title = book.title.toLowerCase();
  const author = book.author.toLowerCase();

  // Check if it's a known public domain work
  const publicDomainBooks = [
    'pride and prejudice',
    'dracula',
    'frankenstein',
    'sherlock holmes',
    'alice in wonderland',
    'great expectations',
    'tale of two cities',
    'war of the worlds',
    'time machine'
  ];

  const isPublicDomain = publicDomainBooks.some(pdBook =>
    title.includes(pdBook) || pdBook.includes(title.split(' ')[0])
  );

  if (isPublicDomain) {
    // Try Gutenberg first
    try {
      const gutenbergResults = await searchGutenberg(`${book.title} ${book.author}`);
      if (gutenbergResults.length > 0) {
        return gutenbergResults[0].downloadUrl;
      }
    } catch (error) {
      console.warn('Gutenberg lookup failed');
    }

    // Try Open Library
    try {
      const olResults = await searchOpenLibrary(`${book.title} ${book.author}`);
      if (olResults.length > 0) {
        return olResults[0].downloadUrl;
      }
    } catch (error) {
      console.warn('Open Library lookup failed');
    }
  }

  console.log('💡 For copyrighted books, please use:');
  console.log('• Purchase from authorized retailers (Amazon, Apple Books, etc.)');
  console.log('• Library lending services (OverDrive, Libby)');
  console.log('• Author\'s official website');
  console.log('• Book preview services');

  return null;
}

// Download file with progress
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }

      const totalSize = parseInt(response.headers['content-length'], 10);
      let downloadedSize = 0;

      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        if (totalSize) {
          const progress = Math.round((downloadedSize / totalSize) * 100);
          process.stdout.write(`\r📥 Downloading... ${progress}%`);
        }
      });

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log('\n✅ File downloaded successfully');
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Sanitize filename
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9\s\-_.]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase();
}

// Organize existing content
function organizeContent(contentPath) {
  console.log('📁 Organizing book content...');

  if (!fs.existsSync(contentPath)) {
    console.error(`❌ Path not found: ${contentPath}`);
    return;
  }

  const files = fs.readdirSync(contentPath);
  const contentFiles = files.filter(file =>
    ['.pdf', '.epub', '.txt', '.html'].some(ext => file.endsWith(ext))
  );

  console.log(`📚 Found ${contentFiles.length} content files`);

  let organized = 0;
  contentFiles.forEach(filename => {
    const srcPath = path.join(contentPath, filename);
    const destPath = path.join(CONTENT_DIR, filename);

    try {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Organized: ${filename}`);
      organized++;
    } catch (error) {
      console.error(`❌ Failed to organize ${filename}:`, error.message);
    }
  });

  console.log(`\n📊 Organized ${organized}/${contentFiles.length} files`);
}

// Update book metadata with content paths
function updateMetadata() {
  console.log('📊 Updating book metadata...');

  const { books, librivoxBooks } = loadBooksData();
  let updated = 0;

  // Check for content files
  const contentFiles = fs.readdirSync(CONTENT_DIR).filter(file =>
    !file.endsWith('.json')
  );

  // Update main books
  const updatedBooks = books.map(book => {
    const contentFile = contentFiles.find(file =>
      file.toLowerCase().includes(book.title.toLowerCase().replace(/\s+/g, '_'))
    );

    if (contentFile) {
      const ext = path.extname(contentFile).slice(1);
      book.contentPath = `/content/books/${contentFile}`;
      book.contentFormat = ext;
      book.hasContent = true;
      updated++;
    }

    return book;
  });

  // Update Librivox books
  const updatedLibrivox = librivoxBooks.map(book => {
    const contentFile = contentFiles.find(file =>
      file.toLowerCase().includes(book.title.toLowerCase().replace(/\s+/g, '_'))
    );

    if (contentFile) {
      const ext = path.extname(contentFile).slice(1);
      book.contentPath = `/content/books/${contentFile}`;
      book.contentFormat = ext;
      book.hasContent = true;
      updated++;
    }

    return book;
  });

  // Save updated data
  if (updatedBooks.length > 0) {
    fs.writeFileSync(
      path.join(METADATA_DIR, 'books.json'),
      JSON.stringify({ books: updatedBooks }, null, 2)
    );
  }

  if (updatedLibrivox.length > 0) {
    fs.writeFileSync(
      path.join(METADATA_DIR, 'librivox-books.json'),
      JSON.stringify({ books: updatedLibrivox }, null, 2)
    );
  }

  console.log(`✅ Updated metadata for ${updated} books`);
}

// Show legal content options
function showLegalOptions() {
  console.log('📚 Legal Content Acquisition Options:');
  console.log('=====================================\n');

  console.log('✅ PUBLIC DOMAIN SOURCES:');
  console.log('• Project Gutenberg (gutenberg.org) - 70,000+ free books');
  console.log('• Librivox (librivox.org) - Free audiobooks');
  console.log('• Internet Archive (archive.org) - Digital library');
  console.log('• Open Library (openlibrary.org) - Worldwide library access');
  console.log('');

  console.log('💰 PURCHASE OPTIONS:');
  console.log('• Amazon Kindle Store');
  console.log('• Apple Books');
  console.log('• Google Play Books');
  console.log('• Kobo Store');
  console.log('');

  console.log('📖 LIBRARY SERVICES:');
  console.log('• OverDrive/Libby (most libraries)');
  console.log('• Hoopla Digital');
  console.log('• Cloud Library');
  console.log('');

  console.log('🎧 AUDIOBOOK SERVICES:');
  console.log('• Audible');
  console.log('• Google Play Audiobooks');
  console.log('• Apple Books');
  console.log('');

  console.log('⚖️  LEGAL REMINDERS:');
  console.log('• Always respect copyright laws');
  console.log('• Use licensed content for commercial applications');
  console.log('• Support authors and publishers');
  console.log('• This tool focuses on legal, ethical content acquisition');
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('📚 Book Content Manager');
  console.log('======================\n');

  switch (command) {
    case 'search':
      const query = args.slice(1).join(' ') || 'pride and prejudice';
      const source = args[2] || 'all';
      await searchBooks(query, source);
      break;

    case 'download':
      const bookId = args[1];
      const format = args[2] || 'txt';
      if (!bookId) {
        console.error('❌ Please specify a book ID');
        console.log('Usage: node scripts/download-book-content.js download [bookId]');
        break;
      }
      await downloadBook(bookId, format);
      break;

    case 'organize':
      const contentPath = args[1];
      if (!contentPath) {
        console.error('❌ Please specify a content path');
        console.log('Usage: node scripts/download-book-content.js organize /path/to/content');
        break;
      }
      organizeContent(contentPath);
      break;

    case 'metadata':
      updateMetadata();
      break;

    case 'legal':
      showLegalOptions();
      break;

    default:
      console.log('📖 Available Commands:');
      console.log('• search [query] [source]  - Search for books legally');
      console.log('• download [bookId]        - Download specific book content');
      console.log('• organize [path]          - Organize existing content files');
      console.log('• metadata                 - Update book metadata with content paths');
      console.log('• legal                    - Show legal content acquisition options');
      console.log('');
      console.log('📝 Examples:');
      console.log('node scripts/download-book-content.js search "pride and prejudice"');
      console.log('node scripts/download-book-content.js download gutenberg_1342');
      console.log('node scripts/download-book-content.js organize ~/Downloads/Books');
      console.log('node scripts/download-book-content.js metadata');
      console.log('node scripts/download-book-content.js legal');
      break;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { searchBooks, downloadBook, organizeContent, updateMetadata };
