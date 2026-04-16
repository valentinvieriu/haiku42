export const LEXICA_MODELS = Object.freeze({
  APERTURE_V3_5: 'lexica-aperture-v3.5',
});

export default class LexicaProvider {
  static providerName = 'lexica';
  static models = Object.values(LEXICA_MODELS);

  constructor(env, model = LEXICA_MODELS.APERTURE_V3_5) {
    this.env = env;
    this.model = model;
  }

  async getImage(haiku, width, height) {
    const searchText = `${haiku.topic}    ${haiku.firstLine}    ${haiku.secondLine}    ${haiku.thirdLine}`;

    const lexicaInit = {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        text: searchText,
        source: 'search',
        cursor: 0,
        model: this.model,
        searchMode: 'images',
      }),
      timeout: 1000,
    };

    try {
      const responseData = await $fetch('https://lexica.art/api/infinite-prompts', lexicaInit);

      const imageId = responseData?.images?.[0]?.id;
      if (imageId) {
        console.log('[LexicaProvider] Image ID obtained:', imageId);
        return {
          type: 'url',
          data: `https://image.lexica.art/full_jpg/${imageId}`,
        };
      } else {
        throw new Error('No images found in Lexica response');
      }
    } catch (error) {
      console.error('[LexicaProvider] Failed to call Lexica API:', error.message);
      throw new Error('Failed to call Lexica API: ' + error.message);
    }
  }
}
