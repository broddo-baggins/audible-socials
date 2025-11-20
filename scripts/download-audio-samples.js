#!/usr/bin/env node

/**
 * Audio Sample Downloader
 *
 * Downloads free audiobook samples from public domain sources
 * or generates placeholder audio files for development.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

// Create audio directory if it doesn't exist
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const audioDir = path.join(__dirname, '..', 'public', 'audio', 'samples');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Books from our database that need audio samples
const books = [
  { id: '1', title: 'Project Hail Mary', author: 'Andy Weir', filename: 'project-hail-mary.mp3' },
  { id: '2', title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', filename: 'seven-husbands.mp3' },
  { id: '3', title: 'Atomic Habits', author: 'James Clear', filename: 'atomic-habits.mp3' },
  { id: '4', title: 'The Silent Patient', author: 'Alex Michaelides', filename: 'silent-patient.mp3' },
  { id: '5', title: 'Where the Crawdads Sing', author: 'Delia Owens', filename: 'crawdads.mp3' },
  { id: '6', title: 'Educated', author: 'Tara Westover', filename: 'educated.mp3' },
  { id: '7', title: 'The Midnight Library', author: 'Matt Haig', filename: 'midnight-library.mp3' },
  { id: '8', title: 'Dune', author: 'Frank Herbert', filename: 'dune.mp3' },
  { id: '9', title: 'The Thursday Murder Club', author: 'Richard Osman', filename: 'thursday-murder.mp3' }
];

// Public domain audio sources (these are free samples)
const publicDomainSources = [
  'https://www.archive.org/download/test_tone_1khz_5sec/test_tone_1khz_5sec.mp3', // Simple tone
];

// Create a simple placeholder audio file generator
function createPlaceholderAudio(filename, title) {
  const filePath = path.join(audioDir, filename);

  // Create a simple text file as placeholder (in real implementation, this would be actual audio)
  const content = `Placeholder for "${title}" audiobook sample.
In a real implementation, this would be an actual MP3 file.
You can replace this with real audiobook samples from public domain sources.

To get real audio:
1. Visit Librivox.org for public domain audiobooks
2. Use YouTube audio previews (with proper attribution)
3. Purchase and use Audible samples (with permission)

For development, this file simulates audio playback timing.`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Created placeholder: ${filename}`);
}

// Download a real audio file
function downloadAudio(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(audioDir, filename);
    const file = fs.createWriteStream(filePath);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Main execution
async function main() {
  console.log('🎵 Downloading Audio Samples...\n');

  // Create placeholders for all books
  books.forEach(book => {
    createPlaceholderAudio(book.filename, book.title);
  });

  // Try to download one real sample as example
  try {
    console.log('\n📥 Trying to download real sample...');
    await downloadAudio(publicDomainSources[0], 'sample-tone.mp3');
  } catch (error) {
    console.log('⚠️  Could not download real sample, using placeholders only');
    console.log('💡 To get real audio samples:');
    console.log('   1. Visit librivox.org for public domain audiobooks');
    console.log('   2. Use YouTube audio previews with proper licensing');
    console.log('   3. Replace placeholder files with actual MP3s');
  }

  console.log('\n🎉 Audio sample setup complete!');
  console.log(`📁 Files created in: ${audioDir}`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { createPlaceholderAudio, downloadAudio };
