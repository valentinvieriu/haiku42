import { fetchLexicaImage } from '../utils/lexica';
import { sendStream } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body || !body.haiku) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing haiku in request body',
    });
  }

  try {
    const imageId = await fetchLexicaImage(body.haiku);
    const imageUrl = `https://image.lexica.art/full_jpg/${imageId}`;
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image from Lexica: ${imageResponse.statusText}`);
    }

    const cacheControl = 'public, max-age=86400'; // Cache for 1 day
    event.node.res.setHeader('Cache-Control', cacheControl);
    event.node.res.setHeader('Content-Type', 'image/jpeg');

    return sendStream(event, imageResponse.body);
  } catch (error) {
    console.error('Error fetching Lexica image:', error.message);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching haiku image',
      message: error.message,
    });
  }
});