export const ANTHROPIC_MODELS = Object.freeze({
  CLAUDE_3_7_SONNET: 'claude-3-7-sonnet-20250219',
  CLAUDE_3_5_SONNET: 'claude-3-5-sonnet-20241022',
});

export default class AnthropicProvider {
  static providerName = 'anthropic';
  static models = Object.values(ANTHROPIC_MODELS);

  constructor(env, model = ANTHROPIC_MODELS.CLAUDE_3_7_SONNET) {
    this.env = env;
    this.model = model;
    this.apiUrl = 'https://api.anthropic.com/v1/messages';
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
      temperature: 0.8,
      max_tokens: 2048,
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
      console.error(`Error in AnthropicProvider.run: ${error.message}`);
      throw error;
    }
  }
}
