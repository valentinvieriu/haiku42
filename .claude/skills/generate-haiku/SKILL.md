---
name: generate-haiku
description: Generate a contemporary 5-7-5 haiku using the same scene seed algorithm and constraints as the haiku42 app
user-invocable: true
---

# Generate Haiku

Generate a contemporary English haiku using the same algorithm and creative constraints as the haiku42.net app.

## Steps

1. **Generate a scene seed** by running the app's topic generator:
   ```
   node .claude/skills/generate-haiku/generate-haiku-seed.mjs
   ```
   This uses the exact same weighted mode selection (observation 25%, urban-nature 17%, human-trace 17%, domestic-turn 12.5%, climate-echo 4%, transit 8%, night-and-silence 8%, comic-glimpse 4%) and composition types (anchored, turned, juxtaposed, absence-led, layered, pivot, minimal) as the live app. Seeds include role labels (Setting, Focus, Sense, Trace, Absence, Turn) as structural scaffolding.

2. **Write a haiku** from the scene seed. Follow these steps and **show your reasoning for each step** in the output (this matches the app's LLM prompt):

   The seed includes role labels — treat them as scaffolding only. Do not echo them in the poem, and do not follow their order.

   A good haiku sounds like someone stopped mid-sentence to say: look at that.

   **Step 1 — Select:** Pick 2–3 details from the seed that create friction — where one image changes or reframes another. Explain your choice.

   **Step 2 — Draft:** Write 2-3 different natural 3-line versions. Don't count syllables yet. Each should sound right spoken aloud. Pick the one with the strongest opening and most natural flow before moving to Step 3.

   **Step 3 — Fit meter:** Adjust to exactly 5 / 7 / 5 syllables. If adjusting breaks a line's natural flow, rewrite the whole line — never just delete words to fit.

   **Step 4 — Evaluate strictly.** If ANY rule fails, discard and return to Step 2 with a different approach. Do not patch — regenerate.

   Hard reject if:
   - Any line sounds unnatural, telegraphic, or assembled backward when read aloud
   - Any line compresses two clauses without grammar glue
   - The poem follows the seed's clause order
   - Vague filler appears ("something," "somewhere," "somehow")
   - The poem reads as caption, summary, or paraphrase of the seed
   - The poem lacks a real turn — it's just description
   - Any line exists mainly to satisfy syllable count

   Priority: natural spoken English > vivid opening > real turn > clean 5/7/5.
   If exact meter forces awkward phrasing, discard and try a different angle.

   **Line-level rules:**
   - Do not compress two clauses into one line to hit syllable count.
   - Do not end a line on a weak filler word.
   - Do not stack nouns without grammar between them.
   - Prefer a simpler poem with clean syntax over an ambitious one with a damaged line.
   - No haiku cliche vocabulary ("fleeting", "ephemeral", "serenity", "whisper", "dance").

3. **Verify syllable count** using the bundled CMU dictionary counter:
   ```
   python3 .claude/skills/generate-haiku/count-syllables.py --haiku "line1 / line2 / line3"
   ```
   This uses the CMU Pronouncing Dictionary for accurate counts with a rule-based fallback for rare words. The script exits 0 if the pattern is 5/7/5, exit 1 otherwise. If any line is wrong, rewrite and re-verify until it passes.

4. **Present the result** in this format:

   ```
   Scene seed: <the generated seed>

   <line 1>
   <line 2>
   <line 3>

   Syllables: <count1> / <count2> / <count3> ✓
   ```

5. **Optionally generate an imagePrompt** if the user asks — describe only visible elements of the same scene for an image model. Keep it literal and concise; no art-style words.

## Generating multiple haikus

If the user asks for multiple haikus, generate multiple seeds:
```
node .claude/skills/generate-haiku/generate-haiku-seed.mjs --count N
```
Then write a separate haiku for each seed.

## Comparing with app output

The user may want to compare your haiku with the app's AI-generated output for the same seed. In that case:
- Generate a seed as above
- Write your haiku from it
- The user can then paste the same seed into the app (or generate a new one) and compare
