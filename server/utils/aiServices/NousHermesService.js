// import Ai from 'path-to-ai-library'; // Adjust import as necessary

export default class NousHermesService {
  constructor(env) {
    this.env = env;
  }

  async run(chat) {
    const ai = new Ai(this.env.AI);
    let { response } = await this.env.AI.run('@hf/thebloke/openhermes-2.5-mistral-7b-awq', chat);
    if (typeof response !== 'string') {
      response = JSON.stringify(response);
    }
    return JSON.parse(response);
  }
}