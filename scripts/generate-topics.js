import { generateSceneSeed } from '../server/utils/topics.js';

// ── Parse CLI flags ───────────────────────────────────────────────────
const USAGE = 'Usage: node scripts/generate-topics.js [--seed <int>] [--count <n>] [--mode <name>] [--debug]';

const args = process.argv.slice(2);
let seed = undefined;
let count = 50;
let mode = undefined;
let debug = false;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--seed') {
    const val = args[++i];
    if (val === undefined || val.startsWith('--')) {
      process.stderr.write(`Error: --seed requires an integer argument\n${USAGE}\n`);
      process.exit(1);
    }
    seed = parseInt(val, 10);
    if (isNaN(seed)) {
      process.stderr.write(`Error: --seed value must be an integer, got: ${val}\n${USAGE}\n`);
      process.exit(1);
    }
  } else if (arg === '--count') {
    const val = args[++i];
    if (val === undefined || val.startsWith('--')) {
      process.stderr.write(`Error: --count requires an integer argument\n${USAGE}\n`);
      process.exit(1);
    }
    count = parseInt(val, 10);
    if (isNaN(count) || count < 1) {
      process.stderr.write(`Error: --count value must be a positive integer, got: ${val}\n${USAGE}\n`);
      process.exit(1);
    }
  } else if (arg === '--mode') {
    const val = args[++i];
    if (val === undefined || val.startsWith('--')) {
      process.stderr.write(`Error: --mode requires a mode name argument\n${USAGE}\n`);
      process.exit(1);
    }
    mode = val;
  } else if (arg === '--debug') {
    debug = true;
  } else {
    process.stderr.write(`Error: unknown flag: ${arg}\n${USAGE}\n`);
    process.exit(1);
  }
}

// ── Header ────────────────────────────────────────────────────────────
const modeLabel = mode ? ` (mode: ${mode})` : '';
console.log(`Generating ${count} random topics${modeLabel}:`);
console.log('----------------------------');

// ── Generate ──────────────────────────────────────────────────────────
for (let i = 0; i < count; i++) {
  const opts = {};
  if (seed !== undefined) opts.seed = seed + i;
  if (mode !== undefined) opts.mode = mode;

  const result = generateSceneSeed(opts);
  console.log(`${i + 1}. ${result.text}`);

  if (debug) {
    const { mode: m, scene, composition, modifier } = result.meta;
    console.log(`   [mode=${m} scene=${scene} composition=${composition} modifier=${modifier}]`);
  }
}
