import { getPromptTemplate, generatePrompt, generateSeed } from './prompts.js';

export const REPLICATE_PRESETS = Object.freeze({
  FLUX_SCHNELL: 'replicate-flux-schnell',
  FLUX_PRO: 'replicate-flux-pro',
  IMAGEN_3: 'replicate-imagen-3',
  FLUX_RED_CINEMA: 'replicate-flux-red-cinema',
});

const FLUX_RATIOS = ['1:1', '16:9', '21:9', '3:2', '2:3', '4:5', '5:4', '3:4', '4:3', '9:16', '9:21'];
const IMAGEN_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4'];

// Pick the closest aspect ratio from a fixed list of supported ratios.
function pickAspectRatio(width, height, validRatios) {
  const actual = width / height;
  return validRatios
    .map((r) => {
      const [w, h] = r.split(':').map(Number);
      return { ratio: r, diff: Math.abs(actual - w / h) };
    })
    .sort((a, b) => a.diff - b.diff)[0].ratio;
}

// FLUX Red Cinema needs explicit width/height, snapped to multiples of 16.
function fitDimensionsMultipleOf16(width, height, max = 1440) {
  const aspectRatio = width / height;
  let w, h;
  if (width > height) {
    w = Math.min(width, max);
    h = Math.round(w / aspectRatio);
    if (h > max) {
      h = max;
      w = Math.round(h * aspectRatio);
    }
  } else {
    h = Math.min(height, max);
    w = Math.round(h * aspectRatio);
    if (w > max) {
      w = max;
      h = Math.round(w / aspectRatio);
    }
  }
  return {
    width: Math.round(w / 16) * 16,
    height: Math.round(h / 16) * 16,
  };
}

const PRESET_CONFIG = {
  [REPLICATE_PRESETS.FLUX_SCHNELL]: {
    endpoint: 'https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions',
    buildBody: ({ prompt, seed, width, height }) => ({
      input: {
        prompt,
        seed,
        aspect_ratio: pickAspectRatio(width, height, FLUX_RATIOS),
        num_outputs: 1,
        go_fast: true,
        megapixels: '1',
        num_inference_steps: 4,
        output_format: 'webp',
        output_quality: 80,
        disable_safety_checker: false,
      },
    }),
    extractImageUrl: (r) => r?.output?.[0],
  },
  [REPLICATE_PRESETS.FLUX_PRO]: {
    endpoint: 'https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions',
    buildBody: ({ prompt, seed, width, height }) => ({
      input: {
        prompt,
        seed,
        aspect_ratio: pickAspectRatio(width, height, FLUX_RATIOS),
        output_format: 'webp',
        output_quality: 80,
        safety_tolerance: 2,
        prompt_upsampling: false,
      },
    }),
    extractImageUrl: (r) => r?.output,
  },
  [REPLICATE_PRESETS.IMAGEN_3]: {
    endpoint: 'https://api.replicate.com/v1/models/google/imagen-3/predictions',
    buildBody: ({ prompt, width, height }) => ({
      input: {
        prompt,
        aspect_ratio: pickAspectRatio(width, height, IMAGEN_RATIOS),
        negative_prompt: 'blurry, distorted, low quality, ugly, poor composition',
        safety_filter_level: 'block_only_high',
      },
    }),
    extractImageUrl: (r) => r?.output,
  },
  [REPLICATE_PRESETS.FLUX_RED_CINEMA]: {
    endpoint: 'https://api.replicate.com/v1/predictions',
    pollOnProcessing: true,
    buildBody: ({ prompt, seed, width, height }) => {
      const dims = fitDimensionsMultipleOf16(width, height);
      return {
        version: 'c2ebb498cc8288d3bd17d92b4b47e007d3d6cda29ac062a0bad59a76a36cfecb',
        input: {
          prompt: `r3dcma, 35mm movie still;${prompt};In the style of r3dcma`,
          width: dims.width,
          height: dims.height,
          aspect_ratio: 'custom',
          disable_safety_checker: true,
          num_inference_steps: 28,
          seed,
          guidance_scale: 3.5,
          num_outputs: 1,
          output_format: 'webp',
          output_quality: 90,
        },
      };
    },
    extractImageUrl: (r) => r?.output?.[0],
  },
};

export default class ReplicateProvider {
  static providerName = 'replicate';
  static models = Object.values(REPLICATE_PRESETS);

  constructor(env, preset = REPLICATE_PRESETS.FLUX_SCHNELL) {
    this.env = env;
    this.preset = preset;
    this.config = PRESET_CONFIG[preset];
  }

  async getImage(haiku, width, height) {
    if (!this.env.REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY environment variable is not set');
    }

    const tag = `[ReplicateProvider:${this.preset}]`;
    const promptTemplate = getPromptTemplate(haiku);
    const prompt = generatePrompt(promptTemplate, haiku);
    const seed = generateSeed(promptTemplate, haiku);

    console.log(`${tag} Generated prompt:`, prompt);
    console.log(`${tag} Generated seed:`, seed);

    const requestBody = this.config.buildBody({ prompt, seed, width, height });

    try {
      console.log(`${tag} Sending request to Replicate API...`);
      const response = await $fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.env.REPLICATE_API_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'wait',
        },
        body: JSON.stringify(requestBody),
      });

      let imageUrl = this.config.extractImageUrl(response);

      // Some presets (FLUX Red Cinema) may still be processing — poll if so.
      if (!imageUrl && this.config.pollOnProcessing && response?.status === 'processing') {
        imageUrl = await this.pollForResult(response.id, tag);
      }

      if (!imageUrl) {
        throw new Error('Invalid response from Replicate API');
      }

      console.log(`${tag} Successfully generated image`);
      const imageResponse = await $fetch(imageUrl, { responseType: 'arrayBuffer' });
      const base64Image = Buffer.from(imageResponse).toString('base64');
      return { type: 'base64', data: base64Image };
    } catch (error) {
      console.error(`${tag} Failed to call Replicate API:`, error.message);
      throw new Error('Failed to call Replicate API: ' + error.message);
    }
  }

  async pollForResult(predictionId, tag) {
    const maxAttempts = 30;
    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      const pollResponse = await $fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: { Authorization: `Bearer ${this.env.REPLICATE_API_KEY}` },
      });

      if (pollResponse.status === 'succeeded' && pollResponse.output?.[0]) {
        return pollResponse.output[0];
      }
      if (pollResponse.status === 'failed') {
        throw new Error('Image generation failed');
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    throw new Error('Timeout waiting for image generation');
  }
}
