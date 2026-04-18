import { createEventStream } from 'h3';
import { generateHaikuStreaming } from '../utils/haikuGenerator';
import { compressHaiku } from '../utils/compression';
import { chains } from '../utils/aiServices';

export default defineEventHandler(async (event) => {
  const { cloudflare } = event.context;

  const eventStream = createEventStream(event);

  // Flush headers immediately so the browser establishes the SSE connection
  // before the potentially slow model starts loading
  eventStream.push({ data: JSON.stringify({ type: 'connected' }) });

  generateHaikuStreaming(cloudflare.env, chains.streaming, {
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
