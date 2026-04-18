export const GOOGLE_MODELS = Object.freeze({
  GEMMA_4_26B_A4B: 'gemma-4-26b-a4b-it',
  GEMMA_4_31B: 'gemma-4-31b-it',
});

// Per-model capabilities on the native Gemini API. Gemma doesn't accept
// responseJsonSchema or thinkingConfig (Gemini-family features); for Gemma we
// elicit JSON via prompt + responseMimeType, and elicit thinking via inline
// <thought>…</thought> tags that the parser routes to the thinking channel.
const FEATURES = Object.freeze({
  [GOOGLE_MODELS.GEMMA_4_26B_A4B]: Object.freeze({
    systemInstruction: true,
    jsonSchema: false,
    thinkingConfig: false,
  }),
  [GOOGLE_MODELS.GEMMA_4_31B]: Object.freeze({
    systemInstruction: true,
    jsonSchema: false,
    thinkingConfig: false,
  }),
});

// Tuned against the live API. Gemma 26B improved with a warmer/tighter decode,
// 31B stayed on the safer default because its latency spiked sharply hotter.
// topK returns here — native Gemini honours it where OpenAI-compat dropped it.
const SAMPLING_CONFIG = Object.freeze({
  [GOOGLE_MODELS.GEMMA_4_26B_A4B]: Object.freeze({
    temperature: 1.1,
    topP: 0.9,
    topK: 64,
  }),
  [GOOGLE_MODELS.GEMMA_4_31B]: Object.freeze({
    temperature: 1.0,
    topP: 0.95,
    topK: 64,
  }),
});

const MAX_OUTPUT_TOKENS = 8192;

const JSON_SCHEMA = Object.freeze({
  type: 'object',
  properties: {
    topic: { type: 'string' },
    firstLine: { type: 'string' },
    secondLine: { type: 'string' },
    thirdLine: { type: 'string' },
    imagePrompt: { type: 'string' },
  },
  required: ['topic', 'firstLine', 'secondLine', 'thirdLine', 'imagePrompt'],
});

// Gemma doesn't emit native thought parts, so elicit reasoning via the tag
// convention it was trained on and let the inline splitter route it.
const GEMMA_THINKING_SCAFFOLD =
  'Before the JSON answer, emit your full reasoning pass wrapped in <thought>…</thought> tags. ' +
  'Walk through every step of the reasoning shape — don\'t compress or skip any.';

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export default class GoogleProvider {
  static providerName = 'google';
  static models = Object.values(GOOGLE_MODELS);

  constructor(env, model = GOOGLE_MODELS.GEMMA_4_26B_A4B) {
    this.env = env;
    this.model = model;
  }

  #features() {
    return FEATURES[this.model] ?? FEATURES[GOOGLE_MODELS.GEMMA_4_26B_A4B];
  }

  #endpoint(stream) {
    const method = stream ? 'streamGenerateContent' : 'generateContent';
    const suffix = stream ? '&alt=sse' : '';
    return `${BASE_URL}/${this.model}:${method}?key=${this.env.GEMINI_API_KEY}${suffix}`;
  }

  // OpenAI-shape messages -> { systemInstruction, contents }. If the model
  // doesn't support systemInstruction (or we want to inject scaffolding), the
  // system content is prepended to the first user turn instead.
  #toNative(messages) {
    const features = this.#features();
    const systemParts = messages.filter((m) => m.role === 'system').map((m) => m.content);

    // Gemma needs inline thinking scaffolding because thinkingConfig is a no-op.
    if (!features.thinkingConfig) systemParts.push(GEMMA_THINKING_SCAFFOLD);

    const systemText = systemParts.join('\n\n');
    const turns = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    if (features.systemInstruction && systemText) {
      return {
        systemInstruction: { parts: [{ text: systemText }] },
        contents: turns,
      };
    }

    // Fallback: prepend system text into the first user turn.
    if (systemText && turns.length > 0 && turns[0].role === 'user') {
      turns[0] = {
        role: 'user',
        parts: [{ text: `${systemText}\n\n${turns[0].parts[0].text}` }],
      };
    }
    return { contents: turns };
  }

  #body(messages) {
    const features = this.#features();
    const sampling = SAMPLING_CONFIG[this.model] ?? SAMPLING_CONFIG[GOOGLE_MODELS.GEMMA_4_26B_A4B];
    const { systemInstruction, contents } = this.#toNative(messages);

    const generationConfig = {
      ...sampling,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    };

    // JSON mode conflicts with tag-based thinking: if the model must emit
    // strict JSON it can't also prepend <thought>…</thought>. Tie mime and
    // schema to the same flag, off for Gemma (prompt + sanitizeResponse).
    if (features.jsonSchema) {
      generationConfig.responseMimeType = 'application/json';
      generationConfig.responseJsonSchema = JSON_SCHEMA;
    }
    if (features.thinkingConfig) {
      generationConfig.thinkingConfig = { includeThoughts: true, thinkingLevel: 'high' };
    }

    return JSON.stringify({
      ...(systemInstruction ? { systemInstruction } : {}),
      contents,
      generationConfig,
    });
  }

  async run(chat) {
    try {
      const response = await fetch(this.#endpoint(false), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: this.#body(chat.messages),
      });
      const data = await response.json();
      console.log(`${this.model} Response:`, data);
      const parts = data?.candidates?.[0]?.content?.parts ?? [];
      return parts
        .filter((p) => p.thought !== true)
        .map((p) => p.text ?? '')
        .join('');
    } catch (error) {
      console.error(`Error in GoogleProvider.run: ${error.message}`);
      throw error;
    }
  }

  async *runStream(chat) {
    const response = await fetch(this.#endpoint(true), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: this.#body(chat.messages),
    });

    if (!response.ok) {
      throw new Error(`Google stream error: ${response.status} ${response.statusText}`);
    }

    const useTagFallback = !this.#features().thinkingConfig;
    yield* parseGeminiStream(response, { useTagFallback });
  }
}

// SSE stream of GenerateContentResponse chunks. Each part may carry a
// thought:true marker (Gemini with includeThoughts) or, for Gemma, inline
// <thought>…</thought> tags that we split out via classifyContent.
async function* parseGeminiStream(response, { useTagFallback }) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let insideThink = false;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue;
        if (!trimmed.startsWith('data: ')) continue;

        const payload = trimmed.slice(6);
        if (payload === '[DONE]') {
          yield { type: 'done' };
          return;
        }

        let parsed;
        try {
          parsed = JSON.parse(payload);
        } catch {
          continue;
        }

        const candidate = parsed?.candidates?.[0];
        const parts = candidate?.content?.parts ?? [];

        for (const part of parts) {
          const text = part?.text;
          if (!text) continue;

          if (part.thought === true) {
            yield { type: 'thinking', text };
            continue;
          }

          if (useTagFallback) {
            const events = classifyContent(text, insideThink);
            for (const evt of events) {
              if (evt.newState !== undefined) insideThink = evt.newState;
              if (evt.text) yield { type: evt.type, text: evt.text };
            }
          } else {
            yield { type: 'content', text };
          }
        }

        if (candidate?.finishReason) {
          yield { type: 'done' };
          return;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// Gemma brackets reasoning with <thought>…</thought>. We also accept <think>…
// </think> for safety; the state persists across chunks via insideThink.
const THINK_TAG_PAIRS = [
  { open: '<think>', close: '</think>' },
  { open: '<thought>', close: '</thought>' },
];

function findEarliest(text, needles) {
  let best = { idx: -1, needle: null };
  for (const needle of needles) {
    const idx = text.indexOf(needle);
    if (idx !== -1 && (best.idx === -1 || idx < best.idx)) {
      best = { idx, needle };
    }
  }
  return best;
}

function classifyContent(content, insideThink) {
  const events = [];
  let remaining = content;
  let currentlyThinking = insideThink;
  const openTags = THINK_TAG_PAIRS.map((p) => p.open);
  const closeTags = THINK_TAG_PAIRS.map((p) => p.close);

  while (remaining.length > 0) {
    if (currentlyThinking) {
      const { idx: closeIdx, needle: closeTag } = findEarliest(remaining, closeTags);
      if (closeIdx === -1) {
        events.push({ type: 'thinking', text: remaining });
        remaining = '';
      } else {
        const thinkText = remaining.slice(0, closeIdx);
        if (thinkText) events.push({ type: 'thinking', text: thinkText });
        events.push({ newState: false });
        currentlyThinking = false;
        remaining = remaining.slice(closeIdx + closeTag.length);
      }
    } else {
      const { idx: openIdx, needle: openTag } = findEarliest(remaining, openTags);
      if (openIdx === -1) {
        events.push({ type: 'content', text: remaining });
        remaining = '';
      } else {
        const contentText = remaining.slice(0, openIdx);
        if (contentText) events.push({ type: 'content', text: contentText });
        events.push({ newState: true });
        currentlyThinking = true;
        remaining = remaining.slice(openIdx + openTag.length);
      }
    }
  }

  return events;
}
