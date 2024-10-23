import LexicaProvider from './LexicaProvider';
import DefaultProvider from './DefaultProvider';
import TogetherProvider from './TogetherProvider';
import CloudflareAIProvider from './CloudflareAIProvider';
import FluxRedCinemaProvider from './FluxRedCinemaProvider';

export function getImageProvider(provider = 'cloudflare') {
  switch (provider.toLowerCase()) {
    case 'lexica':
      return LexicaProvider;
    case 'default':
      return DefaultProvider;
    case 'together':
      return TogetherProvider;
    case 'flux-red-cinema':
      return FluxRedCinemaProvider;
    case 'cloudflare':
    default:
      return CloudflareAIProvider;
  }
}
