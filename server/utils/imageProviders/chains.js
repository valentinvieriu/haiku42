import { LEXICA_MODELS }        from './LexicaProvider.js';
import { OLLAMA_IMAGE_MODELS }  from './OllamaProvider.js';
import { STATIC_PRESETS }       from './StaticProvider.js';

/**
 * Named image-provider fallback chains. Each entry references a provider
 * catalogue constant — no raw model strings appear here.
 */
export const chains = Object.freeze({
  // Active default chain. STATIC_PRESETS.DEFAULT is the terminal fallback
  // and always succeeds, so it must remain last.
  default: [
    OLLAMA_IMAGE_MODELS.Z_IMAGE_TURBO,
    LEXICA_MODELS.APERTURE_V3_5,
    STATIC_PRESETS.DEFAULT, // terminal fallback — always succeeds
  ],
});
