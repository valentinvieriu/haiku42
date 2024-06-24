import getRandomTopic from './topics';

export async function generateHaiku(env, searchParams) {
	const model = searchParams.get('model') || 'groq-llama3-70b'; // Default to Cloudflare AI
	const topic = searchParams.get('topic') || getRandomTopic();
	// Select API based on the model parameter
	const aiService = selectAIService(model, env);

	const chat = generateChatRequest(topic);

	console.log('Topic: ', topic, '\nModel: ', model);
	try {
		let response = await aiService.run(chat);
		return sanitizeResponse(response);
	} catch (error) {
		console.error(`Error in generateHaiku: ${error.message}`);
		// Return a default haiku or handle error as appropriate
	}
}

function selectAIService(model, env) {
	// Example switch to handle different AI services
	console.log('Selected Model:', model);
	switch (model) {
		case 'gpt-4o':
			return {
				async run(chat) {
					let headers = {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${env.OPENAI_API_KEY}`,
					};
					let body = JSON.stringify({
						model: 'gpt-4o',
						messages: chat.messages,
						stream: false,
						n: 1,
						temperature: 2,
						max_tokens: 64,
						top_p: 0.8,
						frequency_penalty: 0.5,
						presence_penalty: 0.5,
					});
					// console.log('GPT-4o Request:', body);
					// console.log('GPT-4o Headers:', headers);
					try {
						let response = await fetch('https://api.openai.com/v1/chat/completions', {
							method: 'POST',
							headers: headers,
							body: body,
						});
						let data = await response.json();
						console.log('GPT-4o Response:', data);
						return data && data['choices'][0].message.content;
					} catch (error) {
						console.error(`Error in generateHaiku with GPT-4: ${error.message}`);
					}
				},
			};
		case 'groq-llama3-8b-8192':
			return {
				async run(chat) {
					let headers = {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${env.GROQ_API_KEY}`,
					};
					let body = JSON.stringify({
						model: 'llama3-8b-8192',
						messages: chat.messages,
						response_format: { "type": "json_object" },
						stream: false,
						n: 1,
						temperature: 0.7,
						max_tokens: 180,
						top_p: 0.7,
					});
					// console.log('Groq Request:', body);
					// console.log('Groq Headers:', headers);
					try {
						let response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
							method: 'POST',
							headers: headers,
							body: body,
						});
						let data = await response.json();
						console.log('Groq Response:', data);
						return data && data['choices'][0].message.content;
					} catch (error) {
						console.error(`Error in generateHaiku with Groq: ${error.message}`);
					}
				},
			};
		case 'groq-llama3-70b':
			return {
				async run(chat) {
					let headers = {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${env.GROQ_API_KEY}`,
					};
					let body = JSON.stringify({
						model: 'llama3-70b-8192',
						messages: chat.messages,
						response_format: { "type": "json_object" },
						stream: false,
						n: 1,
						temperature: 0.7,
						max_tokens: 100,
						top_p: 0.7,
					});
					// console.log('Groq Request:', body);
					// console.log('Groq Headers:', headers);
					try {
						let response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
							method: 'POST',
							headers: headers,
							body: body,
						});
						let data = await response.json();
						// console.log('Groq Response:', data);
						return data && data['choices'][0].message.content;
					} catch (error) {
						console.error(`Error in generateHaiku with GPT-4: ${error.message}`);
					}
				},
			};
		case 'claude-3-5-sonnet-20240620':
			return {
				async run(chat) {
					let headers = {
						'Content-Type': 'application/json',
						'x-api-key': `${env.ANTHROPIC_API_KEY}`,
						'anthropic-version': '2023-06-01',
					};
					let body = JSON.stringify({
						model: 'claude-3-5-sonnet-20240620',
						messages: [chat.messages[1]],
						system: chat.messages[0].content,
						stream: false,
						temperature: 0.7,
						max_tokens: 100,
						top_p: 0.7,
					});
					// console.log('Claude Request:', body);
					// console.log('Claude Headers:', headers);
					try {
						let response = await fetch('https://api.anthropic.com/v1/messages', {
							method: 'POST',
							headers: headers,
							body: body,
						});
						let data = await response.json();
						console.log('Opus Response:', data);
						return data && data['content'][0].text;
					} catch (error) {
						console.error(`Error in generateHaiku with Opus: ${error.message}`);
					}
				},
			};
		case 'nous-hermes':
			return {
				async run(chat) {
					let headers = {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
						'HTTP-Referer': 'https://haiku42.net', // Optional, for including your app on openrouter.ai rankings.
						'X-Title': 'Haiku 42', // Optional. Shows in rankings on openrouter.ai.
					};
					let body = JSON.stringify({
						model: 'nousresearch/nous-hermes-2-mistral-7b-dpo',
						messages: chat.messages,
						stream: false,
						n: 1,
						response_format: {
							type: 'json_object',
							schema: `{"type":"object","properties":{"firstLine":{"type":"string"},"secondLine":{"type":"string"},"thirdLine":{"type":"string"}},"required":["firstLine","secondLine","thirdLine"]}`,
						},
						temperature: 0.7,
						max_tokens: 100,
						top_p: 0.7,
					});
					// console.log('Groq Request:', body);
					// console.log('Groq Headers:', headers);
					try {
						let response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
							method: 'POST',
							headers: headers,
							body: body,
						});
						let data = await response.json();
						// console.log('Groq Response:', data);
						return data && data['choices'][0].message.content;
					} catch (error) {
						console.error(`Error in generateHaiku with GPT-4: ${error.message}`);
					}
				},
			};
		case 'perplexity-llama-3-70b-instruct':
			return {
				async run(chat) {
					let headers = {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${env.PERPLEXITY_API}`,
					};
					let body = JSON.stringify({
						model: 'llama-3-70b-instruct',
						messages: chat.messages,
						stream: false,
						n: 1,
						temperature: 0.7,
						max_tokens: 100,
						top_p: 0.7,
					});
					// console.log('Perplexity Request:', body);
					// console.log('Perplexity Headers:', headers);
					try {
						let response = await fetch('https://api.perplexity.ai/chat/completions', {
							method: 'POST',
							headers: headers,
							body: body,
						});
						let data = await response.json();
						console.log('perplexity Response:', data);
						return data && data['choices'][0].message.content;
					} catch (error) {
						console.error(`Error in generateHaiku with GPT-4: ${error.message}`);
					}
				},
			};
		case 'localhost':
			return {
				async run(chat) {
					let headers = {
						'Content-Type': 'application/json',
					};
					let body = JSON.stringify({
						messages: chat.messages,
						stream: false,
						n: 1,
						temperature: 0.7,
						max_tokens: 100,
						top_p: 0.7,
					});
					// console.log('Groq Request:', body);
					// console.log('Groq Headers:', headers);
					try {
						let response = await fetch('http://localhost:11434/v1/chat/completions', {
							method: 'POST',
							headers: headers,
							body: body,
						});
						let data = await response.json();
						console.log('Groq Response:', data);
						return data && data['choices'][0].message.content;
					} catch (error) {
						console.error(`Error in generateHaiku with GPT-4: ${error.message}`);
					}
				},
			};
		case 'cf-openhermes':
			return {
				async run(chat) {
					const ai = new Ai(env.AI);
					let { response } = await env.AI.run('@hf/thebloke/openhermes-2.5-mistral-7b-awq', chat);
					if (typeof response !== 'string') {
						response = JSON.stringify(response);
					}
					return JSON.parse(response);
				},
			};

		case 'cf-mistral':
		default: // Default to Cloudflare AI
			return {
				async run(chat) {
					const ai = new Ai(env.AI);
					let { response } = await env.AI.run('@cf/mistral/mistral-7b-instruct-v0.1', chat);
					if (typeof response !== 'string') {
						response = JSON.stringify(response);
					}
					return JSON.parse(response);
				},
			};
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
		console.warn('Invalid haiku structure, using default haiku.');
		JSONResponse = defaultHaiku; // Ensure fallback to default haiku if structure is invalid
	}
	console.log('Generated Haiku:', JSONResponse);
	return JSONResponse;
}
