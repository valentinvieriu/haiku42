import { fetchLexicaImage } from '../utils/lexica';
import { sendRedirect } from 'h3';
import { decompressHaiku } from '../utils/compression';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (!query.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing haiku ID in query',
    });
  }

  try {
    const haiku = decompressHaiku(query.id);

    const imageId = await fetchLexicaImage(haiku);
    const imageUrl = `https://image.lexica.art/full_jpg/${imageId}`;

    // Set cache headers
    event.node.res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    
    // Redirect to the actual image URL
    return sendRedirect(event, imageUrl, 302);
  } catch (error) {
    console.error('Error fetching Lexica image:', error.message);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching haiku image',
      message: error.message,
    });
  }
});