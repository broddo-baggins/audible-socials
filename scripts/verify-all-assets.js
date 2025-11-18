import fs from 'fs';
import path from 'path';

const allBooks = JSON.parse(fs.readFileSync('./src/data/books.json', 'utf8'));
const users = JSON.parse(fs.readFileSync('./src/data/users.json', 'utf8'));

const coverDir = './public/images/covers';
const avatarDir = './public/images/avatars';

console.log('\n' + '='.repeat(70));
console.log('🔍 VERIFYING ALL ASSETS');
console.log('='.repeat(70));

// Check book covers
console.log('\n📚 BOOK COVERS:');
console.log(`Total books: ${allBooks.length}`);

let missingCovers = [];
let foundCovers = 0;

function sanitizeFilename(filename) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

for (const book of allBooks) {
  const filename = `${book.id}-${sanitizeFilename(book.title)}.jpg`;
  const filepath = path.join(coverDir, filename);
  
  if (fs.existsSync(filepath)) {
    const stats = fs.statSync(filepath);
    if (stats.size > 1000) {
      foundCovers++;
    } else {
      missingCovers.push({id: book.id, title: book.title, reason: 'File too small'});
    }
  } else {
    missingCovers.push({id: book.id, title: book.title, reason: 'File not found'});
  }
}

console.log(`✅ Found: ${foundCovers} covers`);
console.log(`❌ Missing: ${missingCovers.length} covers`);

if (missingCovers.length > 0) {
  console.log('\nMissing covers:');
  missingCovers.slice(0, 20).forEach(item => {
    console.log(`  [${item.id}] ${item.title} - ${item.reason}`);
  });
  if (missingCovers.length > 20) {
    console.log(`  ... and ${missingCovers.length - 20} more`);
  }
}

// Check user avatars
console.log('\n👥 USER AVATARS:');
console.log(`Total users: ${users.length}`);

let missingAvatars = [];
let foundAvatars = 0;

for (const user of users) {
  const filename = `user-${user.id}.png`;
  const filepath = path.join(avatarDir, filename);
  
  if (fs.existsSync(filepath)) {
    const stats = fs.statSync(filepath);
    if (stats.size > 1000) {
      foundAvatars++;
    } else {
      missingAvatars.push(user.name);
    }
  } else {
    missingAvatars.push(user.name);
  }
}

console.log(`✅ Found: ${foundAvatars} avatars`);
console.log(`❌ Missing: ${missingAvatars.length} avatars`);

if (missingAvatars.length > 0) {
  console.log('\nMissing avatars:');
  missingAvatars.forEach(name => {
    console.log(`  - ${name}`);
  });
}

// Check for duplicate covers
console.log('\n🔄 CHECKING FOR DUPLICATES:');
const allCoverFiles = fs.readdirSync(coverDir).filter(f => f.endsWith('.jpg'));
console.log(`Total cover files in directory: ${allCoverFiles.length}`);

// Group by book ID
const coversByID = {};
allCoverFiles.forEach(file => {
  const match = file.match(/^(\d+)-/);
  if (match) {
    const id = match[1];
    if (!coversByID[id]) {
      coversByID[id] = [];
    }
    coversByID[id].push(file);
  }
});

const duplicates = Object.entries(coversByID).filter(([, files]) => files.length > 1);
if (duplicates.length > 0) {
  console.log(`Found ${duplicates.length} book IDs with duplicate covers:`);
  duplicates.slice(0, 10).forEach(([id, files]) => {
    console.log(`  Book ID ${id}: ${files.join(', ')}`);
  });
} else {
  console.log('✅ No duplicates found');
}

// Summary
console.log('\n' + '='.repeat(70));
console.log('📊 SUMMARY');
console.log('='.repeat(70));
console.log(`Books: ${foundCovers}/${allBooks.length} covers ✅`);
console.log(`Users: ${foundAvatars}/${users.length} avatars ✅`);

if (missingCovers.length === 0 && missingAvatars.length === 0) {
  console.log('\n🎉 ALL ASSETS COMPLETE!');
} else {
  console.log('\n⚠️  Some assets are missing - see details above');
}

console.log('');
