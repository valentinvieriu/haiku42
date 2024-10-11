export default class DefaultProvider {
  static async getImage() {
    return {
      type: 'url',
      data: `https://haiku42.net/default-background.jpg`
    };
  }
}