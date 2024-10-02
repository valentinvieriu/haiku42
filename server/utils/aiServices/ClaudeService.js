export default class ClaudeService {
  constructor(env) {
    this.env = env;
    this.apiUrl = 'https://api.anthropic.com/v1/messages';
  }

  async run(chat) {
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': this.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    };
    const body = JSON.stringify({
      model: 'claude-3-5-sonnet-20240620',
      messages: [chat.messages[1]],
      system: chat.messages[0].content,
      stream: false,
      temperature: 0.7,
      max_tokens: 100,
      top_p: 0.7,
    });

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers,
        body,
      });
      const data = await response.json();
      console.log('ClaudeService Response:', data);
      return data?.content[0]?.text;
    } catch (error) {
      console.error(`Error in ClaudeService.run: ${error.message}`);
      throw error;
    }
  }
}