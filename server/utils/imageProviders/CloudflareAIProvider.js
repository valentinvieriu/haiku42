import { haikuImagePrompts } from './sharedPrompts.js';
import { getPromptTemplate, generatePrompt, generateSeed } from './imageProviderUtils.js';

export default class CloudflareAIProvider {
    static async getImage(haiku, env, width, height) {
        console.log('[CloudflareAIProvider] Starting image generation for imagePrompt:', haiku.imagePrompt);
        const promptTemplate = getPromptTemplate(haiku, haikuImagePrompts);
        const prompt = generatePrompt(promptTemplate, haiku);
        const seed = generateSeed(promptTemplate, haiku);

        console.log('[CloudflareAIProvider] Generated prompt:', prompt);
        console.log('[CloudflareAIProvider] Generated seed:', seed);

        try {
            const response = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
                prompt: prompt,
                num_steps: 8,
                seed: seed,
            });

            if (response?.image) {
                console.log('[CloudflareAIProvider] Successfully generated image for imagePrompt:', haiku.imagePrompt);
                return {
                    type: 'base64',
                    data: response.image
                };
            } else {
                throw new Error('Invalid response from Cloudflare AI');
            }
        } catch (error) {
            console.error('[CloudflareAIProvider] Failed to generate image:', error.message);
            throw new Error('Failed to generate image: ' + error.message);
        }
    }
}
