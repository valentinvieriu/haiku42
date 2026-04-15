#!/usr/bin/env node

// Generates a random haiku scene seed using the same algorithm as the app.
// Reuses server/utils/topics.js directly — no duplication.
//
// Usage:
//   node scripts/generate-haiku-seed.mjs           # outputs a random seed
//   node scripts/generate-haiku-seed.mjs --count 5  # outputs 5 seeds

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const topicsPath = resolve(__dirname, '../../../server/utils/topics.js');
const { default: getRandomTopic } = await import(topicsPath);

const count = process.argv.includes('--count')
  ? parseInt(process.argv[process.argv.indexOf('--count') + 1], 10) || 1
  : 1;

for (let i = 0; i < count; i++) {
  console.log(getRandomTopic());
}
