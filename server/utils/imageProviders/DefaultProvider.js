export default class DefaultProvider {
  static async getImage(width = 960, height = 1440) {
    return {
      type: 'url',
      data: `https://haiku42.net/default-background.jpg`
    };
    // Note: The default image URL doesn't change based on dimensions
  }
}