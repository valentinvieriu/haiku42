import { ANTHROPIC_MODELS }   from './AnthropicProvider.js';
import { OPENAI_MODELS }      from './OpenAIProvider.js';
import { GOOGLE_MODELS }      from './GoogleProvider.js';
import { OLLAMA_MODELS }      from './OllamaProvider.js';
import { CLOUDFLARE_MODELS }  from './CloudflareProvider.js';

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
    GOOGLE_MODELS.GEMINI_3_1_FLASH_LITE,
    GOOGLE_MODELS.GEMMA_4_26B_A4B,
    OLLAMA_MODELS.GEMMA_4_26B_A4B,
    OLLAMA_MODELS.QWEN_3_5_122B,
    OLLAMA_MODELS.QWEN_3_6_35B,
    OLLAMA_MODELS.GEMMA_4_E2B,
    OLLAMA_MODELS.QWEN_3_5_27B,
    GOOGLE_MODELS.GEMMA_4_31B,
  ],
  // Aspirational cloud chain — preserved for future endpoints; no caller today.
  cloud: [
    ANTHROPIC_MODELS.CLAUDE_3_7_SONNET,
    ANTHROPIC_MODELS.CLAUDE_3_5_SONNET,
    OPENAI_MODELS.GPT_4_5_PREVIEW,
    OPENAI_MODELS.GPT_4O,
    OPENAI_MODELS.GPT_4O_MINI,
    GOOGLE_MODELS.GEMINI_3_1_FLASH_LITE,
    GOOGLE_MODELS.GEMMA_4_31B,
    GOOGLE_MODELS.GEMMA_4_26B_A4B,
    CLOUDFLARE_MODELS.MISTRAL_7B,
  ],
});
