import { getPromptTemplate, generatePrompt } from './prompts.js';

export const OLLAMA_IMAGE_MODELS = Object.freeze({
  Z_IMAGE_TURBO: 'x/z-image-turbo:fp8',
});

export default class OllamaProvider {
  static providerName = 'ollama';
  static models = Object.values(OLLAMA_IMAGE_MODELS);

  constructor(env, model) {
    this.env = env;
    // Resolution order: explicit constructor arg → env.OLLAMA_IMAGE_MODEL → default.
    // The env override lets you swap the local diffusion model without code changes.
    this.model = model ?? env.OLLAMA_IMAGE_MODEL ?? OLLAMA_IMAGE_MODELS.Z_IMAGE_TURBO;
    this.baseUrl = env.OLLAMA_BASE_URL || 'http://localhost:11434';
  }

  async getImage(haiku, width, height) {
    const promptTemplate = getPromptTemplate(haiku);
    const prompt = generatePrompt(promptTemplate, haiku);
    console.log('[OllamaProvider] Style prompt:', prompt.slice(0, 120) + '...');

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
        }),
        signal: AbortSignal.timeout(5 * 60 * 1000),
      });

      const data = await response.json();

      if (data?.error) {
        throw new Error(data.error);
      }

      // Ollama image models return base64 in the `image` field
      const imageData = data?.image;

      if (imageData) {
        return { type: 'base64', data: imageData };
      } else {
        throw new Error('No image data in Ollama response');
      }
    } catch (error) {
      console.error('[OllamaProvider] Failed:', error.message);
      throw new Error('Failed to generate image via Ollama: ' + error.message);
    }
  }
}
