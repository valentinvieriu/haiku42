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
   This uses the exact same weighted mode selection (observation 30%, urban-nature 20%, human-trace 20%, domestic-turn 15%, climate-echo 10%, transit 10%, night-and-silence 10%, absurdity 5%) and composition types (anchored, juxtaposed, layered, absence-led, minimal) as the live app.

2. **Write a haiku** from the scene seed, following these rules exactly:

   - Write one haiku in exactly 3 lines with **5 / 7 / 5 syllables**. Count carefully.
   - The seed is already concrete and imageable. Do NOT explain it, moralize it, or translate it into an abstract theme. Stay inside the scene.
   - Use concrete imagery from the seed and preserve at least 2 specific details.
   - Present the moment directly: specific nouns, minimal adjectives, minimal articles.
   - Show, don't tell: no named emotions, no moral, no metaphor, no simile, no personification, no cliche.
   - Create a subtle turn or juxtaposition; punctuation is optional. Use an em dash only if it genuinely helps.
   - Keep the language natural and contemporary, but do not force slang or references.
   - Do NOT use haiku cliche vocabulary ("fleeting", "ephemeral", "serenity", "whisper", "dance").

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
