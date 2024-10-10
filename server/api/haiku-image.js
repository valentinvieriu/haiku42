import { sendStream } from 'h3';
import { decompressHaiku } from '../utils/compression';
import { getImageProvider } from '../utils/imageProviders';

// Helper function to fetch and stream image
const fetchAndStreamImage = async (event, url) => {
  try {
    const response = await $fetch(url, {
      method: 'GET',
      responseType: 'stream',
      timeout: 5000, // 5 seconds timeout
    });
    return sendStream(event, response, 'image/jpeg');
  } catch (fetchError) {
    console.error(`Failed to fetch image from ${url}:`, fetchError.message);
    throw fetchError;
  }
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (!query.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing haiku ID in query',
    });
  }

  // Get the base URL from the request
  const baseUrl = `${event.node.req.headers['x-forwarded-proto'] || 'http'}://${event.node.req.headers.host}`;

  try {
    const haiku = decompressHaiku(query.id);
    console.log('Image query:', `${haiku.topic}    ${haiku.firstLine}    ${haiku.secondLine}    ${haiku.thirdLine}`);

    const ImageProvider = getImageProvider(query.provider);
    let imageData;

    try {
      imageData = await ImageProvider.getImage(haiku, event.context.cloudflare.env);
    } catch (imageProviderError) {
      console.error('Failed to fetch image:', imageProviderError.message);
      imageData = await getImageProvider('default').getImage(baseUrl, event.context.cloudflare.env);
    }

    // Revert cache headers to allow caching for 1 day
    event.node.res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day

    if (imageData.type === 'url') {
      return await fetchAndStreamImage(event, imageData.data);
    } else if (imageData.type === 'base64') {
      const buffer = Buffer.from(imageData.data, 'base64');
      event.node.res.setHeader('Content-Type', 'image/jpeg');
      event.node.res.setHeader('Content-Length', buffer.length);
      return buffer;
    } else {
      throw new Error('Invalid image data type');
    }
  } catch (error) {
    console.error('Unexpected error:', error.message);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching haiku image',
      message: error.message,
    });
  }
});