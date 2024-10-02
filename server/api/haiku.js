import { generateHaiku } from '../utils/haikuGenerator';
import { fetchLexicaImage } from '../utils/lexica';
import { compressHaiku, decompressHaiku } from '../utils/compression';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { cloudflare } = event.context;

  // Handle GET requests (fetching existing haiku)
  if (event.node.req.method === 'GET' && query.id) {
    try {
      const haiku = decompressHaiku(query.id);

      // Fetch imageId
      const imageId = await fetchLexicaImage(haiku);
      const imageUrl = `https://image.lexica.art/full_jpg/${imageId}`;

      // Set cache headers
      event.node.res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day

      // Return haiku with imageUrl
      return { ...haiku, imageUrl };
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
      console.log('Generating new haiku with query:', query);
      console.log('Cloudflare env:', cloudflare.env);

      const haiku = await generateHaiku(cloudflare.env, query);

      if (!haiku) {
        throw new Error('Generated haiku is undefined');
      }

      console.log('Generated haiku:', haiku);

      // Compress the haiku data
      const haikuId = compressHaiku(haiku);

      console.log('Generated haikuId:', haikuId);

      // Return only the id for redirection
      return { id: haikuId };
    } catch (error) {
      console.error('Error generating haiku:', error);
      console.error('Error stack:', error.stack);
      throw createError({
        statusCode: 500,
        statusMessage: 'Error generating haiku',
        message: error.message,
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