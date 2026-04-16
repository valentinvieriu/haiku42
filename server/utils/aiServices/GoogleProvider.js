import { parseOpenAIStream } from './streamParser.js';

export const GOOGLE_MODELS = Object.freeze({
  GEMMA_4_26B_A4B: 'gemma-4-26b-a4b-it',
  GEMMA_4_31B: 'gemma-4-31b-it',
  GEMINI_3_1_FLASH_LITE: 'gemini-3.1-flash-lite-preview',
});

// Both Gemma 4 and Gemini 3.x emit reasoning as inline <thought>…</thought>
// blocks (with extra_content.google.thought=true on the chunks). The shared
// streamParser routes those tags to the "thinking" channel, so this config
// just turns the heat up — high reasoning depth, summaries included.
const THINKING_CONFIG = Object.freeze({
  extra_body: {
    google: {
      thinking_config: {
        thinking_level: 'high',
        include_thoughts: true,
      },
    },
  },
});

// High thinking_level produces long thought blocks, especially on Gemma 26B.
// 8192 leaves enough headroom for both the reasoning and the trailing
// ```json``` answer.
const MAX_TOKENS = 8192;

export default class GoogleProvider {
  static providerName = 'google';
  static models = Object.values(GOOGLE_MODELS);

  constructor(env, model = GOOGLE_MODELS.GEMMA_4_26B_A4B) {
    this.env = env;
    this.model = model;
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
  }

  #headers() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.env.GEMINI_API_KEY}`,
    };
  }

  #body(messages, { stream }) {
    return JSON.stringify({
      model: this.model,
      messages,
      stream,
      n: 1,
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: MAX_TOKENS,
      ...THINKING_CONFIG,
    });
  }

  async run(chat) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: this.#headers(),
        body: this.#body(chat.messages, { stream: false }),
      });
      const data = await response.json();
      console.log(`${this.model} Response:`, data);
      return data?.choices?.[0]?.message?.content;
    } catch (error) {
      console.error(`Error in GoogleProvider.run: ${error.message}`);
      throw error;
    }
  }

  async *runStream(chat) {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: this.#headers(),
      body: this.#body(chat.messages, { stream: true }),
    });

    if (!response.ok) {
      throw new Error(`Google stream error: ${response.status} ${response.statusText}`);
    }

    yield* parseOpenAIStream(response);
  }
}
