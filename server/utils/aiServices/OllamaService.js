import { parseOpenAIStream } from './streamParser.js';

export default class OllamaService {
  constructor(env, modelName) {
    this.env = env;
    this.modelName = modelName;
    const baseUrl = env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.apiUrl = `${baseUrl}/v1/chat/completions`;
  }

  async run(chat) {
    const body = JSON.stringify({
      model: this.modelName,
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
      console.log('OllamaService Response:', data);
      return data?.choices?.[0]?.message?.content;
    } catch (error) {
      console.error(`Error in OllamaService.run: ${error.message}`);
      throw error;
    }
  }

  async *runStream(chat) {
    const isQwen = this.modelName.startsWith('qwen');

    // Calibration results (2026-04-15):
    // - Thinking doesn't improve syllable accuracy for either model
    // - Qwen 3.5 thinking >120s even at "low" — unusable
    // - Gemma4 "low" thinking ~5s with simple prompts but >60s with full haiku prompt
    // - Best approach: reasoning "none" for speed, streaming still prevents timeouts
    // - Gemma no-think: ~1s, Qwen no-think: ~7s
    const body = JSON.stringify({
      model: this.modelName,
      messages: chat.messages,
      stream: true,
      reasoning_effort: 'none',
      max_tokens: 2048,
      temperature: 0.7,
      top_p: 0.95,
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
