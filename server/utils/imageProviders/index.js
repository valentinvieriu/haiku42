import LexicaProvider from './LexicaProvider';
import DefaultProvider from './DefaultProvider';
import TogetherProvider from './TogetherProvider';
import TogetherFreeProvider from './TogetherFreeProvider';
import CloudflareAIProvider from './CloudflareAIProvider';
import FluxRedCinemaProvider from './FluxRedCinemaProvider';
import FluxSchnellProvider from './FluxSchnellProvider';
import FluxProProvider from './FluxProProvider';
import GoogleImagen3Provider from './GoogleImagen3Provider';
import OllamaImageProvider from './OllamaImageProvider';

export function getImageProvider(provider = 'cloudflare') {
  switch (provider.toLowerCase()) {
    case 'ollama':
      return OllamaImageProvider;
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
    case 'flux-pro':
      return FluxProProvider;
    case 'flux-schnell':
      return FluxSchnellProvider;
    case 'google-imagen':
      return GoogleImagen3Provider;
    case 'cloudflare':
    default:
      return CloudflareAIProvider;
  }
}
