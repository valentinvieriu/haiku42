import { getPromptTemplate, generatePrompt } from './imageProviderUtils.js';

export default class OllamaImageProvider {
  static async getImage(haiku, env, width, height) {
    const baseUrl = env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const model = env.OLLAMA_IMAGE_MODEL || 'x/z-image-turbo:fp8';

    const promptTemplate = getPromptTemplate(haiku);
    const prompt = generatePrompt(promptTemplate, haiku);
    console.log('[OllamaImageProvider] Style prompt:', prompt.slice(0, 120) + '...');

    try {
      const response = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
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
      console.error('[OllamaImageProvider] Failed:', error.message);
      throw new Error('Failed to generate image via Ollama: ' + error.message);
    }
  }
}
