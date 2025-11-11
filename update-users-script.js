const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, 'src/data/users.json');
const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

users.forEach(user => {
  if (!user.currentProgress) {
    const hashVal = user.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    user.currentProgress = 30 + (hashVal % 60);
    user.listeningSpeed = parseFloat((1.0 + (hashVal % 8) * 0.125).toFixed(2));
    user.privacySettings = {
      shareLibrary: hashVal % 3 !== 0,
      shareProgress: hashVal % 4 !== 0,
      shareRatings: true,
      shareClubs: true
    };
    user.rsvpEvents = [];
    user.recommendedBooks = [];
  }
});

fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
console.log('Updated all users successfully');

