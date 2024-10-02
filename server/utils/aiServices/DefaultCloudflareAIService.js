// import Ai from 'path-to-ai-library'; // Adjust import as necessary

export default class DefaultCloudflareAIService {
  constructor(env) {
    this.env = env;
  }

  async run(chat) {
    const ai = new Ai(this.env.AI);
    let { response } = await this.env.AI.run('@cf/mistral/mistral-7b-instruct-v0.1', chat);
    if (typeof response !== 'string') {
      response = JSON.stringify(response);
    }
    return JSON.parse(response);
  }
}