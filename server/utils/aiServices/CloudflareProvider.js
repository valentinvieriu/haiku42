export const CLOUDFLARE_MODELS = Object.freeze({
  MISTRAL_7B: '@cf/mistral/mistral-7b-instruct-v0.1',
});

export default class CloudflareProvider {
  static providerName = 'cloudflare';
  static models = Object.values(CLOUDFLARE_MODELS);

  constructor(env, model = CLOUDFLARE_MODELS.MISTRAL_7B) {
    this.env = env;
    this.model = model;
  }

  async run(chat) {
    try {
      const response = await this.env.AI.run(this.model, {
        messages: chat.messages,
        max_tokens: 1024,
        temperature: 0.7,
      });

      if (typeof response === 'string') {
        return JSON.parse(response);
      }
      return response;
    } catch (error) {
      console.error('Error in CloudflareProvider:', error);
      throw error;
    }
  }
}
