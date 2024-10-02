import { fetchLexicaImage } from '../utils/lexica';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body || !body.haiku) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing haiku in request body'
    });
  }

  try {
    const imageId = await fetchLexicaImage(body.haiku);
    return { imageId };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching Lexica image',
      message: error.message
    });
  }
});