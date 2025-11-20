# Librivox Audiobook Integration Guide

This guide explains how to add public domain audiobooks from [Librivox.org](https://librivox.org) to your audible-socials application.

## Overview

Librivox provides thousands of public domain audiobooks that you can legally download and use. This integration tool helps you:

1. Find public domain books on Librivox
2. Download and organize audio files
3. Convert formats if needed
4. Integrate books into your application

## Quick Start

```bash
# 1. Search for books
node scripts/download-librivox-audiobooks.js search "pride and prejudice"

# 2. Organize downloaded files
node scripts/download-librivox-audiobooks.js organize ~/Downloads/Librivox

# 3. Convert audio formats (if needed)
node scripts/download-librivox-audiobooks.js convert

# 4. Integrate into application
node scripts/download-librivox-audiobooks.js integrate
```

## Step-by-Step Guide

### 1. Find Books on Librivox

Use the search command to get guidance:

```bash
node scripts/download-librivox-audiobooks.js search "sherlock holmes"
```

This provides:
- Popular public domain book recommendations
- Search tips for Librivox
- Manual download instructions

### 2. Download Books from Librivox

1. Go to [librivox.org](https://librivox.org)
2. Search for your desired book
3. Look for books with:
   - "Complete" download option
   - High listener counts
   - Good reviews
   - Single narrator (better quality)
4. Download MP3 files to a folder on your computer

**Recommended Settings:**
- Format: MP3 (best compatibility)
- Quality: 128kbps (good balance)
- Complete books (not individual chapters)

### 3. Organize Audio Files

Once downloaded, organize the files:

```bash
node scripts/download-librivox-audiobooks.js organize /path/to/your/download/folder
```

This will:
- Scan for audio files (MP3, WAV, M4A, FLAC)
- Copy them to `public/audio/librivox/`
- Prepare them for integration

**Supported Formats:** MP3, WAV, M4A, FLAC, OGG

### 4. Convert Audio Formats (Optional)

If your files aren't in MP3 format:

```bash
node scripts/download-librivox-audiobooks.js convert
```

This provides guidance for converting files. You'll need FFmpeg:

```bash
# Install FFmpeg (macOS with Homebrew)
brew install ffmpeg

# Convert example
ffmpeg -i input.wav -acodec libmp3lame -q:a 2 output.mp3
```

### 5. Integrate into Application

Add the books to your database:

```bash
node scripts/download-librivox-audiobooks.js integrate
```

This creates entries in `src/data/librivox-books.json` and makes them available in your app.

## File Naming Conventions

For best results, name your files like this:

```
Pride and Prejudice by Jane Austen.mp3
The Adventures of Sherlock Holmes by Arthur Conan Doyle.mp3
Dracula by Bram Stoker.mp3
```

The tool will automatically parse titles and authors from filenames.

## Metadata Enhancement

For better book entries, create JSON metadata files alongside your MP3s:

`Pride and Prejudice by Jane Austen.json`:
```json
{
  "title": "Pride and Prejudice",
  "author": "Jane Austen",
  "narrator": "Elizabeth Klett",
  "genre": "Romance",
  "description": "A classic romance novel about Elizabeth Bennet and Mr. Darcy.",
  "totaltime": "11 hours 30 minutes",
  "librivox_id": "1342"
}
```

## Troubleshooting

### No Audio Files Found
- Check that files have correct extensions (.mp3, .wav, etc.)
- Ensure files are not in subfolders (the tool scans recursively)
- Verify file permissions

### Poor Audio Quality
- Download higher bitrate versions from Librivox
- Use the convert command to standardize quality
- Check for mono/stereo compatibility

### Integration Issues
- Run organize before integrate
- Check that MP3 files exist in `public/audio/librivox/`
- Verify JSON syntax if using metadata files

## Legal Notes

- Librivox audiobooks are public domain works
- Ensure you're complying with local copyright laws
- Respect the volunteer narrators' work
- Consider attributing Librivox in your application

## Popular Public Domain Books

Some highly-rated Librivox books to get you started:

- **Pride and Prejudice** by Jane Austen
- **The Adventures of Sherlock Holmes** by Arthur Conan Doyle
- **Dracula** by Bram Stoker
- **Frankenstein** by Mary Shelley
- **Alice's Adventures in Wonderland** by Lewis Carroll
- **The Time Machine** by H.G. Wells
- **The War of the Worlds** by H.G. Wells
- **Great Expectations** by Charles Dickens
- **A Tale of Two Cities** by Charles Dickens
- **The Picture of Dorian Gray** by Oscar Wilde

## Advanced Usage

### Bulk Processing

Process multiple books at once:

```bash
# Organize multiple download folders
node scripts/download-librivox-audiobooks.js organize ~/Downloads/Librivox1
node scripts/download-librivox-audiobooks.js organize ~/Downloads/Librivox2

# Integrate all at once
node scripts/download-librivox-audiobooks.js integrate
```

### Custom Metadata

Create detailed metadata for better integration:

```json
{
  "title": "Pride and Prejudice",
  "author": "Jane Austen",
  "narrator": "Elizabeth Klett",
  "genre": "Classic Literature",
  "description": "A romantic novel that critiques the British landed gentry at the end of the 18th century.",
  "totaltime": "11 hours 32 minutes",
  "librivox_id": "1342",
  "language": "English",
  "published": "1813",
  "rating": 4.8
}
```

## Support

If you encounter issues:

1. Check the console output for error messages
2. Verify file paths and permissions
3. Ensure Librivox downloads completed successfully
4. Check that audio files are not corrupted

The tool is designed to be robust and provide clear error messages to help you troubleshoot issues.
