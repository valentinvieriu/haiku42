import { haikuImagePrompts } from './sharedPrompts.js';
import { getPromptTemplate, generatePrompt, generateSeed } from './imageProviderUtils.js';

export default class TogetherProvider {
    static async getImage(haiku, env, width, height) {
        const apiUrl = 'https://api.together.xyz/v1/images/generations';
        const promptTemplate = getPromptTemplate(haiku, haikuImagePrompts);
        const prompt = generatePrompt(promptTemplate, haiku);
        const seed = generateSeed(promptTemplate, haiku);

        console.log('[TogetherProvider] Generated prompt:', prompt);
        console.log('[TogetherProvider] Generated seed:', seed);

        // Calculate aspect ratio
        const aspectRatio = width / height;

        // Adjust dimensions while maintaining aspect ratio
        let adjustedWidth, adjustedHeight;
        if (width > height) {
            adjustedWidth = Math.min(width, 1440);
            adjustedHeight = Math.round(adjustedWidth / aspectRatio);
            if (adjustedHeight > 1440) {
                adjustedHeight = 1440;
                adjustedWidth = Math.round(adjustedHeight * aspectRatio);
            }
        } else {
            adjustedHeight = Math.min(height, 1440);
            adjustedWidth = Math.round(adjustedHeight * aspectRatio);
            if (adjustedWidth > 1440) {
                adjustedWidth = 1440;
                adjustedHeight = Math.round(adjustedWidth / aspectRatio);
            }
        }

        const requestBody = {
            model: "black-forest-labs/FLUX.1-schnell",//"black-forest-labs/FLUX.1-schnell-Free",
            prompt,
            width: adjustedWidth,
            height: adjustedHeight,
            steps: 4,
            n: 1,
            response_format: "b64_json",
            seed
        };

        try {
            console.log('[TogetherProvider] Sending request to Together API...');
            const response = await $fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${env.TOGETHER_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody),
            });

            if (response?.data?.[0]?.b64_json) {
                console.log('[TogetherProvider] Successfully generated image');
                return {
                    type: 'base64',
                    data: response.data[0].b64_json
                };
            } else {
                throw new Error('Invalid response from Together API');
            }
        } catch (error) {
            console.error('[TogetherProvider] Failed to call Together API:', error.message);
            throw new Error('Failed to call Together API: ' + error.message);
        }
    }
}
