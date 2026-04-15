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
The input seed is already concrete and imageable. Do not explain it, moralize it, or translate it into an abstract theme. Stay inside the scene.

Requirements:
- Write one haiku in exactly 3 lines with 5 / 7 / 5 syllables.
- Use concrete imagery from the seed and preserve at least 2 specific details.
- Present the moment directly: specific nouns, minimal adjectives, minimal articles.
- Show, don't tell: no named emotions, no moral, no metaphor, no simile, no personification, no cliche.
- Create a subtle turn or juxtaposition; punctuation is optional. Use an em dash only if it genuinely helps.
- Keep the language natural and contemporary, but do not force slang or references.
- Create an imagePrompt describing only visible elements of the same scene for an image model. Keep it literal and concise; no art-style words.

Return only valid JSON inside a \`\`\`json code fence with this shape:

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

Use the seed as source material, not as a theme to explain. If it contains several clauses, choose the strongest 2-3 details and compress them into one moment.`,
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
		// Extract JSON from between ```json and ``` markers
		const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
		if (jsonMatch && jsonMatch[1]) {
			JSONResponse = JSON.parse(jsonMatch[1]);
		} else {
			// Fallback: try parsing the entire response as raw JSON
			JSONResponse = JSON.parse(response.trim());
		}
	} catch (error) {
		console.warn('Failed to parse JSON from response, using default haiku:', error.message);
		JSONResponse = defaultHaiku; // Use default haiku if parsing fails
	}

	// Final check to ensure the response has the expected structure
	if (!JSONResponse.firstLine || !JSONResponse.secondLine || !JSONResponse.thirdLine || !JSONResponse.imagePrompt) {
		console.warn('Invalid haiku structure, using default haiku.');
		JSONResponse = defaultHaiku; // Ensure fallback to default haiku if structure is invalid
	}
	console.log('Generated Haiku:', JSONResponse);
	return JSONResponse;
}
