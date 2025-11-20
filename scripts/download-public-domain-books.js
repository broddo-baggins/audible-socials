#!/usr/bin/env node

/**
 * Public Domain Book Content Downloader
 *
 * Downloads actual book content from legal public domain sources
 * Focuses on Project Gutenberg and other open access repositories
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Configuration
const CONTENT_DIR = path.join(process.cwd(), 'public', 'content', 'books');
const METADATA_DIR = path.join(process.cwd(), 'src', 'data');

// Public domain book catalog with known Gutenberg IDs
const PUBLIC_DOMAIN_CATALOG = {
  'pride_and_prejudice_jane_austen': {
    gutenbergId: '1342',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    language: 'English',
    downloads: 12000
  },
  'dracula_bram_stoker': {
    gutenbergId: '345',
    title: 'Dracula',
    author: 'Bram Stoker',
    language: 'English',
    downloads: 8500
  },
  'frankenstein_mary_shelley': {
    gutenbergId: '84',
    title: 'Frankenstein',
    author: 'Mary Shelley',
    language: 'English',
    downloads: 10000
  },
  'adventures_sherlock_holmes_arthur_conan_doyle': {
    gutenbergId: '1661',
    title: 'The Adventures of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    language: 'English',
    downloads: 9500
  },
  'alice_adventures_lewis_carroll': {
    gutenbergId: '11',
    title: 'Alice\'s Adventures in Wonderland',
    author: 'Lewis Carroll',
    language: 'English',
    downloads: 15000
  },
  'great_expectations_charles_dickens': {
    gutenbergId: '1400',
    title: 'Great Expectations',
    author: 'Charles Dickens',
    language: 'English',
    downloads: 8000
  },
  'tale_two_cities_charles_dickens': {
    gutenbergId: '98',
    title: 'A Tale of Two Cities',
    author: 'Charles Dickens',
    language: 'English',
    downloads: 9000
  },
  'war_worlds_h_g_wells': {
    gutenbergId: '36',
    title: 'The War of the Worlds',
    author: 'H.G. Wells',
    language: 'English',
    downloads: 7800
  },
  'time_machine_h_g_wells': {
    gutenbergId: '35',
    title: 'The Time Machine',
    author: 'H.G. Wells',
    language: 'English',
    downloads: 7200
  },
  'metamorphosis_franz_kafka': {
    gutenbergId: '5200',
    title: 'The Metamorphosis',
    author: 'Franz Kafka',
    language: 'English',
    downloads: 6800
  }
};

// Ensure directories exist
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
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

// Download book from Project Gutenberg
async function downloadGutenbergBook(bookInfo) {
  const { gutenbergId, title, author } = bookInfo;
  const filename = `gutenberg_${gutenbergId}.txt`;
  const filepath = path.join(CONTENT_DIR, filename);

  console.log(`📚 Downloading "${title}" by ${author} from Project Gutenberg...`);

  // Check if already downloaded
  if (fs.existsSync(filepath)) {
    console.log('⏭️  Already downloaded, skipping...');
    return filepath;
  }

  try {
    const downloadUrl = `https://www.gutenberg.org/files/${gutenbergId}/${gutenbergId}-0.txt`;

    await downloadFile(downloadUrl, filepath);

    // Create metadata
    const metadata = {
      id: `gutenberg_${gutenbergId}`,
      title,
      author,
      source: 'Project Gutenberg',
      format: 'txt',
      language: bookInfo.language,
      downloads: bookInfo.downloads,
      contentPath: `/content/books/${filename}`,
      downloadedAt: new Date().toISOString(),
      legal: true,
      license: 'Public Domain',
      gutenbergId
    };

    const metadataPath = filepath.replace('.txt', '.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    console.log(`✅ Downloaded: ${filename}`);
    return filepath;

  } catch (error) {
    console.error(`❌ Failed to download ${title}:`, error.message);

    // Try alternative URL
    try {
      const altUrl = `https://www.gutenberg.org/cache/epub/${gutenbergId}/pg${gutenbergId}.txt`;
      console.log('🔄 Trying alternative URL...');
      await downloadFile(altUrl, filepath);
      console.log(`✅ Downloaded via alternative URL: ${filename}`);
      return filepath;
    } catch (altError) {
      console.error('❌ Alternative URL also failed');
      return null;
    }
  }
}

// Get book info by matching with our catalog
function findBookInCatalog(title, author) {
  const normalizedTitle = title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
  const normalizedAuthor = author.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '_');

  // Try exact matches first
  for (const [key, book] of Object.entries(PUBLIC_DOMAIN_CATALOG)) {
    if (normalizedTitle.includes(key.split('_')[0]) &&
        normalizedAuthor.includes(key.split('_').slice(-1)[0])) {
      return book;
    }
  }

  // Try partial matches
  for (const [key, book] of Object.entries(PUBLIC_DOMAIN_CATALOG)) {
    const bookTitleWords = key.split('_');
    const searchTitleWords = normalizedTitle.split('_');

    if (bookTitleWords.some(word => searchTitleWords.includes(word))) {
      return book;
    }
  }

  return null;
}

// Download content for existing books
async function downloadForExistingBooks() {
  const { allBooks } = loadBooksData();
  console.log(`📚 Found ${allBooks.length} books in database`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const book of allBooks) {
    const catalogEntry = findBookInCatalog(book.title, book.author);

    if (catalogEntry) {
      console.log(`\n🎯 Found public domain match for: "${book.title}" by ${book.author}`);
      const result = await downloadGutenbergBook(catalogEntry);

      if (result) {
        downloaded++;

        // Update book metadata
        book.contentPath = `/content/books/gutenberg_${catalogEntry.gutenbergId}.txt`;
        book.contentFormat = 'txt';
        book.hasContent = true;
        book.legalSource = 'Project Gutenberg';
      } else {
        failed++;
      }
    } else {
      console.log(`⏭️  No public domain match for: "${book.title}" by ${book.author}`);
      skipped++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`✅ Downloaded: ${downloaded}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);

  return downloaded;
}

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

// Update book metadata
function updateBookMetadata() {
  const { books, librivoxBooks } = loadBooksData();

  // Save updated data
  if (books.length > 0) {
    fs.writeFileSync(
      path.join(METADATA_DIR, 'books.json'),
      JSON.stringify({ books }, null, 2)
    );
  }

  if (librivoxBooks.length > 0) {
    fs.writeFileSync(
      path.join(METADATA_DIR, 'librivox-books.json'),
      JSON.stringify({ books: librivoxBooks }, null, 2)
    );
  }
}

// Show available public domain books
function showAvailableBooks() {
  console.log('📚 Available Public Domain Books:');
  console.log('=================================\n');

  Object.entries(PUBLIC_DOMAIN_CATALOG).forEach(([key, book], index) => {
    console.log(`${index + 1}. "${book.title}" by ${book.author}`);
    console.log(`   Gutenberg ID: ${book.gutenbergId}`);
    console.log(`   Downloads: ${book.downloads.toLocaleString()}`);
    console.log('');
  });

  console.log(`Total: ${Object.keys(PUBLIC_DOMAIN_CATALOG).length} books available`);
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('📖 Public Domain Book Downloader');
  console.log('=================================\n');

  switch (command) {
    case 'download':
      const downloaded = await downloadForExistingBooks();
      if (downloaded > 0) {
        updateBookMetadata();
        console.log('\n💾 Metadata updated!');
      }
      break;

    case 'list':
      showAvailableBooks();
      break;

    case 'single':
      const bookKey = args[1];
      if (!bookKey || !PUBLIC_DOMAIN_CATALOG[bookKey]) {
        console.error('❌ Please specify a valid book key');
        console.log('Use "list" command to see available books');
        break;
      }
      await downloadGutenbergBook(PUBLIC_DOMAIN_CATALOG[bookKey]);
      break;

    default:
      console.log('📖 Available Commands:');
      console.log('• download    - Download content for all books in your database');
      console.log('• list        - Show all available public domain books');
      console.log('• single [id] - Download a specific book by catalog ID');
      console.log('');
      console.log('📝 Examples:');
      console.log('node scripts/download-public-domain-books.js download');
      console.log('node scripts/download-public-domain-books.js list');
      console.log('node scripts/download-public-domain-books.js single pride_and_prejudice_jane_austen');
      break;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { downloadGutenbergBook, findBookInCatalog, PUBLIC_DOMAIN_CATALOG };
