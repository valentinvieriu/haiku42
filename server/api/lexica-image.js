import { fetchLexicaImage } from '../utils/lexica';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const haikuText = query.haiku;

  if (!haikuText) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing haiku parameter'
    });
  }

  try {
    const imageId = await fetchLexicaImage(JSON.parse(haikuText));
    return { imageId };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching Lexica image',
      message: error.message
    });
  }
});
