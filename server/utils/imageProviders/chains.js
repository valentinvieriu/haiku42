import { LEXICA_MODELS }            from './LexicaProvider.js';
import { OLLAMA_IMAGE_MODELS }      from './OllamaProvider.js';
import { REPLICATE_PRESETS }        from './ReplicateProvider.js';
import { TOGETHER_PRESETS }         from './TogetherProvider.js';
import { CLOUDFLARE_IMAGE_MODELS }  from './CloudflareProvider.js';
import { STATIC_PRESETS }           from './StaticProvider.js';

/**
 * Named image-provider fallback chains. Each entry references a provider
 * catalogue constant — no raw model strings appear here.
 */
export const chains = Object.freeze({
  // Active default chain.
  // Note: STATIC_PRESETS.DEFAULT is intentionally last. Previously the
  // equivalent `'default'` sat at index 7 in the inline array — and since
  // StaticProvider always succeeds, every entry after it was dead code.
  // Together and FluxRedCinema are now reachable as fallbacks.
  default: [
    LEXICA_MODELS.APERTURE_V3_5,
    OLLAMA_IMAGE_MODELS.Z_IMAGE_TURBO,
    REPLICATE_PRESETS.FLUX_SCHNELL,
    REPLICATE_PRESETS.IMAGEN_3,
    TOGETHER_PRESETS.FLUX_SCHNELL_FREE,
    REPLICATE_PRESETS.FLUX_PRO,
    CLOUDFLARE_IMAGE_MODELS.FLUX_1_SCHNELL,
    TOGETHER_PRESETS.FLUX_SCHNELL,
    REPLICATE_PRESETS.FLUX_RED_CINEMA,
    STATIC_PRESETS.DEFAULT, // terminal fallback — always succeeds
  ],
});
