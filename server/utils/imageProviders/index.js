import LexicaProvider from './LexicaProvider';
import DefaultProvider from './DefaultProvider';
import TogetherProvider from './TogetherProvider';
import TogetherFreeProvider from './TogetherFreeProvider';
import CloudflareAIProvider from './CloudflareAIProvider';
import FluxRedCinemaProvider from './FluxRedCinemaProvider';
import FluxSchnellProvider from './FluxSchnellProvider';

export function getImageProvider(provider = 'cloudflare') {
  switch (provider.toLowerCase()) {
    case 'lexica':
      return LexicaProvider;
    case 'default':
      return DefaultProvider;
    case 'together':
      return TogetherProvider;
    case 'together-free':
      return TogetherFreeProvider;
    case 'flux-red-cinema':
      return FluxRedCinemaProvider;
    case 'flux-schnell':
      return FluxSchnellProvider;
    case 'cloudflare':
    default:
      return CloudflareAIProvider;
  }
}
