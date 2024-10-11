export default class ClaudeService {
  constructor(env, model = 'claude-3-5-sonnet-20240620') {
    this.env = env;
    this.model = model;
    this.apiUrl = 'https://gateway.ai.cloudflare.com/v1/b704c2550c9082fb06e9796e7c042412/haiku42/anthropic/v1/messages';
  }

  async run(chat) {
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': this.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    };
    const body = JSON.stringify({
      model: this.model,
      messages: [chat.messages[1]],
      system: chat.messages[0].content,
      stream: false,
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
      console.log(`${this.model} Response:`, data);
      return data?.content[0]?.text;
    } catch (error) {
      console.error(`Error in ClaudeService.run: ${error.message}`);
      throw error;
    }
  }
}