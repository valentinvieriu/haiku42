import { getPromptTemplate, generatePrompt, generateSeed } from './prompts.js';

export const TOGETHER_PRESETS = Object.freeze({
  FLUX_SCHNELL: 'together-flux-schnell',
  FLUX_SCHNELL_FREE: 'together-flux-schnell-free',
});

const PRESET_CONFIG = {
  [TOGETHER_PRESETS.FLUX_SCHNELL]: {
    model: 'black-forest-labs/FLUX.1-schnell',
    steps: 4,
  },
  [TOGETHER_PRESETS.FLUX_SCHNELL_FREE]: {
    model: 'black-forest-labs/FLUX.1-schnell-Free',
    steps: 1,
  },
};

const API_URL = 'https://api.together.xyz/v1/images/generations';
const MAX_DIMENSION = 1440;

function fitDimensions(width, height) {
  const aspectRatio = width / height;
  let w, h;
  if (width > height) {
    w = Math.min(width, MAX_DIMENSION);
    h = Math.round(w / aspectRatio);
    if (h > MAX_DIMENSION) {
      h = MAX_DIMENSION;
      w = Math.round(h * aspectRatio);
    }
  } else {
    h = Math.min(height, MAX_DIMENSION);
    w = Math.round(h * aspectRatio);
    if (w > MAX_DIMENSION) {
      w = MAX_DIMENSION;
      h = Math.round(w / aspectRatio);
    }
  }
  return { width: w, height: h };
}

export default class TogetherProvider {
  static providerName = 'together';
  static models = Object.values(TOGETHER_PRESETS);

  constructor(env, preset = TOGETHER_PRESETS.FLUX_SCHNELL) {
    this.env = env;
    this.preset = preset;
    this.config = PRESET_CONFIG[preset];
  }

  async getImage(haiku, width, height) {
    const tag = `[TogetherProvider:${this.preset}]`;
    const promptTemplate = getPromptTemplate(haiku);
    const prompt = generatePrompt(promptTemplate, haiku);
    const seed = generateSeed(promptTemplate, haiku);

    console.log(`${tag} Generated prompt:`, prompt);
    console.log(`${tag} Generated seed:`, seed);

    const dims = fitDimensions(width, height);

    const requestBody = {
      model: this.config.model,
      prompt,
      width: dims.width,
      height: dims.height,
      steps: this.config.steps,
      n: 1,
      response_format: 'b64_json',
      seed,
    };

    try {
      console.log(`${tag} Sending request to Together API...`);
      const response = await $fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response?.data?.[0]?.b64_json) {
        console.log(`${tag} Successfully generated image`);
        return {
          type: 'base64',
          data: response.data[0].b64_json,
        };
      } else {
        throw new Error('Invalid response from Together API');
      }
    } catch (error) {
      console.error(`${tag} Failed to call Together API:`, error.message);
      throw new Error('Failed to call Together API: ' + error.message);
    }
  }
}
