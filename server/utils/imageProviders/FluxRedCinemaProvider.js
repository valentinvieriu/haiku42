import { getPromptTemplate, generatePrompt, generateSeed } from './imageProviderUtils.js';

export default class FluxRedCinemaProvider {
    static async getImage(haiku, env, width, height) {
        if (!env.REPLICATE_API_KEY) {
            throw new Error('REPLICATE_API_KEY environment variable is not set');
        }

        const promptTemplate = getPromptTemplate(haiku);
        const prompt = generatePrompt(promptTemplate, haiku);
        const seed = generateSeed(promptTemplate, haiku);

        console.log('[FluxRedCinemaProvider] Generated prompt:', prompt);
        console.log('[FluxRedCinemaProvider] Generated seed:', seed);

        // Calculate aspect ratio and adjust dimensions
        const aspectRatio = width / height;
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

        // Round to nearest multiple of 16 as required by the API
        adjustedWidth = Math.round(adjustedWidth / 16) * 16;
        adjustedHeight = Math.round(adjustedHeight / 16) * 16;

        const requestBody = {
            version: "c2ebb498cc8288d3bd17d92b4b47e007d3d6cda29ac062a0bad59a76a36cfecb",
            input: {
                prompt: `r3dcma, 35mm movie still;${prompt};In the style of r3dcma`,
                width: adjustedWidth,
                height: adjustedHeight,
                aspect_ratio: "custom",
                disable_safety_checker: true,
                num_inference_steps: 28, // Using minimal steps like other providers
                seed: seed,
                guidance_scale: 3.5,
                num_outputs: 1,
                output_format: "webp",
                output_quality: 90
            }
        };

        try {
            console.log('[FluxRedCinemaProvider] Sending request to Replicate API...', JSON.stringify(requestBody));
            
            // Initial request to create prediction
            const response = await $fetch('https://api.replicate.com/v1/predictions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${env.REPLICATE_API_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'wait' // Wait for the prediction to complete
                },
                body: JSON.stringify(requestBody)
            });

            // Check if we got a direct result
            if (response?.output?.[0]) {
                // If the image URL is directly available
                console.log('[FluxRedCinemaProvider] Successfully generated image');
                
                // Fetch the image and convert to base64
                const imageResponse = await $fetch(response.output[0], {
                    responseType: 'arrayBuffer'
                });
                
                const base64Image = Buffer.from(imageResponse).toString('base64');
                return {
                    type: 'base64',
                    data: base64Image
                };
            } else if (response?.status === 'processing') {
                // If we need to poll for results
                const predictionId = response.id;
                let attempts = 0;
                const maxAttempts = 30; // Maximum number of polling attempts
                
                while (attempts < maxAttempts) {
                    const pollResponse = await $fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
                        headers: {
                            'Authorization': `Bearer ${env.REPLICATE_API_KEY}`
                        }
                    });

                    if (pollResponse.status === 'succeeded' && pollResponse.output?.[0]) {
                        const imageResponse = await $fetch(pollResponse.output[0], {
                            responseType: 'arrayBuffer'
                        });
                        
                        const base64Image = Buffer.from(imageResponse).toString('base64');
                        return {
                            type: 'base64',
                            data: base64Image
                        };
                    } else if (pollResponse.status === 'failed') {
                        throw new Error('Image generation failed');
                    }

                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between polls
                    attempts++;
                }
                
                throw new Error('Timeout waiting for image generation');
            } else {
                throw new Error('Invalid response from Replicate API');
            }
        } catch (error) {
            console.error('[FluxRedCinemaProvider] Failed to call Replicate API:', error.message);
            throw new Error('Failed to call Replicate API: ' + error.message);
        }
    }
}
