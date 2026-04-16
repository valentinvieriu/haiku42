import { parseOpenAIStream } from './streamParser.js';

export const GROQ_MODELS = Object.freeze({
  LLAMA_3_3_70B: 'llama-3.3-70b-versatile',
  LLAMA_3_1_70B: 'llama-3.1-70b-versatile',
  LLAMA_3_1_8B: 'llama-3.1-8b-instant',
  DEEPSEEK_R1_LLAMA_70B: 'deepseek-r1-distill-llama-70b',
  DEEPSEEK_R1_QWEN_32B: 'deepseek-r1-distill-qwen-32b',
  QWEN_QWQ_32B: 'qwen-qwq-32b',
  QWEN_2_5_32B: 'qwen-2.5-32b',
  MISTRAL_SABA_24B: 'mistral-saba-24b',
  LLAMA_4_SCOUT: 'meta-llama/llama-4-scout-17b-16e-instruct',
});

export default class GroqProvider {
  static providerName = 'groq';
  static models = Object.values(GROQ_MODELS);

  constructor(env, model = GROQ_MODELS.LLAMA_3_3_70B) {
    this.env = env;
    this.model = model;
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  }

  async run(chat) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.env.GROQ_API_KEY}`,
    };
    const body = JSON.stringify({
      model: this.model,
      messages: chat.messages,
    //   response_format: { type: 'json_object' },
      stream: false,
      n: 1,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.7,
    });

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers,
        body,
      });
      const data = await response.json();
      console.log('GroqProvider Response:', data);
      return data?.choices[0]?.message?.content;
    } catch (error) {
      console.error(`Error in GroqProvider.run: ${error.message}`);
      throw error;
    }
  }

  async *runStream(chat) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.env.GROQ_API_KEY}`,
    };
    const body = JSON.stringify({
      model: this.model,
      messages: chat.messages,
      stream: true,
      n: 1,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.7,
    });

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`Groq stream error: ${response.status} ${response.statusText}`);
    }

    yield* parseOpenAIStream(response);
  }
}
