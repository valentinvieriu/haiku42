import getRandomTopic from './topics'
import { getAIService } from './aiServices/index.js';

export async function generateHaiku(env, query) {
  const model = 'llama-3.2-11b-text-preview';//'llama-3.2-11b-text-preview' 
  const topic = getRandomTopic()
  
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
    const sanitizedResponse = sanitizeResponse(response)
    return { ...sanitizedResponse, topic }  // Include the topic in the returned object
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

**Key Considerations When Creating a Haiku:**

1. **Contemporary Language**:
   - Utilize modern slang, newly coined words, abbreviations, and turns of phrase to give your haikus a current, colloquial feel.
   - Use simple, straightforward language; every word should count.

2. **Modern Themes**:
   - Draw inspiration from pop culture, technology, current events, and issues of the 21st century.
   - Explore topics relevant to today's society, such as social media, environmental concerns, or technological advancements.

3. **Unexpected Imagery**:
   - Juxtapose unexpected images or ideas to create surprise and spark curiosity.
   - Include two images or ideas that together create a deeper meaning or connection.
   - Use juxtaposition techniques like **Kireji (Cutting Word)** or punctuation to separate the haiku into two contrasting or complementary parts.
   - **Em Dash (—)**: Use the em dash to show a sharp break in focus or an unexpected contrast. It can separate the base from the superposed sections. Place it at the end of the first or second line to create a pivot.

4. **Evocative Language**:
   - Use vivid language that appeals to the senses (sight, sound, smell, taste, touch) and emotions, leaving a lasting impression.
   - Show, don't tell; let images convey emotions or ideas without explicit explanation.

5. **Open to Interpretation**:
   - Craft haikus that are open to multiple interpretations, inviting readers to engage actively with the poem.
   - Allow for ambiguity and depth, letting the reader find their own meaning.

6. **Traditional/Modern Juxtaposition**:
   - Combine traditional haiku imagery and concepts with modern ones to create novel, thought-provoking contrasts and connections.
   - Blend elements of nature with contemporary urban life or technology.

7. **Experimentation with Form**:
   - While adhering to the 5-7-5 syllable structure, feel free to play with line breaks, punctuation, and pauses to innovate.
   - Incorporate techniques like **Enjambment** to carry a thought over to the next line for emphasis.
   - Use **Lineation** to enhance rhythm and impact.

8. **Updated Allusions**:
   - Reference modern cultural myths, icons, and shared societal touchstones to allude to greater contexts and meanings.
   - Include subtle nods to contemporary events or figures.

9. **Emotional Resonance**:
   - Strive for emotional depth and resonance, even within the brevity of the haiku form.
   - Aim for emotional impact without stating emotions directly.

10. **Unique Perspective**:
    - Offer a fresh perspective on familiar subjects or explore entirely new territory.
    - Provide insights that challenge conventional thinking.

11. **Brevity and Impact**:
    - Remember that haiku are about capturing a fleeting moment or feeling in just a few words.
    - Make every syllable count; eliminate unnecessary words.

12. **Humorous Haiku (Optional)**:
    - Feel free to explore witty observations or puns to create humorous haiku.
    - Use wordplay judiciously, ensuring it enhances the haiku's impact.

13. **Additional Traditional Elements**:
    - **Avoid Metaphor and Simile**: Present images directly without using 'like' or 'as' for comparison.
    - **Avoid Personification**: Do not attribute human qualities to non-human things.
    - **Avoid Clichés**: Steer clear of overused phrases and ideas.
    - **Punctuation and Capitalization**:
      - Use punctuation sparingly to enhance meaning.
      - Employ lowercase letters unless grammatically incorrect.
      - **No Titles**: Haikus do not require titles.

**Aim** to capture an ephemeral snapshot of the zeitgeist through the lens of the haiku form, with language that feels fresh and themes that resonate with a contemporary audience.

Ensure each line adheres to the traditional **5-7-5 syllable count**, respectively, and captures the essence of your theme or imagery in a manner that reflects the considerations listed above.

**Instructions:**

Follow these steps to generate the haiku:

1. **Topic Processing**:
   - Take the raw topic provided: \`\${topic}\`
   - Adapt it to create a topic suitable for a haiku, ensuring it aligns with the guidelines and key considerations.
   - The adapted topic should be concise and focused, capturing the essence of the original while being appropriate for haiku.

2. **Haiku Creation**:
   - Create a thought-provoking haiku based on the adapted topic from the previous step.
   - Ensure it adheres to the 5-7-5 syllable structure and incorporates the key considerations listed above.
   - Utilize techniques like **Em Dash (—)** for juxtaposition and to create a pivot in the haiku.

3. **Image Prompt Creation**:
   - Create an **imagePrompt** that captures the essence of the haiku.
   - Describe what should be in the image, detailing the **background**, **middle-ground**, and **foreground**.
   - Include clear details of the items involved and their expected dynamics.
   - Ensure the description aligns with the haiku and enhances its imagery.

4. **Final Output**:
   - Output your reasoning steps for each part above.
   - At the end, provide the final result in **JSON format**, surrounded by comments using \`\`\`json.
   - The JSON should have the following structure:


{
    "topic": "The adapted topic suitable for a haiku",
    "firstLine": "Your first line here. MUST be 5 syllables.",
    "secondLine": "Your second line here. MUST be 7 syllables.",
    "thirdLine": "Your third line here. MUST be 5 syllables.",
    "imagePrompt": "A detailed description of an image capturing the essence of the haiku."
}


**Note:** Ensure that the haiku reflects all the key considerations and guidelines provided.

                    `,
                },
                {
                    role: 'user',
                    content: `
Generate a thought-provoking 5-7-5 Haiku on the topic: """${topic}""".

Follow these steps:

1. **Topic Processing**: Take the raw topic and adapt it to create a topic suitable for a haiku, following the guidelines and keeping as much of the original topic as possible.

2. **Haiku Creation**: Create a haiku based on the topic from the previous step, ensuring it aligns with all the key considerations.

3. **Image Prompt Creation**: Create an imagePrompt that captures the essence of the haiku by describing the layers in the image, including background, middle-ground, foreground, with clear details of the items involved and their expected dynamics.

4. **Final Output**: Provide the final output in JSON format using the expected structure. make sure it is valid JSON and surounded by \`\`\`json tags.


Remember to output your reasoning steps, and only at the end produce the json (with the comments around). Do not remove any of the existing criteria for generating a haiku.
                        `,
                },
            ],
        };
    };



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
			throw new Error('No valid JSON found in the response');
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