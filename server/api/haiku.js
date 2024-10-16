import { generateHaiku } from '../utils/haikuGenerator';
import { compressHaiku, decompressHaiku } from '../utils/compression';

// Define the models array at the top of the file
const models = ['llama-3.1-70b-versatile','llama-3.2-11b-text-preview','gemma2-9b-it','llama-3.1-8b-instant'];

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { cloudflare } = event.context;

  // Handle GET requests (fetching existing haiku)
  if (event.node.req.method === 'GET' && query.id) {
    try {
      const haiku = decompressHaiku(query.id);

      // Set cache headers
      event.node.res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day

      // Return haiku
      return haiku;
    } catch (error) {
      console.error('Error processing haiku ID:', error);

      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid haiku data',
        message: 'The haiku data could not be processed.',
      });
    }
  }

  // Handle POST requests (generating new haiku)
  if (event.node.req.method === 'POST') {
    try {
      const haiku = await generateHaiku(cloudflare.env, query, models);

      if (!haiku) {
        throw new Error('Generated haiku is undefined');
      }

      // Compress the haiku data
      const haikuId = compressHaiku(haiku) ?? 'default-haiku-id';

      // Return only the id for redirection
      return { id: haikuId };
    } catch (error) {
      console.error('Error generating haiku:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Error generating haiku',
        message: error.message ?? 'Unknown error',
      });
    }
  }

  // If neither GET with id nor POST, return method not allowed
  throw createError({
    statusCode: 405,
    statusMessage: 'Method Not Allowed',
    message: 'Only GET with id and POST methods are allowed.',
  });
});
