import getRandomTopic from './topics'
import { getAIService } from './aiServices/index.js';

export async function generateHaiku(env, query, models) {
  const topic = getRandomTopic()

  let response = null;
  let error = null;

  for (const model of models) {
    try {
      // Select API based on the model parameter
      const aiService = getAIService(model, env)

      const chat = generateChatRequest(topic)

      console.log('Topic: ', topic, '\nModel: ', model)

      response = await aiService.run(chat)
      if (response) {
        break; // If we get a valid response, exit the loop
      }
    } catch (err) {
      console.error(`Error with model ${model}:`, err.message)
      error = err
    }
  }

  if (!response) {
    throw error || new Error('All AI services failed to generate a response')
  }

  const sanitizedResponse = sanitizeResponse(response)
  return { ...sanitizedResponse, topic } ?? defaultHaiku;  // Include the topic in the returned object
}

function generateChatRequest(topic) {
    return {
        messages: [
            {
                role: 'system',
                content: `You write contemporary English haiku from scene seeds.

Follow these steps and show your reasoning for each:

**Step 1 — Select:** Pick the 2 details from the seed that create the most friction — where one image changes or reframes the other. Explain your choice.

**Step 2 — Draft:** Write 2-3 different natural 3-line versions. Don't count syllables yet. Each should sound right spoken aloud. Pick the one with the strongest opening and most natural flow before moving to Step 3.

**Step 3 — Fit meter:** Adjust to exactly 5 / 7 / 5 syllables. If adjusting breaks a line's natural flow, rewrite the whole line — never just delete words to fit.

**Step 4 — Evaluate strictly.** If ANY rule fails, discard and return to Step 2 with a different approach. Do not patch — regenerate.

Hard reject if:
- Any line sounds unnatural, telegraphic, or assembled backward when read aloud
- Any line compresses two clauses without grammar glue (e.g., "bright photos scroll", "shake mint still")
- The poem follows the seed's clause order
- Vague filler appears ("something," "somewhere," "somehow")
- The poem reads as caption, summary, or paraphrase of the seed
- The poem lacks a real turn — it's just description
- Any line exists mainly to satisfy syllable count

Priority: natural spoken English > vivid opening > real turn > clean 5/7/5.
If exact meter forces awkward phrasing, discard and try a different angle.

**Step 5 — Image prompt:** Describe only the visible elements of the scene for an image model. Keep it literal and concise; no art-style words.

Line-level rules:
- Do not compress two clauses into one line to hit syllable count.
- Do not end a line on a weak filler word.
- Do not stack nouns without grammar between them.
- Prefer a simpler poem with clean syntax over an ambitious one with a damaged line.

A good haiku sounds like someone stopped mid-sentence to say: look at that.

After your reasoning, output the final result in JSON inside a \`\`\`json code fence:

\`\`\`json
{
  "topic": "brief scene label",
  "firstLine": "...",
  "secondLine": "...",
  "thirdLine": "...",
  "imagePrompt": "..."
}
\`\`\``,
            },
            {
                role: 'user',
                content: `Scene seed: """${topic}"""

Show your reasoning for each step, then output the final JSON.`,
            },
        ],
    };
}

export async function generateHaikuStreaming(env, query, models, callbacks) {
  const topic = getRandomTopic();
  let error = null;

  for (const model of models) {
    try {
      const aiService = getAIService(model, env);
      const chat = generateChatRequest(topic);

      console.log('Streaming — Topic:', topic, '\nModel:', model);

      if (typeof aiService.runStream === 'function') {
        let accumulated = '';
        for await (const event of aiService.runStream(chat)) {
          if (event.type === 'thinking') {
            await callbacks.onThinking(event.text);
          } else if (event.type === 'content') {
            accumulated += event.text;
            await callbacks.onContent(event.text);
          }
        }

        if (accumulated) {
          const haiku = sanitizeResponse(accumulated);
          await callbacks.onComplete({ ...haiku, topic });
          return;
        }
      } else {
        // Fallback to blocking run() for services without streaming
        const response = await aiService.run(chat);
        if (response) {
          const haiku = sanitizeResponse(response);
          await callbacks.onComplete({ ...haiku, topic });
          return;
        }
      }
    } catch (err) {
      console.error(`Streaming error with model ${model}:`, err.message);
      error = err;
    }
  }

  await callbacks.onError(error || new Error('All AI services failed to generate a response'));
}

function sanitizeResponse(response) {
	let defaultHaiku = {
		topic: "Artificial Intelligence",
		firstLine: "Silent minds converge",
		secondLine: "In circuits, wisdom blossoms",
		thirdLine: "A new dawn awakes",
		imagePrompt: "A futuristic cityscape at dawn, with glowing circuits intertwining with tree branches. In the foreground, silhouettes of human-like figures stand, their heads illuminated by soft, pulsating light representing awakening AI consciousness."
	};

	let JSONResponse = defaultHaiku;

	try {
		// If the response is not a string, convert it to a string
		if (typeof response !== 'string') {
			response = JSON.stringify(response);
		}

		// Try multiple extraction strategies (reasoning text may precede JSON)
		let parsed = null;

		// 1. Strict: ```json\n...\n```
		const strictMatch = response.match(/```json\n([\s\S]*?)\n```/);
		if (strictMatch && strictMatch[1]) {
			parsed = JSON.parse(strictMatch[1]);
		}

		// 2. Loose: ```json with any whitespace
		if (!parsed) {
			const looseMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
			if (looseMatch && looseMatch[1]) {
				parsed = JSON.parse(looseMatch[1]);
			}
		}

		// 3. Raw JSON object containing expected keys
		if (!parsed) {
			const rawMatch = response.match(/\{[^{}]*"firstLine"\s*:\s*"[^"]*"[\s\S]*?"thirdLine"\s*:\s*"[^"]*"[^{}]*\}/);
			if (rawMatch) {
				parsed = JSON.parse(rawMatch[0]);
			}
		}

		if (parsed) {
			JSONResponse = parsed;
		}
	} catch (error) {
		console.warn('Failed to parse JSON from response, using default haiku:', error.message);
		JSONResponse = defaultHaiku;
	}

	// Final check to ensure the response has the expected structure
	if (!JSONResponse.firstLine || !JSONResponse.secondLine || !JSONResponse.thirdLine || !JSONResponse.imagePrompt) {
		console.warn('Invalid haiku structure, using default haiku.');
		JSONResponse = defaultHaiku; // Ensure fallback to default haiku if structure is invalid
	}
	console.log('Generated Haiku:', JSONResponse);
	return JSONResponse;
}
