import fs from 'fs';
import path from 'path';
import https from 'https';

const users = JSON.parse(fs.readFileSync('./src/data/users.json', 'utf8'));
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
async function generateAvatar(user, index, total) {
  const filename = `user-${user.id}.png`;
  const filepath = path.join(avatarDir, filename);

  // Check if avatar already exists
  if (fs.existsSync(filepath)) {
    console.log(`[${index + 1}/${total}] ✓ Avatar exists: ${user.name}`);
    return { success: true, user: user.name };
  }

  // Use DiceBear API - multiple styles available
  const styles = ['avataaars', 'bottts', 'personas', 'lorelei', 'notionists', 'adventurer'];
  const style = styles[parseInt(user.id) % styles.length];
  
  // Create deterministic seed from user name
  const seed = encodeURIComponent(user.name + user.id);
  const avatarUrl = `https://api.dicebear.com/7.x/${style}/png?seed=${seed}&size=200`;

  try {
    await downloadFile(avatarUrl, filepath);
    console.log(`[${index + 1}/${total}] ✅ Generated avatar for: ${user.name}`);
    return { success: true, user: user.name };
  } catch (error) {
    console.log(`[${index + 1}/${total}] ❌ Failed for: ${user.name} - ${error.message}`);
    return { success: false, user: user.name };
  }
}

async function processAllUsers() {
  console.log(`\n👥 Generating avatars for ${users.length} users...\n`);
  
  const results = { success: 0, existing: 0, failed: 0 };

  for (let i = 0; i < users.length; i++) {
    const result = await generateAvatar(users[i], i, users.length);
    if (result.success) {
      results.success++;
    } else {
      results.failed++;
    }
    
    // Small delay to avoid rate limiting
    if (i < users.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 AVATAR GENERATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total users: ${users.length}`);
  console.log(`Successfully generated: ${results.success}`);
  console.log(`Failed: ${results.failed}`);
  console.log('\n✓ Process complete!\n');
}

processAllUsers().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

