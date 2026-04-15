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

The seed includes role labels (Setting, Focus, Sense, Trace, Absence, Turn) — these are scaffolding. Do not echo them in the poem, and do not follow their order.

Think through these steps before writing your answer:

1. Pick 2–3 details from the seed that create friction — where one image changes or reframes another.
2. Draft 2-3 different natural 3-line versions. Don't count syllables yet. Each should sound right spoken aloud.
3. Pick the one with the strongest opening and most natural flow.
4. Fit to exactly 5 / 7 / 5 syllables. If adjusting breaks a line's natural flow, rewrite the whole line — never just delete words to fit.
5. Evaluate strictly. Discard and redraft if:
   - any line sounds unnatural, telegraphic, or assembled backward
   - any line compresses two clauses without grammar glue
   - the poem follows the seed's clause order
   - vague filler appears ("something," "somewhere," "somehow")
   - it reads as caption, summary, or paraphrase of the seed
   - it lacks a real turn — just description
   - any line exists mainly to satisfy syllable count
6. Write an image prompt describing only visible scene elements. Keep it literal and concise; no art-style words.

Priority: natural spoken English > vivid opening > real turn > clean 5/7/5.
A good haiku sounds like someone stopped mid-sentence to say: look at that.

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
