export default class DefaultProvider {
  static async getImage(baseUrl) {
    return {
      type: 'url',
      data: `${baseUrl}/default-background.jpg`
    };
  }
}