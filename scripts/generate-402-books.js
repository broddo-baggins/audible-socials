import fs from 'fs';

// Read existing 100 books
const existingBooks = JSON.parse(fs.readFileSync('./src/data/books.json', 'utf8'));

console.log(`Starting with ${existingBooks.length} books`);
console.log('Generating 302 more books to reach 402 total...\n');

// Book title templates for generation
const titleTemplates = [
  { pattern: "The {adj} {noun}", genres: ["Fiction", "Mystery & Thriller"] },
  { pattern: "Secrets of {place}", genres: ["Mystery & Thriller", "Historical Fiction"] },
  { pattern: "{adj} {time}", genres: ["Science Fiction", "Fantasy"] },
  { pattern: "The {noun} of {place}", genres: ["Fantasy", "Historical Fiction"] },
  { pattern: "{verb}ing {noun}", genres: ["Self Development", "Memoir & Biography"] },
  { pattern: "The Last {noun}", genres: ["Science Fiction", "Mystery & Thriller"] },
  { pattern: "Beyond {place}", genres: ["Fantasy", "Science Fiction"] },
  { pattern: "{number} {noun}s", genres: ["Fiction", "Mystery & Thriller"] },
  { pattern: "A {adj} {noun}", genres: ["Romance", "Fiction"] },
  { pattern: "The {noun}'s {noun}", genres: ["Historical Fiction", "Fiction"] }
];

const adjectives = [
  "Silent", "Broken", "Hidden", "Ancient", "Forgotten", "Eternal", "Dark", "Bright",
  "Crimson", "Golden", "Silver", "Shadowy", "Mysterious", "Lost", "Found", "Wild",
  "Gentle", "Fierce", "Frozen", "Burning", "Twisted", "Perfect", "Shattered", "Sacred",
  "Forbidden", "Final", "First", "Infinite", "Quiet", "Loud", "Strange", "Beautiful"
];

const nouns = [
  "Truth", "Shadow", "Light", "Kingdom", "Empire", "City", "Island", "Mountain",
  "Ocean", "Forest", "River", "Sky", "Star", "Moon", "Sun", "Night", "Day", "Dream",
  "Memory", "Secret", "Story", "Song", "Dance", "Heart", "Soul", "Mind", "Path",
  "Journey", "Quest", "Key", "Door", "Gate", "Bridge", "Crown", "Throne", "Sword"
];

const places = [
  "Paris", "London", "Tokyo", "Rome", "Athens", "Cairo", "Moscow", "Venice",
  "the North", "the South", "the East", "the West", "the Mountains", "the Sea",
  "the Desert", "the Valley", "Heaven", "Earth", "Time", "Space", "Tomorrow",
  "Yesterday", "Eternity", "Infinity", "the Cosmos", "the Void", "the Abyss"
];

const verbs = [
  "Find", "Seek", "Discover", "Reveal", "Unlock", "Break", "Build", "Create",
  "Destroy", "Transform", "Change", "Win", "Lose", "Love", "Hate", "Remember",
  "Forget", "Master", "Learn", "Teach", "Lead", "Follow", "Rise", "Fall"
];

const numbers = [
  "Seven", "Nine", "Ten", "Twelve", "Thirteen", "Twenty", "Hundred", "Thousand",
  "Three", "Five", "Eight", "Eleven", "Fifteen"
];

const authorFirstNames = [
  "Sarah", "Michael", "Jennifer", "David", "Emily", "Christopher", "Jessica", "Matthew",
  "Ashley", "Joshua", "Amanda", "Daniel", "Melissa", "Andrew", "Stephanie", "James",
  "Nicole", "Justin", "Elizabeth", "Ryan", "Rebecca", "Brandon", "Laura", "John",
  "Rachel", "Robert", "Samantha", "William", "Katherine", "Anthony", "Michelle"
];

const authorLastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Thompson", "White",
  "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young"
];

const narratorPool = [
  "Simon Vance", "Kate Reading", "Michael Kramer", "Julia Whelan", "Will Patton",
  "Bahni Turpin", "Scott Brick", "Edoardo Ballerini", "January LaVoy", "MacLeod Andrews",
  "Cassandra Campbell", "Robert Petkoff", "Xe Sands", "R.C. Bray", "Ray Porter"
];

const genres = [
  "Science Fiction", "Fantasy", "Mystery & Thriller", "Romance", "Historical Fiction",
  "Fiction", "Self Development", "Memoir & Biography", "History", "Business"
];

// Helper functions
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateTitle() {
  const template = getRandomItem(titleTemplates);
  let title = template.pattern;
  
  title = title.replace("{adj}", getRandomItem(adjectives));
  title = title.replace("{noun}", getRandomItem(nouns));
  title = title.replace("{place}", getRandomItem(places));
  title = title.replace("{verb}", getRandomItem(verbs));
  title = title.replace("{number}", getRandomItem(numbers));
  title = title.replace("{time}", getRandomItem(["Dawn", "Dusk", "Midnight", "Noon", "Twilight"]));
  
  return { title, genre: getRandomItem(template.genres) };
}

function generateAuthor() {
  return `${getRandomItem(authorFirstNames)} ${getRandomItem(authorLastNames)}`;
}

function generateDescription() {
  const descriptions = [
    "A gripping tale that will keep you on the edge of your seat from beginning to end.",
    "An unforgettable journey through the human experience that will stay with you long after the final chapter.",
    "A masterfully crafted story that explores the depths of the human condition.",
    "A stunning debut that announces a powerful new voice in contemporary literature.",
    "An epic adventure that spans generations and continents, weaving together multiple storylines.",
    "A thought-provoking exploration of identity, belonging, and what it means to be human.",
    "A beautifully written meditation on love, loss, and the passage of time.",
    "A riveting thriller that keeps you guessing until the very last page.",
    "An intimate portrait of family, friendship, and the bonds that tie us together.",
    "A sweeping saga that brings history to life with vivid detail and emotional depth."
  ];
  return getRandomItem(descriptions);
}

function randomDuration() {
  const hours = Math.floor(Math.random() * 15) + 4; // 4-18 hours
  const minutes = Math.floor(Math.random() * 60);
  return `${hours}h ${minutes}m`;
}

function randomRating() {
  return (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5 to 5.0
}

function randomRatingsCount() {
  return Math.floor(Math.random() * 300000) + 50000;
}

function randomPrice() {
  const prices = [9.99, 12.99, 14.95, 16.99, 19.99, 24.95];
  return getRandomItem(prices);
}

function generateReleaseDate() {
  const year = Math.floor(Math.random() * 15) + 2010; // 2010-2024
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate new books
const allBooks = [...existingBooks];

for (let i = 101; i <= 402; i++) {
  const { title, genre } = generateTitle();
  const author = generateAuthor();
  
  const book = {
    id: String(i),
    title: title,
    author: author,
    narrator: getRandomItem(narratorPool),
    genre: genre,
    contentType: "audiobook",
    duration: randomDuration(),
    durationMinutes: Math.floor(Math.random() * 800) + 200,
    rating: parseFloat(randomRating()),
    ratingsCount: randomRatingsCount(),
    description: generateDescription(),
    releaseDate: generateReleaseDate(),
    language: "English",
    publisher: getRandomItem(["Audible Studios", "Simon & Schuster Audio", "Random House Audio", "Hachette Audio"]),
    sampleAudioUrl: `/audio/samples/sample-${i}.mp3`,
    price: randomPrice(),
    clubs: []
  };
  
  allBooks.push(book);
  
  if (i % 50 === 0) {
    console.log(`Generated ${i} books...`);
  }
}

// Save to file
fs.writeFileSync('./src/data/books.json', JSON.stringify(allBooks, null, 2));

console.log(`\n✅ SUCCESS! Generated ${allBooks.length} total books`);
console.log(`New books added: ${allBooks.length - existingBooks.length}`);
console.log('File saved: ./src/data/books.json\n');

