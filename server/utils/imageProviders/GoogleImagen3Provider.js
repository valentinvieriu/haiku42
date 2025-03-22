import { haikuImagePrompts } from './sharedPrompts.js';
import { getPromptTemplate, generatePrompt, generateSeed } from './imageProviderUtils.js';

export default class GoogleImagen3Provider {
  static async getImage(haiku, env, width, height) {
    if (!env.REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY environment variable is not set');
    }

    const promptTemplate = getPromptTemplate(haiku, haikuImagePrompts);
    const prompt = generatePrompt(promptTemplate, haiku);
    
    console.log('[GoogleImagen3Provider] Generated prompt:', prompt);

    // Determine aspect ratio based on width and height : 1:1\", \"9:16\", \"16:9\", \"3:4\", \"4:3\"\n"
    const validRatios = ['1:1', '16:9', '9:16', '4:3', '3:4'];
    
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
        aspect_ratio: aspectRatio,
        negative_prompt: "blurry, distorted, low quality, ugly, poor composition",
        safety_filter_level: "block_only_high"
      }
    };

    try {
      console.log('[GoogleImagen3Provider] Sending request to Replicate API...', JSON.stringify(requestBody));
      
      const response = await $fetch('https://api.replicate.com/v1/models/google/imagen-3/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.REPLICATE_API_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait'
        },
        body: JSON.stringify(requestBody)
      });

      if (response?.output) {
        console.log('[GoogleImagen3Provider] Successfully generated image');
        
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
      console.error('[GoogleImagen3Provider] Failed to call Replicate API:', error.message);
      throw new Error('Failed to call Replicate API: ' + error.message);
    }
  }
} 