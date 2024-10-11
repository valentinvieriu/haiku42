export default class LexicaProvider {
  static async getImage(haiku, topic, width, height) {
    const textResponse = `${topic}    ${haiku.firstLine}    ${haiku.secondLine}    ${haiku.thirdLine}`;
    
    const lexicaInit = {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        text: textResponse,
        source: 'search',
        cursor: 0,
        model: 'lexica-aperture-v3.5',
        searchMode: 'images',
      }),
      timeout: 1000, // 1 second timeout
    };

    try {
      const responseData = await $fetch('https://lexica.art/api/infinite-prompts', lexicaInit);

      const imageId = responseData?.images?.[0]?.id ?? 'default-image-id';
      if (imageId !== 'default-image-id') {
        console.log('Image ID obtained:', imageId);
        return {
          type: 'url',
          data: `https://image.lexica.art/full_jpg/${imageId}`
        };
      } else {
        throw new Error('No images found in Lexica response');
      }
    } catch (error) {
      console.error('Failed to call Lexica API:', error.message);
      throw new Error('Failed to call Lexica API: ' + error.message);
    }
  }
}