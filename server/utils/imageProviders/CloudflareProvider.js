import { getPromptTemplate, generatePrompt, generateSeed } from './prompts.js';

export const CLOUDFLARE_IMAGE_MODELS = Object.freeze({
  FLUX_1_SCHNELL: '@cf/black-forest-labs/flux-1-schnell',
});

export default class CloudflareProvider {
  static providerName = 'cloudflare';
  static models = Object.values(CLOUDFLARE_IMAGE_MODELS);

  constructor(env, model = CLOUDFLARE_IMAGE_MODELS.FLUX_1_SCHNELL) {
    this.env = env;
    this.model = model;
  }

  async getImage(haiku, width, height) {
    console.log('[CloudflareProvider] Starting image generation for imagePrompt:', haiku.imagePrompt);
    const promptTemplate = getPromptTemplate(haiku);
    const prompt = generatePrompt(promptTemplate, haiku);
    const seed = generateSeed(promptTemplate, haiku);

    console.log('[CloudflareProvider] Generated prompt:', prompt);
    console.log('[CloudflareProvider] Generated seed:', seed);

    try {
      const response = await this.env.AI.run(this.model, {
        prompt: prompt,
        num_steps: 4,
        seed: seed,
      });

      if (response?.image) {
        console.log('[CloudflareProvider] Successfully generated image for imagePrompt:', haiku.imagePrompt);
        return {
          type: 'base64',
          data: response.image,
        };
      } else {
        throw new Error('Invalid response from Cloudflare AI');
      }
    } catch (error) {
      console.error('[CloudflareProvider] Failed to generate image:', error.message);
      throw new Error('Failed to generate image: ' + error.message);
    }
  }
}
