import getRandomTopic from './topics'
import { getAIService } from './aiServices/index.js';

function generateChatRequest(topic) {
    return {
        messages: [
            {
                role: 'system',
                content: `You write contemporary English haiku from scene seeds.

The seed labels (Setting, Focus, Sense, Trace, Absence, Turn) are scaffolding only. Do not echo them in the poem, and do not follow their order literally.

A strong haiku does not inventory the seed. It selects a few details, leaves one important relation unstated, and creates resonance through juxtaposition and omission.

The haiku and imagePrompt work together:
- the haiku carries the cut, pressure, and emotional aftertaste
- the imagePrompt carries the visible scene, composition, and physical clarity
- because the imagePrompt can hold literal context, the haiku does not need to name every important object or setting detail

Reason through the process below in order, using the shape given. Each step appears at most once. The moment step 5 passes, stop reasoning and emit the JSON.

Process:
1. Name the hidden pressure in the scene in one short phrase. Keep it out of the poem.
2. Write exactly 2 natural 3-line drafts without counting syllables:
   - A: clear and observational
   - B: sharper cut or leap
3. Pick one draft. Abandon the other. One sentence why.
4. Fit the chosen draft to 5/7/5 by rewriting whole lines. Show one total per line on a single line, e.g. \`5 / 7 / 5\`. Do not break words into parenthetical counts.
5. Final check in one line: syllables hold, no cliche, line 3 opens outward. Then emit only the JSON.

Reasoning shape:
- hidden pressure
- Draft A
- Draft B
- chosen draft + reason
- fitted draft + \`5 / 7 / 5\`
- final check → JSON

Do not:
- recount syllables after step 4
- redraft, revise, or second-guess after step 5
- revisit discarded lines or drafts
- emit per-word syllable counts like \`word (1) word (1) = 5\`
- write "Let's try…", "Wait…", "Actually…" or any other reopen-reasoning cue
- compare more than those 2 drafts
- map one line to one seed label
- end by simply repeating the seed's obvious turn, object, or action
- expand the reasoning beyond that shape

Guidelines for the haiku:
- concrete imagery, natural spoken English
- emotional depth by implication, not explanation
- no simile, no cliche, no personification
- no explicit metaphor
- prefer residue, echo, aftermath, and negative space
- line 3 should open the scene outward, not close it down with a report

Guidelines for imagePrompt:
- describe only what would be visibly present in the final image
- include the main subject, the surrounding setting, and one clear spatial relation
- include any important trace of absence or aftermath
- keep it literal and concise; no art-style words, no symbolism, no interpretation
- write it as one compact sentence or two short clauses

Output only JSON with these fields: topic, firstLine, secondLine, thirdLine, imagePrompt.`,
            },
            {
                role: 'user',
                content: `Scene seed: """${topic}"""`,
            },
        ],
    };
}

export async function generateHaikuStreaming(env, models, callbacks) {
  const topic = getRandomTopic();
  let error = null;

  for (const model of models) {
    try {
      const aiService = getAIService(model, env);
      const chat = generateChatRequest(topic);

      console.log('Streaming — Topic:', topic, '\nModel:', model);

      let raw = '';
      let haiku = null;
      if (typeof aiService.runStream === 'function') {
        for await (const event of aiService.runStream(chat)) {
          if (event.type === 'thinking') {
            await callbacks.onThinking(event.text);
          } else if (event.type === 'content') {
            raw += event.text;
            await callbacks.onContent(event.text);
            const early = sanitizeResponse(raw);
            if (early) {
              haiku = early;
              break;
            }
          }
        }
      } else {
        raw = (await aiService.run(chat)) ?? '';
      }

      haiku = haiku || sanitizeResponse(raw);
      if (haiku) {
        await callbacks.onComplete({ ...haiku, topic });
        return;
      }

      console.warn(`Model ${model} returned unparseable content; falling through to next model.`);
    } catch (err) {
      console.error(`Streaming error with model ${model}:`, err.message);
      error = err;
    }
  }

  await callbacks.onError(error || new Error('All AI services failed to generate a response'));
}

// Returns a parsed haiku object, or null when the response can't be coerced.
// Null signals the caller to fall through to the next model rather than
// silently completing with a default.
function sanitizeResponse(response) {
	if (!response) return null;
	if (typeof response !== 'string') response = JSON.stringify(response);

	let parsed = null;

	try {
		const trimmed = response.trim();
		if (trimmed.startsWith('{')) {
			parsed = JSON.parse(trimmed);
		}

		if (!parsed) {
			const fenceMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
			if (fenceMatch?.[1]) parsed = JSON.parse(fenceMatch[1]);
		}

		if (!parsed) {
			const rawMatch = response.match(/\{[^{}]*"firstLine"\s*:\s*"[^"]*"[\s\S]*?"thirdLine"\s*:\s*"[^"]*"[^{}]*\}/);
			if (rawMatch) parsed = JSON.parse(rawMatch[0]);
		}
	} catch (error) {
		console.warn('Failed to parse JSON from response:', error.message);
	}

	if (parsed?.firstLine && parsed?.secondLine && parsed?.thirdLine && parsed?.imagePrompt) {
		console.log('Generated Haiku:', parsed);
		return parsed;
	}

	return null;
}
