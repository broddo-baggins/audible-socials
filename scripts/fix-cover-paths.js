import fs from 'fs';

// Read books
const books = JSON.parse(fs.readFileSync('./src/data/books.json', 'utf8'));

console.log('Updating cover paths for all 402 books...\n');

// Helper to sanitize filename
function sanitizeFilename(filename) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Update each book's cover path
let updated = 0;
books.forEach(book => {
  const sanitizedTitle = sanitizeFilename(book.title);
  const newCoverPath = `/images/covers/${book.id}-${sanitizedTitle}.jpg`;
  
  if (book.cover !== newCoverPath) {
    console.log(`[${book.id}] ${book.title}`);
    console.log(`  Old: ${book.cover || 'MISSING'}`);
    console.log(`  New: ${newCoverPath}`);
    book.cover = newCoverPath;
    updated++;
  }
});

// Save updated books
fs.writeFileSync('./src/data/books.json', JSON.stringify(books, null, 2));

console.log(`\n✅ Updated ${updated} cover paths`);
console.log(`✅ All books now reference correct cover filenames`);
console.log('\n📝 File saved: ./src/data/books.json\n');

