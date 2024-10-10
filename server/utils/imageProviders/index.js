import LexicaProvider from './LexicaProvider';
import DefaultProvider from './DefaultProvider';
import TogetherProvider from './TogetherProvider';

export function getImageProvider(provider = 'together') {
  switch (provider.toLowerCase()) {
    case 'lexica':
      return LexicaProvider;
    case 'default':
      return DefaultProvider;
    case 'together':
    default:
      return TogetherProvider;
  }
}