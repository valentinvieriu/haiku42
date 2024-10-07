import { fetchLexicaImage } from '../utils/lexica';
import { sendStream } from 'h3';
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
    console.log('Lexica query:', `${haiku.topic}    ${haiku.firstLine}    ${haiku.secondLine}    ${haiku.thirdLine}`);
    const imageId = await fetchLexicaImage(haiku, haiku.topic);
    const imageUrl = `https://image.lexica.art/full_jpg/${imageId}`;

    // Revert cache headers to allow caching for 1 day
    event.node.res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day

    // Fetch the image without awaiting the entire response
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Stream the image to the client as it downloads
    return sendStream(event, response.body, response.headers.get('Content-Type'));
  } catch (error) {
    console.error('Error fetching Lexica image:', error.message);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching haiku image',
      message: error.message,
    });
  }
});