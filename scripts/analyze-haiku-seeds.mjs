#!/usr/bin/env node
// analyze-haiku-seeds.mjs
// Batch-samples generateSceneSeed and prints distribution stats.
// Usage: node scripts/analyze-haiku-seeds.mjs [--seed <int>] [--count <n>]

import { generateSceneSeed } from '../server/utils/topics.js';

// ── CLI args ──────────────────────────────────────────────────────────
const args = process.argv.slice(2);
let seedBase = 1;
let count = 500;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--seed' && args[i + 1] !== undefined) { seedBase = parseInt(args[++i], 10); }
  if (args[i] === '--count' && args[i + 1] !== undefined) { count = parseInt(args[++i], 10); }
}

// ── FRAME_TIME_WEATHER_RE ─────────────────────────────────────────────
// Keep this in sync with the copy in server/utils/topics.js.
const FRAME_TIME_WEATHER_RE =
  /\b(dawn|dusk|predawn|1am|2am|3am|midnight|at noon|morning|evening|sunset|sunrise|first light|golden hour|in the rain|after rain|after the rain|in the fog|in the snow|at night)\b/i;

// ── Mode metadata ─────────────────────────────────────────────────────
// Weights must match the `weight` values in topics.js modes array.
// Total = 120; expected% = weight/120*100.
const MODE_WEIGHTS = {
  'observation':       30,
  'urban-nature':      20,
  'human-trace':       20,
  'domestic-turn':     15,
  'climate-echo':      10,
  'transit':           10,
  'night-and-silence': 10,
  'comic-glimpse':      5,
};
const TOTAL_WEIGHT = Object.values(MODE_WEIGHTS).reduce((a, b) => a + b, 0);

// climate-echo overridden composition weights (out of 100)
const CLIMATE_ECHO_COMP_WEIGHTS = {
  turned: 35,
  'absence-led': 25,
  juxtaposed: 20,
  layered: 15,
  anchored: 5,
  pivot: 0,
  minimal: 0,
};

// ── Sample ────────────────────────────────────────────────────────────
const samples = [];
let errorCount = 0;
const errorSeeds = [];
for (let i = 0; i < count; i++) {
  try {
    samples.push(generateSceneSeed({ seed: seedBase + i }));
  } catch (e) {
    errorCount++;
    errorSeeds.push(seedBase + i);
  }
}
if (errorCount > 0) {
  process.stderr.write(`WARNING: ${errorCount} seeds failed to generate (likely missing pool in topics.js). ` +
    `First few: ${errorSeeds.slice(0, 5).join(', ')}\n`);
}

// ── Helpers ───────────────────────────────────────────────────────────
function pad(str, len) { return String(str).padEnd(len); }
function padL(str, len) { return String(str).padStart(len); }
function pct(n, total) { return ((n / total) * 100).toFixed(1); }

// ── 1. Header ─────────────────────────────────────────────────────────
console.log(`Analyzing ${count} seeds (seed base = ${seedBase})\n`);

// ── 2. Mode distribution ──────────────────────────────────────────────
const modeCounts = {};
for (const { meta } of samples) {
  modeCounts[meta.mode] = (modeCounts[meta.mode] || 0) + 1;
}

console.log('Mode Distribution');
console.log('─'.repeat(60));
console.log(pad('Mode', 22) + padL('Count', 7) + padL('Actual%', 11) + padL('Expected%', 11));
for (const mode of Object.keys(MODE_WEIGHTS)) {
  const c = modeCounts[mode] || 0;
  const actual = pct(c, count);
  const expected = pct(MODE_WEIGHTS[mode], TOTAL_WEIGHT);
  console.log(pad(mode, 22) + padL(c, 7) + padL(actual, 11) + padL(expected, 11));
}
console.log();

// ── 3. Scene distribution per mode ───────────────────────────────────
const modesWithScenes = ['observation', 'urban-nature', 'human-trace', 'domestic-turn', 'transit', 'night-and-silence', 'climate-echo'];
console.log('Scene Distribution (per clustered mode)');
console.log('─'.repeat(60));
for (const mode of modesWithScenes) {
  const modeSamples = samples.filter(s => s.meta.mode === mode);
  if (modeSamples.length === 0) { console.log(`  ${mode}: no samples`); continue; }
  const sceneCounts = {};
  for (const { meta } of modeSamples) {
    const key = meta.scene ?? '(no scene)';
    sceneCounts[key] = (sceneCounts[key] || 0) + 1;
  }
  console.log(`  ${mode} (${modeSamples.length} total):`);
  for (const [scene, c] of Object.entries(sceneCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${pad(scene, 36)} ${padL(c, 4)}  (${pct(c, modeSamples.length)}%)`);
  }
}
console.log();

// ── 4. Composition distribution ───────────────────────────────────────
const compCounts = {};
for (const { meta } of samples) {
  compCounts[meta.composition] = (compCounts[meta.composition] || 0) + 1;
}

console.log('Composition Distribution (overall)');
console.log('─'.repeat(60));
const compNames = ['anchored', 'turned', 'juxtaposed', 'absence-led', 'layered', 'pivot', 'minimal'];
for (const name of compNames) {
  const c = compCounts[name] || 0;
  console.log(`  ${pad(name, 14)} ${padL(c, 5)}  (${pct(c, count)}%)`);
}
console.log();

const climateSamples = samples.filter(s => s.meta.mode === 'climate-echo');
if (climateSamples.length > 0) {
  console.log(`Composition Distribution — climate-echo only (${climateSamples.length} samples)`);
  console.log('─'.repeat(60));
  const ceComp = {};
  for (const { meta } of climateSamples) {
    ceComp[meta.composition] = (ceComp[meta.composition] || 0) + 1;
  }
  for (const name of compNames) {
    const c = ceComp[name] || 0;
    const expectedW = CLIMATE_ECHO_COMP_WEIGHTS[name] ?? 0;
    console.log(`  ${pad(name, 14)} ${padL(c, 5)}  actual ${padL(pct(c, climateSamples.length), 5)}%  expected ${expectedW}%`);
  }
  console.log();
}

// ── 5. Modifier usage ─────────────────────────────────────────────────
const withModifier = samples.filter(s => s.meta.modifier !== null);
const modifierCounts = {};
for (const { meta } of withModifier) {
  modifierCounts[meta.modifier] = (modifierCounts[meta.modifier] || 0) + 1;
}

console.log('Modifier Usage');
console.log('─'.repeat(60));
console.log(`  Seeds with modifier applied: ${withModifier.length} / ${count} (${pct(withModifier.length, count)}%)`);
console.log();

const top5 = Object.entries(modifierCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
console.log('  Top 5 most-used modifiers:');
for (const [mod, c] of top5) {
  console.log(`    "${mod}"  — ${c}x`);
}
console.log();

// Integrity check: frame has time/weather encoded AND modifier is non-null
function extractFrameText(text, modifier) {
  // The text format is: "Role: text; Role: text; ..."
  // The first part is the Setting frame.
  let frameText = text;
  // Find "Setting: " prefix
  const settingPrefix = 'Setting: ';
  if (frameText.startsWith(settingPrefix)) {
    frameText = frameText.slice(settingPrefix.length);
  }
  // Split on "; " and take first clause
  frameText = frameText.split('; ')[0];
  // Strip role prefix if still present (e.g. the text started with another role)
  // Also strip from "Role: " if somehow present
  // Strip temporal modifier prefix if set (format: "<modifier> — ")
  if (modifier) {
    const modPrefix = modifier + ' — ';
    if (frameText.startsWith(modPrefix)) {
      frameText = frameText.slice(modPrefix.length);
    }
  }
  return frameText;
}

const violations = samples.filter(({ text, meta }) => {
  if (meta.modifier === null) return false;
  const frameText = extractFrameText(text, meta.modifier);
  return FRAME_TIME_WEATHER_RE.test(frameText);
});

console.log('Integrity Check — modifier applied where frame already encodes time/weather');
if (violations.length === 0) {
  console.log('  ✓ PASS: 0 violations');
} else {
  console.log(`  ✗ FAIL: ${violations.length} violations`);
  const examples = violations.slice(0, 3);
  for (const { text, meta } of examples) {
    console.log(`    modifier: "${meta.modifier}"`);
    console.log(`    text: ${text}`);
    console.log();
  }
}
console.log();

// ── 6. Grouped samples (5 per mode) ───────────────────────────────────
console.log('Grouped Samples (5 per mode, for manual review)');
console.log('─'.repeat(60));

// Collect samples by mode
const byMode = {};
for (const s of samples) {
  if (!byMode[s.meta.mode]) byMode[s.meta.mode] = [];
  byMode[s.meta.mode].push(s);
}

for (const mode of Object.keys(MODE_WEIGHTS)) {
  const modeSamples = byMode[mode] || [];
  const picks = modeSamples.slice(0, 5);
  console.log(`\n  [ ${mode} ]`);
  for (const { text, meta } of picks) {
    console.log(`  ${text}`);
    console.log(`  [meta] mode=${meta.mode} scene=${meta.scene} composition=${meta.composition} modifier=${meta.modifier}`);
  }
}
console.log();
