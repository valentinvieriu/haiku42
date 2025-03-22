import { haikuImagePrompts } from './sharedPrompts.js';
import { getPromptTemplate, generatePrompt, generateSeed } from './imageProviderUtils.js';

export default class FluxProProvider {
  static async getImage(haiku, env, width, height) {
    if (!env.REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY environment variable is not set');
    }

    const promptTemplate = getPromptTemplate(haiku, haikuImagePrompts);
    const prompt = generatePrompt(promptTemplate, haiku);
    const seed = generateSeed(promptTemplate, haiku);

    console.log('[FluxProProvider] Generated prompt:', prompt);
    console.log('[FluxProProvider] Generated seed:', seed);

    // Determine aspect ratio based on width and height
    const validRatios = ['1:1', '16:9', '21:9', '3:2', '2:3', '4:5', '5:4', '3:4', '4:3', '9:16', '9:21'];
    
    // Calculate the actual ratio as a decimal
    const actualRatio = width / height;
    
    // Convert valid ratios to decimals for comparison
    const ratioDiffs = validRatios.map(r => {
      const [w, h] = r.split(':').map(Number);
      return {
        ratio: r,
        diff: Math.abs(actualRatio - (w / h))
      };
    });
    
    // Sort by difference and take the closest match
    const aspectRatio = ratioDiffs.sort((a, b) => a.diff - b.diff)[0].ratio;

    const requestBody = {
      input: {
        prompt: prompt,
        seed: seed,
        aspect_ratio: aspectRatio,
        output_format: "webp",            // One of: "webp", "jpg", "png"
        output_quality: 80,               // Default: 80, range: 0-100
        safety_tolerance: 2,      // Default: false
        prompt_upsampling: false          // Default: false
      }
    };

    try {
      console.log('[FluxProProvider] Sending request to Replicate API...', JSON.stringify(requestBody));
      
      const response = await $fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.REPLICATE_API_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait'
        },
        body: JSON.stringify(requestBody)
      });

      if (response?.output) {
        console.log('[FluxProProvider] Successfully generated image');
        
        const imageResponse = await $fetch(response.output, {
          responseType: 'arrayBuffer'
        });
        
        const base64Image = Buffer.from(imageResponse).toString('base64');
        return {
          type: 'base64',
          data: base64Image
        };
      } else {
        throw new Error('Invalid response from Replicate API');
      }
    } catch (error) {
      console.error('[FluxProProvider] Failed to call Replicate API:', error.message);
      throw new Error('Failed to call Replicate API: ' + error.message);
    }
  }
}