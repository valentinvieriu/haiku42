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

The seed labels (Setting, Focus, Sense, Trace, Absence, Turn) are scaffolding only. Do not echo them in the poem, and do not follow their order literally.

A strong haiku does not inventory the seed. It selects a few details, leaves one important relation unstated, and creates resonance through juxtaposition and omission.

The haiku and imagePrompt work together:
- the haiku carries the cut, pressure, and emotional aftertaste
- the imagePrompt carries the visible scene, composition, and physical clarity
- because the imagePrompt can hold literal context, the haiku does not need to name every important object or setting detail

Think before answering, but keep the reasoning brief and convergent.
Stop as soon as one valid haiku is found.

Process:
1. Identify the hidden pressure in the scene in a short phrase. Keep it out of the poem.
2. Draft exactly 2 natural 3-line versions before counting syllables:
   - one clear and observational
   - one with a sharper cut or leap
3. Choose 1 draft only and abandon the other completely.
4. Fit only the chosen draft to exactly 5 / 7 / 5 syllables.
   Rewrite whole lines when needed. Count syllables silently and only for the chosen draft.
5. Do one final check, then stop.

Do not:
- revisit discarded lines
- compare more than those 2 drafts
- repeatedly recount syllables
- map one line to one seed label
- end by simply repeating the seed's obvious turn, object, or action

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
	const defaultHaiku = {
		topic: "Artificial Intelligence",
		firstLine: "Silent minds converge",
		secondLine: "In circuits, wisdom blossoms",
		thirdLine: "A new dawn awakes",
		imagePrompt: "A futuristic cityscape at dawn, with glowing circuits intertwining with tree branches. In the foreground, silhouettes of human-like figures stand, their heads illuminated by soft, pulsating light representing awakening AI consciousness."
	};

	if (typeof response !== 'string') {
		response = JSON.stringify(response);
	}

	let parsed = null;

	try {
		// 1. Direct parse (structured JSON output from Ollama format: schema)
		const trimmed = response.trim();
		if (trimmed.startsWith('{')) {
			parsed = JSON.parse(trimmed);
		}

		// 2. Extract from ```json fences (cloud services)
		if (!parsed) {
			const fenceMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
			if (fenceMatch?.[1]) {
				parsed = JSON.parse(fenceMatch[1]);
			}
		}

		// 3. Find raw JSON object with expected keys (last resort)
		if (!parsed) {
			const rawMatch = response.match(/\{[^{}]*"firstLine"\s*:\s*"[^"]*"[\s\S]*?"thirdLine"\s*:\s*"[^"]*"[^{}]*\}/);
			if (rawMatch) {
				parsed = JSON.parse(rawMatch[0]);
			}
		}
	} catch (error) {
		console.warn('Failed to parse JSON from response:', error.message);
	}

	if (parsed?.firstLine && parsed?.secondLine && parsed?.thirdLine && parsed?.imagePrompt) {
		console.log('Generated Haiku:', parsed);
		return parsed;
	}

	console.warn('Invalid haiku structure, using default haiku.');
	return defaultHaiku;
}
