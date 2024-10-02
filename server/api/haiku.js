import { generateHaiku } from '../utils/haikuGenerator';
import { fetchLexicaImage } from '../utils/lexica';
import { compressHaiku, decompressHaiku } from '../utils/compression';

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { cloudflare } = event.context
  
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
        message: 'The haiku data could not be processed.'
      });
    }
  }

  try {
    const haiku = await generateHaiku(cloudflare.env, query)
    
    // Compress the haiku data
    const haikuId = compressHaiku(haiku);
    
    console.log('Generated haikuId:', haikuId);
    
    // Fetch imageId
    const imageId = await fetchLexicaImage(haiku);
    const imageUrl = `https://image.lexica.art/full_jpg/${imageId}`;

    // Set cache headers
    event.node.res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day

    // Return haiku with id and imageUrl
    return { ...haiku, id: haikuId, imageUrl };
  } catch (error) {
    console.error('Error generating haiku:', error)
    return {
      firstLine: "Error occurred but",
      secondLine: "Poetry perseveres through",
      thirdLine: "Technical troubles"
    }
  }
})