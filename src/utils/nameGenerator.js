const firstNames = [
  'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Charlotte', 'Mia', 'Amelia', 'Harper', 'Evelyn',
  'Liam', 'Noah', 'Oliver', 'Elijah', 'William', 'James', 'Benjamin', 'Lucas', 'Henry', 'Alexander',
  'Mason', 'Michael', 'Ethan', 'Daniel', 'Jacob', 'Logan', 'Jackson', 'Levi', 'Sebastian', 'Mateo',
  'Emily', 'Abigail', 'Ella', 'Scarlett', 'Grace', 'Chloe', 'Victoria', 'Riley', 'Aria', 'Lily',
  'Sofia', 'Camila', 'Layla', 'Madison', 'Luna', 'Penelope', 'Zoe', 'Nora', 'Hannah', 'Eleanor',
  'Aiden', 'Samuel', 'David', 'Joseph', 'Carter', 'Owen', 'Wyatt', 'John', 'Jack', 'Luke',
  'Jayden', 'Dylan', 'Grayson', 'Leo', 'Isaac', 'Gabriel', 'Julian', 'Anthony', 'Jaxon', 'Lincoln',
  'Marcus', 'Jamal', 'Aisha', 'Xavier', 'Kenji', 'Mei', 'Hassan', 'Yuki', 'Diego', 'Carmen'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Chen', 'Kim', 'Patel', 'Nguyen', 'Santos', 'O\'Connor', 'Murphy', 'Rivera', 'Torres', 'Flores',
  'Brooks', 'Richardson', 'Washington', 'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long', 'Patterson', 'Hughes'
];

let usedNames = new Set();

export function generateRandomName() {
  let name;
  let attempts = 0;
  const maxAttempts = 100;
  
  do {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    name = `${firstName} ${lastName}`;
    attempts++;
  } while (usedNames.has(name) && attempts < maxAttempts);
  
  if (attempts >= maxAttempts) {
    // Add a number if we've exhausted combinations
    name = `${name}${Math.floor(Math.random() * 999)}`;
  }
  
  usedNames.add(name);
  return name;
}

export function generateMultipleNames(count) {
  const names = [];
  for (let i = 0; i < count; i++) {
    names.push(generateRandomName());
  }
  return names;
}

export function resetUsedNames() {
  usedNames.clear();
}

