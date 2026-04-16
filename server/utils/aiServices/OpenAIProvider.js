export const OPENAI_MODELS = Object.freeze({
  GPT_4_5_PREVIEW: 'gpt-4.5-preview',
  GPT_4O: 'gpt-4o',
  GPT_4O_MINI: 'gpt-4o-mini',
});

export default class OpenAIProvider {
  static providerName = 'openai';
  static models = Object.values(OPENAI_MODELS);

  constructor(env, model = OPENAI_MODELS.GPT_4_5_PREVIEW) {
    this.env = env;
    this.model = model;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async run(chat) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.env.OPENAI_API_KEY}`,
    };
    const body = JSON.stringify({
      model: this.model,
      messages: chat.messages,
      stream: false,
      n: 1,
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 0.8,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
    });

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers,
        body,
      });
      const data = await response.json();
      console.log(`${this.model} Response:`, data);
      return data?.choices?.[0]?.message?.content ?? '';
    } catch (error) {
      console.error(`Error in OpenAIProvider.run: ${error.message}`);
      throw error;
    }
  }
}
