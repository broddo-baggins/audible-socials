# Project Scripts & Utilities

All utility scripts have been organized in the `/scripts` directory to keep the project root clean.

## 📂 Scripts Directory Structure

```
/scripts/
├── download-all-covers.js      # Download book covers from multiple sources
├── generate-user-avatars.js    # Generate avatars for all users
├── curate-user-books.js        # Create realistic user library data
├── verify-all-assets.js        # Verify all assets are present
├── generate-402-books.js       # Generate 402 books in the catalog
└── update-users-script.js      # Update user data
```

## 🚀 Available Scripts

### 1. Generate 402 Books
```bash
node scripts/generate-402-books.js
```
- Creates 402 unique books with varied genres, authors, and metadata
- Expands the existing catalog to full demo size

### 2. Download All Book Covers
```bash
node scripts/download-all-covers.js
```
- Downloads covers for all 402 books
- Uses multiple fallback sources (Google Books, Open Library, etc.)
- Skips already downloaded covers
- Validates file sizes
- Creates log file for tracking

### 3. Generate User Avatars
```bash
node scripts/generate-user-avatars.js
```
- Generates unique avatars for all users
- Uses DiceBear API with multiple styles
- Deterministic generation (same seed = same avatar)

### 4. Curate User Books
```bash
node scripts/curate-user-books.js
```
- Creates realistic library data for all users
- Varies library sizes based on premium status
- Adds ratings, reading progress, wishlists
- Generates listening statistics

### 5. Verify All Assets
```bash
node scripts/verify-all-assets.js
```
- Checks all book covers are present
- Verifies all user avatars exist
- Detects duplicates
- Reports missing files

## 📋 Typical Workflow

When setting up or refreshing demo data:

1. **Generate books** (if needed):
   ```bash
   node scripts/generate-402-books.js
   ```

2. **Download covers**:
   ```bash
   node scripts/download-all-covers.js
   ```

3. **Generate avatars**:
   ```bash
   node scripts/generate-user-avatars.js
   ```

4. **Curate user data**:
   ```bash
   node scripts/curate-user-books.js
   ```

5. **Verify everything**:
   ```bash
   node scripts/verify-all-assets.js
   ```

## 🎯 Project Goals

- **402 Books**: Complete audiobook catalog
- **402 Covers**: High-quality cover images for each book
- **21 Users**: Realistic demo users with varied libraries
- **Clean Root**: All utilities organized in `/scripts`

## 📊 Current Status

Run verification to check current status:
```bash
node scripts/verify-all-assets.js
```

## 🧹 Maintenance

- Scripts are kept in `/scripts` folder
- Documentation is in `/assets/docs`
- Root directory only contains config files and README
- All generated data goes to appropriate `/src/data` or `/public/images` folders

---

**Note:** All scripts use ES modules (import/export). Make sure your `package.json` has `"type": "module"`.

