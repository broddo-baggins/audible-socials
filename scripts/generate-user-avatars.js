import fs from 'fs';
import path from 'path';
import https from 'https';

const users = JSON.parse(fs.readFileSync('./src/data/users.json', 'utf8'));
const mockUsers = JSON.parse(fs.readFileSync('./src/data/mockUsers.json', 'utf8'));
const avatarDir = './public/images/avatars';

// Ensure avatars directory exists
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

// Download file from URL
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 10000 }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filepath);
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

// Generate avatar using DiceBear API (free, no auth required)
async function generateAvatar(user, index, total, isMockUser = false) {
  // Use different naming scheme for mock users to avoid conflicts
  const filename = isMockUser ? `mock-user-${user.id}.png` : `user-${user.id}.png`;
  const filepath = path.join(avatarDir, filename);

  // Check if avatar already exists
  if (fs.existsSync(filepath)) {
    console.log(`[${index + 1}/${total}] ✓ Avatar exists: ${user.name} ${isMockUser ? '(mock)' : ''}`);
    return { success: true, user: user.name };
  }

  // Use DiceBear API - multiple styles available
  const styles = ['avataaars', 'bottts', 'personas', 'lorelei', 'notionists', 'adventurer'];
  const styleIndex = isMockUser ? (parseInt(user.id) + 100) % styles.length : parseInt(user.id) % styles.length;
  const style = styles[styleIndex];

  // Create deterministic seed from user name
  const seed = encodeURIComponent(user.name + user.id + (isMockUser ? '_mock' : ''));
  const avatarUrl = `https://api.dicebear.com/7.x/${style}/png?seed=${seed}&size=200`;

  try {
    await downloadFile(avatarUrl, filepath);
    console.log(`[${index + 1}/${total}] ✅ Generated avatar for: ${user.name} ${isMockUser ? '(mock)' : ''}`);
    return { success: true, user: user.name };
  } catch (error) {
    console.log(`[${index + 1}/${total}] ❌ Failed for: ${user.name} ${isMockUser ? '(mock)' : ''} - ${error.message}`);
    return { success: false, user: user.name };
  }
}

async function processAllUsers() {
  const totalUsers = users.length + mockUsers.length;
  console.log(`\n👥 Generating avatars for ${totalUsers} users (${users.length} main + ${mockUsers.length} mock)...\n`);

  const results = { success: 0, existing: 0, failed: 0 };
  let currentIndex = 0;

  // Process main users first
  console.log('\n📋 Processing main users...');
  for (let i = 0; i < users.length; i++) {
    const result = await generateAvatar(users[i], ++currentIndex, totalUsers, false);
    if (result.success) {
      results.success++;
    } else {
      results.failed++;
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Process mock users
  console.log('\n📋 Processing mock users...');
  for (let i = 0; i < mockUsers.length; i++) {
    const result = await generateAvatar(mockUsers[i], ++currentIndex, totalUsers, true);
    if (result.success) {
      results.success++;
    } else {
      results.failed++;
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 AVATAR GENERATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total users: ${totalUsers}`);
  console.log(`Main users: ${users.length}`);
  console.log(`Mock users: ${mockUsers.length}`);
  console.log(`Successfully generated: ${results.success}`);
  console.log(`Failed: ${results.failed}`);
  console.log('\n✓ Process complete!\n');
}

processAllUsers().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

