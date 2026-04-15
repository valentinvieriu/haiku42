import { decompressHaiku } from '../utils/compression';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  if (!query.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing haiku ID',
      message: 'A haiku ID is required.',
    });
  }

  try {
    const haiku = decompressHaiku(query.id);

    // Set cache headers
    event.node.res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day

    return haiku;
  } catch (error) {
    console.error('Error processing haiku ID:', error);

    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid haiku data',
      message: 'The haiku data could not be processed.',
    });
  }
});
