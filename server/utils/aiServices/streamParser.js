/**
 * Parses an OpenAI-compatible streaming response into typed events.
 * Handles both inline <think> tags and separate reasoning_content fields.
 *
 * @param {Response} response - fetch Response with streaming body
 * @yields {{ type: 'thinking' | 'content' | 'done', text?: string }}
 */
export async function* parseOpenAIStream(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let insideThink = false;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process complete SSE lines (each ends with \n)
      const lines = buffer.split('\n');
      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue; // skip empty lines and comments

        if (!trimmed.startsWith('data: ')) continue;
        const payload = trimmed.slice(6); // remove "data: "

        if (payload === '[DONE]') {
          yield { type: 'done' };
          return;
        }

        let parsed;
        try {
          parsed = JSON.parse(payload);
        } catch {
          continue; // skip malformed JSON
        }

        const delta = parsed.choices?.[0]?.delta;
        if (!delta) continue;

        // Pattern B: separate reasoning field (Ollama uses "reasoning", others may use "reasoning_content")
        const reasoning = delta.reasoning || delta.reasoning_content;
        if (reasoning) {
          yield { type: 'thinking', text: reasoning };
          continue;
        }

        const content = delta.content;
        if (content == null || content === '') continue;

        // Pattern A: inline <think> tags
        const events = classifyContent(content, insideThink);
        for (const evt of events) {
          if (evt.newState !== undefined) insideThink = evt.newState;
          if (evt.text) {
            yield { type: evt.type, text: evt.text };
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// Models bracket their reasoning with different tag families. We treat each
// pair symmetrically: anything between an opener and its matching closer is
// thinking. (Qwen uses <think>; Gemma 4 uses <thought>.)
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

/**
 * Splits a content chunk around <think>…</think> or <thought>…</thought>
 * boundaries. Returns an array of events with optional state transitions.
 */
function classifyContent(content, insideThink) {
  const events = [];
  let remaining = content;
  let currentlyThinking = insideThink;
  const openTags = THINK_TAG_PAIRS.map((p) => p.open);
  const closeTags = THINK_TAG_PAIRS.map((p) => p.close);

  while (remaining.length > 0) {
    if (currentlyThinking) {
      // Match whichever close tag appears first — we only have one
      // outstanding thinking block at a time, so the earliest closer wins.
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
