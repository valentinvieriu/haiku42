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
    // Use native thinking mode — reasoning happens in separate thinking tokens,
    // content stream outputs only JSON. Thinking tokens stream to the UI.
    const body = JSON.stringify({
      model: this.modelName,
      messages: chat.messages,
      stream: true,
      reasoning_effort: 'low',
      max_tokens: 2048,
      temperature: 0.7,
      top_p: 0.95,
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
