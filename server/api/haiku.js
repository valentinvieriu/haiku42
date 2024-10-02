import { generateHaiku } from '../utils/haikuGenerator';
import pako from 'pako';
import { fetchLexicaImage } from '../utils/lexica';

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { cloudflare } = event.context
  
  if (event.node.req.method === 'GET' && query.id) {
    try {
      // Decode the base64 URL-safe string
      const base64 = query.id.replace(/-/g, '+').replace(/_/g, '/').padEnd(query.id.length + (4 - query.id.length % 4) % 4, '=');
      const compressed = Buffer.from(base64, 'base64');
      
      // Attempt to decompress the data
      let decompressed;
      try {
        decompressed = pako.inflate(compressed, { to: 'string' });
      } catch (inflateError) {
        console.error('Pako inflation error:', inflateError);
        // If inflation fails, try decoding as UTF-8 without decompression
        decompressed = new TextDecoder().decode(compressed);
      }
      
      console.log('Decompressed data:', decompressed);

      // Parse the JSON
      let haiku;
      try {
        haiku = JSON.parse(decompressed);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid haiku data',
          message: 'The haiku data is not in the correct JSON format.'
        });
      }
      
      // Fetch imageId
      const imageId = await fetchLexicaImage(haiku);
      const imageUrl = `https://image.lexica.art/full_jpg/${imageId}`;

      // Set cache headers
      event.node.res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day

      // Return haiku with imageUrl
      return { ...haiku, imageUrl };
    } catch (error) {
      console.error('Error processing haiku ID:', error);
      
      // Provide more specific error messages
      if (error.statusCode === 400) {
        throw error; // Re-throw the custom error we created
      } else {
        throw createError({
          statusCode: 500,
          statusMessage: 'Internal Server Error',
          message: 'An unexpected error occurred while processing the haiku ID.'
        });
      }
    }
  }

  try {
    const haiku = await generateHaiku(cloudflare.env, query)
    
    // Compress the haiku data
    const haikuString = JSON.stringify(haiku);
    console.log('Original haiku string:', haikuString);
    
    const compressed = pako.deflate(haikuString);
    const haikuId = Buffer.from(compressed).toString('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    
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