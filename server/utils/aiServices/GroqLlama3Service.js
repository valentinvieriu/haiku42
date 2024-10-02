export default class GroqLlama3Service {
  constructor(env, modelName) {
    this.env = env;
    this.modelName = modelName;
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  }

  async run(chat) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.env.GROQ_API_KEY}`,
    };
    const body = JSON.stringify({
      model: this.modelName,
      messages: chat.messages,
      response_format: { type: 'json_object' },
      stream: false,
      n: 1,
      temperature: 0.7,
      max_tokens: 180,
      top_p: 0.7,
    });

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers,
        body,
      });
      const data = await response.json();
      console.log('GroqLlama3Service Response:', data);
      return data?.choices[0]?.message?.content;
    } catch (error) {
      console.error(`Error in GroqLlama3Service.run: ${error.message}`);
      throw error;
    }
  }
}