export default class CloudflareAIProvider {
    static async getImage(haiku, env, width, height) {
        console.log('[CloudflareAIProvider] Starting image generation for imagePrompt:', haiku.imagePrompt);
        const prompt = this.generatePrompt(haiku);

        console.log('[CloudflareAIProvider] Generated prompt:', prompt);

        try {
            const response = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
                prompt: prompt,
                num_steps: 4,
                width: width,
                height: height
            });

            if (response && response.image) {
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

    static generatePrompt(haiku) {
        const haikuText = `${haiku.firstLine} ${haiku.secondLine} ${haiku.thirdLine}`;
        const topic = haiku.topic || '';
        return `Create a serene and artistic image inspired by this haiku about ${topic}:
        "${haikuText}"
        The image should capture the essence and mood of the haiku, using subtle symbolism and elegant composition.`;
    }
}