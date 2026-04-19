export const OLLAMA_MODELS = Object.freeze({
  QWEN_3_5_122B: 'qwen3.5:122b-a10b-q4_K_M',
  QWEN_3_6_35B: 'qwen3.6:35b-a3b-mxfp8',
  QWEN_3_5_27B: 'qwen3.5:27b-mxfp8',
  GEMMA_4_26B_A4B: 'gemma4:26b-a4b-it-q8_0',
  GEMMA_4_26B_MXFP8: 'gemma4:26b-mxfp8',
  GEMMA_4_31B_MXFP8: 'gemma4:31b-mxfp8',
  GEMMA_4_E2B: 'gemma4:e2b-it-q8_0',
});

// Qwen 3.x thinking-mode general-task preset from the official model cards.
// repeat_penalty pinned to 1.0 to override Ollama's default 1.1 (Qwen's own
// guidance) and let presence_penalty do the anti-repetition work.
const QWEN_SAMPLING = Object.freeze({
  temperature: 1.0,
  top_p: 0.95,
  top_k: 20,
  min_p: 0,
  presence_penalty: 1.5,
  repeat_penalty: 1.0,
});

const DEFAULT_SAMPLING = Object.freeze({
  temperature: 0.7,
  top_p: 0.95,
});

const SAMPLING_CONFIG = Object.freeze({
  [OLLAMA_MODELS.QWEN_3_6_35B]: QWEN_SAMPLING,
  [OLLAMA_MODELS.QWEN_3_5_122B]: QWEN_SAMPLING,
  [OLLAMA_MODELS.QWEN_3_5_27B]: QWEN_SAMPLING,
});

// Per-model capability map. Qwen pairs native thinking with schema cleanly.
// Gemma on Ollama rambles when both think:true and format:schema are set —
// the model loops trying to satisfy the schema from inside thinking. For
// Gemma we keep thinking and drop the schema, then let sanitizeResponse
// parse JSON out of free content (same path as Google Gemma).
const FEATURES = Object.freeze({
  [OLLAMA_MODELS.QWEN_3_6_35B]:      { think: 'low', schema: true },
  [OLLAMA_MODELS.QWEN_3_5_122B]:     { think: 'low', schema: true },
  [OLLAMA_MODELS.QWEN_3_5_27B]:      { think: 'low', schema: true },
  [OLLAMA_MODELS.GEMMA_4_26B_A4B]:   { think: true,  schema: false },
  [OLLAMA_MODELS.GEMMA_4_26B_MXFP8]: { think: true,  schema: false },
  [OLLAMA_MODELS.GEMMA_4_31B_MXFP8]: { think: true,  schema: false },
  [OLLAMA_MODELS.GEMMA_4_E2B]:       { think: true,  schema: false },
});
const DEFAULT_FEATURES = Object.freeze({ think: false, schema: true });

const JSON_SCHEMA = Object.freeze({
  type: 'object',
  properties: {
    topic: { type: 'string', description: 'brief scene label' },
    firstLine: { type: 'string', description: 'first line, 5 syllables' },
    secondLine: { type: 'string', description: 'second line, 7 syllables' },
    thirdLine: { type: 'string', description: 'third line, 5 syllables' },
    imagePrompt: { type: 'string', description: 'visible scene elements only, literal and concise' },
  },
  required: ['topic', 'firstLine', 'secondLine', 'thirdLine', 'imagePrompt'],
});

export default class OllamaProvider {
  static providerName = 'ollama';
  static models = Object.values(OLLAMA_MODELS);

  constructor(env, model = OLLAMA_MODELS.GEMMA_4_26B_A4B) {
    this.env = env;
    this.model = model;
    const baseUrl = env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.apiUrl = `${baseUrl}/api/chat`;
  }

  #options() {
    return { ...(SAMPLING_CONFIG[this.model] ?? DEFAULT_SAMPLING), num_predict: 8192 };
  }

  #features() {
    return FEATURES[this.model] ?? DEFAULT_FEATURES;
  }

  async run(chat) {
    const features = this.#features();
    const body = JSON.stringify({
      model: this.model,
      messages: chat.messages,
      stream: false,
      think: false,
      ...(features.schema ? { format: JSON_SCHEMA } : {}),
      options: this.#options(),
    });

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: AbortSignal.timeout(10 * 60 * 1000),
    });
    const data = await response.json();
    console.log('OllamaProvider Response:', data);
    return data?.message?.content;
  }

  async *runStream(chat) {
    const features = this.#features();
    const body = JSON.stringify({
      model: this.model,
      messages: chat.messages,
      stream: true,
      think: features.think,
      ...(features.schema ? { format: JSON_SCHEMA } : {}),
      options: this.#options(),
    });

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: AbortSignal.timeout(10 * 60 * 1000),
    });

    if (!response.ok) {
      throw new Error(`Ollama stream error: ${response.status} ${response.statusText}`);
    }

    yield* parseNdjsonStream(response);
  }
}

// Ollama streams NDJSON: one JSON object per newline. Each chunk carries either
// a thinking delta (message.thinking) or a content delta (message.content);
// the final chunk has done: true and we yield a single 'done' event.
async function* parseNdjsonStream(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const dispatch = function* (line) {
    const trimmed = line.trim();
    if (!trimmed) return;
    let parsed;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      return;
    }

    const thinking = parsed?.message?.thinking;
    if (thinking) yield { type: 'thinking', text: thinking };

    const content = parsed?.message?.content;
    if (content) yield { type: 'content', text: content };

    if (parsed?.done === true) yield { type: 'done' };
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        for (const evt of dispatch(line)) {
          yield evt;
          if (evt.type === 'done') return;
        }
      }
    }

    // Ollama typically terminates each object with \n, but spec doesn't
    // guarantee a trailing newline. Flush whatever's left so we don't drop
    // the final (often done:true) object.
    if (buffer.trim()) {
      for (const evt of dispatch(buffer)) {
        yield evt;
        if (evt.type === 'done') return;
      }
    }
  } finally {
    reader.cancel().catch(() => {});
  }
}
