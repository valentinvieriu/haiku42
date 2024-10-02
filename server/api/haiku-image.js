import { fetchLexicaImage } from '../utils/lexica';
import { sendRedirect } from 'h3';
import pako from 'pako';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (!query.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing haiku ID in query',
    });
  }

  try {
    // Decode and decompress the haiku ID
    const base64 = query.id.replace(/-/g, '+').replace(/_/g, '/').padEnd(query.id.length + (4 - query.id.length % 4) % 4, '=');
    const compressed = Buffer.from(base64, 'base64');
    const decompressed = pako.inflate(compressed, { to: 'string' });
    const haiku = JSON.parse(decompressed);

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