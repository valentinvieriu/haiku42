import { createEventStream } from 'h3';
import { generateHaikuStreaming } from '../utils/haikuGenerator';
import { compressHaiku } from '../utils/compression';

const models = ['qwen3.5:122b-a10b-q4_K_M','gemma4:e2b-it-q8_0','qwen3.5:27b-mxfp8',  ];

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { cloudflare } = event.context;

  const eventStream = createEventStream(event);

  // Flush headers immediately so the browser establishes the SSE connection
  // before the potentially slow model starts loading
  eventStream.push({ data: JSON.stringify({ type: 'connected' }) });

  generateHaikuStreaming(cloudflare.env, query, models, {
    onThinking: async (text) => {
      await eventStream.push({ data: JSON.stringify({ type: 'thinking', text }) });
    },
    onContent: async (text) => {
      await eventStream.push({ data: JSON.stringify({ type: 'content', text }) });
    },
    onComplete: async (haiku) => {
      const haikuId = compressHaiku(haiku) ?? 'default-haiku-id';
      await eventStream.push({ data: JSON.stringify({ type: 'complete', id: haikuId }) });
      await eventStream.close();
    },
    onError: async (error) => {
      await eventStream.push({ data: JSON.stringify({ type: 'error', message: error.message }) });
      await eventStream.close();
    },
  }).catch(async (err) => {
    console.error('Haiku stream error:', err);
    await eventStream.push({ data: JSON.stringify({ type: 'error', message: err.message }) });
    await eventStream.close();
  });

  return eventStream.send();
});
