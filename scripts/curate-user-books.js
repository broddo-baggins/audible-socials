import fs from 'fs';

const users = JSON.parse(fs.readFileSync('./src/data/users.json', 'utf8'));
const allBooks = JSON.parse(fs.readFileSync('./src/data/books.json', 'utf8'));

console.log(`Found ${allBooks.length} total books`);
console.log(`Processing ${users.length} users`);

// Helper to get random items from array
function getRandomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper to get random number in range
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to get random rating
function getRandomRating() {
  const ratings = [3, 3.5, 4, 4, 4.5, 4.5, 5, 5]; // Weighted toward higher ratings
  return ratings[randomInt(0, ratings.length - 1)];
}

// Curate books for each user
function curateUserBooks(user, index) {
  const isMe = user.id === 'user-me';
  
  // Determine library size based on user type
  let librarySize;
  if (isMe) {
    librarySize = randomInt(5, 10); // You have a modest library
  } else if (user.isPremium) {
    librarySize = randomInt(15, 35); // Premium users have larger libraries
  } else {
    librarySize = randomInt(5, 20); // Free users have smaller libraries
  }

  // Get random books for library
  const libraryBooks = getRandomItems(allBooks, librarySize).map(b => b.id);
  
  // Select currently reading (from library, with progress)
  const currentlyReadingId = libraryBooks[randomInt(0, Math.min(3, libraryBooks.length - 1))];
  const currentProgress = randomInt(5, 95);
  
  // Create ratings for some books in library (40-70% of library)
  const ratingsCount = randomInt(
    Math.floor(librarySize * 0.4), 
    Math.floor(librarySize * 0.7)
  );
  const booksToRate = getRandomItems(libraryBooks, ratingsCount);
  const ratings = {};
  booksToRate.forEach(bookId => {
    ratings[bookId] = getRandomRating();
  });
  
  // Select recommended books (books NOT in library)
  const booksNotInLibrary = allBooks.filter(b => !libraryBooks.includes(b.id));
  const recommendedBooks = getRandomItems(booksNotInLibrary, randomInt(3, 8)).map(b => b.id);
  
  // Wishlist - some books not in library
  const wishlistBooks = getRandomItems(booksNotInLibrary, randomInt(5, 15)).map(b => b.id);
  
  // Completed books (books with ratings)
  const completedBooks = Object.keys(ratings);
  
  // In progress books (some without ratings)
  const inProgressBooks = libraryBooks
    .filter(id => !completedBooks.includes(id))
    .slice(0, randomInt(1, 4));
  
  // Update user object
  user.library = libraryBooks;
  user.currentlyReading = currentlyReadingId;
  user.currentProgress = currentProgress;
  user.ratings = ratings;
  user.recommendedBooks = recommendedBooks;
  user.wishlist = wishlistBooks || [];
  user.completedBooks = completedBooks;
  user.inProgressBooks = inProgressBooks;
  
  // Add some listening stats
  user.stats = {
    totalHoursListened: randomInt(10, 500),
    booksCompleted: completedBooks.length,
    currentStreak: randomInt(0, 30),
    longestStreak: randomInt(5, 60),
    favoriteGenre: allBooks.find(b => b.id === (ratings[Object.keys(ratings)[0]] === 5 ? Object.keys(ratings)[0] : libraryBooks[0]))?.genre || 'Fiction'
  };
  
  console.log(`[${index + 1}/${users.length}] Curated for ${user.name}: ${librarySize} books, ${Object.keys(ratings).length} ratings`);
  
  return user;
}

// Process all users
const updatedUsers = users.map((user, index) => curateUserBooks(user, index));

// Save updated users
fs.writeFileSync('./src/data/users.json', JSON.stringify(updatedUsers, null, 2));

console.log('\n' + '='.repeat(70));
console.log('📚 BOOK CURATION SUMMARY');
console.log('='.repeat(70));
console.log(`Total users processed: ${updatedUsers.length}`);
console.log(`Total books available: ${allBooks.length}`);
console.log('\nLibrary sizes:');
const librarySizes = updatedUsers.map(u => u.library.length);
console.log(`  Min: ${Math.min(...librarySizes)} books`);
console.log(`  Max: ${Math.max(...librarySizes)} books`);
console.log(`  Avg: ${Math.round(librarySizes.reduce((a, b) => a + b, 0) / librarySizes.length)} books`);
console.log('\nRatings:');
const totalRatings = updatedUsers.reduce((sum, u) => sum + Object.keys(u.ratings || {}).length, 0);
console.log(`  Total ratings across all users: ${totalRatings}`);
console.log(`  Avg ratings per user: ${Math.round(totalRatings / updatedUsers.length)}`);
console.log('\n✅ Users updated successfully!\n');

