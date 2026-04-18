import { GOOGLE_MODELS } from './GoogleProvider.js';
import { OLLAMA_MODELS } from './OllamaProvider.js';

/**
 * Named fallback chains. Each chain is an ordered array of model ids — the
 * generator iterates and uses the first model that responds successfully.
 *
 * All entries reference provider catalogue constants; no raw model strings
 * appear here. To change a chain, edit this file. To rename a model id,
 * edit only the provider catalogue and chains follow automatically.
 */
export const chains = Object.freeze({
  // Active streaming endpoint — order matters (preferred → fallback).
  streaming: [
    OLLAMA_MODELS.GEMMA_4_26B_A4B,
    GOOGLE_MODELS.GEMMA_4_26B_A4B,
    GOOGLE_MODELS.GEMMA_4_31B,
    OLLAMA_MODELS.QWEN_3_6_35B,
    OLLAMA_MODELS.QWEN_3_5_122B,
    OLLAMA_MODELS.GEMMA_4_E2B,
    OLLAMA_MODELS.QWEN_3_5_27B,
  ],
});
