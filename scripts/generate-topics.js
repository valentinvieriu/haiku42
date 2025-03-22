import getRandomTopic from '../server/utils/topics.js';

// Generate 50 random topics
console.log('Generating 50 random topics:');
console.log('----------------------------');
for (let i = 0; i < 50; i++) {
  console.log(`${i+1}. ${getRandomTopic()}`);
} 