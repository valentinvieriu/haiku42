export default class OllamaService {
  constructor(env, modelName) {
    this.env = env;
    this.modelName = modelName;
    const baseUrl = env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.apiUrl = `${baseUrl}/v1/chat/completions`;
  }

  async run(chat) {
    const headers = {
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify({
      model: this.modelName,
      messages: chat.messages,
      stream: false,
      temperature: 0.7,
    });

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers,
        body,
        signal: AbortSignal.timeout(10 * 60 * 1000),
      });
      const data = await response.json();
      console.log('OllamaService Response:', data);
      return data?.choices?.[0]?.message?.content;
    } catch (error) {
      console.error(`Error in OllamaService.run: ${error.message}`);
      throw error;
    }
  }
}
