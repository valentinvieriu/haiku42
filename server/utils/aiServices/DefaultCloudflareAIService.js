export default class DefaultCloudflareAIService {
  constructor(env) {
    this.env = env;
  }

  async run(chat) {
    try {
      const response = await this.env.AI.run('@cf/mistral/mistral-7b-instruct-v0.1', {
        messages: chat.messages,
        max_tokens: 1024,
        temperature: 0.7,
      });

      if (typeof response === 'string') {
        return JSON.parse(response);
      }
      return response;
    } catch (error) {
      console.error('Error in DefaultCloudflareAIService:', error);
      throw error;
    }
  }
}