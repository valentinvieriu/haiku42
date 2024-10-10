import LexicaProvider from './LexicaProvider';
import DefaultProvider from './DefaultProvider';
import TogetherProvider from './TogetherProvider';

export function getImageProvider(provider = 'together', env) {
  switch (provider.toLowerCase()) {
    case 'lexica':
      return new LexicaProvider();
    case 'default':
      return new DefaultProvider();
    case 'together':
    default:
      return new TogetherProvider(env);
  }
}