export const STATIC_PRESETS = Object.freeze({
  DEFAULT: 'default-background',
});

export default class StaticProvider {
  static providerName = 'static';
  static models = Object.values(STATIC_PRESETS);

  constructor(env, model = STATIC_PRESETS.DEFAULT) {
    this.env = env;
    this.model = model;
  }

  async getImage(haiku, width, height) {
    return {
      type: 'url',
      data: 'https://haiku42.net/default-background.jpg',
    };
  }
}
