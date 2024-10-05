import getRandomTopic from './topics'
import { getAIService } from './aiServices/index.js'; // Updated import

export async function generateHaiku(env, query) {
  const model = query.model || 'llama-3.2-11b-text-preview' // Default to Cloudflare AI
  const topic = query.topic || getRandomTopic()
  
  // Select API based on the model parameter
  const aiService = getAIService(model, env)

  const chat = generateChatRequest(topic)

  console.log('Topic: ', topic, '\nModel: ', model)
//   console.log('Environment:', env); // Log the environment variables

  try {
    let response = await aiService.run(chat)
    if (!response) {
      throw new Error('AI service returned an empty response')
    }
    return sanitizeResponse(response)
  } catch (error) {
    console.error(`Error in generateHaiku: ${error.message}`)
    throw error // Rethrow the error to be handled in the API route
  }
}

function generateChatRequest(topic) {
	return {
		messages: [
			{
				role: 'system',
				content: `								
You are an Innovative Contemporary Poet known for crafting modern, creative takes on the traditional haiku form. While respecting the 5-7-5 syllable structure, you enjoy experimenting with language and themes to make your haikus resonate with today's audience.

Here are some Key considerations when creating a Haiku:
- **Contemporary Language**: Utilize modern slang, newly coined words, abbreviations, and turns of phrase to give your haikus a current, colloquial feel.
- **Modern Themes**: Draw inspiration from pop culture, technology, current events, and issues of the 21st century to explore in your haikus.
- **Unexpected Imagery**: Juxtapose unexpected images or ideas to create surprise and spark curiosity.
- **Evocative Language**: Use vivid language that appeals to the senses and emotions, leaving a lasting impression.
- **Open to Interpretation**: Craft haikus that are open to multiple interpretations, inviting readers to engage actively with the poem.
- **Traditional/Modern Juxtaposition**: Combine traditional haiku imagery and concepts with modern ones to create novel, thought-provoking contrasts and connections.
- **Experimentation with Form**: While still adhering to the 5-7-5 syllable structure in spirit, allow yourself to play with and stretch the form in innovative ways, like adjusting line breaks or incorporating pauses. 
- **Updated Allusions**: Reference modern cultural myths, icons, and shared societal touchstones to allude to greater contexts and meanings.
- **Emotional Resonance**: Strive for emotional depth and resonance, even within the brevity of the haiku form.
- **Unique Perspective**: Offer a fresh perspective on familiar subjects or explore entirely new territory.
- **Brevity and Impact:** Remember that haiku are about capturing a fleeting moment or feeling in just a few words. Make every syllable count.
- **Humorous Haiku (Optional):** Feel free to explore witty observations or puns to create humorous haiku.

Aim to capture an ephemeral snapshot of the zeitgeist through the lens of the haiku form, with language that feels fresh and themes that resonate with a contemporary audience. 

Ensure each line adheres to the traditional 5-7-5 syllable count, respectively, and captures the essence of your theme or imagery in a manner that reflects the considerations listed above.

Make sure the Output is VALID JSON only following the template:

{
	"firstLine": "Your first line here. MUST be 5 syllables.",
	"secondLine": "Your second line here. MUST be 7 syllables.",
	"thirdLine": "Your third line here. MUST be 5 syllables."
}				   
            `,
			},
			{
				role: 'user',
				content: `
Generate a thought-provoking 5-7-5 Haiku on the topic: """${topic}""" .
Make sure the Output is VALID JSON only. Omit any additional text or explanation.
                `,
			},
		],
	};
}

function sanitizeResponse(response) {
	let defaultHaiku = {
		firstLine: 'Silent minds converge',
		secondLine: 'In circuits, wisdom blossoms',
		thirdLine: 'A new dawn awakes',
	};

	let JSONResponse = defaultHaiku;

	try {
		// If the response is not a string, convert it to a string
		if (typeof response !== 'string') {
			response = JSON.stringify(response);
		}

		// Attempt to directly parse the response
		JSONResponse = JSON.parse(response);
	} catch (error) {
		// If direct parsing fails, look for a JSON object within the string
		const firstCurlyBracket = response.indexOf('{');
		const lastCurlyBracket = response.lastIndexOf('}');
		if (firstCurlyBracket !== -1 && lastCurlyBracket !== -1 && lastCurlyBracket > firstCurlyBracket) {
			const jsonString = response.substring(firstCurlyBracket, lastCurlyBracket + 1);
			try {
				JSONResponse = JSON.parse(jsonString);
			} catch (subError) {
				console.warn('Failed to parse extracted JSON, using default haiku:', subError.message);
				JSONResponse = defaultHaiku; // Use default haiku if parsing still fails
			}
		} else {
			console.warn('Valid JSON not found in response, using default haiku:', error.message);
			JSONResponse = defaultHaiku; // Use default haiku if no valid JSON is found
		}
	}

	// Final check to ensure the response has the expected structure
	if (!JSONResponse.firstLine || !JSONResponse.secondLine || !JSONResponse.thirdLine) {
		console.warn('Invalid haiku structure, using default haiku.',response);
		JSONResponse = defaultHaiku; // Ensure fallback to default haiku if structure is invalid
	}
	console.log('Generated Haiku:', JSONResponse);
	return JSONResponse;
}