export default class GPT4Service {
  constructor(env, model) {
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
      temperature: 2,
      max_tokens: 1024,
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
      return data?.choices[0]?.message?.content;
    } catch (error) {
      console.error(`Error in GPT4Service.run: ${error.message}`);
      throw error;
    }
  }
}