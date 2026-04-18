import { parseOpenAIStream } from './streamParser.js';

export const OLLAMA_MODELS = Object.freeze({
  QWEN_3_5_122B: 'qwen3.5:122b-a10b-q4_K_M',
  QWEN_3_6_35B: 'qwen3.6:35b-a3b-mxfp8',
  QWEN_3_5_27B: 'qwen3.5:27b-mxfp8',
  GEMMA_4_26B_A4B: 'gemma4:26b-a4b-it-q8_0',
  GEMMA_4_26B_MXFP8: 'gemma4:26b-mxfp8',
  GEMMA_4_31B_MXFP8: 'gemma4:31b-mxfp8',
  GEMMA_4_E2B: 'gemma4:e2b-it-q8_0',
});

// Qwen 3.x thinking-mode general-task preset from the official model cards.
// repeat_penalty pinned to 1.0 to override Ollama's default 1.1 (Qwen's own
// guidance) and let presence_penalty do the anti-repetition work.
const QWEN_SAMPLING = Object.freeze({
  temperature: 1.0,
  top_p: 0.95,
  top_k: 20,
  min_p: 0,
  presence_penalty: 1.5,
  repeat_penalty: 1.0,
  reasoning_effort: 'low',
});

const DEFAULT_SAMPLING = Object.freeze({
  temperature: 0.7,
  top_p: 0.95,
  reasoning_effort: 'low',
});

const SAMPLING_CONFIG = Object.freeze({
  [OLLAMA_MODELS.QWEN_3_6_35B]: QWEN_SAMPLING,
  [OLLAMA_MODELS.QWEN_3_5_122B]: QWEN_SAMPLING,
  [OLLAMA_MODELS.QWEN_3_5_27B]: QWEN_SAMPLING,
});

export default class OllamaProvider {
  static providerName = 'ollama';
  static models = Object.values(OLLAMA_MODELS);

  constructor(env, model = OLLAMA_MODELS.GEMMA_4_26B_A4B) {
    this.env = env;
    this.model = model;
    const baseUrl = env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.apiUrl = `${baseUrl}/v1/chat/completions`;
  }

  #sampling() {
    return SAMPLING_CONFIG[this.model] ?? DEFAULT_SAMPLING;
  }

  async run(chat) {
    const body = JSON.stringify({
      model: this.model,
      messages: chat.messages,
      stream: false,
      ...this.#sampling(),
    });

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: AbortSignal.timeout(10 * 60 * 1000),
      });
      const data = await response.json();
      console.log('OllamaProvider Response:', data);
      return data?.choices?.[0]?.message?.content;
    } catch (error) {
      console.error(`Error in OllamaProvider.run: ${error.message}`);
      throw error;
    }
  }

  async *runStream(chat) {
    // Use native thinking mode — reasoning happens in separate thinking tokens,
    // content stream outputs only JSON. Thinking tokens stream to the UI.
    const body = JSON.stringify({
      model: this.model,
      messages: chat.messages,
      stream: true,
      max_tokens: 8192,
      ...this.#sampling(),
      format: {
        type: 'object',
        properties: {
          topic: { type: 'string', description: 'brief scene label' },
          firstLine: { type: 'string', description: 'first line, 5 syllables' },
          secondLine: { type: 'string', description: 'second line, 7 syllables' },
          thirdLine: { type: 'string', description: 'third line, 5 syllables' },
          imagePrompt: { type: 'string', description: 'visible scene elements only, literal and concise' },
        },
        required: ['topic', 'firstLine', 'secondLine', 'thirdLine', 'imagePrompt'],
      },
    });

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: AbortSignal.timeout(10 * 60 * 1000),
    });

    if (!response.ok) {
      throw new Error(`Ollama stream error: ${response.status} ${response.statusText}`);
    }

    yield* parseOpenAIStream(response);
  }
}
