export default class GPT4oMiniService {
  constructor(env) {
    this.env = env;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async run(chat) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.env.OPENAI_API_KEY}`,
    };
    const body = JSON.stringify({
      model: 'gpt-4o-mini',
      messages: chat.messages,
      stream: false,
      n: 1,
      temperature: 2,
      max_tokens: 64,
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
      console.log('GPT-4o-mini Response:', data);
      return data?.choices[0]?.message?.content;
    } catch (error) {
      console.error(`Error in GPT4oMiniService.run: ${error.message}`);
      throw error;
    }
  }
}