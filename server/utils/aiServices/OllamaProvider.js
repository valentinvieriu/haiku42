import { parseOpenAIStream } from './streamParser.js';

export const OLLAMA_MODELS = Object.freeze({
  GEMMA_4_26B_A4B: 'gemma4:26b-a4b-it-q8_0',
  QWEN_3_5_122B: 'qwen3.5:122b-a10b-q4_K_M',
  GEMMA_4_E2B: 'gemma4:e2b-it-q8_0',
  QWEN_3_5_27B: 'qwen3.5:27b-mxfp8',
  GEMMA_4_26B_MXFP8: 'gemma4:26b-mxfp8',
  GEMMA_4_31B_MXFP8: 'gemma4:31b-mxfp8',
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

  async run(chat) {
    const body = JSON.stringify({
      model: this.model,
      messages: chat.messages,
      stream: false,
      temperature: 0.7,
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
      reasoning_effort: 'low',
      max_tokens: 8192,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0.6,
      presence_penalty: 0.3,
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
