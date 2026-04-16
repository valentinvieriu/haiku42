// ── Scene Seed Builder for Haiku Generation ─────────────────────────
//
// DESIGN RATIONALE
//
// This module generates "scene seeds" — concrete, imageable micro-moments
// that an LLM can inhabit to write a haiku. The output is a semicolon-
// separated string of 2-5 sensory clauses.
//
// Previous approach: 20 overlapping categories of abstract noun phrases
// ("climate anxiety", "digital fatigue") combined via templates with
// explanatory verbs ("X reveals Y", "X versus Y"). This produced topic
// sentences, not haiku seeds — the templates interpreted the moment
// before the LLM could.
//
// Current approach: 8 MODES (families of moments), each with coherent
// pools organized by POETIC FUNCTION (not subject domain):
//   - frames:   where/when — anchors the scene in place and time
//   - anchors:  focal subject + action — what the eye lands on
//   - sensory:  sound/smell/touch/light — grounds in the body
//   - traces:   human residue — evidence someone was here
//   - absences: what's NOT there — deeply haiku (ma / negative space)
//
// KEY RULES:
// 1. Every visible element must be concrete and imageable (feeds both
//    haiku text AND image generation via imagePrompt)
// 2. No explanatory verbs: "reveals", "teaches", "mirrors", "versus"
// 3. No visible abstractions: "quiet joy", "climate grief", "digital anxiety"
// 4. Meaning is carried implicitly through juxtaposition of concrete
//    elements — the LLM discovers the connection
// 5. Mode selection itself provides thematic steering — choosing
//    "climate-echo" naturally produces climate-adjacent imagery without
//    naming the theme
//
// COHERENCE:
// Mode-scoped pools ensure coherence: random picks within one mode
// share a world. Broad modes (human-trace, night-and-silence) use
// SCENE CLUSTERS — sub-groupings where every entry is plausible in
// the same physical space. The composition picks a cluster first,
// then draws from within it.
//
// Composition types control structure (how many elements, from which
// pools), weighted so most seeds are 3 elements (grounded but not
// overloaded).
//
// Mode definitions live in `./topics/modes/` — one file per mode. The
// aggregator at `./topics/modes/index.js` re-exports them as `modes` in
// the order weighted-pick depends on.

import { modes } from "./topics/modes/index.js";

// ── Helpers ──────────────────────────────────────────────────────────

// Mulberry32 — tiny PRNG. Used by generateSceneSeed when a deterministic
// replay is requested (e.g. `node scripts/generate-topics.js --seed 42`).
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rand(arr, rng = Math.random) {
  return arr[Math.floor(rng() * arr.length)];
}

function weightedPick(entries, rng = Math.random) {
  const total = entries.reduce((s, e) => s + e.weight, 0);
  let r = rng() * total;
  for (const entry of entries) {
    if (r < entry.weight) return entry;
    r -= entry.weight;
  }
  return entries[entries.length - 1];
}

// Resolves a mode into a flat set of pools. If the mode uses scene
// clusters, picks one cluster at random and records its index on
// `_sceneIndex` for debug metadata. Each cluster owns its own `turns`
// so a turn never leaks across the cluster boundary.
function getModePools(mode, rng = Math.random) {
  if (mode.scenes) {
    const idx = Math.floor(rng() * mode.scenes.length);
    return { ...mode.scenes[idx], _sceneIndex: idx };
  }
  return mode;
}

// ── Composition ──────────────────────────────────────────────────────
// Each type draws from different pools in different combinations.
// getModePools() resolves scene clusters first, so composition
// always works with a coherent flat set of pools. Every mode/cluster
// now declares `turns` (either on the cluster or at the mode level,
// merged in by getModePools), so build functions can rely on p.turns.

const compositionTypes = [
  { weight: 28, name: "anchored",    build: (p, rng) => [{ role: "Setting", text: rand(p.frames, rng) }, { role: "Focus", text: rand(p.anchors, rng) }, { role: "Sense", text: rand(p.sensory, rng) }] },
  { weight: 24, name: "turned",      build: (p, rng) => [{ role: "Setting", text: rand(p.frames, rng) }, { role: "Focus", text: rand(p.anchors, rng) }, { role: "Turn", text: rand(p.turns, rng) }] },
  { weight: 15, name: "juxtaposed",  build: (p, rng) => [{ role: "Setting", text: rand(p.frames, rng) }, { role: "Focus", text: rand(p.anchors, rng) }, { role: "Trace", text: rand(p.traces, rng) }] },
  { weight: 15, name: "absence-led", build: (p, rng) => [{ role: "Setting", text: rand(p.frames, rng) }, { role: "Absence", text: rand(p.absences, rng) }, { role: "Turn", text: rand(p.turns, rng) }] },
  { weight: 10, name: "layered",     build: (p, rng) => [{ role: "Setting", text: rand(p.frames, rng) }, { role: "Sense", text: rand(p.sensory, rng) }, { role: "Absence", text: rand(p.absences, rng) }] },
  { weight: 5,  name: "pivot",       build: (p, rng) => [{ role: "Setting", text: rand(p.frames, rng) }, { role: "Turn", text: rand(p.turns, rng) }] },
  { weight: 3,  name: "minimal",     build: (p, rng) => [{ role: "Setting", text: rand(p.frames, rng) }, { role: "Focus", text: rand(p.anchors, rng) }] },
];

// A mode may override composition weights via `compositionWeights: { anchored: 35, ... }`.
// Unmentioned types use their default weight; types set to 0 are excluded.
function pickComposition(mode, rng) {
  const overrides = mode.compositionWeights;
  if (!overrides) return weightedPick(compositionTypes, rng);
  const weighted = compositionTypes
    .map((c) => ({ ...c, weight: overrides[c.name] ?? c.weight }))
    .filter((c) => c.weight > 0);
  return weightedPick(weighted, rng);
}

// ── Temporal Modifiers ───────────────────────────────────────────────
// Applied to ~25% of seeds to transform static frames into moments.
// Split into universal (safe anywhere) and contextual (only fire on
// modes where they make sense). If the chosen frame already encodes
// explicit time/weather, skip the modifier entirely.

const universalModifiers = [
  "after everyone left",
  "before anyone arrives",
  "on the way back",
  "earlier than usual",
  "the last day of the season",
  "one hour in",
  "right before turning away",
];

const contextualModifiers = [
  { text: "past midnight",              modes: ["night-and-silence", "domestic-turn", "transit"] },
  { text: "just as the rain starts",    modes: ["observation", "urban-nature", "climate-echo"] },
  { text: "just before closing",        modes: ["human-trace", "domestic-turn", "night-and-silence"] },
  { text: "just after the door closed", modes: ["domestic-turn", "human-trace"] },
  { text: "mid-shift",                  modes: ["human-trace"] },
  { text: "the morning after",          modes: ["domestic-turn", "night-and-silence"] },
  { text: "the second time today",      modes: ["human-trace", "domestic-turn", "comic-glimpse"] },
  { text: "near the bottom of the cup", modes: ["domestic-turn"] },
];

const FRAME_TIME_WEATHER_RE =
  /\b(dawn|dusk|predawn|1am|2am|3am|midnight|at noon|morning|evening|sunset|sunrise|first light|golden hour|in the rain|after rain|after the rain|in the fog|in the snow|at night)\b/i;

function pickModifier(modeName, frameText, rng) {
  if (FRAME_TIME_WEATHER_RE.test(frameText)) return null;
  const contextual = contextualModifiers
    .filter((c) => c.modes.includes(modeName))
    .map((c) => c.text);
  const pool = [...universalModifiers, ...contextual];
  if (pool.length === 0) return null;
  return rand(pool, rng);
}

// ── Scene label table ───────────────────────────────────────────────
// Optional friendly labels for the three modes we clustered. Unlisted
// modes fall back to a numeric index in debug metadata.
const SCENE_LABELS = {
  "observation":   ["quiet-outdoors", "edge-of-civilization", "water-edge"],
  "urban-nature":  ["street-level", "aerial-or-structural", "underpass-or-lot"],
  "climate-echo":  ["smoke-heat-drought", "coastal-tidal", "inland-flood", "agriculture-seasonal-drift", "marine-coastal-restoration", "cryosphere-thaw", "inland-restoration-energy"],
};

// ── Main Export ──────────────────────────────────────────────────────

export function generateSceneSeed({ seed, rng, mode: modeOverride } = {}) {
  const r = rng ?? (seed !== undefined ? mulberry32(seed) : Math.random);

  let mode;
  if (modeOverride) {
    mode = modes.find((m) => m.name === modeOverride);
    if (!mode) throw new Error(`Unknown mode: ${modeOverride}`);
  } else {
    mode = weightedPick(modes, r);
  }

  const pools = getModePools(mode, r);
  const composition = pickComposition(mode, r);
  const parts = composition.build(pools, r);

  // 25% chance: prepend a temporal modifier, but only if the frame
  // doesn't already encode explicit time/weather and a compatible
  // modifier exists for this mode.
  let modifier = null;
  if (r() < 0.25) {
    modifier = pickModifier(mode.name, parts[0].text, r);
    if (modifier) {
      parts[0].text = modifier + " — " + parts[0].text;
    }
  }

  const text = parts.map((p) => `${p.role}: ${p.text}`).join("; ");

  let sceneLabel = null;
  if (pools._sceneIndex !== undefined) {
    const labels = SCENE_LABELS[mode.name];
    sceneLabel = labels ? labels[pools._sceneIndex] : `scene${pools._sceneIndex}`;
  }

  return {
    text,
    meta: {
      mode: mode.name,
      scene: sceneLabel,
      composition: composition.name,
      modifier,
    },
  };
}

function getRandomTopic() {
  return generateSceneSeed().text;
}

export default getRandomTopic;
